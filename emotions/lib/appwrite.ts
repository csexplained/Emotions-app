import { Databases, Client, Account, Query } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Make sure to add your endpoint
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '')
    .setPlatform(process.env.EXPO_PUBLIC_APP_PLATFORM || 'com.newral.emotions');

const account = new Account(client);
const databases = new Databases(client);

export { Query };

export const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || ""
export const COLLECTIONS = {
    ACTIVITIES: 'activities',
    EMOTION_TYPES: 'emotion_types',
} as const;
export { client, account, databases };