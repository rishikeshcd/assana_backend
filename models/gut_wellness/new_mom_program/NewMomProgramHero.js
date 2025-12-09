import mongoose from 'mongoose';

// Model for NewMomProgramHero component
const NewMomProgramHeroSchema = new mongoose.Schema({
  backgroundImage: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'New Mom Program',
  },
  description: {
    type: String,
    default: '',
  },
  buttonText: {
    type: String,
    default: 'Book a Consultation',
  },
}, {
  timestamps: true,
});

// Ensure only one document exists (singleton pattern)
NewMomProgramHeroSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const NewMomProgramHero = mongoose.model('NewMomProgramHero', NewMomProgramHeroSchema);

export default NewMomProgramHero;

