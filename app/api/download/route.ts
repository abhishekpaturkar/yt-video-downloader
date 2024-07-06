import { NextRequest, NextResponse } from "next/server"
import { format } from "path"
import ytdl from "ytdl-core"

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    const info = await ytdl.getInfo(url)
    // console.log("All formats:", info.formats) // Log all formats

    const formats = ytdl.filterFormats(info.formats, "video").map((format) => ({
      url: format.url,
      quality: format.qualityLabel || "Unknown",
      format: format.container,
      resolution: format.qualityLabel || "Unknown",
      hasAudio: format.hasAudio,
      hasVideo: format.hasVideo,
    }))

    formats.filter((format) => {
      if (format.format.toLowerCase() === "mp4") {
        return format
      }
    })

    const highQualityAudio = info.formats.find((format) => format.audioQuality)
    // console.log("High quality audio:", highQualityAudio)

    if (highQualityAudio) {
      formats.unshift({
        url: highQualityAudio.url,
        quality: highQualityAudio.qualityLabel || "Unknown",
        format: "ts",
        resolution: highQualityAudio.qualityLabel || "Unknown",
        hasAudio: true,
        hasVideo: false,
      })
    }
    // console.log("Formats:", formats)

    return NextResponse.json({ formats })
  } catch (error) {
    console.error("Error fetching video information:", error)
    return NextResponse.json(
      { error: "Error fetching video information" },
      { status: 500 }
    )
  }
}
