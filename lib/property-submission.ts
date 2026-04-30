export interface SubmissionContactDetails {
  isPublicSubmission: boolean
  isShowcaseLead: boolean
  isOwnerLead: boolean
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  ownerNotes?: string
}

function extractLineValue(notes: string, label: string) {
  const pattern = new RegExp(`^${label}:\\s*(.+)$`, 'im')
  const match = notes.match(pattern)
  return match?.[1]?.trim()
}

export function parseSubmissionContactDetails(notes?: string | null): SubmissionContactDetails {
  const safeNotes = notes || ''

  return {
    isPublicSubmission: safeNotes.includes('Public submission awaiting admin review.'),
    isShowcaseLead: safeNotes.includes('Showcase Lead Source:'),
    isOwnerLead: safeNotes.includes('Owner Lead Source: Seller Landing Page'),
    contactName: extractLineValue(safeNotes, 'Contact Name'),
    contactEmail: extractLineValue(safeNotes, 'Contact Email'),
    contactPhone: extractLineValue(safeNotes, 'Contact Phone'),
    ownerNotes: extractLineValue(safeNotes, 'Owner Notes'),
  }
}
