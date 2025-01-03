import axios from 'axios';

const searchProducts = async (query: string) => {
    try {
        const response = await axios(`http://localhost:5000/api/products/searchProduct?query=${encodeURIComponent(query)}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch products');
        }
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
};

export default searchProducts;
