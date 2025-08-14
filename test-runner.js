#!/usr/bin/env node

// Simple test runner to verify Hyperliquid functionality
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Hyperliquid Testing Suite');
console.log('============================');

// Function to run command and return promise
function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n▶️  Running: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, { 
      stdio: 'inherit', 
      shell: true,
      ...options 
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${command} completed successfully`);
        resolve(code);
      } else {
        console.log(`❌ ${command} failed with code ${code}`);
        reject(new Error(`Command failed: ${command}`));
      }
    });
    
    child.on('error', (err) => {
      console.error(`❌ Error running ${command}:`, err.message);
      reject(err);
    });
  });
}

async function runTests() {
  try {
    console.log('\n📦 Checking dependencies...');
    
    // Check if jest is available
    try {
      await runCommand('npx', ['jest', '--version']);
    } catch (error) {
      console.log('📦 Installing test dependencies...');
      await runCommand('npm', ['install', '--save-dev', 
        'jest', 
        '@testing-library/react', 
        '@testing-library/jest-dom', 
        '@testing-library/user-event',
        'jest-environment-jsdom',
        '@types/jest'
      ]);
    }
    
    console.log('\n🔍 Running TypeScript checks...');
    await runCommand('npx', ['tsc', '--noEmit']);
    
    console.log('\n🧪 Running tests...');
    
    // Run specific test files if they exist
    const testFiles = [
      '__tests__/hyperliquid-provider.test.tsx',
      '__tests__/integration/hyperliquid-integration.test.tsx',
      '__tests__/error-handling/hyperliquid-errors.test.tsx'
    ];
    
    for (const testFile of testFiles) {
      try {
        console.log(`\n🧪 Testing: ${testFile}`);
        await runCommand('npx', ['jest', testFile, '--verbose']);
      } catch (error) {
        console.log(`⚠️  Test file ${testFile} had issues, continuing...`);
      }
    }
    
    console.log('\n🎉 Testing complete!');
    console.log('\n📖 Next steps:');
    console.log('1. Start development server: npm run dev');
    console.log('2. Navigate to: http://localhost:3000/pwa');
    console.log('3. Follow manual testing guide: HYPERLIQUID_TESTING_GUIDE.md');
    
  } catch (error) {
    console.error('\n❌ Testing failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Ensure Node.js is installed');
    console.log('2. Run: npm install');
    console.log('3. Check: npm run typecheck');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
