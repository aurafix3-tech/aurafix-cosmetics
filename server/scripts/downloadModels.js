const fs = require('fs');
const path = require('path');

// Create 3D models directory structure
const createModelDirectories = () => {
  const modelsDir = path.join(__dirname, '../../public/models');
  
  if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
    console.log('Created models directory:', modelsDir);
  }
  
  return modelsDir;
};

// Create placeholder 3D model files (you'll need to replace these with actual .glb files)
const createPlaceholderModels = () => {
  const modelsDir = createModelDirectories();
  
  const modelTypes = [
    'lipstick.glb',
    'foundation.glb',
    'mascara.glb',
    'eyeshadow.glb',
    'blush.glb',
    'bronzer.glb',
    'eyeliner.glb',
    'lip_liner.glb',
    'nail_polish.glb',
    'generic_cosmetic.glb'
  ];
  
  const placeholderContent = `# Placeholder 3D Model
# Replace this file with an actual .glb 3D model file
# You can find free cosmetic 3D models at:
# - Sketchfab.com (search for "cosmetics" with downloadable filter)
# - TurboSquid.com (free section)
# - CGTrader.com (free models)
# - Blender community assets
`;

  modelTypes.forEach(modelFile => {
    const modelPath = path.join(modelsDir, modelFile);
    if (!fs.existsSync(modelPath)) {
      fs.writeFileSync(modelPath, placeholderContent);
      console.log(`Created placeholder: ${modelFile}`);
    }
  });
  
  console.log('\n📝 Note: Replace placeholder files with actual .glb 3D models');
  console.log('🔗 Free 3D model sources:');
  console.log('   • Sketchfab.com (filter by downloadable)');
  console.log('   • TurboSquid.com (free section)');
  console.log('   • CGTrader.com (free models)');
  console.log('   • Poly.google.com (archived but still accessible)');
};

// Run the script
if (require.main === module) {
  createPlaceholderModels();
}

module.exports = { createModelDirectories, createPlaceholderModels };
