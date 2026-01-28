import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Artwork from '../models/Artwork.js';
import connectDB from '../config/db.js';

dotenv.config();

const listArtworks = async () => {
    try {
        await connectDB();
        const artworks = await Artwork.find({});
        console.log(`Found ${artworks.length} artworks:`);
        artworks.forEach(a => {
            console.log(`- [${a.category}] ${a.title} (Tags: ${a.tags})`);
        });
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

listArtworks();
