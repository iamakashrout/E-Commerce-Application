# SwiftShop 🛍️

Welcome to **SwiftShop**, your one-stop e-commerce solution! SwiftShop offers a seamless and personalized shopping experience, enabling users to browse, purchase, and review products with ease.

## 🚀 Striking Features

### 1. 🌟 Product Recommendation
- Suggesting products based on items in your cart and past orders.
- **Sentence Transformers** to generate embeddings.
- **Cosine Similarity** to find distances between embeddings.

### 2. ✍️ Submit Product Reviews
- Write and submit reviews for products you’ve ordered.
- Rate products to help other customers make informed decisions.
- View reviews (and summarized analysis of reviews) from other users for better insights.

### 3. 📊 Summary of Sentiment of Users' Reviews
- Using **NLTK Sentiment Intensity Analyzer Model** to summarize sentiments.

### 4. 💬 Users Chat Directly with Sellers
- Real-time chat powered by **Websockets**.

### 5. 📈 Detailed Sales Stats for Sellers
- Sellers can view in-depth statistics about their sales performance.

### 6. ✉️ Email Verification through OTP
- Secure email verification using **Nodemailer** and **Gmail**.

### 7. 🔍 Caching of Past Searches
- Past searches are cached and recommended as the user types a query.

### 8. 🔗 Matching Search Queries with Products
- Products are recommended dynamically as the user types (using **string matching**).

### 9. 🤖 AI Chatbot
- Powered by **Gemini Pro** with custom context tailored for e-commerce.

## 🛒 Customer Side Features

1. Verify email using OTP during registration.
2. See recommended products.
3. Search for products.
4. Buy products (Stripe integration).
5. Add products to the cart.
6. Chat with sellers.
7. Receive notifications for incoming messages.
8. Submit product reviews.
9. View profile (addresses, order history, cart items, notifications).
10. Use the AI chatbot for queries (Gemini).
11. Enjoy **Dark Mode** for a comfortable shopping experience.

## 🛍️ Seller Side Features

1. Add products.
2. Modify product details.
3. View detailed sales statistics.

## 🛠️ Tech Used

1. **MongoDB** for the database.
2. **Next.js** for the frontend.
3. **Redux** for state management across pages and components.
4. **Gemini Pro** for the chatbot.
5. **Flask** for recommendations and review analysis models.
6. **Nodemailer** for email verification.
7. **Redis** for caching searches.

---

Thank you for choosing **SwiftShop**! Happy shopping! 🛒✨

### ⚙️Installation and Setup

1. Clone the Repository

```git clone <your-forked-repo-link>```

2. Using Docker (Recommended)

Make sure you have Docker installed and set up.

```docker-compose up```

3. Local Setup (Manual)

If you prefer to set up the project manually:

## Backend Setup

```cd server```
```npm install```
```npm run dev```

## Frontend Setup

```cd client```
```npm install```
```npm run dev```

## Flask server Setup

```cd model```
```pip install -r requirements.txt```
```python run.py```

