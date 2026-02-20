import React, { useState, useEffect } from 'react';
import ImageUpload from './components/ImageUpload';
import Controls from './components/Controls';
import Results from './components/Results';

// ---------------------------------------------------------
// CONFIGURATION
// ---------------------------------------------------------
const DEFAULT_API_KEY = "";
// ---------------------------------------------------------

function App() {
  const [image, setImage] = useState(null);
  const [fistWidth, setFistWidth] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear result and error when image is removed
  useEffect(() => {
    if (!image) {
      setResult(null);
      setError(null);
    }
  }, [image]);

  // Get API key from environment variables
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const callGemini = async () => {
    // Detect mime type and extract base64 data
    const mimeMatch = image.match(/^data:([^;]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const base64Data = image.split(',')[1];

    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
      throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your .env file.");
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `你是一個營養分析 AI。使用者會提供食物照片。
            
            ${fistWidth ? `照片中提供了一個參考物，其寬度是 ${fistWidth} cm，請以此作為明確的比例尺來估算食物的體積與重量。` : `照片中沒有比例尺，請根據一般常見的食物份量標準進行估算。`}
            
            請辨識食物名稱（含英文名稱在括號內），估算重量，並給出合理的誤差範圍。最後估算熱量以及三大營養素（蛋白質、脂肪、碳水）。
            此外，請提供一段簡短的食物呈現描述，以及一段說明你如何根據照片特徵（及拳頭比例尺，若有提供）來估算重量的邏輯。
            
            輸出格式必須是嚴格的 JSON，包含欄位：
            - food_name (string, 例如: "生雞胸肉 (Chicken Breast)")
            - description (string, 簡短介紹)
            - estimated_weight_g (number)
            - estimated_calories_kcal (number)
            - protein_g (number)
            - fat_g (number)
            - carbs_g (number)
            - error_range (string)
            - estimation_logic (string, 說明預估的邏輯)
            不要輸出任何解釋文字或 Markdown code block，只要純 JSON。` },
            { inline_data: { mime_type: mimeType, data: base64Data } }
          ]
        }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const message = errData.error?.message || response.statusText;
      throw new Error(`Gemini API Error: ${message}`);
    }

    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Incomplete response from Gemini API.");
    }
    return data.candidates[0].content.parts[0].text;
  };

  const handleAnalyze = async () => {
    if (!image) return setError("Please upload an image first.");

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const content = await callGemini();

      try {
        const cleanContent = content.replace(/```json\n ?|\n ? ```/g, '').trim();
        const parsedResult = JSON.parse(cleanContent);
        setResult(parsedResult);
      } catch (parseErr) {
        console.error("JSON Parse Error:", parseErr, content);
        setError("Failed to parse AI response. The response might not be in the correct format.");
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong during analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="app-logo">Food Analyzer</div>

      <main className="main-content">
        <ImageUpload
          image={image}
          onImageChange={setImage}
          isLoading={loading}
        />

        <Controls
          fistWidth={fistWidth}
          setFistWidth={setFistWidth}
          onAnalyze={handleAnalyze}
          isLoading={loading}
          hasImage={!!image}
        />

        <Results data={result} error={error} />
      </main>
    </div>
  );
}

export default App;
