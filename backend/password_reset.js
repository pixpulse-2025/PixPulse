import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

async function reset() {
    await mongoose.connect(process.env.MONGO_URI);
    const userSchema = new mongoose.Schema({ password: String }, { strict: false });
    const User = mongoose.model('User', userSchema);
    
    // pixpulsetest@gmail.com
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    await User.findOneAndUpdate({ email: 'pixpulsetest@gmail.com' }, { password: hashedPassword });
    console.log("Password reset for pixpulsetest@gmail.com to password123");
    process.exit(0);
}

reset().catch(console.error);
