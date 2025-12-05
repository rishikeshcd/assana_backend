import express from 'express';
import GutBrainAxisHero from '../../models/gut_wellness/gut_brain_axis/GutBrainAxisHero.js';
import GutBrainAxisMain from '../../models/gut_wellness/gut_brain_axis/GutBrainAxisMain.js';

const router = express.Router();

// Helper function to sanitize string inputs (basic trimming)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

// ==================== GUT BRAIN AXIS HERO ====================
// GET /api/gut-wellness/gut-brain-axis/hero
router.get('/hero', async (req, res) => {
  try {
    const hero = await GutBrainAxisHero.getSingleton();
    res.json(hero);
  } catch (error) {
    console.error('Error fetching gut brain axis hero:', error);
    res.status(500).json({ 
      error: 'Failed to fetch gut brain axis hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/gut-wellness/gut-brain-axis/hero
router.put('/hero', async (req, res) => {
  try {
    const hero = await GutBrainAxisHero.getSingleton();
    
    // Update fields (sanitize strings)
    if (req.body.backgroundImage !== undefined) hero.backgroundImage = sanitizeString(req.body.backgroundImage);
    if (req.body.title !== undefined) hero.title = sanitizeString(req.body.title);
    if (req.body.description !== undefined) hero.description = sanitizeString(req.body.description);
    if (req.body.buttonText !== undefined) hero.buttonText = sanitizeString(req.body.buttonText);
    
    await hero.save();
    res.json(hero);
  } catch (error) {
    console.error('Error updating gut brain axis hero:', error);
    res.status(500).json({ 
      error: 'Failed to update gut brain axis hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== GUT BRAIN AXIS MAIN ====================
// GET /api/gut-wellness/gut-brain-axis/main
router.get('/main', async (req, res) => {
  try {
    const main = await GutBrainAxisMain.getSingleton();
    res.json(main);
  } catch (error) {
    console.error('Error fetching gut brain axis main:', error);
    res.status(500).json({ 
      error: 'Failed to fetch gut brain axis main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/gut-wellness/gut-brain-axis/main
router.put('/main', async (req, res) => {
  try {
    const main = await GutBrainAxisMain.getSingleton();
    
    // Update main fields
    if (req.body.mainTitle !== undefined) main.mainTitle = sanitizeString(req.body.mainTitle);
    if (req.body.subtitle !== undefined) main.subtitle = sanitizeString(req.body.subtitle);
    if (req.body.mainHeading !== undefined) main.mainHeading = sanitizeString(req.body.mainHeading);
    if (req.body.introDescription !== undefined) main.introDescription = sanitizeString(req.body.introDescription);
    if (req.body.approachHeading !== undefined) main.approachHeading = sanitizeString(req.body.approachHeading);
    if (req.body.conclusion !== undefined) main.conclusion = sanitizeString(req.body.conclusion);
    
    // Update approaches array
    if (req.body.approaches !== undefined && Array.isArray(req.body.approaches)) {
      main.approaches = req.body.approaches.map(approach => ({
        title: sanitizeString(approach.title || ''),
        description: sanitizeString(approach.description || ''),
        icon: sanitizeString(approach.icon || ''),
      }));
    }
    
    await main.save();
    res.json(main);
  } catch (error) {
    console.error('Error updating gut brain axis main:', error);
    res.status(500).json({ 
      error: 'Failed to update gut brain axis main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;

