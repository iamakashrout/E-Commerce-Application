'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { clearOrder } from '../redux/features/orderSlice';
import apiClient from '@/utils/axiosInstance';
import Navbar from '@/components/Navbar';

export default function PaymentStatus() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const [paymentStatus, setPaymentStatus] = useState<"succeeded" | "failed" | null>(null);
  const payload = useSelector((data: RootState) => data.orderState);
  // console.log(payload);
  const token = useSelector((data: RootState) => data.userState.token);
  const dispatch = useDispatch();
  const [orderId, setOrderId] = useState('');

  // Prevent double execution using ref
  const hasPlacedOrder = useRef(false);

  useEffect(() => {
    const placeOrder = async () => {
      try {
        const response = await apiClient.post(`/order/placeOrder`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('frontend', response);
        if (response.data.success) {
          setPaymentStatus("succeeded");
          // console.log('orderId', response.data.data.orderId);
          setOrderId(response.data.data.orderId);
        }
        else {
          setPaymentStatus("failed");
          console.error('Failed to place order:', response.data.error);
          alert('Failed to place order. Please try again.');
        }
      } catch (err: any) {
        setPaymentStatus("failed");
        console.error('Order error:', err);
        alert('An error occurred while placing the order.');
      }
    }
    // Check if order placement has already occurred
    if (!hasPlacedOrder.current && status === 'True') {
      hasPlacedOrder.current = true; // Mark as executed
      placeOrder();
      dispatch(clearOrder());
    } else if (status === 'False') {
      setPaymentStatus('failed');
      dispatch(clearOrder());
    } else {
      setPaymentStatus('succeeded');
    }
  }, [status, payload, token, dispatch]);

  // Conditional rendering based on payment status
  if (paymentStatus === null) {
    return <div>Loading...</div>; // Display a loading message while resolving status
  }

  return (
    <div>
      <Navbar />
      <div className="bg-custom-light-teal p-8 rounded-lg shadow-md mb-6 w-full max-w-3xl mx-auto mt-24 flex flex-col items-center">
      <h1 
  className={`text-3xl font-bold ${
    paymentStatus === "succeeded" ? "text-green-600" : "text-red-600"
  }`}
>
  Status: Payment {paymentStatus === "succeeded" ? "Succeeded" : "Failed"}
</h1>
        <br></br>
        {paymentStatus === "succeeded" ? (
          <div>
            <p className="text-lg font-semibold">Thank you for your payment. Your transaction has been completed successfully.</p>
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-custom-pink rounded-full hover:bg-custom-lavender text-white font-bold transition duration-300"
                onClick={() => router.push(`/orderDetails?orderId=${orderId}`)}
              >
                View Order Details
              </button>
            </div>
          </div>
        ) : (
          <p>We encountered an issue processing your payment. Please try again or contact support.</p>
        )}
      </div>
    </div>
  );
}
