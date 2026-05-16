const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const files = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.tsx') || e.name.endsWith('.ts') || e.name.endsWith('.css')) files.push(p);
  }
}
walk(srcDir);

const replacements = [
  // Disabled states (order matters - apply before other amber patterns)
  [/\bbg-slate-200\s+text-slate-400\b/g, 'bg-[var(--color-disabled-bg)] text-[var(--color-disabled-text)]'],
  [/\btext-slate-400\s+bg-slate-200\b/g, 'text-[var(--color-disabled-text)] bg-[var(--color-disabled-bg)]'],

  // Blue-950 to brand-900 (headings)
  [/\btext-blue-950\b/g, 'text-brand-900'],
  [/\bbg-blue-950\b/g, 'bg-brand-950'],

  // Amber to brand
  [/\bamber-700\b/g, 'brand-700'],
  [/\bamber-600\b/g, 'brand-600'],
  [/\bamber-500\b/g, 'brand-500'],
  [/\bamber-400\b/g, 'brand-400'],
  [/\bamber-300\b/g, 'brand-300'],
  [/\bamber-200\b/g, 'brand-200'],
  [/\bamber-100\b/g, 'brand-100'],
  [/\bamber-50\b/g, 'brand-50'],
];

// Phase 2: fix amber-* that became "brand-*" - prepend the bg/text/border prefix back
// The replacements above turned "bg-amber-600" → "bg-brand-600" which is correct
// But "text-amber-600" → "text-brand-600" which is also correct

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
console.log('Gold accents: text-gold-500, border-gold-500 can now be used for decorative elements.');
console.log('Disabled states use var(--color-disabled-bg) / var(--color-disabled-text).');
