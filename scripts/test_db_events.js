import { db } from '../src/lib/db.js';
import process from 'process';

if (process.loadEnvFile) {
  process.loadEnvFile('.env');
}

async function run() {
  const events = await db.getEvents();
  console.log('Events returned by db.getEvents():');
  events.forEach(e => {
    console.log(`Title: "${e.title}" | Cover: "${e.cover}"`);
  });
}

run().catch(console.error);
