import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

async function addTestMoney() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const result = await mongoose.connection.db.collection('users').updateMany(
            { walletBalance: { $exists: false } },
            { $set: { walletBalance: 500 } }
        );

        console.log(`Updated ${result.modifiedCount} users with $500 test money`);

        // Also update users who have walletBalance of 0 (already existing)
        const result2 = await mongoose.connection.db.collection('users').updateMany(
            { walletBalance: 0 },
            { $set: { walletBalance: 500 } }
        );
        console.log(`Reset ${result2.modifiedCount} users with $0 balance to $500`);

        await mongoose.disconnect();
        console.log('Done!');
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

addTestMoney();
