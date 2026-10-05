import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, it } from 'vitest';

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? files(path.join(dir, e.name))
      : /\.tsx?$/.test(e.name)
        ? [path.join(dir, e.name)]
        : [],
  );
}
it('enforces domain/application/infrastructure/presentation boundaries and no cycles', () => {
  const root = path.resolve('src');
  const all = files(root);
  const allowed: Record<string, string[]> = {
    domains: ['domains'],
    application: ['domains', 'application'],
    infrastructure: ['domains', 'application', 'infrastructure'],
    presentation: ['domains', 'application', 'presentation'],
  };
  const graph = new Map<string, string[]>();
  for (const file of all) {
    const layer = path.relative(root, file).split(path.sep)[0]!;
    const imports = [
      ...readFileSync(file, 'utf8').matchAll(/(?:from\s+|import\s*)['"]([^'"]+)['"]/g),
    ].map((m) => m[1]!);
    const edges: string[] = [];
    for (const specifier of imports) {
      if (!specifier.startsWith('.')) continue;
      const resolved = path.resolve(path.dirname(file), specifier);
      const target = all.find((f) => f === resolved + '.ts' || f === resolved + '.tsx');
      if (!target) continue;
      const targetLayer = path.relative(root, target).split(path.sep)[0]!;
      expect(allowed[layer], `${file} -> ${target}`).toContain(targetLayer);
      edges.push(target);
    }
    if (layer !== 'infrastructure')
      expect(readFileSync(file, 'utf8'), file).not.toMatch(/\bchrome\./);
    graph.set(file, edges);
  }
  function visit(file: string, stack: string[]) {
    expect(stack, `Circular dependency: ${[...stack, file].join(' -> ')}`).not.toContain(file);
    for (const dep of graph.get(file) ?? []) visit(dep, [...stack, file]);
  }
  for (const file of all) visit(file, []);
});
