import { Client, Account, Databases, Storage, Query, ID, type Models } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);
export { Query, ID, Models };


const activityCollectionId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ACTIVITYCOLLECTION;
const appwriteEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const appwriteProjectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

export const COLLECTIONS = {
    EMOTION_TYPES: 'emotion_types',
    ACTIVITIES: 'activities',
} as const;

// Extend the Appwrite Document interface properly
export interface AppwriteDocument extends Models.Document {
    [key: string]: any;
}