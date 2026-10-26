<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather Transformer GAN - Deep Learning Project</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="header">
            <div class="header-content">
                <h1 class="title">
                    <span class="icon">🌦️</span>
                    Weather Transformer GAN
                </h1>
                <p class="subtitle">Transform any outdoor scene to different weather conditions using AI</p>
                <div class="tech-badge">
                    <span class="badge">InstructPix2Pix</span>
                    <span class="badge">Hugging Face</span>
                    <span class="badge">Google Colab</span>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Upload Section -->
            <section class="upload-section">
                <div class="upload-card">
                    <h2 class="section-title">1. Upload Image</h2>
                    <div class="upload-area" id="uploadArea">
                        <input type="file" id="fileInput" accept="image/*" hidden>
                        <div class="upload-placeholder" id="uploadPlaceholder">
                            <div class="upload-icon">📸</div>
                            <p class="upload-text">Click to upload or drag and drop</p>
                            <p class="upload-hint">PNG, JPG, JPEG (Max 5MB)</p>
                        </div>
                        <img id="previewImage" class="preview-image" style="display: none;">
                    </div>
                </div>

                <!-- Weather Selection -->
                <div class="weather-card">
                    <h2 class="section-title">2. Select Weather</h2>
                    <div class="weather-grid">
                        <button class="weather-btn" data-weather="rainy">
                            <span class="weather-icon">🌧️</span>
                            <span class="weather-label">Rainy</span>
                        </button>
                        <button class="weather-btn" data-weather="snowy">
                            <span class="weather-icon">❄️</span>
                            <span class="weather-label">Snowy</span>
                        </button>
                        <button class="weather-btn" data-weather="foggy">
                            <span class="weather-icon">🌫️</span>
                            <span class="weather-label">Foggy</span>
                        </button>
                        <button class="weather-btn" data-weather="stormy">
                            <span class="weather-icon">⛈️</span>
                            <span class="weather-label">Stormy</span>
                        </button>
                        <button class="weather-btn" data-weather="sunny">
                            <span class="weather-icon">☀️</span>
                            <span class="weather-label">Sunny</span>
                        </button>
                        <button class="weather-btn" data-weather="cloudy">
                            <span class="weather-icon">☁️</span>
                            <span class="weather-label">Cloudy</span>
                        </button>
                        <button class="weather-btn" data-weather="sunset">
                            <span class="weather-icon">🌅</span>
                            <span class="weather-label">Sunset</span>
                        </button>
                        <button class="weather-btn" data-weather="night">
                            <span class="weather-icon">🌙</span>
                            <span class="weather-label">Night</span>
                        </button>
                    </div>
                </div>

                <!-- Transform Button -->
                <div class="action-section">
                    <button class="transform-btn" id="transformBtn" disabled>
                        <span class="btn-text">Transform Image</span>
                        <span class="btn-arrow">→</span>
                    </button>
                </div>
            </section>

            <!-- Results Section -->
            <section class="results-section" id="resultsSection" style="display: none;">
                <h2 class="section-title">Results</h2>
                <div class="comparison-container">
                    <div class="image-container">
                        <h3 class="image-label">Original</h3>
                        <img id="originalImage" class="result-image" alt="Original">
                    </div>
                    <div class="divider">
                        <div class="divider-line"></div>
                        <div class="divider-icon">→</div>
                        <div class="divider-line"></div>
                    </div>
                    <div class="image-container">
                        <h3 class="image-label" id="transformedLabel">Transformed</h3>
                        <img id="transformedImage" class="result-image" alt="Transformed">
                    </div>
                </div>
                <div class="result-actions">
                    <button class="download-btn" id="downloadBtn">
                        <span>📥</span> Download Result
                    </button>
                    <button class="reset-btn" id="resetBtn">
                        <span>🔄</span> Transform Another
                    </button>
                </div>
            </section>

            <!-- Loading Overlay -->
            <div class="loading-overlay" id="loadingOverlay" style="display: none;">
                <div class="loading-content">
                    <div class="spinner"></div>
                    <h3 class="loading-title">Transforming Image...</h3>
                    <p class="loading-text" id="loadingText">Initializing GAN model...</p>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                </div>
            </div>

            <!-- Error Message -->
            <div class="error-message" id="errorMessage" style="display: none;">
                <div class="error-content">
                    <span class="error-icon">⚠️</span>
                    <p id="errorText"></p>
                    <button class="error-close" onclick="hideError()">×</button>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <footer class="footer">
            <p>Deep Learning Project | Weather Transformer GAN | Powered by InstructPix2Pix</p>
        </footer>
    </div>

    <script src="js/script.js"></script>
</body>
</html>