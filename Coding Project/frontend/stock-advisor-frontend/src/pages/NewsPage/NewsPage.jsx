import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"
import { useState, useEffect } from 'react'

import './NewsPage.css'

const NewsPage = () => {
  const [newsArticles, setNewsArticles] = useState([]);

  var run = false;

  {useEffect(() => {

    const fetchData = async () => {
    const response = await fetch('http://127.0.0.1:8000/market-news/');
    const json = await response.json();
    console.log(json)
    let length = 20;

    if(run == false){
      for(let i = 0; i<length;){
        if(json.articles[i].urlToImage != null){

          const newArticles = [
            {
              title: json.articles[i].title,
              summary: json.articles[i].description,
              url: json.articles[i].url,
              imageUrl: json.articles[i].urlToImage
            }];

            setNewsArticles(prevArticles => [...prevArticles, ...newArticles]);
            run = true;
            i++;
        }
        else{
          i++
          length++;
        }
      }
    }
   };
   fetchData();
  }, [])};

  return (
    <div className="wrapper">
      <main className="content">
        <section className="main-section">
          <h2 className="section-title">Latest News</h2>
          {newsArticles.length > 0 ? (
            <div className="news-grid">
              {newsArticles.map((article, index) => (
                <div key={index} className="news-card">
                  <img
                    src={article.imageUrl || 'https://via.placeholder.com/150'}
                    alt={article.title}
                    className="news-image"
                  />
                  <h3 className="news-title">{article.title}</h3>
                  <p className="news-summary">{article.summary || article.description}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">Read more</a>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading news...</p>
          )}
        </section>
      </main>
    </div>
  )
}

export default NewsPage;
