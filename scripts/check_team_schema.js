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

  const columnsRes = await client.query(`
    SELECT column_name, data_type, is_nullable 
    FROM information_schema.columns 
    WHERE table_name = 'team' AND table_schema = 'public';
  `);

  console.log("\n--- 'team' Table Columns ---");
  columnsRes.rows.forEach((col) => {
    console.log(`- ${col.column_name}: ${col.data_type} (Nullable: ${col.is_nullable})`);
  });

  await client.end();
}

main().catch(console.error);
