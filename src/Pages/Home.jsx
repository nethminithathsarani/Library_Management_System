import Navigation from '../Components/Navigation';
import './home.css';
import Footer from '../Components/Footer';

export default function Home() {
  return (
    <div>
     
      <Navigation />

    
      <div className="homepage-photo-container">
      
        <img src="/src/assets/Images/homeLibrary.jpg" alt="Library" className="homeLibrary" />

     
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

     
      <section className="popular-books-section">
        <h2 className="section-title">Popular Books</h2>
        <div className="books-container">
          <div className="book-card">
            <img src="/src/assets/Images/ggbook.jpeg" alt="The Great Gatsby" className="book-image" />
            <p className="book-title">The Great Gatsby</p>
            <p className="book-author">F. Scott Fitzgerald</p>
          </div>
          <div className="book-card">
            <img src="/src/assets/Images/killmb.jpeg" alt="To Kill a Mockingbird" className="book-image" />
            <p className="book-title">To Kill a Mockingbird</p>
            <p className="book-author">Harper Lee</p>
          </div>
          <div className="book-card">
            <img src="/src/assets/Images/haw.jpg" alt="A Brief History of Time" className="book-image" />
            <p className="book-title">A Brief History of Time</p>
            <p className="book-author">Stephen Hawking</p>
          </div>
          <div className="book-card">
            <img src="/src/assets/Images/pride.jpeg" alt="Pride and Prejudice" className="book-image" />
            <p className="book-title">Pride and Prejudice</p>
            <p className="book-author">Jane Austen</p>
          </div>
          <div className="book-card">
            <img src="/src/assets/Images/anne.jpeg" alt="The Diary of a Young Girl" className="book-image" />
            <p className="book-title">The Diary of a Young Girl</p>
            <p className="book-author">Anne Frank</p>
          </div>
        </div>
      </section>

    
      <section className="all-books-section">
        <h2 className="section-title">All Books</h2>
        <div className="books-container">
          <div className="book-card">
            <img src="/src/assets/Images/1984.jpeg" alt="1984" className="book-image" />
            <p className="book-title">1984</p>
            <p className="book-author">George Orwell</p>
          </div>
          <div className="book-card">
            <img src="/src/assets/Images/catcher.jpeg" alt="The Catcher in the Rye" className="book-image" />
            <p className="book-title">The Catcher in the Rye</p>
            <p className="book-author">J.D. Salinger</p>
          </div>
          <div className="book-card">
            <img src="/src/assets/Images/moby.jpeg" alt="Moby Dick" className="book-image" />
            <p className="book-title">Moby Dick</p>
            <p className="book-author">Herman Melville</p>
          </div>
          <div className="book-card">
            <img src="/src/assets/Images/war.jpeg" alt="War and Peace" className="book-image" />
            <p className="book-title">War and Peace</p>
            <p className="book-author">Leo Tolstoy</p>
          </div>
          <div className="book-card">
            <img src="/src/assets/Images/hobbit.jpeg" alt="The Hobbit" className="book-image" />
            <p className="book-title">The Hobbit</p>
            <p className="book-author">J.R.R. Tolkien</p>
          </div>
        </div>
      </section>

      
      <Footer />
    </div>
  );
}





