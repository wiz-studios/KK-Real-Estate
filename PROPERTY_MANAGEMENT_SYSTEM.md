# Admin-Verified Property Management System

## Overview

KK Real Estate features a comprehensive property management system where **only administrators can add properties after physical verification**. Regular users cannot create property listings—instead, they browse verified properties added and verified by the admin team.

## Key Features

### 1. Admin-Only Property Creation
- Only authenticated admins can access the property creation form
- Users attempting to access `/admin/properties/new` are automatically redirected to login
- Each property starts in "pending" verification status
- Properties are invisible to users until verified

### 2. Three-Step Verification Workflow
1. **Admin creates property** - Fills in all details after physical site visit
2. **Admin verifies details** - Reviews the information and marks as verified/rejected
3. **Property goes live** - Verified properties become visible to all users

### 3. Flexible Property Data Model
- **Property Types**: Bungalow, Flatroof, Townhouse, Apartment, Penthouse, Villa, Mansion, Cottage, Duplex, Studio
- **Room Details**: Total rooms, bedrooms, bathrooms, living rooms, kitchens
- **Specifications**: Plot size, built area, construction year
- **Location Data**: Address, city, county, latitude, longitude
- **Media**: Support for multiple images per property
- **Features Table**: Flexible key-value pairs for amenities (e.g., "Has Balcony", "Garden", "Swimming Pool")

### 4. Role-Based Access Control
- **Admin Role**: Full CRUD access, verification capabilities, audit logs
- **User Role**: Read-only access to verified properties, can submit inquiries

## System Architecture

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  role user_role ('admin', 'user'),
  is_active BOOLEAN
)
```

#### Properties Table
```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  property_type property_type,
  address VARCHAR(500),
  city VARCHAR(100),
  price DECIMAL(15, 2),
  bedrooms INTEGER,
  bathrooms INTEGER,
  verification_status ('pending', 'verified', 'rejected'),
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  added_by UUID REFERENCES users(id),
  images JSONB,
  created_at TIMESTAMP
)
```

#### Property Features Table
```sql
CREATE TABLE property_features (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  feature_name VARCHAR(100),
  feature_value VARCHAR(255),
  category VARCHAR(50)
)
```

#### Verification Logs Table
```sql
CREATE TABLE verification_logs (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  admin_id UUID REFERENCES users(id),
  action VARCHAR(100),
  status verification_status,
  notes TEXT,
  verification_date TIMESTAMP
)
```

### Row-Level Security (RLS)

The database enforces role-based access through RLS policies:

1. **Public can view verified properties** - Only properties with `verification_status = 'verified'` and `is_available = true`
2. **Admins see all properties** - Can view pending, verified, and rejected listings
3. **Only admins can modify** - Insert, update, delete operations restricted to admin role
4. **Verification logs** - Audit trail visible only to admins

## API Endpoints

### Admin APIs (Require Authentication)

#### List Properties
```
GET /api/admin/properties?status=pending&page=1&pageSize=10
Headers: x-user-id: <admin_id>
Response: { success: true, data: Property[], pagination: {...} }
```

#### Create Property
```
POST /api/admin/properties
Headers: x-user-id: <admin_id>, Content-Type: application/json
Body: { title, description, propertyType, address, city, price, ... }
Response: { success: true, data: Property }
```

#### Get Property Details
```
GET /api/admin/properties/{id}
Headers: x-user-id: <admin_id>
Response: { success: true, data: Property }
```

#### Update Property
```
PUT /api/admin/properties/{id}
Headers: x-user-id: <admin_id>, Content-Type: application/json
Body: { updatedFields... }
Response: { success: true, data: Property }
```

#### Delete Property
```
DELETE /api/admin/properties/{id}
Headers: x-user-id: <admin_id>
Response: { success: true }
```

#### Verify Property
```
POST /api/admin/properties/{id}/verify
Headers: x-user-id: <admin_id>, Content-Type: application/json
Body: { status: 'verified' | 'rejected', notes: 'optional notes' }
Response: { success: true, data: { verificationStatus, verifiedAt, notes } }
```

### Public APIs (No Authentication)

#### List Verified Properties
```
GET /api/properties?city=Nairobi&propertyType=bungalow&minPrice=5000000&bedrooms=3&page=1
Response: { success: true, data: Property[], pagination: {...} }
```

#### Get Property Details
```
GET /api/properties/{id}
Response: { success: true, data: Property & { features: PropertyFeature[] } }
```

### Authentication APIs

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { success: true, data: User }
Cookies: auth_token, user_role
```

#### Logout
```
POST /api/auth/logout
Response: { success: true }
Cookies: auth_token, user_role (cleared)
```

#### Get Current User
```
GET /api/auth/me
Response: { success: true, data: User }
```

## Frontend Pages

### Admin Pages
- `/admin/login` - Admin login page
- `/admin/dashboard` - Main dashboard with property statistics
- `/admin/properties/new` - Create new property
- `/admin/properties/[id]/edit` - Edit property (coming soon)
- `/admin/properties/[id]/verify` - Verify/reject property after creation

### Public Pages
- `/` - Homepage
- `/properties` - Browse all verified properties with filters
- `/properties/[id]` - Property details page
- `/admin/login` - Admin access (redirects non-admins)

## User Roles

### Admin Role
- Create properties via form with full details
- Edit property information
- Delete properties
- Verify properties (mark as verified/rejected)
- View all properties regardless of status
- View verification audit logs
- Access admin dashboard with statistics

### User Role
- Browse only verified properties
- Filter properties by city, type, price, bedrooms
- Search properties
- View property details with images and features
- Submit inquiries for properties
- Cannot create, edit, or delete properties

## Security Features

1. **Authentication**
   - Bcrypt password hashing
   - Session-based authentication via secure HTTP-only cookies
   - User ID validation on admin endpoints

2. **Authorization**
   - Role-based access control (RBAC)
   - Row-Level Security (RLS) at database level
   - Admin-only endpoints protected with `x-user-id` header validation

3. **Data Validation**
   - Required field validation on API endpoints
   - Input sanitization
   - Type checking for all data types

4. **Audit Trail**
   - Verification logs track all admin actions
   - Timestamp of verification
   - Notes for rejected properties
   - Admin identification

## Verification Workflow Example

### Scenario: Admin verifies a property

1. **Admin visits dashboard** (`/admin/dashboard`)
   - Sees "5 Pending Verification"
   - Filters to show only pending properties

2. **Admin clicks property**
   - Reviews all details: photos, specs, location, price
   - Confirms information matches physical site visit
   - Checks for any discrepancies

3. **Admin clicks "Verify"**
   - Redirected to `/admin/properties/[id]/verify`
   - Reviews all property data
   - Selects "Verify" and optionally adds notes
   - Clicks "Verify Property"

4. **System updates property**
   - Sets `verification_status = 'verified'`
   - Records `verified_by = admin_id` and `verified_at = now()`
   - Creates entry in `verification_logs` table
   - Property becomes visible to all users

5. **Users see property**
   - Property appears in `/properties` browse page
   - Shows on property cards with "Verified Property" badge
   - Searchable and filterable

## Property Type Categorization

The system supports diverse property types:
- **Single Units**: Bungalow, Studio, Apartment
- **Multi-Unit**: Duplex, Townhouse
- **Premium**: Villa, Mansion, Penthouse
- **Efficient**: Cottage, Flatroof

Each type displays consistently in dropdowns and filters throughout the application.

## Flexible Amenities/Features

Instead of hardcoded checkboxes, the `property_features` table allows:
- Custom feature names (e.g., "Swimming Pool", "Maid's Quarters", "Home Office")
- Feature values (e.g., "Yes/No", sizes, conditions)
- Category grouping (e.g., "Outdoor", "Security", "Utilities")
- Easy addition of new features without schema changes

Example:
```
Feature: "Has Balcony" -> Value: "Yes" -> Category: "Outdoor"
Feature: "Garden Size" -> Value: "200 sqm" -> Category: "Outdoor"
Feature: "Security Gate" -> Value: "Electric" -> Category: "Security"
```

## Next Steps / Future Enhancements

1. **Image Upload**
   - Integrate Vercel Blob for image storage
   - Multiple image gallery per property

2. **Advanced Filtering**
   - Map-based property search
   - Radius-based location search
   - Complex multi-criteria filtering

3. **Inquiry Management**
   - Admin dashboard to view user inquiries
   - Follow-up email templates
   - Inquiry assignment to agents

4. **Property Comparison**
   - Compare multiple properties side-by-side
   - Favorites/wishlist functionality

5. **Analytics**
   - Property view statistics
   - Most viewed properties
   - Inquiry conversion rates

6. **Integration**
   - WhatsApp integration for inquiries
   - Email notifications for new properties
   - SMS alerts for matching properties

## Testing the System

### Test Admin Login
1. Navigate to `/admin/login`
2. Use test credentials:
   - Email: `admin@kkestates.com`
   - Password: (Check database seed script)

### Test Property Creation
1. Log in as admin
2. Navigate to `/admin/dashboard`
3. Click "Add Property"
4. Fill in property details
5. Submit

### Test Verification
1. From dashboard, see pending properties
2. Click a pending property
3. Navigate to verify page
4. Review and approve/reject

### Test Public Browsing
1. Logout or open private browser
2. Navigate to `/properties`
3. Browse verified properties
4. Search and filter
5. Click property to view details

## Database Setup

### Running Migrations

```bash
# Install dependencies
pnpm install

# Run migration script
node scripts/migrate.js
```

### Seeding Initial Data

The `scripts/02_seed_admin.sql` file contains initial user data. Update with actual passwords before running in production.

## Environment Variables

Required:
```
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
SUPABASE_URL=<your_supabase_url>
SUPABASE_SERVICE_ROLE_KEY=<your_service_key>
POSTGRES_URL=<your_postgres_url>
```

## Performance Considerations

1. **Database Indexes** - Created on:
   - `verification_status` for filtering
   - `city` and `property_type` for searches
   - `added_by` and `verified_by` for admin queries

2. **Pagination** - All list endpoints support pagination (default: 10 items/page)

3. **View Count** - Incremented on property detail access (non-blocking)

## Conclusion

This system provides a robust, secure, and scalable property management platform where admins maintain control over property listings through a verification workflow, ensuring data quality and preventing spam/fraudulent listings.
