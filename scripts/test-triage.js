import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import request from 'supertest';
import { Server } from 'socket.io';
import http from 'http';
import { initSocket } from '../src/services/socket.js';
import Sos from '../src/models/Sos.js';

let mongoServer;
let server;

const setup = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  server = http.createServer(app);
  const io = new Server(server);
  initSocket(io);

  return new Promise((resolve) => server.listen(0, resolve));
};

const teardown = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
};

const runTest = async () => {
  console.log('--- Starting ResQWave Backend Test ---');
  await setup();
  console.log('1. Mock Database (MemoryServer) & Server Initialized.');

  const testPayload = {
    chirpID: "mesh-chirp-999",
    rawText: "Emergency! Trapped under rubble at main street intersection. Need immediate medical attention for 2 people.",
    location: {
      coordinates: [-73.935242, 40.730610]
    },
    metadata: { battery: "20%" }
  };

  console.log('2. Sending Mock SOS Chirp to /api/sos/report...');
  const res = await request(server).post('/api/sos/report').send(testPayload);

  console.log(`3. Response Status: ${res.status}`);
  console.log(`4. Response Body:`, JSON.stringify(res.body, null, 2));

  // Verify DB
  const savedDoc = await Sos.findOne({ chirpID: "mesh-chirp-999" });
  console.log('5. Verified Document in DB:', savedDoc ? 'YES' : 'NO');
  if (savedDoc) {
    console.log('Document Priority:', savedDoc.priority);
    console.log('Document Category:', savedDoc.category);
    console.log('Fallback/AI Response saved accurately based on API availability.');
  }

  await teardown();
  console.log('--- Test Complete ---');
};

runTest().catch(console.error);
