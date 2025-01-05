import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiClient from '@/utils/axiosInstance';

interface SearchBarProps {
  userId: string;
}

export default function SearchBar({ userId }: SearchBarProps) {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const { data } = await apiClient.get('/search/getPastSearches', { params: {userId, query}});
        setSuggestions(data);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceFetch); // Debounce API calls
  }, [query, userId]);

  // Store search term on selection
  const handleSearchSelect = async (searchTerm: string) => {
    setQuery(searchTerm);
    setSuggestions([]);
    try {
        const response = await apiClient.post('/search/storeSearch', {userId, searchTerm});
        console.log(response);
    } catch (err) {
      console.error('Error storing search term:', err);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products..."
      />
      {loading && <p>Loading...</p>}
      {suggestions.length > 0 ? (
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index}>
              {suggestion}
            </li>
          ))}
        </ul>
      ) : (
        <p onClick={() => handleSearchSelect(query)}>{query}</p>
      )}
    </div>
  );
};





// import { RootState } from "@/app/redux/store";
// import React, { useState } from 'react';
// import axios from 'axios';
// import TextField from '@mui/material/TextField';
// import List from './List';
// import { useSelector } from "react-redux";

// function SearchBar() {
//     const [inputText, setInputText] = useState('');
//     const [savedSearches, setSavedSearches] = useState<string[]>([]);
//     const [filteredProducts, setFilteredProducts] = useState([]);
//     const [showOverlay, setShowOverlay] = useState(false);
//     const user = useSelector((data: RootState) => data.userState.userEmail);

//     const fetchSavedSearches = async () => {
//         try {
//             const response = await axios.post('http://localhost:5000/api/search/getSearches', {
//                 userId: user,
//             });
//             setSavedSearches(response.data.searches || []);
//         } catch (error) {
//             console.error('Error fetching saved searches:', error);
//         }
//     };

//     // const fetchFilteredProducts = async (query: string) => {
//     //     try {
//     //         const response = await axios.post('http://localhost:5000/api/products/filterProducts', {
//     //             query,
//     //         });
//     //         setFilteredProducts(response.data.products || []);
//     //     } catch (error) {
//     //         console.error('Error fetching filtered products:', error);
//     //     }
//     // };

//     const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const query = e.target.value.toLowerCase();
//         setInputText(query);
//         // fetchFilteredProducts(query);
//         setShowOverlay(true);
//     };

//     const handleFocus = () => {
//         fetchSavedSearches(); // Fetch saved searches when search bar is focused
//         setShowOverlay(true);
//     };

//     const handleBlur = () => {
//         setTimeout(() => setShowOverlay(false), 150); // Delay to allow clicks on suggestions
//     };

//     const saveSearch = async () => {
//         try {
//             if (inputText.trim() !== '') {
//                 await axios.post('http://localhost:5000/api/search/saveSearch', {
//                     userId: user,
//                     query: inputText,
//                 });
//             }
//         } catch (error) {
//             console.error('Error saving search:', error);
//         }
//     };

//     return (
//         <div className="main bg-white text-black">
//             <h1>React Search</h1>
//             <div className="search">
//                 <TextField
//                     id="outlined-basic"
//                     onChange={inputHandler}
//                     onFocus={handleFocus}
//                     onBlur={handleBlur}
//                     variant="outlined"
//                     fullWidth
//                     label="Search"
//                     value={inputText}
//                 />
//                 {showOverlay && (
//                     <div className="overlay">
//                         <ul className="saved-searches">
//                             {savedSearches.map((search, index) => (
//                                 <li key={index} onClick={() => setInputText(search)}>
//                                     {search}
//                                 </li>
//                             ))}
//                         </ul>
//                         <ul className="filtered-products">
//                             {filteredProducts.map((product: any, index: number) => (
//                                 <li key={index}>
//                                     <strong>{product.name}</strong> - {product.category} - ${product.price}
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}
//             </div>
//             <List input={inputText} />
//         </div>
//     );
// }

// export default SearchBar;
