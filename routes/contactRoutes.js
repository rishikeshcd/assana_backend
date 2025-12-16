import express from 'express';
import ContactMain from '../models/contactmain/ContactMain.js';

const router = express.Router();

const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

router.get('/contact', async(req,res) => {
  try {
    const contact = await ContactMain.getSingleton();
    res.json(contact);
  } catch (error) {
    console.error('error fetiching main contact',error);
    res.status(500).json({
      error:'Failed to fetch maincontact',
      message:error.message.ContactMain,
      stack:process.env.NODE_ENV === 'developemnt' ? error.stack : undefined
    });
    
  }
} 
);

router.put('/contact',async (req,res) =>{
  try {
    const contact = await ContactMain.getSingleton();

     // Update fields (sanitize strings)
     if (req.body.heading !== undefined) contact.heading = sanitizeString(req.body.heading);
     if (req.body.text1 !== undefined) contact.text1 = sanitizeString(req.body.text1);
     if (req.body.text2 !== undefined) contact.text2 = sanitizeString(req.body.text2);
    
     if (req.body.buttonText !== undefined) contact.buttonText = sanitizeString(req.body.buttonText);
     if (req.body.backgroundImage !== undefined) contact.backgroundImage = sanitizeString(req.body.backgroundImage);
     
     await contact.save();
     res.json(contact);
    
  } catch (error) {
    console.error('error updating conatact main',error);
    res.status(500).json({
      error: "failed to update contact main",
      message:error.message,
      stack:process.env.NODE_ENV === 'developement' ? error.stack : undefined
    });
  }
})
// Placeholder routes for Contact page


export default router;

