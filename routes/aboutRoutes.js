import express from 'express';
import AboutHero from '../models/AboutHero.js';
import AboutMission from '../models/AboutMission.js';
import AboutWhyChoose from '../models/AboutWhyChoose.js';
import AboutMissionVision from '../models/AboutMissionVision.js';
import AboutTeam from '../models/AboutTeam.js';

const router = express.Router();

// Helper function to sanitize string inputs (basic trimming)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

// ==================== ABOUT HERO ====================
// GET /api/about/hero
router.get('/hero', async (req, res) => {
  try {
    const hero = await AboutHero.getSingleton();
    res.json(hero);
  } catch (error) {
    console.error('Error fetching about hero:', error);
    res.status(500).json({ 
      error: 'Failed to fetch about hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/about/hero
router.put('/hero', async (req, res) => {
  try {
    const hero = await AboutHero.getSingleton();
    
    // Update fields (sanitize strings)
    if (req.body.aboutBanner !== undefined) hero.aboutBanner = sanitizeString(req.body.aboutBanner);
    if (req.body.bannerHeading !== undefined) hero.bannerHeading = sanitizeString(req.body.bannerHeading);
    if (req.body.bannerSubHeading !== undefined) hero.bannerSubHeading = sanitizeString(req.body.bannerSubHeading);
    
    await hero.save();
    res.json(hero);
  } catch (error) {
    console.error('Error updating about hero:', error);
    res.status(500).json({ 
      error: 'Failed to update about hero',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== ABOUT MISSION ====================
// GET /api/about/mission
router.get('/mission', async (req, res) => {
  try {
    const mission = await AboutMission.getSingleton();
    res.json(mission);
  } catch (error) {
    console.error('Error fetching about mission:', error);
    res.status(500).json({ 
      error: 'Failed to fetch about mission',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/about/mission
router.put('/mission', async (req, res) => {
  try {
    const mission = await AboutMission.getSingleton();
    
    // Update fields (sanitize strings)
    if (req.body.whyAssanaHeading !== undefined) mission.whyAssanaHeading = sanitizeString(req.body.whyAssanaHeading);
    if (req.body.whyAssanaSubHeading !== undefined) mission.whyAssanaSubHeading = sanitizeString(req.body.whyAssanaSubHeading);
    if (req.body.whyAssanaPara !== undefined) mission.whyAssanaPara = sanitizeString(req.body.whyAssanaPara);
    
    await mission.save();
    res.json(mission);
  } catch (error) {
    console.error('Error updating about mission:', error);
    res.status(500).json({ 
      error: 'Failed to update about mission',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== ABOUT WHY CHOOSE ====================
// GET /api/about/why-choose
router.get('/why-choose', async (req, res) => {
  try {
    const whyChoose = await AboutWhyChoose.getSingleton();
    res.json(whyChoose);
  } catch (error) {
    console.error('Error fetching about why choose:', error);
    res.status(500).json({ 
      error: 'Failed to fetch about why choose',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/about/why-choose
router.put('/why-choose', async (req, res) => {
  try {
    const whyChoose = await AboutWhyChoose.getSingleton();
    
    // Update fields (sanitize strings)
    if (req.body.heading !== undefined) whyChoose.heading = sanitizeString(req.body.heading);
    if (req.body.subtitle !== undefined) whyChoose.subtitle = sanitizeString(req.body.subtitle);
    if (req.body.buttonText !== undefined) whyChoose.buttonText = sanitizeString(req.body.buttonText);
    if (req.body.description !== undefined) whyChoose.description = sanitizeString(req.body.description);
    
    await whyChoose.save();
    res.json(whyChoose);
  } catch (error) {
    console.error('Error updating about why choose:', error);
    res.status(500).json({ 
      error: 'Failed to update about why choose',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== ABOUT MISSION VISION ====================
// GET /api/about/mission-vision
router.get('/mission-vision', async (req, res) => {
  try {
    const missionVision = await AboutMissionVision.getSingleton();
    res.json(missionVision);
  } catch (error) {
    console.error('Error fetching about mission vision:', error);
    res.status(500).json({ 
      error: 'Failed to fetch about mission vision',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/about/mission-vision
router.put('/mission-vision', async (req, res) => {
  try {
    const missionVision = await AboutMissionVision.getSingleton();
    
    // Update fields (sanitize strings)
    if (req.body.missionHeading !== undefined) missionVision.missionHeading = sanitizeString(req.body.missionHeading);
    if (req.body.missionText !== undefined) missionVision.missionText = sanitizeString(req.body.missionText);
    if (req.body.visionHeading !== undefined) missionVision.visionHeading = sanitizeString(req.body.visionHeading);
    if (req.body.visionText !== undefined) missionVision.visionText = sanitizeString(req.body.visionText);
    
    await missionVision.save();
    res.json(missionVision);
  } catch (error) {
    console.error('Error updating about mission vision:', error);
    res.status(500).json({ 
      error: 'Failed to update about mission vision',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== ABOUT TEAM ====================
// GET /api/about/team
router.get('/team', async (req, res) => {
  try {
    const team = await AboutTeam.getSingleton();
    res.json(team);
  } catch (error) {
    console.error('Error fetching about team:', error);
    res.status(500).json({ 
      error: 'Failed to fetch about team',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/about/team
router.put('/team', async (req, res) => {
  try {
    const team = await AboutTeam.getSingleton();
    
    // Update section heading
    if (req.body.sectionHeading !== undefined) team.sectionHeading = sanitizeString(req.body.sectionHeading);
    
    // Update team members array
    if (req.body.teamMembers !== undefined && Array.isArray(req.body.teamMembers)) {
      team.teamMembers = req.body.teamMembers.map(member => ({
        role: sanitizeString(member.role || ''),
        profileImage: sanitizeString(member.profileImage || ''),
        name: sanitizeString(member.name || ''),
        title: sanitizeString(member.title || ''),
        description: sanitizeString(member.description || ''),
      }));
    }
    
    await team.save();
    res.json(team);
  } catch (error) {
    console.error('Error updating about team:', error);
    res.status(500).json({ 
      error: 'Failed to update about team',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;
