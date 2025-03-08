using System.Collections.Generic;
using System.Linq;
using System.Windows.Controls;

namespace LibraryManagement
{
    public partial class HomePage : Page
    {
        private LibraryDbContext _db = new LibraryDbContext();

        public HomePage()
        {
            InitializeComponent();
            LoadBooks();
        }

        private void LoadBooks()
        {
            // Load all books into AllBooksList
            AllBooksList.ItemsSource = _db.Books.ToList();

            // Load 6 popular books of your choice into PopularBooksList
            PopularBooksList.ItemsSource = GetPopularBooks();
        }

        private List<Book> GetPopularBooks()
        {
            // Manually specify 6 popular books
            return new List<Book>
            {
                new Book { Title = "To Kill a Mockingbird", Author = "Harper Lee", Year = 1960 },
                new Book { Title = "1984", Author = "George Orwell", Year = 1949 },
                new Book { Title = "Pride and Prejudice", Author = "Jane Austen", Year = 1813 },
                new Book { Title = "The Great Gatsby", Author = "F. Scott Fitzgerald", Year = 1925 },
                new Book { Title = "The Catcher in the Rye", Author = "J.D. Salinger", Year = 1951 },
                new Book { Title = "The Hobbit", Author = "J.R.R. Tolkien", Year = 1937 }
            };
        }
    }
}