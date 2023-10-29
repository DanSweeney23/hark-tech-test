import { useEffect, useState } from "react";

const baseUrl = import.meta.env.VITE_API_URL;

export type ConsolidatedDataResponse = {
  energy: {
    timestamp: string,
    time: number,
    consumption: number,
    isAnomaly: number
  }[],
  weather: {
    timestamp: string,
    time: number,
    averagetemperature: number,
    averagehumidity: number
  }[]
};

export function useConsolidatedDataRequest() {
  const url = `${baseUrl}/consolidateddata`;

  const [data, setData] = useState<ConsolidatedDataResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const doRequest = async () => {
    setLoading(true);
    setData(null);
    setError(false);

    try {
      const res = await fetch(url);

      if (!res.ok) setError(true);
      else {
        const json = await res.json();
        setData(json as ConsolidatedDataResponse)
      }
    } catch (err) {
      console.error(err);
      setError(true);
    }

    setLoading(false);
  }

  useEffect(() => {
    doRequest();
  }, []);

  return { data, loading, error, doRequest };
}