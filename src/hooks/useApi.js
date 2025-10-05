import { useState, useCallback } from "react";
import axios from "axios";


const useApi = (url) => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (method, endpoint = "", payload = null, config = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios({
          method,
          url: `${url}${endpoint}`,
          data: payload,
          ...config,
        });
        setData(response.data);
        return response.data;
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        throw err; // Re-throw to allow caller to handle
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  const get = useCallback(
    (endpoint = "", config = {}) => fetchData("get", endpoint, null, config),
    [fetchData]
  );
  const post = useCallback(
    (endpoint = "", payload, config = {}) =>
      fetchData("post", endpoint, payload, config),
    [fetchData]
  );
  const put = useCallback(
    (endpoint = "", payload, config = {}) =>
      fetchData("put", endpoint, payload, config),
    [fetchData]
  );
  const del = useCallback(
    (endpoint = "", config = {}) => fetchData("delete", endpoint, null, config),
    [fetchData]
  );

  return { data, loading, error, get, post, put, del, setData };
};

export default useApi;
