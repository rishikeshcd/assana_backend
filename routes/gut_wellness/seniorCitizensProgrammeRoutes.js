import express from 'express';
import SeniorCitizensProgrammeHero from '../../models/gut_wellness/senior_citizens_programme/SeniorCitizensProgrammeHero.js';
import SeniorCitizensProgrammeMain from '../../models/gut_wellness/senior_citizens_programme/SeniorCitizensProgrammeMain.js';
import { processImageUpdate, processSectionsWithImages } from '../../utils/cloudinaryHelper.js';

const router = express.Router();

// Helper function to sanitize string inputs (basic trimming)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

// ==================== SENIOR CITIZENS PROGRAMME HERO ====================
// GET /api/gut-wellness/senior-citizens-programme/hero
router.get('/hero', async (req, res) => {
  try {
    const hero = await SeniorCitizensProgrammeHero.getSingleton();
    res.json(hero);
  } catch (error) {
    console.error('Error fetching senior citizens programme hero:', error);
    res.status(500).json({ 
      error: 'Failed to fetch senior citizens programme hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/gut-wellness/senior-citizens-programme/hero
router.put('/hero', async (req, res) => {
  try {
    const hero = await SeniorCitizensProgrammeHero.getSingleton();
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
    console.error('Error updating senior citizens programme hero:', error);
    res.status(500).json({ 
      error: 'Failed to update senior citizens programme hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== SENIOR CITIZENS PROGRAMME MAIN ====================
// GET /api/gut-wellness/senior-citizens-programme/main
router.get('/main', async (req, res) => {
  try {
    const main = await SeniorCitizensProgrammeMain.getSingleton();
    res.json(main);
  } catch (error) {
    console.error('Error fetching senior citizens programme main:', error);
    res.status(500).json({ 
      error: 'Failed to fetch senior citizens programme main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/gut-wellness/senior-citizens-programme/main
router.put('/main', async (req, res) => {
  try {
    const main = await SeniorCitizensProgrammeMain.getSingleton();
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
    console.error('Error updating senior citizens programme main:', error);
    res.status(500).json({ 
      error: 'Failed to update senior citizens programme main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;

