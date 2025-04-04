import { Client, Account } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite API endpoint
  .setProject("67eeb8800030ee4d3fc0"); // Replace with your Project ID

const account = new Account(client);

export { account };
