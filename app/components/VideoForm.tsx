import React, { useState, FC, FormEvent } from "react"
import Loader from "./Loader"

interface VideoFormProps {
  onSubmit: (url: string) => void
  isLoading: boolean
}

const VideoForm: FC<VideoFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(url)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto bg-white p-6 rounded-md shadow-md"
    >
      <div className="mb-4">
        <label
          htmlFor="url"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          YouTube URL
        </label>
        <input
          type="text"
          id="url"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="Enter YouTube URL"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white font-bold rounded-md shadow-md hover:bg-blue-600 transition-colors flex items-center justify-center"
        disabled={isLoading}
      >
        {isLoading ? <Loader /> : "Download"}
      </button>
    </form>
  )
}

export default VideoForm
