'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/utils/axiosInstance';
import { Product } from '@/types/product';
import { AiOutlineHistory } from 'react-icons/ai';
import { BsMic, BsMicMute } from 'react-icons/bs';

interface SearchBarProps {
  userId: string;
  onSearch: (query: string) => void;
  products: Product[];
}

interface CombinedSuggestion {
  name: string;
  isCached: boolean;
}

// Extend the Window interface
// interface Window {
//   SpeechRecognition?: typeof SpeechRecognition;
//   webkitSpeechRecognition?: typeof SpeechRecognition;
// }

export default function SearchBar({ userId, onSearch, products }: SearchBarProps) {
  const [query, setQuery] = useState<string>('');
  const [combinedSuggestions, setCombinedSuggestions] = useState<CombinedSuggestion[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query) {
        setCombinedSuggestions([]);
        return;
      }
      try {
        const { data } = await apiClient.get<string[]>('/search/getPastSearches', {
          params: { userId, query },
        });
        console.log('Cached Suggestions:', data);

        // Filter product suggestions
        const productMatches = products
          .filter((product) => product.name.toLowerCase().startsWith(query.toLowerCase()))
          .map((product) => ({ name: product.name, isCached: false }));

        // Combine and remove duplicates
        const combined = [
          ...data.map((item) => ({ name: item, isCached: true })),
          ...productMatches.filter((product) => !data.includes(product.name)),
        ];

        setCombinedSuggestions(combined);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    };

    const debounceFetch = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceFetch); // Debounce API calls
  }, [query, userId, products]);

  // Store search term on selection
  const handleSearchSelect = async (searchTerm: string) => {
    setCombinedSuggestions([]);
    if (searchTerm.length > 0) {
      try {
        const response = await apiClient.post('/search/storeSearch', { userId, searchTerm });
        console.log(response);
      } catch (err) {
        console.error('Error storing search term:', err);
      }
    }
    onSearch(searchTerm);
    setQuery('');
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Web Speech API is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Event Handlers
    recognition.onstart = () => {
      console.log('Speech recognition started.');
      setIsListening(true);
    };

    recognition.onend = () => {
      console.log('Speech recognition ended.');
      setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const speechQuery = event.results[0][0].transcript;
      console.log('Recognized speech:', speechQuery);
      setQuery(speechQuery);
      handleSearchSelect(speechQuery);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const error = event.error;
      console.error('Speech recognition error:', error);

      if (error !== 'aborted') {
        setIsListening(false);
      }

      recognition.stop();
    };

    // Toggle Microphone
    if (isListening) {
      console.log('Stopping speech recognition.');
      recognition.stop();
    } else {
      console.log('Starting speech recognition.');
      recognition.start();
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="flex items-center border border-gray-300 rounded-lg shadow-sm p-2 bg-white">
        <input
          className="flex-grow px-4 py-2 text-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
        />
        <button
          onClick={() => handleSearchSelect(query)}
          className="px-4 py-2 bg-[#4cd7d0] hover:bg-[#a4e8e0] text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
        >
          Search
        </button>
        <button
          onClick={handleVoiceSearch}
          className="ml-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
        >
          {isListening ? <BsMicMute className="text-red-500" /> : <BsMic className="text-gray-600" />}
        </button>
      </div>

      {combinedSuggestions.length > 0 && (
        <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {combinedSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSearchSelect(suggestion.name)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
            >
              {suggestion.isCached && (
                <AiOutlineHistory className="mr-2 text-gray-500" />
              )}
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
