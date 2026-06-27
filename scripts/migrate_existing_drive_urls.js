import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Error: DATABASE_URL environment variable is not defined.");
  console.error("Please define it in your .env file or environment.");
  process.exit(1);
}

function cleanGoogleDriveUrl(url) {
  if (!url) return url;

  const fileDRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  let match = url.match(fileDRegex);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }

  const openIdRegex = /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/;
  match = url.match(openIdRegex);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }

  const ucIdRegex = /[?&]id=([a-zA-Z0-9_-]+)/;
  if (url.includes("drive.google.com/uc") || url.includes("drive.google.com/open")) {
    match = url.match(ucIdRegex);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
  }

  return url;
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

  const res = await client.query("SELECT id, name, photo_url FROM public.team;");

  for (const row of res.rows) {
    if (row.photo_url) {
      const cleaned = cleanGoogleDriveUrl(row.photo_url);
      if (cleaned !== row.photo_url) {
        console.log(`Updating ${row.name}: ${row.photo_url} -> ${cleaned}`);
        await client.query("UPDATE public.team SET photo_url = $1 WHERE id = $2;", [
          cleaned,
          row.id,
        ]);
      }
    }
  }

  console.log("Migration complete!");
  await client.end();
}

main().catch(console.error);
