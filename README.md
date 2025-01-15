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

### 3. Voice Search

### 4. 📊 Summary of Sentiment of Users' Reviews
- Using **NLTK Sentiment Intensity Analyzer Model** to summarize sentiments.

### 5. 💬 Users Chat Directly with Sellers
- Real-time chat powered by **Websockets**.

### 6. 📈 Detailed Sales Stats for Sellers
- Sellers can view in-depth statistics about their sales performance.

### 7. ✉️ Email Verification through OTP
- Secure email verification using **Nodemailer** and **Gmail**.

### 8. 🔍 Caching of Past Searches
- Past searches are cached and recommended as the user types a query.

### 9. 🔗 Matching Search Queries with Products
- Products are recommended dynamically as the user types (using **string matching**).

### 10. 🤖 AI Chatbot
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

### Customer Portal Features:

<img width="1454" alt="Screenshot 2025-01-15 at 9 39 15 AM" src="https://github.com/user-attachments/assets/100c779a-be32-423e-86a1-af5514a0f9ca" />

<img width="1456" alt="Screenshot 2025-01-15 at 9 40 38 AM" src="https://github.com/user-attachments/assets/4b45d9fe-493b-4fde-865e-20496514d384" />

<img width="1446" alt="Screenshot 2025-01-15 at 9 41 30 AM" src="https://github.com/user-attachments/assets/c09aedd3-d5e4-40ae-83a7-fd78078924f0" />

<img width="1453" alt="Screenshot 2025-01-15 at 9 43 01 AM" src="https://github.com/user-attachments/assets/6d0a0fe7-57c8-4d64-a081-6359057d768f" />

<img width="1446" alt="Screenshot 2025-01-15 at 9 43 16 AM" src="https://github.com/user-attachments/assets/2c0e2fc3-6e57-4a62-a0f3-223b81d43393" />

<img width="1449" alt="Screenshot 2025-01-15 at 9 44 00 AM" src="https://github.com/user-attachments/assets/2e7c2498-cc7a-40a1-b957-7ce89d8bd5ac" />

<img width="1452" alt="Screenshot 2025-01-15 at 9 44 17 AM" src="https://github.com/user-attachments/assets/f02e2e59-cdf8-41d6-9590-432b92ed9a8f" />

<img width="1458" alt="Screenshot 2025-01-15 at 9 44 45 AM" src="https://github.com/user-attachments/assets/3ea158ec-5e6c-4b7c-8e40-1d88d8780f73" />

<img width="1461" alt="Screenshot 2025-01-15 at 9 45 28 AM" src="https://github.com/user-attachments/assets/afd8f978-edac-45e4-8cf7-2e003d674a4b" />

### Seller Portal Features

<img width="1449" alt="Screenshot 2025-01-15 at 9 48 00 AM" src="https://github.com/user-attachments/assets/d98a69a7-c220-414d-90e4-c3d3adca9a87" />

<img width="1440" alt="Screenshot 2025-01-15 at 9 48 29 AM" src="https://github.com/user-attachments/assets/7cdac9c2-86bb-4da0-acf2-7f58458327a8" />

<img width="1444" alt="Screenshot 2025-01-15 at 9 48 57 AM" src="https://github.com/user-attachments/assets/8c936b46-772f-455a-a0a2-dd3a11a0d7e8" />

<img width="1440" alt="Screenshot 2025-01-15 at 9 49 48 AM" src="https://github.com/user-attachments/assets/b305720c-7f06-48ed-9ed8-22637461e46b" />

<img width="1444" alt="Screenshot 2025-01-15 at 9 50 23 AM" src="https://github.com/user-attachments/assets/542bf100-768a-4a00-b267-4bf0469ae5b4" />

### ⚙️Installation and Setup

## 1. Clone the Repository

```git clone <your-forked-repo-link>```

## 2. Using Docker (Recommended)

Make sure you have Docker and Docker Compose installed and set up.
1. Build and start the containers
```docker-compose up --build```

2. Access the services:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Flask Server: http://localhost:8000

3. Stop the containers
```docker-compose down```

## 3. Local Setup (Manual)

## Backend Setup

- ```cd server```
- ```npm install```
- ```npm run dev```

## Frontend Setup

- ```cd client```
- ```npm install```
- ```npm run dev```

## Flask server Setup

- ```cd model```
- ```pip install -r requirements.txt```
- ```python run.py```

### See deployed site!



