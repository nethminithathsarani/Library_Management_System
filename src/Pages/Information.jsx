import Navigation from '../Components/Navigation'
import './information.css';
import Footer from '../Components/Footer';
export default function Information() {
  return (
    <div> 
      <Navigation/>
     
    <div className="about-page">
      <h1 className="about-title">About Us</h1>

      
      <section className="about-intro">
        <p>
          Welcome to our library! We are dedicated to fostering knowledge, learning, and growth.
          Our extensive collection of books, friendly staff, and comfortable reading spaces make
          this the perfect place for students, professionals, and book lovers.
        </p>
      </section>

     
      <section className="contact-info">
        <h2>Contact Information</h2>
        <div className="contact-details">
          <p><strong>Address:</strong> 123 Library Street, Galle, Sri Lanka</p>
          <p><strong>Phone:</strong> +94 91 123 4567</p>
          <p><strong>Email:</strong> <a href="mailto:library.contact@gmail.com">library.contact@gmail.com</a></p>
        </div>
      </section>

      
      <section className="operating-hours">
        <h2>Operating Hours</h2>
        <div className="hours-details">
          <p><strong>Monday - Friday:</strong> 8:00 AM to 6:00 PM</p>
          <p><strong>Weekend:</strong> 9:00 AM to 5:00 PM</p>
        </div>
      </section>

     
      <section className="location-map">
        <h2>Find Us</h2>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.523934991803!2d-122.0842496846915!3d37.42206597982551!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb5f446a6c573%3A0x4a4c9b0676a3d647!2sLibrary!5e0!3m2!1sen!2slk!4v1614114908987!5m2!1sen!2slk"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Library Location"
        ></iframe>
      </section>

      
      <section className="call-to-action">
        <p>We look forward to your visit. Let’s explore the world of books together!</p>
      </section>

      
    </div>
    <Footer/>
    </div>
  );
}
    
