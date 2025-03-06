using System;
using System.Windows;

namespace LibraryManagement
{
    public partial class AddBookWindow : Window
    {
        private LibraryDbContext _dbContext;

        public Book NewBook { get; private set; } = new Book(); // Initialize NewBook

        public AddBookWindow()
        {
            InitializeComponent();
            _dbContext = new LibraryDbContext(); // Initialize the database context
        }

        private void Save_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(TitleBox.Text) ||
                    string.IsNullOrWhiteSpace(AuthorBox.Text) ||
                    string.IsNullOrWhiteSpace(YearBox.Text) ||
                    !int.TryParse(YearBox.Text, out int year))
                {
                    MessageBox.Show("Please enter valid book details.", "Invalid Input", MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                // Create new book
                NewBook = new Book
                {
                    Title = TitleBox.Text,
                    Author = AuthorBox.Text,
                    Year = year
                };

                // Add book to database
                _dbContext.Books.Add(NewBook);
                _dbContext.SaveChanges();

                MessageBox.Show("Book added successfully!", "Success", MessageBoxButton.OK, MessageBoxImage.Information);
                DialogResult = true; // Mark success
                Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error adding book: " + ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void Cancel_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false; // Close without saving
            Close();
        }
    }
}