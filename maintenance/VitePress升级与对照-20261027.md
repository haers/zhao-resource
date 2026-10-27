# VitePress配置与依赖升级

日期：2026-10-27。状态：已完成本地升级与验证。目标：保留现有主题外观、站点配置和内容，按官方稳定版配置及参考主题核对后升级兼容依赖；不更新线上。

## 来源与版本选择

- 参考来源为 [Yiov/vitepress-doc](https://github.com/Yiov/vitepress-doc)，与现有依赖清单及本地组件教程链接对应。笔记《前端框架-Vue-Vite》也记录了此来源。
- [参考教程](https://vitepress.yiov.top/)和上游package.json仍使用1.6.4。本机查询npm：latest=1.6.4，next=2.0.0-alpha.21。保留稳定版，不把alpha当正式升级。
- 当前官网默认展示2.0文档，因此本次配置依据[1.6.4本地搜索](https://vuejs.github.io/vitepress/v1/reference/default-theme-search)及安装包类型；不照搬2.0专属选项。
- 参考主题的Algolia示例不能覆盖本站本地搜索；现有菜单、域名、评论仓库、默认暗色及定制组件保留。

## 基线与验收队列

唯一证据目录为 `work/vitepress-upgrade-20261027`，不进入站点产物或Git。已保存原package.json、锁文件、config、完整theme目录、实际解析配置和已跟踪文件摘要。起始提交22d7e91，工作区干净。

代表页面：首页、导航、电子书资源表、广场舞专题、赞助页；1280／390，浅色／深色。升级前已保存20组页面、4组搜索截图和1张原始动效截图；对照截图冻结动画并隐藏随机canvas，仅影响测试上下文。另记录DOM尺寸、标题、链接、横向溢出及脚本错误。

## 实际变更

- VitePress固定为最新稳定版1.6.4；未采用2.0.0-alpha.21。
- Vue升级至3.5.44，Mermaid至11.17.2，group-icons至1.8.1，xgplayer至3.0.26，medium-zoom至1.1.2；同步更新当前主版本范围内的编译依赖和锁文件。
- 安全修复使用两个限定范围的pnpm overrides：`vitepress>vite=6.4.5`、`mermaid>katex=0.18.2`。前者超出VitePress声明的Vite 5范围，因此额外验证生产构建、开发服务和插件；后续升级框架时应重新评估能否移除覆盖。
- 语言标识统一为zh-CN；本地搜索改用官方本地搜索翻译字段，删除无效的Algolia字段。
- 提示块改用原生container标签；1.6.4的GitHub alerts仅对默认标题定点翻译。删除全局替换英文关键字的逻辑，避免误改正文、代码和URL。
- 菜单、侧栏、域名、评论配置、默认暗色、页脚及全部主题组件保留，不复制参考站账号或业务配置。

## 验证结果

| 检查 | 结果 |
| --- | --- |
| 配置与内容保留 | 除搜索翻译和语言标识外，有效站点配置一致；191个原文件摘要一致，包含原有内容、图片和主题组件 |
| 单元检查 | `pnpm test`，4项通过，覆盖提示块、正文保护、元信息、图片扩展和搜索配置 |
| 生产构建 | `pnpm docs:build`通过 |
| 安全审计 | `pnpm audit --json`各级均为0；升级前高危25项、中危41项、低危10项，仅代表查询时的审计数据库 |
| 浏览器矩阵 | 升级前后各20组，均无页面脚本错误、同源失败响应或页面横向溢出 |
| 页面结构对照 | 20组标题、链接、区域坐标、尺寸、字体大小一致，语言标识按预期修正 |
| 视觉抽查 | 查看桌面暗色首页、手机浅色导航及搜索对照；手机首页像素完全一致，其余截图存在小范围文字间距或动态绘制差异，主要布局未变化 |
| 搜索 | 桌面和手机、深浅色的真实查询及空结果；空结果中文生效；开发模式点击结果可跳转 |
| 插件开发验证 | 临时页面实际渲染Mermaid、KaTeX公式、代码组切换、组内md:img图片页签、中文提示块，无页面错误；临时页已移除 |

已过前端页面自查（page-self-review），范围为本次配置、依赖升级及上述代表页面，不代表外部系统验收。

首次开发验证等待networkidle受持续请求影响超时，改为DOM与元素就绪检查。图片扩展第一次样例放在代码组外，原主题CSS默认隐藏；改为原约定的组内图片页签后通过，没有修改主题CSS。

## 保留事项与边界

- 原赞助页二维码层级会覆盖搜索弹窗，升级前后均存在；截图已留存。本轮保持原主题，不夹带样式重构。
- 构建主包约700,993字节，超过原600kB提示阈值。构建成功，保留体积告警；未为了消除提示提高阈值，也未声称已完成性能优化。
- 未验外部评论实际发表、网盘下载、线上部署或真实手机键盘；未推送、未发布。
- 原有页脚备案占位内容按要求保留，应在正式备案后自行替换。

## 证据与复核

本机证据位于`work/vitepress-upgrade-20261027/`，已忽略以免发布。**请保留此目录，不要在清理工作区时删除**。包含升级前配置及主题备份、前后各25张截图（20张页面、4张搜索、1张原始动效）、DOM报告、插件截图、测试与构建日志、安全审计。

- [升级前首页](../work/vitepress-upgrade-20261027/before/home-1280-dark.png) / [升级后首页](../work/vitepress-upgrade-20261027/after/home-1280-dark.png)
- [升级前手机导航](../work/vitepress-upgrade-20261027/before/nav-390-light.png) / [升级后手机导航](../work/vitepress-upgrade-20261027/after/nav-390-light.png)
- [升级前手机搜索](../work/vitepress-upgrade-20261027/before/search-390-light.png) / [升级后手机搜索](../work/vitepress-upgrade-20261027/after/search-390-light.png)

以上相对链接仅在保有本机证据目录的工作区有效；Git克隆不包含证据图片。

复核命令：

```bash
pnpm test
pnpm docs:build
node scripts/check-upgrade-preservation.mjs
node scripts/compare-upgrade-pages.mjs
# 先启动本机预览；可通过QA_PLAYWRIGHT_MODULE指定本机已有Playwright，不下载浏览器。
node scripts/qa-upgrade.cjs after
```

不要在升级后重新运行before阶段覆盖原截图。回退基线为`22d7e91`，可先在独立目录检出基线比较；本机before目录另保存原配置、package.json、锁文件与完整theme。不使用强制重置覆盖后续工作。
