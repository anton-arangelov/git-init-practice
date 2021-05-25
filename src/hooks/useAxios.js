import { useState } from "react";

const useAxios = (requestConfig, applyData, postFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const sendRequest = async () => {
    setLoading(true)
    try {
      const response = await requestConfig.func(
        requestConfig.url,
        requestConfig.body ? requestConfig.body : null
      );
      const data = response;
      applyData(data);
    } catch (error) {
      console.log(error)
      setError(error)
      postFunction(error)
    }
    setLoading(false);
  };
  return {
    loading: loading,
    error: error,
    sendRequest: sendRequest,
    postFunction: postFunction
  };
};

export default useAxios;