/* Bill Layne Insurance Document Generator - JavaScript */

// =================================================================
// PDF Template Management System (New)
// =================================================================

const pdfTemplates = {
  'acord': [
    {
      id: 'acord-25',
      name: 'ACORD 25 - Certificate of Liability Insurance',
      filename: 'Acord-25-certificate.pdf',
      category: 'acord',
      description: 'Standard certificate of liability insurance',
      fillable: true
    },
    {
      id: 'acord-27',
      name: 'ACORD 27 - Evidence of Property Insurance',
      filename: 'Acord-27-Evidence-of-Property.pdf',
      category: 'acord',
      description: 'Evidence of property insurance coverage',
      fillable: true
    },
    {
      id: 'acord-35',
      name: 'ACORD 35 - Cancellation Request/Policy Release',
      filename: 'Acord-35-Cancellation.pdf',
      category: 'acord',
      description: 'Request for policy cancellation',
      fillable: true
    },
    {
      id: 'acord-37',
      name: 'ACORD 37 - Statement of No Loss',
      filename: 'Acord-37-SNL.pdf',
      category: 'acord',
      description: 'Statement of no loss form for policy changes',
      fillable: true
    }
  ],
  'state': [
    {
      id: 'dl-123',
      name: 'DL-123 - Driver License Insurance Certification',
      filename: 'dl-123-form.pdf',
      category: 'state',
      description: 'NC DMV insurance certification for license reinstatement',
      fillable: false
    }
  ],
  'company': [
    {
      id: 'nationwide-auto',
      name: 'Nationwide Auto Application',
      filename: 'nationwide-auto-app.pdf',
      category: 'company',
      description: 'Nationwide auto insurance application',
      fillable: true
    },
    {
      id: 'progressive-home',
      name: 'Progressive Home Application',
      filename: 'progressive-home-app.pdf',
      category: 'company',
      description: 'Progressive homeowners application',
      fillable: true
    }
  ]
};

// GitHub repository configuration
const repoConfig = {
  username: 'BillLayne', // Updated with your GitHub username
  repository: 'Document-Generator',
  branch: 'main'
};

// Function to get PDF URL
function getPDFUrl(category, filename) {
  return `https://raw.githubusercontent.com/${repoConfig.username}/${repoConfig.repository}/${repoConfig.branch}/pdf-templates/${category}-forms/${filename}`;
}

// For local testing before GitHub deployment
function getLocalPDFUrl(category, filename) {
  return `./pdf-templates/${category}-forms/${filename}`;
}

// Tab navigation
function showTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = 'none';
  });
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab
  document.getElementById(`${tabName}-tab`).style.display = 'block';
  
  // Find and activate the correct button
  document.querySelectorAll('.tab-button').forEach(btn => {
    if (btn.textContent.toLowerCase().includes(tabName.toLowerCase())) {
      btn.classList.add('active');
    }
  });
  
  // Load PDFs if templates tab
  if (tabName === 'templates') {
    loadPDFCategory();
  }
}

// Load PDF templates by category
function loadPDFCategory() {
  const categorySelect = document.getElementById('pdfCategory');
  const category = categorySelect ? categorySelect.value : 'all';
  const grid = document.getElementById('pdfGrid');
  
  if (!grid) return;
  
  grid.innerHTML = '';
  
  let templatesToShow = [];
  
  if (category === 'all') {
    Object.values(pdfTemplates).forEach(catTemplates => {
      templatesToShow = templatesToShow.concat(catTemplates);
    });
  } else {
    templatesToShow = pdfTemplates[category] || [];
  }
  
  if (templatesToShow.length === 0) {
    grid.innerHTML = '<p style="text-align: center; color: #666;">No PDF templates available in this category.</p>';
    return;
  }
  
  templatesToShow.forEach(template => {
    const card = createPDFCard(template);
    grid.appendChild(card);
  });
}

// Create PDF card element
function createPDFCard(template) {
  const card = document.createElement('div');
  card.className = 'pdf-card';
  card.innerHTML = `
    <div class="pdf-card-header">
      <h4>${template.name}</h4>
    </div>
    <div class="pdf-card-body">
      <p>${template.description}</p>
      ${template.fillable ? '<span style="color: #28a745; font-size: 11px;">✓ Fillable Form - Download to fill in Adobe Reader</span>' : ''}
    </div>
    <div class="pdf-card-footer">
      ${template.fillable ? 
        `<button onclick="downloadPDF('${template.category}', '${template.filename}', '${template.name}')" style="background: #28a745; color: white;">
          ⬇️ Download to Fill
        </button>` :
        `<button onclick="viewPDF('${template.category}', '${template.filename}', '${template.name}')">
          👁️ View
        </button>`
      }
      <button onclick="downloadPDF('${template.category}', '${template.filename}', '${template.name}')">
        ⬇️ Download
      </button>
      <button onclick="printPDF('${template.category}', '${template.filename}')">
        🖨️ Print
      </button>
    </div>
  `;
  return card;
}

// PDF viewing functions
let currentPDF = null;

function viewPDF(category, filename, title) {
  const modal = document.getElementById('pdfModal');
  const viewer = document.getElementById('pdfViewer');
  const titleElement = document.getElementById('pdfTitle');
  
  if (!modal || !viewer || !titleElement) {
    alert('PDF viewer not available. Please download the PDF instead.');
    return;
  }
  
  // Store current PDF info
  currentPDF = { category, filename, title };
  
  // Check if running locally or from GitHub
  const isLocal = window.location.protocol === 'file:';
  const pdfUrl = isLocal ? getLocalPDFUrl(category, filename) : getPDFUrl(category, filename);
  
  // Use Google Docs viewer for GitHub hosted PDFs
  if (!isLocal) {
    viewer.src = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
  } else {
    viewer.src = pdfUrl;
  }
  
  titleElement.textContent = title;
  modal.style.display = 'block';
}

function downloadPDF(category, filename, title) {
  const isLocal = window.location.protocol === 'file:';
  const pdfUrl = isLocal ? getLocalPDFUrl(category, filename) : getPDFUrl(category, filename);
  
  // Check if this is a fillable form
  const template = Object.values(pdfTemplates).flat().find(t => t.filename === filename);
  const isFillable = template && template.fillable;
  
  const a = document.createElement('a');
  a.href = pdfUrl;
  a.download = filename;
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Show instructions for fillable forms
  if (isFillable) {
    setTimeout(() => {
      alert(`📝 Fillable Form Downloaded!\n\n${title} has been downloaded to your computer.\n\nTo fill out this form:\n1. Open the downloaded PDF with Adobe Acrobat Reader (free)\n2. Click on the form fields to fill them out\n3. Save the completed form\n\nNote: Form fields may not work in browser PDF viewers.`);
    }, 500);
  }
}

function printPDF(category, filename) {
  const isLocal = window.location.protocol === 'file:';
  const pdfUrl = isLocal ? getLocalPDFUrl(category, filename) : getPDFUrl(category, filename);
  
  const printWindow = window.open(pdfUrl, '_blank');
  if (printWindow) {
    printWindow.addEventListener('load', () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    });
  }
}

function closePDFModal() {
  const modal = document.getElementById('pdfModal');
  const viewer = document.getElementById('pdfViewer');
  
  if (modal) {
    modal.style.display = 'none';
  }
  if (viewer) {
    viewer.src = '';
  }
  currentPDF = null;
}

function downloadCurrentPDF() {
  if (currentPDF) {
    downloadPDF(currentPDF.category, currentPDF.filename, currentPDF.title);
  }
}

function printCurrentPDF() {
  if (currentPDF) {
    printPDF(currentPDF.category, currentPDF.filename);
  }
}

function emailCurrentPDF() {
  if (currentPDF) {
    const subject = encodeURIComponent(`${currentPDF.title}`);
    const body = encodeURIComponent(`Please find attached: ${currentPDF.title}\n\nFrom Bill Layne Insurance Agency`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    alert('Please manually attach the PDF after downloading it.');
    downloadCurrentPDF();
  }
}

// =================================================================
// Original Document Generator Code
// =================================================================
    // Template configurations
    const templateConfigs = {
      'closing': {
        sections: ['commonFields', 'insuredSection', 'policyDatesSection', 'coverageSection', 'mortgageeSection', 'attorneySection'],
        description: 'Generates Evidence of Property Insurance (Declaration Page) and Invoice for home closings. Used when a new home is purchased.',
        documents: ['declaration', 'invoice']
      },
      'binder': {
        sections: ['commonFields', 'insuredSection', 'policyDatesSection', 'coverageSection', 'mortgageeSection'],
        description: 'Creates a binder letter confirming temporary coverage is in place while the full policy is being processed.',
        documents: ['binder']
      },
      'mortgagee-change': {
        sections: ['commonFields', 'insuredSection', 'policyDatesSection', 'mortgageeSection'],
        description: 'Generates a letter confirming the mortgagee/lienholder has been changed on the policy.',
        documents: ['mortgageeChange']
      },
      'cancellation': {
        sections: ['commonFields', 'insuredSection', 'policyDatesSection', 'cancellationSection'],
        description: 'Creates a formal cancellation notice for policy termination.',
        documents: ['cancellation']
      },
      'renewal': {
        sections: ['commonFields', 'insuredSection', 'policyDatesSection', 'renewalSection', 'coverageSection'],
        description: 'Generates a renewal notice for upcoming policy expiration with new terms and premium.',
        documents: ['renewal']
      },
      'coverage-change': {
        sections: ['commonFields', 'insuredSection', 'policyDatesSection', 'coverageChangeSection'],
        description: 'Confirms changes made to existing policy coverage, limits, or deductibles.',
        documents: ['coverageChange']
      },
      'payment-receipt': {
        sections: ['commonFields', 'insuredSection', 'paymentSection'],
        description: 'Creates a receipt for premium payments received.',
        documents: ['paymentReceipt']
      },
      'claim-info': {
        sections: ['commonFields', 'insuredSection', 'policyDatesSection', 'claimSection'],
        description: 'Provides claim filing information and instructions for the insured.',
        documents: ['claimInfo']
      },
      'dl123': {
        sections: ['commonFields', 'insuredSection', 'dl123Section', 'policyDatesSection'],
        description: 'Generates DL-123 Driver License Liability Insurance Certification form required by NC DMV for license reinstatement.',
        documents: ['dl123Form']
      }
    };

    // Auto-populate agency codes for DL-123
    function updateAgencyCodeDL123() {
      const company = document.getElementById('insuranceCompany').value;
      const agencyCodeField = document.getElementById('agencyCode');
      
      // Only update if we're on the DL-123 template
      const selectedTemplate = document.getElementById('documentType').value;
      if (selectedTemplate !== 'dl123') return;
      
      switch(company) {
        case 'Nationwide':
          agencyCodeField.value = '67893';
          break;
        case 'National General':
          agencyCodeField.value = '901875';
          break;
        case 'Progressive':
          agencyCodeField.value = '02M95';
          break;
        case 'Travelers':
          agencyCodeField.value = '0DSJ06';
          break;
        case 'Dairyland':
          agencyCodeField.value = 'DL456';
          break;
        default:
          agencyCodeField.value = '';
      }
    }

    // Initialize on page load
    window.addEventListener('DOMContentLoaded', function() {
      switchTemplate();
    });

    // Switch template function
    function switchTemplate() {
      const selectedTemplate = document.getElementById('documentType').value;
      const config = templateConfigs[selectedTemplate];
      
      // Update description
      document.getElementById('templateDescription').innerHTML = config.description;
      
      // Hide all sections first
      document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
      });
      
      // Show relevant sections
      config.sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.classList.add('active');
        }
      });
      
      // Clear preview
      document.getElementById('previewSection').style.display = 'none';
    }

    // Save form data to localStorage
    function saveFormData() {
      const formData = {};
      const inputs = document.querySelectorAll('input, select, textarea');
      
      inputs.forEach(input => {
        if (input.id) {
          formData[input.id] = input.value;
        }
      });
      
      localStorage.setItem('insuranceFormData', JSON.stringify(formData));
      showNotification('Form data saved successfully!', 'success');
    }

    // Load form data from localStorage
    function loadFormData() {
      const savedData = localStorage.getItem('insuranceFormData');
      
      if (savedData) {
        const formData = JSON.parse(savedData);
        
        Object.keys(formData).forEach(key => {
          const element = document.getElementById(key);
          if (element) {
            element.value = formData[key];
          }
        });
        
        showNotification('Form data loaded successfully!', 'success');
      } else {
        showNotification('No saved data found', 'error');
      }
    }

    // Clear all form fields
    function clearForm() {
      if (confirm('Are you sure you want to clear all form fields?')) {
        const inputs = document.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
          if (input.type === 'select-one') {
            input.selectedIndex = 0;
          } else if (input.type !== 'button' && input.type !== 'submit') {
            input.value = '';
          }
        });
        
        // Clear preview
        document.getElementById('previewSection').style.display = 'none';
        showNotification('Form cleared successfully!', 'success');
      }
    }

    // Show notification
    function showNotification(message, type) {
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.textContent = message;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }

    // Print specific document
    function printDocument(elementId) {
      const element = document.getElementById(elementId);
      const printWindow = window.open('', '_blank');
      printWindow.document.write(element.innerHTML);
      printWindow.document.close();
      printWindow.print();
    }

    // Copy document HTML for email
    function copyForEmail(elementId) {
      const element = document.getElementById(elementId);
      const html = element.innerHTML;
      
      // Create a temporary textarea to copy the HTML
      const textarea = document.createElement('textarea');
      textarea.value = html;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        document.execCommand('copy');
        showNotification('HTML copied to clipboard! You can now paste it into your email client.', 'success');
      } catch (err) {
        showNotification('Failed to copy HTML. Please try again.', 'error');
      }
      
      document.body.removeChild(textarea);
    }

    // Email document via Gmail with better formatting
    function emailDocument(elementId, documentTitle) {
        // Get the HTML content
        const element = document.getElementById(elementId);
        const html = element.innerHTML;
        
        // Get recipient email
        let recipientEmail = document.getElementById('emailAddress').value;
        if (!recipientEmail) {
            recipientEmail = prompt('Enter recipient email address:', '');
            if (!recipientEmail) {
                showNotification('Email cancelled - no recipient provided', 'error');
                return;
            }
        }
        
        const policyHolder = document.getElementById('policyholderName').value || 'Customer';
        const policyNumber = document.getElementById('policyNumber').value || 'N/A';
        
        // Create complete styled HTML email template
        const emailHtml = createEmailTemplate(html, documentTitle, policyHolder, policyNumber);
        
        // Copy HTML to clipboard using the advanced method
        copyToClipboardAsHtml(emailHtml, function(success) {
            if (success) {
                // Open Gmail
                const subject = encodeURIComponent(`${documentTitle} - ${policyHolder} - Policy #${policyNumber}`);
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${subject}`;
                window.open(gmailUrl, '_blank');
                
                showNotification('✅ Document copied! Just paste (Ctrl+V) in Gmail - it will appear formatted!', 'success');
                
                // Show instructions
                setTimeout(() => {
                    alert('SUCCESS! The document is now in your clipboard.\n\n' +
                          'In Gmail:\n' +
                          '1. Click in the email body\n' +
                          '2. Press Ctrl+V (or Cmd+V on Mac)\n' +
                          '3. The formatted document will appear!\n\n' +
                          'Note: This works because we\'re using the same technique as professional email tools.');
                }, 1000);
            } else {
                // Fallback to other options
                showEmailOptions(elementId, documentTitle);
            }
        });
    }
    
    // Create a properly formatted email template
    function createEmailTemplate(documentHtml, documentTitle, policyHolder, policyNumber) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #004080;">
                        <h1 style="color: #004080; margin: 0;">Bill Layne Insurance Agency</h1>
                        <p style="color: #666; margin: 10px 0 0 0;">1283 N Bridge St, Elkin, NC 28621 | (336) 835-1993</p>
                    </div>
                    
                    <!-- Document Title -->
                    <h2 style="color: #004080; text-align: center; margin: 20px 0;">${documentTitle}</h2>
                    
                    <!-- Document Content -->
                    <div style="margin: 20px 0;">
                        ${documentHtml}
                    </div>
                    
                    <!-- Footer -->
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #004080; text-align: center; color: #666; font-size: 12px;">
                        <p>This document was generated on ${new Date().toLocaleDateString()}</p>
                        <p>Policy Holder: ${policyHolder} | Policy #: ${policyNumber}</p>
                        <p>© ${new Date().getFullYear()} Bill Layne Insurance Agency. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
    
    // Advanced clipboard copy function that works with Gmail
    function copyToClipboardAsHtml(html, callback) {
        // Use the Clipboard API with ClipboardItem for proper HTML copying
        if (navigator.clipboard && window.ClipboardItem) {
            try {
                // Create both HTML and plain text versions
                const htmlBlob = new Blob([html], { type: 'text/html' });
                const textBlob = new Blob([stripHtml(html)], { type: 'text/plain' });
                
                const clipboardItem = new ClipboardItem({
                    'text/html': htmlBlob,
                    'text/plain': textBlob
                });
                
                navigator.clipboard.write([clipboardItem]).then(
                    () => {
                        if (callback) callback(true);
                    },
                    (err) => {
                        console.warn('ClipboardItem write failed, trying fallback:', err);
                        fallbackCopyToClipboard(html, callback);
                    }
                );
            } catch(e) {
                console.warn('Error creating ClipboardItem, trying fallback:', e);
                fallbackCopyToClipboard(html, callback);
            }
        } else {
            console.log('ClipboardItem not supported, using fallback.');
            fallbackCopyToClipboard(html, callback);
        }
    }
    
    // Fallback copy method for older browsers
    function fallbackCopyToClipboard(html, callback) {
        const listener = function(e) {
            e.clipboardData.setData('text/html', html);
            e.clipboardData.setData('text/plain', stripHtml(html));
            e.preventDefault();
        };
        
        document.addEventListener('copy', listener);
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                if (callback) callback(true);
            } else {
                throw new Error('execCommand returned false');
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
            if (callback) callback(false);
        } finally {
            document.removeEventListener('copy', listener);
        }
    }
    
    // Convert HTML to plain text
    function stripHtml(html) {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        
        // Add line breaks for better plain text formatting
        tmp.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li').forEach(el => {
            el.insertAdjacentText('afterend', '\n');
        });
        tmp.querySelectorAll('br').forEach(br => {
            br.insertAdjacentText('afterend', '\n');
        });
        
        // Extract and clean text
        let text = (tmp.textContent || '').replace(/[\n\r]+/g, '\n').trim();
        return text;
    }
    
    // Show alternative email options if advanced copy fails
    function showEmailOptions(elementId, documentTitle) {
      // Show options modal
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.style.display = 'block';
      
      const policyHolder = document.getElementById('policyholderName').value || 'Customer';
      const policyNumber = document.getElementById('policyNumber').value || 'N/A';
      
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3>Email Document Options</h3>
            <span class="close" onclick="this.parentElement.parentElement.parentElement.style.display='none'">&times;</span>
          </div>
          <p><strong>Note:</strong> Gmail doesn't support direct HTML pasting. Choose an option below:</p>
          <div class="button-group" style="flex-direction: column; gap: 10px;">
            <button onclick="downloadAndEmail('${elementId}', '${documentTitle}', this)" style="width: 100%; padding: 12px;" class="save-btn">
              📎 Download & Attach as HTML File (Recommended)
              <br><small>Best quality - recipient opens in browser</small>
            </button>
            <button onclick="copyAsPlainText('${elementId}', '${documentTitle}', this)" style="width: 100%; padding: 12px;">
              📋 Copy as Formatted Plain Text
              <br><small>Paste directly but loses colors/styling</small>
            </button>
            <button onclick="downloadPDF('${elementId}', '${documentTitle}', this)" style="width: 100%; padding: 12px;" class="load-btn">
              📄 Save as PDF (Manual Attach)
              <br><small>Print to PDF, then attach to email</small>
            </button>
            <button onclick="copyForOutlook('${elementId}', '${documentTitle}', this)" style="width: 100%; padding: 12px;">
              📧 Copy HTML for Outlook/Thunderbird
              <br><small>For email clients that support HTML</small>
            </button>
          </div>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            <strong>Why can't I paste styled HTML in Gmail?</strong><br>
            Gmail's web interface doesn't support direct HTML pasting for security reasons. 
            The HTML file attachment method ensures your document appears exactly as designed.
          </p>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Close modal when clicking outside
      modal.onclick = function(event) {
        if (event.target === modal) {
          modal.style.display = 'none';
          setTimeout(() => modal.remove(), 300);
        }
      };
    }

    // Download HTML file and open email
    function downloadAndEmail(elementId, documentTitle, buttonElement) {
      const element = document.getElementById(elementId);
      const html = element.innerHTML;
      
      // Get recipient email
      let recipientEmail = document.getElementById('emailAddress').value;
      if (!recipientEmail) {
        recipientEmail = prompt('Enter recipient email address:', '');
        if (!recipientEmail) {
          showNotification('Email cancelled - no recipient provided', 'error');
          return;
        }
      }
      
      const policyHolder = document.getElementById('policyholderName').value || 'Customer';
      const policyNumber = document.getElementById('policyNumber').value || 'N/A';
      
      // Create complete HTML document with inline styles
      const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${documentTitle} - ${policyHolder}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 20px;
              background: white;
            }
            @media print {
              body { margin: 0; padding: 10px; }
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
        </html>
      `;
      
      // Create blob and download link
      const blob = new Blob([fullHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const fileName = `${documentTitle.replace(/\s+/g, '_')}_${policyHolder.replace(/\s+/g, '_')}_${policyNumber}.html`;
      
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Open Gmail
      setTimeout(() => {
        const subject = encodeURIComponent(`${documentTitle} - ${policyHolder} - Policy #${policyNumber}`);
        const bodyText = encodeURIComponent(`Dear ${policyHolder},

Please find attached your ${documentTitle} document.

Important: The document "${fileName}" has been downloaded to your computer. 
Please attach it to this email before sending.

To attach in Gmail:
1. Click the paperclip icon below
2. Select the downloaded file: ${fileName}
3. Wait for upload to complete
4. Send the email

The recipient will be able to open the HTML file in any web browser to view the formatted document.

Best regards,
Bill Layne Insurance Agency
(336) 835-1993
Save@BillLayneInsurance.com`);
        
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=${subject}&body=${bodyText}`;
        window.open(gmailUrl, '_blank');
        
        showNotification(`✅ Document saved as "${fileName}" - Now attach it to your email!`, 'success');
      }, 500);
      
      // Close modal
      const modal = buttonElement.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
      }
    }

    // Copy as plain text for email
    function copyAsPlainText(elementId, documentTitle, buttonElement) {
      const element = document.getElementById(elementId);
      
      // Get text content from the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = element.innerHTML;
      
      // Build formatted plain text
      let plainText = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
      plainText += documentTitle.toUpperCase() + '\n';
      plainText += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
      
      // Process each element to maintain structure
      const processNode = (node, indent = '') => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent.trim();
          if (text) {
            return indent + text;
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const tag = node.tagName.toLowerCase();
          let result = '';
          
          switch(tag) {
            case 'h1':
            case 'h2':
            case 'h3':
              result = '\n' + node.textContent.toUpperCase() + '\n' + '─'.repeat(40) + '\n';
              break;
            case 'strong':
            case 'b':
              result = '**' + node.textContent + '**';
              break;
            case 'br':
              result = '\n';
              break;
            case 'p':
            case 'div':
              const content = Array.from(node.childNodes)
                .map(child => processNode(child, indent))
                .filter(text => text)
                .join('');
              if (content) {
                result = '\n' + content + '\n';
              }
              break;
            case 'table':
              result = '\n' + processTable(node) + '\n';
              break;
            case 'ul':
            case 'ol':
              result = '\n' + processList(node, tag === 'ol') + '\n';
              break;
            default:
              result = Array.from(node.childNodes)
                .map(child => processNode(child, indent))
                .filter(text => text)
                .join('');
          }
          return result;
        }
        return '';
      };
      
      // Process tables
      const processTable = (table) => {
        let result = '';
        const rows = table.querySelectorAll('tr');
        
        rows.forEach((row, index) => {
          const cells = row.querySelectorAll('td, th');
          const rowData = Array.from(cells).map(cell => {
            const text = cell.textContent.trim();
            return text.padEnd(20);
          });
          
          result += rowData.join(' | ') + '\n';
          
          // Add separator after header row
          if (index === 0 && row.querySelector('th')) {
            result += '─'.repeat(rowData.join(' | ').length) + '\n';
          }
        });
        
        return result;
      };
      
      // Process lists
      const processList = (list, ordered) => {
        let result = '';
        const items = list.querySelectorAll('li');
        items.forEach((item, index) => {
          const prefix = ordered ? `${index + 1}. ` : '• ';
          result += prefix + item.textContent.trim() + '\n';
        });
        return result;
      };
      
      // Process the content
      plainText += processNode(tempDiv);
      
      // Add footer
      plainText += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
      plainText += 'Bill Layne Insurance Agency\n';
      plainText += '1283 N Bridge St, Elkin, NC 28621\n';
      plainText += '(336) 835-1993 | Save@BillLayneInsurance.com\n';
      plainText += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
      
      // Copy to clipboard
      const textarea = document.createElement('textarea');
      textarea.value = plainText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        document.execCommand('copy');
        
        // Get recipient email
        let recipientEmail = document.getElementById('emailAddress').value;
        if (!recipientEmail) {
          recipientEmail = prompt('Enter recipient email address:', '');
        }
        
        if (recipientEmail) {
          const policyHolder = document.getElementById('policyholderName').value || 'Customer';
          const policyNumber = document.getElementById('policyNumber').value || 'N/A';
          const subject = encodeURIComponent(`${documentTitle} - ${policyHolder} - Policy #${policyNumber}`);
          const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=${subject}`;
          window.open(gmailUrl, '_blank');
        }
        
        showNotification('✅ Plain text copied! Paste it directly into Gmail.', 'success');
      } catch (err) {
        showNotification('Failed to copy text. Please try again.', 'error');
      }
      
      document.body.removeChild(textarea);
      
      // Close modal
      const modal = buttonElement.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
      }
    }

    // Download as PDF instructions
    function downloadPDF(elementId, documentTitle, buttonElement) {
      const policyHolder = document.getElementById('policyholderName').value || 'Customer';
      
      // Print the specific document
      printDocument(elementId);
      
      alert(`To save as PDF:\n\n1. In the print dialog that just opened\n2. Change "Destination" to "Save as PDF"\n3. Click "Save"\n4. Name your file\n5. Then attach the PDF to your email\n\nDocument: ${documentTitle}\nCustomer: ${policyHolder}`);
      
      // Close modal
      const modal = buttonElement.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
      }
    }

    // Copy HTML for Outlook/Thunderbird
    function copyForOutlook(elementId, documentTitle, buttonElement) {
      const element = document.getElementById(elementId);
      const html = element.innerHTML;
      
      // Create complete HTML for email clients that support it
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          ${html}
        </div>
      `;
      
      const textarea = document.createElement('textarea');
      textarea.value = emailHtml;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        document.execCommand('copy');
        showNotification('✅ HTML copied! Use in Outlook: Insert > Text > Object > Text from File', 'success');
        
        alert('HTML Copied!\n\nFor Outlook:\n1. Create new email\n2. Insert tab > Text group > Object > Text from File\n3. Paste the HTML\n\nFor Thunderbird:\n1. Create new email\n2. Insert > HTML\n3. Paste the code');
      } catch (err) {
        showNotification('Failed to copy HTML.', 'error');
      }
      
      document.body.removeChild(textarea);
      
      // Close modal
      const modal = buttonElement.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
      }
    }

    // Returns a logo URL based on the selected insurance company
    function getCompanyLogoUrl(company) {
      switch (company) {
        case 'Nationwide':
          return 'https://i.imgur.com/GWZBW1W.png';
        case 'Progressive':
          return 'https://i.imgur.com/mI7NVCS.png';
        case 'National General':
          return 'https://i.imgur.com/nZZmaLh.png';
        case 'Alamance':
          return 'https://i.imgur.com/inn1Sog.png';
        case 'Travelers':
          return 'https://i.imgur.com/I6ONc0K.png';
        case 'NC Grange Mutual':
          return 'https://i.imgur.com/empThOB.png';
        case 'Universal Property':
          return 'https://i.imgur.com/otPRl9b.png';
        default:
          return 'https://i.imgur.com/nZZmaLh.png';
      }
    }

    function formatDate(dateString) {
      if (!dateString) return '';
      // Parse the date string and add timezone offset to prevent day shift
      const [year, month, day] = dateString.split('-');
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }

    function formatCurrency(amount) {
      if (!amount) return '$0.00';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    }

    function updateExpirationDate() {
      const effectiveDate = document.getElementById('effectiveDate').value;
      if (effectiveDate) {
        // Parse the date string properly to avoid timezone issues
        const [year, month, day] = effectiveDate.split('-');
        const date = new Date(year, month - 1, day);
        date.setFullYear(date.getFullYear() + 1);
        // Format as YYYY-MM-DD for input field
        const expYear = date.getFullYear();
        const expMonth = String(date.getMonth() + 1).padStart(2, '0');
        const expDay = String(date.getDate()).padStart(2, '0');
        document.getElementById('expirationDate').value = `${expYear}-${expMonth}-${expDay}`;
      }
    }

    function generateDocuments() {
      const selectedTemplate = document.getElementById('documentType').value;
      const config = templateConfigs[selectedTemplate];
      
      document.getElementById('previewSection').style.display = 'block';
      const container = document.getElementById('documentPreviewContainer');
      container.innerHTML = '';
      
      config.documents.forEach(docType => {
        let html = '';
        let title = '';
        
        switch(docType) {
          case 'declaration':
            html = generateDeclarationHtml();
            title = 'Declarations Page';
            break;
          case 'invoice':
            html = generateInvoiceHtml();
            title = 'Invoice';
            break;
          case 'binder':
            html = generateBinderHtml();
            title = 'Binder Letter';
            break;
          case 'mortgageeChange':
            html = generateMortgageeChangeHtml();
            title = 'Mortgagee Change Letter';
            break;
          case 'cancellation':
            html = generateCancellationHtml();
            title = 'Cancellation Notice';
            break;
          case 'renewal':
            html = generateRenewalHtml();
            title = 'Renewal Notice';
            break;
          case 'coverageChange':
            html = generateCoverageChangeHtml();
            title = 'Coverage Change Confirmation';
            break;
          case 'paymentReceipt':
            html = generatePaymentReceiptHtml();
            title = 'Payment Receipt';
            break;
          case 'claimInfo':
            html = generateClaimInfoHtml();
            title = 'Claim Information Sheet';
            break;
          case 'dl123Form':
            html = generateDL123Html();
            title = 'DL-123 Insurance Certification';
            break;
        }
        
        const docSection = document.createElement('div');
        docSection.className = 'document-section';
        docSection.innerHTML = `
          <h3>${title}</h3>
          <div class="preview-container" id="${docType}Preview">${html}</div>
          <div class="button-group">
            <button onclick="printDocument('${docType}Preview')">Print ${title}</button>
            <button onclick="emailDocument('${docType}Preview', '${title}')">📧 Copy & Open Gmail</button>
            <button onclick="downloadHtmlFile('${docType}Preview', '${title}')">💾 Download HTML</button>
          </div>
        `;
        container.appendChild(docSection);
      });
      
      // Scroll to preview
      document.getElementById('previewSection').scrollIntoView({ behavior: 'smooth' });
    }

    // Generate Declarations Page (existing)
    function generateDeclarationHtml() {
      const data = {
        policyHolder: document.getElementById('policyholderName').value,
        addressLine1: document.getElementById('addressLine1').value,
        addressLine2: document.getElementById('addressLine2').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        insuranceCompany: document.getElementById('insuranceCompany').value,
        policyNumber: document.getElementById('policyNumber').value,
        effectiveDate: formatDate(document.getElementById('effectiveDate').value),
        expirationDate: formatDate(document.getElementById('expirationDate').value),
        coverageA: formatCurrency(document.getElementById('coverageA').value),
        deductible: formatCurrency(document.getElementById('deductible').value),
        annualPremium: formatCurrency(document.getElementById('annualPremium').value),
        windHailDeductible: document.getElementById('windHailDeductible').value,
        mortgageeName: document.getElementById('mortgageeName').value,
        mortgageeAddressLine1: document.getElementById('mortgageeAddressLine1').value,
        mortgageeAddressLine2: document.getElementById('mortgageeAddressLine2').value,
        mortgageeCity: document.getElementById('mortgageeCity').value,
        mortgageeState: document.getElementById('mortgageeState').value,
        mortgageeZipCode: document.getElementById('mortgageeZipCode').value,
        loanNumber: document.getElementById('loanNumber').value,
        replacementCost: document.getElementById('replacementCost').value
      };

      const companyLogoUrl = getCompanyLogoUrl(data.insuranceCompany);

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @page {
              size: letter;
              margin: 0.5in;
            }
            @media print {
              body {
                font-size: 11px !important;
              }
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 11px;
              line-height: 1.3;
              color: #000;
              max-width: 7.5in;
              margin: 0 auto;
              padding: 10px;
            }
            .letterhead {
              display: flex;
              justify-content: space-between;
              align-items: center;
              background-color: #004080;
              color: #fff;
              padding: 15px;
              margin-bottom: 15px;
            }
            .agency-info {
              max-width: 70%;
              font-size: 11px;
            }
            .document-title {
              text-align: center;
              font-size: 16px;
              font-weight: bold;
              margin: 15px 0;
              text-transform: uppercase;
            }
            .section {
              margin-bottom: 15px;
              padding: 8px;
              background-color: #fff;
              border: 1px solid #ddd;
            }
            .section-title {
              background-color: #004080;
              color: white;
              padding: 4px 8px;
              margin: -8px -8px 8px -8px;
              font-weight: bold;
              font-size: 12px;
            }
            .info-row {
              display: flex;
              margin-bottom: 4px;
              font-size: 11px;
            }
            .label {
              font-weight: bold;
              width: 180px;
              flex-shrink: 0;
            }
            .value {
              flex-grow: 1;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 8px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 6px;
              text-align: left;
              font-size: 11px;
            }
            th {
              background-color: #f5f5f5;
              font-size: 11px;
            }
            .footer {
              margin-top: 20px;
              padding-top: 8px;
              border-top: 1px solid #004080;
              font-size: 9px;
              color: #666;
            }
          </style>
        </head>
        <body>
            <div class="letterhead">
              <div class="agency-info">
                <strong>Bill Layne Insurance Agency</strong><br />
                1283 N Bridge St<br />
                Elkin, NC 28621<br />
                (336) 835-1993
              </div>
              <div>
                <img
                  src="${companyLogoUrl}"
                  alt="Company Logo"
                  style="max-height:60px;"
                />
              </div>
            </div>

            <div class="document-title">Evidence of Property Insurance</div>

            <div class="section">
              <div class="section-title">INSURED INFORMATION</div>
              <div class="info-row">
                <span class="label">Named Insured:</span>
                <span class="value">${data.policyHolder}</span>
              </div>
              <div class="info-row">
                <span class="label">Property Address:</span>
                <span class="value">
                  ${data.addressLine1}
                  ${data.addressLine2 ? '<br>' + data.addressLine2 : ''}
                  <br />
                  ${data.city}, ${data.state} ${data.zipCode}
                </span>
              </div>
            </div>

            <div class="section">
              <div class="section-title">POLICY INFORMATION</div>
              <table>
                <tr>
                  <td><strong>Insurance Company:</strong></td>
                  <td>${data.insuranceCompany}</td>
                  <td><strong>Policy Number:</strong></td>
                  <td>${data.policyNumber}</td>
                </tr>
                <tr>
                  <td><strong>Effective Date:</strong></td>
                  <td>${data.effectiveDate}</td>
                  <td><strong>Expiration Date:</strong></td>
                  <td>${data.expirationDate}</td>
                </tr>
              </table>
            </div>

            <div class="section">
              <div class="section-title">COVERAGE INFORMATION</div>
              <table>
                <tr>
                  <th>Coverage Type</th>
                  <th>Amount</th>
                  <th>Deductible</th>
                </tr>
                <tr>
                  <td>Dwelling (Coverage A)</td>
                  <td>${data.coverageA}</td>
                  <td>${data.deductible}</td>
                </tr>
                <tr>
                  <td>Includes Wind and Hail</td>
                  <td colspan="2">Yes</td>
                </tr>
                <tr>
                  <td>Extended Replacement Cost</td>
                  <td colspan="2">${data.replacementCost}</td>
                </tr>
                <tr>
                  <td>Wind/Hail Deductible</td>
                  <td colspan="2">${data.windHailDeductible}</td>
                </tr>
              </table>
              <div class="info-row" style="margin-top: 8px;">
                <span class="label">Annual Premium:</span>
                <span class="value">${data.annualPremium}</span>
              </div>
            </div>

            <div class="section">
              <div class="section-title">ADDITIONAL INTEREST</div>
              <div class="info-row">
                <span class="label">Mortgagee:</span>
                <span class="value">
                  ${data.mortgageeName}<br />
                  ${data.mortgageeAddressLine1}
                  ${data.mortgageeAddressLine2 ? '<br>' + data.mortgageeAddressLine2 : ''}
                  <br />
                  ${data.mortgageeCity}, ${data.mortgageeState} ${data.mortgageeZipCode}
                </span>
              </div>
              <div class="info-row">
                <span class="label">Loan Number:</span>
                <span class="value">${data.loanNumber}</span>
              </div>
            </div>

            <div class="footer"></div>
        </body>
        </html>
      `;
    }

    // Generate Invoice (existing)
    function generateInvoiceHtml() {
      const data = {
        mortgageeName: document.getElementById('mortgageeName').value,
        mortgageeAddressLine1: document.getElementById('mortgageeAddressLine1').value,
        mortgageeAddressLine2: document.getElementById('mortgageeAddressLine2').value,
        mortgageeCity: document.getElementById('mortgageeCity').value,
        mortgageeState: document.getElementById('mortgageeState').value,
        mortgageeZipCode: document.getElementById('mortgageeZipCode').value,
        policyNumber: document.getElementById('policyNumber').value,
        effectiveDate: formatDate(document.getElementById('effectiveDate').value),
        policyHolder: document.getElementById('policyholderName').value,
        annualPremium: formatCurrency(document.getElementById('annualPremium').value),
        insuranceCompany: document.getElementById('insuranceCompany').value
      };

      const invoiceLogoUrl = getCompanyLogoUrl(data.insuranceCompany);

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @page {
              size: letter;
              margin: 0.5in;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 11px;
              line-height: 1.4;
              padding: 10px;
              margin: 0 auto;
              max-width: 7.5in;
            }
            .letterhead {
              display: flex;
              justify-content: space-between;
              align-items: center;
              background-color: #004080;
              color: #fff;
              padding: 15px;
              margin-bottom: 15px;
            }
            .agency-info {
              max-width: 70%;
              font-size: 11px;
            }
            .header-title {
              text-align: center;
              margin-bottom: 15px;
              border-bottom: 2px solid #004080;
            }
            .header-title h1 {
              font-size: 18px;
              margin: 10px 0;
            }
            .section {
              margin-bottom: 15px;
            }
            .section-title {
              font-weight: bold;
              color: #004080;
              margin-bottom: 8px;
              font-size: 12px;
            }
            .section p {
              margin: 4px 0;
              font-size: 11px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 12px 0;
            }
            th, td {
              border: 1px solid #000;
              padding: 6px;
              text-align: left;
              font-size: 11px;
            }
            .total {
              font-weight: bold;
              font-size: 14px;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
            <div class="letterhead">
              <div class="agency-info">
                <strong>Bill Layne Insurance Agency</strong><br />
                1283 N Bridge St<br />
                Elkin, NC 28621<br />
                (336) 835-1993
              </div>
              <div>
                <img
                  src="${invoiceLogoUrl}"
                  alt="Company Logo"
                  style="max-height:60px;"
                />
              </div>
            </div>

            <div class="header-title">
              <h1>HOMEOWNERS INSURANCE INVOICE</h1>
            </div>

            <div class="section">
              <div class="section-title">BILL TO:</div>
              <p>${data.mortgageeName}</p>
              <p>${data.mortgageeAddressLine1}</p>
              ${data.mortgageeAddressLine2 ? `<p>${data.mortgageeAddressLine2}</p>` : ''}
              <p>${data.mortgageeCity}, ${data.mortgageeState} ${data.mortgageeZipCode}</p>
            </div>

            <div class="section">
              <div class="section-title">INVOICE DETAILS:</div>
              <p><strong>Policy Number:</strong> ${data.policyNumber}</p>
              <p><strong>Due Date:</strong> ${data.effectiveDate}</p>
              <p><strong>Insured Name:</strong> ${data.policyHolder}</p>
            </div>

            <div class="section">
              <table>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
                <tr>
                  <td>Homeowners Insurance Premium</td>
                  <td>${data.annualPremium}</td>
                </tr>
              </table>
              <p class="total">Total Due: ${data.annualPremium}</p>
            </div>

            <div class="section">
              <p>Please make check payable to: ${data.insuranceCompany}</p>
              <p>Mail payment to:<br />
              Bill Layne Insurance Agency<br />
              1283 N Bridge St<br />
              Elkin, NC 28621</p>
              <p>For questions, please contact us at (336) 835-1993</p>
            </div>
        </body>
        </html>
      `;
    }

    // Generate Binder Letter
    function generateBinderHtml() {
      const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const data = {
        policyHolder: document.getElementById('policyholderName').value,
        addressLine1: document.getElementById('addressLine1').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        insuranceCompany: document.getElementById('insuranceCompany').value,
        policyNumber: document.getElementById('policyNumber').value,
        effectiveDate: formatDate(document.getElementById('effectiveDate').value),
        expirationDate: formatDate(document.getElementById('expirationDate').value),
        coverageA: formatCurrency(document.getElementById('coverageA').value),
        deductible: formatCurrency(document.getElementById('deductible').value),
        annualPremium: formatCurrency(document.getElementById('annualPremium').value),
        mortgageeName: document.getElementById('mortgageeName').value
      };

      const companyLogoUrl = getCompanyLogoUrl(data.insuranceCompany);

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              max-width: 7.5in;
              margin: 0 auto;
              padding: 20px;
            }
            .letterhead {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px;
              padding-bottom: 10px;
              border-bottom: 2px solid #004080;
            }
            .date {
              margin: 20px 0;
            }
            .recipient {
              margin: 20px 0;
            }
            .body {
              margin: 20px 0;
              line-height: 1.6;
            }
            .coverage-table {
              margin: 20px 0;
              border: 1px solid #ddd;
              padding: 15px;
              background: #f9f9f9;
            }
            .signature {
              margin-top: 40px;
            }
          </style>
        </head>
        <body>
          <div class="letterhead">
            <div>
              <strong>Bill Layne Insurance Agency</strong><br />
              1283 N Bridge St, Elkin, NC 28621<br />
              (336) 835-1993 | Save@BillLayneInsurance.com
            </div>
            <img src="${companyLogoUrl}" alt="Company Logo" style="max-height:60px;" />
          </div>

          <div class="date">${today}</div>

          <div class="recipient">
            ${data.policyHolder}<br />
            ${data.addressLine1}<br />
            ${data.city}, ${data.state} ${data.zipCode}
          </div>

          <div class="body">
            <p><strong>RE: Homeowners Insurance Binder - Policy #${data.policyNumber}</strong></p>
            
            <p>Dear ${data.policyHolder},</p>
            
            <p>This letter serves as confirmation that homeowners insurance coverage has been bound for the above-referenced property. The following coverage is now in effect:</p>
            
            <div class="coverage-table">
              <strong>Coverage Details:</strong><br /><br />
              Insurance Company: ${data.insuranceCompany}<br />
              Policy Number: ${data.policyNumber}<br />
              Effective Date: ${data.effectiveDate}<br />
              Expiration Date: ${data.expirationDate}<br />
              Dwelling Coverage: ${data.coverageA}<br />
              Deductible: ${data.deductible}<br />
              Annual Premium: ${data.annualPremium}<br />
              ${data.mortgageeName ? `Mortgagee: ${data.mortgageeName}<br />` : ''}
            </div>
            
            <p>This binder provides temporary evidence of coverage while your policy documents are being prepared. You will receive your complete policy package within 10-15 business days.</p>
            
            <p>If you have any questions regarding your coverage, please don't hesitate to contact our office.</p>
            
            <div class="signature">
              <p>Sincerely,</p>
              <br /><br />
              <p>Bill Layne Insurance Agency<br />
              Licensed Insurance Agent</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    // Generate Mortgagee Change Letter
    function generateMortgageeChangeHtml() {
      const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const data = {
        policyHolder: document.getElementById('policyholderName').value,
        addressLine1: document.getElementById('addressLine1').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        insuranceCompany: document.getElementById('insuranceCompany').value,
        policyNumber: document.getElementById('policyNumber').value,
        mortgageeName: document.getElementById('mortgageeName').value,
        mortgageeAddressLine1: document.getElementById('mortgageeAddressLine1').value,
        mortgageeCity: document.getElementById('mortgageeCity').value,
        mortgageeState: document.getElementById('mortgageeState').value,
        mortgageeZipCode: document.getElementById('mortgageeZipCode').value,
        loanNumber: document.getElementById('loanNumber').value
      };

      const companyLogoUrl = getCompanyLogoUrl(data.insuranceCompany);

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              max-width: 7.5in;
              margin: 0 auto;
              padding: 20px;
            }
            .letterhead {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px;
              padding-bottom: 10px;
              border-bottom: 2px solid #004080;
            }
            .info-box {
              border: 1px solid #004080;
              padding: 15px;
              margin: 20px 0;
              background: #f0f8ff;
            }
          </style>
        </head>
        <body>
          <div class="letterhead">
            <div>
              <strong>Bill Layne Insurance Agency</strong><br />
              1283 N Bridge St, Elkin, NC 28621<br />
              (336) 835-1993
            </div>
            <img src="${companyLogoUrl}" alt="${data.insuranceCompany}" style="max-height:60px;" />
          </div>

          <p>${today}</p>

          <p><strong>RE: Mortgagee Change Confirmation</strong></p>
          <p><strong>Policy Number: ${data.policyNumber}</strong></p>

          <p>Dear ${data.policyHolder},</p>

          <p>This letter confirms that the mortgagee/lienholder information on your homeowners insurance policy has been updated as requested.</p>

          <div class="info-box">
            <strong>New Mortgagee Information:</strong><br /><br />
            ${data.mortgageeName}<br />
            ${data.mortgageeAddressLine1}<br />
            ${data.mortgageeCity}, ${data.mortgageeState} ${data.mortgageeZipCode}<br />
            Loan Number: ${data.loanNumber}
          </div>

          <p>The change has been processed and is effective immediately. An updated declarations page reflecting this change will be sent to both you and your new mortgagee.</p>

          <p>Please retain this letter for your records. If you have any questions, please contact our office.</p>

          <p>Sincerely,<br /><br />
          Bill Layne Insurance Agency</p>
        </body>
        </html>
      `;
    }

    // Generate Cancellation Notice
    function generateCancellationHtml() {
      const data = {
        policyHolder: document.getElementById('policyholderName').value,
        addressLine1: document.getElementById('addressLine1').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        policyNumber: document.getElementById('policyNumber').value,
        insuranceCompany: document.getElementById('insuranceCompany').value,
        cancellationDate: formatDate(document.getElementById('cancellationDate').value),
        cancellationReason: document.getElementById('cancellationReason').value,
        cancellationNotes: document.getElementById('cancellationNotes').value
      };

      const companyLogoUrl = getCompanyLogoUrl(data.insuranceCompany);

      const reasonText = {
        'nonpayment': 'Non-Payment of Premium',
        'insured-request': 'Insured Request',
        'underwriting': 'Underwriting Decision',
        'sold': 'Property Sold',
        'other': 'Other Reason'
      };

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              max-width: 7.5in;
              margin: 0 auto;
              padding: 20px;
            }
            .letterhead {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #004080;
            }
            .notice-header {
              text-align: center;
              background: #ffcccc;
              border: 2px solid #cc0000;
              padding: 10px;
              margin-bottom: 20px;
            }
            .important-box {
              border: 2px solid #cc0000;
              padding: 15px;
              margin: 20px 0;
              background: #fff5f5;
            }
          </style>
        </head>
        <body>
          <div class="letterhead">
            <div>
              <strong>Bill Layne Insurance Agency</strong><br />
              1283 N Bridge St, Elkin, NC 28621<br />
              (336) 835-1993
            </div>
            <img src="${companyLogoUrl}" alt="${data.insuranceCompany}" style="max-height:60px;" />
          </div>

          <div class="notice-header">
            <h2>NOTICE OF CANCELLATION</h2>
          </div>

          <p><strong>To:</strong> ${data.policyHolder}<br />
          ${data.addressLine1}<br />
          ${data.city}, ${data.state} ${data.zipCode}</p>

          <p><strong>Policy Number:</strong> ${data.policyNumber}</p>

          <div class="important-box">
            <strong>IMPORTANT:</strong> Your homeowners insurance policy will be cancelled effective:<br /><br />
            <strong style="font-size: 16px;">${data.cancellationDate}</strong><br /><br />
            <strong>Reason for Cancellation:</strong> ${reasonText[data.cancellationReason] || 'Not Specified'}
            ${data.cancellationNotes ? `<br /><br />Additional Information: ${data.cancellationNotes}` : ''}
          </div>

          <p>If you have a mortgage on this property, a copy of this notice has been sent to your mortgagee.</p>

          <p>If you believe this cancellation is in error or wish to discuss reinstatement options, please contact our office immediately at (336) 835-1993.</p>

          <p>Bill Layne Insurance Agency<br />
          1283 N Bridge St<br />
          Elkin, NC 28621</p>
        </body>
        </html>
      `;
    }

    // Generate Renewal Notice
    function generateRenewalHtml() {
      const data = {
        policyHolder: document.getElementById('policyholderName').value,
        addressLine1: document.getElementById('addressLine1').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        policyNumber: document.getElementById('policyNumber').value,
        insuranceCompany: document.getElementById('insuranceCompany').value,
        currentPremium: formatCurrency(document.getElementById('currentPremium').value),
        renewalPremium: formatCurrency(document.getElementById('renewalPremium').value),
        renewalDate: formatDate(document.getElementById('renewalDate').value),
        paymentDueDate: formatDate(document.getElementById('paymentDueDate').value),
        coverageA: formatCurrency(document.getElementById('coverageA').value)
      };

      const companyLogoUrl = getCompanyLogoUrl(data.insuranceCompany);
      const premiumChange = parseFloat(document.getElementById('renewalPremium').value) - parseFloat(document.getElementById('currentPremium').value);
      const percentChange = ((premiumChange / parseFloat(document.getElementById('currentPremium').value)) * 100).toFixed(1);

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              max-width: 7.5in;
              margin: 0 auto;
              padding: 20px;
            }
            .letterhead {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #004080;
            }
            .renewal-header {
              background: #e6f3ff;
              border: 2px solid #004080;
              padding: 15px;
              text-align: center;
              margin-bottom: 20px;
            }
            .comparison-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            .comparison-table th, .comparison-table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .comparison-table th {
              background: #004080;
              color: white;
            }
            .action-required {
              background: #ffffcc;
              border: 2px solid #ffcc00;
              padding: 15px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="letterhead">
            <div>
              <strong>Bill Layne Insurance Agency</strong><br />
              1283 N Bridge St, Elkin, NC 28621<br />
              (336) 835-1993
            </div>
            <img src="${companyLogoUrl}" alt="${data.insuranceCompany}" style="max-height:60px;" />
          </div>

          <div class="renewal-header">
            <h2>RENEWAL NOTICE</h2>
            <p>Your Homeowners Insurance Policy is Due for Renewal</p>
          </div>

          <p><strong>${data.policyHolder}</strong><br />
          ${data.addressLine1}<br />
          ${data.city}, ${data.state} ${data.zipCode}</p>

          <p><strong>Policy Number:</strong> ${data.policyNumber}</p>

          <table class="comparison-table">
            <tr>
              <th>Coverage Details</th>
              <th>Current Term</th>
              <th>Renewal Term</th>
            </tr>
            <tr>
              <td>Annual Premium</td>
              <td>${data.currentPremium}</td>
              <td>${data.renewalPremium}</td>
            </tr>
            <tr>
              <td>Dwelling Coverage</td>
              <td>${data.coverageA}</td>
              <td>${data.coverageA}</td>
            </tr>
            <tr>
              <td>Premium Change</td>
              <td colspan="2">${premiumChange >= 0 ? '+' : ''}${formatCurrency(Math.abs(premiumChange))} (${percentChange}%)</td>
            </tr>
          </table>

          <div class="action-required">
            <strong>ACTION REQUIRED:</strong><br /><br />
            Renewal Date: <strong>${data.renewalDate}</strong><br />
            Payment Due: <strong>${data.paymentDueDate}</strong><br /><br />
            To renew your policy, please submit payment of ${data.renewalPremium} by the due date.
          </div>

          <p>Thank you for your continued business. If you have questions about your renewal or would like to review your coverage options, please contact us at (336) 835-1993.</p>

          <p>Bill Layne Insurance Agency</p>
        </body>
        </html>
      `;
    }

    // Generate Coverage Change Confirmation
    function generateCoverageChangeHtml() {
      const data = {
        policyHolder: document.getElementById('policyholderName').value,
        policyNumber: document.getElementById('policyNumber').value,
        insuranceCompany: document.getElementById('insuranceCompany').value,
        changeDescription: document.getElementById('changeDescription').value,
        previousPremium: formatCurrency(document.getElementById('previousPremium').value),
        newPremium: formatCurrency(document.getElementById('newPremium').value),
        changeEffectiveDate: formatDate(document.getElementById('changeEffectiveDate').value)
      };

      const companyLogoUrl = getCompanyLogoUrl(data.insuranceCompany);

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              max-width: 7.5in;
              margin: 0 auto;
              padding: 20px;
            }
            .letterhead {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px;
              padding-bottom: 10px;
              border-bottom: 2px solid #004080;
            }
            .change-summary {
              background: #f0f8ff;
              border: 1px solid #004080;
              padding: 15px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="letterhead">
            <div>
              <strong>Bill Layne Insurance Agency</strong><br />
              1283 N Bridge St, Elkin, NC 28621<br />
              (336) 835-1993
            </div>
            <img src="${companyLogoUrl}" alt="${data.insuranceCompany}" style="max-height:60px;" />
          </div>

          <h2>Coverage Change Confirmation</h2>
          
          <p>Dear ${data.policyHolder},</p>
          
          <p>This letter confirms the following changes to your policy #${data.policyNumber}:</p>
          
          <div class="change-summary">
            <strong>Changes Made:</strong><br /><br />
            ${data.changeDescription}<br /><br />
            <strong>Previous Premium:</strong> ${data.previousPremium}<br />
            <strong>New Premium:</strong> ${data.newPremium}<br />
            <strong>Effective Date:</strong> ${data.changeEffectiveDate}
          </div>
          
          <p>An updated declarations page reflecting these changes will be mailed to you within 5-7 business days.</p>
          
          <p>If you have any questions, please contact us at (336) 835-1993.</p>
          
          <p>Bill Layne Insurance Agency</p>
        </body>
        </html>
      `;
    }

    // Generate Payment Receipt
    function generatePaymentReceiptHtml() {
      const data = {
        policyHolder: document.getElementById('policyholderName').value,
        policyNumber: document.getElementById('policyNumber').value,
        insuranceCompany: document.getElementById('insuranceCompany').value,
        paymentAmount: formatCurrency(document.getElementById('paymentAmount').value),
        paymentDate: formatDate(document.getElementById('paymentDate').value),
        paymentMethod: document.getElementById('paymentMethod').value,
        referenceNumber: document.getElementById('referenceNumber').value
      };

      const companyLogoUrl = getCompanyLogoUrl(data.insuranceCompany);

      const methodText = {
        'check': 'Check',
        'cash': 'Cash',
        'card': 'Credit/Debit Card',
        'eft': 'Electronic Transfer',
        'escrow': 'Escrow Payment'
      };

      const receiptNumber = 'R' + Date.now().toString().slice(-8);

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              max-width: 7.5in;
              margin: 0 auto;
              padding: 20px;
            }
            .letterhead {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #004080;
            }
            .receipt-header {
              text-align: center;
              border-bottom: 2px solid #004080;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .receipt-box {
              border: 2px solid #28a745;
              padding: 20px;
              margin: 20px 0;
              background: #f0fff0;
            }
            .receipt-details td {
              padding: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="letterhead">
            <div>
              <strong>Bill Layne Insurance Agency</strong><br />
              1283 N Bridge St, Elkin, NC 28621<br />
              (336) 835-1993
            </div>
            <img src="${companyLogoUrl}" alt="${data.insuranceCompany}" style="max-height:60px;" />
          </div>

          <div class="receipt-header">
            <h2>PAYMENT RECEIPT</h2>
            <p>Receipt #: ${receiptNumber}</p>
          </div>

          <div class="receipt-box">
            <h3>Payment Received</h3>
            <table class="receipt-details">
              <tr>
                <td><strong>From:</strong></td>
                <td>${data.policyHolder}</td>
              </tr>
              <tr>
                <td><strong>Policy Number:</strong></td>
                <td>${data.policyNumber}</td>
              </tr>
              <tr>
                <td><strong>Amount Received:</strong></td>
                <td style="font-size: 16px; font-weight: bold;">${data.paymentAmount}</td>
              </tr>
              <tr>
                <td><strong>Payment Date:</strong></td>
                <td>${data.paymentDate}</td>
              </tr>
              <tr>
                <td><strong>Payment Method:</strong></td>
                <td>${methodText[data.paymentMethod] || 'Not Specified'}</td>
              </tr>
              ${data.referenceNumber ? `
              <tr>
                <td><strong>Reference #:</strong></td>
                <td>${data.referenceNumber}</td>
              </tr>` : ''}
            </table>
          </div>

          <p>Thank you for your payment. This receipt confirms that we have received and applied your payment to the above-referenced policy.</p>

          <p>Bill Layne Insurance Agency<br />
          1283 N Bridge St, Elkin, NC 28621<br />
          (336) 835-1993</p>
        </body>
        </html>
      `;
    }

    // Generate Claim Information Sheet
    function generateClaimInfoHtml() {
      const data = {
        policyHolder: document.getElementById('policyholderName').value,
        policyNumber: document.getElementById('policyNumber').value,
        insuranceCompany: document.getElementById('insuranceCompany').value,
        effectiveDate: formatDate(document.getElementById('effectiveDate').value),
        claimPhone: document.getElementById('claimPhone').value || '1-800-CLAIMS',
        claimEmail: document.getElementById('claimEmail').value || 'claims@insurance.com',
        claimInstructions: document.getElementById('claimInstructions').value
      };

      const companyLogoUrl = getCompanyLogoUrl(data.insuranceCompany);

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              max-width: 7.5in;
              margin: 0 auto;
              padding: 20px;
            }
            .info-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #004080;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .emergency-box {
              background: #ffeeee;
              border: 2px solid #cc0000;
              padding: 15px;
              margin: 20px 0;
            }
            .steps-box {
              background: #f0f8ff;
              border: 1px solid #004080;
              padding: 15px;
              margin: 20px 0;
            }
            .steps-box ol {
              margin: 10px 0;
              padding-left: 20px;
            }
            .steps-box li {
              margin: 8px 0;
            }
            .contact-info {
              background: #ffffcc;
              border: 2px solid #ffcc00;
              padding: 15px;
              margin: 20px 0;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="info-header">
            <div>
              <h2>CLAIM INFORMATION SHEET</h2>
              <p><strong>${data.policyHolder}</strong><br />
              Policy #: ${data.policyNumber}</p>
            </div>
            <img src="${companyLogoUrl}" alt="${data.insuranceCompany}" style="max-height:60px;" />
          </div>

          <div class="emergency-box">
            <h3>🚨 IN CASE OF EMERGENCY</h3>
            <p><strong>If there is immediate danger to life or property, call 911 first!</strong></p>
            <p>Take necessary steps to prevent further damage (cover broken windows, tarp roof leaks, etc.). Keep all receipts for emergency repairs.</p>
          </div>

          <div class="contact-info">
            <h3>TO FILE A CLAIM</h3>
            <p style="font-size: 18px;"><strong>📞 ${data.claimPhone}</strong></p>
            <p>24 Hours a Day, 7 Days a Week</p>
            <p>Email: ${data.claimEmail}</p>
          </div>

          <div class="steps-box">
            <h3>CLAIM FILING STEPS</h3>
            <ol>
              <li><strong>Ensure Safety First</strong> - Make sure everyone is safe and secure</li>
              <li><strong>Document Everything</strong> - Take photos/videos of all damage before cleanup</li>
              <li><strong>Contact Your Insurance Company</strong> - Call the number above immediately</li>
              <li><strong>Prevent Further Damage</strong> - Make temporary repairs if safe to do so</li>
              <li><strong>Keep All Receipts</strong> - Save receipts for temporary repairs and living expenses</li>
              <li><strong>Make a List</strong> - Create detailed inventory of damaged/lost items</li>
              <li><strong>Don't Throw Away Damaged Items</strong> - Keep them until adjuster visits</li>
              <li><strong>Get Multiple Estimates</strong> - Obtain repair estimates from licensed contractors</li>
            </ol>
          </div>

          <div class="steps-box">
            <h3>INFORMATION TO HAVE READY</h3>
            <ul style="list-style-type: none; padding-left: 0;">
              <li>✓ Policy Number: <strong>${data.policyNumber}</strong></li>
              <li>✓ Date and time of loss</li>
              <li>✓ Description of what happened</li>
              <li>✓ Police report number (if applicable)</li>
              <li>✓ List of damaged/stolen property</li>
              <li>✓ Contact information where you can be reached</li>
            </ul>
          </div>

          ${data.claimInstructions ? `
          <div class="steps-box">
            <h3>SPECIAL INSTRUCTIONS</h3>
            <p>${data.claimInstructions}</p>
          </div>` : ''}

          <p><strong>Your Agent is Here to Help!</strong><br />
          If you need assistance with your claim, contact:<br />
          Bill Layne Insurance Agency<br />
          (336) 835-1993<br />
          Save@BillLayneInsurance.com</p>
        </body>
        </html>
      `;
    }

    // Generate DL-123 Driver License Insurance Certification
    function generateDL123Html() {
      const data = {
        insuredDriver: document.getElementById('insuredDriverName').value || document.getElementById('policyholderName').value,
        dateOfBirth: formatDate(document.getElementById('driverDateOfBirth').value),
        policyholders: document.getElementById('policyholderName').value,
        policyholderAddress: `${document.getElementById('addressLine1').value}, ${document.getElementById('city').value}, ${document.getElementById('state').value} ${document.getElementById('zipCode').value}`,
        insuranceCompany: document.getElementById('insuranceCompany').value,
        policyNumber: document.getElementById('policyNumber').value,
        effectiveDate: formatDate(document.getElementById('effectiveDate').value),
        expirationDate: formatDate(document.getElementById('expirationDate').value),
        agencyName: 'BILL LAYNE INSURANCE',
        agencyCode: document.getElementById('agencyCode').value,
        agentSignature: document.getElementById('agentSignatureName').value,
        agentPhone: '1-336-835-1993',
        certificationDate: formatDate(document.getElementById('certificationDate').value) || formatDate(new Date().toISOString().split('T')[0])
      };

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @page { size: letter; margin: 0.5in; }
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              max-width: 7.5in;
              margin: 0 auto;
              padding: 20px;
            }
            .dl123-container {
              border: 2px solid #000;
              padding: 20px;
              margin-bottom: 20px;
            }
            .dl123-title {
              text-align: center;
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .dl123-subtitle {
              text-align: center;
              font-size: 12px;
              margin-bottom: 20px;
            }
            .dl123-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 15px;
              padding-right: 5px;
            }
            .dl123-field {
              flex: 1;
              display: flex;
              align-items: baseline;
              min-width: 0;
              margin-right: 10px;
            }
            .dl123-field:last-child {
              margin-right: 0;
            }
            .dl123-label {
              font-weight: bold;
              margin-right: 10px;
              white-space: nowrap;
            }
            .dl123-value {
              border-bottom: 1px solid #000;
              flex-grow: 1;
              padding: 0 5px;
              min-width: 150px;
              max-width: 100%;
              overflow: hidden;
            }
            .dl123-footer {
              font-size: 10px;
              font-style: italic;
              margin-top: 20px;
              text-align: center;
              padding-top: 10px;
              border-top: 1px solid #000;
            }
            @media print {
              body { font-size: 11px; }
              .dl123-container { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="dl123-container">
            <div class="dl123-title">
              DRIVER LICENSE LIABILITY INSURANCE CERTIFICATION
            </div>
            <div class="dl123-subtitle">
              DL-123 (Rev. 03/13)
            </div>
            
            <div class="dl123-row">
              <div class="dl123-field">
                <span class="dl123-label">Insured Driver:</span>
                <span class="dl123-value">${data.insuredDriver.toUpperCase()}</span>
              </div>
              <div class="dl123-field" style="flex: 0 1 200px;">
                <span class="dl123-label">Date of Birth:</span>
                <span class="dl123-value">${data.dateOfBirth}</span>
              </div>
            </div>
            
            <div class="dl123-row">
              <div class="dl123-field">
                <span class="dl123-label">Policyholder(s):</span>
                <span class="dl123-value">${data.policyholders.toUpperCase()}</span>
              </div>
            </div>
            
            <div class="dl123-row">
              <div class="dl123-field">
                <span class="dl123-label">Policyholder(s) Address:</span>
                <span class="dl123-value">${data.policyholderAddress.toUpperCase()}</span>
              </div>
            </div>
            
            <div class="dl123-row">
              <div class="dl123-field">
                <span class="dl123-label">Insurance Company:</span>
                <span class="dl123-value">${data.insuranceCompany.toUpperCase()}</span>
              </div>
              <div class="dl123-field" style="flex: 0 1 250px;">
                <span class="dl123-label">Policy #:</span>
                <span class="dl123-value">${data.policyNumber.toUpperCase()}</span>
              </div>
            </div>
            
            <div class="dl123-row">
              <div class="dl123-field">
                <span class="dl123-label">Effective Date:</span>
                <span class="dl123-value">${data.effectiveDate}</span>
              </div>
              <div class="dl123-field">
                <span class="dl123-label">Expiration Date:</span>
                <span class="dl123-value">${data.expirationDate}</span>
              </div>
            </div>
            
            <div class="dl123-row">
              <div class="dl123-field">
                <span class="dl123-label">Agency Name:</span>
                <span class="dl123-value">${data.agencyName}</span>
              </div>
              <div class="dl123-field" style="flex: 0 1 200px;">
                <span class="dl123-label">Agency Code #:</span>
                <span class="dl123-value">${data.agencyCode}</span>
              </div>
            </div>
            
            <div class="dl123-row">
              <div class="dl123-field">
                <span class="dl123-label">Agent's Signature:</span>
                <span class="dl123-value">${data.agentSignature}</span>
              </div>
              <div class="dl123-field" style="flex: 0 1 200px;">
                <span class="dl123-label">Agent's Phone #:</span>
                <span class="dl123-value">${data.agentPhone}</span>
              </div>
            </div>
            
            <div class="dl123-row">
              <div class="dl123-field" style="flex: 0 1 300px;">
                <span class="dl123-label">Date of Certification:</span>
                <span class="dl123-value">${data.certificationDate}</span>
              </div>
            </div>
            
            <div class="dl123-footer">
              (This form is valid for 30 days after completion by the insurance agent.)
            </div>
          </div>
        </body>
        </html>
      `;
    }
