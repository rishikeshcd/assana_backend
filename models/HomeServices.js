import mongoose from 'mongoose';

// Model for Services component - matches exact field names from Services.jsx
const HomeServicesSchema = new mongoose.Schema({
  componentHeading: {
    type: String,
    default: '',
  },
  services: [{
    serviceHeading: {
      type: String,
      default: '',
    },
    serviceOpenPara1: {
      type: String,
      default: '',
    },
    serviceOpenPara2: {
      type: String,
      default: '',
    },
  }],
}, {
  timestamps: true,
});

HomeServicesSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const HomeServices = mongoose.model('HomeServices', HomeServicesSchema);

export default HomeServices;

