import express from 'express';
import ColorectalSymptomsHero from '../models/colorectal_symptoms/ColorectalSymptomsHero.js';
import ColorectalSymptomsMain from '../models/colorectal_symptoms/ColorectalSymptomsMain.js';

const router = express.Router();

// Helper function to sanitize string inputs (basic trimming)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

// ==================== COLORECTAL SYMPTOMS HERO ====================
// GET /api/colorectal-symptoms/hero
router.get('/hero', async (req, res) => {
  try {
    const hero = await ColorectalSymptomsHero.getSingleton();
    res.json(hero);
  } catch (error) {
    console.error('Error fetching colorectal symptoms hero:', error);
    res.status(500).json({ 
      error: 'Failed to fetch colorectal symptoms hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/colorectal-symptoms/hero
router.put('/hero', async (req, res) => {
  try {
    const hero = await ColorectalSymptomsHero.getSingleton();
    
    // Update fields (sanitize strings)
    if (req.body.backgroundImage !== undefined) hero.backgroundImage = sanitizeString(req.body.backgroundImage);
    if (req.body.title !== undefined) hero.title = sanitizeString(req.body.title);
    if (req.body.description !== undefined) hero.description = sanitizeString(req.body.description);
    if (req.body.buttonText !== undefined) hero.buttonText = sanitizeString(req.body.buttonText);
    
    await hero.save();
    res.json(hero);
  } catch (error) {
    console.error('Error updating colorectal symptoms hero:', error);
    res.status(500).json({ 
      error: 'Failed to update colorectal symptoms hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== COLORECTAL SYMPTOMS MAIN ====================
// GET /api/colorectal-symptoms/main
router.get('/main', async (req, res) => {
  try {
    const main = await ColorectalSymptomsMain.getSingleton();
    res.json(main);
  } catch (error) {
    console.error('Error fetching colorectal symptoms main:', error);
    res.status(500).json({ 
      error: 'Failed to fetch colorectal symptoms main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/colorectal-symptoms/main
router.put('/main', async (req, res) => {
  try {
    const main = await ColorectalSymptomsMain.getSingleton();
    
    // Update sections array
    if (req.body.sections !== undefined && Array.isArray(req.body.sections)) {
      main.sections = req.body.sections.map(section => ({
        title: sanitizeString(section.title || ''),
        image: sanitizeString(section.image || ''),
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
    console.error('Error updating colorectal symptoms main:', error);
    res.status(500).json({ 
      error: 'Failed to update colorectal symptoms main',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;

