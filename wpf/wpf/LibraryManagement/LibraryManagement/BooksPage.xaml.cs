using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;

namespace LibraryManagement
{
    public partial class BooksPage : Page
    {
        private List<Book> _books; // List to store books
        private LibraryDbContext _dbContext; // Database context

        public BooksPage()
        {
            try
            {
                InitializeComponent();
                _dbContext = new LibraryDbContext(); // Initialize the database context
                LoadBooks(); // Load books from the database
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error initializing Books page: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void LoadBooks()
        {
            try
            {
                // Load books from the database
                _books = _dbContext.Books.ToList();
                BookGrid.ItemsSource = _books; // Bind the list to the DataGrid
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error loading books: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // Add Book
        private void Add_Book(object sender, RoutedEventArgs e)
        {
            try
            {
                // Open the AddBookWindow
                var addBookWindow = new AddBookWindow();
                if (addBookWindow.ShowDialog() == true)
                {
                    // Add the new book to the database
                    _dbContext.Books.Add(addBookWindow.NewBook);
                    _dbContext.SaveChanges();

                    // Refresh the book list
                    LoadBooks();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error adding book: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // Edit Book
        private void Edit_Book(object sender, RoutedEventArgs e)
        {
            try
            {
                // Get the selected book
                var selectedBook = BookGrid.SelectedItem as Book;
                if (selectedBook == null)
                {
                    MessageBox.Show("Please select a book to edit.", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                    return;
                }

                // Open the EditBookWindow with the selected book
                var editBookWindow = new EditBookWindow(selectedBook);
                if (editBookWindow.ShowDialog() == true)
                {
                    // Save changes to the database
                    _dbContext.SaveChanges();

                    // Refresh the book list
                    LoadBooks();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error editing book: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // Delete Book
        private void Delete_Book(object sender, RoutedEventArgs e)
        {
            try
            {
                // Get the selected book
                var selectedBook = BookGrid.SelectedItem as Book;
                if (selectedBook == null)
                {
                    MessageBox.Show("Please select a book to delete.", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                    return;
                }

                // Confirm deletion
                var result = MessageBox.Show("Are you sure you want to delete this book?", "Confirm Delete", MessageBoxButton.YesNo, MessageBoxImage.Warning);
                if (result == MessageBoxResult.Yes)
                {
                    // Remove the book from the database
                    _dbContext.Books.Remove(selectedBook);
                    _dbContext.SaveChanges();

                    // Refresh the book list
                    LoadBooks();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error deleting book: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }
}