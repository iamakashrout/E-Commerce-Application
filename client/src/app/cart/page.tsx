'use client'
import { CartItem } from "@/types/cart"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import apiClient from "@/utils/axiosInstance";

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const token = useSelector((data: RootState) => data.userState.token);
    const user = useSelector((data: RootState) => data.userState.userEmail);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await apiClient.get(`/cart/getCartDetails/${user}`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
                  console.log('Cart: ', response.data);
                  if(response.data.success){
                    setCartItems(response.data.data.items);
                  }
                  else{
                    console.error('Failed to fetch cart:', response.data.error);
                  }
            } catch (err: any) {
                console.error("Fetch error:", err);
            }
        }
        fetchCart();
    }, []);

    const handleDeleteFromCart = async (item: CartItem) => {
        try {
            const response = await apiClient.post(`/cart/removeFromCart`, {
                user,
                productId: item.productId,
                quantity: item.quantity,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                alert('Product removed from cart successfully!');
                setCartItems((prevItems) => prevItems.filter((cartItem) => cartItem.productId !== item.productId));
            } else {
                console.error('Failed to delete item from cart:', response.data.error);
                alert('Failed to remove product from cart.');
            }
        } catch (err: any) {
            console.error("Delete error:", err);
            alert('An error occurred while removing the product from the cart.');
        }
    };

    return (
        <div>
            <h1>Cart Items</h1>
             <div>
                        {cartItems.length === 0 ? (
                      <p>Cart is empty!</p> // Display loading message if products are still being fetched
                    ) : (
                        cartItems.map((item: CartItem, index: number) => (
                        <div key={index}>
                          <h2>{item.productId}</h2>
                          <p>{item.quantity}</p>
                          <button onClick={() => handleDeleteFromCart(item)}>
                                Remove
                        </button>
                        </div>
                      ))
                    )}
                    </div>
        </div>
    )
}