import express from 'express';
import NewMomProgramHero from '../../models/gut_wellness/new_mom_program/NewMomProgramHero.js';
import NewMomProgramMain from '../../models/gut_wellness/new_mom_program/NewMomProgramMain.js';
import { processImageUpdate } from '../../utils/cloudinaryHelper.js';

const router = express.Router();

// Helper function to sanitize string inputs (basic trimming)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

// ==================== NEW MOM PROGRAM HERO ====================
// GET /api/gut-wellness/new-mom-program/hero
router.get('/hero', async (req, res) => {
  try {
    const hero = await NewMomProgramHero.getSingleton();
    res.json(hero);
  } catch (error) {
    console.error('Error fetching new mom program hero:', error);
    res.status(500).json({ 
      error: 'Failed to fetch new mom program hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/gut-wellness/new-mom-program/hero
router.put('/hero', async (req, res) => {
  try {
    const hero = await NewMomProgramHero.getSingleton();
    const oldBackgroundImage = hero.backgroundImage;
    
    // Process background image: move from temp if needed, delete old image
    if (req.body.backgroundImage !== undefined) {
      const newBackgroundImage = sanitizeString(req.body.backgroundImage);
      const permanentFolder = process.env.CLOUDINARY_FOLDER || 'assana-uploads';
      hero.backgroundImage = await processImageUpdate(newBackgroundImage, oldBackgroundImage, permanentFolder);
    }
    
    // Update other fields (sanitize strings)
    if (req.body.title !== undefined) hero.title = sanitizeString(req.body.title);
    if (req.body.description !== undefined) hero.description = sanitizeString(req.body.description);
    if (req.body.buttonText !== undefined) hero.buttonText = sanitizeString(req.body.buttonText);
    
    await hero.save();
    res.json(hero);
  } catch (error) {
    console.error('Error updating new mom program hero:', error);
    res.status(500).json({ 
      error: 'Failed to update new mom program hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== NEW MOM PROGRAM MAIN ====================
// GET /api/gut-wellness/new-mom-program/main
router.get('/main', async (req, res) => {
  try {
    const main = await NewMomProgramMain.getSingleton();
    res.json(main);
  } catch (error) {
    console.error('Error fetching new mom program main:', error);
    res.status(500).json({ 
      error: 'Failed to fetch new mom program main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/gut-wellness/new-mom-program/main
router.put('/main', async (req, res) => {
  try {
    const main = await NewMomProgramMain.getSingleton();
    const oldCenterImage = main.centerImage;
    const permanentFolder = process.env.CLOUDINARY_FOLDER || 'assana-uploads';
    
    if (req.body.mainTitle !== undefined) main.mainTitle = sanitizeString(req.body.mainTitle);
    
    // Update left cards array
    if (req.body.leftCards !== undefined && Array.isArray(req.body.leftCards)) {
      main.leftCards = req.body.leftCards.map(card => ({
        title: sanitizeString(card.title || ''),
        description: sanitizeString(card.description || ''),
      }));
    }
    
    // Update center image: move from temp if needed, delete old image
    if (req.body.centerImage !== undefined) {
      const newCenterImage = sanitizeString(req.body.centerImage);
      main.centerImage = await processImageUpdate(newCenterImage, oldCenterImage, permanentFolder);
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
    console.error('Error updating new mom program main:', error);
    res.status(500).json({ 
      error: 'Failed to update new mom program main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;

