# PostgreSQL Cheatsheet for Beginners

## Quick Access Commands

### Connect to Database (via Docker)

```bash
# Interactive shell (recommended for multiple queries)
docker exec -it makebelieve-postgres psql -U postgres -d makebelieve_imprints

# One-off query
docker exec -it makebelieve-postgres psql -U postgres -d makebelieve_imprints -c "YOUR_SQL_HERE"
```

### Exit PostgreSQL Shell

```sql
\q
```

---

## Docker Container Management

### Start/Stop PostgreSQL Container

```bash
# Start container
docker start makebelieve-postgres

# Stop container
docker stop makebelieve-postgres

# Restart container
docker restart makebelieve-postgres

# Check if container is running
docker ps

# View container logs
docker logs makebelieve-postgres

# View last 50 lines of logs
docker logs --tail 50 makebelieve-postgres

# Follow logs in real-time
docker logs -f makebelieve-postgres
```

### Remove and Recreate Container (CAUTION: Deletes all data!)

```bash
# Stop and remove container
docker stop makebelieve-postgres
docker rm makebelieve-postgres

# Recreate with same settings
docker run -d \
  --name makebelieve-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=makebelieve_imprints \
  -p 5432:5432 \
  postgres:16-alpine
```

---

## Database Quick Commands (in psql shell)

### Show All Databases

```sql
\l
```

### Connect to Different Database

```sql
\c makebelieve_imprints
```

### Show All Tables

```sql
\dt
```

### Describe Table Structure

```sql
\d users
\d products
\d orders
```

### Show Table with Column Details

```sql
\d+ users
```

### List All Schemas

```sql
\dn
```

### Show Current Database

```sql
SELECT current_database();
```

### Show Current User

```sql
SELECT current_user;
```

---

## Viewing Data (SELECT Queries)

### View All Records

```sql
-- All users
SELECT * FROM users;

-- All products
SELECT * FROM products;

-- All orders
SELECT * FROM orders;
```

### View Specific Columns

```sql
-- Users: just email and name
SELECT email, "firstName", "lastName" FROM users;

-- Products: name and price
SELECT name, price FROM products;
```

### View Recent Records

```sql
-- Last 5 users registered
SELECT * FROM users ORDER BY "createdAt" DESC LIMIT 5;

-- Last 10 orders
SELECT * FROM orders ORDER BY "createdAt" DESC LIMIT 10;
```

### Count Records

```sql
-- Total users
SELECT COUNT(*) FROM users;

-- Total products
SELECT COUNT(*) FROM products;

-- Active users only
SELECT COUNT(*) FROM users WHERE "isActive" = true;
```

### Search/Filter Data

```sql
-- Find user by email
SELECT * FROM users WHERE email = 'test@example.com';

-- Find users with specific first name
SELECT * FROM users WHERE "firstName" = 'John';

-- Find verified users
SELECT * FROM users WHERE "isEmailVerified" = true;

-- Find admin users
SELECT * FROM users WHERE role = 'admin';

-- Search by partial email (contains @gmail)
SELECT * FROM users WHERE email LIKE '%@gmail%';
```

### View Related Data (JOINS)

```sql
-- Orders with user information
SELECT
  orders.id,
  orders."orderNumber",
  orders.status,
  users.email,
  users."firstName",
  users."lastName"
FROM orders
JOIN users ON orders."userId" = users.id
ORDER BY orders."createdAt" DESC;

-- Products with category names
SELECT
  products.name,
  products.price,
  categories.name as category_name
FROM products
JOIN categories ON products."categoryId" = categories.id;
```

---

## Creating Data (INSERT)

### Add New User (Manual - not recommended, use API instead)

```sql
INSERT INTO users (id, email, password, "firstName", "lastName", role)
VALUES (
  gen_random_uuid(),
  'newuser@example.com',
  '$2b$10$hashedpasswordhere',
  'John',
  'Doe',
  'customer'
);
```

### Add New Category

```sql
INSERT INTO categories (id, name, slug, description)
VALUES (
  gen_random_uuid(),
  'Business Cards',
  'business-cards',
  'Professional business card printing'
);
```

### Add New Product

```sql
INSERT INTO products (id, name, slug, description, price, "categoryId")
VALUES (
  gen_random_uuid(),
  'Standard Business Cards',
  'standard-business-cards',
  '500 business cards on premium card stock',
  49.99,
  'category-id-here'
);
```

---

## Updating Data (UPDATE)

### Update User Email

```sql
UPDATE users
SET email = 'newemail@example.com'
WHERE id = 'user-id-here';
```

### Verify User Email

```sql
UPDATE users
SET "isEmailVerified" = true
WHERE email = 'test@example.com';
```

### Update Product Price

```sql
UPDATE products
SET price = 59.99
WHERE id = 'product-id-here';
```

### Update Multiple Columns

```sql
UPDATE users
SET
  "firstName" = 'Jane',
  "lastName" = 'Smith',
  phone = '+1234567890'
WHERE email = 'user@example.com';
```

---

## Deleting Data (DELETE)

### Delete Specific User

```sql
-- CAUTION: This permanently deletes!
DELETE FROM users WHERE email = 'test@example.com';
```

### Delete All Test Users

```sql
-- CAUTION: Deletes multiple records!
DELETE FROM users WHERE email LIKE '%test%';
```

### Delete Old Records

```sql
-- Delete users older than 30 days who never verified
DELETE FROM users
WHERE "isEmailVerified" = false
AND "createdAt" < NOW() - INTERVAL '30 days';
```

---

## Useful Analysis Queries

### Count Users by Role

```sql
SELECT role, COUNT(*) as total
FROM users
GROUP BY role;
```

### Count Verified vs Unverified Users

```sql
SELECT
  "isEmailVerified",
  COUNT(*) as total
FROM users
GROUP BY "isEmailVerified";
```

### Average Product Price

```sql
SELECT AVG(price) as average_price FROM products;
```

### Most Recent Registrations

```sql
SELECT
  email,
  "firstName",
  "lastName",
  "createdAt"
FROM users
ORDER BY "createdAt" DESC
LIMIT 10;
```

### Orders by Status

```sql
SELECT
  status,
  COUNT(*) as total,
  SUM("totalAmount") as total_revenue
FROM orders
GROUP BY status;
```

---

## Backup and Restore

### Backup Database

```bash
# Backup to file
docker exec -it makebelieve-postgres pg_dump -U postgres makebelieve_imprints > backup.sql

# Backup with compression
docker exec -it makebelieve-postgres pg_dump -U postgres makebelieve_imprints | gzip > backup.sql.gz
```

### Restore Database

```bash
# Restore from file
docker exec -i makebelieve-postgres psql -U postgres makebelieve_imprints < backup.sql

# Restore from compressed file
gunzip -c backup.sql.gz | docker exec -i makebelieve-postgres psql -U postgres makebelieve_imprints
```

---

## Troubleshooting

### Check Database Size

```sql
SELECT
  pg_database.datname,
  pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
WHERE datname = 'makebelieve_imprints';
```

### Check Table Sizes

```sql
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### View Active Connections

```sql
SELECT * FROM pg_stat_activity WHERE datname = 'makebelieve_imprints';
```

### Kill Stuck Queries

```sql
-- Get process IDs
SELECT pid, query, state FROM pg_stat_activity WHERE state = 'active';

-- Kill specific process
SELECT pg_terminate_backend(12345); -- replace 12345 with actual PID
```

### Reset Auto-Increment Sequences

```sql
-- If IDs get out of sync
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
```

---

## Development Helpers

### Clear All Data (Keep Tables)

```sql
-- CAUTION: Deletes ALL data!
TRUNCATE users, products, categories, orders, order_items, payments, designs, addresses, reviews CASCADE;
```

### Drop and Recreate Tables

```bash
# Let Sequelize recreate tables (backend must be running)
# Tables will be auto-created when you restart the backend server
docker exec -it makebelieve-postgres psql -U postgres makebelieve_imprints -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

### View Last 10 Queries Executed

```sql
SELECT
  pid,
  now() - pg_stat_activity.query_start AS duration,
  query,
  state
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY query_start DESC
LIMIT 10;
```

---

## pgAdmin Quick Tips

### Execute Query

- **F5** or click ▶️ button

### Format SQL

- Select query text → Right-click → **Format SQL**

### Export Results to CSV

- After running query → Click **Download** icon → Choose CSV

### View Query History

- Click **History** tab (bottom panel)

### Auto-complete

- Start typing table/column name → **Ctrl+Space** for suggestions

---

## Common Patterns

### Find User and Their Orders

```sql
SELECT
  u.email,
  u."firstName",
  u."lastName",
  COUNT(o.id) as total_orders,
  SUM(o."totalAmount") as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o."userId"
GROUP BY u.id, u.email, u."firstName", u."lastName"
ORDER BY total_spent DESC NULLS LAST;
```

### Products with Review Ratings

```sql
SELECT
  p.name,
  p.price,
  COUNT(r.id) as review_count,
  ROUND(AVG(r.rating), 2) as avg_rating
FROM products p
LEFT JOIN reviews r ON p.id = r."productId"
GROUP BY p.id, p.name, p.price
ORDER BY avg_rating DESC NULLS LAST;
```

### Recent Activity Dashboard

```sql
-- Users registered today
SELECT COUNT(*) as new_users_today
FROM users
WHERE "createdAt"::date = CURRENT_DATE;

-- Orders placed today
SELECT COUNT(*) as orders_today, SUM("totalAmount") as revenue_today
FROM orders
WHERE "createdAt"::date = CURRENT_DATE;
```

---

## Safety Tips

✅ **DO:**

- Always backup before major changes
- Use `WHERE` clause with UPDATE/DELETE
- Test queries with `SELECT` first before UPDATE/DELETE
- Use transactions for multiple related changes
- Use `LIMIT` when exploring data

❌ **DON'T:**

- Run `DELETE FROM table;` without WHERE (deletes everything!)
- Run `DROP TABLE` without backup
- Store passwords in plain text
- Share database credentials
- Run untested queries on production

---

## Quick Reference Card

```sql
-- Navigation
\l              -- List databases
\c dbname       -- Connect to database
\dt             -- List tables
\d tablename    -- Describe table
\q              -- Quit

-- Basic Queries
SELECT * FROM table;                    -- All data
SELECT col1, col2 FROM table;          -- Specific columns
SELECT * FROM table WHERE col = 'val'; -- Filter
SELECT * FROM table LIMIT 10;          -- First 10 rows
SELECT COUNT(*) FROM table;            -- Count rows

-- Sorting & Filtering
ORDER BY column ASC/DESC               -- Sort
WHERE column = 'value'                 -- Exact match
WHERE column LIKE '%value%'            -- Partial match
WHERE column IN ('val1', 'val2')       -- Multiple values
WHERE column IS NULL                   -- Null check

-- Common Functions
NOW()                  -- Current timestamp
CURRENT_DATE          -- Current date
COUNT(*)              -- Count rows
SUM(column)           -- Sum values
AVG(column)           -- Average
MAX(column)           -- Maximum
MIN(column)           -- Minimum
```

---

## Your Database Schema Quick Reference

**Tables:**

- `users` - User accounts (authentication)
- `products` - Product catalog
- `categories` - Product categories
- `orders` - Customer orders
- `order_items` - Individual items in orders
- `payments` - Payment transactions
- `designs` - Custom design uploads
- `addresses` - Shipping/billing addresses
- `reviews` - Product reviews

**Key Relationships:**

- User → Orders (one-to-many)
- User → Addresses (one-to-many)
- User → Reviews (one-to-many)
- Product → Category (many-to-one)
- Product → Reviews (one-to-many)
- Order → User (many-to-one)
- Order → OrderItems (one-to-many)
- Order → Payment (one-to-one)

---

## Need Help?

**PostgreSQL Official Docs:** https://www.postgresql.org/docs/  
**pgAdmin Docs:** https://www.pgadmin.org/docs/  
**SQL Tutorial:** https://www.w3schools.com/sql/

**Quick Test:**

```bash
# Verify everything works
docker exec -it makebelieve-postgres psql -U postgres -d makebelieve_imprints -c "SELECT COUNT(*) as total_users FROM users;"
```

Good luck! 🚀
