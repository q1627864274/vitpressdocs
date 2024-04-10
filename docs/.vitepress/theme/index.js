import DefaultTheme from "vitepress/theme";
import PassWord from "../../../components/password.vue"
import playground from "../../../components/playground.vue"
export default {
  ...DefaultTheme,
  async enhanceApp({ app }) {
    app.component("PassWord", PassWord)
    if (!import.meta.env.SSR) {
      app.component("Playground", playground)
    }
  },
};
