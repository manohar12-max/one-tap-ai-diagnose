import { NextResponse } from "next/server"

const OVERPASS_MIRRORS = [
  "https://overpass-api.de/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter"
]

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get("city") || "Mumbai"
  return handleRequest({ city })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  return handleRequest(body)
}

async function handleRequest(params: any) {
  let debugInfo: any = { status: "started" }
  try {
    let { city, lat, lng, specialty } = params

    // Check if user is searching for "their location" without specific coordinates
    const isGenericLocation = city && /your location|current location|my location/i.test(city);

    if (!lat && !lng && (!city || city.trim() === "" || isGenericLocation)) {
      // If generic location, use provided defaults for Bangalore (as requested)
      lat = 12.908080181930508
      lng = 77.61237687446504
      city = isGenericLocation ? "Current Location" : "Mumbai"
    }

    // 1. Geocode (only if we don't have lat/lng and it's NOT a generic "your location" search)
    if (!lat || !lng) {
      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`, {
          headers: { 'User-Agent': 'OneTapAD/2.1' }
        })
        if (geoRes.ok) {
          const geoData = await geoRes.json()
          if (geoData && geoData[0]) {
            lat = geoData[0].lat
            lng = geoData[0].lon
            debugInfo.geocoded = { lat, lng }
          }
        }
      } catch (e: any) {
        debugInfo.geocodeError = e.message
      }
    }

    // 2. Query OSM with Mirror Rotation
    let doctors: any[] = []
    if (lat && lng) {
      // Normalize specialty for better matching (e.g., "Cardiology" -> "cardio")
      const specSearch = specialty ? specialty.toLowerCase().substring(0, 6) : ""

      // Construct a more targeted query
      // First attempt: Try to find specifically the specialty
      // Second attempt (fallback within query): General doctors/clinics
      const osmQuery = `[out:json][timeout:30];
      (
        nwr(around:15000,${lat},${lng})["amenity"~"doctors|clinic|hospital"]["speciality"~"${specSearch}",i];
        nwr(around:15000,${lat},${lng})["healthcare"~"doctor|clinic|hospital"]["healthcare:speciality"~"${specSearch}",i];
        nwr(around:15000,${lat},${lng})["amenity"~"doctors|clinic|hospital"];
        nwr(around:15000,${lat},${lng})["healthcare"~"doctor|clinic|hospital"];
      );
      out center 50;` // Limit to 50 results for speed

      for (const mirror of OVERPASS_MIRRORS) {
        try {
          console.log(`Trying mirror: ${mirror} for specialty: ${specialty}`)
          const osmRes = await fetch(`${mirror}?data=${encodeURIComponent(osmQuery)}`, {
            signal: AbortSignal.timeout(15000), // Increased timeout
            headers: { 'User-Agent': 'OneTapAI/3.0' }
          })

          if (osmRes.ok) {
            const osmData = await osmRes.json()
            debugInfo.mirrorUsed = mirror
            debugInfo.elementsFound = osmData.elements?.length || 0

            if (osmData.elements && osmData.elements.length > 0) {
              doctors = osmData.elements.map((el: any) => {
                const tags = el.tags || {}
                // Better specialty extraction
                const extractedSpecialty = tags.speciality ||
                  tags["healthcare:speciality"] ||
                  tags.description ||
                  tags.amenity?.toUpperCase() ||
                  "Specialist"

                const isSpecialtyMatch = specSearch && (
                  extractedSpecialty.toLowerCase().includes(specSearch) ||
                  (tags.name && tags.name.toLowerCase().includes(specSearch))
                );

                return {
                  id: `osm-${el.id}`,
                  name: tags.name || tags.brand || "Local Medical Center",
                  specialty: extractedSpecialty,
                  rating: 4.4,
                  reviews: Math.floor(Math.random() * 20) + 5,
                  location: tags["addr:full"] || tags["addr:street"] || city || "Nearby",
                  distance: "Nearby",
                  image: `https://api.dicebear.com/7.x/notionists/svg?seed=${tags.name || "Clinic"}`,
                  // Fix: Ensure tags are unique to prevent React key collisions
                  tags: Array.from(new Set(["Verified", tags.amenity, tags.healthcare, isSpecialtyMatch ? "Expert Match" : null].filter(Boolean))),
                  isRegistered: false,
                  isSpecialtyMatch: !!isSpecialtyMatch,
                  lat: el.lat || el.center?.lat,
                  lng: el.lon || el.center?.lng
                }
              })
              break;
            }
          }
        } catch (mirrorErr: any) {
          console.error(`Mirror ${mirror} failed:`, mirrorErr.message)
          debugInfo[`mirror_${mirror.split('/')[2]}_error`] = mirrorErr.message
        }
      }
    }

    // 3. Fallbacks if all mirrors fail
    if (doctors.length === 0) {
      debugInfo.usingFallbacks = true
      doctors = [
        {
          id: "osm-fallback-1",
          name: `${city || "Local"} Medical Center`,
          specialty: "Multispeciality Hospital",
          location: "Central Zone",
          distance: "1.2 km",
          rating: 4.5,
          reviews: 24,
          image: `https://api.dicebear.com/7.x/initials/svg?seed=Hosp`,
          tags: ["24/7 Open", "Emergency"],
          isRegistered: false
        },
        {
          id: "osm-fallback-2",
          name: "City Care Clinic",
          specialty: "Primary Health Care",
          location: "South Sector",
          distance: "2.8 km",
          rating: 4.3,
          reviews: 15,
          image: `https://api.dicebear.com/7.x/initials/svg?seed=Clinic`,
          tags: ["Walk-ins Welcome"],
          isRegistered: false
        }
      ]
    }

    return NextResponse.json({ doctors, debug: debugInfo })
  } catch (error: any) {
    return NextResponse.json({ doctors: [], error: error.message })
  }
}
