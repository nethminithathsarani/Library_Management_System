using System;
using System.Windows;

namespace LibraryManagement
{
    public partial class EditBookWindow : Window
    {
        private LibraryDbContext _dbContext;
        public Book EditedBook { get; private set; }

        public EditBookWindow(Book bookToEdit)
        {
            InitializeComponent();
            _dbContext = new LibraryDbContext(); // Initialize the database context
            EditedBook = bookToEdit;

            // Populate the fields with the selected book's details
            TitleBox.Text = EditedBook.Title;
            AuthorBox.Text = EditedBook.Author;
            YearBox.Text = EditedBook.Year.ToString();
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

                // Update the book details
                EditedBook.Title = TitleBox.Text;
                EditedBook.Author = AuthorBox.Text;
                EditedBook.Year = year;

                // Save changes to the database
                _dbContext.SaveChanges();

                MessageBox.Show("Book updated successfully!", "Success", MessageBoxButton.OK, MessageBoxImage.Information);
                DialogResult = true; // Mark success
                Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error updating book: " + ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void Cancel_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false; // Close without saving
            Close();
        }
    }
}