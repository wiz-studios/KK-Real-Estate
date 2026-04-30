'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ImagePlus, Trash2, UploadCloud, X } from 'lucide-react'

interface ImageUploadFieldProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  onError?: (message: string | null) => void
  existingUrls?: string[]
  maxFiles?: number
  maxFileSizeMb?: number
  label?: string
  helperText?: string
  tone?: 'dark' | 'light'
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png']

export function ImageUploadField({
  files,
  onFilesChange,
  onError,
  existingUrls = [],
  maxFiles = 10,
  maxFileSizeMb = 5,
  label = 'Property Images',
  helperText = 'Supported formats: JPG, JPEG, PNG.',
  tone = 'dark',
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const previews = useMemo(() => {
    if (files.length > 0) {
      return files.map((file) => ({
        key: `${file.name}-${file.lastModified}`,
        name: file.name,
        url: URL.createObjectURL(file),
      }))
    }

    return existingUrls.map((url, index) => ({
      key: `${url}-${index}`,
      name: `existing-image-${index + 1}`,
      url,
    }))
  }, [existingUrls, files])

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview.url.startsWith('blob:')) {
          URL.revokeObjectURL(preview.url)
        }
      })
    }
  }, [previews])

  const palette =
    tone === 'light'
      ? {
          label: 'text-gray-700',
          helper: 'text-gray-500',
          border: 'border-gray-300 bg-white',
          active: 'border-yellow-400 bg-yellow-50',
          title: 'text-gray-900',
          meta: 'text-gray-500',
          chip: 'border-yellow-200 bg-yellow-50 text-yellow-800',
          card: 'border-gray-200 bg-white',
          clear: 'border-gray-300 text-gray-700',
        }
      : {
          label: 'text-white/50',
          helper: 'text-white/40',
          border: 'border-white/12 bg-white/[0.03]',
          active: 'border-[#d9b15f]/45 bg-[#d9b15f]/10',
          title: 'text-white',
          meta: 'text-white/50',
          chip: 'border-[#d9b15f]/18 bg-[#d9b15f]/10 text-[#f2dca3]',
          card: 'border-white/8 bg-black/20',
          clear: 'border-white/12 text-white/72',
        }

  const validateAndCommit = (incoming: FileList | File[]) => {
    const selectedFiles = Array.from(incoming)
    const existingFiles = [...files]
    const dedupedIncoming = selectedFiles.filter((file) => {
      const key = `${file.name}-${file.lastModified}-${file.size}`
      return !existingFiles.some(
        (existingFile) =>
          `${existingFile.name}-${existingFile.lastModified}-${existingFile.size}` === key,
      )
    })
    const nextFiles = [...existingFiles, ...dedupedIncoming]

    if (nextFiles.length > maxFiles) {
      onError?.(`You can upload up to ${maxFiles} images.`)
      return
    }

    for (const file of nextFiles) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        onError?.('Only JPG, JPEG, and PNG images are supported.')
        return
      }

      if (file.size > maxFileSizeMb * 1024 * 1024) {
        onError?.(`Each image must be ${maxFileSizeMb}MB or smaller.`)
        return
      }
    }

    onError?.(null)
    onFilesChange(nextFiles)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      validateAndCommit(event.target.files)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    if (event.dataTransfer.files?.length) {
      validateAndCommit(event.dataTransfer.files)
    }
  }

  const clearFiles = () => {
    onFilesChange([])
    onError?.(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const removeFile = (targetIndex: number) => {
    onFilesChange(files.filter((_, index) => index !== targetIndex))
    onError?.(null)
  }

  const moveFile = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= files.length) {
      return
    }

    const reorderedFiles = [...files]
    const [movedFile] = reorderedFiles.splice(fromIndex, 1)
    reorderedFiles.splice(toIndex, 0, movedFile)
    onFilesChange(reorderedFiles)
  }

  return (
    <div>
      <label className={`mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${palette.label}`}>
        {label}
      </label>

      <div
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-3xl border border-dashed px-5 py-6 transition-colors ${
          isDragging
            ? palette.active
            : palette.border
        }`}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[#d9b15f]/12 p-3 text-[#d9b15f]">
              <ImagePlus className="h-5 w-5" />
            </div>
            <div>
              <p className={`text-sm font-medium ${palette.title}`}>Drag and drop property photos here</p>
              <p className={`mt-1 text-sm ${palette.meta}`}>
                Up to {maxFiles} files, {maxFileSizeMb}MB each.
              </p>
              <p className={`mt-1 text-xs ${palette.helper}`}>{helperText}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full bg-[#d9b15f] px-5 py-2.5 text-sm font-semibold text-[#111111]"
            >
              <UploadCloud className="h-4 w-4" />
              Choose Images
            </button>

            {previews.length > 0 && (
              <button
                type="button"
                onClick={clearFiles}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium ${palette.clear}`}
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {previews.length > 0 && (
        <>
          <div className="mt-3 flex flex-wrap gap-2">
            {previews.map((preview, index) => (
              <span
                key={preview.key}
                className={`rounded-full border px-3 py-1 text-xs ${palette.chip}`}
              >
                {files.length > 0 ? files[index]?.name : `Existing image ${index + 1}`}
              </span>
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {previews.map((preview, index) => (
              <div key={preview.key} className={`overflow-hidden rounded-2xl border ${palette.card}`}>
                <div className="relative">
                  <img src={preview.url} alt={preview.name} className="h-40 w-full object-cover" />

                  {files.length > 0 && (
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 via-black/35 to-transparent px-3 pb-3 pt-10">
                      <span className="max-w-[55%] truncate text-xs font-medium text-white">
                        {files[index]?.name}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => moveFile(index, index - 1)}
                          disabled={index === 0}
                          className="rounded-full border border-white/15 bg-black/55 p-2 text-white transition disabled:cursor-not-allowed disabled:opacity-35"
                          aria-label={`Move ${files[index]?.name} earlier`}
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveFile(index, index + 1)}
                          disabled={index === files.length - 1}
                          className="rounded-full border border-white/15 bg-black/55 p-2 text-white transition disabled:cursor-not-allowed disabled:opacity-35"
                          aria-label={`Move ${files[index]?.name} later`}
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="rounded-full border border-red-400/30 bg-red-500/20 p-2 text-red-100 transition hover:bg-red-500/30"
                          aria-label={`Remove ${files[index]?.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
