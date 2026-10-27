// 与本轮升级前真实配置和源码摘要比较；证据目录不存在时明确失败，不制造通过。
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { resolveConfig } from 'vitepress';
const root = 'work/vitepress-upgrade-20261027';
const config = await resolveConfig('docs');
const before = JSON.parse(fs.readFileSync(`${root}/before/resolved-site.json`, 'utf8'));
const after = JSON.parse(JSON.stringify(config.site));
fs.mkdirSync(`${root}/after`, { recursive: true });
fs.writeFileSync(`${root}/after/resolved-site.json`, JSON.stringify(after, null, 2));
for (const site of [before, after]) {
  // 本轮明确修复的两项，其他有效站点配置必须完全相同。
  delete site.themeConfig.search;
  delete site.locales.root.lang;
}
assert.deepEqual(after, before, '站点有效配置出现非预期变化');
const hashes = JSON.parse(fs.readFileSync(`${root}/before/source-hashes.json`, 'utf8'));
const allowed = new Set(['.gitignore', 'package.json', 'pnpm-lock.yaml', 'docs/.vitepress/config.mts', 'README.md']);
let preserved = 0;
for (const [name, hash] of Object.entries(hashes)) {
  if (allowed.has(name)) continue;
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(name)).digest('hex'), hash, `原文件被改动：${name}`);
  preserved++;
}
console.log(`有效站点配置保留；${preserved}个原文件摘要一致（含内容、图片和全部主题组件）`);
