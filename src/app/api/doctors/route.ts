import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Haversine formula to calculate distance in KM
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1); 
}

const DOCTOR_PHOTOS = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
];

export async function POST(req: Request) {
  try {
    const { specialty, lat, lng, city } = await req.json();

    const userLat = lat || 28.6139;
    const userLng = lng || 77.2090;

    // --- STEP 1: FETCH REGISTERED DOCTORS FROM PRISMA ---
    const localDoctors = await prisma.user.findMany({
      where: {
        role: "DOCTOR",
        isDetailsFilled: true,
        OR: [
          { specialty: { contains: specialty, mode: "insensitive" } },
          { city: { contains: city || "", mode: "insensitive" } }
        ]
      } as any,
      take: 5
    }) as any[];

    const formattedLocalDoctors = localDoctors.map((doc, index) => ({
      id: doc.id,
      name: doc.name,
      specialty: doc.specialty || "Specialist",
      rating: 4.9, // Registered doctors get premium ratings
      reviews: Math.floor(Math.random() * 50) + 100,
      experience: `${doc.experience || 10}+ Years`,
      location: doc.clinicName ? `${doc.clinicName}, ${doc.city}` : `${doc.city || "Local Clinic"}`,
      distance: "Consultant",
      image: DOCTOR_PHOTOS[index % DOCTOR_PHOTOS.length],
      tags: ["One-Tap Verified", "Available Now", "Direct Booking"],
      isRegistered: true,
      phone: doc.mobile
    }));

    // --- STEP 2: FETCH OSM DOCTORS AS FALLBACK ---
    const overpassQuery = `[out:json][timeout:25];(node["amenity"~"doctors|hospital|clinic"](around:15000,${userLat},${userLng}););out body;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
    
    let osmDoctors: any[] = [];
    try {
      const response = await fetch(url, { headers: { "User-Agent": "OneTapDiagnosisAI/1.0" } });
      if (response.ok) {
        const data = await response.json();
        osmDoctors = data.elements
          .filter((el: any) => el.tags && el.tags.name)
          .map((el: any, index: number) => {
            const distance = getDistance(userLat, userLng, el.lat, el.lon);
            return {
              id: el.id.toString(),
              name: el.tags.name,
              specialty: el.tags.speciality || specialty || "Medical Center",
              rating: (4.2 + Math.random() * 0.6).toFixed(1),
              reviews: Math.floor(Math.random() * 150) + 20,
              experience: "Verified Provider",
              location: [el.tags["addr:street"], el.tags["addr:city"]].filter(Boolean).join(", ") || "Local Area",
              distance: `${distance} km`,
              image: DOCTOR_PHOTOS[(index + 2) % DOCTOR_PHOTOS.length],
              tags: ["Nearby", "OSM Verified"],
              isRegistered: false,
              phone: el.tags.phone
            };
          });
      }
    } catch (e) {
      console.error("OSM Fetch error:", e);
    }

    // Combine: Registered first, then OSM
    const allDoctors = [...formattedLocalDoctors, ...osmDoctors].slice(0, 15);

    return NextResponse.json({ doctors: allDoctors });
  } catch (error) {
    console.error("Hybrid Doctors API Error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
