// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import TextField from '@mui/material/TextField';
// import List from './List';

// function SearchBar() {
//     const [inputText, setInputText] = useState("");
//     let inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
//         //convert input text to lower case
//         var lowerCase = e.target.value.toLowerCase();
//         setInputText(lowerCase);
//     };

//     return (
//         <div className="main">
//             <h1>React Search</h1>
//             <div className="search">
//                 <TextField
//                     id="outlined-basic"
//                     onChange={inputHandler}
//                     variant="outlined"
//                     fullWidth
//                     label="Search"
//                 />
//             </div>
//             <List input={inputText} />
//         </div>
//     );
// };

// export default SearchBar;

import { RootState } from "@/app/redux/store";
import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import List from './List';
import { useSelector } from "react-redux";

function SearchBar() {
    const [inputText, setInputText] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const user = useSelector((data: RootState) => data.userState.userEmail);
    const inputHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);

        // Fetch suggestions from the backend
        try {
            const response = await axios.post('http://localhost:5000/api/search/getSearches', {
                params: { userId: user, query: lowerCase },
            });
            console.log("user", user);
            console.log('Suggestions:', response.data.searches);
            setSuggestions(response.data.searches);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const saveSearch = async () => {
        try {
            await axios.post('http://localhost:5000/api/search/saveSearch', {
                userId: user, 
                query: inputText,
            });
        } catch (error) {
            console.error('Error saving search:', error);
        }
    };

    return (
        <div className="main">
            <h1>React Search</h1>
            <div className="search">
                <TextField
                    id="outlined-basic"
                    onChange={inputHandler}
                    onBlur={saveSearch} // Save search on blur
                    variant="outlined"
                    fullWidth
                    label="Search"
                    value={inputText}
                />
                {suggestions.length > 0 && (
                    <ul className="suggestions">
                        {suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                        ))}
                    </ul>
                )}
            </div>
            <List input={inputText} />
        </div>
    );
}

export default SearchBar;
