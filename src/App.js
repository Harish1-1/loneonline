import React, { useState, useEffect } from 'react';
import { createApi } from 'unsplash-js';
import './App.css';
import ReactPaginate from 'react-paginate';
import { FaCamera } from 'react-icons/fa'; // Choose any icon you like

const unsplash = createApi({ accessKey: 'cU-wx7_kc4H8MJ8J4qjAWhLfabcC27xDUHNPbPu_tq4' });

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    if (query) {
      fetchImages();
    }
  }, [page]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await unsplash.search.getPhotos({
        query: query,
        page: page,
        perPage: 10,
      });
      setImages(response.response.results);
      setPageCount(response.response.total_pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchImages();
  };

  const handleButtonClick = (searchQuery) => {
    setQuery(searchQuery);
    setPage(1);
  };

  const handlePageClick = (data) => {
    setPage(data.selected + 1);
  };

  return (
    <div className="app">
      <div className="icon-container">
        <FaCamera size={40} /> {/* Add an icon to the top of the page */}
      </div>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for images..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div className="button-container">
        <button onClick={() => handleButtonClick('Nature')}>Nature</button>
        <button onClick={() => handleButtonClick('Technology')}>Technology</button>
        <button onClick={() => handleButtonClick('Food')}>Food</button>
        <button onClick={() => handleButtonClick('Travel')}>Travel</button>
      </div>
      {loading ? (
        <div className="shimmer-wrapper">
          <div className="shimmer"></div>
        </div>
      ) : (
        <div>
          <div className="images">
            {images.map((image) => (
              <div key={image.id} className="image">
                <img src={image.urls.small} alt={image.alt_description} />
                <div className="image-details">
                  {image.description || 'No description'}
                </div>
              </div>
            ))}
          </div>
          {images.length > 0 && (
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
