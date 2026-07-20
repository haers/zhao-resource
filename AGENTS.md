# 项目协作规范

本仓库是小赵资源站的 VitePress 文档站。后续维护时，优先遵守本文件约定；通用代码规范仍然有效。

## 资源数据来源

- 11 个优质资源分类页的数据来源于 `zhao-toolbox/quark-share` 整理生成的 `data/logs/xiaozhao-share-links.json`，通过其 `share:site:sync:*` 命令同步；旧的 `/Users/zhaochangqing/Documents/Dev/kuake/` 路径已不再使用。
- 资源链接通常由夸克相关项目生成，本仓库只负责展示与站点结构整理。
- 不要在本站里随意生成、猜测、补写夸克分享链接。
- Markdown 链接没有真实 URL 时写 `待生成` 或保留明确说明，禁止写 `undefined`、空链接或假链接。
- 如果资源本身生成失败或不能分享，保留原因说明，不要强行改成可点击链接。

## 资源页面维护

- 11 个资源页是当前主要 SEO 分类页：
  - `docs/student-education.md`
  - `docs/career-development.md`
  - `docs/programming-ai.md`
  - `docs/design-photo-video.md`
  - `docs/books-audiobooks.md`
  - `docs/humanities-finance-law.md`
  - `docs/health-life.md`
  - `docs/software-tools.md`
  - `docs/music-audio.md`
  - `docs/images-wallpapers.md`
  - `docs/community-archive.md`
- 每个资源页都应包含清晰的 `title`、`description`、`updated`，避免出现 `1970/1/1` 这类默认日期。
- 每个资源页保留 `## 资源明细`，资源明细表中的“路径”列如果有真实夸克链接，应和“打开”列一样可点击。
- 专题页的下载入口、教学链接和活动链接同样使用统一资源表格（固定为“资源 / 来源 / 链接”），不使用散落的链接段落；表格内容只写资源信息，不写劝导式说明；视频平台链接如 B站、优酷、抖音使用同尺寸的品牌图标和文字，避免只突出单个平台。
- 资源分类页在标题下保留一至两句自然的主题介绍，写清可找到的内容和检索方向；关键词融入正常语句，不堆砌搜索词，不写劝导式文案。
- 每个资源页底部可以保留“其他分类资源”折叠汇总，便于用户跨分类跳转。
- 首页和资源导航页不要重复制造多个指向同一页面的入口，优先保留语义更清楚的入口。

## 导航规则

- 顶部导航可以保留少量图标，但不要给一个菜单堆多个图标。
- 侧边栏不要手动添加 emoji 图标，主题本身有统一图标样式，纯文字更整齐。
- 侧边栏资源页链接不要带 `#资源明细`，直接跳到页面顶部即可。
- 资源页的上一页/下一页用 frontmatter 显式维护，顺序要和侧边栏一致：
  - `百家讲坛` -> 11 个优质资源页 -> `资源查找教程`
  - 资源页之间的上一页/下一页可以跳到目标页的 `#资源明细`，方便快速浏览明细。

## 清理旧页面

- 旧分类页如果已经没有入口、且和 11 个新 SEO 分类页重复，应优先删除，避免被 VitePress 构建和本地搜索继续收录。
- 删除页面前确认没有被 `docs/.vitepress/config.mts`、`docs/index.md`、`docs/nav.md`、`README.md` 等入口引用。
- `busuanzi` 是主题/组件带的统计能力，不需要因为未显式引用而清理。

## 修改后检查

- 修改站点配置、首页、资源页或导航后，运行：

```bash
pnpm docs:build
```

- 如果改动影响页面体验，打开本地预览页面检查是否有 404、链接错误、布局明显异常。
- 提交前用 `git status --short` 确认是否混入无关改动；如果有用户自己的改动，先确认用途再决定是否一起提交。
