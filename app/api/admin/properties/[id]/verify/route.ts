import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, requireAdmin } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';

// POST - Verify property (admin only)
export async function POST(
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
    const { status, notes } = body;

    if (!status || !['verified', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification status' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const { data: existingProperty, error: existingError } = await supabaseAdmin
      .from('properties')
      .select('verification_notes')
      .eq('id', id)
      .single();

    if (existingError) {
      return NextResponse.json(
        { success: false, error: existingError.message } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const combinedNotes = [
      existingProperty?.verification_notes || null,
      notes ? `Admin Review: ${notes}` : null
    ]
      .filter(Boolean)
      .join('\n\n');

    // Update property verification status
    const { data: property, error: updateError } = await supabaseAdmin
      .from('properties')
      .update({
        verification_status: status,
        verified_by: adminId,
        verified_at: new Date().toISOString(),
        verification_notes: combinedNotes || null,
        is_available: status === 'verified'
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Create verification log entry
    const { error: logError } = await supabaseAdmin
      .from('verification_logs')
      .insert([
        {
          property_id: id,
          admin_id: adminId,
          action: status === 'verified' ? 'property_verified' : 'property_rejected',
          status: status,
          notes: notes || null,
          verification_date: new Date().toISOString()
        }
      ]);

    if (logError) {
      console.error('Failed to create verification log:', logError);
      // Don't fail the request, log was created but audit trail failed
    }

    return NextResponse.json({
      success: true,
      data: {
        id: property.id,
        verificationStatus: property.verification_status,
        verifiedAt: property.verified_at,
        verificationNotes: property.verification_notes
      }
    } as ApiResponse<any>);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Server error' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
