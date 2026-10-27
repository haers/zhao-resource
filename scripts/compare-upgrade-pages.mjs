// 对照相同页面矩阵的真实浏览器报告；只允许本轮确定的语言标识修正。
import assert from 'node:assert/strict';
import fs from 'node:fs';
const root = 'work/vitepress-upgrade-20261027';
const read = phase => JSON.parse(fs.readFileSync(`${root}/${phase}/pages.json`, 'utf8'));
const before = read('before'), after = read('after');
assert.equal(before.length, 20);
assert.equal(after.length, before.length);
for (let i = 0; i < before.length; i++) {
  const { lang: oldLang, ...oldPage } = before[i];
  const { lang, ...newPage } = after[i];
  assert.equal(lang, 'zh-CN');
  assert.deepEqual(newPage, oldPage, `页面结构发生变化：${oldPage.id}`);
  assert.deepEqual(newPage.errors, []);
  assert.deepEqual(newPage.failed, []);
  assert.equal(newPage.overflow, false);
}
console.log('20组页面标题、链接、区域尺寸一致，无页面错误、同源失败请求或横向溢出。');
