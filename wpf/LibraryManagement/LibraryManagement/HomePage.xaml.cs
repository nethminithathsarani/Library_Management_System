using System.Collections.Generic;
using System.Windows.Controls;

namespace LibraryManagement
{
    public partial class HomePage : Page
    {
        public HomePage()
        {
            InitializeComponent();
            LoadBooks(); // Load books when the page is initialized
        }

        private void LoadBooks()
        {
            // Sample data for Popular Books
            var popularBooks = new List<Book>
            {
                new Book { Title = "The Great Gatsby", Author = "F. Scott Fitzgerald", Image = "/Images/ggbook.jpeg" },
                new Book { Title = "To Kill a Mockingbird", Author = "Harper Lee", Image = "/Images/killmb.jpeg" },
                new Book { Title = "A Brief History of Time", Author = "Stephen Hawking", Image = "/Images/haw.jpg" },
                new Book { Title = "Pride and Prejudice", Author = "Jane Austen", Image = "/Images/pride.jpeg" },
                new Book { Title = "The Diary of a Young Girl", Author = "Anne Frank", Image = "/Images/anne.jpeg" }
            };

            // Sample data for All Books
            var allBooks = new List<Book>
            {
                new Book { Title = "1984", Author = "George Orwell", Image = "/Images/1984.jpeg" },
                new Book { Title = "The Catcher in the Rye", Author = "J.D. Salinger", Image = "/Images/catcher.jpeg" },
                new Book { Title = "Moby Dick", Author = "Herman Melville", Image = "/Images/moby.jpeg" },
                new Book { Title = "War and Peace", Author = "Leo Tolstoy", Image = "/Images/war.jpeg" },
                new Book { Title = "The Hobbit", Author = "J.R.R. Tolkien", Image = "/Images/hobbit.jpeg" }
            };

            // Set the data sources
            PopularBooksList.ItemsSource = popularBooks;
            AllBooksList.ItemsSource = allBooks;
        }
    }
}
