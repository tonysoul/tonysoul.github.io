---
tags:
  - css架构
---

# BEM

## BEM 是什么？

BEM —— Block Element Modifier

我们来看看官方的说明：BEM 是一个方法（或者说是一种规范）,帮助您创建可重用组件和代码共享

它的优点是什么？

- 简单
- 模块化
- 弹性

通俗的话讲就是一种 css 的命名规范，我们来看个例子

## 例子-轮播图

这是我们原来的常规写法

```html
<div class="slider">
  <ul>
    <li class="item selected">1</li>
    <li class="item">2</li>
    <li class="item">3</li>
  </ul>
  <a class="next"></a>
  <a class="previous"></a>
  <div class="control">
    <span class="buttons selected"></span>
    <span class="buttons"></span>
    <span class="buttons"></span>
    <span class="buttons"></span>
  </div>
</div>
```

```css
.slider {
}
.slider .item {
}
.slider .item.selected {
}
.slider .next {
}
.slider .previous {
}
.slider .control {
}
.slider .buttons {
}
.slider .buttons.selected {
}
```

BEM 的写法

```html
<div class="slider">
  <ul>
    <li class="slider__item slider__item--selected">1</li>
    <li class="slider__item">2</li>
    <li class="slider__item">3</li>
  </ul>
  <a class="slider__next"></a>
  <a class="slider__previous"></a>
  <div class="slider__control">
    <span class="slider__buttons slider__buttons--selected"></span>
    <span class="slider__buttons"></span>
    <span class="slider__buttons"></span>
    <span class="slider__buttons"></span>
  </div>
</div>
```

```css
.slider {
}
.slider__item {
}
.slider__item--selected {
}
.slider__next {
}
.slider__previous {
}
.slider__control {
}
.slider__buttons {
}
.slider__buttons--selected {
}
```

一眼看去，花里胡哨的，`.slider__item` `.slider__item--selected`

且慢，我们来介绍一下它的含义

## BEM 的基本规则

BEM —— Block（块） Element（元素） Modifier（修饰符）

### Block

（有意义的独立实体。）

所谓 block，就是指块，可以理解为一个模块，`.slider`就是一个模块

### Element

（一个一块的一部分,没有独立的意义和语义相关的块。）

元素就是指在这个模块下的元素，所以我们需要加上`__`表示属于哪个模块的 element

`.slider__item`就表示 slider 模块下的 item 元素

### Modifier

（块或元素上的标志。使用它们来改变外观或行为。）

修饰符，来表示某种状态或者行为

`.slider__item--selected`就是修饰器，来表示被选中的状态，这里使用了`--`来连接

> 注意：如果有多个单词，可以使用`-`来连接 `button--state-success`

这就是 BEM 的全部，简单

但是你要说，这样写样式也太麻烦了吧，各种`__`,`--`，别怕最后我们用 SCSS 来改写刚才的列子

## SCSS

BEM 规范来写

```scss
.slider {
  &__item {
    &--selected {
    }
  }

  &__next {
  }
  &__previous {
  }
  &__control {
  }
  &__buttons {
    &--selected {
    }
  }
}
```

那么最后的问题，我为什么要用 BEM？

这也是它的优点

- 让 css 保持相对简单，只用一个 class 就能定位对应的元素，优先级也相对扁平，不容易起冲突
- 有清晰的层级关系，模块化，让阅读代码更加方便

## 参考资料

- <a href="https://getbem.com/" target="_blank">https://getbem.com/</a>
