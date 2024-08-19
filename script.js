const apiKey = 'FQRPS6TFJGxeTzVrAjKpRmP0mC83qQ5RbTwmTMie'; 

document.addEventListener('DOMContentLoaded', () => {
    getCurrentImageOfTheDay();
    addSearchToHistory();
    
    document.getElementById('search-form').addEventListener('submit', (event) => {
        event.preventDefault();
        getImageOfTheDay();
    });
});

function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    fetchImage(currentDate);
}

function getImageOfTheDay() {
    const selectedDate = document.getElementById('search-input').value;
    if (selectedDate) {
        fetchImage(selectedDate);
        saveSearch(selectedDate);
        addSearchToHistory();
    }
}

function fetchImage(date) {
    const url = `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayImage(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('image').innerHTML = '<p>Error loading image</p>';
        });
}

function displayImage(data) {
    const imageContainer = document.getElementById('image');
    const explanationContainer = document.getElementById('explanation');
    
    if (data.media_type === 'image') {
        imageContainer.innerHTML = `<img src="${data.url}" alt="${data.title}">`;
    } else if (data.media_type === 'video') {
        imageContainer.innerHTML = `<iframe src="${data.url}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    }
    explanationContainer.textContent = data.explanation;
}

function saveSearch(date) {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    if (!searches.includes(date)) {
        searches.push(date);
        localStorage.setItem('searches', JSON.stringify(searches));
    }
}

function addSearchToHistory() {
    const searchHistory = document.getElementById('search-history');
    searchHistory.innerHTML = ''; // Clear existing history
    
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    searches.forEach(date => {
        const listItem = document.createElement('li');
        listItem.textContent = date;
        listItem.addEventListener('click', () => fetchImage(date));
        searchHistory.appendChild(listItem);
    });
}

