const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

async function main() {
  const sql = fs.readFileSync(path.join(__dirname, "migrate.sql"), "utf8");
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query(sql);
  await client.end();
  console.log("Migration applied");
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
