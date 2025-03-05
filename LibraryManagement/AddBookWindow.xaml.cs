using System;
using System.Windows;

namespace LibraryManagement
{
    public partial class AddBookWindow : Window
    {
        private LibraryDbContext _dbContext;

        public Book NewBook { get; private set; }

        public AddBookWindow()
        {
            InitializeComponent();
            _dbContext = new LibraryDbContext(); // Initialize the database context
        }

        private void AddButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                // Get values from textboxes and create a new book
                NewBook = new Book
                {
                    Title = TitleTextBox.Text,
                    Author = AuthorTextBox.Text,
                    Year = int.Parse(YearTextBox.Text)
                };

                // Add to the database and save changes
                _dbContext.Books.Add(NewBook);
                _dbContext.SaveChanges();

                MessageBox.Show("Book added successfully!", "Success", MessageBoxButton.OK, MessageBoxImage.Information);
                DialogResult = true;
                Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error adding book: " + ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }
}
