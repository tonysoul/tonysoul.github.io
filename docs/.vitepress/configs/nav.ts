import { DefaultTheme } from "vitepress";

export const nav: DefaultTheme.Config["nav"] = [
  {
    text: "首页",
    link: "/",
  },
  {
    text: "随笔",
    link: "/essays/瓦尔登湖",
    // 🖊
  },
  {
    text: "前端",
    items: [
      { text: "typescript", link: "/front-end/typescript/basic/1基础类型" },
      { text: "javascript", link: "/front-end/javascript/this" },
      { text: "css架构", link: "/front-end/css-arch/BEM" },
      { text: "工程化", link: "/front-end/engineering/Eslint" },
      { text: "utils", link: "/front-end/utils/got" },
    ],
  },
  {
    text: "后端",
    items: [
      { text: "Express", link: "/back-end/express/00.mvc" },
      { text: "NodeJS", link: "/back-end/nodejs/bingWallpaper" },
    ],
  },
  {
    text: "阅读",
    // 📕
    // link: "/read/booklist/01.2022书单",
    items: [
      { text: "书单", link: "/read/booklist/01.2022书单" },
      { text: "笔记", link: "/read/note/原子习惯" },
    ],
  },
  {
    text: "其他",
    link: "/other/para方法",
    // link: "/other/如何在win10上安装WSL",
  },
  // {
  //   text: "音乐",
  //   link: "",
  // },
  // {
  //   text: "电影",
  //   link: "",
  // },
  // {
  //   text: "标签",
  //   link: "/tags",
  // },
  // {
  //   text: "归档",
  //   link: "/archives",
  // },
  {
    text: "关于",
    link: "/about/",
    // 🎈
  },
];
