import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const uri = process.env.MONGO_URI as string;

if (!uri) {
    throw new Error('MONGO_URI is not defined in the .env file');
}

const client = new MongoClient(uri);

let db: Db;

export const connectToDatabase = async (): Promise<Db> => {
    if (!db) {
        try {
            await client.connect();
            console.log('Connected to MongoDB Atlas');
            db = client.db('admin');
        } catch (error) {
            console.error('Failed to connect to MongoDB Atlas', error);
            throw error;
        }
    }
    return db;
};
