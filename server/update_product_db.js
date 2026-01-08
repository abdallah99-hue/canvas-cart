
const mongoose = require('mongoose');
require('dotenv').config();

const updateProduct = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const result = await mongoose.connection.collection('products').updateOne(
      { name: 'Forest Whispers' },
      { 
        $set: { 
          image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80',
          images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80']
        } 
      }
    );

    console.log('Product updated:', result.modifiedCount);
    process.exit(0);
  } catch (error) {
    console.error('Error updating product:', error);
    process.exit(1);
  }
};

updateProduct();
