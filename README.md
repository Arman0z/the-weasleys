# The Weasleys - Magical Website

This README provides instructions for opening the website locally and replacing the placeholder images with final artwork.

## Opening the Website Locally

1. Extract all files from `the-weasleys_site.zip` to a folder on your computer
2. Open the `index.html` file in any modern web browser
3. No server setup is required - this is a static website that runs entirely in the browser

## Replacing Placeholder Images

The website includes 12 placeholder images that should be replaced with final artwork:

### Illustration Placeholders

All placeholder images are located in the `/img/` directory and follow the naming convention `illus-XX.png` (where XX is a number from 01 to 12).

To replace the placeholders:

1. Ensure your final artwork matches the dimensions of 6.125 × 9 inches @ 72dpi (441 × 648 pixels)
2. Save your final artwork with the same filename as the placeholder you're replacing
3. Place the new image in the `/img/` directory, overwriting the existing placeholder

### Image Optimization Tips

For optimal website performance, consider these image optimization techniques:

1. **Format Selection**:
   - Use PNG for illustrations with transparency
   - Use JPEG (quality 80-85%) for photographic elements
   - Use WebP where broad browser support isn't a concern

2. **Compression Tools**:
   - [TinyPNG](https://tinypng.com/) - Excellent for PNG compression
   - [ImageOptim](https://imageoptim.com/) - Desktop app for Mac
   - [Squoosh](https://squoosh.app/) - Browser-based image compression

3. **Size Guidelines**:
   - Keep individual image files under 200KB where possible
   - Total image payload should remain under 1MB

## Asset Customization

The website includes several SVG assets that can be customized:

- `/assets/weasley-clock.svg` - The interactive family clock
- `/assets/gnome.svg` - Garden gnome that appears throughout the site
- `/assets/spell-swirl.svg` - Magical effect for spell animations
- `/assets/floo-flame.svg` - Animation for the back-to-top button

These SVG files can be edited in any vector graphics editor (like Adobe Illustrator, Inkscape, or Figma).

## Browser Compatibility

The website has been tested and works in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility Features

The website includes several accessibility features:
- Keyboard navigation for all interactive elements
- ARIA landmarks for screen readers
- Reduced motion option via CSS media query
- Sufficient color contrast for text readability

## Technical Notes

- No build tools or frameworks are used - this is vanilla HTML, CSS, and JavaScript
- All JavaScript is contained in `script.js` using ES modules
- CSS uses modern features like CSS Grid, Flexbox, and custom properties
- The website is fully responsive and works on mobile devices
