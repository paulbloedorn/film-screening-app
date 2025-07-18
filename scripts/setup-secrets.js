#!/usr/bin/env node

/**
 * Script to help set up Cloudflare Workers secrets for different environments
 * Usage: npm run secrets:setup [environment]
 * Example: npm run secrets:setup staging
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const REQUIRED_SECRETS = {
  development: [
    // Development uses local env vars, no secrets needed
  ],
  staging: [
    'DATABASE_URL',
    'TINA_TOKEN',
    'NEXT_PUBLIC_TINA_CLIENT_ID',
    'DASHBOARD_JWT_SECRET'
  ],
  production: [
    'DATABASE_URL',
    'TINA_TOKEN',
    'NEXT_PUBLIC_TINA_CLIENT_ID',
    'DASHBOARD_JWT_SECRET',
    'GA_MEASUREMENT_ID'
  ]
};

const OPTIONAL_SECRETS = {
  staging: ['GA_MEASUREMENT_ID'],
  production: []
};

async function checkWranglerInstalled() {
  try {
    execSync('wrangler --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.error('❌ Wrangler CLI is not installed or not in PATH');
    console.log('Install it with: npm install -g wrangler');
    return false;
  }
}

async function listExistingSecrets(env) {
  try {
    const envFlag = env === 'production' ? '--env production' : env === 'staging' ? '--env staging' : '';
    const result = execSync(`wrangler secret list ${envFlag}`, { encoding: 'utf8' });
    
    // Parse the output to extract secret names
    const lines = result.split('\n');
    const secrets = [];
    
    for (const line of lines) {
      // Look for lines that contain secret names (skip headers and empty lines)
      if (line.includes('│') && !line.includes('Secret Name') && !line.includes('───')) {
        const parts = line.split('│').map(part => part.trim()).filter(part => part);
        if (parts.length > 0 && parts[0]) {
          secrets.push(parts[0]);
        }
      }
    }
    
    return secrets;
  } catch (error) {
    console.warn(`⚠️  Could not list existing secrets for ${env}: ${error.message}`);
    return [];
  }
}

async function setSecret(name, env) {
  const envFlag = env === 'production' ? '--env production' : env === 'staging' ? '--env staging' : '';
  
  try {
    console.log(`\n🔐 Setting secret: ${name} for ${env}`);
    console.log('Please enter the value when prompted by wrangler...');
    
    execSync(`wrangler secret put ${name} ${envFlag}`, { 
      stdio: 'inherit',
      encoding: 'utf8'
    });
    
    console.log(`✅ Successfully set ${name}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to set ${name}: ${error.message}`);
    return false;
  }
}

async function setupEnvironmentSecrets(env) {
  console.log(`\n🚀 Setting up secrets for ${env} environment`);
  
  const requiredSecrets = REQUIRED_SECRETS[env] || [];
  const optionalSecrets = OPTIONAL_SECRETS[env] || [];
  
  if (requiredSecrets.length === 0) {
    console.log(`ℹ️  No secrets required for ${env} environment`);
    return true;
  }
  
  // List existing secrets
  console.log('📋 Checking existing secrets...');
  const existingSecrets = await listExistingSecrets(env);
  
  if (existingSecrets.length > 0) {
    console.log('Existing secrets:', existingSecrets.join(', '));
  }
  
  // Set required secrets
  console.log(`\n📝 Required secrets for ${env}:`);
  for (const secret of requiredSecrets) {
    const exists = existingSecrets.includes(secret);
    console.log(`  - ${secret} ${exists ? '(already exists)' : '(missing)'}`);
  }
  
  for (const secret of requiredSecrets) {
    const exists = existingSecrets.includes(secret);
    
    if (exists) {
      const update = await question(`${secret} already exists. Update it? (y/N): `);
      if (update.toLowerCase() !== 'y' && update.toLowerCase() !== 'yes') {
        continue;
      }
    }
    
    const success = await setSecret(secret, env);
    if (!success) {
      console.error(`❌ Failed to set required secret ${secret}. Deployment may fail.`);
    }
  }
  
  // Set optional secrets
  if (optionalSecrets.length > 0) {
    console.log(`\n📝 Optional secrets for ${env}:`);
    for (const secret of optionalSecrets) {
      const exists = existingSecrets.includes(secret);
      const setup = await question(`Set up ${secret}? ${exists ? '(already exists) ' : ''}(y/N): `);
      
      if (setup.toLowerCase() === 'y' || setup.toLowerCase() === 'yes') {
        await setSecret(secret, env);
      }
    }
  }
  
  return true;
}

async function main() {
  console.log('🔧 Cloudflare Workers Secrets Setup');
  console.log('=====================================');
  
  // Check if wrangler is installed
  if (!(await checkWranglerInstalled())) {
    process.exit(1);
  }
  
  // Get environment from command line or prompt
  let environment = process.argv[2];
  
  if (!environment) {
    console.log('\nAvailable environments:');
    console.log('  - staging');
    console.log('  - production');
    console.log('  - development (no secrets needed)');
    
    environment = await question('\nWhich environment? (staging/production): ');
  }
  
  environment = environment.toLowerCase();
  
  if (!['development', 'staging', 'production'].includes(environment)) {
    console.error('❌ Invalid environment. Use: development, staging, or production');
    process.exit(1);
  }
  
  try {
    await setupEnvironmentSecrets(environment);
    console.log(`\n✅ Secrets setup completed for ${environment} environment`);
    console.log('\n📋 Next steps:');
    console.log(`   1. Test deployment: npm run deploy:${environment}`);
    console.log(`   2. Check health: npm run health:check`);
    
  } catch (error) {
    console.error('❌ Error setting up secrets:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main().catch(console.error);