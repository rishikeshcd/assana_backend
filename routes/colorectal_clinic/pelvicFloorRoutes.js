import express from 'express';
import PelvicFloorHero from '../../models/colorectal_clinic/pelvic_floor/PelvicFloorHero.js';
import PelvicFloorMain from '../../models/colorectal_clinic/pelvic_floor/PelvicFloorMain.js';
import { processImageUpdate, processSectionsWithImages } from '../../utils/cloudinaryHelper.js';

const router = express.Router();

// Helper function to sanitize string inputs (basic trimming)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

// ==================== PELVIC FLOOR HERO ====================
// GET /api/pelvic-floor/hero
router.get('/hero', async (req, res) => {
  try {
    const hero = await PelvicFloorHero.getSingleton();
    res.json(hero);
  } catch (error) {
    console.error('Error fetching pelvic floor hero:', error);
    res.status(500).json({ 
      error: 'Failed to fetch pelvic floor hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/pelvic-floor/hero
router.put('/hero', async (req, res) => {
  try {
    const hero = await PelvicFloorHero.getSingleton();
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
    console.error('Error updating pelvic floor hero:', error);
    res.status(500).json({ 
      error: 'Failed to update pelvic floor hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== PELVIC FLOOR MAIN ====================
// GET /api/pelvic-floor/main
router.get('/main', async (req, res) => {
  try {
    const main = await PelvicFloorMain.getSingleton();
    res.json(main);
  } catch (error) {
    console.error('Error fetching pelvic floor main:', error);
    res.status(500).json({ 
      error: 'Failed to fetch pelvic floor main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/pelvic-floor/main
router.put('/main', async (req, res) => {
  try {
    const main = await PelvicFloorMain.getSingleton();
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
        whatIsItHeading: sanitizeString(section.whatIsItHeading || 'What is it?'),
        whatIsIt: sanitizeString(section.whatIsIt || ''),
        howCanHelpHeading: sanitizeString(section.howCanHelpHeading || 'How Azura Can Help'),
        howCanHelp: sanitizeString(section.howCanHelp || ''),
        symptomsHeading: sanitizeString(section.symptomsHeading || 'Symptoms'),
        symptoms: Array.isArray(section.symptoms) 
          ? section.symptoms.map(symptom => sanitizeString(symptom || ''))
          : [],
      }));
    }
    
    await main.save();
    res.json(main);
  } catch (error) {
    console.error('Error updating pelvic floor main:', error);
    res.status(500).json({ 
      error: 'Failed to update pelvic floor main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;

