# 深拷贝

## 什么是浅拷贝，深拷贝

浅拷贝：

- 如果是基本类型，直接把值拷贝过来
- 如果是对象类型，拷贝的是它的地址引用

如果修改原来的对象类型，也会影响到拷贝后的值

深拷贝：

- 如果是基本类型，直接把值拷贝过来
- 如果是对象类型，新建立一块内存用来存放，与之前的对象在不同的内存地址，没有引用关系

  修改原来的对象类型，和现在拷贝后的没有关联，不会影响

## 浅拷贝

实现浅拷贝的几种方式：

`Object.assign`

```js
const a = { age: 11, name: "tony", person: { a: 99 } };
const b = Object.assign({}, a);

a.person.a = 1000;
console.log(a.person.a);
console.log(b.person.a); // 修改a.person.a的值，b上的也发生了改变
```

...

```js
const a = { age: 11, name: "tony", person: { a: 99 } };
const b = { ...a };
```

## 深拷贝

### v1 基础版

实际上，相当于浅拷贝，只是遍历一个对象类型，赋值到一个新的对象上，还存在着引用

```js
function clone(target) {
  let cloneTarget = {};

  for (const key in target) {
    cloneTarget[key] = target[key];
  }

  return cloneTarget;
}
```

### v2 判断类型

我们赋值的时候，需要判断是基本类型还是对象类型

```js
// 基本类型的字符串标识
const stringTag = "[object String]",
  numberTag = "[object Number]",
  bigIntTag = "[object BigInt]",
  booleanTag = "[object Boolean]",
  symbolTag = "[object Symbol]",
  nullTag = "[object Null]",
  undefinedTag = "[object Undefined]";

// 对象类型字符串标识
const arrayTag = "[object Array]",
  objectTag = "[object Object]";

// 所有的基本类型
const basicTypes = [
  stringTag,
  numberTag,
  bigIntTag,
  booleanTag,
  symbolTag,
  nullTag,
  undefinedTag,
];

// 类型判断，能够准确的判断所有类型，不管是基本类型，对象类型，还是null
/**
 *
 * @param {*} arg
 * @returns [object String]
 */
function getType(arg) {
  return Object.prototype.toString.call(arg);
}

// 判断是否为基本类型
function isBasicType(arg) {
  return basicTypes.includes(getType(arg));
}
```

`clone`

```js
function clone(target) {
  // 如果是基本类型就直接返回值
  if (isBasicType(target)) {
    return target;
  }

  // 初始化对象类型，根据类型判断是array，还是object
  let cloneTarget;
  let type = getType(target);

  if (type === arrayTag) {
    cloneTarget = [];
  } else if (type === objectTag) {
    cloneTarget = {};
  }

  for (const key in target) {
    // 递归调用
    cloneTarget[key] = clone(target[key]);
  }

  return cloneTarget;
}
```

### v3 防止循环引用

当我们的数据类型有循环引用的时候，会报异常
`RangeError: Maximum call stack size exceeded`

```js
const target = {
  a: 1,
  b: "tony",
  c: 99,
  d: [1, 2, 3],
};
target.target = target;

clone(target);
```

我们使用 `map` 来解决循环引用的问题，当这个`key`，存在于 map 中，就直接返回，否则添加

```js
function clone(target, map = new Map()) {
  // 如果是基本类型就直接返回值
  if (isBasicType(target)) {
    return target;
  }

  // 初始化对象类型，根据类型判断是array，还是object
  let cloneTarget;
  let type = getType(target);

  if (type === arrayTag) {
    cloneTarget = [];
  } else if (type === objectTag) {
    cloneTarget = {};
  }

  // 当前target作为key，是否存在于map中，存在就返回
  if (map.has(target)) {
    return map.get(target);
  }
  // 不存在就设置
  map.set(target, cloneTarget);

  for (const key in target) {
    // 递归调用，注意需要把map传入递归调用中
    cloneTarget[key] = clone(target[key], map);
  }

  return cloneTarget;
}
```

### v4 支持更多的对象类型

我们现在深拷贝，支持所有的基本类型，和一部分对象类型（array, object）

现在来支持更多的类型：`Map`，`Set`

```js
// 添加map，set类型
// 对象类型字符串标识
const arrayTag = "[object Array]",
  objectTag = "[object Object]",
  mapTag = "[object Map]",
  setTag = "[object Set]";
// ...
```

```js
function clone(target, map = new Map()) {
  // 如果是基本类型就直接返回值
  if (isBasicType(target)) {
    return target;
  }

  // 初始化对象类型，根据类型判断是array，还是object
  let cloneTarget;
  let type = getType(target);

  if (type === arrayTag) {
    cloneTarget = [];
  } else if (type === objectTag) {
    cloneTarget = {};
  } else if (type === mapTag) {
    // 如果是map类型
    cloneTarget = new Map();

    // 遍历map，并重新赋值给新的map
    target.forEach((value, key) => {
      cloneTarget.set(key, clone(value));
    });

    return cloneTarget;
  } else if (type === setTag) {
    // 如果是set类型
    const cloneTarget = new Set();

    // 遍历set，并重新赋值给新的set
    target.forEach((value) => {
      cloneTarget.add(clone(value));
    });

    return cloneTarget;
  } else {
    console.log(`can't handller this ( ${target} ) of type ( ${type} )`);
    return;
  }

  // 当前target作为key，是否存在于map中，存在就返回
  if (map.has(target)) {
    return map.get(target);
  }
  // 不存在就设置
  map.set(target, cloneTarget);

  for (const key in target) {
    // 递归调用，注意需要把map传入递归调用中
    cloneTarget[key] = clone(target[key], map);
  }

  return cloneTarget;
}
```

### 优化

我们现在已经基本实现了深拷贝，但是还有一些类型是不支持的，比如`function`,`Date`...

由于这些类型用得不多，所以基本上够用。我们的代码还可以继续优化：

- 使用`WeakMap`代替`Map`
- 使用原生的 for 循环或者 while 循环，性能更高

为什么要用`WeakMap`代替`Map`呢？

`WeakMap`的键是弱引用，弱引用是可以被垃圾回收的

```js

function clone(target, map = new WeakMap()) { // ... }
```

使用更快的循环:

`for in`循环的效率比较低，我们想办法把它替换成 `for` 或者 `while`

```js
function forEach(array, iterable) {
  const length = array.length;
  let index = -1;

  while (++index < length) {
    iterable(array[index], index);
  }

  return array;
}
```

```js
// ...

// 使用效率更高的循环来代替 for in
// 如果是对象，我们需要把它的key来作为数组
let keys = type === arrayTag ? undefined : Object.keys(target);
forEach(keys || target, (value, key) => {
  if (keys) {
    // 如果是对象类型，需要转换它的key
    key = value;
  }
  cloneTarget[key] = clone(target[key], map);
});
// for (const key in target) {
//   // 递归调用，注意需要把map传入递归调用中
//   cloneTarget[key] = clone(target[key], map);
// }

return cloneTarget;
```

## 完整代码

::: details
<<< @/front-end/javascript/code/deepClone.js
:::

## demo

- <a href="https://jsbin.com/dokifof/1/edit?js,console" target="_blank">demo</a>
