import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI?.toString() || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to database");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
