# ESLint

ESLint 是在 ECMAScript/JavaScript 代码中识别和报告模式匹配的工具，它的目标是保证代码的一致性和避免错误

## 为什么要用 ESLint

不管作为个人开发，还是团队开发，我们都要保证代码的一致性和避免错误，ESLint 就是干这个的

尤其是团队开发，每个人的代码书写风格不一致，更容易导致混乱，既然都工程化了，就是要使用合适的工具来帮助我们提高效率

## 初始化项目

```bash
mkdir project1
cd project1
npm init -y
```

## 安装依赖

```bash
npm i eslint -D
```

## 配置文件

根目录新建 `.eslintrc.json`，这里我们使用 eslint 推荐的规则

```json
{
  "extends": "eslint:recommended",
  "env": {
    "browser": true // 指定项目所运行的环境
  },
  "parserOptions": {
    "ecmaVersion": 6, // 指定解析器，解析es6的代码
    "sourceType": "module" // 支持es6 module
  },
  "rules": {
    "quotes": ["error", "single"] // 强制单引号
  }
}
```

## 写 JS 代码

`src/index.js`

```js
const message = "hello world";
console.log(message);
```

## 运行脚本

`package.json`

```json
"scripts": {
  "lint": "eslint ./src/**/*.js",
  "lint:init": "eslint --init", // 通过命令行来生成.eslintrc文件
  "lint:fix": "eslint ./src/**/*.js --fix",
}
```

```bash
# 检查错误
npm run lint
# 自动修复错误
npm run lint:fix
```

其中 `npm run lint:init` 可以通过命令行来生成.eslintrc 文件，我们只需要选择相应的选项就生成对应的配置文件

那么问题来了，我们团队有很多的代码规范需要定制，难道全部要手写？

## eslint-config-alloy

我们可以参考成熟的团队所定制的规范，基于这个之上，再来修改我们的规范

### 设计理念

- 样式相关的规则交给 Prettier 管理
- 传承 ESLint 的理念，帮助大家建立自己的规则
- 高度的自动化：先进的规则管理，测试即文档即网站
- 与时俱进，第一时间跟进最新的规则

### 使用方法

内置规则

```bash
npm install --save-dev eslint @babel/core @babel/eslint-parser eslint-config-alloy
```

.eslintrc.js

```js
module.exports = {
  extends: ["alloy"],
  env: {
    // 你的环境变量（包含多个预定义的全局变量）
    //
    // browser: true,
    // node: true,
    // mocha: true,
    // jest: true,
    // jquery: true
  },
  globals: {
    // 你的全局变量（设置为 false 表示它不允许被重新赋值）
    //
    // myGlobal: false
  },
  rules: {
    // 自定义你的规则
  },
};
```

就这样简单，配合 `Prettier`使用效果更佳
`.prettierrc.js`

```js
// .prettierrc.js
module.exports = {
  // 一行最多 120 字符
  printWidth: 120,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用缩进符，而使用空格
  useTabs: false,
  // 行尾需要有分号
  semi: true,
  // 使用单引号
  singleQuote: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: "as-needed",
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 末尾需要有逗号
  trailingComma: "all",
  // 大括号内的首尾需要空格
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  bracketSameLine: false,
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: "always",
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: "preserve",
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: "css",
  // vue 文件中的 script 和 style 内不用缩进
  vueIndentScriptAndStyle: false,
  // 换行符使用 lf
  endOfLine: "lf",
  // 格式化嵌入的内容
  embeddedLanguageFormatting: "auto",
  // html, vue, jsx 中每个属性占一行
  singleAttributePerLine: false,
};
```

## 参考资料

- <a href="https://eslint.bootcss.com/docs/user-guide/getting-started" target="_blank">ESLint</a>
- <a href="https://github.com/AlloyTeam/eslint-config-alloy" target="_blank">eslint-config-alloy</a>
- <a href="https://gitee.com/hackTony/fed-engineering/tree/master/eslint" target="_blank">demo</a>
