/**
 * Placeholder Image Generator for Wedding Website
 * 
 * This script generates SVG placeholder images with the wedding theme colors
 * (pink, white, green, and gold) for use throughout the website.
 */

const fs = require('fs');
const path = require('path');

// Wedding theme colors
const colors = {
    primaryPink: '#e7a9bc',
    secondaryPink: '#d782a3',
    primaryGreen: '#b8d8be',
    secondaryGreen: '#7fb285',
    accentGold: '#d4af37',
    white: '#ffffff',
    offWhite: '#f9f7f3'
};

// Directories to create placeholder images for
const directories = [
    'assets/images/hero',
    'assets/images/gallery',
    'assets/images/couple',
    'assets/images/wedding-party',
    'assets/images/venue',
    'assets/images/icons'
];

// Image sizes and configurations
const imageConfigs = [
    // Hero images
    { dir: 'hero', name: 'hero-main', width: 1920, height: 1080, pattern: 'gradient' },
    { dir: 'hero', name: 'hero-mobile', width: 768, height: 1024, pattern: 'gradient' },
    
    // Gallery images
    { dir: 'gallery', name: 'gallery-1', width: 600, height: 400, pattern: 'floral' },
    { dir: 'gallery', name: 'gallery-2', width: 600, height: 400, pattern: 'floral' },
    { dir: 'gallery', name: 'gallery-3', width: 600, height: 400, pattern: 'floral' },
    { dir: 'gallery', name: 'gallery-4', width: 600, height: 400, pattern: 'floral' },
    { dir: 'gallery', name: 'gallery-5', width: 600, height: 400, pattern: 'floral' },
    { dir: 'gallery', name: 'gallery-6', width: 600, height: 400, pattern: 'floral' },
    { dir: 'gallery', name: 'gallery-7', width: 400, height: 600, pattern: 'floral' },
    { dir: 'gallery', name: 'gallery-8', width: 400, height: 600, pattern: 'floral' },
    { dir: 'gallery', name: 'gallery-9', width: 400, height: 600, pattern: 'floral' },
    
    // Couple images
    { dir: 'couple', name: 'couple-1', width: 800, height: 600, pattern: 'hearts' },
    { dir: 'couple', name: 'couple-2', width: 600, height: 800, pattern: 'hearts' },
    { dir: 'couple', name: 'couple-engagement', width: 800, height: 600, pattern: 'hearts' },
    
    // Wedding party images
    { dir: 'wedding-party', name: 'bride', width: 400, height: 500, pattern: 'dots' },
    { dir: 'wedding-party', name: 'groom', width: 400, height: 500, pattern: 'dots' },
    { dir: 'wedding-party', name: 'bridesmaid-1', width: 400, height: 500, pattern: 'dots' },
    { dir: 'wedding-party', name: 'bridesmaid-2', width: 400, height: 500, pattern: 'dots' },
    { dir: 'wedding-party', name: 'bridesmaid-3', width: 400, height: 500, pattern: 'dots' },
    { dir: 'wedding-party', name: 'groomsman-1', width: 400, height: 500, pattern: 'dots' },
    { dir: 'wedding-party', name: 'groomsman-2', width: 400, height: 500, pattern: 'dots' },
    { dir: 'wedding-party', name: 'groomsman-3', width: 400, height: 500, pattern: 'dots' },
    
    // Venue images
    { dir: 'venue', name: 'venue-exterior', width: 800, height: 500, pattern: 'lines' },
    { dir: 'venue', name: 'venue-interior', width: 800, height: 500, pattern: 'lines' },
    { dir: 'venue', name: 'venue-garden', width: 800, height: 500, pattern: 'lines' },
    { dir: 'venue', name: 'venue-reception', width: 800, height: 500, pattern: 'lines' },
    
    // Icon images
    { dir: 'icons', name: 'calendar', width: 100, height: 100, pattern: 'icon' },
    { dir: 'icons', name: 'location', width: 100, height: 100, pattern: 'icon' },
    { dir: 'icons', name: 'rings', width: 100, height: 100, pattern: 'icon' },
    { dir: 'icons', name: 'cake', width: 100, height: 100, pattern: 'icon' },
    { dir: 'icons', name: 'gift', width: 100, height: 100, pattern: 'icon' }
];

/**
 * Generate a gradient pattern SVG
 */
function generateGradientSVG(width, height, name) {
    const color1 = name.includes('mobile') ? colors.primaryPink : colors.primaryGreen;
    const color2 = colors.offWhite;
    
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${color1};stop-opacity:0.8" />
                <stop offset="100%" style="stop-color:${color2};stop-opacity:0.9" />
            </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${width/20}px" fill="${colors.secondaryGreen}" text-anchor="middle" dominant-baseline="middle">Sarah & Michael</text>
        <text x="50%" y="${height/2 + width/15}" font-family="Arial, sans-serif" font-size="${width/40}px" fill="${colors.secondaryPink}" text-anchor="middle" dominant-baseline="middle">08.15.2026</text>
    </svg>`;
}

/**
 * Generate a floral pattern SVG
 */
function generateFloralSVG(width, height, name) {
    const baseColor = name.includes('-' + (parseInt(name.split('-')[1]) % 3 + 1)) 
        ? colors.primaryPink 
        : name.includes('-' + (parseInt(name.split('-')[1]) % 3 + 2))
            ? colors.primaryGreen
            : colors.offWhite;
    
    const accentColor = baseColor === colors.primaryPink 
        ? colors.secondaryGreen 
        : baseColor === colors.primaryGreen 
            ? colors.accentGold 
            : colors.secondaryPink;
    
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${baseColor}" />
        <circle cx="${width * 0.2}" cy="${height * 0.2}" r="${Math.min(width, height) * 0.1}" fill="${accentColor}" opacity="0.6" />
        <circle cx="${width * 0.8}" cy="${height * 0.8}" r="${Math.min(width, height) * 0.1}" fill="${accentColor}" opacity="0.6" />
        <circle cx="${width * 0.8}" cy="${height * 0.2}" r="${Math.min(width, height) * 0.05}" fill="${accentColor}" opacity="0.4" />
        <circle cx="${width * 0.2}" cy="${height * 0.8}" r="${Math.min(width, height) * 0.05}" fill="${accentColor}" opacity="0.4" />
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height)/10}px" fill="${colors.white}" text-anchor="middle" dominant-baseline="middle">Gallery ${name.split('-')[1]}</text>
    </svg>`;
}

/**
 * Generate a hearts pattern SVG
 */
function generateHeartsSVG(width, height, name) {
    const baseColor = colors.offWhite;
    const heartColor = colors.secondaryPink;
    
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${baseColor}" />
        <path d="M${width/2 - width/10},${height/2 - height/20} a${width/20},${height/20} 0 0,1 ${width/20},${-height/20} a${width/20},${height/20} 0 0,1 ${width/20},${height/20} l${-width/20},${height/20} l${-width/20},${-height/20} z" fill="${heartColor}" />
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height)/15}px" fill="${colors.secondaryGreen}" text-anchor="middle" dominant-baseline="middle">Sarah & Michael</text>
        <text x="50%" y="${height/2 + Math.min(width, height)/12}" font-family="Arial, sans-serif" font-size="${Math.min(width, height)/25}px" fill="${colors.secondaryPink}" text-anchor="middle" dominant-baseline="middle">${name.replace('-', ' ')}</text>
    </svg>`;
}

/**
 * Generate a dots pattern SVG
 */
function generateDotsSVG(width, height, name) {
    const baseColor = colors.offWhite;
    let dotColor;
    
    if (name.includes('bride') || name.includes('bridesmaid')) {
        dotColor = colors.primaryPink;
    } else {
        dotColor = colors.primaryGreen;
    }
    
    let dots = '';
    const dotSize = Math.min(width, height) / 30;
    const spacing = Math.min(width, height) / 10;
    
    for (let x = spacing; x < width; x += spacing) {
        for (let y = spacing; y < height; y += spacing) {
            dots += `<circle cx="${x}" cy="${y}" r="${dotSize}" fill="${dotColor}" opacity="0.5" />`;
        }
    }
    
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${baseColor}" />
        ${dots}
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height)/15}px" fill="${colors.secondaryGreen}" text-anchor="middle" dominant-baseline="middle">${name.replace(/-/g, ' ')}</text>
    </svg>`;
}

/**
 * Generate a lines pattern SVG
 */
function generateLinesSVG(width, height, name) {
    const baseColor = colors.offWhite;
    const lineColor = colors.primaryGreen;
    
    let lines = '';
    const lineWidth = 2;
    const spacing = Math.min(width, height) / 20;
    
    for (let y = spacing; y < height; y += spacing) {
        lines += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${lineColor}" stroke-width="${lineWidth}" opacity="0.3" />`;
    }
    
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${baseColor}" />
        ${lines}
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height)/15}px" fill="${colors.secondaryPink}" text-anchor="middle" dominant-baseline="middle">${name.replace(/-/g, ' ')}</text>
    </svg>`;
}

/**
 * Generate an icon SVG
 */
function generateIconSVG(width, height, name) {
    const baseColor = 'transparent';
    let iconPath = '';
    let iconColor = colors.primaryPink;
    
    // Simple icon paths
    switch (name) {
        case 'calendar':
            iconPath = `M${width*0.2},${height*0.2} h${width*0.6} v${height*0.6} h-${width*0.6} z M${width*0.3},${height*0.1} v${height*0.2} M${width*0.7},${height*0.1} v${height*0.2} M${width*0.2},${height*0.4} h${width*0.6}`;
            iconColor = colors.secondaryPink;
            break;
        case 'location':
            iconPath = `M${width*0.5},${height*0.2} c${width*0.2},0 ${width*0.3},${height*0.2} ${width*0.3},${height*0.3} c0,${height*0.2} -${width*0.3},${height*0.3} -${width*0.3},${height*0.3} c0,0 -${width*0.3},-${height*0.1} -${width*0.3},-${height*0.3} c0,-${height*0.1} ${width*0.1},-${height*0.3} ${width*0.3},-${height*0.3} z M${width*0.5},${height*0.3} c${width*0.05},0 ${width*0.1},${height*0.05} ${width*0.1},${height*0.1} c0,${height*0.05} -${width*0.05},${height*0.1} -${width*0.1},${height*0.1} c-${width*0.05},0 -${width*0.1},-${height*0.05} -${width*0.1},-${height*0.1} c0,-${height*0.05} ${width*0.05},-${height*0.1} ${width*0.1},-${height*0.1} z`;
            iconColor = colors.secondaryGreen;
            break;
        case 'rings':
            iconPath = `M${width*0.4},${height*0.5} a${width*0.15},${height*0.15} 0 1,0 ${width*0.3},0 a${width*0.15},${height*0.15} 0 1,0 -${width*0.3},0 M${width*0.3},${height*0.5} a${width*0.15},${height*0.15} 0 1,0 ${width*0.3},0 a${width*0.15},${height*0.15} 0 1,0 -${width*0.3},0`;
            iconColor = colors.accentGold;
            break;
        case 'cake':
            iconPath = `M${width*0.3},${height*0.3} h${width*0.4} v${height*0.1} h-${width*0.4} z M${width*0.25},${height*0.4} h${width*0.5} v${height*0.1} h-${width*0.5} z M${width*0.2},${height*0.5} h${width*0.6} v${height*0.2} h-${width*0.6} z M${width*0.5},${height*0.2} v${height*0.1}`;
            iconColor = colors.primaryPink;
            break;
        case 'gift':
            iconPath = `M${width*0.2},${height*0.4} h${width*0.6} v${height*0.1} h-${width*0.6} z M${width*0.3},${height*0.5} h${width*0.4} v${height*0.3} h-${width*0.4} z M${width*0.5},${height*0.3} v${height*0.5} M${width*0.4},${height*0.3} c0,0 -${width*0.1},-${height*0.1} -${width*0.1},-${height*0.15} c0,-${height*0.05} ${width*0.05},-${height*0.1} ${width*0.1},-${height*0.1} c${width*0.05},0 ${width*0.1},${height*0.05} ${width*0.1},${height*0.1} c0,${height*0.05} -${width*0.05},${height*0.15} -${width*0.1},${height*0.15} M${width*0.6},${height*0.3} c0,0 ${width*0.1},-${height*0.1} ${width*0.1},-${height*0.15} c0,-${height*0.05} -${width*0.05},-${height*0.1} -${width*0.1},-${height*0.1} c-${width*0.05},0 -${width*0.1},${height*0.05} -${width*0.1},${height*0.1} c0,${height*0.05} ${width*0.05},${height*0.15} ${width*0.1},${height*0.15}`;
            iconColor = colors.secondaryGreen;
            break;
    }
    
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${baseColor}" />
        <path d="${iconPath}" stroke="${iconColor}" stroke-width="3" fill="none" />
    </svg>`;
}

/**
 * Generate SVG content based on pattern type
 */
function generateSVG(config) {
    const { width, height, name, pattern } = config;
    
    switch (pattern) {
        case 'gradient':
            return generateGradientSVG(width, height, name);
        case 'floral':
            return generateFloralSVG(width, height, name);
        case 'hearts':
            return generateHeartsSVG(width, height, name);
        case 'dots':
            return generateDotsSVG(width, height, name);
        case 'lines':
            return generateLinesSVG(width, height, name);
        case 'icon':
            return generateIconSVG(width, height, name);
        default:
            return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="${colors.offWhite}" />
                <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height)/10}px" fill="${colors.secondaryPink}" text-anchor="middle" dominant-baseline="middle">${name}</text>
            </svg>`;
    }
}

/**
 * Create placeholder images
 */
function createPlaceholders() {
    // Ensure directories exist
    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Created directory: ${dir}`);
        }
    });
    
    // Generate images
    imageConfigs.forEach(config => {
        const { dir, name, width, height } = config;
        const filePath = path.join(`assets/images/${dir}`, `${name}.svg`);
        const svgContent = generateSVG(config);
        
        fs.writeFileSync(filePath, svgContent);
        console.log(`Created placeholder: ${filePath} (${width}x${height})`);
    });
    
    console.log('All placeholder images have been generated!');
}

// Run the script
createPlaceholders();