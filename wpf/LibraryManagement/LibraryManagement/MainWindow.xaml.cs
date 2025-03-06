using System.Windows;

namespace LibraryManagement
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            MainFrame.Content = new HomePage(); // Load Home Page by default
        }

        private void GoToHomePage(object sender, RoutedEventArgs e)
        {
            try
            {
                MainFrame.Content = new HomePage();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error navigating to Home page: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void GoToBooksPage(object sender, RoutedEventArgs e)
        {
            try
            {
                MainFrame.Content = new BooksPage();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error navigating to Books page: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void GoToMembersPage(object sender, RoutedEventArgs e)
        {
            try
            {
                MainFrame.Content = new MembersPage();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error navigating to Members page: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }
}