export interface Review {
  user: string;
  orderId: string;
  productId: string;
  quantity: number;
  rating: number;
  reviewText?: string;
}
