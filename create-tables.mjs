// Direct table creation script for blog_posts, projects, site_settings
import "dotenv/config";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const statements = [
  `CREATE TABLE IF NOT EXISTS \`blog_posts\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`slug\` varchar(255) NOT NULL,
    \`title\` varchar(500) NOT NULL,
    \`summary\` text NOT NULL,
    \`content\` longtext NOT NULL,
    \`category\` varchar(100) NOT NULL DEFAULT 'Engineering',
    \`tags\` json,
    \`published\` boolean NOT NULL DEFAULT false,
    \`readTime\` varchar(50),
    \`publishedAt\` timestamp,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`blog_posts_id\` PRIMARY KEY(\`id\`),
    CONSTRAINT \`blog_posts_slug_unique\` UNIQUE(\`slug\`)
  )`,
  `CREATE TABLE IF NOT EXISTS \`projects\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`slug\` varchar(255) NOT NULL,
    \`title\` varchar(500) NOT NULL,
    \`summary\` text NOT NULL,
    \`description\` text,
    \`category\` enum('open-source','professional','personal') NOT NULL DEFAULT 'personal',
    \`technologies\` json,
    \`githubUrl\` varchar(500),
    \`liveUrl\` varchar(500),
    \`isFeatured\` boolean NOT NULL DEFAULT false,
    \`isPrivate\` boolean NOT NULL DEFAULT false,
    \`stars\` int DEFAULT 0,
    \`sortOrder\` int DEFAULT 0,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`projects_id\` PRIMARY KEY(\`id\`),
    CONSTRAINT \`projects_slug_unique\` UNIQUE(\`slug\`)
  )`,
  `CREATE TABLE IF NOT EXISTS \`site_settings\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`key\` varchar(100) NOT NULL,
    \`value\` text,
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`site_settings_id\` PRIMARY KEY(\`id\`),
    CONSTRAINT \`site_settings_key_unique\` UNIQUE(\`key\`)
  )`,
];

for (const sql of statements) {
  await connection.execute(sql);
  const tableName = sql.match(/CREATE TABLE IF NOT EXISTS `(\w+)`/)?.[1];
  console.log(`✓ Created table: ${tableName}`);
}

await connection.end();
console.log("\n✅ Tables created successfully!\n");
