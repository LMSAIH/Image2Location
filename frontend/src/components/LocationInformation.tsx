import { useLocationInfo } from "../Hooks/useLocationInformation";
import { useEffect } from "react";

interface LocationInformationProps {
  city: string;
  province: string;
  country: string;
}

export function LocationInformation({ city, province, country }: LocationInformationProps) {
  const { error, loading, stream, getLocationInfo } = useLocationInfo();

  useEffect(() => {
    if (city && province && country) {
      getLocationInfo(city, province, country);
    }
  }, [city, province, country]);

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-900/20">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      {loading && (
        <div className="space-y-6 animate-pulse">
          <div className="h-6 w-3/4 bg-gray-700 rounded"></div>
          <div className="space-y-4">
            <div className="h-5 w-1/2 bg-gray-700 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 w-5/6 bg-gray-700/50 rounded"></div>
              <div className="h-4 w-4/6 bg-gray-700/50 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-700/50 rounded"></div>
            </div>
          </div>
        </div>
      )}
      {!loading && stream && (
        <div className="space-y-4">
          {stream.split('\n').map((line, index) => {
            const formatText = (text: string) => {
              const parts = text.split(/(\*\*.*?\*\*)/g);
              return parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <span key={i} className="text-white font-bold animate-fade-in">
                      {part.replace(/\*\*/g, '')}
                    </span>
                  );
                }
                return part;
              });
            };

            if (index === 0) {
              return (
                <p key={index} className="font-bold text-lg ">
                  {formatText(line)}
                </p>
              );
            }

            if (line.startsWith("**") && line.endsWith("**")) {
              return (
                <h3 key={index} className="text-xl font-bold text-blue-400 mt-6">
                  {line.replace(/\*\*/g, '')}
                </h3>
              );
            } else if (line.startsWith("^-")) {
              return (
                <li key={index} className="ml-4 list-disc ">
                  {formatText(line.replace('^-', '').trim())}
                </li>
              );
            } else {
              return (
                <p key={index} className="pl-4 ">
                  {formatText(line)}
                </p>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}