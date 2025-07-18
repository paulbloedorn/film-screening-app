# TinaCMS Setup Guide for Cloudflare Workers

This guide explains how to set up TinaCMS for content management with your Cloudflare Workers deployment.

## Current Status

✅ **Local Development Mode**: Currently configured for local file-based content management  
⚠️ **Production Mode**: Requires TinaCMS Cloud credentials for full functionality

## Option 1: TinaCMS Cloud Setup (Recommended for Production)

### Step 1: Create TinaCMS Cloud Account
1. Visit [https://app.tina.io](https://app.tina.io)
2. Sign up for a free account
3. Create a new project

### Step 2: Get Your Credentials
After creating your project, you'll receive:
- **Client ID**: `NEXT_PUBLIC_TINA_CLIENT_ID`
- **Token**: `TINA_TOKEN`
- **Search Token** (optional): `TINA_SEARCH_TOKEN`

### Step 3: Set Environment Variables

#### For Local Development
Update your `.env.local` file:
```bash
NEXT_PUBLIC_TINA_CLIENT_ID=your_actual_client_id_here
TINA_TOKEN=your_actual_token_here
TINA_SEARCH_TOKEN=your_actual_search_token_here
VITE_TINA_CLIENT_ID=your_actual_client_id_here
```

#### For Cloudflare Workers Production
Set secrets using Wrangler CLI:
```bash
# Set the required secrets
wrangler secret put NEXT_PUBLIC_TINA_CLIENT_ID
wrangler secret put TINA_TOKEN
wrangler secret put TINA_SEARCH_TOKEN

# Optional: Set for staging environment
wrangler secret put NEXT_PUBLIC_TINA_CLIENT_ID --env staging
wrangler secret put TINA_TOKEN --env staging
```

### Step 4: Build and Deploy
```bash
# Build with TinaCMS Cloud
npm run build

# Deploy to Cloudflare Workers
npm run deploy
```

## Option 2: Local File-Based Management (Current Setup)

### Current Features
- ✅ Direct JSON file editing
- ✅ Simple admin interface at `/admin`
- ✅ Works without external dependencies
- ✅ Perfect for development and testing

### Content Files Location
- Homepage: `content/pages/homepage.json`
- FAQ: `content/faq/faq.json`

### Admin Interface
Access the local admin interface at: `http://localhost:8787/admin`

## Build Commands

### Development
```bash
# Start development server with TinaCMS
npm run dev

# Start Workers-only development (no TinaCMS)
npm run dev:workers
```

### Production Builds
```bash
# Smart build (auto-detects TinaCMS credentials)
npm run build

# Workers-only build (no TinaCMS)
npm run build:workers
```

### Deployment
```bash
# Deploy with TinaCMS (if credentials available)
npm run deploy

# Deploy Workers-only
npm run deploy:workers
```

## Verification

Check your setup status:
```bash
npm run tina:check
```

## Troubleshooting

### TinaCMS Build Fails
If you see "Client not configured properly" error:
1. Verify your environment variables are set correctly
2. Use `npm run build:workers` for deployment without TinaCMS
3. Set up TinaCMS Cloud credentials following Option 1

### Admin Interface Not Working
1. Ensure the build completed successfully
2. Check that `/admin` route is accessible
3. Verify assets are being served correctly

### Content Not Loading
1. Check that content files exist in `content/` directory
2. Verify JSON syntax is valid
3. Ensure TinaCMS schema matches your content structure

## Next Steps

1. **For Production**: Set up TinaCMS Cloud credentials (Option 1)
2. **For Development**: Current local setup works perfectly
3. **For Testing**: Use `npm run build:workers` for quick deployments

## Support

- TinaCMS Documentation: [https://tina.io/docs](https://tina.io/docs)
- Cloudflare Workers: [https://developers.cloudflare.com/workers](https://developers.cloudflare.com/workers)
- Project Issues: Check the repository issues section