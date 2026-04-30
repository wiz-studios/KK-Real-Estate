import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/auth';
import { ApiResponse, Property } from '@/lib/types';

// GET - Get verified property details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabaseAdmin
      .from('properties')
      .select('*')
      .eq('id', id)
      .eq('verification_status', 'verified')
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Property not found' } as ApiResponse<null>,
        { status: 404 }
      );
    }

    // Increment views count
    await supabaseAdmin
      .from('properties')
      .update({ views_count: (data.views_count || 0) + 1 })
      .eq('id', id)
      .select();

    // Get features for this property
    const { data: features } = await supabaseAdmin
      .from('property_features')
      .select('*')
      .eq('property_id', id);

    return NextResponse.json({
      success: true,
      data: {
        ...formatPropertyResponse(data),
        features: features || []
      }
    } as ApiResponse<any>);
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
