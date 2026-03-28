import mongoose from 'mongoose';
import Artwork from './src/models/Artwork.js';
import User from './src/models/User.js';

const URI = 'mongodb://127.0.0.1:27017/pixpulse'; // Use correct URI

async function debug() {
    try {
        await mongoose.connect(URI);
        const artworkId = '69a7bfbc3a81dd35b67ae814';
        const artwork = await Artwork.findById(artworkId);
        
        if (!artwork) {
            console.log("Artwork not found");
        } else {
            console.log("Artwork:", {
                _id: artwork._id,
                title: artwork.title,
                artistId: artwork.artist,
            });
            
            const artist = await User.findById(artwork.artist);
            console.log("Artist:", artist ? { _id: artist._id, name: artist.name, role: artist.role } : "Artist not found");
        }
        
        // Find all users
        const users = await User.find({}, { _id: 1, name: 1, email: 1, role: 1 });
        console.log("Existing Users:", users);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debug();
