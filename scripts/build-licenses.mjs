import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const directories = execFileSync('npm', ['ls', '--omit=dev', '--all', '--parseable'], {
  encoding: 'utf8',
})
  .trim()
  .split('\n')
  .filter((p) => p !== root);
directories.push(path.join(root, 'node_modules/wxt'));
let output = 'CrossCheck bundled third-party licenses\n\n';
for (const dir of [...new Set(directories)].sort()) {
  const pkg = JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8'));
  const names = await readdir(dir);
  const license = names.find((name) => /^licen[cs]e(?:\.md|\.txt)?$/i.test(name));
  if (!license && pkg.name !== 'wxt')
    throw new Error(`License text missing for ${pkg.name}; inspect before distributing.`);
  output += `\n${'='.repeat(72)}\n${pkg.name} ${pkg.version} (${pkg.license})\n${'='.repeat(72)}\n${await readFile(license ? path.join(dir, license) : path.join(root, 'licenses/wxt-LICENSE.txt'), 'utf8')}\n`;
}
output +=
  '\nLobe Icons (@lobehub/icons-static-svg 1.95.1) — brand SVG assets\n' +
  (await readFile('licenses/lobe-icons-LICENSE.txt', 'utf8'));
await mkdir('public', { recursive: true });
await writeFile('public/THIRD_PARTY_LICENSES.txt', output);
console.log(`Included license texts for ${new Set(directories).size} packages.`);
