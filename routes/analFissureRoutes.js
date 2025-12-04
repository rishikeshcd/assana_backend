import express from 'express';
import AnalFissureHero from '../models/anal_fissure/AnalFissureHero.js';
import AnalFissureMain from '../models/anal_fissure/AnalFissureMain.js';

const router = express.Router();

// Helper function to sanitize string inputs (basic trimming)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

// ==================== ANAL FISSURE HERO ====================
// GET /api/anal-fissure/hero
router.get('/hero', async (req, res) => {
  try {
    const hero = await AnalFissureHero.getSingleton();
    res.json(hero);
  } catch (error) {
    console.error('Error fetching anal fissure hero:', error);
    res.status(500).json({ 
      error: 'Failed to fetch anal fissure hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/anal-fissure/hero
router.put('/hero', async (req, res) => {
  try {
    const hero = await AnalFissureHero.getSingleton();
    
    // Update fields (sanitize strings)
    if (req.body.backgroundImage !== undefined) hero.backgroundImage = sanitizeString(req.body.backgroundImage);
    if (req.body.title !== undefined) hero.title = sanitizeString(req.body.title);
    if (req.body.description !== undefined) hero.description = sanitizeString(req.body.description);
    if (req.body.buttonText !== undefined) hero.buttonText = sanitizeString(req.body.buttonText);
    
    await hero.save();
    res.json(hero);
  } catch (error) {
    console.error('Error updating anal fissure hero:', error);
    res.status(500).json({ 
      error: 'Failed to update anal fissure hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== ANAL FISSURE MAIN ====================
// GET /api/anal-fissure/main
router.get('/main', async (req, res) => {
  try {
    const main = await AnalFissureMain.getSingleton();
    res.json(main);
  } catch (error) {
    console.error('Error fetching anal fissure main:', error);
    res.status(500).json({ 
      error: 'Failed to fetch anal fissure main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/anal-fissure/main
router.put('/main', async (req, res) => {
  try {
    const main = await AnalFissureMain.getSingleton();
    
    // Update sections array
    if (req.body.sections !== undefined && Array.isArray(req.body.sections)) {
      main.sections = req.body.sections.map(section => ({
        title: sanitizeString(section.title || ''),
        image: sanitizeString(section.image || ''),
        imageAlt: sanitizeString(section.imageAlt || ''),
        imageTitle: sanitizeString(section.imageTitle || ''),
        items: Array.isArray(section.items) 
          ? section.items.map(item => sanitizeString(item || ''))
          : [],
      }));
    }
    
    // Update conclusion
    if (req.body.conclusion !== undefined) {
      if (req.body.conclusion.title !== undefined) {
        main.conclusion.title = sanitizeString(req.body.conclusion.title);
      }
      if (req.body.conclusion.description !== undefined) {
        main.conclusion.description = sanitizeString(req.body.conclusion.description);
      }
      if (req.body.conclusion.buttonText !== undefined) {
        main.conclusion.buttonText = sanitizeString(req.body.conclusion.buttonText);
      }
    }
    
    await main.save();
    res.json(main);
  } catch (error) {
    console.error('Error updating anal fissure main:', error);
    res.status(500).json({ 
      error: 'Failed to update anal fissure main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;

