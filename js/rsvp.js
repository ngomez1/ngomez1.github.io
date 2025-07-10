/**
 * Wedding Website - RSVP Form JavaScript
 * Handles RSVP form validation and submission to Supabase
 * For Nicholas Alexander Gomez & Lauren Nicole Mitchell's Wedding
 */

document.addEventListener('DOMContentLoaded', function() {
    initRSVPForm();
    initFormDynamicBehavior();
});

/**
 * Initialize RSVP form validation and submission
 */
function initRSVPForm() {
    const rsvpForm = document.getElementById('rsvp-form');
    
    // If RSVP form doesn't exist on this page, return
    if (!rsvpForm) return;
    
    // Add form submission handler
    rsvpForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateRSVPForm(rsvpForm)) {
            return;
        }
        
        // Show loading state
        const submitButton = rsvpForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="loading-spinner"></span> Submitting...';
        
        try {
            // Get form data
            const formData = new FormData(rsvpForm);
            const isAttending = formData.get('attending') === 'yes';
            
            const rsvpData = {
                name: `${getFormValue(formData, 'first_name')} ${getFormValue(formData, 'last_name')}`,
                email: getFormValue(formData, 'email'),
                phone: getFormValue(formData, 'phone', 'Not provided'),
                attending: isAttending,
                guest_count: isAttending ? parseInt(getFormValue(formData, 'guest_count', '0')) : 0,
                meal_preference: isAttending ? getFormValue(formData, 'meal_preference', 'None specified') : 'Not attending',
                song_request: getFormValue(formData, 'song_requests', 'None specified'),
                dietary_restrictions: getFormValue(formData, 'dietary_restrictions', 'None specified'),
                notes: getFormValue(formData, 'notes', 'None specified')
            };

            // Collect additional guests data if attending and guest count > 1
            const guests = [];
            if (isAttending && parseInt(getFormValue(formData, 'guest_count', '0')) > 1) {
                // Start from guest 1 (index 1) since the primary guest is already included
                for (let i = 1; i < parseInt(getFormValue(formData, 'guest_count', '0')); i++) {
                    const guestFirstName = getFormValue(formData, `guest_${i}_first_name`, '');
                    const guestLastName = getFormValue(formData, `guest_${i}_last_name`, '');
                    
                    // Only add if we have at least a first name
                    if (guestFirstName) {
                        guests.push({
                            first_name: guestFirstName,
                            last_name: guestLastName,
                            meal_preference: getFormValue(formData, `guest_${i}_meal`, ''),
                            dietary_restrictions: getFormValue(formData, `guest_${i}_dietary`, '')
                        });
                    }
                }
            }

            // Add guests to rsvpData
            rsvpData.guests = guests;

            
            // Submit to Supabase
            const success = await submitRSVPToSupabase(rsvpData);
            
            if (success) {
                // Show success message
                showNotification('Thank you for your RSVP! Nicholas and Lauren look forward to celebrating with you.', 'success');
                
                // Reset form
                rsvpForm.reset();
                
                // Hide conditional fields
                document.querySelectorAll('.conditional-field').forEach(field => {
                    field.style.display = 'none';
                });
                
                // Redirect to success page after a delay
                setTimeout(() => {
                    window.location.href = 'success.html';
                }, 2000);
            } else {
                // Show error message
                showNotification('There was an error submitting your RSVP. Please try again.', 'error');
            }
        } catch (error) {
            console.error('RSVP submission error:', error);
            showNotification('There was an error submitting your RSVP. Please try again.', 'error');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

/**
 * Validate the RSVP form
 * @param {HTMLFormElement} form - The form to validate
 * @return {boolean} Whether the form is valid
 */
function validateRSVPForm(form) {
    // Reset previous error messages
    form.querySelectorAll('.error-message').forEach(error => {
        error.remove();
    });
    form.querySelectorAll('.error').forEach(field => {
        field.classList.remove('error');
    });
    
    let isValid = true;
    
    // Validate first name (required)
    const firstNameInput = form.querySelector('[name="first_name"]');
    if (!firstNameInput.value.trim()) {
        showFieldError(firstNameInput, 'Please enter your first name');
        isValid = false;
    }
    
    // Validate last name (required)
    const lastNameInput = form.querySelector('[name="last_name"]');
    if (!lastNameInput.value.trim()) {
        showFieldError(lastNameInput, 'Please enter your last name');
        isValid = false;
    }
    
    // Validate email (required and format)
    const emailInput = form.querySelector('[name="email"]');
    if (!emailInput.value.trim()) {
        showFieldError(emailInput, 'Please enter your email');
        isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate attending (required)
    const attendingInputs = form.querySelectorAll('[name="attending"]');
    let attendingChecked = false;
    attendingInputs.forEach(input => {
        if (input.checked) {
            attendingChecked = true;
        }
    });
    if (!attendingChecked) {
        const attendingField = form.querySelector('.form-group .radio-group');
        if (attendingField) {
            showFieldError(attendingField, 'Please select whether you are attending');
        } else {
            // Fallback if the specific structure isn't found
            const radioGroup = form.querySelector('.radio-group');
            showFieldError(radioGroup || attendingInputs[0], 'Please select whether you are attending');
        }
        isValid = false;
    }
    
    // If attending, validate guest count and meal preference
    const attendingYes = form.querySelector('[name="attending"][value="yes"]');
    const attendingNo = form.querySelector('[name="attending"][value="no"]');
    
    if (attendingYes && attendingYes.checked) {
        const guestCountInput = form.querySelector('[name="guest_count"]');
        if (!guestCountInput.value) {
            showFieldError(guestCountInput, 'Please enter the number of guests');
            isValid = false;
        } else if (parseInt(guestCountInput.value) < 1) {
            showFieldError(guestCountInput, 'Please enter at least 1 guest');
            isValid = false;
        }
        
        // Validate meal preference
        const mealPreferenceInput = form.querySelector('[name="meal_preference"]');
        if (mealPreferenceInput && !mealPreferenceInput.value) {
            showFieldError(mealPreferenceInput, 'Please select your meal preference');
            isValid = false;
        }
    } else if (attendingNo && attendingNo.checked) {
        // Skip validation for guest count and meal preference if not attending
        
        // If plus-one name is provided, validate plus-one meal
        const plusOneNameInput = form.querySelector('[name="plus_one_name"]');
        const plusOneMealInput = form.querySelector('[name="plus_one_meal"]');
        if (plusOneNameInput && plusOneMealInput && plusOneNameInput.value.trim() && !plusOneMealInput.value) {
            showFieldError(plusOneMealInput, 'Please select a meal preference for your plus-one');
            isValid = false;
        }
    }
    
    return isValid;
}

/**
 * Show an error message for a form field
 * @param {HTMLElement} field - The field with the error
 * @param {string} message - The error message to display
 */
function showFieldError(field, message) {
    // Find the parent form-group element
    const formGroup = field.closest('.form-group');
    
    if (formGroup) {
        // Add error class to the form-group
        formGroup.classList.add('error');
        
        // Remove any existing error messages
        const existingErrors = formGroup.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());
        
        // Create error message element
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        
        // Add error message to the form-group
        formGroup.appendChild(errorMessage);
    } else {
        // Fallback if form-group not found
        field.classList.add('error');
        
        // Create error message element
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        
        // Add error message after the field
        field.parentNode.appendChild(errorMessage);
    }
}

/**
 * Initialize dynamic behavior for the RSVP form
 */
function initFormDynamicBehavior() {
    const rsvpForm = document.getElementById('rsvp-form');
    
    // If RSVP form doesn't exist on this page, return
    if (!rsvpForm) return;
    
    // Show/hide fields based on attending selection
    const attendingInputs = rsvpForm.querySelectorAll('[name="attending"]');
    const attendanceDetails = document.getElementById('attendance-details');
    
    attendingInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value === 'yes' && this.checked) {
                // Show attendance details if attending
                if (attendanceDetails) {
                    attendanceDetails.style.display = 'block';
                }
                
                // Restore required attributes for visible fields
                const guestCountInput = rsvpForm.querySelector('#guest-count');
                const mealPreferenceInput = rsvpForm.querySelector('#meal-preference');
                
                if (guestCountInput) guestCountInput.setAttribute('required', '');
                if (mealPreferenceInput) mealPreferenceInput.setAttribute('required', '');
            } else if (this.value === 'no' && this.checked) {
                // Hide attendance details if not attending
                if (attendanceDetails) {
                    attendanceDetails.style.display = 'none';
                }
                
                // Remove required attributes from hidden fields
                const guestCountInput = rsvpForm.querySelector('#guest-count');
                const mealPreferenceInput = rsvpForm.querySelector('#meal-preference');
                
                if (guestCountInput) guestCountInput.removeAttribute('required');
                if (mealPreferenceInput) mealPreferenceInput.removeAttribute('required');
            }
        });
    });
    
    // Initialize attendance details based on initial state
    const attendingYes = rsvpForm.querySelector('[name="attending"][value="yes"]');
    const attendingNo = rsvpForm.querySelector('[name="attending"][value="no"]');
    const guestCountInput = rsvpForm.querySelector('#guest-count');
    const mealPreferenceInput = rsvpForm.querySelector('#meal-preference');
    
    if (attendingYes && attendingYes.checked) {
        if (attendanceDetails) {
            attendanceDetails.style.display = 'block';
        }
        
        // Ensure required attributes are set
        if (guestCountInput) guestCountInput.setAttribute('required', '');
        if (mealPreferenceInput) mealPreferenceInput.setAttribute('required', '');
    } else if (attendingNo && attendingNo.checked) {
        if (attendanceDetails) {
            attendanceDetails.style.display = 'none';
        }
        
        // Remove required attributes
        if (guestCountInput) guestCountInput.removeAttribute('required');
        if (mealPreferenceInput) mealPreferenceInput.removeAttribute('required');
    } else {
        if (attendanceDetails) {
            attendanceDetails.style.display = 'none';
        }
    }
}

/**
 * Helper function to safely get form data
 * @param {FormData} formData - The FormData object
 * @param {string} fieldName - The name of the field to get
 * @param {string} defaultValue - Default value if field is not present
 * @return {string} The field value or default value
 */
function getFormValue(formData, fieldName, defaultValue = '') {
    const value = formData.get(fieldName);
    return value !== null ? value : defaultValue;
}

/**
 * Display a notification message to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of notification ('success', 'error', 'info')
 * @param {number} duration - How long to show the notification in ms
 */
function showNotification(message, type = 'info', duration = 5000) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.setAttribute('role', 'alert');
    
    // Create message content
    const messageContent = document.createElement('div');
    messageContent.className = 'notification-content';
    messageContent.textContent = message;
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'notification-close';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close notification');
    closeButton.addEventListener('click', () => {
        notification.classList.add('notification-hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Assemble notification
    notification.appendChild(messageContent);
    notification.appendChild(closeButton);
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add visible class after a small delay (for animation)
    setTimeout(() => {
        notification.classList.add('notification-visible');
    }, 10);
    
    // Auto-remove after duration
    if (duration > 0) {
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.add('notification-hiding');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.remove();
                    }
                }, 300);
            }
        }, duration);
    }
}

/**
 * Validate an email address
 * @param {string} email - The email address to validate
 * @return {boolean} Whether the email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}