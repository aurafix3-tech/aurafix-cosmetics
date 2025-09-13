const axios = require('axios');

class MakeupApiService {
  constructor() {
    this.baseUrl = 'http://makeup-api.herokuapp.com/api/v1';
  }

  async getAllProducts() {
    try {
      const response = await axios.get(`${this.baseUrl}/products.json`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products from Makeup API:', error);
      throw error;
    }
  }

  async getProductsByBrand(brand) {
    try {
      const response = await axios.get(`${this.baseUrl}/products.json?brand=${brand}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for brand ${brand}:`, error);
      throw error;
    }
  }

  async getProductsByType(productType) {
    try {
      const response = await axios.get(`${this.baseUrl}/products.json?product_type=${productType}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for type ${productType}:`, error);
      throw error;
    }
  }

  // Transform Makeup API product to our database format
  transformProduct(apiProduct) {
    // Map product types to our 3D model references
    const get3DModel = (productType) => {
      const modelMap = {
        'lipstick': '/models/lipstick.glb',
        'foundation': '/models/foundation.glb',
        'mascara': '/models/mascara.glb',
        'eyeshadow': '/models/eyeshadow.glb',
        'blush': '/models/blush.glb',
        'bronzer': '/models/bronzer.glb',
        'eyeliner': '/models/eyeliner.glb',
        'lip_liner': '/models/lip_liner.glb',
        'nail_polish': '/models/nail_polish.glb'
      };
      return modelMap[productType] || '/models/generic_cosmetic.glb';
    };

    // Determine skin type compatibility
    const getSkinTypes = (productType, tags) => {
      const allSkinTypes = ['normal', 'dry', 'oily', 'combination', 'sensitive'];
      
      // If tags mention specific skin types, use those
      if (tags && tags.length > 0) {
        const mentionedTypes = allSkinTypes.filter(type => 
          tags.some(tag => tag.toLowerCase().includes(type))
        );
        if (mentionedTypes.length > 0) return mentionedTypes;
      }
      
      // Default compatibility based on product type
      switch (productType) {
        case 'foundation':
        case 'concealer':
          return ['normal', 'dry', 'oily', 'combination'];
        case 'powder':
          return ['oily', 'combination'];
        case 'moisturizer':
          return ['dry', 'sensitive'];
        default:
          return allSkinTypes; // Most products work for all skin types
      }
    };

    return {
      name: apiProduct.name || 'Unnamed Product',
      description: apiProduct.description || `High-quality ${apiProduct.product_type || 'cosmetic'} from ${apiProduct.brand || 'premium brand'}. Perfect for creating stunning looks.`,
      shortDescription: apiProduct.description ? 
        apiProduct.description.substring(0, 150) + '...' : 
        `${apiProduct.brand || 'Premium'} ${apiProduct.product_type || 'cosmetic'} product`,
      price: apiProduct.price ? parseFloat(apiProduct.price) : Math.floor(Math.random() * 50) + 10,
      comparePrice: apiProduct.price ? parseFloat(apiProduct.price) * 1.2 : null,
      sku: `MUA-${apiProduct.id || Math.random().toString(36).substr(2, 9)}`,
      barcode: apiProduct.id ? `${apiProduct.id}000000` : null,
      brand: apiProduct.brand || 'AuraFix',
      category: null, // Will be set based on product_type
      subcategory: apiProduct.product_type || 'cosmetic',
      tags: apiProduct.tag_list || [],
      images: apiProduct.image_link ? [{
        url: apiProduct.image_link,
        alt: apiProduct.name || 'Product image',
        isPrimary: true
      }] : [],
      variants: apiProduct.product_colors && apiProduct.product_colors.length > 0 ? 
        apiProduct.product_colors.map((color, index) => ({
          name: color.colour_name || `Color ${index + 1}`,
          price: apiProduct.price ? parseFloat(apiProduct.price) : Math.floor(Math.random() * 50) + 10,
          sku: `${apiProduct.id || 'MUA'}-${color.hex_value || index}`,
          color: color.hex_value || '#000000',
          image: color.image_link || apiProduct.image_link,
          stock: Math.floor(Math.random() * 100) + 10
        })) : [],
      stock: Math.floor(Math.random() * 100) + 10,
      weight: Math.floor(Math.random() * 200) + 50, // grams
      dimensions: {
        length: Math.floor(Math.random() * 10) + 5,
        width: Math.floor(Math.random() * 5) + 2,
        height: Math.floor(Math.random() * 15) + 3
      },
      skinType: getSkinTypes(apiProduct.product_type, apiProduct.tag_list),
      ingredients: apiProduct.description ? 
        apiProduct.description.split('.').slice(0, 3) : 
        ['Premium cosmetic ingredients'],
      howToUse: `Apply ${apiProduct.product_type || 'product'} as desired for best results.`,
      model3D: {
        url: get3DModel(apiProduct.product_type),
        format: 'glb'
      },
      seoTitle: `${apiProduct.name || 'Premium Cosmetic'} - ${apiProduct.brand || 'AuraFix'}`,
      seoDescription: apiProduct.description ? 
        apiProduct.description.substring(0, 160) : 
        `Shop ${apiProduct.name || 'premium cosmetics'} from ${apiProduct.brand || 'AuraFix'}`,
      isActive: true,
      isFeatured: Math.random() > 0.8, // 20% chance of being featured
      rating: {
        average: Math.floor(Math.random() * 2) + 3.5, // 3.5-5.0 rating
        count: Math.floor(Math.random() * 500) + 10
      },
      apiSource: 'makeup-api',
      apiId: apiProduct.id
    };
  }
}

module.exports = new MakeupApiService();
