import { useState, type ChangeEvent, type FormEvent } from "react"
import axios from 'axios'
import { Maps } from "../components/Maps"
import { LocationInformation } from "../components/LocationInformation"


export default function Homepage() {

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [location, setLocation] = useState<any | null>(null)
    const [error, setError] = useState<null | any>(null)

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0])
        }
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!selectedFile) return

        setIsLoading(true)

        try {

            const formData = new FormData()
            formData.append('image', selectedFile)

            const response = await axios.post(
                "http://localhost:8000/addImage",
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )

            setLocation(response.data)
            setError(null)
            console.log(response.data)

        } catch (error: any) {
            console.error("Error processing image:", error)
            setError(error.response.data.detail)

        } finally {
            setIsLoading(false)

        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
            <main className="w-3/4">
                <h1 className="text-4xl font-bold mb-6 text-center">AI Image to Location Visualizer</h1>

                <section className="mb-12 text-center">
                    <p className="text-lg mb-4">Upload an image and discover details about the location it depicts.</p>
                    <p className="text-gray-400">
                        Our AI analyzes your image to provide information about the place, landmarks, and more.
                    </p>
                </section>

                <form onSubmit={handleSubmit} className="mb-12">
                    <div className="flex flex-col items-center space-y-4">
                        <label
                            htmlFor="image-upload"
                            className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-[#2dd4bf] transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-gray-400 mb-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                            <span className="text-gray-500">Click to upload or drag and drop</span>
                            <input id="image-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>
                        {selectedFile && <p className="text-sm text-gray-400">Selected: {selectedFile.name}</p>}
                        <button
                            type="submit"
                            disabled={!selectedFile || isLoading}
                            className="w-full py-2 px-4 bg-[#2dd4bf] hover:bg-[#14b8a6] text-black font-medium rounded-lg transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Processing..." : "Analyze Image"}
                        </button>
                        {error && <p className="text-white text-center text-lg bg-red-500 p-2 rounded-md mt-10"> {error}</p>}
                    </div>
                </form>

                {location && (
                    <section className="bg-[#111111] border border-[#222222] rounded-xl p-6 shadow-xl">
                        <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>
                        <div className="space-y-3">
                            <p>
                                <strong>Location: {location.country}, {location.province}, {location.city} </strong>
                            </p>
                            <Maps lat={location.latitude} lng={location.longitude} />
                            <LocationInformation city={location.city} country = {location.country} province= {location.province}/> 
                        </div>
                    </section>
                )}
            </main>
        </div>
    )
}

