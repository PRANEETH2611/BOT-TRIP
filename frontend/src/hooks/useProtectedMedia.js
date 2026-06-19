import { useEffect, useState } from "react";
import api from "../services/api";

export default function useProtectedMedia(memoryId) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(Boolean(memoryId));
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!memoryId) return undefined;
    const controller = new AbortController();

    setLoading(true);
    setError(false);
    api
      .get(`/memories/${memoryId}/media-token`, { signal: controller.signal })
      .then(({ data }) => setUrl(data.url))
      .catch((requestError) => {
        if (requestError.code !== "ERR_CANCELED") setError(true);
      })
      .finally(() => setLoading(false));

    return () => {
      controller.abort();
    };
  }, [memoryId]);

  return { url, loading, error };
}
