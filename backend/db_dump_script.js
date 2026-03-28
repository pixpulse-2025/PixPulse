import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// Force load env from backend/.env
dotenv.config({ path: './.env' });

const MONGO_URI = process.env.MONGO_URI;

async function run() {
    try {
        console.log("Connecting to:", MONGO_URI);
        await mongoose.connect(MONGO_URI);
        
        const artworkId = '69a7bfbc3a81dd35b67ae814';
        
        // Define schemas manually if needed or import models
        const artworkSchema = new mongoose.Schema({ artist: mongoose.Schema.Types.ObjectId }, { strict: false });
        const Artwork = mongoose.model('Artwork', artworkSchema);
        
        const art = await Artwork.findById(artworkId);
        
        const orderSchema = new mongoose.Schema({ user: mongoose.Schema.Types.ObjectId, items: Array }, { strict: false });
        const Order = mongoose.model('Order', orderSchema);
        
        const orders = await Order.find({ "items.artwork": new mongoose.Types.ObjectId(artworkId) });
        
        const userSchema = new mongoose.Schema({}, { strict: false });
        const User = mongoose.model('User', userSchema);
        
        const users = await User.find({}, { _id: 1, name: 1, email: 1, role: 1 });

        const result = {
            targetArtwork: art,
            relatedOrders: orders,
            allUsers: users
        };

        fs.writeFileSync('db_dump.json', JSON.stringify(result, null, 2));
        console.log("Dump created");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
