const generateButton = document.getElementById('generateButton');
const textInput = document.getElementById('textInput');
const imageContainer = document.getElementById('imageContainer');
const loadingMessage = document.getElementById('loadingMessage');

// API configuration
const HUGGING_FACE_API_URL =
  'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev';
const HUGGING_FACE_API_TOKEN = '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'; // Replace with your valid token

// Event listener for the Generate Button
generateButton.addEventListener('click', async () => {
  const prompt = textInput.value.trim();

  // Check for empty input
  if (!prompt) {
    alert('Please enter a prompt!');
    return;
  }

  // Clear previous image and show loading message
  imageContainer.innerHTML = '';
  loadingMessage.style.display = 'block';

  try {
    // Send a POST request to the Hugging Face API
    const response = await fetch(HUGGING_FACE_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HUGGING_FACE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }), // Pass the text input as the API's input
    });

    // Handle errors from the API response
    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(errorDetails.error || `HTTP error! Status: ${response.status}`);
    }

    // Parse the response blob and create a downloadable image URL
    const result = await response.blob();
    const imageUrl = URL.createObjectURL(result);

    // Create an image element to display the generated image
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = `Generated image for prompt: ${prompt}`;
    img.style.maxWidth = '100%';
    img.style.borderRadius = '10px';

    // Append the generated image to the container
    imageContainer.appendChild(img);
  } catch (error) {
    // Display a user-friendly error message
    alert(`Failed to generate image: ${error.message}`);
    console.error('Error:', error);
  } finally {
    // Hide the loading message
    loadingMessage.style.display = 'none';
  }
});
