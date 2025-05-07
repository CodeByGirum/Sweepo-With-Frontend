const fs = require('fs');
const path = require('path');

// Get the directory of the Pics folder
const picsDir = path.join(process.cwd(), 'public/images/Pics');

try {
  // Check if the directory exists
  if (!fs.existsSync(picsDir)) {
    console.error(`Directory ${picsDir} does not exist!`);
    process.exit(1);
  }

  // Make sure the data directory exists
  const dataDir = path.join(process.cwd(), 'src/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Read the directory and filter for image files
  const files = fs.readdirSync(picsDir)
    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .map(file => `/images/Pics/${file}`);

  // Write the list to a JSON file
  fs.writeFileSync(
    path.join(process.cwd(), 'src/data/background-images.json'),
    JSON.stringify(files, null, 2)
  );

  console.log(`Generated image list with ${files.length} images`);
} catch (error) {
  console.error('Error generating image list:', error);
  process.exit(1);
} 