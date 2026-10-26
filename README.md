# 🌦️ Weather Transformer GAN

> Transform any outdoor scene into a different weather condition using AI — powered by InstructPix2Pix and Stable Diffusion.

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat&logo=pytorch&logoColor=white)
![Hugging Face](https://img.shields.io/badge/Hugging%20Face-FFD21E?style=flat&logo=huggingface&logoColor=black)
![Flask](https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=white)
![Google Colab](https://img.shields.io/badge/Google%20Colab-F9AB00?style=flat&logo=googlecolab&logoColor=black)

---

## ✨ What It Does

Upload a photo of any outdoor scene and choose a target weather condition. The model rewrites the lighting, atmosphere, and environment to match — rain-soaked streets, snowfall, golden-hour glow, or a stormy sky — without changing the underlying scene structure.

**Supported weather conditions:**

| Condition | Effect |
|-----------|--------|
| 🌧️ Rainy | Wet streets, puddles, falling rain |
| ❄️ Snowy | Snow cover, snowflakes, winter palette |
| 🌫️ Foggy | Dense fog, low visibility, misty atmosphere |
| ⛈️ Stormy | Dark clouds, dramatic sky, lightning |
| ☀️ Sunny | Clear sky, strong sunlight, vibrant colors |
| ☁️ Cloudy | Overcast gray clouds |
| 🌅 Sunset | Warm orange and pink golden-hour glow |
| 🌙 Night | Dark sky, artificial lighting, moonlight |

---

## 🏗️ Architecture

The project is split into two parts:

```
┌─────────────────────────┐         ┌──────────────────────────────┐
│   Frontend (PHP + JS)   │         │   Backend (Google Colab)     │
│                         │         │                              │
│  • Upload image         │──POST──▶│  • InstructPix2Pix model     │
│  • Select weather       │         │  • Flask REST API            │
│  • Show before/after    │◀──JSON──│  • GPU inference (CUDA)      │
│  • Download result      │         │  • ngrok public tunnel       │
└─────────────────────────┘         └──────────────────────────────┘
```

The Colab notebook runs the model on a free GPU, exposes a Flask API, and tunnels it to a public URL via ngrok. The frontend sends the image as base64, gets back the transformed image, and displays a side-by-side comparison.

---

## 🚀 Getting Started

### 1. Run the Backend (Google Colab)

1. Open `weather_transformer.ipynb` in [Google Colab](https://colab.research.google.com/)
2. Set the runtime to **GPU** (Runtime → Change runtime type → T4 GPU)
3. Get a free ngrok auth token from [dashboard.ngrok.com](https://dashboard.ngrok.com/get-started/your-authtoken)
4. Run all cells in order:
   - **Cell 1** — installs dependencies
   - **Cell 2** — imports libraries
   - **Cell 3** — loads `timbrooks/instruct-pix2pix` (~5–10 min on first run)
   - **Cell 4** — defines weather prompts
   - **Cell 5** — image processing helpers
   - **Cell 6** — creates Flask API
   - **Cell 7** — paste your ngrok token, start the server
5. Copy the public ngrok URL printed in Cell 7's output

### 2. Configure the Frontend

Open `js/script.js` and replace the API URL at the top:

```js
// Line 6 — paste your ngrok URL here
const API_URL = 'https://YOUR-NGROK-URL.ngrok-free.app';
```

### 3. Serve the Frontend

Any PHP-capable server works. For local development:

```bash
cd weather-transformer
php -S localhost:8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 📋 Requirements

### Backend (Colab notebook)
- Google Colab account (free tier works)
- ngrok account (free)
- Dependencies installed automatically by Cell 1:
  ```
  diffusers  transformers  accelerate
  torch  torchvision  flask  flask-cors
  pyngrok  pillow  numpy
  ```

### Frontend
- PHP 7.4+ (or any static file server)
- Modern browser (Chrome, Firefox, Safari, Edge)

---

## 📁 Project Structure

```
weather-transformer/
├── index.php           # Main UI — upload, weather selector, results
├── js/
│   └── script.js       # API calls, image handling, UI logic
├── css/
│   └── style.css       # Styles
└── uploads/
    └── .htaccess       # Disables directory listing

weather_transformer.ipynb  # Colab notebook — model + Flask API
```

---

## 🔌 API Reference

The Flask server exposes two endpoints:

### `GET /health`
Returns model and GPU status.
```json
{
  "status": "healthy",
  "gpu_available": true,
  "gpu_name": "Tesla T4",
  "model_loaded": true
}
```

### `POST /transform`
Transforms an image to a target weather condition.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,/9j/...",
  "weather": "rainy"
}
```

**Response:**
```json
{
  "success": true,
  "transformed_image": "data:image/jpeg;base64,/9j/..."
}
```

---

## ⚠️ Notes

- **Image size**: Upload limit is 5MB. Larger images are resized before inference.
- **Inference time**: ~20–60 seconds on a T4 GPU depending on image size.
- **ngrok URL changes** every time you restart the Colab session — remember to update `API_URL` in `script.js`.
- The model performs best on outdoor scenes with clear sky, buildings, or landscapes. Portraits and indoor scenes may give unexpected results.

---

## 🧠 Model

This project uses [`timbrooks/instruct-pix2pix`](https://huggingface.co/timbrooks/instruct-pix2pix) — a fine-tuned Stable Diffusion model that follows text editing instructions to modify images. Weather conditions are applied by passing descriptive transformation prompts to the model at inference time.

---

## 📄 License

MIT
