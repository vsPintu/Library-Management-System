import mongoose from "mongoose";

export const connectDatabaseUserAndBook = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string, {
      dbName: "rent_book_system",
    });
    console.log("Database Connected..");
  } catch (error) {
    console.log(error);
  }
};
