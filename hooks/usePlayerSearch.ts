// hooks/usePlayerSearch.ts
import { useState, useCallback, useEffect } from 'react';
import { Player } from "@/store/slices/matchScoringSlice";
import { useDebounce } from './useDebounce';

export const usePlayerSearch = (searchService: (query: string) => Promise<Player[]>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  const handleSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchService(query);
      setSuggestions(results);
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [searchService]);

  useEffect(() => {
    handleSearch(debouncedSearch);
  }, [debouncedSearch, handleSearch]);

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
  };

  return {
    searchQuery,
    setSearchQuery,
    suggestions,
    loading,
    clearSearch
  };
};