'use client';

import { RootState } from "@/app/redux/store";
import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";
import apiClient from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';

// // Function to fetch cart details and get recommendations
// const fetchCartAndRecommendations = async (user: string) => {
//     try {
//       // Step 1: Fetch cart details
//       const cartResponse = await axios.get(`/cart/getCartDetails/${user}`);
//       const cartItems: CartItem[] = cartResponse.data;

//       if (!cartItems || cartItems.length === 0) {
//         console.log("Cart is empty.");
//         return;
//       }

//       console.log("Cart Items:", cartItems);

//       // Step 2: Extract product names
//       const productNames = cartItems.map((item) => item.name);

//       // Step 3: Fetch recommendations for each product
//       const allRecommendations: Product[] = [];

//       for (const productName of productNames) {
//         try {
//           const recommendationsResponse = await axios.get('http://localhost:5000/recommendations', {
//             params: {
//               item_name: productName,
//               top_n: 4,
//             },
//           });

//           if (recommendationsResponse.data.success) {
//             console.log(`Recommendations for ${productName}:`, recommendationsResponse.data.recommendations);
//             allRecommendations.push(...recommendationsResponse.data.recommendations);
//           } else {
//             console.error(`Failed to fetch recommendations for ${productName}:`, recommendationsResponse.data.message);
//           }
//         } catch (err: any) {
//           console.error(`Error fetching recommendations for ${productName}:`, err);
//         }
//       }

//       // Step 4: Handle all recommendations (e.g., set state or update UI)
//       console.log("All Recommendations:", allRecommendations);
//       // You can now use `allRecommendations` to update your state or display the results

//     } catch (err: any) {
//       console.error("Error fetching cart details:", err);
//     }
//   };

export default function RecommendList() {
  const [allRecommendations, setAllRecommendations] = useState<Product[]>([]);
  // const [recommendations, setRecommendations] = useState<Product[]>([]);
  const token = useSelector((data: RootState) => data.userState.token);
  const user = useSelector((data: RootState) => data.userState.userEmail);
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const cartResponse = await apiClient.get(`/cart/getCartDetails/${user}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const cartItems: CartItem[] = cartResponse.data.data.items;
        console.log(cartResponse.data.data.items);
        if (!cartItems || cartItems.length === 0) {
          console.log("Cart is empty.");
          return;
        }

        console.log("Cart Items:", cartItems);

        const productNames = cartItems.map((item) => item.name);
        

        for (const productName of productNames) {
          try {
            console.log("productname", productName);
            const recommendationsResponse = await axios.get('http://localhost:5000/recommendations', {
              params: {
                item_name: productName,
                top_n: 4,
              },
            });

            if (recommendationsResponse.data.success) {
              console.log(`Recommendations for ${productName}:`, recommendationsResponse.data.recommendations);
              allRecommendations.push(...recommendationsResponse.data.recommendations);
              setAllRecommendations([
                ...allRecommendations, 
                ...recommendationsResponse.data.recommendations
              ]);
              
              

            } else {
              console.error(`Failed to fetch recommendations for ${productName}:`, recommendationsResponse.data.message);
            }
          } catch (err: any) {
            console.error(`Error fetching recommendations for ${productName}:`, err);
          }
        }

        // Step 4: Handle all recommendations (e.g., set state or update UI)
        console.log("All Recommendations:", allRecommendations);
        // You can now use `allRecommendations` to update your state or display the results

      } catch (err: any) {
        console.error("Error fetching cart details:", err);
      }
    };
    fetchRecommendations();
  }, [token, user]);

  return (
    <div>
      <h1>Recommendations</h1>
      <div>
        {allRecommendations.length === 0 ? (
          <p>Loading recommendations...</p>
        ) : (
          <div>
            <h1>recommended products</h1>
            {allRecommendations.map((rec: Product, index: number) => (
              <div key={index}>
                <h2>{rec.name}</h2>
                <p>${rec.price}</p>
                <p>Stock: {rec.stock}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};





