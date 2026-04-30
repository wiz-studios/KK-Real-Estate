# Admin Quick Start Guide

## System Overview

KK Real Estate has a **verified property listing system** where:
- **Only admins can add properties** (no user self-submission)
- Properties start in "pending" status
- Admins verify properties after physical inspection
- Verified properties become visible to all users

## Getting Started

### 1. Admin Login
1. Navigate to `/admin/login`
2. Enter admin credentials
3. You'll be taken to the admin dashboard

### 2. Add a New Property

#### Step 1: Click "Add Property"
- From dashboard: Click the yellow "Add Property" button
- Or navigate directly to `/admin/properties/new`

#### Step 2: Fill Property Form
Required fields marked with `*`:
- **Title**: e.g., "Beautiful 3BR Bungalow in Kilimani"
- **Property Type**: Select from dropdown (bungalow, apartment, villa, etc.)
- **Address**: Full street address
- **City**: Nairobi, Kisumu, etc.
- **Price**: In KES
- **Total Rooms**: Total number of rooms
- **Bedrooms**: Number of bedrooms
- **Bathrooms**: Number of bathrooms

Optional fields:
- County, Latitude/Longitude for mapping
- Plot size, built area, construction year
- Description with more details
- Living rooms, kitchens count

#### Step 3: Submit
Click "Create Property" - property goes into "Pending" status

### 3. Verify a Property

#### From Dashboard
1. Click "Pending" filter to see properties awaiting verification
2. Click on a property in the list
3. You'll be taken to the verify page

#### On Verify Page
1. **Review all details**
   - Title, location, price
   - Room count and types
   - Specifications
   - Description

2. **Make Decision**
   - Select "Verify" (approve) or "Reject" (decline)
   - Optionally add notes explaining your decision

3. **Click Button**
   - "Verify Property" to approve
   - "Reject Property" to decline
   - Property is immediately published (if verified) or marked rejected

### 4. Manage Properties

#### From Dashboard
- **View all properties**: Dashboard shows all at once
- **Filter by status**: All, Pending, Verified, Rejected
- **See stats**: Total, pending count, verified count, rejected count
- **View property details**: Click on property in list
- **Edit property**: Click edit icon (coming soon)
- **Delete property**: Click trash icon (with confirmation)

#### Status Indicators
- ✓ **Verified** (green) - Live and visible to users
- ⏱ **Pending** (yellow) - Awaiting admin verification
- ✗ **Rejected** (red) - Declined, not visible to users

## Important Rules

### What Admins CAN Do
✓ Create properties after site verification  
✓ Edit property details  
✓ Verify/approve properties  
✓ Reject properties with notes  
✓ Delete properties  
✓ View all properties  
✓ See verification audit logs  

### What Users CANNOT Do
✗ Create properties (form not accessible)  
✗ Edit properties  
✗ Verify properties  
✗ See unverified properties  
✗ See admin dashboard  
✗ See other users' data  

### What Users CAN Do
✓ Browse verified properties  
✓ Search and filter properties  
✓ View property details  
✓ Submit inquiries  
✓ View property specs and amenities  

## Common Tasks

### Task: Add a Bungalow Property

1. Go to `/admin/properties/new`
2. Fill form:
   - Title: "4BR Bungalow - Kilimani"
   - Type: Bungalow
   - Address: "123 Kiambu Road"
   - City: "Nairobi"
   - County: "Nairobi"
   - Price: "15000000"
   - Bedrooms: 4
   - Bathrooms: 3
   - Total Rooms: 7
3. Click "Create Property"
4. Navigate to verify page
5. Select "Verify" and click button
6. Property is now live!

### Task: Reject a Property

1. From dashboard, see pending properties
2. Click property to review
3. Check details - if something is wrong:
4. Click "Reject" radio button
5. Add notes: e.g., "Price doesn't match site visit"
6. Click "Reject Property"
7. Property marked as rejected

### Task: Find Properties in Nairobi

1. Filter by "Verified" status
2. Dashboard shows all verified properties
3. Or use filters in properties list

## Dashboard Statistics

The dashboard shows you at a glance:
- **Total Properties**: All properties (all statuses)
- **Pending Verification**: Properties awaiting your review
- **Verified**: Live properties visible to users
- **Rejected**: Properties you've declined

## Property Types Available

- Bungalow
- Flatroof
- Townhouse
- Apartment
- Penthouse
- Villa
- Mansion
- Cottage
- Duplex
- Studio

## Tips & Best Practices

1. **Always verify on site** - Don't add properties without seeing them
2. **Be accurate with prices** - Double-check pricing with owner
3. **Add descriptions** - Help users understand the property better
4. **Use consistent formatting** - Makes data cleaner
5. **Add notes when rejecting** - Helps track why properties were declined
6. **Check coordinates** - If adding, verify lat/long is accurate
7. **Review amenities** - Consider adding custom features/amenities

## Troubleshooting

### Can't access admin dashboard
- Check you're logged in as admin (not regular user)
- Admin login is at `/admin/login`
- Check your user role in database

### Property not appearing for users
- Is it marked as "verified"?
- Is `is_available` set to true?
- Check verification status in admin dashboard

### Forgot admin password
- Contact system administrator
- May need database access to reset

### Want to add custom amenities
- Use the "Description" field for complex amenities
- Database supports flexible features table (future enhancement)

## Keyboard Shortcuts

- Tab: Navigate form fields
- Enter: Submit forms
- Esc: Cancel/Close modals (coming soon)

## Need Help?

1. Check this guide first
2. See PROPERTY_MANAGEMENT_SYSTEM.md for detailed docs
3. Review API endpoints in docs
4. Check database schema if needed

---

**Last Updated**: April 29, 2026  
**System Version**: 1.0  
**Status**: Production Ready
