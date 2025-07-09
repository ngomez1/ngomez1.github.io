/**
 * Wedding Website - Main JavaScript
 * Contains core functionality and initialization
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initCountdown();
    initScrollAnimations();
    
    // Add page transition class to main content
    document.querySelector('.main-content').classList.add('page-transition');
});

/**
 * Initialize countdown timer to wedding date
 */
function initCountdown() {
    const countdown = document.getElementById('countdown');
    
    // If countdown element doesn't exist on this page, return
    if (!countdown) return;
    
    // Set the wedding date - August 15, 2026
    const weddingDate = new Date('June 13, 2026 17:00:00').getTime();
    
    // Update the countdown every second
    const timer = setInterval(function() {
        // Get today's date and time
        const now = new Date().getTime();
        
        // Find the distance between now and the wedding date
        const distance = weddingDate - now;
        
        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the result
        document.getElementById('countdown-days').textContent = days;
        document.getElementById('countdown-hours').textContent = hours;
        document.getElementById('countdown-minutes').textContent = minutes;
        document.getElementById('countdown-seconds').textContent = seconds;
        
        // If the countdown is finished, display a message
        if (distance < 0) {
            clearInterval(timer);
            countdown.innerHTML = "<div class='countdown-finished'>Our Wedding Day Has Arrived!</div>";
        }
    }, 1000);
}

/**
 * Initialize scroll animations using Intersection Observer
 */
function initScrollAnimations() {
    // Select all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .timeline-item');
    
    // If no animated elements on this page, return
    if (animatedElements.length === 0) return;
    
    // Create the observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Trigger when at least 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Adjust the trigger point (negative value means trigger before fully visible)
    });
    
    // Observe each animated element
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Utility function to format date
 * @param {Date} date - The date to format
 * @return {string} Formatted date string
 */
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Utility function to validate email
 * @param {string} email - The email to validate
 * @return {boolean} Whether the email is valid
 */
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Utility function to show a notification
 * @param {string} message - The message to display
 * @param {string} type - The type of notification ('success' or 'error')
 */
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to the DOM
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}