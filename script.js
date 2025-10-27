// InspireVerse — Nithin Rathod edition
const quoteEl = document.getElementById('quote');
const authorEl = document.getElementById('quoteAuthor');
const newQuoteBtn = document.getElementById('newQuote');
const tweetBtn = document.getElementById('tweetQuote');
const refreshBtn = document.getElementById('refreshBtn');
const themeToggle = document.getElementById('themeToggle');
const vibeBtns = document.querySelectorAll('.vibe');
const activeVibeEl = document.getElementById('activeVibe');

// Set default vibe
let currentVibe = 'sunset';
applyVibe(currentVibe);

// Theme toggle (light/dark switch via simple inversion)
let dark = true;
themeToggle.addEventListener('click', ()=>{
  dark = !dark;
  if(!dark){
    document.body.style.filter = 'none';
    document.documentElement.style.setProperty('--text','#05121a');
    themeToggle.textContent = '☀️';
  } else {
    document.body.style.filter = 'none';
    document.documentElement.style.setProperty('--text','#031017');
    themeToggle.textContent = '🌙';
  }
});

// Vibe buttons
vibeBtns.forEach(b=>{
  b.addEventListener('click', ()=>{
    const v = b.dataset.vibe;
    applyVibe(v);
  });
});

function applyVibe(v){
  document.documentElement.classList.remove('vibe-sunset','vibe-neon','vibe-ocean','vibe-forest');
  if(v==='sunset') document.documentElement.classList.add('vibe-sunset');
  if(v==='neon') document.documentElement.classList.add('vibe-neon');
  if(v==='ocean') document.documentElement.classList.add('vibe-ocean');
  if(v==='forest') document.documentElement.classList.add('vibe-forest');
  currentVibe = v;
  activeVibeEl.textContent = v[0].toUpperCase()+v.slice(1);
  // entrance animation
  document.querySelectorAll('.card').forEach((c,i)=>{
    c.animate([{opacity:0, transform:'translateY(12px)'},{opacity:1, transform:'translateY(0)'}],{duration:450+ i*80, easing:'cubic-bezier(.2,.9,.2,1)', fill:'forwards'});
  });
}

// Fetch quote from quotable.io
async function fetchQuote(){
  quoteEl.textContent = 'Fetching an inspiring quote...';
  authorEl.textContent = '';
  try{
    const res = await fetch('https://api.quotable.io/random');
    if(!res.ok) throw new Error('Quote API error');
    const data = await res.json();
    quoteEl.textContent = '“' + data.content + '”';
    authorEl.textContent = '— ' + (data.author || 'Unknown');
  }catch(e){
    quoteEl.textContent = 'Stay curious, keep learning, and build with purpose.';
    authorEl.textContent = '— InspireVerse';
  }
}

// Tweet share
tweetBtn.addEventListener('click', ()=>{
  const text = encodeURIComponent(quoteEl.textContent + ' ' + authorEl.textContent);
  const url = 'https://twitter.com/intent/tweet?text=' + text + ' %23InspireVerse';
  window.open(url,'_blank');
});

// Weather (open-meteo, no key) with geolocation
const tempEl = document.getElementById('temp');
const weatherDescEl = document.getElementById('weatherDesc');
const locationEl = document.getElementById('location');
const windEl = document.getElementById('wind');
const timeEl = document.getElementById('time');

async function getWeather(lat, lon){
  tempEl.textContent='--°C'; weatherDescEl.textContent='Loading...'; locationEl.textContent='Detecting...';
  try{
    const q = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
    const r = await fetch(q);
    const d = await r.json();
    if(d && d.current_weather){
      const cw = d.current_weather;
      tempEl.textContent = Math.round(cw.temperature) + '°C';
      weatherDescEl.textContent = 'Wind ' + cw.windspeed + ' km/h';
      locationEl.textContent = d.timezone || 'Local area';
      windEl.textContent = cw.windspeed + ' km/h';
      timeEl.textContent = new Date().toLocaleTimeString();
    } else {
      weatherDescEl.textContent = 'Unavailable';
      locationEl.textContent = 'Unknown';
    }
  }catch(e){
    weatherDescEl.textContent = 'Failed to fetch';
    locationEl.textContent = 'Unknown';
  }
}

// Try geolocation then fallback to IP-free default (NYC)
function loadWeather(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos=>{
      getWeather(pos.coords.latitude, pos.coords.longitude);
    }, err=>{
      getWeather(40.7128, -74.0060);
    }, {timeout:8000});
  } else {
    getWeather(40.7128, -74.0060);
  }
}

// Refresh button
refreshBtn.addEventListener('click', ()=>{ fetchQuote(); loadWeather(); });

// Init
fetchQuote();
loadWeather();

// keyboard shortcut: N = new quote
document.addEventListener('keydown', (e)=>{ if(e.key.toLowerCase()==='n') fetchQuote(); });