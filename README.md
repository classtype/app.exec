## Что это?

**App.exec** — это [npm-пакет](https://www.npmjs.com/package/app.exec) с помощью которого
вы можете быстро выполнить список консольных команд.

## Установка

```
$ npm i app.exec
```

## Подключение

```js
const Exec = require('app.exec');
```

## Быстрый старт

```js
Exec([
    ['command1'],
    ['command2', '--arg1', '--arg2']
], true);
```

Результат всех команд будет выведен сразу в консоль.

#### Пример #1

```js
const Exec = require('app.exec');
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
```

## Использование как Promise

```js
let result = await Exec([
    ['command1'],
    ['command2', '--arg1', '--arg2']
]);
console.log(result);
```

Результат всех команд будет передан в переменную ```result```

#### Пример #2

```js
const Exec = require('app.exec');
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
```

## Использование как Callback

```js
new Exec([
    ['command1'],
    ['command2', '--arg1', '--arg2']
])
.onEnd((result) => {
    console.log(result);
});
```

Колбэк ```onEnd``` будет выполнен после всех команд,
а результат передан в переменную ```result```

#### Пример #3

```js
const Exec = require('app.exec');
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
```

## Как обработать каждую команду?

```js
new Exec([
    ['command1'],
    ['command2', '--arg1', '--arg2']
])
.onCommand((commandResult) => {
    process.stdout.write(commandResult);
});
```

Колбэк ```onCommand``` будет выполняться после каждой команды,
а результат передан в переменную ```commandResult```

#### Пример #4

```js
const Exec = require('app.exec');
new Exec([
    ['ls'],
    ['ls', '-la']
])
.onCommand((commandResult) => {
    console.log(commandResult);
    //=> Старт: "ls"
    //=> exec.js
    //=> README.md
});
```

## Как получить промежуточный результат?

```js
let exec = new Exec([
    ['command1'],
    ['command2', '--arg1', '--arg2']
]);

setTimeout(() => {
    console.log(exec.logs);
}, 2000);
```

Вы также в любой момент можете получить промежуточный результат через ```exec.logs```

#### Пример #5

```js
const Exec = require('app.exec');
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
```