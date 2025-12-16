import mongoose from "mongoose";

// Define the schema
const WellnessProgrammesMainSchema = new mongoose.Schema({
    mainTitle: {
        type: String,
        default: 'All you need to know..',
    },
    services: [{
        serviceName: {
            type: String,
            default: ''
        },
        serviceDescription: {
            type: String,
            default: ''
        },
        serviceImage: {
            type: String,
            default: ''
        }
    }]
}, {
    timestamps: true,
});

// Singleton: ensures only one document exists
WellnessProgrammesMainSchema.statics.getSingleton = async function() {
    let doc = await this.findOne();
    if (!doc) {
        doc = await this.create({
            services: [], // explicitly set empty array
        });
    }
    return doc;
};

// Create the model
const WellnessProgrammesMain = mongoose.model('WellnessProgrammesMain', WellnessProgrammesMainSchema);

export default WellnessProgrammesMain;
