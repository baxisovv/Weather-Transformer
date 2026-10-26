// ============================================
// CONFIGURATION
// ============================================

// ⚠️ IMPORTANT: Replace this with your ngrok URL from Google Colab
const API_URL = 'https://27a4-34-16-246-80.ngrok-free.app'; // Your current URL

// ============================================
// GLOBAL VARIABLES
// ============================================

let uploadedImageBase64 = null;
let selectedWeather = null;
let transformedImageBase64 = null;

// ============================================
// DOM ELEMENTS
// ============================================

const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const previewImage = document.getElementById('previewImage');
const weatherBtns = document.querySelectorAll('.weather-btn');
const transformBtn = document.getElementById('transformBtn');
const resultsSection = document.getElementById('resultsSection');
const originalImage = document.getElementById('originalImage');
const transformedImage = document.getElementById('transformedImage');
const transformedLabel = document.getElementById('transformedLabel');
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingText = document.getElementById('loadingText');
const progressFill = document.getElementById('progressFill');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

// ============================================
// EVENT LISTENERS
// ============================================

// File upload handlers
uploadArea.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', handleFileSelect);

// Drag and drop handlers
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    } else {
        showError('Please upload a valid image file');
    }
});

// Weather selection handlers
weatherBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        weatherBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedWeather = btn.dataset.weather;
        updateTransformButton();
    });
});

// Transform button handler
transformBtn.addEventListener('click', transformImage);

// Download button handler
downloadBtn.addEventListener('click', downloadImage);

// Reset button handler
resetBtn.addEventListener('click', resetApp);

// ============================================
// FILE HANDLING FUNCTIONS
// ============================================

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('Please upload a valid image file');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showError('File size must be less than 5MB');
        return;
    }
    
    // Read file as base64
    const reader = new FileReader();
    reader.onload = (e) => {
        uploadedImageBase64 = e.target.result;
        displayPreview(uploadedImageBase64);
        updateTransformButton();
    };
    reader.onerror = () => {
        showError('Failed to read file');
    };
    reader.readAsDataURL(file);
}

function displayPreview(base64Image) {
    previewImage.src = base64Image;
    previewImage.style.display = 'block';
    uploadPlaceholder.style.display = 'none';
}

// ============================================
// TRANSFORM FUNCTION
// ============================================

async function transformImage() {
    if (!uploadedImageBase64 || !selectedWeather) {
        showError('Please upload an image and select a weather condition');
        return;
    }
    
    // Show loading overlay
    showLoading();
    
    // Simulate progress
    animateProgress();
    
    try {
        // Check API health first
        updateLoadingText('Connecting to API...');
        const healthCheck = await fetch(`${API_URL}/health`, {
            method: 'GET',
            headers: {
                'ngrok-skip-browser-warning': 'true',  // ← FIX: Bypass ngrok warning
                'Content-Type': 'application/json'
            }
        });
        
        if (!healthCheck.ok) {
            throw new Error('API is not responding. Please check if Colab is running.');
        }
        
        const healthData = await healthCheck.json();
        console.log('API Health:', healthData);
        
        // Prepare request data
        updateLoadingText('Preparing image data...');
        const requestData = {
            image: uploadedImageBase64,
            weather: selectedWeather
        };
        
        // Send transformation request
        updateLoadingText(`Transforming to ${selectedWeather} weather...`);
        const response = await fetch(`${API_URL}/transform`, {
            method: 'POST',
            headers: {
                'ngrok-skip-browser-warning': 'true',  // ← FIX: Bypass ngrok warning
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Transformation failed');
        }
        
        // Parse response
        updateLoadingText('Processing results...');
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Transformation failed');
        }
        
        // Display results
        transformedImageBase64 = data.transformed_image;
        displayResults();
        
    } catch (error) {
        console.error('Transformation error:', error);
        showError(error.message || 'Failed to transform image. Please try again.');
    } finally {
        hideLoading();
    }
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================

function displayResults() {
    // Set images
    originalImage.src = uploadedImageBase64;
    transformedImage.src = transformedImageBase64;
    
    // Update label
    const weatherEmojis = {
        rainy: '🌧️',
        snowy: '❄️',
        foggy: '🌫️',
        stormy: '⛈️',
        sunny: '☀️',
        cloudy: '☁️',
        sunset: '🌅',
        night: '🌙'
    };
    
    const emoji = weatherEmojis[selectedWeather] || '🌤️';
    const capitalizedWeather = selectedWeather.charAt(0).toUpperCase() + selectedWeather.slice(1);
    transformedLabel.innerHTML = `${emoji} ${capitalizedWeather}`;
    
    // Show results section
    resultsSection.style.display = 'block';
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// LOADING FUNCTIONS
// ============================================

function showLoading() {
    loadingOverlay.style.display = 'flex';
    progressFill.style.width = '0%';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
    progressFill.style.width = '0%';
}

function updateLoadingText(text) {
    loadingText.textContent = text;
}

function animateProgress() {
    const steps = [
        { progress: 20, text: 'Loading GAN model...', delay: 1000 },
        { progress: 40, text: 'Processing input image...', delay: 2000 },
        { progress: 60, text: 'Applying weather transformation...', delay: 4000 },
        { progress: 80, text: 'Generating output...', delay: 2000 },
        { progress: 95, text: 'Finalizing results...', delay: 1000 }
    ];
    
    let currentDelay = 0;
    steps.forEach(step => {
        setTimeout(() => {
            progressFill.style.width = `${step.progress}%`;
            updateLoadingText(step.text);
        }, currentDelay);
        currentDelay += step.delay;
    });
}

// ============================================
// ERROR HANDLING
// ============================================

function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(hideError, 5000);
}

function hideError() {
    errorMessage.style.display = 'none';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function updateTransformButton() {
    if (uploadedImageBase64 && selectedWeather) {
        transformBtn.disabled = false;
    } else {
        transformBtn.disabled = true;
    }
}

function downloadImage() {
    if (!transformedImageBase64) return;
    
    const link = document.createElement('a');
    link.href = transformedImageBase64;
    link.download = `weather-transform-${selectedWeather}-${Date.now()}.jpg`;
    link.click();
}

function resetApp() {
    // Reset variables
    uploadedImageBase64 = null;
    selectedWeather = null;
    transformedImageBase64 = null;
    
    // Reset UI
    previewImage.style.display = 'none';
    uploadPlaceholder.style.display = 'flex';
    previewImage.src = '';
    fileInput.value = '';
    
    weatherBtns.forEach(btn => btn.classList.remove('selected'));
    
    resultsSection.style.display = 'none';
    
    transformBtn.disabled = true;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// INITIALIZATION
// ============================================

console.log('Weather Transformer GAN - Initialized');
console.log('API URL:', API_URL);

// Check if API URL is configured
if (API_URL.includes('YOUR-NGROK-URL-HERE')) {
    console.warn('⚠️ WARNING: API URL not configured! Please update API_URL in script.js');
    showError('Please configure API URL in script.js with your ngrok URL from Colab');
}