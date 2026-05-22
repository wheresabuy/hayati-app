#!/bin/bash

# HAYATI AUTO-DEPLOY SCRIPT
# This script automates the build and deployment process to Vercel.

echo "🚀 Starting Hayati Auto-Deploy Process..."

# 1. Install dependencies (optional but recommended for consistency)
# echo "📦 Installing dependencies..."
# npm install

# 2. Build the project
echo "🏗️ Building the application..."
if npm run build; then
  echo "✅ Build successful!"
else
  echo "❌ Build failed. Aborting deployment."
  exit 1
fi

# 3. Deploy to Vercel
echo "☁️ Deploying to Vercel..."
if npx vercel@latest --prod --yes; then
  echo "🚀 Deployment successful! Your app is live."
else
  echo "❌ Vercel deployment failed."
  exit 1
fi

echo "✨ All tasks completed successfully."
