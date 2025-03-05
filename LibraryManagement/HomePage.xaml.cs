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
            AllBooksList.ItemsSource = _db.Books.ToList();
            PopularBooksList.ItemsSource = _db.Books.OrderByDescending(b => b.Year).Take(5).ToList(); // Example: Latest books as 'popular'
        }
    }
}
