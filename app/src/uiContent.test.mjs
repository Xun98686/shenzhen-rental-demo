import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('public UI copy does not expose adapter implementation details', async () => {
  const source = await readFile(new URL('./main.js', import.meta.url), 'utf8');
  assert.equal(source.includes('未来替换真实 AMapAdapter 即可'), false);
  assert.equal(source.includes('面试讲述重点：这里先用 DemoMapAdapter'), false);
  assert.equal(source.includes('Calling DemoMapAdapter'), false);
});
