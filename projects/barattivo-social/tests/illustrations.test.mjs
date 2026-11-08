import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync, statSync } from 'node:fs';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/complete-images.css', import.meta.url), 'utf8');
const art = [
  ['barto-hero-hd.webp', 'hero-hd-image'],
  ['cave-social-hd.webp', 'manifesto-hd-image'],
];
for (const [filename, cls] of art) {
  test(`${filename}: full HD artwork linked and actually included`, () => {
    const asset = new URL(`../assets/${filename}`, import.meta.url);
    assert.ok(statSync(asset).size > 100_000);
    const file = readFileSync(asset);
    assert.equal(file.toString('ascii', 0, 4), 'RIFF');
    assert.equal(file.toString('ascii', 8, 12), 'WEBP');
    assert.match(html, new RegExp(`class="${cls}"[^>]+src="/assets/${filename}"`));
  });
}
test('responsive visual treatment preserves full images', () => {
  assert.match(css, /object-fit:\s*contain/);
  assert.match(css, /aspect-ratio:\s*4\s*\/\s*3/);
  assert.match(html, /href="\/src\/complete-images\.css"/);
  assert.doesNotMatch(html, /class="hero-floating-note"/);
  assert.doesNotMatch(html, /class="hand-drawn"/);
});