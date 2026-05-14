const fs = require('fs');
const path = require('path');

const files = [
  'src/features/landing/sections/ProductsSection.tsx',
  'src/features/customer/Payments/MakePayment.tsx',
  'src/features/customer/Payments/components/PaymentBankDetails.tsx',
  'src/features/cart/ShoppingCart.tsx',
  'src/features/cart/Checkout.tsx',
  'src/features/browse/BrowsePage.tsx',
  'src/features/agent/components/ReferralLink.tsx',
  'src/components/ui/GeneralModal.tsx',
];

const baseDir = path.join(__dirname, '..');

for (const file of files) {
  const fp = path.join(baseDir, file);
  let content = fs.readFileSync(fp, 'utf8');
  const original = content;
  content = content.replace(/\bemerald-800\b/g, 'amber-800');
  content = content.replace(/\bemerald-900\b/g, 'amber-800');
  content = content.replace(/\bemerald-950\b/g, 'amber-950');
  if (content !== original) {
    fs.writeFileSync(fp, content, 'utf8');
    console.log(`  Fixed ${file}`);
  }
}
console.log('Done.');
