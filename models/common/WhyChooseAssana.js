import mongoose from 'mongoose';

// Model for WhyChooseAssana component - common section for all pages
const WhyChooseAssanaSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Why Choose Assana for Piles Treatment?',
  },
  cards: [{
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    iconAlt: {
      type: String,
      default: '',
    },
  }],
}, {
  timestamps: true,
});

// Ensure only one document exists (singleton pattern)
WhyChooseAssanaSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      cards: [
        {
          title: 'Expertise in Colorectal Care',
          description: 'Our multidisciplinary team includes colorectal specialists, physiotherapists, nutritionists, and lifestyle coaches',
          icon: '',
          iconAlt: 'Expertise in Colorectal Care',
        },
        {
          title: 'Advanced Technology',
          description: 'State-of-the-art equipment ensures precision and comfort during the procedure.',
          icon: '',
          iconAlt: 'Advanced Technology',
        },
        {
          title: 'Comprehensive Care',
          description: 'Alongside the procedure, we provide personalized diet and lifestyle recommendations to prevent recurrence.',
          icon: '',
          iconAlt: 'Comprehensive Care',
        },
        {
          title: 'Patient-Centric Approach',
          description: 'We prioritize your comfort, privacy, and recovery every step of the way.',
          icon: '',
          iconAlt: 'Patient-Centric Approach',
        },
      ],
    });
  }
  return doc;
};

const WhyChooseAssana = mongoose.model('WhyChooseAssana', WhyChooseAssanaSchema);

export default WhyChooseAssana;

