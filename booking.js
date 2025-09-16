// Enhanced debug function with better visibility
function showDebugInfo(message, type = 'info') {
    const debugInfo = document.getElementById('debugInfo');
    const timestamp = new Date().toLocaleTimeString();

    // Color coding for different message types
    const colors = {
        info: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        success: '#8BC34A'
    };

    debugInfo.innerHTML = `
                <div style="border-left: 3px solid ${colors[type]}; padding-left: 10px;">
                    <strong>[${timestamp}] ${type.toUpperCase()}:</strong><br>
                    ${message}
                </div>
            `;
    debugInfo.className = 'debug-info show';

    console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`);

    // Auto-hide after 8 seconds for better debugging
    setTimeout(() => {
        debugInfo.classList.remove('show');
    }, 8000);
}

// Enhanced element checking with detailed reporting
function checkElements() {
    const requiredElements = [
        'quoteForm', 'quoteFirstName', 'quoteLastName', 'quoteEmail',
        'quotePhone', 'quoteEventType', 'quoteEventDuration',
        'success-message-container', 'countdown'
    ];

    let allElementsExist = true;
    let missingElements = [];

    requiredElements.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Element with ID ${id} not found`);
            missingElements.push(id);
            allElementsExist = false;
        } else {
            console.log(`✓ Element ${id} found`);
        }
    });

    if (!allElementsExist) {
        showDebugInfo(`Missing elements: ${missingElements.join(', ')}`, 'error');
    } else {
        showDebugInfo('All required elements found', 'success');
    }

    return allElementsExist;
}

// Enhanced form validation with detailed feedback
function validateForm(form) {
    if (!form) {
        showDebugInfo('Form element not provided for validation', 'error');
        return false;
    }

    let isValid = true;
    let errors = [];

    showDebugInfo('Starting form validation...', 'info');

    // Clear all previous errors
    clearAllErrors(form);

    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    console.log(`Found ${requiredFields.length} required fields`);

    requiredFields.forEach(field => {
        const fieldName = field.name || field.id;
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            errors.push(`${fieldName} is empty`);
            isValid = false;
        } else {
            console.log(`✓ ${fieldName}: "${field.value.trim()}"`);
        }
    });

    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value.trim())) {
            showFieldError(emailField, 'Please enter a valid email address');
            errors.push('Invalid email format');
            isValid = false;
        } else {
            console.log(`✓ Email valid: ${emailField.value.trim()}`);
        }
    }

    // Phone validation - More flexible for international numbers
    const phoneField = form.querySelector('input[type="tel"]');
    if (phoneField && phoneField.value.trim()) {
        // Remove spaces, dashes, and parentheses for validation
        const cleanPhone = phoneField.value.trim().replace(/[\s\-\(\)]/g, '');
        // Allow various formats: local, country code with +, country code without +
        const phonePattern = /^(\+?254|0)?[1-9]\d{7,9}$/;

        if (!phonePattern.test(cleanPhone)) {
            showFieldError(phoneField, 'Please enter a valid phone number');
            errors.push(`Invalid phone: ${phoneField.value.trim()}`);
            isValid = false;
        } else {
            console.log(`✓ Phone valid: ${phoneField.value.trim()}`);
        }
    }

    if (isValid) {
        showDebugInfo('Form validation PASSED ✓', 'success');
    } else {
        showDebugInfo(`Form validation FAILED: ${errors.join(', ')}`, 'error');
    }

    return isValid;
}

// Enhanced error display functions
function showFieldError(field, message) {
    if (!field) return;

    const formGroup = field.closest('.form-group');
    const errorElement = document.getElementById(field.id + 'Error');

    if (formGroup) {
        formGroup.classList.add('error');
    }

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    console.log(`Error on field ${field.id}: ${message}`);
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const formGroup = field.closest('.form-group');
    const errorElement = document.getElementById(fieldId + 'Error');

    if (formGroup) {
        formGroup.classList.remove('error');
    }

    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function clearAllErrors(form) {
    if (!form) return;

    form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });

    form.querySelectorAll('.validation-error').forEach(error => {
        error.style.display = 'none';
    });
}

// Enhanced WhatsApp message generation
function generateQuoteMessage(data) {
    const message = `🎉 *New Quote Request - Generali Global*\n\n` +
        `👤 *Client Details:*\n` +
        `• Name: ${data.quoteFirstName} ${data.quoteLastName}\n` +
        `• Email: ${data.quoteEmail}\n` +
        `• Phone: ${data.quotePhone}\n\n` +
        `🎊 *Event Information:*\n` +
        `• Type: ${data.quoteEventType}\n` +
        `• Duration: ${data.quoteEventDuration || 'To be discussed'}\n` +
        `• Sessions: ${data.quoteNumberOfSessions || '1'}\n\n` +
        `📝 *Additional Details:*\n` +
        `${data.eventDetails || 'No additional details provided'}\n\n` +
        `_This message was sent via Generali Global booking system_\n` +
        `Please provide a customized quote for this event. Thank you! 🙏`;

    console.log('Generated WhatsApp message:');
    console.log(message);
    return message;
}

// Enhanced WhatsApp redirect with better error handling
function redirectToWhatsApp(formType, data) {
    try {
        showDebugInfo('Preparing WhatsApp message...', 'info');

        const message = generateQuoteMessage(data);
        const whatsappNumber = '254702190131'; // Your WhatsApp number

        // Encode the message for URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        console.log('WhatsApp URL length:', whatsappUrl.length);
        console.log('WhatsApp URL:', whatsappUrl);

        // Check URL length (WhatsApp has limits)
        if (whatsappUrl.length > 2000) {
            showDebugInfo('Message too long, shortening...', 'warning');
            const shortMessage = `🎉 New Quote Request\n\nName: ${data.quoteFirstName} ${data.quoteLastName}\nEmail: ${data.quoteEmail}\nPhone: ${data.quotePhone}\nEvent: ${data.quoteEventType}\nDuration: ${data.quoteEventDuration}\n\nPlease provide a quote. Thanks!`;
            const shortUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(shortMessage)}`;
            console.log('Shortened URL:', shortUrl);

            openWhatsAppWithCountdown(shortUrl, data);
        } else {
            openWhatsAppWithCountdown(whatsappUrl, data);
        }

    } catch (error) {
        console.error('WhatsApp redirect error:', error);
        showDebugInfo(`WhatsApp redirect failed: ${error.message}`, 'error');
        alert('Failed to prepare WhatsApp message. Please try again or contact us directly.');
    }
}

// Separate function to handle the countdown and opening
function openWhatsAppWithCountdown(whatsappUrl, data) {
    try {
        // Show success message
        showSuccessMessage(data);
        showDebugInfo('Success message displayed, starting countdown...', 'success');

        // Countdown before redirecting
        let countdown = 3;
        const countdownElement = document.getElementById('countdown');

        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdownElement) {
                countdownElement.textContent = `Redirecting in ${countdown} second${countdown !== 1 ? 's' : ''}...`;
            }

            console.log(`Countdown: ${countdown}`);

            if (countdown <= 0) {
                clearInterval(countdownInterval);

                showDebugInfo('Opening WhatsApp...', 'info');
                console.log('Attempting to open WhatsApp URL:', whatsappUrl);

                // Try multiple methods to ensure WhatsApp opens
                try {
                    // Method 1: window.open (preferred)
                    const whatsappWindow = window.open(whatsappUrl, '_blank');

                    if (!whatsappWindow) {
                        showDebugInfo('Pop-up blocked, trying alternative...', 'warning');
                        // Method 2: location.href as fallback
                        window.location.href = whatsappUrl;
                    } else {
                        showDebugInfo('WhatsApp opened successfully!', 'success');
                    }
                } catch (openError) {
                    console.error('Failed to open WhatsApp:', openError);
                    showDebugInfo(`Failed to open WhatsApp: ${openError.message}`, 'error');

                    // Method 3: Show manual link as last resort
                    if (countdownElement) {
                        countdownElement.innerHTML = `
                                    <p>Unable to auto-open WhatsApp.</p>
                                    <a href="${whatsappUrl}" target="_blank" style="color: var(--color-gold); text-decoration: underline;">
                                        Click here to open WhatsApp manually
                                    </a>
                                `;
                    }
                }
            }
        }, 1000);

    } catch (error) {
        console.error('Countdown error:', error);
        showDebugInfo(`Countdown error: ${error.message}`, 'error');
    }
}

// Enhanced success message display
function showSuccessMessage(data) {
    try {
        const container = document.getElementById('success-message-container');
        const messageText = document.getElementById('success-message-text');
        const quoteForm = document.getElementById('quote-form');

        if (!container || !messageText || !quoteForm) {
            showDebugInfo('Success message elements not found', 'error');
            console.error('Missing success message elements:', {
                container: !!container,
                messageText: !!messageText,
                quoteForm: !!quoteForm
            });
            return;
        }

        // Hide the form
        quoteForm.style.display = 'none';

        // Update success message
        messageText.innerHTML = `
                    <p>Thank you <strong>${data.quoteFirstName}</strong>, your quote request has been prepared!</p>
                    <p>You will be redirected to WhatsApp in a moment to send your request and receive your customized quote.</p>
                `;

        // Show success container
        container.style.display = 'block';
        showDebugInfo('Success message displayed', 'success');

        // Scroll to success message
        setTimeout(() => {
            container.scrollIntoView({ behavior: 'smooth' });
        }, 100);

    } catch (error) {
        console.error('Error showing success message:', error);
        showDebugInfo(`Error showing success: ${error.message}`, 'error');
    }
}

// Enhanced form submission handler
function handleQuoteSubmit(e) {
    e.preventDefault();

    showDebugInfo('Form submission started', 'info');
    console.log('Quote form submitted');

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';

    try {
        // Show loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading"></span> Processing...';
            showDebugInfo('Button disabled, showing loading state', 'info');
        }

        // Validate form
        if (!validateForm(form)) {
            showDebugInfo('Form validation failed', 'error');
            alert('Please fill all required fields correctly');
            return;
        }

        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        console.log('Collected form data:', data);
        showDebugInfo('Form data collected successfully', 'success');

        // Verify all required data is present
        const requiredFields = ['quoteFirstName', 'quoteLastName', 'quoteEmail', 'quotePhone', 'quoteEventType', 'quoteEventDuration'];
        const missingData = requiredFields.filter(field => !data[field]);

        if (missingData.length > 0) {
            showDebugInfo(`Missing data: ${missingData.join(', ')}`, 'error');
            alert('Some required data is missing. Please check the form.');
            return;
        }

        // Process WhatsApp redirect
        redirectToWhatsApp('quote', data);

    } catch (error) {
        console.error('Quote submission error:', error);
        showDebugInfo(`Submission error: ${error.message}`, 'error');
        alert('An error occurred while processing your request. Please try again.');
    } finally {
        // Reset button state
        if (submitBtn) {
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 2000); // Keep disabled for 2 seconds to prevent double submission
        }
    }
}

// Enhanced mobile menu setup
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const closeBtn = document.getElementById('close-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            showDebugInfo('Opening mobile menu', 'info');
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeBtn && mobileMenu) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showDebugInfo('Closing mobile menu', 'info');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close menu on outside click
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function (e) {
            if (e.target === mobileMenu) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Enhanced real-time validation setup
function setupRealTimeValidation() {
    // Email validation
    const emailFields = document.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        field.addEventListener('blur', function () {
            if (this.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(this.value.trim())) {
                    showFieldError(this, 'Please enter a valid email address');
                } else {
                    clearFieldError(this.id);
                }
            }
        });

        field.addEventListener('input', function () {
            clearFieldError(this.id);
        });
    });

    // Phone validation
    const phoneFields = document.querySelectorAll('input[type="tel"]');
    phoneFields.forEach(field => {
        field.addEventListener('blur', function () {
            if (this.value.trim()) {
                const cleanPhone = this.value.trim().replace(/[\s\-\(\)]/g, '');
                const phonePattern = /^(\+?254|0)?[1-9]\d{7,9}$/;

                if (!phonePattern.test(cleanPhone)) {
                    showFieldError(this, 'Please enter a valid phone number');
                } else {
                    clearFieldError(this.id);
                }
            }
        });

        field.addEventListener('input', function () {
            clearFieldError(this.id);
        });
    });

    // Required field validation
    const requiredFields = document.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function () {
            if (!this.value.trim()) {
                showFieldError(this, 'This field is required');
            } else {
                clearFieldError(this.id);
            }
        });

        field.addEventListener('input', function () {
            if (this.value.trim()) {
                clearFieldError(this.id);
            }
        });
    });

    showDebugInfo('Real-time validation setup complete', 'success');
}

// Enhanced initialization
function initializeSystem() {
    try {
        showDebugInfo('System initializing...', 'info');
        console.log('Initializing booking system...');

        // Check if all required elements exist
        if (!checkElements()) {
            throw new Error('Required elements missing from page');
        }

        // Setup form handlers
        const quoteForm = document.getElementById('quoteForm');
        if (quoteForm) {
            quoteForm.addEventListener('submit', handleQuoteSubmit);
            showDebugInfo('Form handler attached', 'success');
        } else {
            throw new Error('Quote form not found');
        }

        // Setup real-time validation
        setupRealTimeValidation();

        // Setup mobile menu
        setupMobileMenu();

        showDebugInfo('System ready - Form can be submitted', 'success');
        console.log('System initialization complete');

    } catch (error) {
        console.error('Initialization failed:', error);
        showDebugInfo(`Initialization failed: ${error.message}`, 'error');
        alert('System initialization failed. Please refresh the page and try again.');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    // Small delay to ensure all elements are fully loaded
    setTimeout(initializeSystem, 100);
});

// Additional debugging: Log any JavaScript errors
window.addEventListener('error', function (e) {
    console.error('JavaScript Error:', e.error);
    showDebugInfo(`JavaScript Error: ${e.message} at line ${e.lineno}`, 'error');
});

// Test function you can call from console for debugging
window.testWhatsApp = function (testData = null) {
    const data = testData || {
        quoteFirstName: 'John',
        quoteLastName: 'Doe',
        quoteEmail: 'john@example.com',
        quotePhone: '+254712345678',
        quoteEventType: 'Corporate Events',
        quoteEventDuration: '4 hours',
        quoteNumberOfSessions: '1',
        eventDetails: 'Test event'
    };

    console.log('Testing WhatsApp with data:', data);
    redirectToWhatsApp('quote', data);
};