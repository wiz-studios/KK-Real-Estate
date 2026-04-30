import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, requireAdmin } from '@/lib/auth';
import { ApiResponse, Property, PropertyInquirySummary } from '@/lib/types';
import { uploadPropertyImages } from '@/lib/property-images';

// GET - List all properties (admin only, includes all statuses)
export async function GET(request: NextRequest) {
  try {
    const adminId = request.headers.get('x-user-id');
    
    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse<null>,
        { status: 401 }
      );
    }

    const isAdmin = await requireAdmin(adminId);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' } as ApiResponse<null>,
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const status = searchParams.get('status');

    let query = supabaseAdmin.from('properties').select('*', { count: 'exact' });

    if (status) {
      query = query.eq('verification_status', status);
    }

    const from = (page - 1) * pageSize;
    query = query.range(from, from + pageSize - 1).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const formattedProperties = await enrichPropertiesWithInquiryData(
      data?.map(formatPropertyResponse) || [],
    );

    return NextResponse.json({
      success: true,
      data: formattedProperties,
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Server error' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

async function enrichPropertiesWithInquiryData(properties: Property[]) {
  if (properties.length === 0) {
    return properties;
  }

  const propertyIds = properties.map((property) => property.id);
  const { data: inquiries, error: inquiriesError } = await supabaseAdmin
    .from('property_inquiries')
    .select('property_id, user_id, message, phone, created_at')
    .in('property_id', propertyIds)
    .order('created_at', { ascending: false });

  if (inquiriesError || !inquiries) {
    return properties;
  }

  const userIds = [...new Set(inquiries.map((inquiry) => inquiry.user_id).filter(Boolean))];
  const { data: users } = userIds.length
    ? await supabaseAdmin.from('users').select('id, full_name, email, phone').in('id', userIds)
    : { data: [] as any[] };

  const userMap = new Map(
    (users || []).map((user) => [
      user.id,
      {
        name: user.full_name,
        email: user.email,
        phone: user.phone,
      },
    ]),
  );

  const inquiryMap = new Map<string, { inquiryCount: number; latestInquiry?: PropertyInquirySummary }>();

  for (const inquiry of inquiries) {
    const existingEntry = inquiryMap.get(inquiry.property_id) || { inquiryCount: 0 };
    existingEntry.inquiryCount += 1;

    if (!existingEntry.latestInquiry) {
      const user = userMap.get(inquiry.user_id);
      existingEntry.latestInquiry = {
        name: user?.name,
        email: user?.email,
        phone: inquiry.phone || user?.phone,
        message: inquiry.message,
        createdAt: inquiry.created_at,
      };
    }

    inquiryMap.set(inquiry.property_id, existingEntry);
  }

  return properties.map((property) => {
    const inquiryData = inquiryMap.get(property.id);
    return {
      ...property,
      inquiryCount: inquiryData?.inquiryCount || 0,
      latestInquiry: inquiryData?.latestInquiry,
    };
  });
}

// POST - Create new property (admin only, unverified until verified)
export async function POST(request: NextRequest) {
  try {
    const adminId = request.headers.get('x-user-id');
    
    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse<null>,
        { status: 401 }
      );
    }

    const isAdmin = await requireAdmin(adminId);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' } as ApiResponse<null>,
        { status: 403 }
      );
    }

    const formData = await request.formData();

    const title = String(formData.get('title') || '');
    const description = String(formData.get('description') || '');
    const propertyType = String(formData.get('propertyType') || '');
    const address = String(formData.get('address') || '');
    const city = String(formData.get('city') || '');
    const county = String(formData.get('county') || '');
    const latitude = String(formData.get('latitude') || '');
    const longitude = String(formData.get('longitude') || '');
    const price = String(formData.get('price') || '');
    const currency = String(formData.get('currency') || 'KES');
    const totalRooms = String(formData.get('totalRooms') || '');
    const bedrooms = String(formData.get('bedrooms') || '');
    const bathrooms = String(formData.get('bathrooms') || '');
    const livingRooms = String(formData.get('livingRooms') || '1');
    const kitchens = String(formData.get('kitchens') || '1');
    const plotSize = String(formData.get('plotSize') || '');
    const builtArea = String(formData.get('builtArea') || '');
    const constructionYear = String(formData.get('constructionYear') || '');
    const imageFiles = formData
      .getAll('images')
      .filter((value): value is File => value instanceof File && value.size > 0);

    // Validation
    if (!title || !address || !city || !propertyType || !price || !totalRooms || bedrooms === undefined || bathrooms === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    if (imageFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please upload at least one property image.' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const uploadedImages = await uploadPropertyImages(imageFiles);

    const { data, error } = await supabaseAdmin
      .from('properties')
      .insert([
        {
          title,
          description,
          property_type: propertyType,
          address,
          city,
          county,
          latitude,
          longitude,
          price: parseFloat(price),
          currency,
          total_rooms: parseInt(totalRooms),
          bedrooms: parseInt(bedrooms),
          bathrooms: parseInt(bathrooms),
          living_rooms: parseInt(livingRooms),
          kitchens: parseInt(kitchens),
          plot_size: plotSize,
          built_area: builtArea,
          construction_year: constructionYear ? parseInt(constructionYear) : null,
          images: uploadedImages,
          added_by: adminId,
          verification_status: 'pending',
          is_available: true
        }
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message } as ApiResponse<null>,
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, data: formatPropertyResponse(data) } as ApiResponse<Property>,
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Server error' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

// Helper function to format property response
function formatPropertyResponse(property: any): Property {
  return {
    id: property.id,
    title: property.title,
    description: property.description,
    propertyType: property.property_type,
    address: property.address,
    city: property.city,
    county: property.county,
    latitude: property.latitude,
    longitude: property.longitude,
    price: property.price,
    currency: property.currency,
    totalRooms: property.total_rooms,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    livingRooms: property.living_rooms,
    kitchens: property.kitchens,
    plotSize: property.plot_size,
    builtArea: property.built_area,
    constructionYear: property.construction_year,
    verificationStatus: property.verification_status,
    verifiedBy: property.verified_by,
    verifiedAt: property.verified_at,
    verificationNotes: property.verification_notes,
    addedBy: property.added_by,
    isAvailable: property.is_available,
    viewsCount: property.views_count,
    images: property.images || [],
    createdAt: property.created_at,
    updatedAt: property.updated_at
  };
}
