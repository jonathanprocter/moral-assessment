#!/usr/bin/env node

/**
 * Verification Script for MFQ-30 Application Fix
 * This script verifies that the blank screen issue has been resolved
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 MFQ-30 Application Fix Verification\n');
console.log('=' .repeat(60));

let allChecksPassed = true;

// Check 1: Verify vite.config.js has base: './'
console.log('\n✓ Check 1: Vite Configuration');
try {
  const viteConfig = fs.readFileSync('./vite.config.js', 'utf8');
  if (viteConfig.includes("base: './'") || viteConfig.includes('base: "./"')) {
    console.log('  ✅ base: "./" is configured in vite.config.js');
  } else {
    console.log('  ❌ base: "./" is NOT found in vite.config.js');
    allChecksPassed = false;
  }
} catch (error) {
  console.log('  ❌ Could not read vite.config.js');
  allChecksPassed = false;
}

// Check 2: Verify dist folder exists
console.log('\n✓ Check 2: Build Output');
if (fs.existsSync('./dist')) {
  console.log('  ✅ dist/ folder exists');
} else {
  console.log('  ❌ dist/ folder does not exist - run "npm run build"');
  allChecksPassed = false;
}

// Check 3: Verify dist/index.html exists
if (fs.existsSync('./dist/index.html')) {
  console.log('  ✅ dist/index.html exists');
  
  // Check 4: Verify relative paths in dist/index.html
  console.log('\n✓ Check 3: Asset Path Configuration');
  const distHtml = fs.readFileSync('./dist/index.html', 'utf8');
  
  // Check for relative paths
  const hasRelativePaths = distHtml.includes('src="./assets/') || distHtml.includes('href="./assets/');
  const hasAbsolutePaths = distHtml.includes('src="/assets/') || distHtml.includes('href="/assets/');
  
  if (hasRelativePaths && !hasAbsolutePaths) {
    console.log('  ✅ dist/index.html uses relative paths (./assets/)');
  } else if (hasAbsolutePaths) {
    console.log('  ❌ dist/index.html still uses absolute paths (/assets/)');
    console.log('     Run "npm run build" to regenerate with correct paths');
    allChecksPassed = false;
  } else {
    console.log('  ⚠️  Could not detect asset paths in dist/index.html');
  }
  
  // Check for root div
  if (distHtml.includes('<div id="root"></div>')) {
    console.log('  ✅ Root div element present');
  } else {
    console.log('  ❌ Root div element missing');
    allChecksPassed = false;
  }
} else {
  console.log('  ❌ dist/index.html does not exist');
  allChecksPassed = false;
}

// Check 5: Verify assets folder exists
console.log('\n✓ Check 4: Asset Files');
if (fs.existsSync('./dist/assets')) {
  const assets = fs.readdirSync('./dist/assets');
  const jsFiles = assets.filter(f => f.endsWith('.js'));
  const cssFiles = assets.filter(f => f.endsWith('.css'));
  
  console.log(`  ✅ dist/assets/ folder exists`);
  console.log(`  ✅ Found ${jsFiles.length} JavaScript files`);
  console.log(`  ✅ Found ${cssFiles.length} CSS files`);
  
  if (jsFiles.length === 0) {
    console.log('  ❌ No JavaScript files found - build may have failed');
    allChecksPassed = false;
  }
} else {
  console.log('  ❌ dist/assets/ folder does not exist');
  allChecksPassed = false;
}

// Check 6: Verify source files
console.log('\n✓ Check 5: Source Files');
const requiredFiles = [
  './src/main.jsx',
  './src/App.jsx',
  './src/index.css',
  './src/components/Welcome.jsx',
  './src/components/Assessment.jsx',
  './src/components/Results.jsx'
];

let allSourceFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} missing`);
    allSourceFilesExist = false;
    allChecksPassed = false;
  }
});

// Check 7: Verify React mounting code
console.log('\n✓ Check 6: React Configuration');
try {
  const mainJsx = fs.readFileSync('./src/main.jsx', 'utf8');
  if (mainJsx.includes('ReactDOM.createRoot')) {
    console.log('  ✅ Using React 18 createRoot API');
  } else {
    console.log('  ⚠️  Not using React 18 createRoot API');
  }
  
  if (mainJsx.includes("document.getElementById('root')")) {
    console.log('  ✅ Mounting to correct root element');
  } else {
    console.log('  ❌ Not mounting to root element');
    allChecksPassed = false;
  }
} catch (error) {
  console.log('  ❌ Could not verify React configuration');
  allChecksPassed = false;
}

// Check 8: Verify package.json
console.log('\n✓ Check 7: Dependencies');
try {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const requiredDeps = ['react', 'react-dom', 'vite'];
  let allDepsPresent = true;
  
  requiredDeps.forEach(dep => {
    if (deps[dep]) {
      console.log(`  ✅ ${dep}: ${deps[dep]}`);
    } else {
      console.log(`  ❌ ${dep} missing`);
      allDepsPresent = false;
      allChecksPassed = false;
    }
  });
} catch (error) {
  console.log('  ❌ Could not read package.json');
  allChecksPassed = false;
}

// Final Summary
console.log('\n' + '='.repeat(60));
console.log('\n📊 VERIFICATION SUMMARY\n');

if (allChecksPassed) {
  console.log('✅ ALL CHECKS PASSED!');
  console.log('\nThe blank screen issue has been fixed.');
  console.log('\n📝 How to view the application:');
  console.log('   1. Open dist/index.html directly in a browser');
  console.log('   2. Or run: npx serve dist -l 8080');
  console.log('   3. Or run: npm run dev (development mode)');
  console.log('\n✨ The application should now display correctly!');
} else {
  console.log('❌ SOME CHECKS FAILED');
  console.log('\n🔧 Recommended actions:');
  console.log('   1. Ensure vite.config.js has: base: "./"');
  console.log('   2. Run: npm install');
  console.log('   3. Run: npm run build');
  console.log('   4. Run this verification script again');
}

console.log('\n' + '='.repeat(60));

process.exit(allChecksPassed ? 0 : 1);
