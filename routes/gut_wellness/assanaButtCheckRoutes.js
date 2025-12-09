import express from 'express';
import AssanaButtCheckHero from '../../models/gut_wellness/assana_butt_check/AssanaButtCheckHero.js';
import AssanaButtCheckMain from '../../models/gut_wellness/assana_butt_check/AssanaButtCheckMain.js';

const router = express.Router();

// Helper function to sanitize string inputs (basic trimming)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

// ==================== ASSANA BUTT CHECK HERO ====================
// GET /api/gut-wellness/assana-butt-check/hero
router.get('/hero', async (req, res) => {
  try {
    const hero = await AssanaButtCheckHero.getSingleton();
    res.json(hero);
  } catch (error) {
    console.error('Error fetching assana butt check hero:', error);
    res.status(500).json({ 
      error: 'Failed to fetch assana butt check hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/gut-wellness/assana-butt-check/hero
router.put('/hero', async (req, res) => {
  try {
    const hero = await AssanaButtCheckHero.getSingleton();
    
    // Update fields (sanitize strings)
    if (req.body.backgroundImage !== undefined) hero.backgroundImage = sanitizeString(req.body.backgroundImage);
    if (req.body.title !== undefined) hero.title = sanitizeString(req.body.title);
    if (req.body.description !== undefined) hero.description = sanitizeString(req.body.description);
    if (req.body.buttonText !== undefined) hero.buttonText = sanitizeString(req.body.buttonText);
    
    await hero.save();
    res.json(hero);
  } catch (error) {
    console.error('Error updating assana butt check hero:', error);
    res.status(500).json({ 
      error: 'Failed to update assana butt check hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== ASSANA BUTT CHECK MAIN ====================
// GET /api/gut-wellness/assana-butt-check/main
router.get('/main', async (req, res) => {
  try {
    const main = await AssanaButtCheckMain.getSingleton();
    res.json(main);
  } catch (error) {
    console.error('Error fetching assana butt check main:', error);
    res.status(500).json({ 
      error: 'Failed to fetch assana butt check main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/gut-wellness/assana-butt-check/main
router.put('/main', async (req, res) => {
  try {
    const main = await AssanaButtCheckMain.getSingleton();
    
    if (req.body.mainTitle !== undefined) main.mainTitle = sanitizeString(req.body.mainTitle);
    
    // Update left cards array
    if (req.body.leftCards !== undefined && Array.isArray(req.body.leftCards)) {
      main.leftCards = req.body.leftCards.map(card => ({
        title: sanitizeString(card.title || ''),
        description: sanitizeString(card.description || ''),
      }));
    }
    
    // Update center image
    if (req.body.centerImage !== undefined) {
      main.centerImage = sanitizeString(req.body.centerImage);
    }
    if (req.body.centerImageAlt !== undefined) {
      main.centerImageAlt = sanitizeString(req.body.centerImageAlt);
    }
    
    // Update right cards array
    if (req.body.rightCards !== undefined && Array.isArray(req.body.rightCards)) {
      main.rightCards = req.body.rightCards.map(card => ({
        title: sanitizeString(card.title || ''),
        description: sanitizeString(card.description || ''),
      }));
    }
    
    await main.save();
    res.json(main);
  } catch (error) {
    console.error('Error updating assana butt check main:', error);
    res.status(500).json({ 
      error: 'Failed to update assana butt check main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;

