OmniTicks Backend API Specification (NestJS)
Overview
This document specifies the backend API requirements for the OmniTicks admin panel. The backend should be implemented using NestJS with TypeScript, PostgreSQL (or MongoDB), and JWT authentication.

Technology Stack Recommendations
Framework: NestJS
Language: TypeScript
Database: PostgreSQL with TypeORM (or MongoDB with Mongoose)
Authentication: JWT (Access + Refresh tokens)
Validation: class-validator, class-transformer
File Upload: Multer (for ImageKit integration)
Email: Nodemailer
SMS: Twilio (or similar)
WhatsApp: Twilio WhatsApp API
Database Models
User Model
{
  id: string (UUID)
  email: string (unique)
  password: string (hashed)
  name: string
  phone?: string
  isAdmin: boolean
  isBlocked: boolean
  createdAt: Date
  updatedAt: Date
}
Product Model
{
  id: string (UUID)
  metaTitle: string (unique)
  metaDescription: string
  title: string
  slug: string (unique, indexed)
  description: string
  features?: string
  originalPrice: number
  offerPrice: number
  brandName: string
  warranty: boolean
  withOgBox: boolean
  ogBoxPrice?: number
  images: string[] (URLs)
  video?: string (URL)
  stock: number
  tagIds: string[] (references Tag)
  categoryIds: string[] (references Category)
  createdAt: Date
  updatedAt: Date
}
Tag Model
{
  id: string (UUID)
  name: string
  slug: string (unique)
  description?: string
  createdAt: Date
  updatedAt: Date
}
Category Model
{
  id: string (UUID)
  name: string
  slug: string (unique)
  description?: string
  createdAt: Date
  updatedAt: Date
}
Order Model
{
  id: string (UUID)
  orderNumber: string (unique, auto-generated)
  userId: string (reference User)
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: 'pending' | 'shipped' | 'delivered' | 'returned' | 'refund'
  trackingNumber?: string
  shippingAddress: Address
  paymentStatus: 'paid' | 'failed' | 'pending'
  paymentMethod: string
  createdAt: Date
  updatedAt: Date
}
OrderItem
{
  id: string
  productId: string
  productTitle: string
  productImage: string
  quantity: number
  price: number
  total: number
}
Wishlist Model
{
  id: string (UUID)
  userId: string (reference User)
  productId: string (reference Product)
  createdAt: Date
}
Cart Model
{
  id: string (UUID)
  userId: string (reference User)
  productId: string (reference Product)
  quantity: number
  createdAt: Date
  updatedAt: Date
}

Address Model
{
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}
API Endpoints
Authentication
POST /api/auth/admin/login
Admin login endpoint

Request Body:

{
  "email": "admin@omniticks.com",
  "password": "password123",
  "isAdmin": true
}
Response:

{
  "user": {
    "id": "uuid",
    "email": "admin@omniticks.com",
    "name": "Admin User",
    "isAdmin": true,
    "role": "admin"
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
Validation:

Email must be valid
Password minimum 6 characters
isAdmin must be true for admin login
POST /api/auth/refresh
Refresh access token

Request Body:

{
  "refreshToken": "refresh-token"
}
Response:

{
  "accessToken": "new-jwt-token",
  "refreshToken": "new-refresh-token"
}
POST /api/auth/logout
Logout and invalidate tokens

Headers: Authorization: Bearer {token}

Response: 204 No Content

GET /api/auth/me
Get current user

Headers: Authorization: Bearer {token}

Response:

{
  "id": "uuid",
  "email": "admin@omniticks.com",
  "name": "Admin User",
  "isAdmin": true,
  "role": "admin"
}
Products
GET /api/products
Get all products with pagination, search, and filters

Query Parameters:

page (number, default: 1)
perPage (number, default: 10)
search (string, optional) - searches in title, slug, brandName
searchFields (string, optional) - comma-separated fields
sortBy (string, optional) - field to sort by
sortOrder ('asc' | 'desc', optional)
status (string, optional) - filter by status
category (string, optional) - filter by category ID
brand (string, optional) - filter by brand name
Response:

{
  "data": [
    {
      "id": "uuid",
      "metaTitle": "Luxury Watch",
      "metaDescription": "Description",
      "title": "Rolex Submariner",
      "slug": "rolex-submariner",
      "description": "Product description",
      "features": "Feature list",
      "originalPrice": 50000,
      "offerPrice": 45000,
      "brandName": "Rolex",
      "warranty": true,
      "withOgBox": true,
      "ogBoxPrice": 2000,
      "images": ["url1", "url2"],
      "video": "video-url",
      "stock": 10,
      "tagIds": ["tag-id-1"],
      "categoryIds": ["cat-id-1"],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 10,
    "total": 100,
    "totalPages": 10
  }
}
GET /api/products/:id
Get single product

Response: Single product object

POST /api/products
Create new product

Headers: Authorization: Bearer {token}

Request Body:

{
  "metaTitle": "Unique meta title",
  "metaDescription": "Meta description",
  "title": "Product Title",
  "slug": "product-slug",
  "description": "Description",
  "features": "Features",
  "originalPrice": 50000,
  "offerPrice": 45000,
  "brandName": "Brand",
  "warranty": true,
  "withOgBox": true,
  "ogBoxPrice": 2000,
  "images": ["url1", "url2"],
  "video": "video-url",
  "stock": 10,
  "tagIds": ["tag-id"],
  "categoryIds": ["cat-id"]
}
Validation:

metaTitle must be unique
slug must be unique and match pattern: ^[a-z0-9]+(?:-[a-z0-9]+)*$
images array must have at least 1 item
tagIds must have at least 1 item
categoryIds must have at least 1 item
Response: Created product object

PATCH /api/products/:id
Update product

Headers: Authorization: Bearer {token}

Request Body: Partial product object

Response: Updated product object

DELETE /api/products/:id
Delete product

Headers: Authorization: Bearer {token}

Response: 204 No Content

PATCH /api/products/:id/stock
Update product stock

Headers: Authorization: Bearer {token}

Request Body:

{
  "stock": 20
}
Response: Updated product object

Tags
GET /api/tags
Get all tags with pagination

Query Parameters: Same as products (page, perPage, search, etc.)

Response:

{
  "data": [
    {
      "id": "uuid",
      "name": "For Her",
      "slug": "for-her",
      "description": "Description",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
GET /api/tags/:id
Get single tag

POST /api/tags
Create tag

Request Body:

{
  "name": "For Her",
  "slug": "for-her",
  "description": "Optional description"
}
PATCH /api/tags/:id
Update tag

DELETE /api/tags/:id
Delete tag

Categories
GET /api/categories
Get all categories with pagination

Response: Same structure as tags

GET /api/categories/:id
Get single category

POST /api/categories
Create category

Request Body:

{
  "name": "Men",
  "slug": "men",
  "description": "Optional description"
}
PATCH /api/categories/:id
Update category

DELETE /api/categories/:id
Delete category

Orders
GET /api/orders
Get all orders with pagination and filters

Query Parameters:

Standard pagination params
status - filter by order status
paymentStatus - filter by payment status
startDate - filter by date range
endDate - filter by date range
Response:

{
  "data": [
    {
      "id": "uuid",
      "orderNumber": "ORD-2024-0001",
      "userId": "user-id",
      "userName": "John Doe",
      "userEmail": "john@example.com",
      "items": [
        {
          "id": "item-id",
          "productId": "product-id",
          "productTitle": "Product",
          "productImage": "image-url",
          "quantity": 2,
          "price": 1000,
          "total": 2000
        }
      ],
      "subtotal": 2000,
      "tax": 360,
      "shipping": 100,
      "total": 2460,
      "status": "pending",
      "trackingNumber": null,
      "shippingAddress": {
        "street": "123 Main St",
        "city": "Mumbai",
        "state": "Maharashtra",
        "zipCode": "400001",
        "country": "India"
      },
      "paymentStatus": "paid",
      "paymentMethod": "card",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
GET /api/orders/:id
Get single order with full details

PATCH /api/orders/:id/status
Update order status

Request Body:

{
  "status": "shipped"
}
Valid statuses: pending, shipped, delivered, returned, refund

PATCH /api/orders/:id/tracking
Assign tracking number

Request Body:

{
  "trackingNumber": "TRACK123456"
}
POST /api/orders/:id/cancel
Cancel order

Request Body:

{
  "reason": "Customer requested cancellation"
}
POST /api/orders/:id/refund
Process refund

Request Body:

{
  "amount": 2460,
  "reason": "Product defect"
}
GET /api/orders/:id/invoice
Download order invoice

Response: PDF file (blob)

Users
GET /api/users
Get all users with pagination

Query Parameters: Standard pagination + search

Response:

{
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210",
      "isBlocked": false,
      "totalOrders": 5,
      "totalSpent": 12500,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
GET /api/users/:id
Get single user

PATCH /api/users/:id/block
Block user

Response: Updated user object

PATCH /api/users/:id/unblock
Unblock user

Response: Updated user object

GET /api/users/:id/orders
Get user's order history

Query Parameters: Standard pagination

Response: Orders array with pagination

Wishlist & Cart Analytics
GET /api/analytics/wishlist
Get popular wishlist items

Response:

{
  "data": [
    {
      "productId": "uuid",
      "productTitle": "Product",
      "productImage": "url",
      "count": 25,
      "stock": 10
    }
  ]
}
GET /api/analytics/cart
Get popular cart items

Response: Same structure as wishlist

Dashboard
GET /api/dashboard/stats
Get dashboard statistics

Query Parameters:

period ('today' | 'month' | 'year')
Response:

{
  "totalSales": {
    "today": 50000,
    "month": 500000
  },
  "totalOrders": 150,
  "pendingOrders": 25,
  "deliveredOrders": 100,
  "cancelledOrders": 5,
  "revenue": [
    { "date": "2024-01-01", "amount": 5000 },
    { "date": "2024-01-02", "amount": 7000 }
  ],
  "lowStockProducts": [
    {
      "id": "uuid",
      "title": "Product",
      "stock": 2,
      "image": "url"
    }
  ],
  "topSellingProducts": [
    {
      "id": "uuid",
      "title": "Product",
      "totalSold": 50,
      "revenue": 250000,
      "image": "url"
    }
  ]
}
Notifications
POST /api/notifications/email
Send email notification

Request Body:

{
  "to": "user@example.com",
  "subject": "Order Shipped",
  "template": "order-shipped",
  "data": {
    "orderNumber": "ORD-2024-0001",
    "trackingNumber": "TRACK123"
  }
}
POST /api/notifications/sms
Send SMS notification

Request Body:

{
  "to": "+919876543210",
  "message": "Your order has been shipped"
}
POST /api/notifications/whatsapp
Send WhatsApp notification

Request Body:

{
  "to": "+919876543210",
  "message": "Your order has been shipped",
  "template": "order_shipped"
}
Implementation Guidelines
1. Authentication & Authorization
Use JWT with access tokens (15 min expiry) and refresh tokens (7 days expiry)
Store refresh tokens in database for revocation
Implement @UseGuards(JwtAuthGuard) for protected routes
Implement @Roles('admin') decorator for admin-only routes
Hash passwords with bcrypt (salt rounds: 10)
2. Validation
Use class-validator decorators in DTOs
Implement ValidationPipe globally
Return detailed validation errors
3. Error Handling
Use NestJS exception filters
Return consistent error format:
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
4. Pagination
Default page size: 10
Max page size: 100
Return total count and total pages
5. Search
Implement full-text search using database features
Support multiple fields
Case-insensitive search
6. File Upload
Use Multer for file handling
Validate file types (images: jpg, png, webp; videos: mp4, webm)
Max file size: Images 5MB, Videos 50MB
Return file URLs after upload to ImageKit
7. Database Indexes
Index frequently queried fields: slug, email, orderNumber
Index foreign keys
Index search fields
8. Security
Implement rate limiting
Use helmet for security headers
Sanitize user inputs
Implement CORS properly
Use environment variables for secrets
Example NestJS Module Structure
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── dto/
│   ├── guards/
│   └── strategies/
├── products/
│   ├── products.controller.ts
│   ├── products.service.ts
│   ├── products.module.ts
│   ├── dto/
│   └── entities/
├── orders/
├── users/
├── tags/
├── categories/
├── notifications/
├── analytics/
└── common/
    ├── filters/
    ├── interceptors/
    ├── pipes/
    └── decorators/
Testing
Write unit tests for services
Write e2e tests for controllers
Test authentication flows
Test validation
Test error handling
Deployment
Use environment variables for configuration
Implement health check endpoint: GET /health
Use PM2 or Docker for process management
Set up logging (Winston or Pino)
Implement monitoring (Sentry, DataDog, etc.)