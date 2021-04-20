//--------------------------------------------------------------------------------------------------

const spawn = require('child_process').spawn;
const colors = require('colors/safe');
const async = require('async');

/*--------------------------------------------------------------------------------------------------
|
| -> Конструктор
|
|-------------------------------------------------------------------------------------------------*/

const Exec = function(commands = [], onConsole) {
// Вызов через await
    if (!(this instanceof Exec)) {
        return new Promise((resolve) => {
            new Exec(commands, onConsole).onEnd((result) => {
                resolve(result);
            });
        });
    }
    
// Вызов через new
    Promise.resolve().then(() => {
        this._onConsole = (onConsole == true ? true : false);
        this._logs = [];
        
        let array = [];
        
        for (let i = 0; i < commands.length; i++) {
            array[i] = ((command) => {
                return (callback) => {
                    this.exec(command, callback);
                };
            })(commands[i]);
        }
        
        async.waterfall(array, (code) => {
            if (typeof this._onEnd == 'function') {
                this._onEnd(this.logs, code);
            }
        });
    });
};

/*--------------------------------------------------------------------------------------------------
|
| -> Свойства
|
|-------------------------------------------------------------------------------------------------*/

Object.defineProperty(Exec.prototype, 'logs', {get: function() {
    return this._logs.join('');
}});

/*--------------------------------------------------------------------------------------------------
|
| -> События
|
|-------------------------------------------------------------------------------------------------*/

Exec.prototype.onCommand = function(callback) {
    this._onCommand = callback;
    return this;
}
Exec.prototype.onEnd = function(callback) {
    this._onEnd = callback;
    return this;
}

/*--------------------------------------------------------------------------------------------------
|
| -> Выполняет команду
|
|-------------------------------------------------------------------------------------------------*/

Exec.prototype.exec = function(args, callback) {
    let line = '';
    
    for (let i = 0; i < args.length; i++) {
        line += (i != 0 ? ' ' : '') + args[i];
    }
    
// Команда
    this.add('good', colors.bgCyan('Старт: "'+line+'"'));
    
// Init
    let ch = spawn(args.shift(), args);
    
// Error
    ch.on('error', (error) => {
        this.add('error', colors.bgRed('Ошибка: "'+error+'"'));
    });
    
// StdErr
    ch.stderr.on('data', (data) => {
        this.add('stderr', colors['red'](data.toString()));
    });
    
// StdOut
    ch.stdout.on('data', (data) => {
        this.add('stdout', colors['green'](data.toString()));
    });
    
// Close
    ch.on('close', (code) => {
        callback(code);
    });
};

/*--------------------------------------------------------------------------------------------------
|
| -> Добавляет результат в лог
|
|-------------------------------------------------------------------------------------------------*/

Exec.prototype.add = function(status, result) {
// Вывод в консоль
    if (this._onConsole) {
        process.stdout.write(result+'\n');
    }
    
// Общий лог
    this._logs.push(result+'\n');
    
// События
    if (typeof this._onCommand == 'function') {
        this._onCommand(result);
    }
};

//--------------------------------------------------------------------------------------------------

module.exports = Exec;

//--------------------------------------------------------------------------------------------------