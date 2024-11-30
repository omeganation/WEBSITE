// Replace 'YOUR_API_KEY' with your NewsAPI key
const API_KEY = 'YOUR_API_KEY';

// Function to fetch news articles based on a query
async function searchNews(query) {
    const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`;
    const newsContainer = document.querySelector('.news-articles');
    newsContainer.innerHTML = '<p>Loading...</p>'; // Show loading message

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.articles.length === 0) {
            newsContainer.innerHTML = '<p>No results found.</p>';
        } else {
            displayNews(data.articles);
        }
    } catch (error) {
        newsContainer.innerHTML = '<p>Error loading news. Please try again later.</p>';
        console.error('Error fetching news:', error);
    }
}

// Function to display news articles
function displayNews(articles) {
    const newsContainer = document.querySelector('.news-articles');
    newsContainer.innerHTML = ''; // Clear existing content

    articles.forEach(article => {
        const articleElement = document.createElement('article');
        articleElement.classList.add('news-article');

        articleElement.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.description || 'No description available.'}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        `;
        newsContainer.appendChild(articleElement);
    });
}

// Event Listener for Search Button
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    if (query.trim() !== '') {
        searchNews(query);
    }
});

// Fetch default news on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchNews(); // Default news fetching
});

async function fetchNews() {
    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;
    const newsContainer = document.querySelector('.news-articles');
    newsContainer.innerHTML = '<p>Loading...</p>';

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayNews(data.articles);
    } catch (error) {
        newsContainer.innerHTML = '<p>Error loading news. Please try again later.</p>';
        console.error('Error fetching news:', error);
    }
}

// Event Listener for Search Button and Enter Key
document.getElementById('search-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const query = document.getElementById('search-input').value;
        if (query.trim() !== '') {
            searchNews(query);
        }
    }
});

// Fetch news by category
async function fetchCategoryNews(category) {
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`;
    const newsContainer = document.querySelector('.news-articles');
    newsContainer.innerHTML = '<p>Loading...</p>'; // Show loading message

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.articles.length === 0) {
            newsContainer.innerHTML = '<p>No articles found for this category.</p>';
        } else {
            displayNews(data.articles);
        }
    } catch (error) {
        newsContainer.innerHTML = '<p>Error loading news. Please try again later.</p>';
        console.error('Error fetching category news:', error);
    }
}

// Handle category button clicks
document.querySelectorAll('.category-button').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));

        // Add active class to the clicked button
        button.classList.add('active');

        // Fetch and display news for the selected category
        const category = button.getAttribute('data-category');
        fetchCategoryNews(category);
    });
});

// Fetch default news on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchNews(); // Default news fetching
});

let currentPage = 1; // Tracks the current page of results
const pageSize = 5; // Number of articles per page

// Function to fetch and display trending news with pagination
async function fetchNews(page = 1) {
    const url = `https://newsapi.org/v2/top-headlines?country=us&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    const newsContainer = document.querySelector('.news-articles');
    const loadMoreButton = document.getElementById('load-more-button');

    if (page === 1) {
        newsContainer.innerHTML = '<p>Loading...</p>'; // Show loading message for the first load
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (page === 1) newsContainer.innerHTML = ''; // Clear content for the first page

        if (data.articles.length > 0) {
            displayNews(data.articles);

            // Show the "Load More" button if there are more articles
            loadMoreButton.style.display = data.articles.length < pageSize ? 'none' : 'block';
        } else {
            // Hide the button if no more articles are available
            loadMoreButton.style.display = 'none';

            if (page === 1) {
                newsContainer.innerHTML = '<p>No articles available.</p>';
            }
        }
    } catch (error) {
        newsContainer.innerHTML = '<p>Error loading news. Please try again later.</p>';
        console.error('Error fetching news:', error);
    }
}

// Function to display articles
function displayNews(articles) {
    const newsContainer = document.querySelector('.news-articles');

    articles.forEach(article => {
        const articleElement = document.createElement('article');
        articleElement.classList.add('news-article');

        articleElement.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.description || 'No description available.'}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        `;
        newsContainer.appendChild(articleElement);
    });
}

// Event Listener for "Load More" Button
document.getElementById('load-more-button').addEventListener('click', () => {
    currentPage++;
    fetchNews(currentPage);
});

// Fetch initial news on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchNews();
});

// Function to load images when they come into view (Lazy Loading)
function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('img.lazy');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const spinner = img.nextElementSibling; // Get the spinner element

                img.src = img.getAttribute('data-src'); // Set the src to data-src
                img.classList.remove('lazy'); // Optionally remove the lazy class
                
                // Hide the spinner once the image is loaded
                img.onload = () => {
                    spinner.style.visibility = 'hidden';
                };

                observer.unobserve(img); // Stop observing once the image is loaded
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// Call the lazy loading function when the page loads
document.addEventListener('DOMContentLoaded', lazyLoadImages);
let currentPage = 1; // Track the current page of articles
const pageSize = 5; // Number of articles per page

// Function to fetch articles and update the pagination controls
async function fetchNews(page = 1, query = '') {
    const url = query 
        ? `https://newsapi.org/v2/everything?q=${query}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`
        : `https://newsapi.org/v2/top-headlines?country=us&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;

    const newsContainer = document.querySelector('.news-articles');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const pageNumber = document.getElementById('page-number');

    if (page === 1) {
        newsContainer.innerHTML = '<p>Loading...</p>'; // Show loading message for the first load
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Clear existing articles for the first page
        if (page === 1) {
            newsContainer.innerHTML = '';
        }

        if (data.articles.length > 0) {
            displayNews(data.articles); // Display articles for the current page
            pageNumber.textContent = `Page ${page}`; // Update the page number

            // Enable or disable pagination buttons based on the page
            prevButton.disabled = page === 1;
            nextButton.disabled = data.articles.length < pageSize;

        } else {
            prevButton.disabled = true;
            nextButton.disabled = true;
            if (page === 1) {
                newsContainer.innerHTML = '<p>No articles available.</p>';
            }
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        document.querySelector('.news-articles').innerHTML = '<p>Error loading news. Please try again later.</p>';
    }
}

// Function to display the news articles
function displayNews(articles) {
    const newsContainer = document.querySelector('.news-articles');

    articles.forEach(article => {
        const articleElement = document.createElement('article');
        articleElement.classList.add('news-article');

        articleElement.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.description || 'No description available.'}</p>
            <img class="lazy" data-src="${article.urlToImage}" alt="${article.title}" width="600" height="400" />
            <div class="spinner"></div>
            <a href="${article.url}" target="_blank">Read more</a>
        `;
        newsContainer.appendChild(articleElement);
    });

    lazyLoadImages(); // Ensure lazy loading is applied to the newly added images
}

// Event listener for "Next Page" button
document.getElementById('next-page').addEventListener('click', () => {
    currentPage++;
    fetchNews(currentPage);
});

// Event listener for "Previous Page" button
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchNews(currentPage);
    }
});

// Initial fetch of news when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchNews(currentPage); // Fetch the first page of news by default
});
