import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to mongodb database");
    } catch (error) {
        console.log("Error connecting to mongodb database:", error.message);
    }
}

export default connectDb;