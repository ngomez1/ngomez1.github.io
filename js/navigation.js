/**
 * Wedding Website - Navigation JavaScript
 * Handles navigation functionality and mobile menu
 */

document.addEventListener('DOMContentLoaded', function() {
    initMobileNavigation();
    initSmoothScrolling();
    highlightCurrentPage();
});

/**
 * Initialize mobile navigation functionality
 */
function initMobileNavigation() {
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const body = document.body;
    
    // If mobile nav toggle doesn't exist, return
    if (!mobileNavToggle) return;
    
    // Toggle mobile navigation when button is clicked
    mobileNavToggle.addEventListener('click', function() {
        body.classList.toggle('nav-open');
    });
    
    // Close mobile navigation when clicking outside
    document.addEventListener('click', function(event) {
        const sideNav = document.querySelector('.side-nav');
        const isClickInsideNav = sideNav.contains(event.target);
        const isClickOnToggle = mobileNavToggle.contains(event.target);
        
        if (body.classList.contains('nav-open') && !isClickInsideNav && !isClickOnToggle) {
            body.classList.remove('nav-open');
        }
    });
    
    // Close mobile navigation when a link is clicked
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            body.classList.remove('nav-open');
        });
    });
    
    // Close mobile navigation when window is resized to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 767 && body.classList.contains('nav-open')) {
            body.classList.remove('nav-open');
        }
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    // Get all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Get the target element
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            // If target element exists, scroll to it
            if (targetElement) {
                e.preventDefault();
                
                const headerOffset = 60; // Adjust based on fixed header height if needed
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Highlight the current page in the navigation
 */
function highlightCurrentPage() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Find the corresponding navigation link
    const navLinks = document.querySelectorAll('.nav-links li');
    
    navLinks.forEach(li => {
        const link = li.querySelector('a');
        const linkHref = link.getAttribute('href');
        
        // Remove active class from all links
        li.classList.remove('active');
        
        // Add active class to current page link
        if (linkHref === currentPage) {
            li.classList.add('active');
        }
    });
}

/**
 * Add a page transition when navigating between pages
 */
function addPageTransition() {
    const links = document.querySelectorAll('a:not([href^="#"]):not([target="_blank"])');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only apply transition for internal links
            if (this.hostname === window.location.hostname) {
                e.preventDefault();
                
                const href = this.getAttribute('href');
                const mainContent = document.querySelector('.main-content');
                
                // Add exit animation
                mainContent.classList.add('page-exit');
                
                // Navigate to new page after animation completes
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            }
        });
    });
}

/**
 * Handle back/forward browser navigation
 */
window.addEventListener('popstate', function() {
    // Add page transition when using browser back/forward buttons
    const mainContent = document.querySelector('.main-content');
    mainContent.classList.add('page-transition');
});