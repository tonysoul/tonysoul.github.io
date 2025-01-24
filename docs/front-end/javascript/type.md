# javascript-type

我们知道 JavaScript 中的基本类型和对象类型

## 七种基本类型：

- undefined
- null
- string
- boolean
- number
- bigInt
- symbol

对象类型：

- object

既然有这么些类型，我们如何判断它呢？有如下几种方式：

- typeof 基本类型判断，除了 null
- instanceof 判断一个对象是否是构建函数的实例
- Object.prototype.toString.call 基本类型和对象类型都可

## typeof

用于基本类型的判断，但是对于 null 类型判断不准确，显示为 object

```javascript
let un;
let nu = null;
let str = "hello world";
let bool = true;
let num = 123;
let bint = 9007199254740991n;
let symbol1 = Symbol();

console.log(un, "=>", typeof un);
console.log(nu, "=>", typeof nu); // null判断不准确，显示为object
console.log(str, "=>", typeof str);
console.log(bool, "=>", typeof bool);
console.log(num, "=>", typeof num);
console.log(bint, "=>", typeof bint);
console.log(symbol1, "=>", typeof symbol1);
```

## instanceof

判断是否是构建函数的实例，用于对象类型

```javascript
const Person = function () {};
let p = new Person();
console.log("p instanceof Person", "=>", p instanceof Person); // true
```

## Object.prototype.toString.call

基本类型和对象类型（函数，对象）都可以判断

```javascript
let un;
let nu = null;
let str = "hello world";
let bool = true;
let num = 123;
let bint = 9007199254740991n;
let symbol1 = Symbol();
const Person = function () {};

console.log(un, "=>", Object.prototype.toString.call(un));
console.log(nu, "=>", Object.prototype.toString.call(nu));
console.log(str, "=>", Object.prototype.toString.call(str));
console.log(bool, "=>", Object.prototype.toString.call(bool));
console.log(num, "=>", Object.prototype.toString.call(num));
console.log(bint, "=>", Object.prototype.toString.call(bint));
console.log(symbol1, "=>", Object.prototype.toString.call(symbol1));
console.log(Person, "=>", Object.prototype.toString.call(Person));
console.log({}, "=>", Object.prototype.toString.call({}));
```
