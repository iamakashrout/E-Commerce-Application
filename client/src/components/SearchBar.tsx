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
            console.log("userId from Redux:", user);
            const response = await axios.post('http://localhost:5000/api/search/getSearches', {
                userId: user, 
                query: lowerCase,
            });
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

    const handleSuggestionClick = (suggestion: string) => {
        setInputText(suggestion);
        setSuggestions([]); // Clear suggestions when a suggestion is clicked
    };

    return (
        <div className="main" style={{ position: 'relative', width: '100%' }}>
            <h1>React Search</h1>
            <div className="search" style={{ position: 'relative' }}>
                <TextField
                    id="outlined-basic"
                    onChange={inputHandler}
                    onBlur={saveSearch} // Save search on blur
                    variant="outlined"
                    fullWidth
                    label="Search"
                    value={inputText}
                    onFocus={() => inputText && suggestions.length > 0 && setSuggestions(suggestions)} // Show suggestions on focus
                />
                {suggestions.length > 0 && (
                    <ul className="suggestions" style={styles.suggestions}>
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                style={styles.suggestionItem}
                                onMouseDown={() => handleSuggestionClick(suggestion)} // Use onMouseDown to prevent blur from hiding suggestions
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <List input={inputText} />
        </div>
    );
}

export default SearchBar;

const styles = {
    suggestions: {
        position: 'absolute' as 'absolute',
        top: '100%', // Position below the input field
        left: 0,
        width: '100%',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '4px',
        zIndex: 1000,
        listStyle: 'none',
        margin: 0,
        padding: '8px 0',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    suggestionItem: {
        padding: '8px 16px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    suggestionItemHover: {
        backgroundColor: '#f0f0f0',
    },
};
