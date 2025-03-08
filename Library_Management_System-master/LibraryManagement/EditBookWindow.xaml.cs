using System.Windows;

namespace LibraryManagement
{
    public partial class EditBookWindow : Window
    {
        public Book CurrentBook { get; private set; }

        public EditBookWindow(Book book)
        {
            InitializeComponent();
            CurrentBook = book;
            TitleBox.Text = book.Title;
            AuthorBox.Text = book.Author;
        }

        private void Save_Click(object sender, RoutedEventArgs e)
        {
            CurrentBook.Title = TitleBox.Text;
            CurrentBook.Author = AuthorBox.Text;
            DialogResult = true;
            Close();
        }

        private void Cancel_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
            Close();
        }
    }
}
