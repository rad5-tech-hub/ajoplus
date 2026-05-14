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

// Safe mechanical replacements — these Tailwind classes only appear as CSS utility classes,
// never in other contexts that would cause false matches
const replacements = [
  // Emerald shades (ordered specific to general to avoid partial matches)
  [/\bemerald-700\b/g, 'amber-700'],
  [/\bemerald-600\b/g, 'amber-600'],
  [/\bemerald-500\b/g, 'amber-500'],
  [/\bemerald-400\b/g, 'amber-400'],
  [/\bemerald-300\b/g, 'amber-300'],
  [/\bemerald-200\b/g, 'amber-200'],
  [/\bemerald-100\b/g, 'amber-100'],
  [/\bemerald-50\b/g, 'amber-50'],
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

console.log(`\nDone. ${changed} files updated with emerald → amber swap.`);
console.log('Context-dependent replacements (text-slate-900→blue-950, bg-slate-50→amber-50, border-slate-200→amber-200, text-emerald-*→text-amber-*) still need manual review.');
