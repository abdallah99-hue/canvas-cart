const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
  },
  image: {
    type: String,
    required: true,
  },
  images: [String],
  rating: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
  specs: {
    medium: String,
    size: String,
    frame: String,
    year: String,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  stock: {
    type: Number,
    default: 10,
  },
}, {
  timestamps: true,
  toJSON: {
     virtuals: true,
     transform: function (doc, ret) {
       ret.id = ret._id;
       ret.inStock = ret.stock > 0;
       delete ret._id;
       delete ret.__v;
     }
   },
   toObject: {
     virtuals: true,
     transform: function (doc, ret) {
       ret.id = ret._id;
       ret.inStock = ret.stock > 0;
       delete ret._id;
       delete ret.__v;
     }
   }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
