/* Bill Layne Insurance Document Generator - JavaScript */

// =================================================================
// Authentication Functions
// =================================================================

function logout() {
  sessionStorage.removeItem('authenticated');
  window.location.href = 'login.html';
}

// =================================================================
// Auto ID Card Functions
// =================================================================

function updateVehicleFields() {
  const count = parseInt(document.getElementById('idCardVehicleCount').value);
  
  // Show/hide vehicle sections based on count
  for (let i = 1; i <= 4; i++) {
    const section = document.getElementById(`vehicle${i}Section`);
    if (section) {
      section.style.display = i <= count ? 'block' : 'none';
    }
  }
}

function updateIDCardCompanyInfo() {
  const company = document.getElementById('idCardCompany').value;
  const naicField = document.getElementById('idCardNAIC');
  
  // NAIC numbers for different companies
  const naicNumbers = {
    'Nationwide': '25453',
    'Progressive': '24260',
    'National General': '23728',
    'Travelers': '25658',
    'NC Grange Mutual': '14129',
    'Alamance': '10190',
    'Universal Property': '10783',
    'Dairyland': '21164'
  };
  
  if (naicField && naicNumbers[company]) {
    naicField.value = naicNumbers[company];
  } else if (naicField) {
    naicField.value = '';
  }
}

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
      id: 'ncgrange-rle-roof',
      name: 'NC Grange - Roof Life Expectancy Form',
      filename: 'NC-Grange-RLE-Roof.pdf',
      category: 'company',
      description: 'NC Grange underwriting form for roof life expectancy',
      fillable: true
    },
    {
      id: 'ncgrange-special-property',
      name: 'NC Grange - Special Property Exclusion',
      filename: 'NC-Grange-Special-Property-Exclustion.pdf',
      category: 'company',
      description: 'NC Grange underwriting form for special property exclusions',
      fillable: true
    },
    {
      id: 'ncgrange-trampoline',
      name: 'NC Grange - Trampoline Exclusion',
      filename: 'NC-Grange-Trampoline-Exc.pdf',
      category: 'company',
      description: 'NC Grange underwriting form for trampoline liability exclusion',
      fillable: true
    },
    {
      id: 'ncgrange-wood-stove',
      name: 'NC Grange - Wood Stove Form',
      filename: 'NC-Grange-Wood-Stove.pdf',
      category: 'company',
      description: 'NC Grange underwriting form for wood stove installation',
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
  
  // Initialize prompts if prompts tab
  if (tabName === 'prompts') {
    if (typeof initializePrompts === 'function') {
      initializePrompts();
    }
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
      ${template.fillable ? '<span style="color: #28a745; font-size: 11px;">✓ Fillable Form</span>' : ''}
    </div>
    <div class="pdf-card-footer">
      <button onclick="viewPDF('${template.category}', '${template.filename}', '${template.name}')">
        👁️ View
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
  
  // Store current PDF info
  currentPDF = { category, filename, title };
  
  // Construct the PDF path
  const pdfPath = `pdf-templates/${category}-forms/${filename}`;
  
  // For GitHub Pages, use direct path
  const isGitHubPages = window.location.hostname.includes('github.io');
  
  if (isGitHubPages) {
    // Use the full URL for GitHub Pages
    const baseUrl = window.location.origin + '/' + repoConfig.repository;
    const fullUrl = `${baseUrl}/${pdfPath}`;
    
    // Try to use iframe first
    if (modal && viewer && titleElement) {
      viewer.src = fullUrl;
      titleElement.textContent = title;
      modal.style.display = 'block';
    } else {
      // Fallback: open in new tab
      window.open(fullUrl, '_blank');
    }
  } else if (window.location.protocol === 'file:') {
    // For local file system
    if (modal && viewer && titleElement) {
      viewer.src = pdfPath;
      titleElement.textContent = title;
      modal.style.display = 'block';
    } else {
      window.open(pdfPath, '_blank');
    }
  } else {
    // For other hosting
    if (modal && viewer && titleElement) {
      viewer.src = pdfPath;
      titleElement.textContent = title;
      modal.style.display = 'block';
    } else {
      window.open(pdfPath, '_blank');
    }
  }
}

async function downloadPDF(category, filename, title) {
  try {
    // Construct the correct path for GitHub Pages
    const pdfPath = `pdf-templates/${category}-forms/${filename}`;
    
    // For GitHub Pages, we need to use the full URL
    const isGitHubPages = window.location.hostname.includes('github.io');
    let fullUrl;
    
    if (isGitHubPages) {
      // Use the full GitHub Pages URL
      const baseUrl = window.location.origin + '/' + repoConfig.repository;
      fullUrl = `${baseUrl}/${pdfPath}`;
    } else if (window.location.protocol === 'file:') {
      // For local file system - just open the file
      const a = document.createElement('a');
      a.href = pdfPath;
      a.download = filename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    } else {
      // For other hosting
      fullUrl = window.location.origin + '/' + pdfPath;
    }
    
    // Fetch the PDF as a blob
    const response = await fetch(fullUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    // Create object URL and trigger download
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    }, 100);
    
    // Show instructions for fillable forms
    const template = Object.values(pdfTemplates).flat().find(t => t.filename === filename);
    if (template && template.fillable) {
      setTimeout(() => {
        alert(`📝 Fillable Form Downloaded!\n\n${title} has been downloaded to your computer.\n\nTo fill out this form:\n1. Open the downloaded PDF with Adobe Acrobat Reader (free)\n2. Click on the form fields to fill them out\n3. Save the completed form\n\nNote: Form fields may not work in browser PDF viewers.`);
      }, 1000);
    }
    
  } catch (error) {
    console.error('Download error:', error);
    
    // Fallback: Open in new tab with instructions
    const pdfPath = `pdf-templates/${category}-forms/${filename}`;
    const fallbackUrl = window.location.origin + '/' + repoConfig.repository + '/' + pdfPath;
    
    const userChoice = confirm(
      `Unable to download directly. Would you like to:\n\n` +
      `OK = Open PDF in new tab (then right-click to save)\n` +
      `Cancel = Copy link to clipboard`
    );
    
    if (userChoice) {
      window.open(fallbackUrl, '_blank');
      alert('PDF opened in new tab. Right-click on the PDF and select "Save as..." to download.');
    } else {
      // Copy URL to clipboard
      const tempInput = document.createElement('input');
      tempInput.value = fallbackUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      alert('PDF link copied to clipboard! You can paste it in a new tab.');
    }
  }
}

function printPDF(category, filename) {
  const isLocal = window.location.protocol === 'file:';
  const isGitHubPages = window.location.hostname.includes('github.io');
  
  let pdfUrl;
  if (isGitHubPages) {
    pdfUrl = `pdf-templates/${category}-forms/${filename}`;
  } else if (isLocal) {
    pdfUrl = getLocalPDFUrl(category, filename);
  } else {
    pdfUrl = getPDFUrl(category, filename);
  }
  
  const printWindow = window.open(pdfUrl, '_blank');
  if (printWindow) {
    printWindow.addEventListener('load', () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    });
  }
}

// Alternative print method using PDF.js (if available)
function printPDFWithViewer(category, filename, title) {
  // Open the PDF in the modal viewer first
  viewPDF(category, filename, title);
  
  // Wait for modal to load, then trigger print
  setTimeout(() => {
    const viewer = document.getElementById('pdfViewer');
    if (viewer && viewer.contentWindow) {
      viewer.contentWindow.print();
    } else {
      alert('Please use the Print button in the PDF viewer toolbar, or press Ctrl+P (Cmd+P on Mac)');
    }
  }, 1000);
}

// Print helper function for fillable PDFs with instructions
function openPrintHelper(category, filename, title) {
  const pdfPath = `pdf-templates/${category}-forms/${filename}`;
  const isGitHubPages = window.location.hostname.includes('github.io');
  
  let fullUrl;
  if (isGitHubPages) {
    fullUrl = `https://billlayne.github.io/Document-Generator/${pdfPath}`;
  } else {
    fullUrl = pdfPath;
  }
  
  // Create instruction modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.display = 'block';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Print ${title}</h3>
        <span class="close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</span>
      </div>
      <div class="modal-body">
        <p><strong>To print this fillable PDF:</strong></p>
        <ol>
          <li>Click the button below to open the PDF</li>
          <li>Once the PDF loads, press <strong>Ctrl+P</strong> (Windows) or <strong>Cmd+P</strong> (Mac)</li>
          <li>Select your printer and print settings</li>
          <li>Click Print</li>
        </ol>
        <div class="button-group" style="margin-top: 20px;">
          <button onclick="window.open('${fullUrl}', '_blank'); this.parentElement.parentElement.parentElement.parentElement.remove();" style="background: #004080; color: white; padding: 10px 20px;">
            Open PDF for Printing
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
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
      },
      'letterhead': {
        sections: ['letterheadSection'],
        description: 'Creates a professional business letter on Bill Layne Insurance letterhead for official correspondence.',
        documents: ['letterhead']
      },
      'envelope': {
        sections: ['envelopeSection'],
        description: 'Generates a properly formatted envelope for mailing documents. Supports multiple envelope sizes (#10, #9, A7).',
        documents: ['envelope']
      },
      'underwriting': {
        sections: ['underwritingSection'],
        description: 'Create professional underwriting document requests for insurance companies with all necessary information and documentation requirements.',
        documents: ['underwritingDocument']
      },
      'auto-id-card': {
        sections: ['autoIDCardSection'],
        description: 'Generate digital auto insurance ID cards. Enter vehicle and policy information to create printable ID cards.',
        documents: ['autoIDCard']
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
      
      // Check if template has custom action
      if (config.customAction && typeof config.customAction === 'function') {
        config.customAction();
        // Reset to previous selection or default
        document.getElementById('documentType').value = 'closing';
        return;
      }
      
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
      
      // Wait for images to load before printing
      const images = printWindow.document.getElementsByTagName('img');
      if (images.length > 0) {
        let loadedImages = 0;
        const checkAllLoaded = () => {
          loadedImages++;
          if (loadedImages === images.length) {
            setTimeout(() => {
              printWindow.print();
            }, 500); // Additional delay for rendering
          }
        };
        
        for (let img of images) {
          if (img.complete) {
            checkAllLoaded();
          } else {
            img.onload = checkAllLoaded;
            img.onerror = checkAllLoaded; // Still print even if image fails
          }
        }
      } else {
        // No images, print immediately
        printWindow.print();
      }
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
          return 'https://github.com/BillLayne/bill-layne-images/blob/main/logos/Progressive%20Logo.png?raw=true';
        case 'National General':
          return 'https://i.imgur.com/nZZmaLh.png';
        case 'Alamance':
          return 'https://i.imgur.com/inn1Sog.png';
        case 'Travelers':
          return 'https://i.imgur.com/I6ONc0K.png';
        case 'NC Grange Mutual':
          return 'https://github.com/BillLayne/bill-layne-images/blob/main/logos/NC%20Grange%20Logo.png?raw=true';
        case 'Universal Property':
          return 'https://i.imgur.com/otPRl9b.png';
        case 'Foremost':
          return 'https://github.com/BillLayne/bill-layne-images/blob/main/logos/Foremost%20Insurance.jpg?raw=true';
        case 'JSA':
          return 'https://github.com/BillLayne/bill-layne-images/blob/main/logos/JSA%20LOGO.png?raw=true';
        case 'NCJUA':
          return 'https://github.com/BillLayne/bill-layne-images/blob/main/logos/ncjua%20LOGO.png?raw=true';
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
          case 'letterhead':
            html = generateLetterheadHtml();
            title = 'Professional Letter';
            break;
          case 'envelope':
            html = generateEnvelopeHtml();
            title = 'Envelope';
            break;
          case 'autoIDCard':
            html = generateAutoIDCard();
            title = 'Auto Insurance ID Card';
            break;
          case 'underwritingDocument':
            html = generateUnderwritingDocument();
            title = 'Underwriting Request Document';
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
              align-items: flex-start;
              background-color: #004080;
              color: #fff;
              padding: 15px;
              margin-bottom: 15px;
              position: relative;
            }
            .agency-info {
              max-width: 40%;
              font-size: 11px;
            }
            .logo-container {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              gap: 15px;
              flex: 1;
            }
            .logo-container img {
              max-height: 60px;
              width: auto;
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
              <div class="logo-container">
                ${companyLogoUrl ? `<img
                  src="${companyLogoUrl}"
                  alt="${data.insuranceCompany}"
                  style="background: white; padding: 5px; border-radius: 4px; max-height: 60px;"
                />` : ''}
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
              align-items: flex-start;
              background-color: #004080;
              color: #fff;
              padding: 15px;
              margin-bottom: 15px;
              position: relative;
            }
            .agency-info {
              max-width: 40%;
              font-size: 11px;
            }
            .logo-container {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              gap: 15px;
              flex: 1;
            }
            .logo-container img {
              max-height: 60px;
              width: auto;
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
              <div class="logo-container">
                ${invoiceLogoUrl ? `<img
                  src="${invoiceLogoUrl}"
                  alt="${data.insuranceCompany}"
                  style="background: white; padding: 5px; border-radius: 4px; max-height: 60px;"
                />` : ''}
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
              <p><strong>Insurance Company:</strong> ${data.insuranceCompany}</p>
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
            <div style="text-align: right; margin: 10px 0;">
              ${companyLogoUrl ? `<img src="${companyLogoUrl}" alt="${data.insuranceCompany}" style="max-width:200px; height:auto;" />` : ''}
            </div>
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
            <div style="text-align: right; margin: 10px 0;">
              ${companyLogoUrl ? `<img src="${companyLogoUrl}" alt="${data.insuranceCompany}" style="max-width:200px; height:auto;" />` : ''}
            </div>
          </div>

          <p>${today}</p>

          <p><strong>RE: Mortgagee Change Confirmation</strong></p>
          <p><strong>Insurance Company: ${data.insuranceCompany}</strong></p>
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
            <div style="text-align: right; margin: 10px 0;">
              ${companyLogoUrl ? `<img src="${companyLogoUrl}" alt="${data.insuranceCompany}" style="max-width:200px; height:auto;" />` : ''}
            </div>
          </div>

          <div class="notice-header">
            <h2>NOTICE OF CANCELLATION</h2>
          </div>

          <p><strong>To:</strong> ${data.policyHolder}<br />
          ${data.addressLine1}<br />
          ${data.city}, ${data.state} ${data.zipCode}</p>

          <p><strong>Insurance Company:</strong> ${data.insuranceCompany}</p>
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
            <div style="text-align: right; margin: 10px 0;">
              ${companyLogoUrl ? `<img src="${companyLogoUrl}" alt="${data.insuranceCompany}" style="max-width:200px; height:auto;" />` : ''}
            </div>
          </div>

          <div class="renewal-header">
            <h2>RENEWAL NOTICE</h2>
            <p>Your Homeowners Insurance Policy is Due for Renewal</p>
          </div>

          <p><strong>${data.policyHolder}</strong><br />
          ${data.addressLine1}<br />
          ${data.city}, ${data.state} ${data.zipCode}</p>

          <p><strong>Insurance Company:</strong> ${data.insuranceCompany}</p>
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
            <div style="text-align: right; margin: 10px 0;">
              ${companyLogoUrl ? `<img src="${companyLogoUrl}" alt="${data.insuranceCompany}" style="max-width:200px; height:auto;" />` : ''}
            </div>
          </div>

          <h2>Coverage Change Confirmation</h2>
          
          <p>Dear ${data.policyHolder},</p>
          
          <p>This letter confirms the following changes to your ${data.insuranceCompany} policy #${data.policyNumber}:</p>
          
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
            @page {
              size: letter;
              margin: 0.5in;
            }
            @media print {
              body {
                font-size: 12px !important;
              }
              img {
                width: 250px !important;
                height: auto !important;
                display: block !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
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
            <div style="text-align: right; margin: 10px 0;">
              ${companyLogoUrl ? `<img src="${companyLogoUrl}" alt="${data.insuranceCompany}" style="max-width:200px; height:auto;" onload="window.logoLoaded = true;" />` : ''}
            </div>
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
                <td><strong>Insurance Company:</strong></td>
                <td>${data.insuranceCompany}</td>
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
              ${data.insuranceCompany}<br />
              Policy #: ${data.policyNumber}</p>
            </div>
            <div style="text-align: right; margin: 10px 0;">
              ${companyLogoUrl ? `<img src="${companyLogoUrl}" alt="${data.insuranceCompany}" style="max-width:200px; height:auto;" />` : ''}
            </div>
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

    // Generate Professional Letterhead
    function generateLetterheadHtml() {
      const data = {
        recipientName: document.getElementById('letterRecipientName').value,
        recipientCompany: document.getElementById('letterRecipientCompany').value,
        recipientAddress: document.getElementById('letterRecipientAddress').value,
        recipientCityStateZip: document.getElementById('letterRecipientCityStateZip').value,
        letterDate: formatDate(document.getElementById('letterDate').value || new Date().toISOString().split('T')[0]),
        letterSubject: document.getElementById('letterSubject').value,
        senderName: document.getElementById('letterSenderName').value || 'Bill Layne',
        senderPosition: document.getElementById('letterSenderPosition').value || 'Insurance Agent',
        letterContent: document.getElementById('letterContent').value,
        letterClosing: document.getElementById('letterClosing').value || 'Sincerely'
      };

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @page {
              size: letter;
              margin: 0.75in;
            }
            body {
              font-family: 'Georgia', 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 1.6;
              color: #333;
              max-width: 6.5in;
              margin: 0 auto;
              padding: 20px;
            }
            .letterhead-header {
              text-align: center;
              border-bottom: 3px solid #004080;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .letterhead-company {
              font-size: 24pt;
              font-weight: bold;
              color: #004080;
              margin: 10px 0;
              letter-spacing: 1px;
            }
            .letterhead-tagline {
              font-style: italic;
              color: #666;
              font-size: 11pt;
              margin-bottom: 10px;
            }
            .letterhead-contact {
              font-size: 10pt;
              color: #666;
              line-height: 1.4;
            }
            .letterhead-contact a {
              color: #004080;
              text-decoration: none;
            }
            .letter-date {
              margin: 30px 0 20px 0;
              font-size: 11pt;
            }
            .letter-recipient {
              margin-bottom: 20px;
              line-height: 1.4;
            }
            .letter-subject {
              font-weight: bold;
              margin: 20px 0;
            }
            .letter-salutation {
              margin-bottom: 15px;
            }
            .letter-body {
              text-align: justify;
              margin-bottom: 20px;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .letter-closing {
              margin-top: 30px;
            }
            .letter-signature {
              margin-top: 60px;
            }
            .letter-sender-name {
              font-weight: bold;
            }
            .letter-sender-position {
              font-style: italic;
              color: #666;
            }
            @media print {
              body {
                font-size: 11pt;
              }
              .letterhead-header {
                border-bottom-color: #000;
              }
            }
          </style>
        </head>
        <body>
          <div class="letterhead-header">
            <div class="letterhead-company">BILL LAYNE INSURANCE</div>
            <div class="letterhead-tagline">Your Trusted Insurance Partner Since 1985</div>
            <div class="letterhead-contact">
              1283 N Bridge St, Elkin, NC 28621 | PO Box 827, Elkin, NC 28621<br>
              Phone: (336) 835-1993 | Fax: (336) 835-2886<br>
              Email: <a href="mailto:Save@BillLayneInsurance.com">Save@BillLayneInsurance.com</a><br>
              Website: <a href="https://www.BillLayneInsurance.com">www.BillLayneInsurance.com</a>
            </div>
          </div>

          <div class="letter-date">${data.letterDate}</div>

          <div class="letter-recipient">
            ${data.recipientName}<br>
            ${data.recipientCompany ? data.recipientCompany + '<br>' : ''}
            ${data.recipientAddress}<br>
            ${data.recipientCityStateZip}
          </div>

          ${data.letterSubject ? '<div class="letter-subject">RE: ' + data.letterSubject + '</div>' : ''}

          <div class="letter-salutation">Dear ${data.recipientName},</div>

          <div class="letter-body">${data.letterContent}</div>

          <div class="letter-closing">${data.letterClosing},</div>

          <div class="letter-signature">
            <div class="letter-sender-name">${data.senderName}</div>
            <div class="letter-sender-position">${data.senderPosition}</div>
            <div>Bill Layne Insurance Agency</div>
          </div>
        </body>
        </html>
      `;
    }

    // Generate Underwriting Document
    function generateUnderwritingDocument() {
      const data = {
        company: document.getElementById('underwritingCompany').value || 'Insurance Company',
        underwriterEmail: document.getElementById('underwriterEmail').value || '',
        subject: document.getElementById('underwritingSubject').value || 'Underwriting Information Request',
        policyNumber: document.getElementById('underwritingPolicyNumber').value || '',
        insuredName: document.getElementById('underwritingInsuredName').value || '',
        propertyAddress: document.getElementById('underwritingPropertyAddress').value || '',
        requestType: document.getElementById('underwritingRequestType').value || 'new',
        priority: document.getElementById('underwritingPriority').value || 'normal',
        documentsNeeded: document.getElementById('underwritingDocumentsNeeded').value || '',
        notes: document.getElementById('underwritingNotes').value || '',
        deadline: document.getElementById('underwritingDeadline').value || '',
        agentName: document.getElementById('underwritingAgentName').value || 'Bill Layne',
        date: new Date().toLocaleDateString()
      };

      // Get company logo
      const companyLogoUrl = getCompanyLogoUrl(data.company);

      // Format deadline
      const formattedDeadline = data.deadline ? new Date(data.deadline).toLocaleDateString() : 'As soon as possible';

      // Get priority styling
      let priorityColor = '#004080';
      let priorityText = 'Normal Priority';
      if (data.priority === 'urgent') {
        priorityColor = '#d32f2f';
        priorityText = 'URGENT - Time Sensitive';
      } else if (data.priority === 'high') {
        priorityColor = '#ff6b00';
        priorityText = 'HIGH PRIORITY';
      }

      const requestTypeText = {
        'new': 'New Business Quote Request',
        'renewal': 'Renewal Documentation',
        'endorsement': 'Policy Endorsement/Change Request',
        'inspection': 'Inspection Photos/Reports',
        'claims': 'Claims History Request',
        'documentation': 'Additional Documentation',
        'custom': 'Custom Request'
      };

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @media print {
              @page {
                size: letter;
                margin: 0.5in;
              }
              body {
                margin: 0;
                padding: 0;
              }
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.6;
              color: #333;
              max-width: 8.5in;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              padding: 20px;
              background: #004080;
              color: white;
              margin-bottom: 20px;
            }
            .company-info {
              flex: 1;
            }
            .logo-container {
              background: white;
              padding: 10px;
              border-radius: 5px;
            }
            .priority-banner {
              background: ${priorityColor};
              color: white;
              padding: 10px;
              text-align: center;
              font-weight: bold;
              font-size: 14px;
              margin-bottom: 20px;
            }
            .section {
              margin-bottom: 20px;
              padding: 15px;
              border: 1px solid #ddd;
              background: #f9f9f9;
            }
            .section-title {
              font-weight: bold;
              color: #004080;
              margin-bottom: 10px;
              font-size: 14px;
              border-bottom: 2px solid #004080;
              padding-bottom: 5px;
            }
            .info-row {
              display: flex;
              margin-bottom: 8px;
            }
            .label {
              font-weight: bold;
              width: 150px;
              color: #555;
            }
            .value {
              flex: 1;
            }
            .documents-list {
              white-space: pre-wrap;
              background: white;
              padding: 10px;
              border-left: 3px solid #004080;
              margin: 10px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #004080;
              text-align: center;
              color: #666;
            }
            .contact-info {
              background: #e8f4f8;
              padding: 15px;
              margin-top: 20px;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-info">
              <h2 style="margin: 0 0 10px 0;">UNDERWRITING REQUEST</h2>
              <div>Bill Layne Insurance Agency</div>
              <div>1283 N Bridge St, Elkin, NC 28621</div>
              <div>Phone: (336) 835-1993 | Fax: (336) 835-2886</div>
            </div>
            ${companyLogoUrl ? `<div class="logo-container"><img src="${companyLogoUrl}" style="height: 50px; width: auto;" alt="${data.company}"></div>` : ''}
          </div>

          ${data.priority !== 'normal' ? `<div class="priority-banner">${priorityText}</div>` : ''}

          <div class="section">
            <div class="section-title">REQUEST INFORMATION</div>
            <div class="info-row">
              <span class="label">Date:</span>
              <span class="value">${data.date}</span>
            </div>
            <div class="info-row">
              <span class="label">To:</span>
              <span class="value">${data.company} Underwriting Department</span>
            </div>
            ${data.underwriterEmail ? `
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value">${data.underwriterEmail}</span>
            </div>` : ''}
            <div class="info-row">
              <span class="label">Request Type:</span>
              <span class="value"><strong>${requestTypeText[data.requestType] || data.requestType}</strong></span>
            </div>
            <div class="info-row">
              <span class="label">Response Needed By:</span>
              <span class="value" style="color: ${data.priority === 'urgent' ? '#d32f2f' : '#004080'}; font-weight: bold;">${formattedDeadline}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">POLICY/QUOTE INFORMATION</div>
            <div class="info-row">
              <span class="label">Insured Name:</span>
              <span class="value"><strong>${data.insuredName || 'TBD'}</strong></span>
            </div>
            <div class="info-row">
              <span class="label">Property Address:</span>
              <span class="value">${data.propertyAddress || 'TBD'}</span>
            </div>
            <div class="info-row">
              <span class="label">Policy/Quote #:</span>
              <span class="value"><strong>${data.policyNumber || 'TBD'}</strong></span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">DOCUMENTS/INFORMATION REQUESTED</div>
            <div class="documents-list">${data.documentsNeeded || 'Please provide all necessary underwriting documentation.'}</div>
          </div>

          ${data.notes ? `
          <div class="section">
            <div class="section-title">ADDITIONAL NOTES/CONTEXT</div>
            <div style="white-space: pre-wrap;">${data.notes}</div>
          </div>` : ''}

          <div class="contact-info">
            <div class="section-title">AGENT CONTACT INFORMATION</div>
            <div style="font-size: 14px;">
              <strong>${data.agentName}</strong><br>
              Bill Layne Insurance Agency<br>
              Direct: (336) 835-1993<br>
              Fax: (336) 835-2886<br>
              Email: Save@BillLayneInsurance.com<br>
              Office Hours: Monday-Friday 8:30 AM - 5:00 PM
            </div>
          </div>

          <div class="footer">
            <p><strong>Thank you for your prompt attention to this request.</strong></p>
            <p style="font-size: 10px;">This document was generated on ${data.date} by Bill Layne Insurance Agency Document System</p>
          </div>
        </body>
        </html>
      `;
    }

    // Helper function for updating underwriting template
    function updateUnderwritingTemplate() {
      const requestType = document.getElementById('underwritingRequestType').value;
      const documentsField = document.getElementById('underwritingDocumentsNeeded');
      
      const templates = {
        'new': 'Please provide:\n- Property inspection report (4-point or full)\n- Wind mitigation form\n- Photos of property (all sides)\n- Prior insurance information\n- Loss history report',
        'renewal': 'Please provide:\n- Updated inspection if required\n- Current year photos\n- Any changes to property\n- Updated reconstruction cost estimate',
        'endorsement': 'Please provide:\n- Details of requested changes\n- Supporting documentation\n- Effective date confirmation',
        'inspection': 'Please provide:\n- Full exterior photos (all 4 sides)\n- Roof photos showing condition\n- Interior photos if applicable\n- Any areas of concern',
        'claims': 'Please provide:\n- 5-year loss history\n- Details of any open claims\n- Claim resolution documentation',
        'documentation': 'Please provide the following additional documentation:\n- ',
        'custom': ''
      };
      
      if (documentsField && templates[requestType] !== undefined) {
        documentsField.value = templates[requestType];
      }
    }

    // Generate Auto ID Card
    function generateAutoIDCard() {
      const data = {
        company: document.getElementById('idCardCompany').value || 'Insurance Company',
        policyNumber: document.getElementById('idCardPolicyNumber').value || 'POLICY123456',
        naic: document.getElementById('idCardNAIC').value || '00000',
        effectiveDate: document.getElementById('idCardEffectiveDate').value || new Date().toISOString().split('T')[0],
        expirationDate: document.getElementById('idCardExpirationDate').value || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        driverName: document.getElementById('idCardDriverName').value || 'John Doe',
        additionalDriver: document.getElementById('idCardAdditionalDriver').value,
        vehicleCount: parseInt(document.getElementById('idCardVehicleCount').value)
      };
      
      // Company-specific claims phone numbers
      const claimsPhoneNumbers = {
        'Nationwide': '1-800-421-3535',
        'Progressive': '1-800-776-4737',
        'National General': '1-800-325-1088',
        'Travelers': '1-800-252-4633',
        'NC Grange Mutual': '1-800-438-4778',
        'Alamance': '1-866-985-9031',
        'Universal Property': '1-888-322-2126',
        'Dairyland': '1-800-334-0090'
      };
      
      data.claimsPhone = claimsPhoneNumbers[data.company] || '1-800-CLAIMS';

      // Collect vehicle information
      const vehicles = [];
      for (let i = 1; i <= data.vehicleCount; i++) {
        const vehicle = {
          year: document.getElementById(`vehicle${i}Year`).value || '2024',
          make: document.getElementById(`vehicle${i}Make`).value || 'Make',
          model: document.getElementById(`vehicle${i}Model`).value || 'Model',
          vin: document.getElementById(`vehicle${i}VIN`).value || 'VIN123456789'
        };
        vehicles.push(vehicle);
      }

      // Get company logo
      const companyLogoUrl = getCompanyLogoUrl(data.company);

      // Generate ID card HTML
      let cardsHtml = '';
      
      vehicles.forEach((vehicle, index) => {
        // Add page break after each vehicle except the last one
        const pageBreakClass = index < vehicles.length - 1 ? 'page-break' : '';
        
        cardsHtml += `
          <div class="card-container ${pageBreakClass}">
            <!-- Front of Card -->
            <div class="id-card">
              <div class="card-header">
                <div style="font-size: 10px;">
                  <strong style="color: #004080;">NORTH CAROLINA</strong><br>
                  <strong>AUTO INSURANCE ID CARD</strong>
                </div>
                ${companyLogoUrl ? `<img src="${companyLogoUrl}" style="height: 30px; width: auto;" alt="${data.company}">` : `<div style="font-weight: bold; font-size: 12px;">${data.company}</div>`}
              </div>
              
              <div class="card-info">
                <div>
                  <strong>INSURED:</strong> ${data.driverName}
                  ${data.additionalDriver ? `<br>${data.additionalDriver}` : ''}
                </div>
                
                <div>
                  <strong>POLICY NUMBER:</strong> ${data.policyNumber}
                </div>
                
                <div style="display: flex; justify-content: space-between;">
                  <div><strong>EFF DATE:</strong> ${formatDateForCard(data.effectiveDate)}</div>
                  <div><strong>EXP DATE:</strong> ${formatDateForCard(data.expirationDate)}</div>
                </div>
                
                <div>
                  <strong>VEHICLE ${index + 1}:</strong><br>
                  ${vehicle.year} ${vehicle.make} ${vehicle.model}
                </div>
                
                <div>
                  <strong>VIN:</strong> ${vehicle.vin}
                </div>
              </div>
              
              <div class="naic-number">
                NAIC# ${data.naic}
              </div>
            </div>
            
            <!-- Back of Card -->
            <div class="id-card" style="margin-top: 20px;">
              <div style="font-size: 9px; font-weight: bold; margin-bottom: 10px;">NORTH CAROLINA MINIMUM LIABILITY LIMITS</div>
              
              <div style="font-size: 8px; line-height: 1.4;">
                <div style="margin-bottom: 8px;">
                  <strong>Bodily Injury:</strong> $50,000 per person / $100,000 per accident<br>
                  <strong>Property Damage:</strong> $50,000 per accident<br>
                  <strong>Uninsured Motorist:</strong> $50,000 per person / $100,000 per accident<br>
                  <strong>Underinsured Motorist:</strong> $50,000 per person / $100,000 per accident
                </div>
                
                <div style="border-top: 1px solid #ccc; padding-top: 8px; margin-top: 8px;">
                  <strong>IMPORTANT:</strong> This card must be carried in the insured vehicle for presentation upon demand. Coverage is provided where required by state law.
                </div>
                
                <div style="margin-top: 10px; border-top: 1px solid #ccc; padding-top: 8px;">
                  <strong style="color: #d32f2f;">${data.company} 24-Hour Claims:</strong> ${data.claimsPhone}<br>
                  <strong>Agent:</strong> Bill Layne Insurance Agency<br>
                  <span style="margin-left: 40px;">(336) 835-1993</span>
                </div>
              </div>
            </div>
            
            <!-- Cutting instructions -->
            <div style="margin-top: 30px; text-align: center; color: #666; font-size: 10px;">
              <div style="border-top: 1px dashed #ccc; margin: 20px 0;"></div>
              ✂ Cut along the dotted line and fold to create wallet-sized card
            </div>
          </div>
        `;
      });

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @media print {
              @page {
                size: letter;
                margin: 0.5in;
              }
              body {
                margin: 0;
                padding: 0;
              }
              .page-break {
                page-break-after: always;
              }
              .card-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                padding: 20px;
              }
            }
            @media screen {
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
                background: #f5f5f5;
              }
              .card-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
                margin-bottom: 40px;
              }
            }
            .id-card {
              width: 3.375in;
              height: 2.125in;
              border: 2px solid #000;
              border-radius: 10px;
              padding: 10px;
              background: white;
              font-family: Arial, sans-serif;
              position: relative;
              box-sizing: border-box;
            }
            .card-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 10px;
            }
            .card-info {
              font-size: 9px;
              line-height: 1.3;
            }
            .card-info div {
              margin-bottom: 5px;
            }
            .naic-number {
              position: absolute;
              bottom: 5px;
              right: 10px;
              font-size: 8px;
            }
          </style>
        </head>
        <body>
          ${cardsHtml}
        </body>
        </html>
      `;
    }

    // Helper function to format date for ID card
    function formatDateForCard(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
    }

    // Generate Envelope
    function generateEnvelopeHtml() {
      const data = {
        envelopeSize: document.getElementById('envelopeSize').value,
        includeReturn: document.getElementById('envelopeIncludeReturn').value === 'yes',
        recipientAddress: document.getElementById('envelopeRecipientAddress').value,
        returnAddress: document.getElementById('envelopeReturnAddress').value || `Bill Layne Insurance\nPO Box 827\nElkin, NC 28621`
      };

      // Get envelope dimensions based on size
      let width, height;
      switch(data.envelopeSize) {
        case '9':
          width = '8.875in';
          height = '3.875in';
          break;
        case 'a7':
          width = '7.25in';
          height = '5.25in';
          break;
        default: // #10
          width = '9.5in';
          height = '4.125in';
      }

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @page {
              size: ${width} ${height};
              margin: 0;
            }
            
            /* Screen display styles */
            @media screen {
              html, body {
                margin: 0;
                padding: 20px;
                font-family: Arial, Helvetica, sans-serif;
                background: #f5f5f5;
              }
              
              .envelope-container {
                position: relative;
                max-width: 800px;
                margin: 0 auto;
                padding: 30px;
                box-sizing: border-box;
                border: 2px solid #ddd;
                background: white;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                min-height: 350px;
                aspect-ratio: ${data.envelopeSize === 'a7' ? '7.25 / 5.25' : data.envelopeSize === '9' ? '8.875 / 3.875' : '9.5 / 4.125'};
              }
              
              .return-address {
                position: absolute;
                top: 30px;
                left: 30px;
                font-size: 11pt;
                line-height: 1.4;
                display: ${data.includeReturn ? 'block' : 'none'};
              }
              
              .recipient-address {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 14pt;
                line-height: 1.6;
                font-weight: 500;
                letter-spacing: 0.5px;
                color: #000;
                white-space: pre-line;
                text-align: center;
              }
            }
            
            /* Print styles */
            @media print {
              html, body {
                margin: 0;
                padding: 0;
                width: ${width};
                height: ${height};
                overflow: hidden;
                font-family: Arial, Helvetica, sans-serif;
              }
              
              .envelope-container {
                position: relative;
                width: ${width};
                height: ${height};
                padding: 0.25in;
                box-sizing: border-box;
                border: none;
                background: white;
                box-shadow: none;
              }
              
              .return-address {
                position: absolute;
                top: 0.5in;
                left: 0.5in;
                font-size: 10pt;
                line-height: 1.4;
                display: ${data.includeReturn ? 'block' : 'none'};
              }
              
              .recipient-address {
                position: absolute;
                top: ${data.envelopeSize === 'a7' ? '2.5in' : '2in'};
                left: ${data.envelopeSize === 'a7' ? '3.5in' : '4.5in'};
                transform: none;
                text-align: left;
                font-size: 14pt;
                line-height: 1.5;
                font-weight: 500;
                letter-spacing: 0.5px;
                color: #000;
                white-space: pre-line;
              }
            }
            
            .return-company {
              font-weight: bold;
              font-size: 12pt;
              color: #004080;
              margin-bottom: 4px;
            }
            
            .envelope-info {
              position: absolute;
              bottom: 10px;
              right: 10px;
              font-size: 9pt;
              color: #999;
              font-style: italic;
            }
            
            @media print {
              .envelope-info {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="envelope-container">
            <div class="return-address">
              <div class="return-company">Bill Layne Insurance</div>
              ${data.returnAddress.replace(/\n/g, '<br>')}
            </div>
            <div class="recipient-address">${data.recipientAddress.replace(/\n/g, '<br>')}</div>
            <div class="envelope-info">Envelope Size: ${data.envelopeSize === '9' ? '#9 Business' : data.envelopeSize === 'a7' ? 'A7 Announcement' : '#10 Standard'}</div>
          </div>
        </body>
        </html>
      `;
    }
