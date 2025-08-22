# GitHub Setup Instructions

## Step 1: Create GitHub Repository

1. Go to https://github.com and sign in
2. Click the "+" icon in top right → "New repository"
3. Repository settings:
   - Repository name: `Bill-Layne-Insurance-Documents`
   - Description: "Insurance document generator and PDF template library"
   - Set to Public (for GitHub Pages) or Private (if preferred)
   - DO NOT initialize with README (we already have one)
   - Click "Create repository"

## Step 2: Connect Local Repository to GitHub

Run these commands in your terminal:

```bash
# Navigate to the project directory
cd "/home/lknwake50/Bill Layne Insurance Github Repository/Document Generator/Bill-Layne-Insurance-Documents"

# Add your GitHub repository as the remote origin
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/Bill-Layne-Insurance-Documents.git

# Push the code to GitHub
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section in the left sidebar
4. Under "Source", select:
   - Deploy from a branch
   - Branch: main
   - Folder: / (root)
5. Click "Save"
6. Wait 2-5 minutes for deployment

Your site will be available at:
```
https://YOUR_USERNAME.github.io/Bill-Layne-Insurance-Documents/
```

## Step 4: Update Configuration

Edit `/js/scripts.js` and update line 65:

```javascript
const repoConfig = {
  username: 'YOUR_GITHUB_USERNAME',  // ← Change this
  repository: 'Bill-Layne-Insurance-Documents',
  branch: 'main'
};
```

Then commit and push the change:

```bash
git add js/scripts.js
git commit -m "Update GitHub username in configuration"
git push
```

## Step 5: Add PDF Files (Optional)

To add PDF templates:

1. Place PDF files in appropriate folders:
   - `/pdf-templates/acord-forms/`
   - `/pdf-templates/state-forms/`
   - `/pdf-templates/company-forms/`

2. Update `/js/scripts.js` with PDF metadata

3. Commit and push:
```bash
git add .
git commit -m "Add PDF templates"
git push
```

## Troubleshooting

### Permission Denied Error
If you get a permission error when pushing:
```bash
# Use personal access token instead of password
# Go to GitHub Settings → Developer settings → Personal access tokens
# Generate new token with 'repo' scope
# Use token as password when prompted
```

### GitHub Pages Not Working
- Check repository settings → Pages is enabled
- Verify branch name is 'main' not 'master'
- Wait up to 10 minutes for initial deployment
- Check https://YOUR_USERNAME.github.io/Bill-Layne-Insurance-Documents/

### Files Not Updating
- Clear browser cache (Ctrl+Shift+R)
- Check GitHub Actions tab for deployment status
- Verify changes were pushed successfully

## Support

For technical issues:
- Check GitHub documentation: https://docs.github.com
- Repository issues: Create an issue in the repository

For insurance-related questions:
- Bill Layne Insurance Agency
- (336) 835-1993
- Save@BillLayneInsurance.com