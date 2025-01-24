# javascript this

## JavaScript 中的 this 指向主要有以下几种情况：

1. 直接调用 fn()
2. 对象.fn()
3. new fn()
4. 箭头函数
5. fn.bind()

这些是常常出现的实际代码中的情况，让人们产生了混淆，不知道具体 this 指向了谁，而且这些情况如果一起出现就会有优先级的情况

1. new 最高
2. bind 其次
3. obj.fn()
4. fn() 最低

最后，我们也有一些简单方法来判断 this 的指向

我们就来重新认识一下 this 的指向到底指向了谁

## 1.直接调用 fn()

```javascript
function fn() {
  console.log(this);
}

// 1.直接调用函数，始终指向window
fn(); // this -> window
```

## 2.对象.fn()

```javascript
let obj = {
  a: 11,
  fn() {
    console.log(this);
  },
};

// 2.obj.fn()调用对象方法，对象谁调用了fn，this就是谁
obj.fn(); // this -> 指向obj对象 {a:11, fn: f}
```

## 3.new fn()

```javascript
function fn() {
  console.log(this);
}

// 3.new
let c = new fn(); // this被绑定到了 c 上，不会被改变
```

## 4.箭头函数

箭头函数的 this 一旦被绑定就不会改变

```javascript
// 4.箭头函数
function a() {
  return () => {
    return () => {
      console.log(this);
    };
  };
}
a()()(); // window，取决于包裹第一个箭头函数的普通函数的 a的 this是什么
```

## 5.fn.bind()

```javascript
// 5.bind
let abc = {
  a: 100,
};
function fn2() {
  console.log(this);
}
fn2.bind(abc)(); // this -> 指向abc
fn2.bind().bind(abc)(); // this -> window, 多次bind，只看第一次bind的值
```

## this 的优先级

`new`的优先级最高，其次是`bind`，然后是`obj.fn()`，最后是直接调用`fn()`

- new
- bind
- obj.fn()
- fn()

## 简单记忆如何判断 this 指向

![JavaScript-this.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5de3e94020cc49f0b407175bf5dfa0c3~tplv-k3u1fbpfcp-watermark.image?)
