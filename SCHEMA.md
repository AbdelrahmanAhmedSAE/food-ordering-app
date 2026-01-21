# Food Ordering App – Database Schema (Markdown)

> This document represents the **official database schema design** for the Food Ordering App.
> It is structured as companies write it: clear, reviewable, and suitable for Agile development.

---

## 1️⃣ Conventions

- **Primary Keys (PK)**: UUID, named `id` by default
- **Foreign Keys (FK)**: Explicit references with `ON DELETE` rules
- **Timestamps**: `created_at`, `updated_at`
- **Booleans**: `is_active`, `is_available`
- **Enums**: `status` or `role` fields constrained via CHECK
- **Geography**: PostGIS GEOGRAPHY type (SRID 4326) for points/polygons

---

## 2️⃣ Tables Overview

| Table          | Purpose                       |
| -------------- | ----------------------------- |
| users          | Customers and admins          |
| categories     | Product categories            |
| products       | Menu items                    |
| product_images | Optional product images       |
| carts          | Shopping carts per user       |
| cart_items     | Items in carts                |
| orders         | Customer orders               |
| order_items    | Items in orders (snapshots)   |
| order_notes    | Optional notes per order      |
| payments       | Payment records (mock/Stripe) |
| delivery_zones | Delivery areas (geospatial)   |
| admin_actions  | Optional audit log            |

---

## 3️⃣ Detailed Tables

### users

- `id` UUID PK
- `email` TEXT UNIQUE NOT NULL
- `password_hash` TEXT NOT NULL
- `role` ENUM('USER','ADMIN')
- `phone` TEXT
- `address` TEXT
- `created_at` TIMESTAMP
- `updated_at` TIMESTAMP

**Notes:** All users, including admin, are here.

---

### categories

- `id` UUID PK
- `name` TEXT NOT NULL
- `is_active` BOOLEAN DEFAULT TRUE

**Notes:** Only active categories are shown in menu.

---

### products

- `id` UUID PK
- `name` TEXT NOT NULL
- `price` NUMERIC(10,2) NOT NULL
- `description` TEXT
- `is_available` BOOLEAN DEFAULT TRUE
- `category_id` UUID FK -> categories(id)

**Notes:** Product availability controls menu visibility.

---

### product_images (optional)

- `id` UUID PK
- `product_id` UUID FK -> products(id)
- `url` TEXT NOT NULL

**Notes:** Optional images for portfolio-quality design.

---

### carts

- `id` UUID PK
- `user_id` UUID FK -> users(id) nullable
- `updated_at` TIMESTAMP

**Notes:** Anonymous carts allowed (nullable user_id).

---

### cart_items

- `id` UUID PK
- `cart_id` UUID FK -> carts(id)
- `product_id` UUID FK -> products(id)
- `quantity` INTEGER > 0
- UNIQUE(cart_id, product_id)

**Notes:** Prevent duplicate product entries.

---

### orders

- `id` UUID PK
- `user_id` UUID FK -> users(id)
- `total_price` NUMERIC(10,2)
- `status` ENUM('pending','accepted','preparing','ready','completed','canceled')
- `delivery_location` GEOGRAPHY(Point,4326)
- `created_at` TIMESTAMP

**Notes:** Geospatial point allows map validation and distance queries.

---

### order_items

- `id` UUID PK
- `order_id` UUID FK -> orders(id)
- `product_name_snapshot` TEXT
- `unit_price_snapshot` NUMERIC(10,2)
- `quantity` INTEGER > 0

**Notes:** Snapshot ensures historical accuracy even if products change.

---

### order_notes (optional)

- `id` UUID PK
- `order_id` UUID FK -> orders(id)
- `note` TEXT

**Notes:** Free text notes for delivery instructions.

---

### payments

- `id` UUID PK
- `order_id` UUID FK -> orders(id)
- `amount` NUMERIC(10,2)
- `status` ENUM('pending','paid','failed')
- `provider` TEXT
- `created_at` TIMESTAMP

**Notes:** Mockable; provider field allows future real integrations.

---

### delivery_zones

- `id` UUID PK
- `name` TEXT
- `area` GEOGRAPHY(POLYGON,4326)
- `is_active` BOOLEAN DEFAULT TRUE

**Notes:** Allows validation if a delivery location is within service area.

---

### admin_actions (optional)

- `id` UUID PK
- `admin_id` UUID FK -> users(id)
- `action` TEXT
- `entity` TEXT
- `created_at` TIMESTAMP

**Notes:** Audit log of admin actions for accountability.

---

## 4️⃣ Indexes & Performance Notes

- Index category_id on products
- GIST index on delivery_zones.area for geospatial queries
- GIST index on orders.delivery_location for fast nearby queries

---

## 5️⃣ Verification Against Requirements

- ✅ Covers all pages (Menu, Product Details, Cart, Orders, Admin, etc.)
- ✅ Covers all API routes (CRUD, Orders, Payments, Delivery)
- ✅ Supports geospatial delivery validation
- ✅ Optional features (Images, Notes, Audit log) included
- ✅ Ready for Agile incremental development

**Conclusion:** Schema fully supports the described features of the project, both core and portfolio-enhancing. It is **ready to serve as source of truth**.
