import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../services/api";

export default function useMemories(params = {}) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const paramsKey = JSON.stringify(params);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/memories", { params });
      setMemories(data.memories);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
    // paramsKey intentionally represents the value identity of params.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  useEffect(() => {
    load();
  }, [load]);

  const updateMemory = useCallback((updated) => {
    setMemories((items) =>
      items.map((item) => (item._id === updated._id ? updated : item))
    );
  }, []);

  const removeMemory = useCallback((id) => {
    setMemories((items) => items.filter((item) => item._id !== id));
  }, []);

  return {
    memories,
    setMemories,
    loading,
    pagination,
    reload: load,
    updateMemory,
    removeMemory
  };
}
