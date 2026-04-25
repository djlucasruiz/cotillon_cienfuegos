#!/bin/bash
# ==============================================
# SETUP SCRIPT — Online Party Store
# Run this from the root of your project folder
# ==============================================

echo "✅ Initializing Git repository..."
git init

echo "✅ Adding all files..."
git add .

echo "✅ Creating initial commit..."
git commit -m "feat: initial commit — Online Party Store"

echo ""
echo "👉 Now create a new repository on GitHub:"
echo "   https://github.com/new"
echo ""
echo "Then run:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/online-party-store.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "🎉 Done! Your project will be ready on GitHub."
