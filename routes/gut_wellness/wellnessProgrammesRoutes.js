import express from 'express';
// import NewMomProgramHero from '../../models/gut_wellness/new_mom_program/NewMomProgramHero.js';
// import NewMomProgramMain from '../../models/gut_wellness/new_mom_program/NewMomProgramMain.js';
import { processImageUpdate } from '../../utils/cloudinaryHelper.js';
import WellnessProgrammesHero from '../../models/gut_wellness/wellness_programmes/WellnessProgrammeshero.js';
import WellnessProgrammesMain from '../../models/gut_wellness/wellness_programmes/wellnessProgrammesmain.js';


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
    const hero = await WellnessProgrammesHero.getSingleton();
    res.json(hero);
  } catch (error) {
    console.error('Error fetching wellness program hero:', error);
    res.status(500).json({ 
      error: 'Failed to fetch wellness program hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/gut-wellness/new-mom-program/hero
router.put('/hero', async (req, res) => {
  try {
    const hero = await WellnessProgrammesHero.getSingleton();
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
    console.error('Error updating wellness program hero:', error);
    res.status(500).json({ 
      error: 'Failed to update wellness program hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});


// ==================== WELLNESS PROGRAMMES MAIN ====================

// GET /api/gut-wellness/wellness-programmes/main
router.get('/main', async (req, res) => {
    try {
      const main = await WellnessProgrammesMain.getSingleton();
      res.json(main);
    } catch (error) {
      console.error('Error fetching wellness programmes main:', error);
      res.status(500).json({
        error: 'Failed to fetch wellness programmes main',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  });
  
  // PUT /api/gut-wellness/wellness-programmes/main
  router.put('/main', async (req, res) => {
    try {
      const main = await WellnessProgrammesMain.getSingleton();
  
      const oldServices = main.services || [];
      const permanentFolder = process.env.CLOUDINARY_FOLDER || 'assana-uploads';
  
      // Update main title
      if (req.body.mainTitle !== undefined) {
        main.mainTitle = sanitizeString(req.body.mainTitle);
      }
  
      // Update services with full Cloudinary safety
      if (req.body.services !== undefined && Array.isArray(req.body.services)) {
        const updatedServices = [];
  
        for (let i = 0; i < req.body.services.length; i++) {
          const newService = req.body.services[i];
          const oldService = oldServices[i] || {};
  
          const updatedImage = await processImageUpdate(
            sanitizeString(newService.serviceImage || ''),
            oldService.serviceImage || '',
            permanentFolder
          );
  
          updatedServices.push({
            serviceName: sanitizeString(newService.serviceName || ''),
            serviceDescription: sanitizeString(newService.serviceDescription || ''),
            serviceImage: updatedImage,
          });
        }
  
        main.services = updatedServices;
      }
  
      await main.save();
      res.json(main);
  
    } catch (error) {
      console.error('Error updating wellness programmes main:', error);
      res.status(500).json({
        error: 'Failed to update wellness programmes main',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  });

export default router;