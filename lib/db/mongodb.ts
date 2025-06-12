import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongoose:
    | {
        conn: mongoose.Connection | null;
        promise: Promise<mongoose.Connection> | null;
      }
    | undefined;
}

if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    // Enhanced options for production reliability
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Limit maximum connections in the pool
      minPoolSize: 2, // Keep at least 2 connections open
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      serverSelectionTimeoutMS: 10000, // Fail fast if a server can't be selected
      heartbeatFrequencyMS: 30000, // Check server health every 30 seconds
      retryWrites: true, // Retry write operations on network errors
      retryReads: true, // Retry read operations on network errors
    };

    console.log("Connecting to MongoDB...");

    cached!.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log("MongoDB connected successfully");

        // Set up connection error handlers
        mongooseInstance.connection.on("error", (err) => {
          console.error("MongoDB connection error:", err);
        });

        mongooseInstance.connection.on("disconnected", () => {
          console.warn("MongoDB disconnected. Attempting to reconnect...");
          cached!.conn = null;
          cached!.promise = null;
        });

        // Log when successfully reconnected
        mongooseInstance.connection.on("reconnected", () => {
          console.log("MongoDB reconnected successfully");
        });

        cached!.conn = mongooseInstance.connection;
        return mongooseInstance.connection;
      });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    console.error("MongoDB connection failed:", e);
    throw e;
  }

  return cached!.conn;
}

export default dbConnect;
