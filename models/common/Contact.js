import mongoose from 'mongoose';

// Model for Contact component - common section for all pages
const ContactSchema = new mongoose.Schema({
  heading: {
    type: String,
    default: 'Ready to Feel Better Naturally?',
  },
  description: {
    type: String,
    default: 'Take the first step toward a healthier gut and a balanced life. Our certified wellness team is here to guide you with personalized care, natural therapies, and modern diagnostics.',
  },
  phoneText: {
    type: String,
    default: 'Call +91 8035735721 to book an appointment instantly through our AI voice system.',
  },
  phoneNumber: {
    type: String,
    default: '+91 8035735721',
  },
  buttonText: {
    type: String,
    default: 'Book a Consultation',
  },
  backgroundImage: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Ensure only one document exists (singleton pattern)
ContactSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const Contact = mongoose.model('Contact', ContactSchema);

export default Contact;

