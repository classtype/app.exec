//--------------------------------------------------------------------------------------------------

const Exec = require('../src/app.exec');

/*--------------------------------------------------------------------------------------------------
|
| -> Пример #1 — Быстрый старт
| -> Результат всех команд будет выведен сразу в консоль.
|
|-------------------------------------------------------------------------------------------------*/

Exec([
    ['ls'],
    ['ls', '-la']
], true);
//=> Старт: "ls"
//=> exec.js
//=> README.md
//=> 
//=> Старт: "ls -la"
//=> итого 60
//=> -rw-r--r--  1 root root 4768 апр 20 01:06 exec.js
//=> -rw-r--r--  1 root root  977 апр 20 00:22 README.md

/*--------------------------------------------------------------------------------------------------
|
| -> Пример #2 — Использование как Promise
| -> Результат всех команд будет передан в переменную "result".
|
|-------------------------------------------------------------------------------------------------*/

(async () => {
    let result = await Exec([
        ['ls'],
        ['ls', '-la']
    ]);
    console.log(result);
    //=> Старт: "ls"
    //=> exec.js
    //=> README.md
    //=> 
    //=> Старт: "ls -la"
    //=> итого 60
    //=> -rw-r--r--  1 root root 4768 апр 20 01:06 exec.js
    //=> -rw-r--r--  1 root root  977 апр 20 00:22 README.md
})();

/*--------------------------------------------------------------------------------------------------
|
| -> Пример #3 — Использование как Callback
| -> Колбэк "onEnd" будет выполнен после всех команд,
| -> а результат передан в переменную "result".
|
|-------------------------------------------------------------------------------------------------*/

new Exec([
    ['ls'],
    ['ls', '-la']
])
.onEnd((result) => {
    console.log(result);
    //=> Старт: "ls"
    //=> exec.js
    //=> README.md
    //=> 
    //=> Старт: "ls -la"
    //=> итого 60
    //=> -rw-r--r--  1 root root 4768 апр 20 01:06 exec.js
    //=> -rw-r--r--  1 root root  977 апр 20 00:22 README.md
});

/*--------------------------------------------------------------------------------------------------
|
| -> Пример #4 — Как обработать каждую команду?
| -> Колбэк "onCommand" будет выполняться после каждой команды,
| -> а результат передан в переменную "commandResult".
|
|-------------------------------------------------------------------------------------------------*/

new Exec([
    ['ls'],
    ['ls', '-la']
])
.onCommand((commandResult) => {
    process.stdout.write(commandResult);
    //=> Старт: "ls"
    //=> exec.js
    //=> README.md
});

/*--------------------------------------------------------------------------------------------------
|
| -> Пример #5 — Как получить промежуточный результат?
| -> Вы также в любой момент можете получить промежуточный результат через "exec.logs".
|
|-------------------------------------------------------------------------------------------------*/

let exec = new Exec([
    ['ls'],
    ['ls', '-la']
]);
setTimeout(() => {
    console.log(exec.logs);
    //=> Старт: "ls"
    //=> exec.js
    //=> README.md
    //=> 
    //=> Старт: "ls -la"
    //=> итого 60
    //=> -rw-r--r--  1 root root 4768 апр 20 01:06 exec.js
    //=> -rw-r--r--  1 root root  977 апр 20 00:22 README.md
}, 2000);

//--------------------------------------------------------------------------------------------------