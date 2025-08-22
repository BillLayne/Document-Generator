# Bill Layne Insurance Document Generator & Resources

## Overview
A comprehensive web-based document generator and PDF template library for Bill Layne Insurance Agency. This tool streamlines the creation of insurance documents, provides access to commonly used forms, and integrates with email systems for efficient communication.

## Features

### 📄 Document Generator
- **Multiple Document Types**: Generate various insurance documents including:
  - Home Closing Packages (Declaration & Invoice)
  - Binder Letters
  - Mortgagee Change Letters
  - Cancellation Notices
  - Renewal Notices
  - Coverage Change Confirmations
  - Payment Receipts
  - Claim Information Sheets
  - DL-123 Driver License Insurance Certifications

### 📁 PDF Template Library
- Organized collection of frequently used forms
- Categories: ACORD forms, State forms, Company-specific forms
- Direct download, print, and email functionality

### 📧 Email Integration
- Direct Gmail integration for sending documents
- Multiple email format options (HTML, plain text, PDF)
- Pre-formatted email templates

### 💾 Data Management
- Save and load form data locally
- Auto-calculation of dates and premiums
- Smart field population

## Setup Instructions

### Local Development
1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/Bill-Layne-Insurance-Documents.git
cd Bill-Layne-Insurance-Documents
```

2. Open `index.html` in a web browser:
```bash
# On Windows
start index.html

# On Mac
open index.html

# On Linux
xdg-open index.html
```

### GitHub Pages Deployment
1. Push all files to GitHub:
```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

2. Enable GitHub Pages:
   - Go to Settings → Pages in your repository
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click Save

3. Access your site at:
```
https://YOUR_USERNAME.github.io/Bill-Layne-Insurance-Documents/
```

## Configuration

### Update GitHub Username
Edit `/js/scripts.js` and update the repository configuration:
```javascript
const repoConfig = {
  username: 'YOUR_GITHUB_USERNAME',
  repository: 'Bill-Layne-Insurance-Documents',
  branch: 'main'
};
```

### Adding PDF Templates
1. Place PDF files in the appropriate folder:
   - `/pdf-templates/acord-forms/` - ACORD standard forms
   - `/pdf-templates/state-forms/` - State-specific forms
   - `/pdf-templates/company-forms/` - Insurance company forms

2. Update the `pdfTemplates` object in `/js/scripts.js`:
```javascript
'acord': [
  {
    id: 'form-id',
    name: 'Form Name',
    filename: 'form-file.pdf',
    category: 'acord',
    description: 'Form description',
    fillable: false
  }
]
```

## Usage Guide

### Document Generator
1. Select document type from dropdown
2. Fill in required information
3. Click "Generate Documents"
4. Options: Print, Email, or Download

### PDF Templates
1. Click "PDF Templates" tab
2. Select category or browse all
3. View, download, or print forms

### Email Integration
When emailing documents:
1. Click "📧 Copy & Open Gmail"
2. Document is copied to clipboard
3. Gmail opens automatically
4. Paste (Ctrl+V) in email body

## File Structure
```
Bill-Layne-Insurance-Documents/
│
├── index.html                    # Main application file
├── css/
│   └── styles.css               # All styling
├── js/
│   └── scripts.js               # Application logic
├── pdf-templates/
│   ├── acord-forms/             # ACORD forms
│   ├── state-forms/             # State forms
│   └── company-forms/           # Company forms
├── .gitignore
├── README.md
└── LICENSE
```

## Browser Compatibility
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (limited support)

## Security Notes
- All data is stored locally in browser
- No sensitive information is transmitted
- PDF templates are hosted on GitHub
- Email integration uses clipboard API

## Troubleshooting

### Documents not generating
- Check all required fields are filled
- Verify date formats are correct
- Clear browser cache if needed

### Email copy not working
- Ensure browser allows clipboard access
- Try alternative email options
- Use download & attach method

### PDFs not loading
- Check file paths in configuration
- Verify PDFs are uploaded to GitHub
- Ensure proper file permissions

## Development

### Adding New Document Types
1. Add option to document selector
2. Create form section in HTML
3. Add template configuration
4. Create generation function
5. Test thoroughly

### Customizing Styles
Edit `/css/styles.css` to modify:
- Colors and branding
- Layout and spacing
- Print styles
- Responsive breakpoints

## Support

**Bill Layne Insurance Agency**
- 📍 1283 N Bridge St, Elkin, NC 28621
- 📞 (336) 835-1993
- 📧 Save@BillLayneInsurance.com

## Contributing
This is a private repository for Bill Layne Insurance Agency. For updates or modifications, please contact the agency directly.

## License
© 2024 Bill Layne Insurance Agency. All rights reserved.

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Maintained By**: Bill Layne Insurance Agency