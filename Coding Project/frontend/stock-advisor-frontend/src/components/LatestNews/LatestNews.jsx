import { useState, useEffect } from 'react';
import './LatestNews.css';

const LatestNews = () => {
  // Dummy data simulating news from the backend
  const [newsItems, setNewsItems] = useState([]);
  var run = false;
  useEffect(() => {

    const fetchData = async () => {
      const response = await fetch('http://127.0.0.1:8000/market-news/');
      const json = await response.json();
      console.log(json)

      let length = 3;
     if(run == false){
       for(let i = 0; i<length;){
          if(json.articles[i].author != "null"){

            const newsItems = [
              {
                title: json.articles[i].title,
                summary: json.articles[i].description,
                url: json.articles[i].url,
                imageUrl: json.articles[i].urlToImage
              }];
      
              setNewsItems(prevArticles => [...prevArticles, ...newsItems]);
              run = true;
              i++;
          }
          else{
            i++;
            length++;
          }
       }
       
     }
    };
    fetchData();
    //setNewsItems(dummyNewsData);
  }, []);

  return (
    <div className="latest-news">
      <h2>Latest News</h2>
      {newsItems.map((news, index) => (
        <div key={index} className="news-item">
          <h3>{news.title}</h3>
          <p>{news.description}</p>
          <a href={news.url} target="_blank" rel="noopener noreferrer" className="read-more">Read more</a>
        </div>
      ))}
    </div>
  );
};

export default LatestNews;