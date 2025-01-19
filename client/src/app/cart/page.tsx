'use client';

// import { useRouter } from 'next/router';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/types/cart';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import apiClient from '@/utils/axiosInstance';
import { Product } from '@/types/product';
import Navbar from '@/components/Navbar';
import Image from 'next/image';

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const token = useSelector((data: RootState) => data.userState.token);
    const user = useSelector((data: RootState) => data.userState.userEmail);
    const router = useRouter();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await apiClient.get(`/cart/getCartDetails/${user}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    setCartItems(response.data.data.items);
                } else {
                    console.error('Failed to fetch cart:', response.data.error);
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error('Fetch error:', err.message);
                } else {
                    console.error('An unknown error occurred:', err);
                }
            }
        };

        fetchCart();
    }, [user, token]);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const productDetailsPromises = cartItems.map(async (item) => {
                    const response = await apiClient.get(`/products/getProductById/${item.productId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.data.success) {
                        return response.data.data;
                    } else {
                        console.error(`Failed to fetch product details for product ID: ${item.productId}`);
                        return null;
                    }
                });

                const fetchedProducts = await Promise.all(productDetailsPromises);
                console.log('fetched products', fetchedProducts);
                setProducts(fetchedProducts.filter((product) => product !== null));
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.log('Error fetching product details: ', err.message);
                } else {
                    console.error('An unknown error occurred:', err);
                }
            }
        };
        if (cartItems.length > 0) {
            fetchProductDetails();
        }
    }, [cartItems, token]);

    const handleSelectItem = (item: CartItem) => {
        if (selectedItems.find((selected) => selected.productId === item.productId)) {
            setSelectedItems(selectedItems.filter((selected) => selected.productId !== item.productId));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    const handleRemoveItem = async (item: CartItem) => {
        try {
            const response = await apiClient.post(`/cart/removeFromCart`, {
                user, productId: item.productId, quantity: item.quantity
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setCartItems(cartItems.filter((cartItem) => cartItem.productId !== item.productId));
            } else {
                console.error('Failed to remove item from cart:', response.data.error);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error('Error removing item from cart:', err.message);
            } else {
                console.error('An unknown error occurred:', err);
            }
        }
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert('Please select at least one product to place an order.');
            return;
        }
        router.push(`/checkout?items=${encodeURIComponent(JSON.stringify(selectedItems))}`);
    };

    return (
        <main className='dark:bg-black min-h-screen overflow-hidden'>
            <Navbar />
            <div className="p-5">
                <h1 className="text-center text-3xl font-bold mb-5 dark:text-custom-teal">Cart Items</h1>
                <div>
                    {cartItems?.length === 0 ? (
                        <p className="text-center text-gray-800 text-2xl font-semibold dark:text-custom-light-teal">Cart is empty!</p>
                    ) : (
                        cartItems?.map((item: CartItem, index: number) => {
                            const product = products.find((prod) => prod.id === item.productId);
                            const imageUrl = product?.images?.[0]; // Get the first image URL
                            return (
                                <div
                                    key={index}
                                    className="flex bg-custom-light-teal items-center justify-between border border-black rounded-lg p-4 mb-4 dark:bg-custom-teal"
                                >
                                    {/* Product Info */}
                                    <div className="flex-1 mr-5">
                                        <div className="flex items-center mb-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.some(
                                                    (selected) => selected.productId === item.productId
                                                )}
                                                onChange={() => handleSelectItem(item)}
                                                className="mr-3"
                                            />
                                            <h2 className="text-lg font-bold">{item.name}</h2>
                                        </div>
                                        <p className="text-gray-700 mb-1 font-semibold">Quantity: {item.quantity}</p>
                                        <p className="text-gray-700 mb-1 font-semibold">
                                            Price: ${item.price.toFixed(2)}
                                        </p>
                                        <p className="text-gray-800 mb-3 font-bold">
                                            Net: ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                        <button
                                            onClick={() => handleRemoveItem(item)}
                                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition font-bold"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    {/* Product Image */}
                                    {imageUrl && (
                                        <Image
                                            src={imageUrl}
                                            alt={item.name}
                                            width={160} // Adjust width to match `w-40` (40 x 4 = 160px)
                                            height={160} // Adjust height to match `h-40` (40 x 4 = 160px)
                                            className="object-cover rounded-lg"
                                        />
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Total Amount */}
                <div className="flex mt-4 text-2xl font-bold dark:text-custom-teal">
                    <p>
                        Total: $
                        {selectedItems
                            .reduce((total, item) => total + item.price * item.quantity, 0)
                            .toFixed(2)}
                    </p>
                </div>

                {/* Checkout Button */}
                <div className="text-center mt-5">
                    <button
                        onClick={() => handleCheckout()}
                        disabled={selectedItems.length === 0}
                        className={`py-2 px-5 rounded-lg font-bold text-white transition ${selectedItems.length > 0
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-gray-300 cursor-not-allowed'
                            }`}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </main>
    );
}
