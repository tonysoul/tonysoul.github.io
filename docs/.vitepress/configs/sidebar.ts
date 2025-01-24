import { DefaultTheme } from "vitepress";

export const sidebar: DefaultTheme.Config["sidebar"] = {
  "/essays/": [
    {
      items: [
        { text: "瓦尔登湖", link: "/essays/瓦尔登湖" },
        {
          text: "乔布斯2005斯坦福大学毕业演讲",
          link: "/essays/乔布斯2005斯坦福大学毕业演讲",
        },
        { text: "生命的意义", link: "/essays/生命的意义" },
        {
          text: "生命中最简单而又最困难的事情",
          link: "/essays/生命中最简单而又最困难的事情",
        },
        {
          text: "长期接受碎片化信息，会有什么后果",
          link: "/essays/长期接受碎片化信息，会有什么后果",
        },
      ],
    },
  ],
  "/front-end/": [
    {
      text: "typescript",
      items: [
        {
          text: "基础语法",
          collapsed: true,
          items: [
            { text: "基础类型", link: "/front-end/typescript/basic/1基础类型" },
            {
              text: "类型注解和类型推断",
              link: "/front-end/typescript/basic/2类型注解和类型推断",
            },
            { text: "类型收窄", link: "/front-end/typescript/basic/3类型收窄" },
            {
              text: "复杂函数类型",
              link: "/front-end/typescript/basic/4复杂函数类型",
            },
            { text: "对象类型", link: "/front-end/typescript/basic/5对象类型" },
            {
              text: "泛型-数组-元组",
              link: "/front-end/typescript/basic/6泛型-数组-元组",
            },
            {
              text: "泛型中使用extends和keyof语法",
              link: "/front-end/typescript/basic/7泛型中使用extends和keyof语法",
            },
            { text: "条件类型", link: "/front-end/typescript/basic/8条件类型" },
            { text: "映射类型", link: "/front-end/typescript/basic/9映射类型" },
            {
              text: "类的定义与继承",
              link: "/front-end/typescript/basic/10类的定义与继承",
            },
            {
              text: "类中的访问类型和构造器",
              link: "/front-end/typescript/basic/11类中的访问类型和构造器",
            },
            {
              text: "静态属性-Setter和Getter",
              link: "/front-end/typescript/basic/12静态属性-Setter和Getter",
            },
            { text: "抽象类", link: "/front-end/typescript/basic/13抽象类" },
          ],
        },
        {
          text: "进阶语法",
          collapsed: true,
          items: [
            {
              text: "联合类型和类型保护",
              link: "/front-end/typescript/advanced/1联合类型和类型保护",
            },
            {
              text: "Enum枚举类型",
              link: "/front-end/typescript/advanced/2Enum枚举类型",
            },
            {
              text: "函数泛型",
              link: "/front-end/typescript/advanced/3函数泛型",
            },
            {
              text: "类中的泛型以及泛型类型",
              link: "/front-end/typescript/advanced/4类中的泛型以及泛型类型",
            },
            {
              text: "命名空间-namespace",
              link: "/front-end/typescript/advanced/5命名空间-namespace",
            },
            {
              text: "import对应的模块化",
              link: "/front-end/typescript/advanced/6import对应的模块化",
            },
            {
              text: "使用Parcel打包TS代码",
              link: "/front-end/typescript/advanced/7使用Parcel打包TS代码",
            },
            {
              text: "描述文件中的全局类型",
              link: "/front-end/typescript/advanced/8描述文件中的全局类型",
            },
            {
              text: "模块代码的类型描述文件",
              link: "/front-end/typescript/advanced/9模块代码的类型描述文件",
            },
            {
              text: "泛型中keyof语法的使用",
              link: "/front-end/typescript/advanced/10泛型中keyof语法的使用",
            },
          ],
        },
        {
          text: "高级语法",
          collapsed: true,
          items: [
            {
              text: "类的装饰器",
              link: "/front-end/typescript/highLevel/1类的装饰器",
            },
            {
              text: "方法装饰器",
              link: "/front-end/typescript/highLevel/2方法装饰器",
            },
            {
              text: "访问器的装饰器",
              link: "/front-end/typescript/highLevel/3访问器的装饰器",
            },
            {
              text: "属性的装饰器",
              link: "/front-end/typescript/highLevel/4属性的装饰器",
            },
            {
              text: "参数的装饰器",
              link: "/front-end/typescript/highLevel/5参数的装饰器",
            },
            {
              text: "装饰器的实际使用例子",
              link: "/front-end/typescript/highLevel/6装饰器的实际使用例子",
            },
            {
              text: "reflect-metadata",
              link: "/front-end/typescript/highLevel/7reflect-metadata",
            },
            {
              text: "装饰器的执行顺序",
              link: "/front-end/typescript/highLevel/8装饰器的执行顺序",
            },
          ],
        },
      ],
    },
    {
      text: "javascript",
      items: [
        { text: "this", link: "/front-end/javascript/this" },
        { text: "深克隆", link: "/front-end/javascript/deepClone" },
        { text: "ES6", link: "/front-end/javascript/es6" },
        { text: "节流函数", link: "/front-end/javascript/throttle" },
        { text: "type", link: "/front-end/javascript/type" },
      ],
    },
    {
      text: "css架构",
      items: [{ text: "BEM", link: "/front-end/css-arch/BEM" }],
    },
    {
      text: "工程化",
      items: [{ text: "ESLint", link: "/front-end/engineering/Eslint" }],
    },
    {
      text: "utils",
      items: [{ text: "got", link: "/front-end/utils/got" }],
    },
  ],
  "/back-end/": [
    {
      text: "Express",
      collapsed: true,
      items: [
        { text: "MVC", link: "/back-end/express/00.mvc" },
        { text: "初始化", link: "/back-end/express/01.init" },
        { text: "app", link: "/back-end/express/02.app" },
        { text: "路由", link: "/back-end/express/03.route" },
        { text: "控制器Controller", link: "/back-end/express/04.controller" },
        { text: "异常exception", link: "/back-end/express/05.exception" },
        { text: "数据库database", link: "/back-end/express/06.database" },
        { text: "模型model", link: "/back-end/express/07.model" },
        { text: "服务service", link: "/back-end/express/08.service" },
        { text: "repository", link: "/back-end/express/09.repository" },
        { text: "注册", link: "/back-end/express/10.register" },
        { text: "token", link: "/back-end/express/11.token" },
        { text: "passport", link: "/back-end/express/12.passport" },
        { text: "guard", link: "/back-end/express/13.guard" },
        { text: "owner", link: "/back-end/express/14.owner" },
        { text: "response-dto", link: "/back-end/express/15.response-dto" },
        { text: "validator-pipe", link: "/back-end/express/16.validator-pipe" },
        { text: "pm2", link: "/back-end/express/17.pm2" },
      ],
    },
    {
      text: "NodeJS",
      items: [
        { text: "Bing壁纸抓取", link: "/back-end/nodejs/bingWallpaper" },
        {
          text: "豆瓣电影Top250爬虫",
          link: "/back-end/nodejs/doubanMovieTop250",
        },
      ],
    },
  ],
  "/read/": [
    {
      text: "书单",
      items: [{ text: "2022书单", link: "/read/booklist/01.2022书单" }],
    },
    {
      text: "笔记",
      items: [{ text: "原子习惯", link: "/read/note/原子习惯" }],
    },
  ],
  "/other": [
    {
      text: "para方法",
      link: "/other/para方法",
    },
    {
      text: "如何在win10上安装WSL",
      link: "/other/如何在win10上安装WSL",
    },
  ],
};
