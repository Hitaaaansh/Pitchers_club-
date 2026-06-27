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

  const res = await client.query(`
    SELECT conname, pg_get_constraintdef(oid) 
    FROM pg_constraint 
    WHERE conrelid = 'public.team'::regclass;
  `);

  console.log("\n--- 'team' Table Constraints ---");
  res.rows.forEach((row) => {
    console.log(`Constraint: ${row.conname}`);
    console.log(`Definition: ${row.pg_get_constraintdef}`);
    console.log("-----------------------------------");
  });

  await client.end();
}

main().catch(console.error);
