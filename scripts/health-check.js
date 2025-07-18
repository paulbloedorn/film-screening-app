#!/usr/bin/env node

/**
 * Health check script for deployed Cloudflare Workers application
 * Usage: npm run health:check [url]
 * Example: npm run health:check https://film-screening-app.your-domain.workers.dev
 */

import https from 'https';
import http from 'http';

const DEFAULT_URLS = {
  development: 'http://localhost:8787',
  staging: 'https://film-screening-app-staging.your-domain.workers.dev',
  production: 'https://film-screening-app-prod.your-domain.workers.dev'
};

async function makeRequest(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(url, {
      method: 'GET',
      timeout: timeout,
      headers: {
        'User-Agent': 'Health-Check-Script/1.0'
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
          responseTime: Date.now() - startTime
        });
      });
    });
    
    const startTime = Date.now();
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timeout after ${timeout}ms`));
    });
    
    req.end();
  });
}

async function checkEndpoint(url, expectedStatus = 200, description = '') {
  try {
    console.log(`🔍 Checking ${description || url}...`);
    const response = await makeRequest(url);
    
    const success = response.status === expectedStatus;
    const statusIcon = success ? '✅' : '❌';
    
    console.log(`${statusIcon} ${description || url}`);
    console.log(`   Status: ${response.status} (expected: ${expectedStatus})`);
    console.log(`   Response time: ${response.responseTime}ms`);
    
    if (response.headers['content-type']) {
      console.log(`   Content-Type: ${response.headers['content-type']}`);
    }
    
    // Try to parse JSON response for health endpoint
    if (url.includes('/health') || url.includes('/api/health')) {
      try {
        const healthData = JSON.parse(response.body);
        console.log(`   Environment: ${healthData.environment || 'unknown'}`);
        console.log(`   Version: ${healthData.version || 'unknown'}`);
        console.log(`   Timestamp: ${healthData.timestamp || 'unknown'}`);
      } catch (e) {
        // Not JSON or different format, that's okay
      }
    }
    
    return success;
  } catch (error) {
    console.log(`❌ ${description || url}`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function performHealthCheck(baseUrl) {
  console.log(`🏥 Health Check for: ${baseUrl}`);
  console.log('='.repeat(50));
  
  const checks = [
    {
      url: `${baseUrl}/health`,
      description: 'Health endpoint',
      expectedStatus: 200
    },
    {
      url: `${baseUrl}/api/health`,
      description: 'API health endpoint',
      expectedStatus: 200
    },
    {
      url: baseUrl,
      description: 'Main application',
      expectedStatus: 200
    },
    {
      url: `${baseUrl}/admin`,
      description: 'Admin interface',
      expectedStatus: 200
    },
    {
      url: `${baseUrl}/api/screening-requests`,
      description: 'API endpoint (may require auth)',
      expectedStatus: [200, 401, 403] // Accept auth errors as "working"
    }
  ];
  
  let passedChecks = 0;
  const totalChecks = checks.length;
  
  for (const check of checks) {
    const expectedStatuses = Array.isArray(check.expectedStatus) 
      ? check.expectedStatus 
      : [check.expectedStatus];
    
    try {
      const response = await makeRequest(check.url);
      const success = expectedStatuses.includes(response.status);
      
      const statusIcon = success ? '✅' : '❌';
      console.log(`${statusIcon} ${check.description}`);
      console.log(`   Status: ${response.status} (expected: ${expectedStatuses.join(' or ')})`);
      console.log(`   Response time: ${response.responseTime}ms`);
      
      if (success) {
        passedChecks++;
      }
      
      // Special handling for health endpoints
      if (check.url.includes('/health') && success) {
        try {
          const healthData = JSON.parse(response.body);
          console.log(`   Environment: ${healthData.environment || 'unknown'}`);
          console.log(`   Version: ${healthData.version || 'unknown'}`);
        } catch (e) {
          // Not JSON, that's okay
        }
      }
      
    } catch (error) {
      console.log(`❌ ${check.description}`);
      console.log(`   Error: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }
  
  // Summary
  console.log('📊 Health Check Summary');
  console.log('='.repeat(25));
  console.log(`Passed: ${passedChecks}/${totalChecks} checks`);
  
  const healthPercentage = Math.round((passedChecks / totalChecks) * 100);
  const healthIcon = healthPercentage >= 80 ? '🟢' : healthPercentage >= 50 ? '🟡' : '🔴';
  
  console.log(`Health: ${healthIcon} ${healthPercentage}%`);
  
  if (healthPercentage < 80) {
    console.log('\n⚠️  Some checks failed. Please review the deployment and configuration.');
    return false;
  } else {
    console.log('\n✅ Application appears to be healthy!');
    return true;
  }
}

async function main() {
  console.log('🏥 Cloudflare Workers Health Check');
  console.log('===================================\n');
  
  // Get URL from command line or use defaults
  let targetUrl = process.argv[2];
  
  if (!targetUrl) {
    console.log('Available default URLs:');
    Object.entries(DEFAULT_URLS).forEach(([env, url]) => {
      console.log(`  ${env}: ${url}`);
    });
    
    console.log('\nUsage: npm run health:check [url]');
    console.log('Example: npm run health:check https://your-app.workers.dev');
    console.log('\nUsing development URL as default...\n');
    
    targetUrl = DEFAULT_URLS.development;
  }
  
  // Remove trailing slash
  targetUrl = targetUrl.replace(/\/$/, '');
  
  try {
    const healthy = await performHealthCheck(targetUrl);
    process.exit(healthy ? 0 : 1);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);