// 'use client'
// import React, { useState, useEffect } from 'react';
// import apiClient from '@/utils/axiosInstance';
// import { Product } from '@/types/product';

// interface SearchBarProps {
//   userId: string;
//   onSearch: (query: string) => void;
//   products: Product[];
// }

// export default function SearchBar({ userId, onSearch, products }: SearchBarProps) {
//   const [query, setQuery] = useState<string>('');
//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const [productSuggestions, setProductSuggestions] = useState<string[]>([]);

//   // Fetch suggestions
//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       if (!query) {
//         setSuggestions([]);
//         setProductSuggestions([]);
//         return;
//       }
//       try {
//         const { data } = await apiClient.get('/search/getPastSearches', { params: {userId, query}});
//         console.log(data);
//         setSuggestions(data);
//       } catch (err) {
//         console.error('Error fetching suggestions:', err);
//       }

//       // Filter product suggestions
//     const productMatches = products
//     .filter((product) =>
//       product.name.toLowerCase().startsWith(query.toLowerCase())
//     )
//     .slice(0, 5) // Get top 5 matches
//     .map((product) => product.name);

//     setProductSuggestions(productMatches);
//     };

//     const debounceFetch = setTimeout(fetchSuggestions, 300);
//     return () => clearTimeout(debounceFetch); // Debounce API calls
//   }, [query, userId, products]);

//   // Store search term on selection
//   const handleSearchSelect = async (searchTerm: string) => {
//     setSuggestions([]);
//     if(searchTerm.length > 0){
//         try {
//             const response = await apiClient.post('/search/storeSearch', {userId, searchTerm});
//             console.log(response);
//         } catch (err) {
//           console.error('Error storing search term:', err);
//         }
//     }
//     onSearch(searchTerm);
//     setQuery('');
//   };

//   return (
//     <div className="relative w-full max-w-md mx-auto">
//       <div className="flex items-center border border-gray-300 rounded-lg shadow-sm p-2 bg-white">
//         <input
//           className="flex-grow px-4 py-2 text-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search for products..."
//         />
//         <button
//           onClick={() => handleSearchSelect(query)}
//           className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           Search
//         </button>
//       </div>

//       {suggestions.length > 0 && (
//         <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
//           {suggestions.map((suggestion, index) => (
//             <li
//               key={index}
//               onClick={() => handleSearchSelect(suggestion)}
//               className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
//             >
//               {suggestion}
//             </li>
//           ))}
//         </ul>
//       )}

//       {productSuggestions.length > 0 && (
//         <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
//           {productSuggestions.map((suggestion, index) => (
//             <li
//               key={index}
//               onClick={() => handleSearchSelect(suggestion)}
//               className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
//             >
//               {suggestion}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };





'use client'
import React, { useState, useEffect } from 'react';
import apiClient from '@/utils/axiosInstance';
import { Product } from '@/types/product';
import { AiOutlineHistory } from 'react-icons/ai';
interface SearchBarProps {
  userId: string;
  onSearch: (query: string) => void;
  products: Product[];
}

export default function SearchBar({ userId, onSearch, products }: SearchBarProps) {
  const [query, setQuery] = useState<string>('');
  const [combinedSuggestions, setCombinedSuggestions] = useState<{ name: string; isCached: boolean }[]>([]);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query) {
        setCombinedSuggestions([]);
        return;
      }
      try {
        const { data } = await apiClient.get('/search/getPastSearches', { params: { userId, query } });
        console.log('Cached Suggestions:', data);

        // Filter product suggestions
        const productMatches = products
          .filter((product) => product.name.toLowerCase().startsWith(query.toLowerCase()))
          .map((product) => ({ name: product.name, isCached: false }));

        // Combine and remove duplicates
        const combined = [
          ...data.map((item: string) => ({ name: item, isCached: true })),
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
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
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
                <AiOutlineHistory className="mr-2 text-gray-500" /> // History icon
              )}
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
