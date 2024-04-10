import { defineConfig } from 'vitepress'
import { getNavs } from "./nav";
import { getSidebar } from './sidebars/index'
export default defineConfig({
  markdown: { attrs: { disable: true } },
  title: "晨光",
  description: "晨光的知识库",
  lastUpdated: true,
  head: [['link', { rel: 'icon', href: '/logo.jpg' }]],
  themeConfig: {
    search: {
      provider: 'local'
    },
    logo: './logo.jpg',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    nav: getNavs(),
    sidebar: getSidebar()
  },
  
  vite: {
    ssr: {
      noExternal: ['@vue/repl'],
    },
  },
})
