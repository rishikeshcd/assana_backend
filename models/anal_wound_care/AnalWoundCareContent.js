import mongoose from 'mongoose';

// Model for AnalWoundCareContent component - 2 left cards, 3 right cards
const AnalWoundCareContentSchema = new mongoose.Schema({
  mainTitle: {
    type: String,
    default: 'All you need to know..',
  },
  leftTopSection: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  leftBottomSection: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  centerImage: {
    type: String,
    default: '',
  },
  centerImageAlt: {
    type: String,
    default: '',
  },
  rightTopSection: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  rightMiddleSection: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  rightBottomSection: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
}, {
  timestamps: true,
});

// Ensure only one document exists (singleton pattern)
AnalWoundCareContentSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const AnalWoundCareContent = mongoose.model('AnalWoundCareContent', AnalWoundCareContentSchema);

export default AnalWoundCareContent;

