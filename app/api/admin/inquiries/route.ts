import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, supabaseAdmin } from '@/lib/auth';
import { ApiResponse, AdminInquiryItem } from '@/lib/types';

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

    const { data, error } = await supabaseAdmin
      .from('property_inquiries')
      .select(`
        id,
        property_id,
        inquiry_type,
        message,
        phone,
        created_at,
        users (
          full_name,
          email,
          phone
        ),
        properties (
          title,
          city,
          county,
          images,
          verification_notes
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const inquiries: AdminInquiryItem[] = (data || []).map((inquiry: any) => ({
      id: inquiry.id,
      propertyId: inquiry.property_id,
      propertyTitle: inquiry.properties?.title || 'Unknown property',
      propertyCity: inquiry.properties?.city || '',
      propertyCounty: inquiry.properties?.county || '',
      propertyImage: inquiry.properties?.images?.[0],
      propertyVerificationNotes: inquiry.properties?.verification_notes || '',
      name: inquiry.users?.full_name || '',
      email: inquiry.users?.email || '',
      phone: inquiry.phone || inquiry.users?.phone || '',
      message: inquiry.message || '',
      inquiryType: inquiry.inquiry_type || '',
      createdAt: inquiry.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: inquiries,
    } as ApiResponse<AdminInquiryItem[]>);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Server error' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
