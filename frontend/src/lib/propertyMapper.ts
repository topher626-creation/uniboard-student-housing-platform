import { UPLOADS_BASE } from './config';
import type { ListingProperty } from './types/listing';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80';

const ROOM_TYPE_LABELS: Record<string, string> = {
  SINGLE: 'Single Room',
  BEDSITTER: 'Bedsitter',
  SELF_CONTAINED: 'Self-Contained',
  SHARED: 'Shared Room',
  BANKERS: 'Bankers',
};

function resolveImageUrl(url: string | undefined | null): string {
  if (!url) return PLACEHOLDER_IMAGE;
  if (url.startsWith('http')) return url;
  return `${UPLOADS_BASE}/${url.replace(/^\//, '')}`;
}

function parseDistanceKm(travelTime: string | undefined): number {
  if (!travelTime) return 2;
  const kmMatch = travelTime.match(/([\d.]+)\s*km/i);
  if (kmMatch) return parseFloat(kmMatch[1]);
  const minMatch = travelTime.match(/([\d.]+)\s*min/i);
  if (minMatch) return Math.round(parseFloat(minMatch[1]) / 12 * 10) / 10;
  return 2;
}

function daysSince(dateStr: string | undefined): number {
  if (!dateStr) return 0;
  const created = new Date(dateStr);
  const diff = Date.now() - created.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function averageRating(reviews: Array<{ rating?: number }> | undefined): number {
  if (!reviews?.length) return 4.5;
  const sum = reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

/** Maps Prisma property API response to the listing card UI shape. */
export function mapApiPropertyToListing(raw: Record<string, unknown>): ListingProperty {
  const building = raw.building as Record<string, unknown> | undefined;
  const compound = building?.compound as Record<string, unknown> | undefined;
  const landlord = compound?.user as Record<string, unknown> | undefined;
  const university = raw.university as Record<string, unknown> | undefined;
  const images = (raw.images as Array<{ url?: string }>) ?? [];
  const buildingImages = (building?.images as Array<{ url?: string }>) ?? [];
  const features = (raw.features as Array<{ feature?: { name?: string } }>) ?? [];
  const reviews = (raw.reviews as Array<{ rating?: number }>) ?? [];

  const imageUrl = resolveImageUrl(images[0]?.url ?? buildingImages[0]?.url);
  const landlordName = String(landlord?.fullName ?? compound?.name ?? 'Verified Provider');
  const location = String(compound?.location ?? building?.location ?? 'Zambia');
  const roomTypeRaw = String(raw.roomType ?? building?.roomType ?? 'SINGLE');

  return {
    id: String(raw.id),
    title: String(raw.name ?? building?.name ?? 'Student Accommodation'),
    location,
    university: String(university?.name ?? university?.fullName ?? 'Nearby University'),
    distanceKm: parseDistanceKm(String(raw.travelTime ?? '')),
    price: Number(raw.price ?? building?.price ?? 0),
    roomType: ROOM_TYPE_LABELS[roomTypeRaw] ?? roomTypeRaw,
    rating: averageRating(reviews),
    reviewCount: reviews.length,
    verified: true,
    available: Number(raw.occupiedBeds ?? 0) < Number(raw.totalBeds ?? 1),
    furnished: features.some((f) => f.feature?.name?.toLowerCase().includes('furnish')),
    amenities: features.map((f) => f.feature?.name?.toLowerCase() ?? '').filter(Boolean),
    image: imageUrl,
    imageAlt: `${raw.name ?? 'Property'} — student accommodation in ${location}`,
    landlord: landlordName,
    landlordAvatar: PLACEHOLDER_IMAGE,
    landlordAvatarAlt: `${landlordName} profile`,
    responseRate: 95,
    availableFrom: 'Immediately',
    listedDaysAgo: daysSince(String(raw.createdAt ?? '')),
    bedrooms: Number(raw.totalBeds ?? 1),
    bathrooms: 1,
    description: String(raw.description ?? building?.description ?? ''),
    phone: raw.phone ? String(raw.phone) : undefined,
    whatsapp: raw.whatsapp ? String(raw.whatsapp) : undefined,
  };
}

export function mapApiPropertiesToListings(items: unknown[]): ListingProperty[] {
  return items.map((item) => mapApiPropertyToListing(item as Record<string, unknown>));
}

/** Maps API property to the detail page shape used by property/[id]. */
export function mapApiPropertyToDetail(raw: Record<string, unknown>) {
  const listing = mapApiPropertyToListing(raw);
  const images = (raw.images as Array<{ url?: string }>) ?? [];
  const building = raw.building as Record<string, unknown> | undefined;
  const buildingImages = (building?.images as Array<{ url?: string }>) ?? [];
  const reviews = (raw.reviews as Array<Record<string, unknown>>) ?? [];
  const compound = building?.compound as Record<string, unknown> | undefined;
  const landlord = compound?.user as Record<string, unknown> | undefined;

  const allImages = [...images, ...buildingImages].map((img, idx) => ({
    src: resolveImageUrl(img.url),
    alt: `${listing.title} — photo ${idx + 1}`,
  }));

  if (!allImages.length) {
    allImages.push({ src: listing.image, alt: listing.imageAlt });
  }

  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    campus: listing.university,
    location: listing.location,
    city: listing.location.split(',')[0] ?? 'Zambia',
    price: listing.price,
    type: listing.roomType.toLowerCase().includes('shared')
      ? 'shared'
      : listing.roomType.toLowerCase().includes('self')
        ? 'en-suite'
        : 'private',
    genderPreference: 'mixed' as const,
    distanceFromCampus: String(raw.travelTime ?? `${listing.distanceKm} km`),
    available: listing.available,
    availableSpots: Number(raw.totalBeds ?? 1) - Number(raw.occupiedBeds ?? 0),
    totalSpots: Number(raw.totalBeds ?? 1),
    images: allImages,
    amenities: listing.amenities.map((a) => a.charAt(0).toUpperCase() + a.slice(1)),
    provider: {
      id: String(landlord?.id ?? compound?.userId ?? 'provider'),
      name: listing.landlord,
      compoundName: String(compound?.name ?? listing.landlord),
      phone: listing.phone ?? '+260 970 000 000',
      whatsapp: listing.whatsapp ?? listing.phone ?? '+260970000000',
      email: String(landlord?.email ?? ''),
      verified: true,
      verificationStatus: 'verified' as const,
      totalListings: 1,
      rating: listing.rating,
      joinedDate: String(compound?.createdAt ?? raw.createdAt ?? ''),
      avatar: listing.landlordAvatar,
    },
    rating: listing.rating,
    reviewCount: listing.reviewCount,
    reviews: reviews.map((r, idx) => ({
      id: String(r.id ?? `review-${idx}`),
      authorName: String(r.authorName ?? 'Student'),
      authorAvatar: String(r.authorAvatar ?? listing.landlordAvatar),
      rating: Number(r.rating ?? 5),
      comment: String(r.comment ?? ''),
      date: String(r.date ?? r.createdAt ?? new Date().toISOString()),
      verifiedStay: Boolean(r.verifiedStay),
    })),
    featured: false,
    verified: listing.verified,
    createdAt: String(raw.createdAt ?? ''),
    phone: listing.phone,
    whatsapp: listing.whatsapp,
  };
}
