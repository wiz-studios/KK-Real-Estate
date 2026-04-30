import { supabaseAdmin } from '@/lib/auth'

const PROPERTY_IMAGE_BUCKET = 'property-images'
const MAX_IMAGE_COUNT = 10
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png'])

async function ensurePropertyImageBucket() {
  const { data: existingBucket } = await supabaseAdmin.storage.getBucket(PROPERTY_IMAGE_BUCKET)

  if (!existingBucket) {
    const { error } = await supabaseAdmin.storage.createBucket(PROPERTY_IMAGE_BUCKET, {
      public: true,
      fileSizeLimit: MAX_IMAGE_SIZE_BYTES,
      allowedMimeTypes: ['image/jpeg', 'image/png'],
    })

    if (error && !error.message.toLowerCase().includes('already exists')) {
      throw error
    }
  } else {
    await supabaseAdmin.storage.updateBucket(PROPERTY_IMAGE_BUCKET, {
      public: true,
      fileSizeLimit: MAX_IMAGE_SIZE_BYTES,
      allowedMimeTypes: ['image/jpeg', 'image/png'],
    })
  }
}

export async function uploadPropertyImages(files: File[]) {
  if (files.length > MAX_IMAGE_COUNT) {
    throw new Error(`You can upload up to ${MAX_IMAGE_COUNT} images.`)
  }

  if (files.length === 0) {
    return []
  }

  await ensurePropertyImageBucket()

  const uploadedUrls: string[] = []

  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      throw new Error('Only JPG, JPEG, and PNG images are supported.')
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new Error('Each image must be 5MB or smaller.')
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `submissions/${Date.now()}-${crypto.randomUUID()}.${extension}`
    const bytes = new Uint8Array(await file.arrayBuffer())

    const { error } = await supabaseAdmin.storage
      .from(PROPERTY_IMAGE_BUCKET)
      .upload(path, bytes, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      throw error
    }

    const { data } = supabaseAdmin.storage.from(PROPERTY_IMAGE_BUCKET).getPublicUrl(path)
    uploadedUrls.push(data.publicUrl)
  }

  return uploadedUrls
}

export { MAX_IMAGE_COUNT, MAX_IMAGE_SIZE_BYTES }
