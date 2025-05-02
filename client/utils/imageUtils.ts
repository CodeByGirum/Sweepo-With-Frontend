/**
 * Image Utilities
 * Purpose: Provides utilities for managing background images
 * Used in: Application background, UI theming
 * Features:
 * - Random background image selection
 * - Cache prevention
 * - Fallback image handling
 */

// Import the generated image list 
import backgroundImages from '../src/data/background-images.json';

/**
 * Get a random background image with cache prevention
 * @returns URL of a random background image with timestamp
 */
export function getRandomBackgroundImage(): string {
  // Use the imported list of images, or fall back to a static list if import fails
  const images = backgroundImages || [
    '/images/Pics/27a5a1442c4277bfd51221dc0bf739ac.jpg',
    '/images/Pics/9c2f39e709d18002b2c2fb7f96c6dad3.jpg',
    '/images/Pics/0e6e81b4b95a61c1ee85bdf419228456.jpg',
    '/images/Pics/02b57a9e0d3d02bc32c2d53e1193395d.jpg',
    '/images/Pics/00044d329257ed4595a47d7f29150d21.jpg',
    '/images/Pics/b3f2c56344665b7ab53e5315341b43d2.jpg',
    '/images/Pics/a92a8c709e8271505cae7214ec7a22a9.jpg',
    '/images/Pics/e2158f2f99732749db146121bc3ba871.jpg',
    '/images/Pics/f80dc96fded226fb3b20893902bce583.jpg',
  ];
  
  // Get a random index
  const randomIndex = Math.floor(Math.random() * images.length);
  
  // Add a timestamp query parameter to prevent caching
  const timestamp = new Date().getTime();
  return `${images[randomIndex]}?t=${timestamp}`;
}

/**
 * Implementation Notes:
 * This implementation uses a build-time generated JSON file with all image paths.
 * 
 * When new images are added to the public/images/Pics folder:
 * 1. The build script (scripts/generate-image-list.js) scans the folder
 * 2. It creates/updates the JSON file with all image paths
 * 3. This utility imports and uses that JSON file
 * 
 * To update the image list after adding new images, run:
 * `node scripts/generate-image-list.js`
 */ 