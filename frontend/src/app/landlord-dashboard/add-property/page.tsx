'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { 
  ArrowLeft, 
  Plus, 
  X, 
  Check, 
  Info, 
  MapPin, 
  Clock, 
  Phone, 
  MessageSquare, 
  Bed, 
  DollarSign, 
  Image as ImageIcon,
  Shield,
  Loader2,
  UploadCloud,
  Trash2,
  CheckCircle2,
  Building2,
  Sparkles
} from 'lucide-react';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { API_BASE } from '@/lib/config';

type PropertyFormData = {
  name: string;
  roomType: string;
  genderPreference: 'male' | 'female' | 'mixed';
  totalBeds: number;
  occupiedBeds: number;
  price: number;
  location: string;
  distanceMinutes: number;
  description: string;
  phone: string;
  whatsapp: string;
};

const AMENITIES_LIST = [
  { id: 'wifi', name: 'Wi-Fi', Icon: Sparkles },
  { id: 'kitchen', name: 'Kitchen', Icon: Building2 },
  { id: 'parking', name: 'Parking', Icon: MapPin },
  { id: 'security', name: '24hr Security', Icon: Shield },
  { id: 'gym', name: 'Gym', Icon: Bed },
  { id: 'electricity', name: 'Electricity', Icon: Sparkles },
  { id: 'study', name: 'Study Area', Icon: Info },
  { id: 'cctv', name: 'CCTV', Icon: Shield },
  { id: 'water', name: 'Running Water', Icon: Sparkles },
  { id: 'borehole', name: 'Borehole', Icon: Building2 },
];

const ROOM_TYPES = [
  { value: 'SINGLE', label: 'Single Room' },
  { value: 'BEDSITTER', label: 'Bedsitter' },
  { value: 'SELF_CONTAINED', label: 'Self-Contained' },
  { value: 'SHARED', label: 'Shared Room' },
  { value: 'BANKERS', label: 'Bankers Room' },
];

export default function AddPropertyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [showAmenitiesPopup, setShowAmenitiesPopup] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, watch, setError, clearErrors, formState: { errors } } = useForm<PropertyFormData>({
    defaultValues: {
      genderPreference: 'mixed',
      occupiedBeds: 0,
      distanceMinutes: 5
    }
  });

  const totalBeds = watch('totalBeds') || 0;
  const occupiedBeds = watch('occupiedBeds') || 0;
  const availableBeds = useMemo(() => Math.max(0, totalBeds - occupiedBeds), [totalBeds, occupiedBeds]);

  const addImageFiles = (files: File[]) => {
    const newFiles = files.filter((file) => file.type.startsWith('image/'));
    if (!newFiles.length) return;

    if (images.length + newFiles.length > 12) {
      setError('root', { message: 'Upload between 5 and 12 images. Remove an image before adding more.' });
      return;
    }

    clearErrors('root');
    setImages((current) => [...current, ...newFiles]);
    setImagePreviews((current) => [...current, ...newFiles.map((file) => URL.createObjectURL(file))]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addImageFiles(Array.from(e.target.files ?? []));
    e.target.value = '';
  };

  const handleReplaceImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replaceIndex === null || !file.type.startsWith('image/')) return;

    setImages((current) => current.map((item, index) => (index === replaceIndex ? file : item)));
    setImagePreviews((current) => {
      URL.revokeObjectURL(current[replaceIndex]);
      return current.map((item, index) => (index === replaceIndex ? URL.createObjectURL(file) : item));
    });
    setReplaceIndex(null);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const startReplaceImage = (index: number) => {
    setReplaceIndex(index);
    replaceInputRef.current?.click();
  };

  const onSubmit = async (data: PropertyFormData) => {
    if (images.length < 5) {
      setError('root', { message: 'Upload at least 5 images before publishing.' });
      return;
    }
    if (images.length > 12) {
      setError('root', { message: 'Upload no more than 12 images.' });
      return;
    }
    if (Number(data.occupiedBeds || 0) > Number(data.totalBeds || 0)) {
      setError('occupiedBeds', { message: 'Occupied bedspaces cannot exceed total bedspaces.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value.toString()));
      formData.append('distanceFromCampus', `${data.distanceMinutes} minutes`);
      formData.append('amenities', JSON.stringify(selectedAmenities));
      images.forEach(image => formData.append('images', image));

      const token = localStorage.getItem('uniboard_token');
      const response = await fetch(`${API_BASE}/landlord/properties`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) router.push('/landlord-dashboard');
      else {
        const result = await response.json().catch(() => null);
        setError('root', { message: result?.error ?? 'Failed to create property' });
      }
    } catch (error) {
      setError('root', { message: 'An error occurred while creating the property.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['landlord']}>
      <main className="min-h-screen bg-gray-50">
        <Topbar />
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => router.back()} className="p-2 bg-white rounded-xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Add New Property</h1>
              <p className="text-gray-500 font-medium">Create a professional listing for your accommodation</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errors.root?.message && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
                {errors.root.message}
              </div>
            )}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><Info size={20} className="text-blue-600" /></div>
                <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Property Name *</label>
                  <input {...register('name', { required: true })} placeholder="e.g. Halawa Student Residence" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Room Type *</label>
                  <select {...register('roomType', { required: true })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all appearance-none bg-white">
                    <option value="">Select Type</option>
                    {ROOM_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Gender Preference *</label>
                  <select {...register('genderPreference', { required: true })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all appearance-none bg-white">
                    <option value="mixed">Both</option>
                    <option value="male">Boys only</option>
                    <option value="female">Girls only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Location *</label>

                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input {...register('location', { required: true })} placeholder="e.g. Northmead, Lusaka" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Distance From Campus *</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="number" min={1} {...register('distanceMinutes', { required: true, min: 1, valueAsNumber: true })} placeholder="5" className="w-full pl-10 pr-16 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">min</span>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
                  <textarea {...register('description', { required: true })} rows={4} placeholder="Describe your property..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center"><Bed size={20} className="text-purple-600" /></div>
                <h2 className="text-xl font-bold text-gray-900">Pricing + Bedspaces</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Price per Month (ZMW) *</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="number" min={1} {...register('price', { required: true, min: 1, valueAsNumber: true })} placeholder="1200" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Total Bedspaces *</label>
                  <input type="number" min={1} {...register('totalBeds', { required: true, min: 1, valueAsNumber: true })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Occupied Bedspaces *</label>
                  <input type="number" min={0} {...register('occupiedBeds', { min: 0, valueAsNumber: true, validate: (value) => Number(value || 0) <= totalBeds || 'Occupied cannot exceed total.' })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                  {errors.occupiedBeds?.message && <p className="mt-1.5 text-xs font-bold text-red-600">{errors.occupiedBeds.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Available Bedspaces</label>
                  <div className={`w-full px-4 py-3 rounded-xl font-black text-center text-lg ${availableBeds > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {availableBeds} {availableBeds === 0 ? '(FULL)' : '(AVAILABLE)'}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center"><Phone size={20} className="text-amber-600" /></div>
                <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                  <input {...register('phone', { required: true })} placeholder="+260 97..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp Number *</label>
                  <input {...register('whatsapp', { required: true })} placeholder="+260 97..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center"><ImageIcon size={20} className="text-emerald-600" /></div>
                <h2 className="text-xl font-bold text-gray-900">Property Images</h2>
              </div>
              <p className="mb-5 text-sm font-medium text-gray-500">Upload 5 to 12 images. Drag photos here, then preview, replace, or delete each image before publishing.</p>
              <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
              <input ref={replaceInputRef} type="file" accept="image/*" onChange={handleReplaceImage} className="hidden" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  addImageFiles(Array.from(event.dataTransfer.files));
                }}
                className="mb-5 flex min-h-44 w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-8 text-center transition-all hover:border-green-500 hover:bg-green-50"
              >
                <UploadCloud size={32} className="text-green-700" />
                <span className="mt-3 text-base font-black text-gray-900">Drag and drop property photos</span>
                <span className="mt-1 text-sm font-semibold text-gray-500">{images.length}/12 selected · minimum 5 required</span>
              </button>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {imagePreviews.map((src, idx) => (
                  <div key={src} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="aspect-square overflow-hidden">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100">
                      <button type="button" onClick={() => startReplaceImage(idx)} className="flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50">
                        <ImageIcon size={14} />
                        Replace
                      </button>
                      <button type="button" onClick={() => removeImage(idx)} className="flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50">
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {images.length < 12 && (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all group">
                    <Plus size={20} className="text-gray-400 group-hover:text-green-700" />
                    <span className="text-xs font-bold text-gray-400 group-hover:text-green-700">Add images</span>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center"><Shield size={20} className="text-orange-600" /></div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">Section 4</p>
                    <h2 className="text-xl font-bold text-gray-900">Amenities</h2>
                  </div>
                </div>
                <button type="button" onClick={() => setShowAmenitiesPopup(true)} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all">Choose Amenities</button>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {selectedAmenities.length ? (
                  selectedAmenities.map((id) => {
                    const amenity = AMENITIES_LIST.find((item) => item.id === id);
                    return (
                      <span key={id} className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                        <CheckCircle2 size={14} />
                        {amenity?.name ?? id}
                      </span>
                    );
                  })
                ) : (
                  <p className="text-sm font-medium text-gray-400">No amenities selected yet.</p>
                )}
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-green-700 hover:bg-green-800 text-white font-black py-5 rounded-2xl text-lg shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-3">
              {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Check size={24} />}
              {isSubmitting ? 'Publishing...' : 'Create Property Listing'}
            </button>
          </form>
        </div>

        {showAmenitiesPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAmenitiesPopup(false)}></div>
            <div className="relative bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-green-700">Checkbox grid</p>
                  <h3 className="text-2xl font-black text-gray-900">Select Amenities</h3>
                </div>
                <button type="button" onClick={() => setShowAmenitiesPopup(false)} className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"><X size={24} /></button>
              </div>
              <div className="grid max-h-[55vh] grid-cols-1 gap-3 overflow-y-auto p-6 sm:grid-cols-2">
                {AMENITIES_LIST.map((amenity) => {
                  const selected = selectedAmenities.includes(amenity.id);
                  return (
                    <label key={amenity.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-all ${selected ? 'border-green-600 bg-green-50 text-green-800' : 'border-gray-100 bg-white text-gray-600 hover:border-green-100 hover:bg-gray-50'}`}>
                      <input type="checkbox" checked={selected} onChange={() => toggleAmenity(amenity.id)} className="h-5 w-5 rounded border-gray-300 text-green-700 focus:ring-green-600" />
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${selected ? 'bg-white text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                        <amenity.Icon size={18} />
                      </span>
                      <span className="text-sm font-black">{amenity.name}</span>
                    </label>
                  );
                })}
              </div>
              <div className="border-t border-gray-100 p-5">
                <button type="button" onClick={() => setShowAmenitiesPopup(false)} className="w-full bg-green-700 text-white font-bold py-4 rounded-2xl">Confirm {selectedAmenities.length} selected</button>
              </div>
            </div>
          </div>
        )}
        <Footer />
      </main>
    </ProtectedRoute>
  );
}
