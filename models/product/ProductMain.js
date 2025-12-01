import mongoose from 'mongoose';

// Model for ProductMain component
const ProductMainSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Discover Your Nutrition Essentials',
  },
  products: [
    {
      label: {
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
      price: {
        type: String,
        default: '$29.99',
      },
      image: {
        type: String,
        default: '',
      },
      imageAlt: {
        type: String,
        default: '',
      },
    },
  ],
}, {
  timestamps: true,
});

// Ensure only one document exists (singleton pattern)
ProductMainSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const ProductMain = mongoose.model('ProductMain', ProductMainSchema);

export default ProductMain;

