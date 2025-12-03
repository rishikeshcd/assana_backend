import express from 'express';
import ColonRectalCancerHero from '../models/colon_rectal_cancer/ColonRectalCancerHero.js';
import ColonRectalCancerMain from '../models/colon_rectal_cancer/ColonRectalCancerMain.js';

const router = express.Router();

// Helper function to sanitize string inputs (basic trimming)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

// ==================== COLON RECTAL CANCER HERO ====================
// GET /api/colon-rectal-cancer/hero
router.get('/hero', async (req, res) => {
  try {
    const hero = await ColonRectalCancerHero.getSingleton();
    res.json(hero);
  } catch (error) {
    console.error('Error fetching colon rectal cancer hero:', error);
    res.status(500).json({ 
      error: 'Failed to fetch colon rectal cancer hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/colon-rectal-cancer/hero
router.put('/hero', async (req, res) => {
  try {
    const hero = await ColonRectalCancerHero.getSingleton();
    
    // Update fields (sanitize strings)
    if (req.body.backgroundImage !== undefined) hero.backgroundImage = sanitizeString(req.body.backgroundImage);
    if (req.body.title !== undefined) hero.title = sanitizeString(req.body.title);
    if (req.body.description !== undefined) hero.description = sanitizeString(req.body.description);
    if (req.body.buttonText !== undefined) hero.buttonText = sanitizeString(req.body.buttonText);
    
    await hero.save();
    res.json(hero);
  } catch (error) {
    console.error('Error updating colon rectal cancer hero:', error);
    res.status(500).json({ 
      error: 'Failed to update colon rectal cancer hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== COLON RECTAL CANCER MAIN ====================
// GET /api/colon-rectal-cancer/main
router.get('/main', async (req, res) => {
  try {
    const main = await ColonRectalCancerMain.getSingleton();
    res.json(main);
  } catch (error) {
    console.error('Error fetching colon rectal cancer main:', error);
    res.status(500).json({ 
      error: 'Failed to fetch colon rectal cancer main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/colon-rectal-cancer/main
router.put('/main', async (req, res) => {
  try {
    const main = await ColonRectalCancerMain.getSingleton();
    
    // Update sections array
    if (req.body.sections !== undefined && Array.isArray(req.body.sections)) {
      main.sections = req.body.sections.map(section => ({
        title: sanitizeString(section.title || ''),
        image: sanitizeString(section.image || ''),
        imageAlt: sanitizeString(section.imageAlt || ''),
        imageTitle: sanitizeString(section.imageTitle || ''),
        description: sanitizeString(section.description || ''),
        items: Array.isArray(section.items) 
          ? section.items.map(item => sanitizeString(item || ''))
          : [],
      }));
    }
    
    await main.save();
    res.json(main);
  } catch (error) {
    console.error('Error updating colon rectal cancer main:', error);
    res.status(500).json({ 
      error: 'Failed to update colon rectal cancer main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;


