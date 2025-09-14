// Debug function to show status messages
function showDebugInfo(message) {
    const debugInfo = document.getElementById('debugInfo');
    debugInfo.textContent = message;
    debugInfo.style.display = 'block';
    console.log('DEBUG:', message);

    // Auto-hide after 5 seconds
    setTimeout(() => {
        debugInfo.style.display = 'none';
    }, 5000);
}

// Check if all required elements exist
function checkElements() {
    const requiredElements = [
        'quoteForm', 'quoteFirstName', 'quoteLastName', 'quoteEmail',
        'quotePhone', 'quoteEventType', 'quoteEventDuration',
        'success-message-container', 'countdown'
    ];

    let allElementsExist = true;

    requiredElements.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Element with ID ${id} not found`);
            showDebugInfo(`Error: Element ${id} not found`);
            allElementsExist = false;
        }
    });

    return allElementsExist;
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('Initializing quote system...');
    showDebugInfo('System initializing...');

    // Check if all required elements exist
    if (!checkElements()) {
        console.error('Required elements missing');
        showDebugInfo('Error: Some elements are missing from the page');
        return;
    }

    // Initialize all components
    try {
        setupFormHandlers();
        setupMobileMenu();
        console.log('System ready');
        showDebugInfo('System ready - Form can be submitted');
    } catch (error) {
        console.error('Initialization failed:', error);
        showDebugInfo('Initialization failed: ' + error.message);
        alert('System initialization failed. Please refresh the page.');
    }
});

/* ========== FORM HANDLING ========== */
function setupFormHandlers() {
    // Form submissions
    const quoteForm = document.getElementById('quoteForm');

    if (quoteForm) {
        quoteForm.addEventListener('submit', handleQuoteSubmit);
        console.log('Quote form handler attached');
        showDebugInfo('Form handler attached');
    } else {
        console.warn('Quote form not found');
        showDebugInfo('Error: Form not found');
    }

    // Real-time validation
    setupRealTimeValidation();
}

function setupRealTimeValidation() {
    // Email validation
    const emailFields = document.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        field.addEventListener('blur', function () {
            validateEmail(this);
        });
        field.addEventListener('input', function () {
            // Clear error on input
            clearFieldError(this.id);
        });
    });

    // Phone validation
    const phoneFields = document.querySelectorAll('input[type="tel"]');
    phoneFields.forEach(field => {
        field.addEventListener('blur', function () {
            validatePhone(this);
        });
        field.addEventListener('input', function () {
            clearFieldError(this.id);
        });
    });

    // Required field validation
    const requiredFields = document.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function () {
            validateRequiredField(this);
        });
        field.addEventListener('input', function () {
            clearFieldError(this.id);
        });
    });
}

/* ========== FORM VALIDATION ========== */
function validateForm(form) {
    if (!form) {
        console.error('Form not provided for validation');
        showDebugInfo('Error: Form validation failed');
        return false;
    }

    let isValid = true;

    console.log('Validating form');
    showDebugInfo('Validating form...');

    // Reset all errors first
    clearAllErrors(form);

    // Validate each required field
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!validateRequiredField(field)) {
            isValid = false;
        }
    });

    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value.trim()) {
        if (!validateEmail(emailField)) {
            isValid = false;
        }
    }

    // Phone validation
    const phoneField = form.querySelector('input[type="tel"]');
    if (phoneField && phoneField.value.trim()) {
        if (!validatePhone(phoneField)) {
            isValid = false;
        }
    }

    console.log('Form validation result:', isValid);
    showDebugInfo('Form validation: ' + (isValid ? 'PASSED' : 'FAILED'));
    return isValid;
}

function validateEmail(field) {
    if (!field) return false;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorElement = document.getElementById(field.id + 'Error');

    if (!field.value.trim() || !emailPattern.test(field.value.trim())) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    } else {
        clearFieldError(field.id);
        return true;
    }
}

function validatePhone(field) {
    if (!field) return false;

    // Kenyan phone number validation (10-12 digits, with or without country code)
    const phonePattern = /^(\+?254|0)?[17]\d{8}$/;
    const errorElement = document.getElementById(field.id + 'Error');

    if (!field.value.trim()) {
        showFieldError(field, 'Phone number is required');
        return false;
    } else if (!phonePattern.test(field.value.trim().replace(/\s/g, ''))) {
        showFieldError(field, 'Please enter a valid Kenyan phone number (10-12 digits)');
        return false;
    } else {
        clearFieldError(field.id);
        return true;
    }
}

function validateRequiredField(field) {
    if (!field) return false;

    if (!field.value.trim()) {
        showFieldError(field, 'This field is required');
        return false;
    } else {
        clearFieldError(field.id);
        return true;
    }
}

/* ========== ERROR HANDLING UTILITIES ========== */
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

/* ========== SUBMISSION HANDLERS ========== */
function handleQuoteSubmit(e) {
    e.preventDefault();
    console.log('Quote form submitted');
    showDebugInfo('Form submission started');

    const form = e.target;

    try {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading"></span> Processing...';
        }

        // Validate form
        if (!validateForm(form)) {
            console.log('Form validation failed');
            showDebugInfo('Form validation failed - please check fields');
            alert('Please fill all required fields correctly');

            // Reset button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
            return;
        }

        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        console.log('Quote data collected:', data);
        showDebugInfo('Form data collected successfully');

        // Reset button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }

        // Redirect to WhatsApp automatically
        redirectToWhatsApp('quote', data);

    } catch (error) {
        console.error('Quote submission error:', error);
        showDebugInfo('Submission error: ' + error.message);
        alert('An error occurred. Please try again.');

        // Reset button
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Request Quote via WhatsApp';
        }
    }
}

/* ========== WHATSAPP INTEGRATION ========== */
function redirectToWhatsApp(formType, data) {
    try {
        const message = generateQuoteMessage(data);

        console.log('Generated WhatsApp message for', formType);
        showDebugInfo('Generated WhatsApp message');

        const whatsappUrl = `https://wa.me/254702190131?text=${encodeURIComponent(message)}`;

        // Show success message first
        showSuccessMessage(formType, data);

        // Countdown before redirecting
        let countdown = 3;
        const countdownElement = document.getElementById('countdown');

        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdownElement) {
                countdownElement.textContent = `Redirecting in ${countdown} second${countdown !== 1 ? 's' : ''}...`;
            }

            if (countdown <= 0) {
                clearInterval(countdownInterval);
                // Open WhatsApp after countdown
                window.open(whatsappUrl, '_blank');
                showDebugInfo('Opened WhatsApp with pre-filled message');
            }
        }, 1000);

    } catch (error) {
        console.error('WhatsApp redirect failed:', error);
        showDebugInfo('WhatsApp redirect failed: ' + error.message);
        alert('Failed to generate WhatsApp message. Please try again.');
    }
}

function generateQuoteMessage(data) {
    return `💡 New Quote Request:\n\n` +
        `👤 Name: ${data.quoteFirstName} ${data.quoteLastName}\n` +
        `✉️ Email: ${data.quoteEmail}\n` +
        `📞 Phone: ${data.quotePhone}\n\n` +
        `🎉 Event Type: ${data.quoteEventType}\n` +
        `⏳ Duration: ${data.quoteEventDuration || 'To be discussed'}\n` +
        `🔄 Sessions: ${data.quoteNumberOfSessions || '1'}\n\n` +
        `📝 Additional Details:\n${data.eventDetails || 'No additional details provided'}\n\n` +
        `_This message was sent via Generali Global booking system_`;
}

/* ========== UI COMPONENTS ========== */
function showSuccessMessage(formType, data) {
    try {
        const container = document.getElementById('success-message-container');
        const messageText = document.getElementById('success-message-text');
        const quoteForm = document.getElementById('quote-form');

        if (!container || !messageText || !quoteForm) {
            console.error('Success message elements not found');
            showDebugInfo('Error: Success message elements not found');
            return;
        }

        // Hide the form
        quoteForm.style.display = 'none';

        // Generate success message
        messageText.innerHTML = `
                    <p>Thank you ${data.quoteFirstName}, your quote request has been prepared.</p>
                    <p>You will be redirected to WhatsApp in a moment to send your request and receive your customized quote.</p>
                `;

        // Show success container
        container.style.display = 'block';
        showDebugInfo('Success message displayed');

        // Scroll to success message
        setTimeout(() => {
            container.scrollIntoView({ behavior: 'smooth' });
        }, 100);

    } catch (error) {
        console.error('Error showing success message:', error);
        showDebugInfo('Error showing success: ' + error.message);
    }
}

/* ========== MOBILE MENU ========== */
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const closeBtn = document.getElementById('close-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Opening mobile menu');
            showDebugInfo('Opening mobile menu');
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeBtn && mobileMenu) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Closing mobile menu');
            showDebugInfo('Closing mobile menu');
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