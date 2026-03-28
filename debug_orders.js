import mongoose from 'mongoose';
import Order from './backend/src/models/Order.js';

mongoose.connect('mongodb://127.0.0.1:27017/pixpulse')
  .then(async () => {
    const orders = await Order.find({ "items.artwork": "69a7bfbc3a81dd35b67ae814" });
    console.log(JSON.stringify(orders, null, 2));
    process.exit(0);
  });
