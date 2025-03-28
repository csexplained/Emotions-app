import { Client, Account } from 'react-native-appwrite';

const client = new Client();
const account = new Account(client);

// Initialize with your Appwrite project details
client
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API endpoint
    .setProject('67e69028003ce5b90fe1')              // From Appwrite dashboard
    .setPlatform('emotions.app')                 // Your app bundle ID

export { client, account };