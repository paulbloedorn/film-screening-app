#!/usr/bin/env node

/**
 * TinaCMS Setup Script for Cloudflare Workers
 * This script helps set up and configure TinaCMS for the project
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TINA_CONFIG_PATH = path.join(__dirname, '..', 'tina', 'config.ts');
const CONTENT_DIR = path.join(__dirname, '..', 'content');
const ADMIN_DIR = path.join(__dirname, '..', 'client', 'admin');

function checkTinaSetup() {
  console.log('🔍 Checking TinaCMS setup...');
  
  const checks = [
    {
      name: 'TinaCMS config file',
      path: TINA_CONFIG_PATH,
      required: true
    },
    {
      name: 'Content directory',
      path: CONTENT_DIR,
      required: true
    },
    {
      name: 'Admin directory',
      path: ADMIN_DIR,
      required: true
    },
    {
      name: 'Homepage content',
      path: path.join(CONTENT_DIR, 'pages', 'homepage.json'),
      required: true
    },
    {
      name: 'FAQ content',
      path: path.join(CONTENT_DIR, 'faq', 'faq.json'),
      required: true
    }
  ];
  
  let allGood = true;
  
  for (const check of checks) {
    if (fs.existsSync(check.path)) {
      console.log(`✅ ${check.name}: Found`);
    } else {
      console.log(`❌ ${check.name}: Missing`);
      if (check.required) {
        allGood = false;
      }
    }
  }
  
  // Check environment variables
  const envVars = [
    'NEXT_PUBLIC_TINA_CLIENT_ID',
    'TINA_TOKEN'
  ];
  
  console.log('\n🔍 Checking environment variables...');
  for (const envVar of envVars) {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar}: Set`);
    } else {
      console.log(`⚠️  ${envVar}: Not set (required for production)`);
    }
  }
  
  if (allGood) {
    console.log('\n✅ TinaCMS setup looks good!');
  } else {
    console.log('\n❌ TinaCMS setup has issues that need to be resolved.');
    process.exit(1);
  }
}

function buildTina() {
  console.log('🔨 Building TinaCMS...');
  
  try {
    // Check if we have credentials for cloud build
    if (process.env.NEXT_PUBLIC_TINA_CLIENT_ID && process.env.TINA_TOKEN) {
      console.log('📡 Building with TinaCMS Cloud...');
      execSync('npx tinacms build', { stdio: 'inherit' });
    } else {
      console.log('🏠 Building for local development...');
      console.log('ℹ️  TinaCMS Cloud credentials not found. Using local file-based content management.');
      
      // Ensure admin directory exists
      if (!fs.existsSync(ADMIN_DIR)) {
        fs.mkdirSync(ADMIN_DIR, { recursive: true });
      }
      
      // Create a simple admin interface placeholder
      const adminHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Content Management</title>
    <style>
        body { font-family: system-ui; padding: 2rem; max-width: 800px; margin: 0 auto; }
        .file-link { display: block; padding: 0.5rem; margin: 0.25rem 0; background: #f5f5f5; text-decoration: none; color: #333; border-radius: 4px; }
        .file-link:hover { background: #e5e5e5; }
    </style>
</head>
<body>
    <h1>Content Management</h1>
    <p>Manage your content files directly:</p>
    <div>
        <h3>Homepage Content</h3>
        <a href="../content/pages/homepage.json" class="file-link">📄 Homepage Content (JSON)</a>
        
        <h3>FAQ Content</h3>
        <a href="../content/faq/faq.json" class="file-link">❓ FAQ Content (JSON)</a>
    </div>
    
    <hr style="margin: 2rem 0;">
    
    <h3>Setup TinaCMS Cloud</h3>
    <p>To enable the full TinaCMS editing interface:</p>
    <ol>
        <li>Sign up at <a href="https://tina.io" target="_blank">tina.io</a></li>
        <li>Create a new project</li>
        <li>Set your environment variables:
            <ul>
                <li><code>NEXT_PUBLIC_TINA_CLIENT_ID</code></li>
                <li><code>TINA_TOKEN</code></li>
            </ul>
        </li>
        <li>Run <code>npm run tina:build</code></li>
    </ol>
</body>
</html>`;
      
      fs.writeFileSync(path.join(ADMIN_DIR, 'index.html'), adminHtml);
      console.log('✅ Local admin interface created');
    }
    
    console.log('✅ TinaCMS build completed');
  } catch (error) {
    console.error('❌ TinaCMS build failed:', error.message);
    process.exit(1);
  }
}

function initializeContent() {
  console.log('📝 Initializing content files...');
  
  // Ensure content directories exist
  const contentDirs = [
    path.join(CONTENT_DIR, 'pages'),
    path.join(CONTENT_DIR, 'faq')
  ];
  
  for (const dir of contentDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  }
  
  console.log('✅ Content initialization completed');
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'check':
    checkTinaSetup();
    break;
  case 'build':
    checkTinaSetup();
    buildTina();
    break;
  case 'init':
    initializeContent();
    checkTinaSetup();
    break;
  default:
    console.log(`
TinaCMS Setup Script

Usage: node scripts/setup-tinacms.js <command>

Commands:
  check    Check TinaCMS setup and configuration
  build    Build TinaCMS (with setup check)
  init     Initialize content directories and files
  
Examples:
  node scripts/setup-tinacms.js check
  node scripts/setup-tinacms.js build
  node scripts/setup-tinacms.js init
    `);
}