import mongoose from 'mongoose';
import dotenv from 'dotenv'; // Explicitly import dotenv

dotenv.config(); // Load environment variables

const connectionToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to the database successfully!`.cyan.underline); 
    } catch (error) {
        console.log(error);
    }
};

export { connectionToDB }; 
