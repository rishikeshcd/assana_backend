import express from 'express';
import ProductHero from '../models/product/ProductHero.js';
import ProductMain from '../models/product/ProductMain.js';
import { processImageUpdate } from '../utils/cloudinaryHelper.js';

const router = express.Router();

// Helper function to sanitize string inputs (basic trimming)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

// ==================== PRODUCT HERO ====================
// GET /api/product/hero
router.get('/hero', async (req, res) => {
  try {
    const hero = await ProductHero.getSingleton();
    res.json(hero);
  } catch (error) {
    console.error('Error fetching product hero:', error);
    res.status(500).json({ 
      error: 'Failed to fetch product hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/product/hero
router.put('/hero', async (req, res) => {
  try {
    const hero = await ProductHero.getSingleton();
    const oldBackgroundImage = hero.backgroundImage;
    const permanentFolder = process.env.CLOUDINARY_FOLDER || 'assana-uploads';
    
    // Process background image: move from temp if needed, delete old image
    if (req.body.backgroundImage !== undefined) {
      const newBackgroundImage = sanitizeString(req.body.backgroundImage);
      hero.backgroundImage = await processImageUpdate(newBackgroundImage, oldBackgroundImage, permanentFolder);
    }
    
    // Update other fields (sanitize strings)
    if (req.body.title !== undefined) hero.title = sanitizeString(req.body.title);
    if (req.body.description !== undefined) hero.description = sanitizeString(req.body.description);
    if (req.body.buttonText !== undefined) hero.buttonText = sanitizeString(req.body.buttonText);
    
    await hero.save();
    res.json(hero);
  } catch (error) {
    console.error('Error updating product hero:', error);
    res.status(500).json({ 
      error: 'Failed to update product hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== PRODUCT MAIN ====================
// GET /api/product/main
router.get('/main', async (req, res) => {
  try {
    const main = await ProductMain.getSingleton();
    res.json(main);
  } catch (error) {
    console.error('Error fetching product main:', error);
    res.status(500).json({ 
      error: 'Failed to fetch product main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/product/main
router.put('/main', async (req, res) => {
  try {
    const main = await ProductMain.getSingleton();
    
    // Update title
    if (req.body.title !== undefined) {
      main.title = sanitizeString(req.body.title);
    }
    
    // Update products array with image processing
    const oldProducts = main.products || [];
    const permanentFolder = process.env.CLOUDINARY_FOLDER || 'assana-uploads';
    if (req.body.products !== undefined && Array.isArray(req.body.products)) {
      const processedProducts = await Promise.all(
        req.body.products.map(async (product, index) => {
          const oldProduct = oldProducts[index];
          const oldImage = oldProduct?.image;
          const newImage = product.image ? await processImageUpdate(product.image, oldImage, permanentFolder) : '';
          
          return {
            label: sanitizeString(product.label || ''),
            title: sanitizeString(product.title || ''),
            description: sanitizeString(product.description || ''),
            price: sanitizeString(product.price || '$29.99'),
            image: newImage,
            imageAlt: sanitizeString(product.imageAlt || ''),
          };
        })
      );
      
      // Delete images from removed products
      for (let i = req.body.products.length; i < oldProducts.length; i++) {
        if (oldProducts[i].image && !oldProducts[i].image.includes('/temp-uploads/')) {
          try {
            await processImageUpdate('', oldProducts[i].image, permanentFolder);
          } catch (error) {
            console.error('Failed to delete old product image:', error);
          }
        }
      }
      
      main.products = processedProducts;
    }
    
    await main.save();
    res.json(main);
  } catch (error) {
    console.error('Error updating product main:', error);
    res.status(500).json({ 
      error: 'Failed to update product main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;

