using System.Linq;
using System.Windows;
using System.Windows.Controls;

namespace LibraryManagement
{
    public partial class BooksPage : Page
    {
        private LibraryDbContext _db = new LibraryDbContext();

        public BooksPage()
        {
            InitializeComponent();
            LoadBooks();
        }

        private void LoadBooks()
        {
            BookGrid.ItemsSource = _db.Books.ToList();
        }

        private void Add_Book(object sender, RoutedEventArgs e)
        {
            // Open the AddBookWindow
            var addBookWindow = new AddBookWindow();

            // Show the window as a dialog and check if the user clicked "Save"
            if (addBookWindow.ShowDialog() == true)
            {
                // Retrieve the new book from the window
                Book newBook = addBookWindow.NewBook;

                // Add the new book to the database
                _db.Books.Add(newBook);
                _db.SaveChanges();

                // Refresh the book list
                LoadBooks();

                // Show a success message
                MessageBox.Show("Book added successfully.");
            }
        }

        private void Edit_Book(object sender, RoutedEventArgs e)
        {
            if (BookGrid.SelectedItem is Book selectedBook)
            {
                var editWindow = new EditBookWindow(selectedBook);
                if (editWindow.ShowDialog() == true)
                {
                    _db.SaveChanges();
                    LoadBooks();
                    MessageBox.Show("Book edited successfully.");
                }
            }
        }

        private void Delete_Book(object sender, RoutedEventArgs e)
        {
            if (BookGrid.SelectedItem is Book selectedBook)
            {
                var confirm = MessageBox.Show($"Delete '{selectedBook.Title}'?", "Confirm", MessageBoxButton.YesNo);
                if (confirm == MessageBoxResult.Yes)
                {
                    _db.Books.Remove(selectedBook);
                    _db.SaveChanges();
                    LoadBooks();
                }
            }
        }
    }
}