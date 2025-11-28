import mongoose from 'mongoose';

// Model for AboutTeam component - array of team members
const AboutTeamSchema = new mongoose.Schema({
  sectionHeading: {
    type: String,
    default: '',
  },
  teamMembers: [{
    role: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  }],
}, {
  timestamps: true,
});

// Ensure only one document exists (singleton pattern)
AboutTeamSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({ sectionHeading: 'Meet our Team', teamMembers: [] });
  }
  return doc;
};

const AboutTeam = mongoose.model('AboutTeam', AboutTeamSchema);

export default AboutTeam;


