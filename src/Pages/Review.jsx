import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import './review.css';

export default function BookReview() {
  return (
    <div>
      <Navigation />
      <div className="review-page-container">
        <h1 className="page-title">Book Reviews</h1>
        <form className="review-form">
          <div className="form-group">
            <label htmlFor="bookName">Book Name:</label>
            <input type="text" id="bookName" name="bookName" placeholder="Enter the book name" required />
          </div>
          <div className="form-group">
            <label htmlFor="authorName">Author Name:</label>
            <input type="text" id="authorName" name="authorName" placeholder="Enter the author name" />
          </div>
          <div className="form-group">
            <label htmlFor="genre">Genre:</label>
            <select id="genre" name="genre">
              <option value="">Select Genre</option>
              <option value="fiction">Fiction</option>
              <option value="non-fiction">Non-Fiction</option>
              <option value="mystery">Mystery</option>
              <option value="fantasy">Fantasy</option>
              <option value="biography">Biography</option>
              <option value="science">Science</option>
              <option value="history">History</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="rating">Rating:</label>
            <select id="rating" name="rating" required>
              <option value="">Select Rating</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="comments">Comments:</label>
            <textarea id="comments" name="comments" placeholder="Write your review here..." rows="5" required></textarea>
          </div>
          <button type="submit" className="submit-button">Submit Review</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
