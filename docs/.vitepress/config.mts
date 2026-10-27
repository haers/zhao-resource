import { defineConfig } from 'vitepress'

import markdownItTaskCheckbox from 'markdown-it-task-checkbox'
import { groupIconMdPlugin, groupIconVitePlugin, localIconLoader } from 'vitepress-plugin-group-icons'
import { MermaidMarkdown, MermaidPlugin } from 'vitepress-plugin-mermaid';

import { usePosts } from './theme/untils/permalink';
const { rewrites } = await usePosts();

export default defineConfig({
  lang: 'zh-CN',
  title: "小赵资源站",
  description: "小赵资源站,免费学习资料,夸克网盘资源,百家讲坛,编程开发,AI,电子书,软件工具",
  sitemap: {
    hostname: 'https://kuake.netlify.app'
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'icon', href: '/favicon-32.png', type: 'image/png', sizes: '32x32' }],
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: 'any' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
  ],

  base: '/',

  //启用深色模式
  appearance: 'dark',

  //多语言
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
    },
  },

  //markdown配置
  markdown: {
    // 使用VitePress原生提示块标题，只翻译标题，不替换正文、代码和URL中的同名英文。
    container: {
      noteLabel: '提醒',
      tipLabel: '建议',
      importantLabel: '重要',
      warningLabel: '警告',
      cautionLabel: '注意',
    },
    //行号显示
    lineNumbers: true,

    // toc显示一级标题
    toc: {level: [1,2,3]},

    // 使用 `!!code` 防止转换
    codeTransformers: [
      {
        postprocess(code) {
          return code.replace(/\[\!\!code/g, '[!code')
        }
      }
    ],

    // 开启图片懒加载
    image: {
      lazyLoading: true
    },

    config: (md) => {
      // 1.6.4未将container标签传给GitHub alerts，仅翻译其默认标题，保留用户自定义标题。
      const renderAlert = md.renderer.rules.github_alert_open!;
      const alertTitles: Record<string, string> = {
        NOTE: '提醒', TIP: '建议', IMPORTANT: '重要', WARNING: '警告', CAUTION: '注意',
      };
      md.renderer.rules.github_alert_open = (...args) => renderAlert(...args).replace(
        /(<p class="custom-block-title">)(NOTE|TIP|IMPORTANT|WARNING|CAUTION)(<\/p>)/g,
        (_, start, title, end) => `${start}${alertTitles[title]}${end}`,
      );

      // 组件插入h1标题下
      md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
        let htmlResult = slf.renderToken(tokens, idx, options)
        if (tokens[idx].tag === 'h1') htmlResult += `<ClientOnly><ArticleMetadata /></ClientOnly>`
        return htmlResult
      },

      // 代码组中添加图片
      md.use((md) => {
        // 获取原始的 fence 渲染规则
        const defaultFence = md.renderer.rules.fence?.bind(md.renderer.rules) ?? ((...args) => args[0][args[1]].content);

        // 重写 fence 渲染规则
        md.renderer.rules.fence = (tokens, idx, options, env, self) => {
          const token = tokens[idx];
          const info = token.info.trim();

          // 判断是否为 md:img 类型的代码块
          if (info.includes('md:img')) {
            // 只渲染图片，不再渲染为代码块
            return `<div class="rendered-md">${md.render(token.content)}</div>`;
          }

          // 其他代码块按默认规则渲染（如 java, js 等）
          return defaultFence(tokens, idx, options, env, self);
        };
      })
      
      md.use(groupIconMdPlugin) //代码组图标
      md.use(markdownItTaskCheckbox) //todo
      md.use(MermaidMarkdown); 

    }

  },

  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          ts: localIconLoader(import.meta.url, '../public/svg/typescript.svg'), //本地ts图标导入
          md: localIconLoader(import.meta.url, '../public/svg/md.svg'), //markdown图标
          css: localIconLoader(import.meta.url, '../public/svg/css.svg'), //css图标
          js: 'logos:javascript', //js图标
        },
      }),
      MermaidPlugin()
    ],
    optimizeDeps: {
      include: ['mermaid'],
    },
    ssr: {
      noExternal: ['mermaid'],
    },
    build: {
      // VitePress 与 Mermaid 的基础代码接近默认 500KB 阈值，重依赖已按需拆分。
      chunkSizeWarningLimit: 600,
    },
  },

  lastUpdated: true, //此配置不会立即生效，需git提交后爬取时间戳，没有安装git本地报错可以先注释


  //主题配置
  themeConfig: {
    //左上角logo
    logo: '/logo.png',

    //上次更新时间
    lastUpdated: {
      text: '上次更新时间',
      formatOptions: {
        dateStyle: 'short', // 可选值full、long、medium、short
        timeStyle: 'medium' // 可选值full、long、medium、short
      },
    },

    //导航栏
    nav: [
      { text: '🏠 首页', link: '/' },
      { text: '🧭 资源总目录', link: '/nav' },
      { text: '🎙️ 百家讲坛', link: '/baijiajiangtan' },
      { text: '🔎 资源查找', link: '/find-course' },
      { text: '☕ 赞助', link: '/sponsor' },
    ],


    //侧边栏
    sidebar: [
      {
        text: '前言', 
        collapsed: false,
        items: [
          { text: '资源导航【建议收藏】', link: '/nav' },
        ]
      },
      {
        text: '精品资源', 
        collapsed: false,
        items: [
          { text: '百家讲坛', link: '/baijiajiangtan' },
        ]
      },
      {
        text: '专题资源',
        collapsed: false,
        items: [
          { text: '广场舞歌曲与教学资料合集', link: '/square-dance' },
        ]
      },
      {
        text: '优质资源',
        collapsed: false,
        items: [
          { text: '学生教育', link: '/student-education' },
          { text: '职业考试与职场提升', link: '/career-development' },
          { text: '编程开发与AI', link: '/programming-ai' },
          { text: '设计摄影与剪辑', link: '/design-photo-video' },
          { text: '电子书与有声读物', link: '/books-audiobooks' },
          { text: '人文社科与财经法律', link: '/humanities-finance-law' },
          { text: '健康运动与生活', link: '/health-life' },
          { text: '软件工具与系统', link: '/software-tools' },
          { text: '音乐音频', link: '/music-audio' },
          { text: '图片写真与壁纸', link: '/images-wallpapers' },
          { text: '社区资料与论坛备份', link: '/community-archive' },
        ]
      },  
      {
        text: '工具',
        collapsed: false,
        items: [
          { text: '资源查找教程', link: '/find-course' },
        ],
      },
    ] ,



    // 本地搜索使用LocalSearchTranslations；保留中文入口，不混用Algolia字段。
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '清除查询条件',
                backButtonTitle: '关闭搜索',
                noResultsText: '无法找到相关结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: '回车',
                  navigateText: '切换',
                  navigateUpKeyAriaLabel: '上箭头',
                  navigateDownKeyAriaLabel: '下箭头',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'Esc',
                },
              },
            },
          },
        },
      },
    },

    //社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/haers/zhao-resource' },
    ],

    //手机端深浅模式文字修改
    darkModeSwitchLabel: '深浅模式',




    //页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © 2023-${new Date().getFullYear()} 备案号：<a href="https://beian.miit.gov.cn/" target="_blank">京****号</a>`,
    },


    //侧边栏文字更改(移动端)
    sidebarMenuLabel: '目录',

    //返回顶部文字修改(移动端)
    returnToTopLabel: '返回顶部',


    //大纲显示2-3级标题
    outline: {
      level: [2, 3],
      label: '当前页大纲'
    },


    //自定义上下页名
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

  },
})
