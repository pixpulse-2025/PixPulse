import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Artwork from '../models/Artwork.js';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const sampleArtworks = [
    {
        title: "Neon Cybercity",
        description: "A futuristic cityscape bathed in neon lights.",
        category: "Visual Art",
        priceType: "Paid",
        price: 25,
        licenseType: "Commercial",
        tags: ["cyberpunk", "city", "neon"],
        fileUrl: "/uploads/sample1.jpg",
        previewUrl: "https://images.unsplash.com/photo-1515630278258-407f66498911?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Abstract Waves",
        description: "Flowing abstract shapes in blue and purple.",
        category: "Visual Art",
        priceType: "Free",
        price: 0,
        licenseType: "Personal",
        tags: ["abstract", "blue", "waves"],
        fileUrl: "/uploads/sample2.jpg",
        previewUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Lo-Fi Beats Vol. 1",
        description: "Chill beats for studying and relaxing.",
        category: "Audio",
        priceType: "Paid",
        price: 15,
        licenseType: "Commercial",
        tags: ["lofi", "music", "chill"],
        fileUrl: "/uploads/sample_audio.mp3",
        previewUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Nature Soundscapes",
        description: "High quality recordings of rain and forest sounds.",
        category: "Audio",
        priceType: "Free",
        price: 0,
        licenseType: "Personal",
        tags: ["nature", "sounds", "relax"],
        fileUrl: "/uploads/rain.mp3",
        previewUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Glitch Transition Pack",
        description: "10 high energy glitch transitions for video editors.",
        category: "Video/Animation",
        priceType: "Paid",
        price: 40,
        licenseType: "Extended Commercial",
        tags: ["vfx", "glitch", "video"],
        fileUrl: "/uploads/glitch.mp4",
        previewUrl: "https://images.unsplash.com/photo-1535016120720-40c6874c3b1c?auto=format&fit=crop&w=800&q=80"
    }
];

const seedData = async () => {
    try {
        await connectDB();

        // Find a user to assign artworks to (or create one)
        let artist = await User.findOne({ email: 'admin@pixpulse.com' });
        if (!artist) {
            console.log('Creating demo artist...');
            artist = await User.create({
                name: "Demo Artist",
                email: "demo@pixpulse.com",
                password: "password123",
                role: "artist"
            });
        }

        console.log(`Seeding data for artist: ${artist.name}`);

        // clear existing (optional, maybe safe to keep)
        // await Artwork.deleteMany({}); 

        const artworksWithArtist = sampleArtworks.map(art => ({
            ...art,
            artist: artist._id
        }));

        await Artwork.insertMany(artworksWithArtist);

        console.log('Artworks seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
