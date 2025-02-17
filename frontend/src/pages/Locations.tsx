import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LocationInformation } from "../components/LocationInformation";
import { Maps } from "../components/Maps";
interface LocationType {
    id: string;
    latitude: number;
    longitude: number;
    country: string;
    province: string;
    city: string;
    imageUrl: string;
    user: string;
}

export default function Location() {
    const { id } = useParams<{ id: string }>();
    const [location, setLocation] = useState<LocationType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const getLocation = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://localhost:8000/location/${id}`, {
                    withCredentials: true,
                });
                setLocation(response.data);
            } catch (err: any) {
                setError(err.response?.data?.detail || "Error fetching location");
            } finally {
                setLoading(false);
            }
        };

        getLocation();
    }, [id]);

    return (
        <div className="p-4">
            {loading && <p className="text-white text-center text-xl"> Loading location...</p>}
            {location &&
                <div className="w-3/4 m-auto mt-10 ">
                    <h1 className="text-white text-xl"> {location.city}, {location.province}, {location.country}.</h1>
                    <Maps lat={location.latitude} lng={location.longitude} />
                    <LocationInformation city={location.city} province={location.province} country={location.country} />
                </div>
            }

        </div>
    );
}