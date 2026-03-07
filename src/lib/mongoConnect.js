import { MongoClient, ServerApiVersion } from "mongodb";

let client;

const getMongoUri = () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("Missing environment variable: MONGODB_URI");
    }
    return uri;
};

const getDbName = () => {
    const dbName = process.env.DB_NAME;
    if (!dbName) {
        throw new Error("Missing environment variable: DB_NAME");
    }
    return dbName;
};

export const getMongoClient = () => {
    if (!client) {
        client = new MongoClient(getMongoUri(), {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });
    }
    return client;
};

export const connectToDatabase = async () => {
    try {
        const client = getMongoClient();
        await client.connect();
        console.log("Connected to MongoDB");
        return client.db(getDbName());
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};

export const disconnectFromDatabase = async () => {
    try {
        if (!client) return;
        await client.close();
        console.log("Disconnected from MongoDB");
        client = undefined;
    } catch (error) {
        console.error("Error disconnecting from MongoDB:", error);
        throw error;
    }
};
