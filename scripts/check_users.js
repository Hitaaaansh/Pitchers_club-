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

  const usersRes = await client.query(`
    SELECT id, email, created_at, last_sign_in_at 
    FROM auth.users;
  `);

  console.log("\n--- Users in auth.users ---");
  if (usersRes.rows.length === 0) {
    console.log("No users found in auth.users database! Please create one in Supabase Dashboard.");
  } else {
    usersRes.rows.forEach((row) => {
      console.log(`- Email: ${row.email}`);
      console.log(`  ID: ${row.id}`);
      console.log(`  Created: ${row.created_at}`);
      console.log(`  Last Sign In: ${row.last_sign_in_at}`);
    });
  }

  await client.end();
}

main().catch(console.error);
