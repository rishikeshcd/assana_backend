import express from 'express';
import HomeBanner from '../models/home/HomeBanner.js';
import HomeDropdown from '../models/home/HomeDropdown.js';
import HomeWhyAssana from '../models/home/HomeWhyAssana.js';
import HomeServices from '../models/home/HomeServices.js';
import HomeVideo from '../models/home/HomeVideo.js';
import HomePatientFeedbackComponent from '../models/home/HomePatientFeedbackComponent.js';
import HomeAskedQuestionsComponent from '../models/home/HomeAskedQuestionsComponent.js';
import HomeGetStartedComponent from '../models/home/HomeGetStartedComponent.js';

const router = express.Router();

// Helper function to sanitize string inputs (basic trimming)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

// ==================== HOME BANNER ====================
// GET /api/home/banner
router.get('/banner', async (req, res) => {
  try {
    const banner = await HomeBanner.getSingleton();
    res.json(banner);
  } catch (error) {
    console.error('Error fetching home banner:', error);
    res.status(500).json({ 
      error: 'Failed to fetch home banner',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/home/banner
router.put('/banner', async (req, res) => {
  try {
    const banner = await HomeBanner.getSingleton();
    
    // Update fields (sanitize strings)
    if (req.body.mainTitle !== undefined) banner.mainTitle = sanitizeString(req.body.mainTitle);
    if (req.body.subtitle !== undefined) banner.subtitle = sanitizeString(req.body.subtitle);
    if (req.body.introductionParagraph !== undefined) banner.introductionParagraph = sanitizeString(req.body.introductionParagraph);
    if (req.body.experienceSectionTitle !== undefined) banner.experienceSectionTitle = sanitizeString(req.body.experienceSectionTitle);
    
    // Handle experienceItems as array
    if (req.body.experienceItems !== undefined && Array.isArray(req.body.experienceItems)) {
      banner.experienceItems = req.body.experienceItems.map(item => sanitizeString(item));
    }
    
    // Keep old fields for backward compatibility (can be removed later)
    if (req.body.experienceItems_1 !== undefined) banner.experienceItems_1 = sanitizeString(req.body.experienceItems_1);
    if (req.body.experienceItems_2 !== undefined) banner.experienceItems_2 = sanitizeString(req.body.experienceItems_2);
    if (req.body.experienceItems_3 !== undefined) banner.experienceItems_3 = sanitizeString(req.body.experienceItems_3);
    if (req.body.experienceItems_4 !== undefined) banner.experienceItems_4 = sanitizeString(req.body.experienceItems_4);
    if (req.body.experienceItems_5 !== undefined) banner.experienceItems_5 = sanitizeString(req.body.experienceItems_5);
    if (req.body.experienceItems_6 !== undefined) banner.experienceItems_6 = sanitizeString(req.body.experienceItems_6);
    if (req.body.experienceItems_7 !== undefined) banner.experienceItems_7 = sanitizeString(req.body.experienceItems_7);
    
    if (req.body.backgroundImage !== undefined) banner.backgroundImage = sanitizeString(req.body.backgroundImage);
    
    await banner.save();
    res.json(banner);
  } catch (error) {
    console.error('Error updating home banner:', error);
    res.status(500).json({ error: 'Failed to update home banner' });
  }
});

// ==================== HOME DROPDOWN (DropdownMenu) ====================
// GET /api/home/services (keeping route name for backward compatibility)
router.get('/services', async (req, res) => {
  try {
    const dropdown = await HomeDropdown.getSingleton();
    res.json(dropdown);
  } catch (error) {
    console.error('Error fetching home dropdown:', error);
    res.status(500).json({ error: 'Failed to fetch home dropdown' });
  }
});

// PUT /api/home/services (keeping route name for backward compatibility)
router.put('/services', async (req, res) => {
  try {
    const dropdown = await HomeDropdown.getSingleton();
    
    // Handle array fields
    if (req.body.colorectalConditionsItems !== undefined && Array.isArray(req.body.colorectalConditionsItems)) {
      dropdown.colorectalConditionsItems = req.body.colorectalConditionsItems.map(item => sanitizeString(item));
    }
    if (req.body.gutWellnessItems !== undefined && Array.isArray(req.body.gutWellnessItems)) {
      dropdown.gutWellnessItems = req.body.gutWellnessItems.map(item => sanitizeString(item));
    }
    if (req.body.educationItems !== undefined && Array.isArray(req.body.educationItems)) {
      dropdown.educationItems = req.body.educationItems.map(item => sanitizeString(item));
    }
    
    // Update string fields (including backgroundImage)
    Object.keys(req.body).forEach(key => {
      if (dropdown.schema.paths[key] && typeof req.body[key] === 'string') {
        dropdown[key] = sanitizeString(req.body[key]);
      }
    });
    
    // Handle backgroundImage specifically
    if (req.body.backgroundImage !== undefined) {
      dropdown.backgroundImage = sanitizeString(req.body.backgroundImage);
    }
    
    await dropdown.save();
    res.json(dropdown);
  } catch (error) {
    console.error('Error updating home dropdown:', error);
    res.status(500).json({ error: 'Failed to update home dropdown' });
  }
});

// ==================== HOME WHY ASSANA (Contains both WhyAssana and WhyDifferent) ====================
// GET /api/home/why-assana
router.get('/why-assana', async (req, res) => {
  try {
    const whyAssana = await HomeWhyAssana.getSingleton();
    res.json(whyAssana);
  } catch (error) {
    console.error('Error fetching why assana:', error);
    res.status(500).json({ error: 'Failed to fetch why assana' });
  }
});

// PUT /api/home/why-assana
router.put('/why-assana', async (req, res) => {
  try {
    const whyAssana = await HomeWhyAssana.getSingleton();
    
    // Why Assana Section
    if (req.body.mainTitle !== undefined) whyAssana.mainTitle = sanitizeString(req.body.mainTitle);
    if (req.body.subtitle !== undefined) whyAssana.subtitle = sanitizeString(req.body.subtitle);
    if (req.body.introductionParagraph !== undefined) whyAssana.introductionParagraph = sanitizeString(req.body.introductionParagraph);
    
    // Why Different Section
    if (req.body.whyDifferentMainTitle !== undefined) whyAssana.whyDifferentMainTitle = sanitizeString(req.body.whyDifferentMainTitle);
    if (req.body.whyDifferentSubtitle !== undefined) whyAssana.whyDifferentSubtitle = sanitizeString(req.body.whyDifferentSubtitle);
    if (req.body.whyDifferentIntroductionParagraph !== undefined) whyAssana.whyDifferentIntroductionParagraph = sanitizeString(req.body.whyDifferentIntroductionParagraph);
    
    await whyAssana.save();
    res.json(whyAssana);
  } catch (error) {
    console.error('Error updating why assana:', error);
    res.status(500).json({ error: 'Failed to update why assana' });
  }
});

// ==================== HOME WHY DIFFERENT (Deprecated - use /why-assana instead) ====================
// GET /api/home/why-different (kept for backward compatibility, returns data from why-assana)
router.get('/why-different', async (req, res) => {
  try {
    const whyAssana = await HomeWhyAssana.getSingleton();
    // Return WhyDifferent section data in old format for backward compatibility
    res.json({
      mainTitle: whyAssana.whyDifferentMainTitle || '',
      subtitle: whyAssana.whyDifferentSubtitle || '',
      introductionParagraph: whyAssana.whyDifferentIntroductionParagraph || '',
    });
  } catch (error) {
    console.error('Error fetching why different:', error);
    res.status(500).json({ error: 'Failed to fetch why different' });
  }
});

// PUT /api/home/why-different (kept for backward compatibility, updates why-assana model)
router.put('/why-different', async (req, res) => {
  try {
    const whyAssana = await HomeWhyAssana.getSingleton();
    
    // Map old field names to new field names
    if (req.body.mainTitle !== undefined) whyAssana.whyDifferentMainTitle = sanitizeString(req.body.mainTitle);
    if (req.body.subtitle !== undefined) whyAssana.whyDifferentSubtitle = sanitizeString(req.body.subtitle);
    if (req.body.introductionParagraph !== undefined) whyAssana.whyDifferentIntroductionParagraph = sanitizeString(req.body.introductionParagraph);
    
    await whyAssana.save();
    // Return in old format for backward compatibility
    res.json({
      mainTitle: whyAssana.whyDifferentMainTitle || '',
      subtitle: whyAssana.whyDifferentSubtitle || '',
      introductionParagraph: whyAssana.whyDifferentIntroductionParagraph || '',
    });
  } catch (error) {
    console.error('Error updating why different:', error);
    res.status(500).json({ error: 'Failed to update why different' });
  }
});

// ==================== HOME SERVICES (Services Component) ====================
// GET /api/home/services-component
router.get('/services-component', async (req, res) => {
  try {
    const services = await HomeServices.getSingleton();
    res.json(services);
  } catch (error) {
    console.error('Error fetching home services:', error);
    res.status(500).json({ error: 'Failed to fetch home services' });
  }
});

// PUT /api/home/services-component
router.put('/services-component', async (req, res) => {
  try {
    const services = await HomeServices.getSingleton();
    
    if (req.body.componentHeading !== undefined) services.componentHeading = sanitizeString(req.body.componentHeading);
    if (req.body.services !== undefined && Array.isArray(req.body.services)) {
      services.services = req.body.services.map(service => ({
        serviceHeading: sanitizeString(service.serviceHeading || ''),
        serviceOpenPara1: sanitizeString(service.serviceOpenPara1 || ''),
        serviceOpenPara2: sanitizeString(service.serviceOpenPara2 || ''),
      }));
    }
    
    await services.save();
    res.json(services);
  } catch (error) {
    console.error('Error updating home services:', error);
    res.status(500).json({ error: 'Failed to update home services' });
  }
});

// ==================== VIDEO (Healing) ====================
// GET /api/home/video
router.get('/video', async (req, res) => {
  try {
    const video = await HomeVideo.getSingleton();
    res.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

// PUT /api/home/video
router.put('/video', async (req, res) => {
  try {
    const video = await HomeVideo.getSingleton();
    
    if (req.body.Heading !== undefined) video.Heading = sanitizeString(req.body.Heading);
    if (req.body.subHeading !== undefined) video.subHeading = sanitizeString(req.body.subHeading);
    if (req.body.videoLink !== undefined) video.videoLink = sanitizeString(req.body.videoLink);
    
    await video.save();
    res.json(video);
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ error: 'Failed to update video' });
  }
});

// ==================== PATIENT FEEDBACK COMPONENT ====================
// GET /api/home/patient-feedback
router.get('/patient-feedback', async (req, res) => {
  try {
    const patientFeedback = await HomePatientFeedbackComponent.getSingleton();
    res.json(patientFeedback);
  } catch (error) {
    console.error('Error fetching patient feedback:', error);
    res.status(500).json({ error: 'Failed to fetch patient feedback' });
  }
});

// PUT /api/home/patient-feedback
router.put('/patient-feedback', async (req, res) => {
  try {
    const patientFeedback = await HomePatientFeedbackComponent.getSingleton();
    
    if (req.body.componentHeading !== undefined) patientFeedback.componentHeading = sanitizeString(req.body.componentHeading);
    if (req.body.componentSubHeading !== undefined) patientFeedback.componentSubHeading = sanitizeString(req.body.componentSubHeading);
    if (req.body.testimonials !== undefined && Array.isArray(req.body.testimonials)) {
      patientFeedback.testimonials = req.body.testimonials.map(testimonial => ({
        patientName: sanitizeString(testimonial.patientName || ''),
        patientProblem: sanitizeString(testimonial.patientProblem || ''),
        patientFeeback: sanitizeString(testimonial.patientFeeback || ''),
        patientImg: sanitizeString(testimonial.patientImg || ''),
      }));
    }
    
    await patientFeedback.save();
    res.json(patientFeedback);
  } catch (error) {
    console.error('Error updating patient feedback:', error);
    res.status(500).json({ error: 'Failed to update patient feedback' });
  }
});

// ==================== ASKED QUESTIONS COMPONENT (FAQ) ====================
// GET /api/home/asked-questions
router.get('/asked-questions', async (req, res) => {
  try {
    const askedQuestions = await HomeAskedQuestionsComponent.getSingleton();
    res.json(askedQuestions);
  } catch (error) {
    console.error('Error fetching asked questions:', error);
    res.status(500).json({ error: 'Failed to fetch asked questions' });
  }
});

// PUT /api/home/asked-questions
router.put('/asked-questions', async (req, res) => {
  try {
    const askedQuestions = await HomeAskedQuestionsComponent.getSingleton();
    
    if (req.body.componentHeading !== undefined) askedQuestions.componentHeading = sanitizeString(req.body.componentHeading);
    if (req.body.faqs !== undefined && Array.isArray(req.body.faqs)) {
      askedQuestions.faqs = req.body.faqs.map(faq => ({
        questionHeading: sanitizeString(faq.questionHeading || ''),
        answerPara: sanitizeString(faq.answerPara || ''),
      }));
    }
    
    await askedQuestions.save();
    res.json(askedQuestions);
  } catch (error) {
    console.error('Error updating asked questions:', error);
    res.status(500).json({ error: 'Failed to update asked questions' });
  }
});

// ==================== GET STARTED COMPONENT (TryDemo) ====================
// GET /api/home/get-started
router.get('/get-started', async (req, res) => {
  try {
    const getStarted = await HomeGetStartedComponent.getSingleton();
    res.json(getStarted);
  } catch (error) {
    console.error('Error fetching get started:', error);
    res.status(500).json({ error: 'Failed to fetch get started' });
  }
});

// PUT /api/home/get-started
router.put('/get-started', async (req, res) => {
  try {
    const getStarted = await HomeGetStartedComponent.getSingleton();
    
    if (req.body.Heading !== undefined) getStarted.Heading = sanitizeString(req.body.Heading);
    if (req.body.subHeading !== undefined) getStarted.subHeading = sanitizeString(req.body.subHeading);
    if (req.body.backgroundImage !== undefined) getStarted.backgroundImage = sanitizeString(req.body.backgroundImage);
    if (req.body.button1Text !== undefined) getStarted.button1Text = sanitizeString(req.body.button1Text);
    if (req.body.button2Text !== undefined) getStarted.button2Text = sanitizeString(req.body.button2Text);
    
    await getStarted.save();
    res.json(getStarted);
  } catch (error) {
    console.error('Error updating get started:', error);
    res.status(500).json({ error: 'Failed to update get started' });
  }
});

export default router;

