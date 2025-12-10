import express from 'express';
import BandingPilesHero from '../../models/colorectal_clinic/banding_piles/BandingPilesHero.js';
import BandingPilesContent from '../../models/colorectal_clinic/banding_piles/BandingPilesContent.js';
import { processImageUpdate } from '../../utils/cloudinaryHelper.js';

const router = express.Router();

// Helper function to sanitize string inputs (basic trimming)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

// ==================== BANDING PILES HERO ====================
// GET /api/banding-piles/hero
router.get('/hero', async (req, res) => {
  try {
    const hero = await BandingPilesHero.getSingleton();
    res.json(hero);
  } catch (error) {
    console.error('Error fetching banding piles hero:', error);
    res.status(500).json({ 
      error: 'Failed to fetch banding piles hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/banding-piles/hero
router.put('/hero', async (req, res) => {
  try {
    const hero = await BandingPilesHero.getSingleton();
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
    console.error('Error updating banding piles hero:', error);
    res.status(500).json({ 
      error: 'Failed to update banding piles hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== BANDING PILES CONTENT ====================
// GET /api/banding-piles/content
router.get('/content', async (req, res) => {
  try {
    const content = await BandingPilesContent.getSingleton();
    res.json(content);
  } catch (error) {
    console.error('Error fetching banding piles content:', error);
    res.status(500).json({ 
      error: 'Failed to fetch banding piles content',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/banding-piles/content
router.put('/content', async (req, res) => {
  try {
    const content = await BandingPilesContent.getSingleton();
    
    // Update main title
    if (req.body.mainTitle !== undefined) {
      content.mainTitle = sanitizeString(req.body.mainTitle);
    }
    
    // Update left top section
    if (req.body.leftTopSection !== undefined) {
      if (req.body.leftTopSection.title !== undefined) {
        content.leftTopSection.title = sanitizeString(req.body.leftTopSection.title);
      }
      if (req.body.leftTopSection.description !== undefined) {
        content.leftTopSection.description = sanitizeString(req.body.leftTopSection.description);
      }
    }
    
    // Update left bottom section
    if (req.body.leftBottomSection !== undefined) {
      if (req.body.leftBottomSection.title !== undefined) {
        content.leftBottomSection.title = sanitizeString(req.body.leftBottomSection.title);
      }
      if (req.body.leftBottomSection.description !== undefined) {
        content.leftBottomSection.description = sanitizeString(req.body.leftBottomSection.description);
      }
    }
    
    // Update center image: move from temp if needed, delete old image
    const oldCenterImage = content.centerImage;
    const permanentFolder = process.env.CLOUDINARY_FOLDER || 'assana-uploads';
    if (req.body.centerImage !== undefined) {
      const newCenterImage = sanitizeString(req.body.centerImage);
      content.centerImage = await processImageUpdate(newCenterImage, oldCenterImage, permanentFolder);
    }
    if (req.body.centerImageAlt !== undefined) {
      content.centerImageAlt = sanitizeString(req.body.centerImageAlt);
    }
    
    // Update right top section
    if (req.body.rightTopSection !== undefined) {
      if (req.body.rightTopSection.title !== undefined) {
        content.rightTopSection.title = sanitizeString(req.body.rightTopSection.title);
      }
      if (req.body.rightTopSection.description !== undefined) {
        content.rightTopSection.description = sanitizeString(req.body.rightTopSection.description);
      }
    }
    
    // Update right bottom section
    if (req.body.rightBottomSection !== undefined) {
      if (req.body.rightBottomSection.title !== undefined) {
        content.rightBottomSection.title = sanitizeString(req.body.rightBottomSection.title);
      }
      if (req.body.rightBottomSection.description !== undefined) {
        content.rightBottomSection.description = sanitizeString(req.body.rightBottomSection.description);
      }
    }
    
    await content.save();
    res.json(content);
  } catch (error) {
    console.error('Error updating banding piles content:', error);
    res.status(500).json({ 
      error: 'Failed to update banding piles content',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;

