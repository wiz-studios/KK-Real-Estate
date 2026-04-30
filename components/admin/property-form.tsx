'use client';

import { useState } from 'react';
import { Property, PropertyType } from '@/lib/types';
import { ImageUploadField } from '@/components/ui/image-upload-field'
import { KenyaCountyCombobox } from '@/components/ui/kenya-county-combobox'

interface PropertyFormProps {
  onSubmit: (data: any) => Promise<void>;
  initialData?: Property;
  isLoading?: boolean;
}

const propertyTypes: PropertyType[] = [
  'bungalow',
  'flatroof',
  'townhouse',
  'apartment',
  'penthouse',
  'villa',
  'mansion',
  'cottage',
  'duplex',
  'studio'
];

export function PropertyForm({ onSubmit, initialData, isLoading = false }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    propertyType: initialData?.propertyType || ('bungalow' as PropertyType),
    address: initialData?.address || '',
    city: initialData?.city || '',
    county: initialData?.county || '',
    latitude: initialData?.latitude || '',
    longitude: initialData?.longitude || '',
    price: initialData?.price || '',
    currency: initialData?.currency || 'KES',
    totalRooms: initialData?.totalRooms || 3,
    bedrooms: initialData?.bedrooms || 2,
    bathrooms: initialData?.bathrooms || 1,
    livingRooms: initialData?.livingRooms || 1,
    kitchens: initialData?.kitchens || 1,
    plotSize: initialData?.plotSize || '',
    builtArea: initialData?.builtArea || '',
    constructionYear: initialData?.constructionYear || new Date().getFullYear()
  });

  const [error, setError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value ? parseFloat(value) : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.title || !formData.address || !formData.city || !formData.price) {
      setError('Please fill in all required fields');
      return;
    }

    if (imageFiles.length === 0 && !(initialData?.images?.length)) {
      setError('Please upload at least one property image.');
      return;
    }

    try {
      await onSubmit({
        ...formData,
        imageFiles
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Title and Type Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Beautiful 3BR Bungalow in Kilimani"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type *
          </label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            {propertyTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address *
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="e.g., 123 Main Street"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City/Town *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g., Nairobi"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            County
          </label>
          <KenyaCountyCombobox
            value={String(formData.county || '')}
            onValueChange={(value) =>
              setFormData(prev => ({
                ...prev,
                county: value
              }))
            }
            placeholder="Search Kenya county"
            tone="light"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (KES) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleNumberChange}
            placeholder="e.g., 10000000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Latitude
          </label>
          <input
            type="number"
            name="latitude"
            value={formData.latitude}
            onChange={handleNumberChange}
            placeholder="e.g., -1.2864"
            step="0.0001"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Longitude
          </label>
          <input
            type="number"
            name="longitude"
            value={formData.longitude}
            onChange={handleNumberChange}
            placeholder="e.g., 36.7772"
            step="0.0001"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Room Details */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Rooms *
          </label>
          <input
            type="number"
            name="totalRooms"
            value={formData.totalRooms}
            onChange={handleNumberChange}
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bedrooms *
          </label>
          <input
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleNumberChange}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bathrooms *
          </label>
          <input
            type="number"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleNumberChange}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Living Rooms
          </label>
          <input
            type="number"
            name="livingRooms"
            value={formData.livingRooms}
            onChange={handleNumberChange}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kitchens
          </label>
          <input
            type="number"
            name="kitchens"
            value={formData.kitchens}
            onChange={handleNumberChange}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Property Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plot Size
          </label>
          <input
            type="text"
            name="plotSize"
            value={formData.plotSize}
            onChange={handleChange}
            placeholder="e.g., 0.5 acres"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Built Area
          </label>
          <input
            type="text"
            name="builtArea"
            value={formData.builtArea}
            onChange={handleChange}
            placeholder="e.g., 500 sqm"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Construction Year
          </label>
          <input
            type="number"
            name="constructionYear"
            value={formData.constructionYear}
            onChange={handleNumberChange}
            min="1900"
            max={new Date().getFullYear()}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed property description..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
      </div>

      <ImageUploadField
        files={imageFiles}
        onFilesChange={setImageFiles}
        onError={setError}
        existingUrls={initialData?.images}
        maxFiles={10}
        maxFileSizeMb={5}
        label="Property Images"
        helperText="Supported formats: JPG, JPEG, PNG."
        tone="light"
      />

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Property'}
        </button>
      </div>
    </form>
  );
}
