import './footer.css';





export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
      
        <div className="logo-section">
          <img src="logo.png" alt="Logo" className="footer-logo" />
          <h2 className="footer-title">Knowledge Corner</h2>
        </div>

       
        <div className="about-section">
          <h3>About Us</h3>
          <p>
            Welcome to our library management system, where knowledge meets innovation. 
            Discover books, manage your library, and explore the world of learning with ease. 
            We are committed to providing an exceptional user experience for every book lover!
          </p>
        </div>

       
        <div className="contact-section">
          <h3>Contact Us</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src="facebook.png" alt="Facebook" className="social-icon" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src="instagram.png" alt="Instagram" className="social-icon" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <img src="twitter.png" alt="Twitter" className="social-icon" />
            </a>
            <a href="mailto:yourlibrary@gmail.com">
              <img src="gmail.png" alt="Gmail" className="social-icon" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
