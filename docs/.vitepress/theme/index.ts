import { App } from "vue";
import DefaultTheme from "vitepress/theme";
import BookList from "./components/BookList.vue";
import Tags from "./components/Tags.vue";

import "./style/var.scss";

export default {
  ...DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    app.component("BookList", BookList);
    app.component("Tags", Tags);
  },
};
