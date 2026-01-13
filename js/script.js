// Help functions for selecting elements
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));

// ================================
// Navigation toggles
// ================================
const navToggles = $$('[id^="nav-toggle"]');
navToggles.forEach(btn => {
  const navId = btn.getAttribute('aria-controls') || btn.id.replace('nav-toggle','main-nav');
  const nav = btn.nextElementSibling || document.getElementById(navId);
  
  btn?.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    
    if(nav) {
      nav.classList.toggle('show');
      document.body.classList.toggle('menu-open');
    }
  });
  
  nav?.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      nav.classList.remove('show');
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav?.classList.contains('show')) {
      nav.classList.remove('show');
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
  });
  
  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav') && nav?.classList.contains('show')) {
      nav.classList.remove('show');
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
  });
});

// ================================
// Gallery functionality
// ================================
const galleryItems = $$('.gallery-item');
const lightbox = $('#lightbox');
const lightboxImg = $('#lightbox-img');
const closeLightbox = $('#close-lightbox');
const nextBtn = $('#next');
const prevBtn = $('#prev');
let currentIndex = 0;

// Like and view counts stored in localStorage
const likes = JSON.parse(localStorage.getItem('likes')) || {};
const likedImages = JSON.parse(localStorage.getItem('likedImages')) || {};

// Formatting of like counts
function formatLikes(count) {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace('.0', '') + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1).replace('.0', '') + 'K';
  }
  return count.toString();
}

// Event listeners for like and view buttons
galleryItems.forEach((item, idx) => {
  const likeBtn = item.querySelector('.like-btn');
  const viewBtn = item.querySelector('.view-btn');

  // Initializing like and view counts
  if (!likes[idx]) likes[idx] = 0;
  likeBtn.textContent = `♡ ${likes[idx]}`;
  
  // controlling exact like count in tooltip and data attribute
  if (likedImages[idx]) {
    likeBtn.classList.add('liked');
    likeBtn.textContent = `♥ ${likes[idx]}`; // Filled heart
  }

  // Like-function with animation
  likeBtn?.addEventListener('click', () => {
    // Add bounce effect
    likeBtn.classList.add('bounce');
    
  
    setTimeout(() => {
      likeBtn.classList.remove('bounce');
    }, 600);
    
    likes[idx]++;
    likedImages[idx] = true; // Mark as liked
    
    likeBtn.textContent = `♥ ${formatLikes(likes[idx])}`;
    likeBtn.setAttribute('data-exact', `${likes[idx].toLocaleString()}`);
    likeBtn.setAttribute('title', `${likes[idx].toLocaleString()} likes`);
    likeBtn.classList.add('liked');
    likeBtn.setAttribute('aria-pressed', 'true');
    
    localStorage.setItem('likes', JSON.stringify(likes));
    localStorage.setItem('likedImages', JSON.stringify(likedImages)); 
  });
    
  viewBtn?.addEventListener('click', () => openLightbox(idx));
});

function openLightbox(idx) {
  if (!galleryItems[idx] || !lightbox || !lightboxImg) return;
  
  const img = galleryItems[idx].querySelector('img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.remove('hidden');
  currentIndex = idx;
}

function closeLB() {
  if (lightbox) {
    lightbox.classList.add('hidden');
  }
}

// Lightbox navigation
closeLightbox?.addEventListener('click', closeLB);
nextBtn?.addEventListener('click', () => {
  if (galleryItems.length > 0) {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    openLightbox(currentIndex);
  }
});
prevBtn?.addEventListener('click', () => {
  if (galleryItems.length > 0) {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentIndex);
  }
});

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox && !lightbox.classList.contains('hidden')) {
    closeLB();
  }
});

// ================================
// Todo list functionality
// ================================
const todoForm = $('#todo-form');
const todoInput = $('#todo-input');
const todoList = $('#todo-list');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');

const renderTodos = () => {
  if (!todoList) return;
  //cleaning the list before re-rendering
  todoList.innerHTML = '';
  todos.forEach(({ text, done }, i) => {
    const li = document.createElement('li');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = done;
    checkbox.addEventListener('change', () => {
      todos[i].done = checkbox.checked;
      saveAndRender();
    });

    const textSpan = document.createElement('span');
    textSpan.textContent = text;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.classList.add('todo-remove');
    removeBtn.addEventListener('click', () => {
      todos = todos.filter((_, idx) => idx !== i);
      saveAndRender();
    });

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(removeBtn);

    if (done) {
      li.classList.add('completed');
      textSpan.classList.add('done');
    }

    todoList.appendChild(li);
  });
};

const saveAndRender = () => {
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos();
};

todoForm?.addEventListener('submit', e => {
  e.preventDefault();
  if (!todoInput) return;
  
  const text = todoInput.value.trim();
  if (!text) return;
  
  todos.push({ text, done: false });
  todoInput.value = '';
  saveAndRender();
});

if (todoForm) {
  saveAndRender();
}

// ================================
// Contact form
// ================================
const contactForm = $('#contact-form');
contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get('name');
  const email = formData.get('email');
  
  if (!name || !email) {
    alert('Please fill in name and email.');
    return;
  }
  
  alert('Thank you! Your message has been sent (simulated).');
  contactForm.reset();
});

// ================================
// Page animations
// ================================
const pageSections = $$('.page-section');
pageSections.forEach((section, index) => {
  section.style.animationDelay = `${index * 0.2}s`;
  section.classList.add('fade-in');
});

// ================================
// Country search 
// ================================
const countries = [
  {
    name: "Greece",
    capital: "Athens",
    population: "10.5 million",
    bestCities: ["Santorini", "Thessaloniki", "Mykonos"],
    mapUrl: "https://www.google.com/maps/place/Greece",
    flagUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Greece.svg"
  },
  {
    name: "Spain",
    capital: "Madrid",
    population: "47 million",
    bestCities: ["Barcelona", "Sevilla", "Valencia"],
    mapUrl: "https://www.google.com/maps/place/Spain",
    flagUrl: "https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg"
  },
  {
    name: "Turkey",
    capital: "Ankara",
    population: "85 million",
    bestCities: ["Istanbul", "Antalya", "Izmir"],
    mapUrl: "https://www.google.com/maps/place/Turkey",
    flagUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg"
  }
];

const searchBtn = $('#searchBtn');
searchBtn?.addEventListener('click', () => {
  const selectedCountry = $('#countrySelect')?.value;
  const resultDiv = $('#result');

  if (!selectedCountry) {
    if(resultDiv) resultDiv.textContent = "Please select a country first.";
    return;
  }

  const result = countries.find(country =>
    country.name.toLowerCase() === selectedCountry.toLowerCase()
  );

  if (result && resultDiv) {
    resultDiv.innerHTML = `
      <div class="country-result">
        <img src="${result.flagUrl}" alt="Flag ${result.name}">
        <div class="country-result-info">
          <p><strong>Country:</strong> ${result.name}</p>
          <p><strong>Capital:</strong> ${result.capital}</p>
          <p><strong>Population:</strong> ${result.population}</p>
          <p><strong>Best cities:</strong> ${result.bestCities.join(", ")}</p>
          <p><a href="${result.mapUrl}" target="_blank">📍 View on Google Maps</a></p>
        </div>
      </div>
    `;
  } else if(resultDiv) {
    resultDiv.textContent = "No country found.";
  }
});