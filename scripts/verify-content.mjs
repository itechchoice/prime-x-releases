import { readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";

const roots = ["index.html", "src"];
const forbiddenPunctuation = /[—–]/u;

async function filesAt(path) {
  const entries = await readdir(path, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const child = join(path, entry.name);
      return entry.isDirectory() ? filesAt(child) : [child];
    }),
  );
  return nested.flat();
}

const files = [];
for (const root of roots) {
  if (extname(root)) files.push(root);
  else files.push(...(await filesAt(root)));
}

const violations = [];
for (const file of files) {
  const contents = await readFile(file, "utf8");
  if (forbiddenPunctuation.test(contents)) {
    violations.push(`${file}: contains an em dash or en dash`);
  }
}

if (violations.length) {
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log(`Verified ${files.length} content files.`);
