import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const baseUrl = new URL(req.url).origin

    // Call both internal APIs in parallel
    const [osmRes, registeredRes] = await Promise.all([
      fetch(`${baseUrl}/api/doctors/osm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
      fetch(`${baseUrl}/api/doctors/registered`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    ])

    const osmData = osmRes.ok ? await osmRes.json() : { doctors: [], error: "OSM API failed" }
    const registeredData = registeredRes.ok ? await registeredRes.json() : { doctors: [], error: "Registered API failed" }

    // Merge and prioritize registered doctors
    const allDoctors = [
      ...(registeredData.doctors || []),
      ...(osmData.doctors || [])
    ]

    return NextResponse.json({ 
      doctors: allDoctors,
      debug: {
        osm: osmData.debug,
        registered: registeredData.debug
      }
    })
  } catch (error) {
    console.error("Combined Doctors API Error:", error)
    return NextResponse.json({ doctors: [], error: "Failed to fetch doctors" }, { status: 500 })
  }
}
