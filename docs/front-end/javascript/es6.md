# ES6

## var,let,const 区别

var：

- 存在变量提升，变量可以在声明之前使用，值为 undefined
- 在全局作用域声明，会挂载到 window 上

let,const：

- 不存在变量提升，只有声明了才能使用
- 有自己的块级作用域
- 不能重复声明

其中`const`一旦声明后就不能修改

## 原型继承和 class 继承

### 组合继承

```js
function Person(name) {
  this.name = name;
}
// 原型方法
Person.prototype.showName = function () {
  console.log(this.name);
};

// 子类
function Child(name, age) {
  // 调用父类的构造函数，来复用属性
  Person.call(this, name);
  this.age = age;
}
// 继承父类的原型
Child.prototype = new Person();
// 修改Child的constructor
Object.defineProperty(Child.prototype, "constructor", {
  value: Child,
  enumerable: false,
  writable: true,
  configurable: true,
});

// 子类自己的原型方法
Child.prototype.showAge = function () {
  console.log(this.age);
};

const c = new Child("tony", 22);
c.showName();
c.showAge();
console.log(c);
```

组合继承的缺点，调用了两次父类构造函数，继承了父类多余的属性

### 寄生组合继承

```js
function Person(name) {
  this.name = name;
}
Person.prototype.showName = function () {
  console.log(this.name);
};

function Child(name, age) {
  Person.call(this, name);
  this.age = age;
}

Child.prototype = Object.create(Person.prototype, {
  constructor: {
    value: Child,
    enumerable: false,
    writable: true,
    configurable: true,
  },
});

const c = new Child("tony", 22);
console.log(c);
```

寄生组合继承，就解决了组合继承问题，避免了多次调用父类构造函数

## 模块化

### AMD

AMD 的设计明确基于浏览器，异步的，常见的库有 `RequireJS`

### CommonJS

CommonJS 的设计是面向通用 JavaScript 环境（如：Node.js）

### ES6 模块

ES6 模块结合了 CommonJS 与 AMD 的优点，我们用得最多的也是这种方式

- 与 CommonJS 类似，ES6 模块语法相对简单，并且基于文件（每个
  文件就是一个模块）
- 与 AMD 类似，ES6 模块支持异步模块加载

## Proxy

Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写

数据修改时，打印日志

```js
const arr = [1, 2, 3, 4];
const newArr = new Proxy(arr, {
  get(target, prop) {
    return target[prop];
  },
  set(target, prop, value) {
    console.log(`changed ${target[prop]} => ${value}`);
    target[prop] = value;
    return true;
  },
});
```

## map，filter，reduce

`map`返回一个新映射的数组

```js
[1, 2, 3].map((v) => v + 1); // [2,3,4]
```

`filter`返回一个过滤条件为 true 的新数组

```js
[1, 2, 3, 4, 5, 6].filter((f) => f > 4); // [5,6]
```

`reduce`把数组根据条件缩减为一个值

```js
[1, 2, 3, 4, 5].reduce((pre, cur, index, arr) => {
  return pre + cur;
}, 0);
// 15
```

## Map，WeakMap，Object

- Map 的 key 可以接受任意类型
- WeakMap 的 key 只能是对象类型
- object 的 key 只能是字符串或者 symbol

## 资料

- <a href="https://es6.ruanyifeng.com/" target="_blank">ES6 入门教程</a>
