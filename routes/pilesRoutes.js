import express from 'express';
import PilesHero from '../models/piles/PilesHero.js';
import PilesContent from '../models/piles/PilesContent.js';

const router = express.Router();

// Helper function to sanitize string inputs (basic trimming)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

// ==================== PILES HERO ====================
// GET /api/piles/hero
router.get('/hero', async (req, res) => {
  try {
    const hero = await PilesHero.getSingleton();
    res.json(hero);
  } catch (error) {
    console.error('Error fetching piles hero:', error);
    res.status(500).json({ 
      error: 'Failed to fetch piles hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/piles/hero
router.put('/hero', async (req, res) => {
  try {
    const hero = await PilesHero.getSingleton();
    
    // Update fields (sanitize strings)
    if (req.body.backgroundImage !== undefined) hero.backgroundImage = sanitizeString(req.body.backgroundImage);
    if (req.body.title !== undefined) hero.title = sanitizeString(req.body.title);
    if (req.body.description !== undefined) hero.description = sanitizeString(req.body.description);
    if (req.body.buttonText !== undefined) hero.buttonText = sanitizeString(req.body.buttonText);
    
    await hero.save();
    res.json(hero);
  } catch (error) {
    console.error('Error updating piles hero:', error);
    res.status(500).json({ 
      error: 'Failed to update piles hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== PILES CONTENT ====================
// GET /api/piles/content
router.get('/content', async (req, res) => {
  try {
    const content = await PilesContent.getSingleton();
    res.json(content);
  } catch (error) {
    console.error('Error fetching piles content:', error);
    res.status(500).json({ 
      error: 'Failed to fetch piles content',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/piles/content
router.put('/content', async (req, res) => {
  try {
    const content = await PilesContent.getSingleton();
    
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
    
    // Update center image
    if (req.body.centerImage !== undefined) {
      content.centerImage = sanitizeString(req.body.centerImage);
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
    console.error('Error updating piles content:', error);
    res.status(500).json({ 
      error: 'Failed to update piles content',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;

