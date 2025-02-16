import { useState, useRef, useEffect } from 'react';

export const useLocationInfo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<string>('');
  const eventSourceRef = useRef<EventSource | null>(null);

  const getLocationInfo = async (city: string, province: string, country: string) => {

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setLoading(true);
    setError(null);
    setStream('');

    const url = `http://localhost:8000/locationInfo?city=${encodeURIComponent(
      city
    )}&province=${encodeURIComponent(province)}&country=${encodeURIComponent(country)}`;

    const es = new EventSource(url, { withCredentials: true });
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      setStream((prev) => prev + event.data);
    };

    es.onerror = (event) => {

      if (es.readyState === 0) {
        es.close()
        setLoading(false);
      } else {
        setError('Connection error. Attempting to reconnect...');
      }
    };

    es.onopen = () => {
      setLoading(false);
      setError(null);
    };

    useEffect(() => {
      return () => {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }
      };
    }, []);

  };

  return { loading, error, stream, getLocationInfo };
};