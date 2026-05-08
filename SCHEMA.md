# Food Ordering App – Database Schema (Markdown)

> This document represents the **official database schema design** for the Food Ordering App.
> It is structured as companies write it: clear, reviewable, and suitable for Agile development.

---

## 1️⃣ Conventions

- **Primary Keys (PK)**: UUID, named `id` by default
- **Foreign Keys (FK)**: Explicit references with `ON DELETE` rules
- **Timestamps**: `created_at`, `updated_at`
- **Booleans**: `is_active`, `is_available`, `isPrimary`
- **Enums**: `status` or `role` fields constrained via CHECK
- **Geography**: PostGIS GEOGRAPHY type (SRID 4326) for points/polygons

---

## 2️⃣ Tables Overview

| Table              | Purpose                               |
| ------------------ | ------------------------------------- |
| users              | Customers and admins                  |
| categories         | Product categories                    |
| products           | Menu items                            |
| product_categories | MTM table Product ↔ Category          |
| product_variants   | Variants of products (sizes, options) |
| product_extras     | Optional extras per product           |
| product_images     | Optional product images               |
| carts              | Shopping carts per user               |
| cart_items         | Items in carts                        |
| orders             | Customer orders                       |
| order_items        | Items in orders (snapshots)           |
| order_notes        | Optional notes per order              |
| payments           | Payment records (mock/Stripe)         |
| delivery_zones     | Delivery areas (geospatial)           |
| admin_actions      | Optional audit log                    |

---

## 3️⃣ Detailed Tables

### users

- `id` UUID PK
- `email` TEXT UNIQUE NOT NULL
- `password_hash` TEXT NOT NULL
- `role` ENUM('USER','ADMIN')
- `phone` TEXT
- `address` TEXT
- `created_at` TIMESTAMP DEFAULT now()
- `updated_at` TIMESTAMP DEFAULT now()

**Notes:** All users, including admin, are here.

---

### categories

- `id` UUID PK
- `name` TEXT NOT NULL
- `slug` TEXT UNIQUE NOT NULL
- `isActive` BOOLEAN DEFAULT TRUE
- `sortOrder` INT DEFAULT 0
- `created_at` TIMESTAMP DEFAULT now()
- `updated_at` TIMESTAMP DEFAULT now()

**Relations:**

- `productCategories` → MTM with products

**Notes:** Only active categories are shown in menu.

---

### product_categories

- `product_id` UUID FK -> products(id)
- `category_id` UUID FK -> categories(id)
- **PK:** (product_id, category_id)
- `isPrimary` BOOLEAN DEFAULT FALSE
- `sortOrder` INT DEFAULT 0
- `created_at` TIMESTAMP DEFAULT now()
- `updated_at` TIMESTAMP DEFAULT now()

**Notes:** MTM table to link products to categories. Each product can have multiple categories.

---

### products

- `id` UUID PK
- `name` TEXT NOT NULL
- `description` TEXT
- `slug` TEXT UNIQUE NOT NULL
- `isAvailable` BOOLEAN DEFAULT TRUE
- `created_at` TIMESTAMP DEFAULT now()
- `updated_at` TIMESTAMP DEFAULT now()

**Relations:**

- `variants` → ProductVariant[]
- `extras` → ProductExtra[]
- `images` → ProductImage[]
- `categories` → ProductCategory[]

**Notes:** Product availability controls menu visibility; price is on variants.

---

### product_variants

- `id` UUID PK
- `name` TEXT NOT NULL (e.g., Small, Large)
- `price` NUMERIC(10,2) NOT NULL
- `isAvailable` BOOLEAN DEFAULT TRUE
- `sku` TEXT UNIQUE NULLABLE
- `product_id` UUID FK -> products(id)
- `created_at` TIMESTAMP DEFAULT now()
- `updated_at` TIMESTAMP DEFAULT now()

**Notes:** Each variant has a price and optional SKU. Product must have at least one variant.

---

### product_extras

- `id` UUID PK
- `name` TEXT NOT NULL
- `price` NUMERIC(10,2) NOT NULL
- `isAvailable` BOOLEAN DEFAULT TRUE
- `sku` TEXT UNIQUE NULLABLE
- `product_id` UUID FK -> products(id)
- `created_at` TIMESTAMP DEFAULT now()
- `updated_at` TIMESTAMP DEFAULT now()

**Notes:** Optional extras that can be added to product orders.

---

### product_images

- `id` UUID PK
- `url` TEXT NOT NULL
- `isPrimary` BOOLEAN DEFAULT FALSE
- `product_id` UUID FK -> products(id)
- `created_at` TIMESTAMP DEFAULT now()
- `updated_at` TIMESTAMP DEFAULT now()

**Notes:** Optional images for products; one image can be primary.

---

### carts

- `id` UUID PK
- `user_id` UUID FK -> users(id) NULLABLE
- `updated_at` TIMESTAMP DEFAULT now()

**Notes:** Anonymous carts allowed.

---

### cart_items

- `id` UUID PK
- `cart_id` UUID FK -> carts(id)
- `product_id` UUID FK -> products(id)
- `quantity` INTEGER NOT NULL > 0
- UNIQUE(cart_id, product_id)
- `created_at` TIMESTAMP DEFAULT now()
- `updated_at` TIMESTAMP DEFAULT now()

**Notes:** Prevent duplicate product entries.

---

### cart_items_extra

- `id` UUID PK
- `cart_id` UUID FK -> carts(id)
- `extra_id` UUID FK -> products(id)
- `quantity` INTEGER NOT NULL > 0
- UNIQUE(cart_id, extra_id)
- `created_at` TIMESTAMP DEFAULT now()
- `updated_at` TIMESTAMP DEFAULT now()

**Notes:** Prevent duplicate product entries.

---

### orders

- `id` UUID PK
- `user_id` UUID FK -> users(id)
- `total_price` NUMERIC(10,2)
- `status` ENUM('pending','accepted','preparing','ready','completed','canceled')
- `delivery_location` GEOGRAPHY(Point,4326)
- `created_at` TIMESTAMP DEFAULT now()

**Notes:** Geospatial point allows map validation and distance queries.

---

### order_items

- `id` UUID PK
- `order_id` UUID FK -> orders(id)
- `product_name_snapshot` TEXT
- `unit_price_snapshot` NUMERIC(10,2)
- `quantity` INTEGER > 0
- `created_at` TIMESTAMP DEFAULT now()
- `updated_at` TIMESTAMP DEFAULT now()

**Notes:** Snapshot ensures historical accuracy even if products change.

---

### order_notes (optional)

- `id` UUID PK
- `order_id` UUID FK -> orders(id)
- `note` TEXT
- `created_at` TIMESTAMP DEFAULT now()
- `updated_at` TIMESTAMP DEFAULT now()

**Notes:** Free text notes for delivery instructions.

---

### payments

- `id` UUID PK
- `order_id` UUID FK -> orders(id)
- `amount` NUMERIC(10,2)
- `status` ENUM('pending','paid','failed')
- `provider` TEXT
- `created_at` TIMESTAMP DEFAULT now()

**Notes:** Mockable; provider field allows future real integrations.

---

### delivery_zones

- `id` UUID PK
- `name` TEXT
- `area` GEOGRAPHY(POLYGON,4326)
- `isActive` BOOLEAN DEFAULT TRUE
- `created_at` TIMESTAMP DEFAULT now()
- `updated_at` TIMESTAMP DEFAULT now()

**Notes:** Validate if a delivery location is within service area.

---

### admin_actions (optional)

- `id` UUID PK
- `admin_id` UUID FK -> users(id)
- `action` TEXT
- `entity` TEXT
- `created_at` TIMESTAMP DEFAULT now()

**Notes:** Audit log for accountability.

---

## 4️⃣ Indexes & Performance Notes

- Index `category_id` on product_categories
- GIST index on delivery_zones.area for geospatial queries
- GIST index on orders.delivery_location for fast nearby queries

---

## 5️⃣ Verification Against Requirements

- ✅ Covers all pages (Menu, Product Details, Cart, Orders, Admin, etc.)
- ✅ Covers all API routes (CRUD, Orders, Payments, Delivery)
- ✅ Supports geospatial delivery validation
- ✅ Optional features (Images, Notes, Audit log) included
- ✅ Ready for Agile incremental development

**Conclusion:** Fully supports core and optional features. Ready to serve as **source of truth**.
