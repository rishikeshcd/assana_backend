import express from 'express';
import ColonHydrotherapyHero from '../../models/gut_wellness/colon_hydrotherapy/ColonHydrotherapyHero.js';
import ColonHydrotherapyMain from '../../models/gut_wellness/colon_hydrotherapy/ColonHydrotherapyMain.js';

const router = express.Router();

// Helper function to sanitize string inputs (basic trimming)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

// ==================== COLON HYDROTHERAPY HERO ====================
// GET /api/gut-wellness/colon-hydrotherapy/hero
router.get('/hero', async (req, res) => {
  try {
    const hero = await ColonHydrotherapyHero.getSingleton();
    res.json(hero);
  } catch (error) {
    console.error('Error fetching colon hydrotherapy hero:', error);
    res.status(500).json({ 
      error: 'Failed to fetch colon hydrotherapy hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/gut-wellness/colon-hydrotherapy/hero
router.put('/hero', async (req, res) => {
  try {
    const hero = await ColonHydrotherapyHero.getSingleton();
    
    // Update fields (sanitize strings)
    if (req.body.backgroundImage !== undefined) hero.backgroundImage = sanitizeString(req.body.backgroundImage);
    if (req.body.title !== undefined) hero.title = sanitizeString(req.body.title);
    if (req.body.description !== undefined) hero.description = sanitizeString(req.body.description);
    if (req.body.buttonText !== undefined) hero.buttonText = sanitizeString(req.body.buttonText);
    
    await hero.save();
    res.json(hero);
  } catch (error) {
    console.error('Error updating colon hydrotherapy hero:', error);
    res.status(500).json({ 
      error: 'Failed to update colon hydrotherapy hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== COLON HYDROTHERAPY MAIN ====================
// GET /api/gut-wellness/colon-hydrotherapy/main
router.get('/main', async (req, res) => {
  try {
    const main = await ColonHydrotherapyMain.getSingleton();
    res.json(main);
  } catch (error) {
    console.error('Error fetching colon hydrotherapy main:', error);
    res.status(500).json({ 
      error: 'Failed to fetch colon hydrotherapy main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/gut-wellness/colon-hydrotherapy/main
router.put('/main', async (req, res) => {
  try {
    const main = await ColonHydrotherapyMain.getSingleton();
    
    // Update sections array
    if (req.body.sections !== undefined && Array.isArray(req.body.sections)) {
      main.sections = req.body.sections.map(section => ({
        title: sanitizeString(section.title || ''),
        image: sanitizeString(section.image || ''),
        imageAlt: sanitizeString(section.imageAlt || ''),
        imageTitle: sanitizeString(section.imageTitle || ''),
        contentBlocks: Array.isArray(section.contentBlocks) ? section.contentBlocks.map(block => ({
          heading: sanitizeString(block.heading || ''),
          text: sanitizeString(block.text || ''),
        })) : [],
      }));
    }
    
    // Update conclusion
    if (req.body.conclusion !== undefined) {
      if (req.body.conclusion.text !== undefined) main.conclusion.text = sanitizeString(req.body.conclusion.text);
      if (req.body.conclusion.buttonText !== undefined) main.conclusion.buttonText = sanitizeString(req.body.conclusion.buttonText);
    }
    
    await main.save();
    res.json(main);
  } catch (error) {
    console.error('Error updating colon hydrotherapy main:', error);
    res.status(500).json({ 
      error: 'Failed to update colon hydrotherapy main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;

