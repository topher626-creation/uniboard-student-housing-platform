'use client';

import React, { useState, useMemo } from 'react';
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
  Loader2
} from 'lucide-react';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/authContext';
import { API_BASE } from '@/lib/config';

type PropertyFormData = {
  name: string;
  roomType: string;
  totalBeds: number;
  occupiedBeds: number;
  price: number;
  location: string;
  distanceFromCampus: string;
  description: string;
  phone: string;
  whatsapp: string;
};

const AMENITIES_LIST = [
  { id: 'wifi', name: 'Wi-Fi', icon: '📶' },
  { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
  { id: 'parking', name: 'Parking', icon: '🚗' },
  { id: 'security', name: '24hr Security', icon: '🛡️' },
  { id: 'gym', name: 'Gym', icon: '🏋️' },
  { id: 'electricity', name: 'Electricity', icon: '⚡' },
  { id: 'study', name: 'Study Area', icon: '📚' },
  { id: 'cctv', name: 'CCTV', icon: '📹' },
  { id: 'water', name: 'Running Water', icon: '🚰' },
  { id: 'borehole', name: 'Borehole', icon: '💧' },
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
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [showAmenitiesPopup, setShowAmenitiesPopup] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<PropertyFormData>({
    defaultValues: {
      occupiedBeds: 0,
      distanceFromCampus: '5 minutes'
    }
  });

  const totalBeds = watch('totalBeds') || 0;
  const occupiedBeds = watch('occupiedBeds') || 0;
  const availableBeds = useMemo(() => Math.max(0, totalBeds - occupiedBeds), [totalBeds, occupiedBeds]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (images.length + newFiles.length > 12) {
        alert('Max 12 images allowed');
        return;
      }
      setImages([...images, ...newFiles]);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
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

  const onSubmit = async (data: PropertyFormData) => {
    if (images.length < 5) {
      alert('Upload at least 5 images');
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value.toString()));
      formData.append('amenities', JSON.stringify(selectedAmenities));
      images.forEach(image => formData.append('images', image));

      const token = localStorage.getItem('uniboard_token');
      const response = await fetch(`${API_BASE}/landlord/properties`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) router.push('/landlord-dashboard');
      else alert('Failed to create property');
    } catch (error) {
      alert('An error occurred');
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">Price per Month (ZMW) *</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="number" {...register('price', { required: true })} placeholder="1200" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                  </div>
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
                    <input {...register('distanceFromCampus', { required: true })} placeholder="e.g. 5 minutes" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
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
                <h2 className="text-xl font-bold text-gray-900">Bedspace Management</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Total Bedspaces *</label>
                  <input type="number" {...register('totalBeds', { required: true, min: 1 })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Occupied Bedspaces *</label>
                  <input type="number" {...register('occupiedBeds', { min: 0 })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {imagePreviews.map((src, idx) => (
                  <div key={src} className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                  </div>
                ))}
                {images.length < 12 && (
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all group">
                    <Plus size={20} className="text-gray-400 group-hover:text-green-700" />
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center"><Shield size={20} className="text-orange-600" /></div>
                  <h2 className="text-xl font-bold text-gray-900">Amenities & Safety</h2>
                </div>
                <button type="button" onClick={() => setShowAmenitiesPopup(true)} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all">Choose Amenities</button>
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
            <div className="relative bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-gray-900">Select Amenities</h3>
                <button onClick={() => setShowAmenitiesPopup(false)}><X size={24} className="text-gray-400" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {AMENITIES_LIST.map((amenity) => (
                  <button key={amenity.id} type="button" onClick={() => toggleAmenity(amenity.id)} className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${selectedAmenities.includes(amenity.id) ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-100 bg-white text-gray-600'}`}>
                    <span className="text-xl">{amenity.icon}</span>
                    <span className="font-bold text-sm">{amenity.name}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setShowAmenitiesPopup(false)} className="w-full mt-8 bg-green-700 text-white font-bold py-4 rounded-2xl">Confirm Selection</button>
            </div>
          </div>
        )}
        <Footer />
      </main>
    </ProtectedRoute>
  );
}
