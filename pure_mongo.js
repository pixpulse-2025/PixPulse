import { MongoClient, ObjectId } from 'mongodb';
import fs from 'fs';

async function run() {
  const client = await MongoClient.connect('mongodb://127.0.0.1:27017');
  const db = client.db('pixpulse');
  
  const artworkId = new ObjectId('69a7bfbc3a81dd35b67ae814');
  
  const artwork = await db.collection('artworks').findOne({ _id: artworkId });
  const orders = await db.collection('orders').find({ "items.artwork": artworkId }).toArray();
  
  const result = {
    artwork: artwork,
    orders: orders
  };
  
  fs.writeFileSync('mongo_debug.json', JSON.stringify(result, null, 2));
  
  await client.close();
  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
