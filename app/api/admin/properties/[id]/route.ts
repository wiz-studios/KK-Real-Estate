import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, requireAdmin } from '@/lib/auth';
import { ApiResponse, Property } from '@/lib/types';

// GET - Get property details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const { data, error } = await supabaseAdmin
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Property not found' } as ApiResponse<null>,
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: formatPropertyResponse(data)
    } as ApiResponse<Property>);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Server error' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

// PUT - Update property
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const body = await request.json();

    // Convert camelCase to snake_case
    const updateData: any = {};
    const camelToSnake: Record<string, string> = {
      propertyType: 'property_type',
      totalRooms: 'total_rooms',
      livingRooms: 'living_rooms',
      plotSize: 'plot_size',
      builtArea: 'built_area',
      constructionYear: 'construction_year',
      verificationStatus: 'verification_status',
      verifiedBy: 'verified_by',
      verifiedAt: 'verified_at',
      verificationNotes: 'verification_notes',
      addedBy: 'added_by',
      isAvailable: 'is_available',
      viewsCount: 'views_count'
    };

    Object.keys(body).forEach(key => {
      const snakeKey = camelToSnake[key] || key;
      updateData[snakeKey] = body[key];
    });

    const { data, error } = await supabaseAdmin
      .from('properties')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message } as ApiResponse<null>,
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: formatPropertyResponse(data)
    } as ApiResponse<Property>);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Server error' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

// DELETE - Delete property
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const { error } = await supabaseAdmin
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message } as ApiResponse<null>,
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, data: null } as ApiResponse<null>,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Server error' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

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
