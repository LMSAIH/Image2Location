import { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import axios from 'axios'
import { BiTrash } from "react-icons/bi";

interface Location {
    latitude: number;
    longitude: number;
    country: string;
    city: string;
    province: string;
    imageUrl: string;
    user: string;
    id: string;
}

export default function LocationsList() {
    const [currentPage, setCurrentPage] = useState(1)
    const locationsPerPage = 6
    const [locations, setLocations] = useState<Location[] | null>(null);

    useEffect(() => {

        const getLocations = async () => {
            try {
                const response = await axios.get('http://localhost:8000/locations', { withCredentials: true });
                setLocations(response.data.locations.reverse());

            } catch (err) {
                console.log(err);
            }
        }

        getLocations();

    }, []);

    const handleDelete = async (id:string) => {

        try{
           
            setLocations((locations?.filter((location) => location.id !== id) || null));
            const response = await axios.delete(`http://localhost:8000/location/${id}`,{withCredentials:true})
            
        } catch(err){
            console.log(err)
        }
    }

    const indexOfLastLocation = currentPage * locationsPerPage;
    const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
    const currentLocations = locations ? locations.slice(indexOfFirstLocation, indexOfLastLocation) : [];
    const totalPages = locations ? Math.ceil(locations.length / locationsPerPage) : 0;

    return (
        <div className="min-h-screen text-white p-8">
            <header className="mb-12">
            <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Your Locations:</h1>
            </header>

            {locations ? (
                <div className="flex flex-row justify-center gap-4 sm:gap-10 flex-wrap w-full">
                    {currentLocations.map((location, index) => (

                        <div
                            key={location.city + index}
                            className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 cursor-pointer hover:scale-105 duration-300 relative"
                        >
                            <Link className="w-full h-full" to={`/location/${location.id}`}>
                                <div className="relative h-48">
                                    <img
                                        src={location.imageUrl}
                                        alt={`${location.city}, ${location.country}`}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold mb-2">{location.city}</h2>
                                    <p className="text-gray-400 mb-1">
                                        {location.province}, {location.country}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Lat: {location.latitude.toFixed(4)}, Long: {location.longitude.toFixed(4)}
                                    </p>
                                </div>
                            </Link>
                            <BiTrash className="absolute right-5 bottom-5 z-10 size-6 hover:text-red-500" onClick={()=>{handleDelete(location.id)}}/>
                        </div>

                    ))}
                </div>
            ) : (
                <p className="text-center">Loading locations...</p>
            )}

            {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center space-x-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="hover:cursor-pointer px-4 py-2 bg-cyan-400 text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-gray-400">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="hover:cursor-pointer px-4 py-2 bg-cyan-400 text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

