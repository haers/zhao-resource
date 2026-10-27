import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveConfig, createMarkdownRenderer } from 'vitepress';

const config = await resolveConfig('docs');
const md = await createMarkdownRenderer(config.srcDir, config.markdown);

test('提示块使用中文，正文、代码和链接中的同名英文保持原样', () => {
  const html = md.render('> [!NOTE]\n> 提示内容\n\nNOTE TIP IMPORTANT WARNING CAUTION\n\n`NOTE`\n\n[NOTE](https://example.test/NOTE)\n', {});
  assert.match(html, /custom-block-title">提醒</);
  assert.match(html, /NOTE TIP IMPORTANT WARNING CAUTION/);
  assert.match(html, /<code>NOTE<\/code>/);
  assert.match(html, /href="https:\/\/example.test\/NOTE"/);
});

test('提示容器与显式自定义标题继续生效', () => {
  assert.match(md.render('::: tip\n内容\n:::\n', {}), /custom-block-title">建议</);
  assert.match(md.render('::: warning 自定义警告\n内容\n:::\n', {}), /custom-block-title">自定义警告</);
});

test('保留文章元信息和md:img扩展', () => {
  assert.match(md.render('# 标题\n', {}), /<ClientOnly><ArticleMetadata \/><\/ClientOnly>/);
  assert.match(md.render('```md:img\n![示例](/logo.png)\n```\n', {}), /<div class="rendered-md">/);
});

test('简体中文本地搜索使用当前官方字段', () => {
  assert.equal(config.site.locales.root.lang, 'zh-CN');
  const search = config.site.themeConfig.search;
  assert.equal(search.provider, 'local');
  const modal = search.options.locales.root.translations.modal;
  assert.equal(modal.noResultsText, '无法找到相关结果');
  assert.equal(modal.backButtonTitle, '关闭搜索');
  assert.equal(modal.searchBox, undefined);
  assert.equal(modal.startScreen, undefined);
});
