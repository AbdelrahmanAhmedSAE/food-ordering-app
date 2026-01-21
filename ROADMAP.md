# Food Ordering App – Feature-Oriented Agile Roadmap (Agile)

> Principle: **Each Sprint delivers ONE complete feature**.
> No sprint starts if it depends on an unfinished one.
> Every sprint ends with a **clear, testable goal**.

---

## Sprint 0 – Project Foundation

**Feature:** Application Skeleton

### Goal

Have a running application with authentication basics, ready to safely build features on top of it.

### Scope

- Project structure (frontend + backend)
- Backend setup + database connection
- Frontend routing + base layout
- Basic authentication (register / login)

### Done When

- App starts without errors
- User can register and log in

---

## Sprint 1 – Menu Browsing

**Feature:** View Menu (Read-Only)

### Goal

Allow any user to browse the restaurant menu without interaction or state.

### Scope

**Backend**

- Categories table
- Products table
- GET /categories
- GET /products
- GET /products/:id

**Frontend**

- Home / Menu page
- Product Details page

### Done When

- User can see categories and products
- Product details are accessible

---

## Sprint 2 – Cart Management

**Feature:** Shopping Cart

### Goal

Enable users to build a cart by adding, removing, and updating products.

### Scope

**Backend**

- Carts table
- CartItems table
- GET /cart
- POST /cart/items
- PUT /cart/items/:id
- DELETE /cart/items/:id

**Frontend**

- Cart page
- Quantity management

### Done When

- Cart persists correctly
- User can fully manage cart items

---

## Sprint 3 – Order Creation

**Feature:** Place Order

### Goal

Convert a cart into a permanent order with price and product snapshots.

### Scope

**Backend**

- Orders table
- OrderItems table (snapshot logic)
- POST /orders

**Frontend**

- Checkout flow
- Order confirmation screen

### Done When

- Cart can be converted into an order
- Order data is immutable after creation

---

## Sprint 4 – Order Tracking

**Feature:** Order Status & History

### Goal

Allow users to track their current order and review past orders.

### Scope

**Backend**

- GET /orders/current
- GET /orders/history

**Frontend**

- Order status page
- Order history page

### Done When

- User can see current order status
- User can view previous orders

---

## Sprint 5 – Admin Authentication

**Feature:** Admin Access Control

### Goal

Introduce a secure separation between regular users and administrators.

### Scope

**Backend**

- Role-based authorization (ADMIN)
- Admin guards / middleware

**Frontend**

- Admin login page

### Done When

- Admin-only routes are protected
- Users cannot access admin features

---

## Sprint 6 – Product Management (Admin)

**Feature:** Manage Products

### Goal

Allow administrators to fully manage products in the system.

### Scope

**Backend**

- POST /admin/products
- PUT /admin/products/:id
- DELETE /admin/products/:id

**Frontend**

- Admin product management page (CRUD)

### Done When

- Admin can create, update, and delete products

---

## Sprint 7 – Category Management (Admin)

**Feature:** Manage Categories

### Goal

Allow administrators to manage product categories independently.

### Scope

**Backend**

- POST /admin/categories
- PUT /admin/categories/:id
- DELETE /admin/categories/:id

**Frontend**

- Admin category management page

### Done When

- Categories can be managed without affecting products incorrectly

---

## Sprint 8 – Order Management (Admin)

**Feature:** Admin Order Control

### Goal

Allow administrators to manage and progress order states.

### Scope

**Backend**

- GET /admin/orders
- PUT /admin/orders/:id/status

**Frontend**

- Admin orders dashboard

### Done When

- Admin can view and update order statuses

---

## Sprint 9 – Payment Flow (Mock)

**Feature:** Payments

### Goal

Simulate a real-world payment flow without external dependencies.

### Scope

**Backend**

- Payments table
- POST /payments/intent
- POST /payments/confirm
- Payment state machine

**Frontend**

- Mock payment UI

### Done When

- Orders have a clear payment state
- Payment flow is deterministic and testable

---

## Sprint 10 – Real-Time Order Updates

**Feature:** Live Order Updates

### Goal

Provide real-time feedback for order status changes.

### Scope

- SSE or WebSocket integration
- Real-time order status broadcasting

### Done When

- Order status updates without page refresh

---

## Sprint 11 – Delivery Validation

**Feature:** Delivery Location Validation

### Goal

Ensure orders can only be placed within supported delivery zones.

### Scope

**Backend**

- DeliveryZones table
- POST /delivery/validate-location

**Frontend**

- Location input / map validation

### Done When

- Orders outside delivery zones are rejected

---

## Sprint 12 – Admin Audit Log (Optional)

**Feature:** Audit Trail

### Goal

Track and review administrative actions for accountability.

### Scope

**Backend**

- AdminActions table
- Audit logging on admin operations

**Frontend**

- Admin audit log view (optional)

### Done When

- All admin actions are traceable

---

## Final Outcome

- Fully agile, feature-driven roadmap
- No hidden dependencies
- Portfolio-ready, production-grade architecture
