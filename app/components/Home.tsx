"use client"

import React, { useState } from "react"
import VideoForm from "./VideoForm"
import axios from "axios"

// Define the interface for video format
interface Format {
  url: string
  quality: string
  format: string
  resolution: string
  hasAudio: boolean
  hasVideo: boolean
}

const Home: React.FC = () => {
  const [videoInfo, setVideoInfo] = useState<Format[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Function to handle video download request
  const handleDownload = async (url: string) => {
    setIsLoading(true)
    try {
      const response = await axios.post("/api/download", { url })
      const filteredFormats = filterMp4Formats(response.data.formats)
      setVideoInfo(filteredFormats)
    } catch (error) {
      console.error("Error downloading video", error)
    }
    setIsLoading(false)
  }

  // Filter and select appropriate formats
  const filterMp4Formats = (formats: Format[]): Format[] => {
    const mp4Formats: Format[] = []
    const seenQualities: Set<string> = new Set()

    // Select audio-inclusive formats
    formats.forEach((format) => {
      if (
        (format.format.toLowerCase() === "mp4" ||
          format.format.toLowerCase() === "ts") &&
        !seenQualities.has(format.quality)
      ) {
        if (format.hasAudio) {
          mp4Formats.push(format)
          seenQualities.add(format.quality)
        }
      }
    })

    // Select unique quality formats
    formats.forEach((format) => {
      if (
        format.format.toLowerCase() === "mp4" &&
        !seenQualities.has(format.quality)
      ) {
        mp4Formats.push(format)
        seenQualities.add(format.quality)
      }
    })

    return mp4Formats
  }

  // Function to trigger direct download
  const handleDirectDownload = (formatUrl: string) => {
    const link = document.createElement("a")
    link.href = formatUrl
    link.setAttribute("download", "")
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        YouTube Video Downloader
      </h1>
      <VideoForm onSubmit={handleDownload} isLoading={isLoading} />
      {videoInfo && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Download Links
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {videoInfo.map((format, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-md p-4 transition-transform transform hover:scale-105"
              >
                {format.format.toLowerCase() === "ts" ||
                format.format.toLowerCase() === "aac" ? (
                  <div>
                    <div className="mb-2">
                      <span className="text-lg font-semibold">Audio Only</span>
                    </div>
                    <button
                      onClick={() => handleDirectDownload(format.url)}
                      className="text-blue-500 hover:text-blue-700 block"
                    >
                      Download
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="mb-2">
                      <span className="text-lg font-semibold">
                        {format.quality || "Unknown"}
                      </span>
                      {format.hasAudio && (
                        <span className="text-gray-600"> (Audio Included)</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDirectDownload(format.url)}
                      className="text-blue-500 hover:text-blue-700 block"
                    >
                      Download Video {format.format}{" "}
                      {format.hasAudio ? "" : "(No Audio)"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
