import fs from 'fs';
import mongoose from 'mongoose';
import './src/models/Order.js';

mongoose.connect('mongodb://127.0.0.1:27017/pixpulse')
  .then(async () => {
    const Order = mongoose.model('Order');
    const orders = await Order.find({ "items.artwork": new mongoose.Types.ObjectId("69a7bfbc3a81dd35b67ae814") });
    
    // Load Artwork dynamically since strict is true by default
    const Artwork = mongoose.model('Artwork', new mongoose.Schema({}, { strict: false }));
    const art = await Artwork.findById("69a7bfbc3a81dd35b67ae814");
    
    fs.writeFileSync('debug_output.json', JSON.stringify({ orders, art }, null, 2));
    process.exit(0);
  }).catch(e => { console.error(e); process.exit(1); });
