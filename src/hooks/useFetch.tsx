const useFetch = () => {
  const fetchHandler = async (endpoint: string, params: any) => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    try {
      const res = await fetch(`${API_URL}/${endpoint}`, params);
      const rawData = await res.json();

      return rawData;
    } catch (err) {
      console.error(new Error(`${err}`));

      throw err;
    }
  }

  return fetchHandler;
};

export default useFetch;
