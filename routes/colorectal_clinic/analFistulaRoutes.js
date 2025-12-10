import express from 'express';
import AnalFistulaHero from '../../models/colorectal_clinic/anal_fistula/AnalFistulaHero.js';
import AnalFistulaMain from '../../models/colorectal_clinic/anal_fistula/AnalFistulaMain.js';
import { processImageUpdate, processSectionsWithImages } from '../../utils/cloudinaryHelper.js';

const router = express.Router();

// Helper function to sanitize string inputs (basic trimming)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

// ==================== ANAL FISTULA HERO ====================
// GET /api/anal-fistula/hero
router.get('/hero', async (req, res) => {
  try {
    const hero = await AnalFistulaHero.getSingleton();
    res.json(hero);
  } catch (error) {
    console.error('Error fetching anal fistula hero:', error);
    res.status(500).json({ 
      error: 'Failed to fetch anal fistula hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/anal-fistula/hero
router.put('/hero', async (req, res) => {
  try {
    const hero = await AnalFistulaHero.getSingleton();
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
    console.error('Error updating anal fistula hero:', error);
    res.status(500).json({ 
      error: 'Failed to update anal fistula hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== ANAL FISTULA MAIN ====================
// GET /api/anal-fistula/main
router.get('/main', async (req, res) => {
  try {
    const main = await AnalFistulaMain.getSingleton();
    res.json(main);
  } catch (error) {
    console.error('Error fetching anal fistula main:', error);
    res.status(500).json({ 
      error: 'Failed to fetch anal fistula main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/anal-fistula/main
router.put('/main', async (req, res) => {
  try {
    const main = await AnalFistulaMain.getSingleton();
    const oldSections = main.sections || [];
    const permanentFolder = process.env.CLOUDINARY_FOLDER || 'assana-uploads';
    
    // Update sections array with image processing
    if (req.body.sections !== undefined && Array.isArray(req.body.sections)) {
      const processedSections = await processSectionsWithImages(req.body.sections, oldSections, permanentFolder);
      main.sections = processedSections.map(section => ({
        title: sanitizeString(section.title || ''),
        image: section.image || '', // Already processed
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
    console.error('Error updating anal fistula main:', error);
    res.status(500).json({ 
      error: 'Failed to update anal fistula main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;

