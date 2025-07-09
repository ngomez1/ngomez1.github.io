# Lauren & Nicholas Wedding Website

A beautiful, responsive wedding website with a floral springtime theme featuring pink, white, green, and yellow/gold accents. This website provides all the essential information for wedding guests and includes an RSVP system connected to Supabase.

![Wedding Website Preview](assets/images/hero/hero-main.svg)

## Features

- 📱 Responsive design that works on all devices
- 🌸 Elegant floral springtime theme
- 📅 Wedding countdown timer
- 📍 Venue information and accommodations
- 🗓️ Event schedule and timeline
- 👰 Wedding party information
- 🎁 Gift registry links
- 📷 Photo gallery with lightbox functionality
- ❓ FAQ section with search and filtering
- ✉️ RSVP system with Supabase backend integration
- ✨ Smooth animations and transitions

## Pages

- **Home**: Welcome message, countdown timer, and event overview
- **Schedule**: Timeline of wedding events
- **Travel**: Venue information and accommodations
- **Registry**: Gift registry information
- **Wedding Party**: Information about bridesmaids, groomsmen, etc.
- **Gallery**: Photo gallery with lightbox functionality
- **FAQ**: Frequently asked questions with search and filtering
- **RSVP**: Form for guests to RSVP with meal preferences and plus-ones
- **Success**: Confirmation page after successful RSVP submission

## Technologies Used

- HTML5
- CSS3 (with custom properties for theming)
- JavaScript (vanilla, no frameworks)
- Supabase (for backend RSVP storage)
- SVG (for placeholder images and icons)

## Project Structure

```
wedding-website/
├── index.html                # Home page
├── schedule.html             # Schedule page
├── travel.html               # Travel & accommodations page
├── registry.html             # Gift registry page
├── wedding-party.html        # Wedding party page
├── gallery.html              # Photo gallery page
├── faq.html                  # FAQ page
├── rsvp.html                 # RSVP form page
├── success.html              # RSVP confirmation page
├── css/
│   ├── style.css             # Main styles and design system
│   ├── animations.css        # Animation definitions
│   └── responsive.css        # Media queries for responsiveness
├── js/
│   ├── main.js               # Core functionality
│   ├── navigation.js         # Navigation behavior
│   ├── rsvp.js               # RSVP form handling
│   ├── supabase.js           # Supabase integration
│   └── gallery.js            # Gallery and lightbox functionality
├── assets/
│   ├── generate-placeholders.js  # Script to generate placeholder images
│   └── images/
│       ├── hero/             # Hero images
│       ├── gallery/          # Gallery images
│       ├── couple/           # Couple photos
│       ├── wedding-party/    # Wedding party photos
│       ├── venue/            # Venue photos
│       └── icons/            # Icons and decorative elements
└── supabase-setup.md         # Instructions for setting up Supabase
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/wedding-website.git
cd wedding-website
```

### 2. Customize Content

1. Update all HTML files with your personal information:
   - Names
   - Dates
   - Venue details
   - Wedding party information
   - FAQ content
   - Registry links

2. Replace placeholder images:
   - Replace SVG placeholders in the `assets/images/` directory with your actual photos
   - Maintain the same filenames or update the references in the HTML files

3. Customize colors and theme:
   - Edit the CSS variables in `css/style.css` to match your wedding colors

### 3. Set Up Supabase for RSVP Functionality

Follow the instructions in `supabase-setup.md` to:
1. Create a Supabase project
2. Set up the database schema
3. Configure security policies
4. Update the Supabase credentials in `js/supabase.js`

### 4. Testing

1. Open `index.html` in a web browser to preview the site
2. Test the RSVP form submission
3. Verify mobile responsiveness using browser developer tools

### 5. Deployment

Deploy the website to your preferred hosting service:

- GitHub Pages
- Netlify
- Vercel
- Any standard web hosting service

## Customization Options

### Colors

Edit the CSS variables in `css/style.css`:

```css
:root {
  --primary-pink: #e7a9bc;
  --secondary-pink: #d782a3;
  --primary-green: #b8d8be;
  --secondary-green: #7fb285;
  --accent-gold: #d4af37;
  /* ... other variables ... */
}
```

### Fonts

The website uses Google Fonts. To change fonts:

1. Update the Google Fonts link in the HTML head section of each page
2. Update the font variables in `css/style.css`:

```css
:root {
  --font-heading: 'Cormorant Garamond', serif;
  --font-body: 'Montserrat', sans-serif;
  --font-accent: 'Great Vibes', cursive;
  /* ... other variables ... */
}
```

### Adding/Removing Pages

To add a new page:

1. Create a new HTML file based on the structure of existing pages
2. Add a link to the new page in the navigation menu in all HTML files

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Fonts provided by Google Fonts
- Icons based on Material Design Icons
- Backend powered by Supabase

---

Made with ❤️ for Sarah & Michael's special day