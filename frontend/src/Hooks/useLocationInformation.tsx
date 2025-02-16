import { useState } from 'react';

export const useLocationInfo = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<string>('');

  

  const getLocationInfo = async (city: string, province: string, country: string) => {
    setLoading(true);
    setError(null);
    setStream('');

    const eventSource = new EventSource(
      `http://localhost:8000/locationInfo?city=${encodeURIComponent(city)}&province=${encodeURIComponent(province)}&country=${encodeURIComponent(country)}`,
      { withCredentials: true }
    );

    eventSource.onmessage = (event) => {
      if (event.data) {
        setStream(prev => {
          const parsedContent = event.data;
          return prev + parsedContent;
        });
      }
    };

    eventSource.addEventListener('complete', (event) => {
     setStream(event.data)
      eventSource.close();
      setLoading(false);
    });

    eventSource.addEventListener('error', () => {
      setError('Failed to fetch location information');
      eventSource.close();
      setLoading(false);
    });

    eventSource.onerror = () => {
      setError('Connection error');
      eventSource.close();
      setLoading(false);
    };
  };

  return { loading, error, stream, getLocationInfo };
};