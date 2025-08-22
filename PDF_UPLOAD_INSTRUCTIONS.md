# How to Add PDF Files to Your Document Generator

## Step 1: Download Your PDF Files

1. Download your PDF files to your computer
2. Name them using lowercase with hyphens (no spaces):
   - ✅ Good: `acord-25-certificate.pdf`
   - ❌ Bad: `ACORD 25 Certificate.PDF`

## Step 2: Add PDFs to Your Local Repository

### On Windows:
1. Navigate to your repository folder:
   ```
   Bill-Layne-Insurance-Documents\pdf-templates\
   ```

2. Place PDFs in the correct subfolder:
   - **ACORD forms** → `acord-forms\`
   - **State forms** (DL-123, FS-1) → `state-forms\`
   - **Company forms** → `company-forms\`

### On Mac/Linux:
```bash
cd /path/to/Bill-Layne-Insurance-Documents/pdf-templates/
# Copy PDFs to appropriate folders
cp ~/Downloads/acord-25.pdf acord-forms/
cp ~/Downloads/dl-123.pdf state-forms/
```

## Step 3: Update the PDF List in scripts.js

Edit `/js/scripts.js` and find the `pdfTemplates` object (around line 8).

The PDFs are already configured for these common forms:

### ACORD Forms (already configured):
- acord-25-certificate.pdf
- acord-35-cancellation.pdf
- acord-27-property.pdf

### State Forms (already configured):
- dl-123-form.pdf
- fs-1-form.pdf
- dh-14-termination.pdf

If your PDF filename matches these exactly, no changes needed!

## Step 4: If Adding New PDFs (different names)

Update the configuration in `/js/scripts.js`:

```javascript
const pdfTemplates = {
  'acord': [
    {
      id: 'acord-25',
      name: 'ACORD 25 - Certificate of Liability Insurance',
      filename: 'YOUR-ACTUAL-FILENAME.pdf',  // ← Change this to match your file
      category: 'acord',
      description: 'Standard certificate of liability insurance',
      fillable: false
    },
    // Add more PDFs here
  ]
};
```

## Step 5: Commit and Push to GitHub

```bash
# Add all PDFs
git add pdf-templates/

# Commit
git commit -m "Add PDF templates for ACORD and state forms"

# Push to GitHub
git push
```

## Step 6: Test Your PDFs

1. Open your site: https://billlayne.github.io/Document-Generator/
2. Click "PDF Templates" tab
3. Your PDFs should appear in the grid
4. Test View, Download, and Print functions

## Common PDF Files You Might Add:

### ACORD Forms:
- `acord-25-certificate.pdf` - Certificate of Liability
- `acord-35-cancellation.pdf` - Cancellation Request
- `acord-27-property.pdf` - Evidence of Property Insurance
- `acord-28-evidence.pdf` - Evidence of Commercial Property
- `acord-125-commercial.pdf` - Commercial Insurance Application
- `acord-130-homeowner.pdf` - Homeowner Application
- `acord-140-property-section.pdf` - Property Section

### NC State Forms:
- `dl-123-form.pdf` - Driver License Insurance Certification
- `fs-1-form.pdf` - Financial Responsibility
- `dh-14-termination.pdf` - Notice of Termination
- `mvr-619.pdf` - Insurance Information Request

### Company Forms:
- `nationwide-auto-app.pdf`
- `nationwide-home-app.pdf`
- `progressive-auto-app.pdf`
- `progressive-home-app.pdf`
- `travelers-app.pdf`
- `national-general-app.pdf`

## File Size Tips:
- Keep PDFs under 5MB for faster loading
- Use Adobe Acrobat's "Reduce File Size" option if needed
- Or use online tools like SmallPDF to compress

## Troubleshooting:

### PDFs not showing up?
- Check filename matches exactly in scripts.js
- Ensure PDFs are in correct subfolder
- Clear browser cache (Ctrl+Shift+R)
- Check GitHub Actions for deployment status

### PDFs not loading?
- Verify file was pushed to GitHub
- Check file permissions
- Try downloading directly from GitHub to test

## Need Help?
Contact Bill Layne Insurance Agency
- Phone: (336) 835-1993
- Email: Save@BillLayneInsurance.com