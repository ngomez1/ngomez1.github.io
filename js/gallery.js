/**
 * Wedding Website - Gallery JavaScript
 * Handles photo gallery functionality with lightbox
 */

document.addEventListener('DOMContentLoaded', function() {
    initGallery();
});

/**
 * Initialize the photo gallery with lightbox functionality
 */
function initGallery() {
    const galleryContainer = document.querySelector('.gallery-container');
    
    // If gallery container doesn't exist on this page, return
    if (!galleryContainer) return;
    
    // Create lightbox elements if they don't exist
    if (!document.querySelector('.lightbox')) {
        createLightbox();
    }
    
    // Add click event to gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imageSrc = this.querySelector('img').getAttribute('src');
            const imageAlt = this.querySelector('img').getAttribute('alt') || '';
            const imageCaption = this.querySelector('.gallery-caption')?.textContent || '';
            
            openLightbox(imageSrc, imageAlt, imageCaption);
        });
    });
    
    // Initialize gallery filters if they exist
    initGalleryFilters();
}

/**
 * Create lightbox elements and append to the DOM
 */
function createLightbox() {
    // Create lightbox container
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    
    // Create lightbox content
    lightbox.innerHTML = `
        <div class="lightbox-overlay"></div>
        <div class="lightbox-container">
            <button class="lightbox-close">&times;</button>
            <div class="lightbox-content">
                <img src="" alt="" class="lightbox-image">
                <div class="lightbox-caption"></div>
            </div>
            <button class="lightbox-prev">&lsaquo;</button>
            <button class="lightbox-next">&rsaquo;</button>
        </div>
    `;
    
    // Append to body
    document.body.appendChild(lightbox);
    
    // Add event listeners
    const overlay = lightbox.querySelector('.lightbox-overlay');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const prevButton = lightbox.querySelector('.lightbox-prev');
    const nextButton = lightbox.querySelector('.lightbox-next');
    
    // Close lightbox when clicking overlay or close button
    overlay.addEventListener('click', closeLightbox);
    closeButton.addEventListener('click', closeLightbox);
    
    // Navigate between images
    prevButton.addEventListener('click', showPrevImage);
    nextButton.addEventListener('click', showNextImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!document.querySelector('.lightbox.active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });
}

/**
 * Open the lightbox with the specified image
 * @param {string} src - The source URL of the image
 * @param {string} alt - The alt text of the image
 * @param {string} caption - The caption for the image
 */
function openLightbox(src, alt, caption) {
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    
    // Set image source and alt text
    lightboxImage.setAttribute('src', src);
    lightboxImage.setAttribute('alt', alt);
    
    // Set caption
    lightboxCaption.textContent = caption;
    
    // Show lightbox
    lightbox.classList.add('active');
    document.body.classList.add('lightbox-open');
    
    // Store current image index
    const galleryItems = document.querySelectorAll('.gallery-item:not(.hidden)');
    let currentIndex = -1;
    
    galleryItems.forEach((item, index) => {
        const itemSrc = item.querySelector('img').getAttribute('src');
        if (itemSrc === src) {
            currentIndex = index;
        }
    });
    
    lightbox.setAttribute('data-index', currentIndex);
}

/**
 * Close the lightbox
 */
function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    lightbox.classList.remove('active');
    document.body.classList.remove('lightbox-open');
}

/**
 * Show the previous image in the gallery
 */
function showPrevImage() {
    const lightbox = document.querySelector('.lightbox');
    const currentIndex = parseInt(lightbox.getAttribute('data-index'));
    const galleryItems = document.querySelectorAll('.gallery-item:not(.hidden)');
    
    if (galleryItems.length === 0) return;
    
    // Calculate previous index (loop to the end if at the beginning)
    const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    const prevItem = galleryItems[prevIndex];
    
    // Get image details
    const imageSrc = prevItem.querySelector('img').getAttribute('src');
    const imageAlt = prevItem.querySelector('img').getAttribute('alt') || '';
    const imageCaption = prevItem.querySelector('.gallery-caption')?.textContent || '';
    
    // Update lightbox
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    
    lightboxImage.setAttribute('src', imageSrc);
    lightboxImage.setAttribute('alt', imageAlt);
    lightboxCaption.textContent = imageCaption;
    
    // Update current index
    lightbox.setAttribute('data-index', prevIndex);
}

/**
 * Show the next image in the gallery
 */
function showNextImage() {
    const lightbox = document.querySelector('.lightbox');
    const currentIndex = parseInt(lightbox.getAttribute('data-index'));
    const galleryItems = document.querySelectorAll('.gallery-item:not(.hidden)');
    
    if (galleryItems.length === 0) return;
    
    // Calculate next index (loop to the beginning if at the end)
    const nextIndex = (currentIndex + 1) % galleryItems.length;
    const nextItem = galleryItems[nextIndex];
    
    // Get image details
    const imageSrc = nextItem.querySelector('img').getAttribute('src');
    const imageAlt = nextItem.querySelector('img').getAttribute('alt') || '';
    const imageCaption = nextItem.querySelector('.gallery-caption')?.textContent || '';
    
    // Update lightbox
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    
    lightboxImage.setAttribute('src', imageSrc);
    lightboxImage.setAttribute('alt', imageAlt);
    lightboxCaption.textContent = imageCaption;
    
    // Update current index
    lightbox.setAttribute('data-index', nextIndex);
}

/**
 * Initialize gallery filters
 */
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.gallery-filter-button');
    
    // If no filter buttons, return
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filter = this.getAttribute('data-filter');
            
            // Filter gallery items
            const galleryItems = document.querySelectorAll('.gallery-item');
            
            galleryItems.forEach(item => {
                if (filter === 'all') {
                    item.classList.remove('hidden');
                } else {
                    const itemCategory = item.getAttribute('data-category');
                    if (itemCategory === filter) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                }
            });
        });
    });
}

/**
 * Lazy load gallery images
 */
function lazyLoadGalleryImages() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    // Stop observing the image
                    observer.unobserve(img);
                }
            });
        });
        
        // Observe all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
}

// Initialize lazy loading when the page loads
document.addEventListener('DOMContentLoaded', lazyLoadGalleryImages);