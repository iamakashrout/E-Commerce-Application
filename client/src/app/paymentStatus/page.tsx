'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { clearOrder } from '../redux/features/orderSlice';
import apiClient from '@/utils/axiosInstance';

export default function PaymentStatus() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const [paymentStatus, setPaymentStatus] = useState<"succeeded" | "failed" | null>(null);
  const payload = useSelector((data: RootState) => data.orderState);
  // console.log(payload);
  const token = useSelector((data: RootState) => data.userState.token);
  const dispatch = useDispatch();
  const [orderId, setOrderId]=useState('');

  // Prevent double execution using ref
  const hasPlacedOrder = useRef(false);

  useEffect( () => {
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
    <main style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Payment {paymentStatus === "succeeded" ? "Succeeded" : "Failed"}</h1>
      {paymentStatus === "succeeded" ? (
        <div>
          <p>Thank you for your payment. Your transaction has been completed successfully.</p>
          <button onClick={() => router.push(`/orderDetails?orderId=${orderId}`)}>View Order Details</button>
        </div>
      ) : (
        <p>We encountered an issue processing your payment. Please try again or contact support.</p>
      )}
    </main>
  );
}
