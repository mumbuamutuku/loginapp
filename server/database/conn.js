import mongoose from 'mongoose';
import ENV from '../config.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

async function connect(){
    const mongodb = await MongoMemoryServer.create();
    const getUri = mongodb.getUri();
    
    mongoose.set('strictQuery', true);
    //const db = await mongoose.connect(getUri);
    const db = await mongoose.connect(ENV.ATLAS_URI);
    console.log(`MongoDB Connected: ${db.connection.host}`);
    return db;
}

export default connect;