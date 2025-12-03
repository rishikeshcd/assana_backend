import express from 'express';
import AnalWoundCareHero from '../models/anal_wound_care/AnalWoundCareHero.js';
import AnalWoundCareContent from '../models/anal_wound_care/AnalWoundCareContent.js';

const router = express.Router();

// Helper function to sanitize strings
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

// ========== HERO ROUTES ==========

// GET /api/anal-wound-care/hero
router.get('/hero', async (req, res) => {
  try {
    const hero = await AnalWoundCareHero.getSingleton();
    res.json(hero);
  } catch (error) {
    console.error('Error fetching anal wound care hero:', error);
    res.status(500).json({ error: 'Failed to fetch anal wound care hero' });
  }
});

// PUT /api/anal-wound-care/hero
router.put('/hero', async (req, res) => {
  try {
    const hero = await AnalWoundCareHero.getSingleton();
    
    if (req.body.backgroundImage !== undefined) hero.backgroundImage = sanitizeString(req.body.backgroundImage);
    if (req.body.title !== undefined) hero.title = sanitizeString(req.body.title);
    if (req.body.description !== undefined) hero.description = sanitizeString(req.body.description);
    if (req.body.buttonText !== undefined) hero.buttonText = sanitizeString(req.body.buttonText);
    
    await hero.save();
    res.json(hero);
  } catch (error) {
    console.error('Error updating anal wound care hero:', error);
    res.status(500).json({ error: 'Failed to update anal wound care hero' });
  }
});

// ========== CONTENT ROUTES ==========

// GET /api/anal-wound-care/content
router.get('/content', async (req, res) => {
  try {
    const content = await AnalWoundCareContent.getSingleton();
    res.json(content);
  } catch (error) {
    console.error('Error fetching anal wound care content:', error);
    res.status(500).json({ error: 'Failed to fetch anal wound care content' });
  }
});

// PUT /api/anal-wound-care/content
router.put('/content', async (req, res) => {
  try {
    const content = await AnalWoundCareContent.getSingleton();
    
    if (req.body.mainTitle !== undefined) content.mainTitle = sanitizeString(req.body.mainTitle);
    
    // Update left sections
    if (req.body.leftTopSection !== undefined) {
      content.leftTopSection = {
        title: sanitizeString(req.body.leftTopSection.title || ''),
        description: sanitizeString(req.body.leftTopSection.description || ''),
      };
    }
    if (req.body.leftBottomSection !== undefined) {
      content.leftBottomSection = {
        title: sanitizeString(req.body.leftBottomSection.title || ''),
        description: sanitizeString(req.body.leftBottomSection.description || ''),
      };
    }
    
    // Update center image
    if (req.body.centerImage !== undefined) {
      content.centerImage = sanitizeString(req.body.centerImage);
    }
    if (req.body.centerImageAlt !== undefined) {
      content.centerImageAlt = sanitizeString(req.body.centerImageAlt);
    }
    
    // Update right sections
    if (req.body.rightTopSection !== undefined) {
      content.rightTopSection = {
        title: sanitizeString(req.body.rightTopSection.title || ''),
        description: sanitizeString(req.body.rightTopSection.description || ''),
      };
    }
    if (req.body.rightMiddleSection !== undefined) {
      content.rightMiddleSection = {
        title: sanitizeString(req.body.rightMiddleSection.title || ''),
        description: sanitizeString(req.body.rightMiddleSection.description || ''),
      };
    }
    if (req.body.rightBottomSection !== undefined) {
      content.rightBottomSection = {
        title: sanitizeString(req.body.rightBottomSection.title || ''),
        description: sanitizeString(req.body.rightBottomSection.description || ''),
      };
    }
    
    await content.save();
    res.json(content);
  } catch (error) {
    console.error('Error updating anal wound care content:', error);
    res.status(500).json({ error: 'Failed to update anal wound care content' });
  }
});

export default router;

