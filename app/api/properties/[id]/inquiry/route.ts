import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, supabaseAdmin } from '@/lib/auth'
import { mockProperties } from '@/lib/mock-properties'
import { ApiResponse } from '@/lib/types'

interface InquiryContact {
  name: string
  email: string
  phone: string
  message: string
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

async function getOrCreateInquiryUser(contact: InquiryContact) {
  const normalizedEmail = contact.email.trim().toLowerCase()

  const { data: existingUser, error: existingUserError } = await supabaseAdmin
    .from('users')
    .select('id, full_name, phone')
    .eq('email', normalizedEmail)
    .maybeSingle()

  if (existingUserError) {
    throw new Error(existingUserError.message)
  }

  if (existingUser) {
    const needsUpdate =
      existingUser.full_name !== contact.name.trim() || existingUser.phone !== contact.phone.trim()

    if (needsUpdate) {
      await supabaseAdmin
        .from('users')
        .update({
          full_name: contact.name.trim(),
          phone: contact.phone.trim(),
        })
        .eq('id', existingUser.id)
    }

    return existingUser.id
  }

  const passwordHash = await hashPassword(randomUUID())

  const { data: createdUser, error: createdUserError } = await supabaseAdmin
    .from('users')
    .insert([
      {
        email: normalizedEmail,
        password_hash: passwordHash,
        full_name: contact.name.trim(),
        phone: contact.phone.trim(),
        role: 'user',
        is_active: false,
      },
    ])
    .select('id')
    .single()

  if (createdUserError || !createdUser) {
    throw new Error(createdUserError?.message || 'Unable to create inquiry contact')
  }

  return createdUser.id
}

async function ensureInquiryProperty(propertyId: string) {
  if (isUuid(propertyId)) {
    const { data: liveProperty, error: livePropertyError } = await supabaseAdmin
      .from('properties')
      .select('id, title')
      .eq('id', propertyId)
      .maybeSingle()

    if (livePropertyError) {
      throw new Error(livePropertyError.message)
    }

    if (liveProperty) {
      return liveProperty
    }
  }

  const showcaseProperty = mockProperties.find((property) => property.id === propertyId)

  if (!showcaseProperty) {
    return null
  }

  const showcaseMarker = `Showcase Lead Source: ${propertyId}`

  const { data: existingShowcaseLead, error: existingShowcaseLeadError } = await supabaseAdmin
    .from('properties')
    .select('id, title')
    .ilike('verification_notes', `%${showcaseMarker}%`)
    .maybeSingle()

  if (existingShowcaseLeadError) {
    throw new Error(existingShowcaseLeadError.message)
  }

  if (existingShowcaseLead) {
    return existingShowcaseLead
  }

  const { data: fallbackAdmin, error: fallbackAdminError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('role', 'admin')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle()

  if (fallbackAdminError || !fallbackAdmin) {
    throw new Error(fallbackAdminError?.message || 'No active admin is available to receive inquiries.')
  }

  const { data: createdLeadProperty, error: createdLeadPropertyError } = await supabaseAdmin
    .from('properties')
    .insert([
      {
        title: `Showcase Lead: ${showcaseProperty.title}`,
        description: showcaseProperty.description,
        property_type: showcaseProperty.propertyType,
        address: showcaseProperty.address,
        city: showcaseProperty.city,
        county: showcaseProperty.county,
        price: showcaseProperty.price,
        currency: showcaseProperty.currency,
        total_rooms: showcaseProperty.totalRooms,
        bedrooms: showcaseProperty.bedrooms,
        bathrooms: showcaseProperty.bathrooms,
        living_rooms: showcaseProperty.livingRooms,
        kitchens: showcaseProperty.kitchens,
        plot_size: showcaseProperty.plotSize || null,
        built_area: showcaseProperty.builtArea || null,
        construction_year: showcaseProperty.constructionYear || null,
        verification_status: 'pending',
        verification_notes: `${showcaseMarker}\nAuto-created from a showcase inquiry. Review before publication.`,
        added_by: fallbackAdmin.id,
        is_available: false,
        images: showcaseProperty.images || [],
      },
    ])
    .select('id, title')
    .single()

  if (createdLeadPropertyError || !createdLeadProperty) {
    throw new Error(createdLeadPropertyError?.message || 'Unable to create inquiry target')
  }

  return createdLeadProperty
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = (await request.json()) as Partial<InquiryContact>

    const name = body.name?.trim() || ''
    const email = body.email?.trim() || ''
    const phone = body.phone?.trim() || ''
    const message = body.message?.trim() || ''

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, phone, and message are required.' } as ApiResponse<null>,
        { status: 400 },
      )
    }

    const inquiryProperty = await ensureInquiryProperty(id)

    if (!inquiryProperty) {
      return NextResponse.json(
        { success: false, error: 'Property not found.' } as ApiResponse<null>,
        { status: 404 },
      )
    }

    const inquiryUserId = await getOrCreateInquiryUser({ name, email, phone, message })

    const { error } = await supabaseAdmin.from('property_inquiries').upsert(
      [
        {
          property_id: inquiryProperty.id,
          user_id: inquiryUserId,
          inquiry_type: id.startsWith('mock-') ? 'showcase_viewing_request' : 'viewing_request',
          message,
          phone,
          created_at: new Date().toISOString(),
        },
      ],
      { onConflict: 'property_id,user_id' },
    )

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message } as ApiResponse<null>,
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry sent to the admin team.',
      data: {
        propertyTitle: inquiryProperty.title,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Server error' } as ApiResponse<null>,
      { status: 500 },
    )
  }
}
