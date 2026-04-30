import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/auth'
import { ApiResponse, Property } from '@/lib/types'
import { uploadPropertyImages } from '@/lib/property-images'

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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const title = String(formData.get('title') || '')
    const description = String(formData.get('description') || '')
    const propertyType = String(formData.get('propertyType') || '')
    const address = String(formData.get('address') || '')
    const city = String(formData.get('city') || '')
    const county = String(formData.get('county') || '')
    const latitude = String(formData.get('latitude') || '')
    const longitude = String(formData.get('longitude') || '')
    const price = String(formData.get('price') || '')
    const currency = String(formData.get('currency') || 'KES')
    const totalRooms = String(formData.get('totalRooms') || '')
    const bedrooms = String(formData.get('bedrooms') || '')
    const bathrooms = String(formData.get('bathrooms') || '')
    const livingRooms = String(formData.get('livingRooms') || '1')
    const kitchens = String(formData.get('kitchens') || '1')
    const plotSize = String(formData.get('plotSize') || '')
    const builtArea = String(formData.get('builtArea') || '')
    const constructionYear = String(formData.get('constructionYear') || '')
    const submitterName = String(formData.get('submitterName') || '')
    const submitterEmail = String(formData.get('submitterEmail') || '')
    const submitterPhone = String(formData.get('submitterPhone') || '')
    const submitterNotes = String(formData.get('submitterNotes') || '')
    const imageFiles = formData
      .getAll('images')
      .filter((value): value is File => value instanceof File && value.size > 0)

    if (
      !title ||
      !propertyType ||
      !address ||
      !city ||
      !price ||
      totalRooms === undefined ||
      bedrooms === undefined ||
      bathrooms === undefined ||
      !submitterName ||
      !submitterEmail ||
      !submitterPhone
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' } as ApiResponse<null>,
        { status: 400 },
      )
    }

    if (imageFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please upload at least one property image.' } as ApiResponse<null>,
        { status: 400 },
      )
    }

    const submissionNotes = [
      'Public submission awaiting admin review.',
      `Contact Name: ${submitterName}`,
      `Contact Email: ${submitterEmail}`,
      `Contact Phone: ${submitterPhone}`,
      submitterNotes ? `Owner Notes: ${submitterNotes}` : null,
      `Submitted At: ${new Date().toISOString()}`,
    ]
      .filter(Boolean)
      .join('\n')

    const uploadedImages = await uploadPropertyImages(imageFiles)

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
          latitude: latitude || null,
          longitude: longitude || null,
          price: parseFloat(price),
          currency,
          total_rooms: parseInt(totalRooms, 10),
          bedrooms: parseInt(bedrooms, 10),
          bathrooms: parseInt(bathrooms, 10),
          living_rooms: parseInt(livingRooms, 10),
          kitchens: parseInt(kitchens, 10),
          plot_size: plotSize || null,
          built_area: builtArea || null,
          construction_year: constructionYear ? parseInt(constructionYear, 10) : null,
          images: uploadedImages,
          added_by: null,
          verification_status: 'pending',
          verification_notes: submissionNotes,
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
