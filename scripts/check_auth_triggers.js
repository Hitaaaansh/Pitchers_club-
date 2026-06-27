import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Error: DATABASE_URL environment variable is not defined.");
  console.error("Please define it in your .env file or environment.");
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function main() {
  await client.connect();
  console.log("Connected to PostgreSQL!");

  // Query triggers on auth.users
  const triggersRes = await client.query(`
    SELECT tgname, tgenabled, tgtype, proname 
    FROM pg_trigger 
    JOIN pg_proc ON tgfoid = pg_proc.oid
    WHERE tgrelid = 'auth.users'::regclass;
  `);

  console.log("\n--- Triggers on auth.users ---");
  triggersRes.rows.forEach((row) => {
    console.log(`- Trigger: ${row.tgname}`);
    console.log(`  Enabled: ${row.tgenabled}`);
    console.log(`  Function: ${row.proname}`);
  });

  await client.end();
}

main().catch(console.error);
