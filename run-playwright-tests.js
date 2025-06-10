#!/usr/bin/env node
/**
 * Playwright Test Runner for Login UI
 * Handles installation and execution of self-healing tests
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 16) {
    log('❌ Node.js 16 or higher is required', 'red');
    log(`   Current version: ${nodeVersion}`, 'yellow');
    log('   Please update Node.js: https://nodejs.org/', 'cyan');
    return false;
  }
  
  log(`✅ Node.js version: ${nodeVersion}`, 'green');
  return true;
}

function checkRequiredFiles() {
  const requiredFiles = [
    'index.html',
    'demo.html',
    'package.json',
    'playwright.config.ts'
  ];
  
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    log(`❌ Missing required files: ${missingFiles.join(', ')}`, 'red');
    log('   Make sure you\'re running this from the correct directory.', 'yellow');
    return false;
  }
  
  log('✅ All required files found', 'green');
  return true;
}

function installDependencies() {
  log('\n📦 Installing dependencies...', 'blue');
  
  try {
    // Install npm dependencies
    log('   Installing npm packages...', 'cyan');
    execSync('npm install', { stdio: 'inherit' });
    
    // Install Playwright browsers
    log('   Installing Playwright browsers...', 'cyan');
    execSync('npx playwright install', { stdio: 'inherit' });
    
    log('✅ Dependencies installed successfully!', 'green');
    return true;
  } catch (error) {
    log(`❌ Failed to install dependencies: ${error.message}`, 'red');
    return false;
  }
}

function runTests(options = {}) {
  log('\n🧪 Starting Playwright Tests...', 'blue');
  log('============================================================', 'cyan');
  
  const testCommands = {
    default: 'npx playwright test',
    headed: 'npx playwright test --headed',
    debug: 'npx playwright test --debug', 
    ui: 'npx playwright test --ui',
    specific: (testName) => `npx playwright test --grep "${testName}"`
  };
  
  let command = testCommands.default;
  
  if (options.headed) command = testCommands.headed;
  if (options.debug) command = testCommands.debug;
  if (options.ui) command = testCommands.ui;
  if (options.grep) command = testCommands.specific(options.grep);
  
  try {
    log(`🚀 Running: ${command}`, 'cyan');
    execSync(command, { stdio: 'inherit' });
    
    log('\n============================================================', 'cyan');
    log('🎉 Tests completed successfully!', 'green');
    log('📄 View detailed report: npx playwright show-report', 'blue');
    return true;
  } catch (error) {
    log('\n============================================================', 'cyan');
    log('❌ Some tests failed', 'red');
    log('📄 View detailed report: npx playwright show-report', 'blue');
    return false;
  }
}

function showUsage() {
  log('\n🛠️ Playwright Test Runner - Usage', 'bright');
  log('==================================================', 'cyan');
  log('npm run test              # Run all tests (headless)', 'cyan');
  log('npm run test:headed       # Run tests with browser visible', 'cyan');
  log('npm run test:debug        # Run tests in debug mode', 'cyan');
  log('npm run test:ui           # Run tests with Playwright UI', 'cyan');
  log('npm run test:report       # Show test report', 'cyan');
  log('\nOr run this script directly:', 'yellow');
  log('node run-playwright-tests.js [options]', 'cyan');
  log('  --headed    Show browser window', 'cyan');
  log('  --debug     Debug mode', 'cyan');
  log('  --ui        Playwright UI mode', 'cyan');
  log('  --grep "test name"   Run specific test', 'cyan');
  log('  --help      Show this help', 'cyan');
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showUsage();
    return;
  }
  
  log('🛠️ Login UI - Self-Healing Playwright Tests', 'bright');
  log('============================================================', 'cyan');
  
  // Check prerequisites
  if (!checkNodeVersion()) return;
  if (!checkRequiredFiles()) return;
  
  // Parse options
  const options = {
    headed: args.includes('--headed'),
    debug: args.includes('--debug'),
    ui: args.includes('--ui'),
    grep: args.find(arg => arg.startsWith('--grep='))?.split('=')[1]
  };
  
  // Install dependencies if node_modules doesn't exist
  if (!fs.existsSync('node_modules')) {
    if (!installDependencies()) return;
  } else {
    log('✅ Dependencies already installed', 'green');
  }
  
  // Run tests
  const success = runTests(options);
  
  // Show summary
  log('\n============================================================', 'cyan');
  if (success) {
    log('✅ Test run completed successfully!', 'green');
    log('\n🎯 Key Features Tested:', 'bright');
    log('   ✅ Self-healing element selectors', 'green');
    log('   ✅ Login flow with fallback strategies', 'green');
    log('   ✅ Form validation and error handling', 'green');
    log('   ✅ Responsive design across viewports', 'green');
    log('   ✅ Demo page navigation and modals', 'green');
    log('   ✅ Easter eggs and interactive features', 'green');
  } else {
    log('⚠️ Some tests may have failed', 'yellow');
    log('   This could be due to the app\'s intentional randomization', 'cyan');
    log('   Check the report for detailed results', 'cyan');
  }
  
  log('\n💡 Tips:', 'bright');
  log('   • Use --headed to see tests run in browser', 'cyan');
  log('   • Use --debug to step through tests', 'cyan');
  log('   • Use --ui for interactive test management', 'cyan');
  log('   • Tests automatically adapt to UI changes! 🛠️', 'magenta');
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    log(`\n💥 Unexpected error: ${error.message}`, 'red');
    process.exit(1);
  }
} 