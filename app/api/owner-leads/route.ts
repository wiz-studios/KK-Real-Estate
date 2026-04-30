import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/auth'
import { uploadPropertyImages } from '@/lib/property-images'
import { ApiResponse, Property } from '@/lib/types'

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
    updatedAt: property.updated_at,
  }
}

async function getFallbackAdminId() {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('role', 'admin')
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error || !data) {
    throw new Error(error?.message || 'No active admin is available to receive leads.')
  }

  return data.id
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = String(formData.get('name') || '').trim()
    const phone = String(formData.get('phone') || '').trim()
    const propertyLocation = String(formData.get('propertyLocation') || '').trim()
    const price = String(formData.get('price') || '').trim()
    const plotSize = String(formData.get('plotSize') || '').trim()
    const bedrooms = String(formData.get('bedrooms') || '').trim()
    const bathrooms = String(formData.get('bathrooms') || '').trim()
    const imageFiles = formData
      .getAll('images')
      .filter((value): value is File => value instanceof File && value.size > 0)

    if (!name || !phone || !propertyLocation || !price || !bedrooms || !bathrooms) {
      return NextResponse.json(
        { success: false, error: 'Missing required lead details.' } as ApiResponse<null>,
        { status: 400 },
      )
    }

    if (imageFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please upload at least one house image.' } as ApiResponse<null>,
        { status: 400 },
      )
    }

    const uploadedImages = await uploadPropertyImages(imageFiles)
    const fallbackAdminId = await getFallbackAdminId()
    const bedroomCount = Math.max(0, parseInt(bedrooms, 10) || 0)
    const bathroomCount = Math.max(0, parseInt(bathrooms, 10) || 0)
    const totalRooms = Math.max(bedroomCount + bathroomCount + 1, bedroomCount || 1)

    const verificationNotes = [
      'Owner Lead Source: Seller Landing Page',
      `Contact Name: ${name}`,
      `Contact Phone: ${phone}`,
      `Property Location: ${propertyLocation}`,
      plotSize ? `Plot Size: ${plotSize}` : null,
      `Submitted At: ${new Date().toISOString()}`,
      'Intent: Owner wants help listing an already-built house.',
    ]
      .filter(Boolean)
      .join('\n')

    const { data, error } = await supabaseAdmin
      .from('properties')
      .insert([
        {
          title: `Owner Lead - ${propertyLocation}`,
          description: 'Seller lead captured from the landing page. Follow up for full listing details.',
          property_type: 'bungalow',
          address: propertyLocation,
          city: propertyLocation,
          county: null,
          price: parseFloat(price),
          currency: 'KES',
          total_rooms: totalRooms,
          bedrooms: bedroomCount,
          bathrooms: bathroomCount,
          living_rooms: 1,
          kitchens: 1,
          plot_size: plotSize || null,
          built_area: null,
          construction_year: null,
          images: uploadedImages,
          added_by: fallbackAdminId,
          verification_status: 'pending',
          verification_notes: verificationNotes,
          is_available: false,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message } as ApiResponse<null>,
        { status: 400 },
      )
    }

    return NextResponse.json(
      { success: true, data: formatPropertyResponse(data) } as ApiResponse<Property>,
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Server error' } as ApiResponse<null>,
      { status: 500 },
    )
  }
}
