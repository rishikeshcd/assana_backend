import express from 'express';
import LaserSurgeryHero from '../../models/colorectal_clinic/laser_surgery/LaserSurgeryHero.js';
import LaserSurgeryContent from '../../models/colorectal_clinic/laser_surgery/LaserSurgeryContent.js';
import { processImageUpdate } from '../../utils/cloudinaryHelper.js';

const router = express.Router();

// Helper function to sanitize string inputs (basic trimming)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

// ==================== LASER SURGERY HERO ====================
// GET /api/laser-surgery/hero
router.get('/hero', async (req, res) => {
  try {
    const hero = await LaserSurgeryHero.getSingleton();
    res.json(hero);
  } catch (error) {
    console.error('Error fetching laser surgery hero:', error);
    res.status(500).json({ 
      error: 'Failed to fetch laser surgery hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/laser-surgery/hero
router.put('/hero', async (req, res) => {
  try {
    const hero = await LaserSurgeryHero.getSingleton();
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
    console.error('Error updating laser surgery hero:', error);
    res.status(500).json({ 
      error: 'Failed to update laser surgery hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== LASER SURGERY CONTENT ====================
// GET /api/laser-surgery/content
router.get('/content', async (req, res) => {
  try {
    const content = await LaserSurgeryContent.getSingleton();
    res.json(content);
  } catch (error) {
    console.error('Error fetching laser surgery content:', error);
    res.status(500).json({ 
      error: 'Failed to fetch laser surgery content',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/laser-surgery/content
router.put('/content', async (req, res) => {
  try {
    const content = await LaserSurgeryContent.getSingleton();
    
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
    console.error('Error updating laser surgery content:', error);
    res.status(500).json({ 
      error: 'Failed to update laser surgery content',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;

