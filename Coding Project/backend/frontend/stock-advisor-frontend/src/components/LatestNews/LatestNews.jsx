import { useState, useEffect } from 'react';
import './LatestNews.css';

const LatestNews = () => {
  // Dummy data simulating news from the backend
  const [newsItems, setNewsItems] = useState([]);

  useEffect(() => {
    const dummyNewsData = [
      {
        title: 'Fed Signals Potential Rate Hike Pause',
        description: 'The Federal Reserve hints at a possible pause in interest rate hikes, citing economic uncertainties.',
        link: '#'
      },
      {
        title: 'Tech Stocks Rally on Strong Earnings',
        description: 'Major tech companies report better-than-expected quarterly results, driving market gains.',
        link: '#'
      },
      {
        title: 'Oil Prices Surge Amid Supply Concerns',
        description: 'Global oil prices rise sharply as geopolitical tensions threaten supply chains.',
        link: '#'
      }
    ];

    setNewsItems(dummyNewsData);
  }, []);

  return (
    <div className="latest-news">
      <h2>Latest News</h2>
      {newsItems.map((news, index) => (
        <div key={index} className="news-item">
          <h3>{news.title}</h3>
          <p>{news.description}</p>
          <a href={news.link}>Read more</a>
        </div>
      ))}
    </div>
  );
};

export default LatestNews;