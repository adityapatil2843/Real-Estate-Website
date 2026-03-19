import mongoose from "mongoose";

// Define the async function with const and arrow syntax
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
};


// Graceful shutdown — respect the machine
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🛑 MongoDB disconnected (SIGINT)");
  process.exit(0);
});

export default connectToDB;
