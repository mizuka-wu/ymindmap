import { defineConfig } from 'vitepress'
import MarkdownItTextualUml from 'markdown-it-textual-uml';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/ymindmap/',
  title: "YMindmap",
  description: "A mindmap with yjs and Leafer.js",
  head: [
    [
      'script',
      {
        async: 'async',
        src: 'https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.9.1/mermaid.min.js',
      },
    ]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '快速上手', link: '/guide/' },
      { text: '实现原理', link: '/guide/implementation/' },
      { text: 'API 参考手册', link: '/ref/@ymindmap-view.html' },
    ],

    sidebar: [
      {
        text: '快速上手',
        items: [
        ]
      },
      {
        text: '示例',
        items: [
        ]
      },
      {
        text: '实现原理',
        items: [
          { text: '设计思路', link: '/guide/implementation/' },
        ]
      },
      {
        text: 'API 参考手册',
        items: [
          { text: '@ymindmap/view', link: '/ref/@ymindmap-view.html' },
          { text: '@ymindmap/model', link: '/ref/@ymindmap-model.html' },
          { text: '@ymindmap/state', link: '/ref/@ymindmap-state.html' },
          { text: '@ymindmap/core', link: '/ref/@ymindmap-core.html' },
          { text: '@ymindmap/browser', link: '/ref/@ymindmap-browser.html' },
          { text: '@ymindmap/extension-mindmap', link: '/ref/@ymindmap-extension-mindmap.html' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  markdown: {
    config(markdownIt) {
      markdownIt.use(MarkdownItTextualUml)
    }
  }
})
