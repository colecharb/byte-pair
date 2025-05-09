import { useEffect, useState, useCallback, useRef } from 'react';

const useText = () => {
  const [text, setText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // New state variable to track loading status
  const hasFetched = useRef(false); // Track if the fetch has occurred

  const fetchRandomArticle = useCallback(async () => {
    setIsLoading(true); // Set loading to true before fetch
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/random/summary`,
    );
    const data = await response.json();
    const { extract } = data;
    setText(extract);
    setIsLoading(false); // Set loading to false after fetch
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchRandomArticle();
      hasFetched.current = true; // Set to true after the first fetch
    }
  }, [fetchRandomArticle]);

  return { text, isLoading, refetch: fetchRandomArticle };
};

export default useText;
