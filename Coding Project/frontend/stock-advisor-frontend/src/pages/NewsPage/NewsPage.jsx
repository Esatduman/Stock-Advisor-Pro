import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"
import { useState, useEffect } from 'react'

import './NewsPage.css'

const NewsPage = () => {
  const [newsArticles, setNewsArticles] = useState([]);

  const newArticles = [];
  var run = false;

 {useEffect(() => {
   const fetchData = async () => {
     const response = await fetch('https://api.marketaux.com/v1/news/all?must_have_entities=true&language=en&api_token=h8QJCiRe1RyhLpq2H7MbGLix70llfWZ5SgjQSjel');
     const json = await response.json();
     console.log(json)

    if(run == false){
      for(let i = 0; i<3;i++){
        const newArticles = [
          {
            title: json.data[i].title,
            summary: json.data[i].description,
            url: json.data[i].url,
            imageUrl: json.data[i].image_url
          }];
  
          setNewsArticles(prevArticles => [...prevArticles, ...newArticles]);
          run = true;
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
