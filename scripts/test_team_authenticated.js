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
  console.log("Connected to PostgreSQL as superuser!");

  // Switch role to authenticated
  await client.query(`SET ROLE authenticated;`);
  console.log("Switched session role to 'authenticated'!");

  // Try to insert a team member
  try {
    const res = await client.query(
      `
      INSERT INTO public.team (name, role, domain, year, bio, photo_url, tier)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `,
      [
        "Test Authenticated",
        "Head of Tech",
        "Technical",
        "Third Year",
        "Testing RLS from authenticated role",
        "https://example.com/photo.jpg",
        "Core team",
      ],
    );
    console.log("Insert Success! Row:", res.rows[0]);
  } catch (err) {
    console.error("Insert Error as authenticated:", err);
  }

  await client.end();
}

main().catch(console.error);
