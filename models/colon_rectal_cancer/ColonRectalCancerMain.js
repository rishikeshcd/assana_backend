import mongoose from 'mongoose';

// Model for ColonRectalCancerMain component
const ColonRectalCancerMainSchema = new mongoose.Schema({
  sections: [{
    title: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    imageAlt: {
      type: String,
      default: '',
    },
    imageTitle: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    items: [{
      type: String,
      default: '',
    }],
  }],
}, {
  timestamps: true,
});

// Ensure only one document exists (singleton pattern)
ColonRectalCancerMainSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      sections: [],
    });
  }
  return doc;
};

const ColonRectalCancerMain = mongoose.model('ColonRectalCancerMain', ColonRectalCancerMainSchema);

export default ColonRectalCancerMain;


