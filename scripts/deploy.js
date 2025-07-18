#!/usr/bin/env node

/**
 * Comprehensive deployment script for Cloudflare Workers
 * Usage: npm run deploy [environment]
 * Example: npm run deploy staging
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const ENVIRONMENTS = {
  staging: {
    name: 'film-screening-app-staging',
    wranglerEnv: 'staging'
  },
  production: {
    name: 'film-screening-app-prod',
    wranglerEnv: 'production'
  }
};

function runCommand(command, description, options = {}) {
  console.log(`🔄 ${description}...`);
  
  try {
    const result = execSync(command, {
      stdio: options.silent ? 'pipe' : 'inherit',
      encoding: 'utf8',
      ...options
    });
    
    console.log(`✅ ${description} completed`);
    return result;
  } catch (error) {
    console.error(`❌ ${description} failed:`);
    console.error(error.message);
    
    if (options.exitOnError !== false) {
      process.exit(1);
    }
    
    return null;
  }
}

function checkPrerequisites() {
  console.log('🔍 Checking prerequisites...');
  
  // Check if wrangler is installed
  try {
    execSync('wrangler --version', { stdio: 'ignore' });
    console.log('✅ Wrangler CLI is available');
  } catch (error) {
    console.error('❌ Wrangler CLI is not installed');
    console.log('Install it with: npm install -g wrangler');
    process.exit(1);
  }
  
  // Check if we're logged in to Cloudflare
  try {
    execSync('wrangler whoami', { stdio: 'ignore' });
    console.log('✅ Authenticated with Cloudflare');
  } catch (error) {
    console.error('❌ Not authenticated with Cloudflare');
    console.log('Login with: wrangler login');
    process.exit(1);
  }
  
  // Check if package.json exists
  if (!existsSync('package.json')) {
    console.error('❌ package.json not found');
    process.exit(1);
  }
  
  // Check if wrangler.toml exists
  if (!existsSync('wrangler.toml')) {
    console.error('❌ wrangler.toml not found');
    process.exit(1);
  }
  
  console.log('✅ All prerequisites met\n');
}

async function confirmDeployment(environment) {
  const envConfig = ENVIRONMENTS[environment];
  
  console.log(`🚀 Deployment Configuration`);
  console.log(`Environment: ${environment}`);
  console.log(`Worker Name: ${envConfig.name}`);
  console.log(`Wrangler Env: ${envConfig.wranglerEnv}`);
  
  const confirm = await question('\nProceed with deployment? (y/N): ');
  
  if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
    console.log('❌ Deployment cancelled');
    process.exit(0);
  }
}

function buildApplication() {
  console.log('\n📦 Building application...');
  
  // Clean previous build
  runCommand('npm run clean', 'Cleaning previous build');
  
  // Build TinaCMS
  runCommand('npm run tina:build', 'Building TinaCMS');
  
  // Build client
  runCommand('npm run build:client', 'Building client application');
  
  // Build server
  runCommand('npm run build:server', 'Building server application');
  
  // Verify build outputs
  const requiredPaths = [
    'dist/client/index.html',
    'dist/server/index.js'
  ];
  
  for (const path of requiredPaths) {
    if (!existsSync(path)) {
      console.error(`❌ Required build output missing: ${path}`);
      process.exit(1);
    }
  }
  
  console.log('✅ Build completed successfully\n');
}

function deployToCloudflare(environment) {
  console.log(`\n🚀 Deploying to ${environment}...`);
  
  const envConfig = ENVIRONMENTS[environment];
  const deployCommand = `wrangler deploy --env ${envConfig.wranglerEnv}`;
  
  runCommand(deployCommand, `Deploying to ${environment}`);
  
  console.log(`✅ Deployment to ${environment} completed\n`);
}

async function runHealthCheck(environment) {
  console.log('\n🏥 Running health check...');
  
  // Wait a moment for deployment to propagate
  console.log('⏳ Waiting for deployment to propagate...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  try {
    // Try to run health check if the script exists
    if (existsSync('scripts/health-check.js')) {
      const envConfig = ENVIRONMENTS[environment];
      const healthUrl = `https://${envConfig.name}.your-domain.workers.dev`;
      
      runCommand(
        `node scripts/health-check.js ${healthUrl}`,
        'Running health check',
        { exitOnError: false }
      );
    } else {
      console.log('⚠️  Health check script not found, skipping...');
    }
  } catch (error) {
    console.warn('⚠️  Health check failed, but deployment may still be successful');
  }
}

function displayPostDeploymentInfo(environment) {
  const envConfig = ENVIRONMENTS[environment];
  
  console.log('\n🎉 Deployment Summary');
  console.log('='.repeat(30));
  console.log(`Environment: ${environment}`);
  console.log(`Worker Name: ${envConfig.name}`);
  console.log(`URL: https://${envConfig.name}.your-domain.workers.dev`);
  
  console.log('\n📋 Next Steps:');
  console.log('1. Update your domain DNS if needed');
  console.log('2. Test the application thoroughly');
  console.log('3. Monitor logs: wrangler tail --env ' + envConfig.wranglerEnv);
  console.log('4. Check metrics in Cloudflare dashboard');
  
  if (environment === 'staging') {
    console.log('\n🚀 Ready for production?');
    console.log('   npm run deploy production');
  }
}

async function main() {
  console.log('🚀 Cloudflare Workers Deployment');
  console.log('='.repeat(35));
  
  // Get environment from command line
  let environment = process.argv[2];
  
  if (!environment) {
    console.log('\nAvailable environments:');
    Object.keys(ENVIRONMENTS).forEach(env => {
      console.log(`  - ${env}`);
    });
    
    environment = await question('\nWhich environment to deploy? (staging/production): ');
  }
  
  environment = environment.toLowerCase();
  
  if (!ENVIRONMENTS[environment]) {
    console.error('❌ Invalid environment. Use: staging or production');
    process.exit(1);
  }
  
  try {
    // Pre-deployment checks
    checkPrerequisites();
    await confirmDeployment(environment);
    
    // Build and deploy
    buildApplication();
    deployToCloudflare(environment);
    
    // Post-deployment
    await runHealthCheck(environment);
    displayPostDeploymentInfo(environment);
    
    console.log('\n✅ Deployment completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main().catch(console.error);