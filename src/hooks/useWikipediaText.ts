import { useEffect, useState, useCallback, useRef } from 'react';

const useWikipediaText = () => {
  const [wikiText, setWikiText] = useState<string>('');
  const hasFetched = useRef(false); // Track if the fetch has occurred

  const fetchRandomArticle = useCallback(async () => {
    const { extract } = await (
      await fetch(`https://en.wikipedia.org/api/rest_v1/page/random/summary`)
    ).json();
    setWikiText(extract);
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchRandomArticle();
      hasFetched.current = true; // Set to true after the first fetch
    }
  }, [fetchRandomArticle]);

  return { wikiText, refetch: fetchRandomArticle };
};

export { useWikipediaText };
