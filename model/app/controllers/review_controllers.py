from flask import request, jsonify
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import string
import nltk
nltk.download('stopwords')
nltk.download('vader_lexicon')
nltk.download('punkt_tab')
nltk.download('wordnet')

def analyze_reviews():
    data=request.json
    reviews = data.get("reviews", [])

    if not reviews:
        return jsonify({"success": False, "message": "No reviews provided"})
    
    sia = SentimentIntensityAnalyzer()
    sentiments = {"positive": 0, "neutral": 0, "negative": 0}
    total_rating = 0
    total_reviews = len(reviews)

    for review in reviews:
        raw_text = review.get("reviewText", "")
        rating = review.get("rating", 0)
        total_rating += rating

        # Preprocess the review text
        processed_text = preprocess_text(raw_text)

        # Sentiment analysis
        sentiment_score = sia.polarity_scores(processed_text)
        if sentiment_score['compound'] > 0.1:
            sentiments["positive"] += 1
        elif sentiment_score['compound'] < -0.1:
            sentiments["negative"] += 1
        else:
            sentiments["neutral"] += 1

    # Calculate averages
    average_rating = total_rating / total_reviews if total_reviews > 0 else 0

    # Generate a textual summary
    summary = "The product has generally received "
    if sentiments["positive"] > sentiments["negative"]:
        summary += "positive feedback. "
    elif sentiments["negative"] > sentiments["positive"]:
        summary += "negative feedback. "
    else:
        summary += "mixed feedback. "

    summary += f"The average rating is {average_rating:.2f}, based on {total_reviews} reviews."

    analysis = {
        "total_reviews": total_reviews,
        "average_rating": average_rating,
        "positive": sentiments["positive"],
        "neutral": sentiments["neutral"],
        "negative": sentiments["negative"],
        "textual_summary": summary,
    }

    return jsonify({"success": True, "data": analysis})




# Preprocess Text Function
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

def preprocess_text(text):
    # Lowercase the text
    text = text.lower()
    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    # Tokenize the text
    tokens = word_tokenize(text)
    # Remove stopwords and lemmatize
    tokens = [lemmatizer.lemmatize(word) for word in tokens if word not in stop_words]
    # Join the tokens back to form the processed text
    return ' '.join(tokens)