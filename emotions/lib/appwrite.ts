import { Client, Account } from 'react-native-appwrite';

const client = new Client();
const account = new Account(client);


client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67e69028003ce5b90fe1')
    .setPlatform('com.newral.emotions');

export { client, account };