#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# Push Script — Beauty Care by Nabila Lahore
# ═══════════════════════════════════════════════════════════════════════════════
# This script pushes the project to the isolated GitHub repository.
# Run this from the project root directory.
#
# Usage:
#   1. Make executable: chmod +x push-to-github.sh
#   2. Set your GitHub token: export GITHUB_TOKEN=ghp_your_token_here
#   3. Run: ./push-to-github.sh
#
# To create a GitHub Personal Access Token:
#   https://github.com/settings/tokens/new?scopes=repo
# ═══════════════════════════════════════════════════════════════════════════════

set -e

REPO_URL="https://github.com/hamzajugnu786-tech/beauty-care-by-nabila.git"
BRANCH="main"

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  Beauty Care by Nabila Lahore — GitHub Push Script         ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GITHUB_TOKEN environment variable not set."
    echo ""
    echo "To set it, run:"
    echo "  export GITHUB_TOKEN=ghp_your_token_here"
    echo ""
    echo "To create a token, visit:"
    echo "  https://github.com/settings/tokens/new?scopes=repo"
    echo ""
    echo "Alternative: Use SSH instead"
    echo "  1. Set up SSH key: https://docs.github.com/en/authentication"
    echo "  2. Change remote: git remote set-url origin git@github.com:hamzajugnu786-tech/beauty-care-by-nabila.git"
    echo "  3. Push: git push -u origin main"
    exit 1
fi

echo "✅ GITHUB_TOKEN found"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Not a git repository. Run this from the project root."
    exit 1
fi

# Check if remote is configured
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")
if [ "$CURRENT_REMOTE" != "$REPO_URL" ]; then
    echo "Setting remote origin to: $REPO_URL"
    if [ -n "$CURRENT_REMOTE" ]; then
        git remote set-url origin "$REPO_URL"
    else
        git remote add origin "$REPO_URL"
    fi
else
    echo "✅ Remote origin already configured"
fi

# Authenticate with token
AUTH_URL="https://hamzajugnu786-tech:${GITHUB_TOKEN}@github.com/hamzajugnu786-tech/beauty-care-by-nabila.git"
git remote set-url origin "$AUTH_URL"

echo ""
echo "📦 Pushing to GitHub..."
echo "   Branch: $BRANCH"
echo "   Repository: hamzajugnu786-tech/beauty-care-by-nabila"
echo ""

# Push
git push -u origin "$BRANCH"

# Reset to public URL (remove token from remote)
git remote set-url origin "$REPO_URL"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  ✅ Push completed successfully!                            ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "  1. Verify the repository at: https://github.com/hamzajugnu786-tech/beauty-care-by-nabila"
echo "  2. Connect to Vercel: https://vercel.com/new"
echo "  3. Add environment variables in Vercel dashboard"
echo "  4. See docs/DEPLOYMENT.md for detailed instructions"
