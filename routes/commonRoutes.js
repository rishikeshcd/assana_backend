import express from 'express';
import Contact from '../models/common/Contact.js';
import HowAssanaTreats from '../models/common/HowAssanaTreats.js';
import WhyChooseAssana from '../models/common/WhyChooseAssana.js';

const router = express.Router();

// Helper function to sanitize string inputs (basic trimming)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

// ==================== CONTACT (Common Section) ====================
// GET /api/common/contact
router.get('/contact', async (req, res) => {
  try {
    const contact = await Contact.getSingleton();
    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ 
      error: 'Failed to fetch contact',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/common/contact
router.put('/contact', async (req, res) => {
  try {
    const contact = await Contact.getSingleton();
    
    // Update fields (sanitize strings)
    if (req.body.heading !== undefined) contact.heading = sanitizeString(req.body.heading);
    if (req.body.description !== undefined) contact.description = sanitizeString(req.body.description);
    if (req.body.phoneText !== undefined) contact.phoneText = sanitizeString(req.body.phoneText);
    if (req.body.phoneNumber !== undefined) contact.phoneNumber = sanitizeString(req.body.phoneNumber);
    if (req.body.buttonText !== undefined) contact.buttonText = sanitizeString(req.body.buttonText);
    if (req.body.backgroundImage !== undefined) contact.backgroundImage = sanitizeString(req.body.backgroundImage);
    
    await contact.save();
    res.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ 
      error: 'Failed to update contact',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== HOW ASSANA TREATS (Common Section) ====================
// GET /api/common/how-assana-treats
router.get('/how-assana-treats', async (req, res) => {
  try {
    const howAssanaTreats = await HowAssanaTreats.getSingleton();
    res.json(howAssanaTreats);
  } catch (error) {
    console.error('Error fetching how assana treats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch how assana treats',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/common/how-assana-treats
router.put('/how-assana-treats', async (req, res) => {
  try {
    const howAssanaTreats = await HowAssanaTreats.getSingleton();
    
    // Update title
    if (req.body.title !== undefined) {
      howAssanaTreats.title = sanitizeString(req.body.title);
    }
    
    // Update treatments array
    if (req.body.treatments !== undefined && Array.isArray(req.body.treatments)) {
      howAssanaTreats.treatments = req.body.treatments.map(treatment => ({
        title: sanitizeString(treatment.title || ''),
        image: sanitizeString(treatment.image || ''),
        imageAlt: sanitizeString(treatment.imageAlt || ''),
      }));
    }
    
    await howAssanaTreats.save();
    res.json(howAssanaTreats);
  } catch (error) {
    console.error('Error updating how assana treats:', error);
    res.status(500).json({ 
      error: 'Failed to update how assana treats',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== WHY CHOOSE ASSANA (Common Section) ====================
// GET /api/common/why-choose-assana
router.get('/why-choose-assana', async (req, res) => {
  try {
    const whyChooseAssana = await WhyChooseAssana.getSingleton();
    res.json(whyChooseAssana);
  } catch (error) {
    console.error('Error fetching why choose assana:', error);
    res.status(500).json({ 
      error: 'Failed to fetch why choose assana',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/common/why-choose-assana
router.put('/why-choose-assana', async (req, res) => {
  try {
    const whyChooseAssana = await WhyChooseAssana.getSingleton();
    
    // Update title
    if (req.body.title !== undefined) {
      whyChooseAssana.title = sanitizeString(req.body.title);
    }
    
    // Update cards array
    if (req.body.cards !== undefined && Array.isArray(req.body.cards)) {
      whyChooseAssana.cards = req.body.cards.map(card => ({
        title: sanitizeString(card.title || ''),
        description: sanitizeString(card.description || ''),
        icon: sanitizeString(card.icon || ''),
        iconAlt: sanitizeString(card.iconAlt || ''),
      }));
    }
    
    await whyChooseAssana.save();
    res.json(whyChooseAssana);
  } catch (error) {
    console.error('Error updating why choose assana:', error);
    res.status(500).json({ 
      error: 'Failed to update why choose assana',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;

