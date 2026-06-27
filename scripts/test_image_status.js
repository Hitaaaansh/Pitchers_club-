async function checkUrl(name, url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    console.log(`${name}: HTTP Status = ${res.status}`);
  } catch (err) {
    console.error(`Error fetching ${name}:`, err.message);
  }
}

async function main() {
  await checkUrl(
    "Aryan Kumar",
    "https://lh3.googleusercontent.com/d/1TzqE7yuq__73Rgs8Xs24KAPYdwbWB2GS",
  );
  await checkUrl(
    "Parth Shukla",
    "https://lh3.googleusercontent.com/d/1aPqKtkXmErh6biGnF7ZbqONwH69QG6vb",
  );
  await checkUrl(
    "Priyal Saxena",
    "https://lh3.googleusercontent.com/d/1k6F0WolrErWCQygcpCHN1QufVNv6MFl_",
  );
}

main();
