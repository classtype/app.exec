//--------------------------------------------------------------------------------------------------

const spawn = require('child_process').spawn;
const colors = require('colors/safe');
const async = require('async');

/*--------------------------------------------------------------------------------------------------
|
| -> Конструктор
|
|-------------------------------------------------------------------------------------------------*/

const Exec = function(commands = [], isLogToConsole = false, commandLimit = 20) {
// Вызов через await
    if (!(this instanceof Exec)) {
        return new Promise((resolve) => {
            new Exec(commands, isLogToConsole).onEnd((result) => {
                resolve(result);
            });
        });
    }
    
// Вызов через new
    Promise.resolve().then(() => {
        this.isLogToConsole = isLogToConsole;
        this.commandLimit = commandLimit;
        this._logs = [];
        
        let commandCallback = [];
        
        for (let i = 0; i < commands.length; i++) {
            commandCallback[i] = ((command) => {
                return (callback) => {
                    this.exec(command, callback);
                };
            })(commands[i]);
        }
        
        async.waterfall(commandCallback, (code) => {
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
    this.add('bgCyan', 'Старт: "'+line+'"\n');
    
// Init
    let ch = spawn(args.shift(), args);
    
// Error
    ch.on('error', (error) => {
        this.add('bgRed', 'Ошибка: "'+error+'"\n');
    });
    
// StdErr
    ch.stderr.on('data', (data) => {
        this.add('red', data.toString());
    });
    
// StdOut
    ch.stdout.on('data', (data) => {
        this.add('green', data.toString())
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

Exec.prototype.add = function(color, result) {
// Вывод в консоль
    if (this.isLogToConsole) {
        process.stdout.write(colors[color](result));
    }
    
// Добавляем результат в общий лог
    this._logs.push(result);
    
// Удаляем старые логи
    if (this.commandLimit != 0 && this._logs.length > this.commandLimit) {
        this._logs.splice(0, 1);
    }
    
// События
    if (typeof this._onCommand == 'function') {
        this._onCommand(result);
    }
};

//--------------------------------------------------------------------------------------------------

module.exports = Exec;

//--------------------------------------------------------------------------------------------------