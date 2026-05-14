const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const files = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.tsx') || e.name.endsWith('.ts')) files.push(p);
  }
}
walk(srcDir);

const replacements = [
  [/\btext-slate-900\b/g, 'text-blue-950'],
  [/\bborder-slate-200\b/g, 'border-amber-200'],
  [/\btext-emerald-600\b/g, 'text-amber-700'],
  [/\btext-emerald-700\b/g, 'text-amber-800'],
  [/\btext-emerald-500\b/g, 'text-amber-600'],
];

let changed = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changed++;
    console.log(`  ${path.relative(path.join(__dirname, '..'), file)}`);
  }
}
console.log(`\nDone. ${changed} files updated.`);
