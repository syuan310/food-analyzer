# Food Analyzer Web App (Gemini Cloud)

This is a minimal web app that analyzes food photos using **Google Gemini Pro Vision**.

## Features
- 📷 Upload food photos
- 📏 Use your fist width as a scale (optional)
- ☁️ **Powered by Google Gemini** (Fast & Free Tier available)
- 🍎 Clean, Apple-inspired interface

## Prerequisites
- **Node.js**: [Download](https://nodejs.org/)
- **Gemini API Key**: [Get one for free here](https://aistudio.google.com/app/apikey)

## Getting Started

1.  **Set up API Key:**
    - Create a file named `.env` in the project root.
    - Add your Gemini API key:
      ```env
      VITE_GEMINI_API_KEY=your_actual_key_here
      ```
    - [Get a free Gemini Key here](https://aistudio.google.com/app/apikey)

2.  **Start the Web App:**
    ```bash
    cd food-analyzer
    npm install
    npm run dev
    ```

3.  **Open in Browser:**
    - Go to `http://localhost:3000`.
    - (Optional) Enter your fist width.
    - Upload a photo and click "Analyze Food".

## Privacy Note
This version uses the cloud-based Gemini API. Your images are sent to Google for analysis but are not stored by this application.
