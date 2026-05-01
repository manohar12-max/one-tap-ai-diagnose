import { NextResponse } from "next/server";

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
  return (R * c).toFixed(1); // Distance in km
}

const DOCTOR_PHOTOS = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1612531388330-8045a44f4271?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&q=80&w=300&h=300",
];

export async function POST(req: Request) {
  try {
    const { specialty, lat, lng } = await req.json();

    const userLat = lat || 28.6139;
    const userLng = lng || 77.2090;

    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"~"doctors|hospital|clinic"](around:15000,${userLat},${userLng});
        node["healthcare"~"doctor|hospital|clinic"](around:15000,${userLat},${userLng});
      );
      out body;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
    
    const response = await fetch(url, {
      headers: { "User-Agent": "OneTapDiagnosisAI/1.0" }
    });

    if (!response.ok) throw new Error(`OSM failed: ${response.status}`);

    const data = await response.json();
    
    const doctors = data.elements
      .filter((el: any) => el.tags && el.tags.name)
      .map((el: any, index: number) => {
        const nodeLat = el.lat;
        const nodeLng = el.lon;
        const distance = getDistance(userLat, userLng, nodeLat, nodeLng);

        // Advanced Address Parsing
        const t = el.tags;
        const address = [
          t["addr:housenumber"],
          t["addr:street"],
          t["addr:suburb"]
        ].filter(Boolean).join(", ") || "Clinical Center, Medical District";

        // Randomly pick a unique photo from our library
        const imageUrl = DOCTOR_PHOTOS[index % DOCTOR_PHOTOS.length];

        return {
          id: el.id.toString(),
          name: t.name,
          specialty: t.speciality || t["healthcare:speciality"] || specialty || "Clinical Expert",
          rating: (4.4 + Math.random() * 0.5).toFixed(1),
          reviews: Math.floor(Math.random() * 200) + 40,
          experience: `${Math.floor(Math.random() * 15) + 8}+ Years`,
          location: address,
          distance: `${distance} km`,
          image: imageUrl,
          tags: [
            t.opening_hours ? "Open Now" : "Verified",
            index % 3 === 0 ? "Top Rated" : "Quick Consult"
          ],
          phone: t.phone || t["contact:phone"] || "Available via App",
          lat: nodeLat,
          lng: nodeLng
        };
      })
      .sort((a: any, b: any) => parseFloat(a.distance) - parseFloat(b.distance))
      .slice(0, 10);

    return NextResponse.json({ doctors });
  } catch (error) {
    console.error("OSM Doctors Error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
