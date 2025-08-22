# PDF Templates Directory

## Organization Structure
- `acord-forms/` - ACORD standardized insurance forms
- `state-forms/` - State-specific required forms
- `company-forms/` - Insurance company-specific forms

## Naming Convention
Use lowercase with hyphens: `form-name-description.pdf`

Examples:
- `acord-25-certificate.pdf`
- `dl-123-form.pdf`
- `nationwide-auto-app.pdf`

## Adding New PDFs

1. **Place PDF in appropriate category folder**
   - Choose the correct subfolder based on form type
   - Ensure file follows naming convention

2. **Update JavaScript configuration**
   - Edit `/js/scripts.js`
   - Add entry to `pdfTemplates` object
   - Include all required metadata

3. **Test the integration**
   - Open index.html
   - Navigate to PDF Templates tab
   - Verify the new PDF appears
   - Test view, download, and print functions

4. **Commit and push changes**
   ```bash
   git add .
   git commit -m "Add [form name] PDF template"
   git push origin main
   ```

## PDF Metadata Structure

```javascript
{
  id: 'unique-form-id',
  name: 'Display Name for Form',
  filename: 'actual-file-name.pdf',
  category: 'acord|state|company',
  description: 'Brief description of form purpose',
  fillable: true|false
}
```

## File Size Guidelines
- Keep PDFs under 5MB for optimal loading
- Compress large PDFs before uploading
- Use web-optimized PDF format when possible

## Security Notes
- Never include sensitive customer data in PDFs
- Use blank template forms only
- Ensure forms are publicly shareable

## Support
For assistance with PDF templates, contact:
- Bill Layne Insurance Agency
- (336) 835-1993
- Save@BillLayneInsurance.com