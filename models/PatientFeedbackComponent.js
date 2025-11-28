import mongoose from 'mongoose';

// Model for PatientSays component - matches exact field names from PatientSays.jsx
const PatientFeedbackComponentSchema = new mongoose.Schema({
  componentHeading: {
    type: String,
    default: '',
  },
  componentSubHeading: {
    type: String,
    default: '',
  },
  testimonials: [{
    patientName: {
      type: String,
      default: '',
    },
    patientProblem: {
      type: String,
      default: '',
    },
    patientFeeback: {
      type: String,
      default: '',
    },
    patientImg: {
      type: String,
      default: '',
    },
  }],
}, {
  timestamps: true,
});

PatientFeedbackComponentSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const PatientFeedbackComponent = mongoose.model('PatientFeedbackComponent', PatientFeedbackComponentSchema);

export default PatientFeedbackComponent;

