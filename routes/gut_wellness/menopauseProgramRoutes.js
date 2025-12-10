import express from 'express';
import MenopauseProgramHero from '../../models/gut_wellness/menopause_program/MenopauseProgramHero.js';
import MenopauseProgramMain from '../../models/gut_wellness/menopause_program/MenopauseProgramMain.js';
import { processImageUpdate } from '../../utils/cloudinaryHelper.js';

const router = express.Router();

// Helper function to sanitize string inputs (basic trimming)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

// ==================== MENOPAUSE PROGRAM HERO ====================
// GET /api/gut-wellness/menopause-program/hero
router.get('/hero', async (req, res) => {
  try {
    const hero = await MenopauseProgramHero.getSingleton();
    res.json(hero);
  } catch (error) {
    console.error('Error fetching menopause program hero:', error);
    res.status(500).json({ 
      error: 'Failed to fetch menopause program hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/gut-wellness/menopause-program/hero
router.put('/hero', async (req, res) => {
  try {
    const hero = await MenopauseProgramHero.getSingleton();
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
    console.error('Error updating menopause program hero:', error);
    res.status(500).json({ 
      error: 'Failed to update menopause program hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== MENOPAUSE PROGRAM MAIN ====================
// GET /api/gut-wellness/menopause-program/main
router.get('/main', async (req, res) => {
  try {
    const main = await MenopauseProgramMain.getSingleton();
    res.json(main);
  } catch (error) {
    console.error('Error fetching menopause program main:', error);
    res.status(500).json({ 
      error: 'Failed to fetch menopause program main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/gut-wellness/menopause-program/main
router.put('/main', async (req, res) => {
  try {
    const main = await MenopauseProgramMain.getSingleton();
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
    console.error('Error updating menopause program main:', error);
    res.status(500).json({ 
      error: 'Failed to update menopause program main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;

