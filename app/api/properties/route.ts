import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/auth';
import { PaginatedResponse, Property } from '@/lib/types';

// GET - List verified properties (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');
    const city = searchParams.get('city');
    const propertyType = searchParams.get('propertyType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');
    const search = searchParams.get('search');

    let query = supabaseAdmin
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('verification_status', 'verified')
      .eq('is_available', true);

    // Apply filters
    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    if (propertyType) {
      query = query.eq('property_type', propertyType);
    }

    if (bedrooms) {
      query = query.eq('bedrooms', parseInt(bedrooms));
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,address.ilike.%${search}%`);
    }

    // Pagination
    const from = (page - 1) * pageSize;
    query = query
      .range(from, from + pageSize - 1)
      .order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message } as any,
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data?.map(formatPropertyResponse) || [],
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
    } as PaginatedResponse<Property>);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Server error' } as any,
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
