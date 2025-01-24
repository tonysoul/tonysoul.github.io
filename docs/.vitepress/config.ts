import { defineConfig } from "vitepress";
import { nav } from "./configs/nav";
import { sidebar } from "./configs/sidebar";

export default defineConfig({
  outDir: "./dist",

  head: [["link", { rel: "icon", href: "/favicon.ico", type: "image/png" }]],

  lang: "zh-CN",
  title: "TonySoul",
  titleTemplate: "TonySoul的部落格",
  description: "TonySoul的部落格，前端，后端，学习，阅读，vue3，vite",

  themeConfig: {
    logo: "/logo.png",
    nav,
    sidebar,
    outline: {
      level: "deep",
      label: "目录",
    },
    socialLinks: [{ icon: "github", link: "https://github.com/tonysoul/blog" }],
  },

  markdown: {
    lineNumbers: true,
  },
});
