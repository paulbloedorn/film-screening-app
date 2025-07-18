#!/usr/bin/env node

/**
 * Comprehensive build script for Cloudflare Workers deployment
 * Handles frontend + backend bundling with proper asset management
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, cpSync, rmSync, writeFileSync } from 'fs';
import path from 'path';

function runCommand(command, description, options = {}) {
  console.log(`🔄 ${description}...`);
  
  try {
    const result = execSync(command, {
      stdio: options.silent ? 'pipe' : 'inherit',
      encoding: 'utf8',
      cwd: options.cwd || process.cwd(),
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
    
    throw error;
  }
}

function ensureDirectoryExists(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

function cleanBuildDirectory() {
  console.log('🧹 Cleaning build directory...');
  
  if (existsSync('dist')) {
    rmSync('dist', { recursive: true, force: true });
    console.log('✅ Cleaned dist directory');
  }
  
  // Ensure dist directories exist
  ensureDirectoryExists('dist/client');
  ensureDirectoryExists('dist/server');
}

function buildTinaCMS() {
  console.log('\n📝 Building TinaCMS...');
  
  // Check if TinaCMS is configured
  if (!existsSync('tina/config.ts')) {
    console.log('⚠️  TinaCMS config not found, skipping TinaCMS build');
    return;
  }
  
  // Try to build TinaCMS, but don't fail the entire build if it fails
  try {
    runCommand('npx tinacms build', 'Building TinaCMS schema and admin interface', { exitOnError: false });
    
    // Copy TinaCMS admin build to dist if it exists
    const tinaAdminPath = 'tina/__generated__/admin';
    if (existsSync(tinaAdminPath)) {
      const targetPath = 'dist/client/admin';
      ensureDirectoryExists(targetPath);
      cpSync(tinaAdminPath, targetPath, { recursive: true });
      console.log('✅ Copied TinaCMS admin interface to dist');
    }
  } catch (error) {
    console.warn('⚠️  TinaCMS build failed, but continuing with deployment');
    console.warn('   This may be due to missing TinaCMS credentials');
    console.warn('   The application will still work, but CMS features may be limited');
    
    // Create a placeholder admin directory so the worker doesn't fail
    const targetPath = 'dist/client/admin';
    ensureDirectoryExists(targetPath);
    
    // Create a simple placeholder index.html
    const placeholderHtml = `<!DOCTYPE html>
<html>
<head>
    <title>TinaCMS Admin</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
        <div style="text-align: center;">
            <h1>TinaCMS Admin</h1>
            <p>TinaCMS is not configured or credentials are missing.</p>
            <p>Please configure TinaCMS credentials to enable content management.</p>
        </div>
    </div>
</body>
</html>`;
    
    writeFileSync(path.join(targetPath, 'index.html'), placeholderHtml);
    console.log('✅ Created placeholder admin interface');
  }
}

function buildClientApplication() {
  console.log('\n🎨 Building client application...');
  
  // Build the React client application
  runCommand('npx vite build', 'Building client with Vite');
  
  // Verify client build output
  const requiredClientFiles = [
    'dist/client/index.html',
    'dist/client/assets'
  ];
  
  for (const file of requiredClientFiles) {
    if (!existsSync(file)) {
      console.error(`❌ Required client build output missing: ${file}`);
      process.exit(1);
    }
  }
  
  console.log('✅ Client build completed successfully');
}

function buildServerApplication() {
  console.log('\n⚙️  Building server application...');
  
  // Compile TypeScript server code
  runCommand('npx tsc --project tsconfig.server.json', 'Compiling server TypeScript');
  
  // Verify server build output
  const requiredServerFiles = [
    'dist/server/index.js'
  ];
  
  for (const file of requiredServerFiles) {
    if (!existsSync(file)) {
      console.error(`❌ Required server build output missing: ${file}`);
      process.exit(1);
    }
  }
  
  console.log('✅ Server build completed successfully');
}

function copyStaticAssets() {
  console.log('\n📋 Copying static assets...');
  
  // Copy any additional static assets that might be needed
  const staticAssetPaths = [
    { src: 'attached_assets', dest: 'dist/client/attached_assets' },
    { src: 'content', dest: 'dist/client/content' }
  ];
  
  for (const { src, dest } of staticAssetPaths) {
    if (existsSync(src)) {
      ensureDirectoryExists(path.dirname(dest));
      cpSync(src, dest, { recursive: true });
      console.log(`✅ Copied ${src} to ${dest}`);
    } else {
      console.log(`⚠️  Static asset path not found: ${src}, skipping`);
    }
  }
}

function validateBuild() {
  console.log('\n🔍 Validating build output...');
  
  const criticalFiles = [
    'dist/client/index.html',
    'dist/server/index.js',
    'wrangler.toml'
  ];
  
  let allValid = true;
  
  for (const file of criticalFiles) {
    if (existsSync(file)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.error(`❌ Critical file missing: ${file}`);
      allValid = false;
    }
  }
  
  if (!allValid) {
    console.error('❌ Build validation failed');
    process.exit(1);
  }
  
  console.log('✅ Build validation passed');
}

function displayBuildSummary() {
  console.log('\n📊 Build Summary');
  console.log('='.repeat(20));
  
  try {
    // Get build sizes
    const clientSize = execSync('du -sh dist/client', { encoding: 'utf8' }).split('\t')[0];
    const serverSize = execSync('du -sh dist/server', { encoding: 'utf8' }).split('\t')[0];
    
    console.log(`Client bundle size: ${clientSize}`);
    console.log(`Server bundle size: ${serverSize}`);
  } catch (error) {
    console.log('Could not determine bundle sizes');
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Test locally: npm run preview');
  console.log('2. Deploy to staging: npm run deploy:staging');
  console.log('3. Deploy to production: npm run deploy:production');
}

async function main() {
  console.log('📦 Cloudflare Workers Build Process');
  console.log('='.repeat(40));
  
  const startTime = Date.now();
  
  try {
    // Build steps
    cleanBuildDirectory();
    buildTinaCMS();
    buildClientApplication();
    buildServerApplication();
    copyStaticAssets();
    validateBuild();
    
    const buildTime = Math.round((Date.now() - startTime) / 1000);
    
    console.log(`\n✅ Build completed successfully in ${buildTime}s`);
    displayBuildSummary();
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);