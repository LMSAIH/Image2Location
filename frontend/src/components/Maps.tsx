interface MapsProps {
    lat: number;
    lng: number;
  }
  
  export function Maps({ lat, lng }: MapsProps) {
    const apiKey = import.meta.env.VITE_MAPS_API_KEY;
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
     
        <div className="h-[300px] w-full">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=15`}
          ></iframe>
        </div>
        
        <div className="h-[300px] w-full">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${lat},${lng}&heading=210&pitch=10&fov=90`}
          ></iframe>
        </div>
      </div>
    );
  }