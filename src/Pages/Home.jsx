import Navigation from '../Components/Navigation';
import './home.css';
import Footer from '../Components/Footer';

export default function Home() {
  return (
    <div>
      {/* Navigation Bar */}
      <Navigation />
      <div className="homepage-photo-container">
        {/* Main Image */}
        <img src="homeLibrary.jpg" alt="home" className="homeLibrary" />

        {/* Search Bar */}
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search books..."
            className="search-input"
          />
          <button type="button" className="search-button">
            Search
          </button>
        </div>
      </div>

      {/* Popular Books Section */}
      <section className="popular-books-section">
        <h2 className="section-title">Popular Books</h2>
        <div className="books-container">
          <div className="book-card">
            <img src="ggbook.jpeg" alt="Popular Book 1" className="book-image" />
            <p className="book-title">The Great Gatsby</p>
            <p className="book-author">F. Scott Fitzgerald</p>
          </div>
          <div className="book-card">
            <img src="killmb.jpeg" alt="Popular Book 2" className="book-image" />
            <p className="book-title">To Kill a Mockingbird</p>
            <p className="book-author">Harper Lee</p>
          </div>
          <div className="book-card">
            <img src="haw.jpg" alt="Popular Book 3" className="book-image" />
            <p className="book-title">A Brief History of Time</p>
            <p className="book-author">Stephen Hawking</p>
          </div>
          <div className="book-card">
            <img src="pride.jpeg" alt="Popular Book 4" className="book-image" />
            <p className="book-title">Pride and Prejudice</p>
            <p className="book-author">Jane Austen</p>
          </div>
          <div className="book-card">
            <img src="anne.jpeg" alt="Popular Book 5" className="book-image" />
            <p className="book-title">The Diary of a Young Girl</p>
            <p className="book-author">Anne Frank</p>
          </div>
        </div>
      </section>

      {/* All Books Section */}
      <section className="all-books-section">
        <h2 className="section-title">All Books</h2>
        <div className="books-container">
          <div className="book-card">
            <img src="1984.jpeg" alt="All Book 1" className="book-image" />
            <p className="book-title">1984</p>
            <p className="book-author">George Orwell</p>
          </div>
          <div className="book-card">
            <img src="catcher.jpeg" alt="All Book 2" className="book-image" />
            <p className="book-title">The Catcher in the Rye</p>
            <p className="book-author">J.D. Salinger</p>
          </div>
          <div className="book-card">
            <img src="moby.jpeg" alt="All Book 3" className="book-image" />
            <p className="book-title">Moby Dick</p>
            <p className="book-author">Herman Melville</p>
          </div>
          <div className="book-card">
            <img src="war.jpeg" alt="All Book 4" className="book-image" />
            <p className="book-title">War and Peace</p>
            <p className="book-author">Leo Tolstoy</p>
          </div>
          <div className="book-card">
            <img src="hobbit.jpeg" alt="All Book 5" className="book-image" />
            <p className="book-title">The Hobbit</p>
            <p className="book-author">J.R.R. Tolkien</p>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}




