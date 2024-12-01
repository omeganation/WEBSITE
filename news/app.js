const apiKey = 'YOUR_NEWSAPI_KEY'; // Replace with your API key from NewsAPI
const newsList = document.getElementById('news-list');

async function fetchNews() {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`
    );
    const data = await response.json();
    displayNews(data.articles);
  } catch (error) {
    console.error("Error fetching news:", error);
    newsList.innerHTML = "<p>Unable to load news. Please try again later.</p>";
  }
}

function displayNews(articles) {
  newsList.innerHTML = '';
  articles.forEach(article => {
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item';
    newsItem.innerHTML = `
      <h3>${article.title}</h3>
      <p>${article.description || 'No description available.'}</p>
      <a href="${article.url}" target="_blank">Read more</a>
    `;
    newsList.appendChild(newsItem);
  });
}

fetchNews();
