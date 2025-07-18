#!/usr/bin/env node

/**
 * Content Sync Script for Git-based CMS workflow
 * This script helps manage content changes and Git commits
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONTENT_DIR = path.join(__dirname, '..', 'content');

function validateContentFiles() {
  console.log('🔍 Validating content files...');
  
  const requiredFiles = [
    'content/pages/homepage.json',
    'content/faq/faq.json'
  ];
  
  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, '..', file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Missing required file: ${file}`);
      process.exit(1);
    }
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      JSON.parse(content);
      console.log(`✅ Valid JSON: ${file}`);
    } catch (error) {
      console.error(`❌ Invalid JSON in ${file}:`, error.message);
      process.exit(1);
    }
  }
  
  console.log('✅ All content files are valid');
}

function commitContentChanges(message) {
  console.log('📝 Committing content changes...');
  
  try {
    // Add content files to git
    execSync('git add content/', { stdio: 'inherit' });
    
    // Check if there are changes to commit
    const status = execSync('git status --porcelain content/', { encoding: 'utf8' });
    
    if (status.trim() === '') {
      console.log('ℹ️  No content changes to commit');
      return;
    }
    
    // Commit changes
    const commitMessage = message || `Update content - ${new Date().toISOString()}`;
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    
    console.log('✅ Content changes committed successfully');
  } catch (error) {
    console.error('❌ Error committing changes:', error.message);
    process.exit(1);
  }
}

// Main execution
const command = process.argv[2];
const message = process.argv[3];

switch (command) {
  case 'validate':
    validateContentFiles();
    break;
  case 'commit':
    validateContentFiles();
    commitContentChanges(message);
    break;
  default:
    console.log(`
Usage: node scripts/content-sync.js <command> [message]

Commands:
  validate    Validate all content files
  commit      Validate and commit content changes
  
Examples:
  node scripts/content-sync.js validate
  node scripts/content-sync.js commit "Update homepage hero section"
    `);
}