import mongoose from 'mongoose';

// Model for DropdownMenu component - matches exact field names from DropdownMenu.jsx
const HomeDropdownSchema = new mongoose.Schema({
  colorectalConditionsTitle: {
    type: String,
    default: '',
  },
  colorectalConditionsItems: {
    type: [String],
    default: [],
  },
  // Keep old fields for backward compatibility
  colorectalConditionsItem1: {
    type: String,
    default: '',
  },
  colorectalConditionsItem2: {
    type: String,
    default: '',
  },
  colorectalConditionsItem3: {
    type: String,
    default: '',
  },
  colorectalConditionsItem4: {
    type: String,
    default: '',
  },
  colorectalConditionsItem5: {
    type: String,
    default: '',
  },
  colorectalConditionsItem6: {
    type: String,
    default: '',
  },
  gutWellnessTitle: {
    type: String,
    default: '',
  },
  gutWellnessItems: {
    type: [String],
    default: [],
  },
  // Keep old fields for backward compatibility
  gutWellnessItem1: {
    type: String,
    default: '',
  },
  gutWellnessItem2: {
    type: String,
    default: '',
  },
  gutWellnessItem3: {
    type: String,
    default: '',
  },
  gutWellnessItem4: {
    type: String,
    default: '',
  },
  gutWellnessItem5: {
    type: String,
    default: '',
  },
  gutWellnessItem6: {
    type: String,
    default: '',
  },
  educationTitle: {
    type: String,
    default: '',
  },
  educationItems: {
    type: [String],
    default: [],
  },
  // Keep old fields for backward compatibility
  educationItem1: {
    type: String,
    default: '',
  },
  educationItem2: {
    type: String,
    default: '',
  },
  educationItem3: {
    type: String,
    default: '',
  },
  backgroundImage: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

HomeDropdownSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const HomeDropdown = mongoose.model('HomeDropdown', HomeDropdownSchema);

export default HomeDropdown;

