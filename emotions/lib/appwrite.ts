import { Databases, Client, Account } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Make sure to add your endpoint
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '')
    .setPlatform(process.env.EXPO_PUBLIC_APP_PLATFORM || 'com.newral.emotions');

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };