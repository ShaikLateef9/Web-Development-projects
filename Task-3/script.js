// Carousel Images
const images = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKSAsOFWWMaHfTpwZandRuI-ZIKmnOd9bHhQ&s",
  "https://img.etimg.com/thumb/width-420,height-315,imgsize-711942,resizemode-75,msid-118427885/nri/visit/indians-bitten-by-travel-bug-are-a-treat-for-many.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS74s-MRzRaXhUKGsXOx1TWI5dZSN1VIGKzBA&s"
];
let currentIndex = 0;

function changeImage(direction) {
  currentIndex = (currentIndex + direction + images.length) % images.length;
  document.getElementById("carousel-img").src = images[currentIndex];
}
// Get weather using Open-Meteo API
async function getWeather() {
  const city = document.getElementById("city").value.trim();
  const result = document.getElementById("weather-result");

  if (!city) {
    result.innerText = "Please enter a city.";
    return;
  }

  try {
    // 1. Get city coordinates using Geo API
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      result.innerText = "City not found.";
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2. Get weather from Open-Meteo
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const weatherData = await weatherRes.json();
    const weather = weatherData.current_weather;

    result.innerHTML = `
      <strong>${name}, ${country}</strong><br>
      Temperature: ${weather.temperature}°C<br>
      Windspeed: ${weather.windspeed} km/h<br>
      Condition: ${weather.weathercode === 0 ? 'Clear' : 'See weathercode table'}
    `;
  } catch (error) {
    result.innerText = "Error fetching weather data.";
  }
}
const questions = [
  {
    q: "Do you prefer cities or nature?",
    a: ["Cities", "Nature"]
  },
  {
    q: "Do you plan every detail or go with the flow?",
    a: ["Plan everything", "Spontaneous"]
  },
  {
    q: "What’s your ideal travel pace?",
    a: ["Fast-paced", "Relaxed"]
  }
];

let currentQ = 0;
let answers = [];

function startQuiz() {
  answers = [];
  currentQ = 0;
  showQuestion();
}

function showQuestion() {
  const container = document.getElementById("quiz-container");
  const q = questions[currentQ];
  container.innerHTML = `
    <p><strong>${q.q}</strong></p>
    ${q.a.map(ans => `<button onclick="answerQuiz('${ans}')">${ans}</button>`).join(" ")}
  `;
}

function answerQuiz(ans) {
  answers.push(ans);
  currentQ++;
  if (currentQ < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  const container = document.getElementById("quiz-container");
  const type = answers.includes("Nature") && answers.includes("Relaxed") ? 
    "🌴 Chill Nature Explorer" : 
    "🏙️ City Adventure Seeker";
  container.innerHTML = `<p>You are a: <strong>${type}</strong></p>`;
}
