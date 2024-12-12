import mongoose, { Schema, Document, Model } from 'mongoose';

/* Define the TypeScript interface for a blacklisted token */
interface IBlacklistedToken extends Document {
    token: string;
    createdAt: Date;
  }
  
  /* Create the Mongoose schema for the BlacklistedToken */
  const BlacklistSchema: Schema<IBlacklistedToken> = new mongoose.Schema({
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 3600 }, // Token expires from blacklist after 1 hour
  });
  
  /* Export the BlacklistedToken model with the IBlacklistedToken interface */
  const BlacklistedToken: Model<IBlacklistedToken> = mongoose.model<IBlacklistedToken>(
    "BlacklistedToken",
    BlacklistSchema
  );
  
  export default BlacklistedToken;