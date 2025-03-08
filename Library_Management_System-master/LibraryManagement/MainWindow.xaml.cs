using System.Windows;
using System.Windows.Controls;

namespace LibraryManagement
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            MainFrame.Content = new HomePage(); // Load Home Page first
        }

        private void GoToHomePage(object sender, RoutedEventArgs e)
        {
            MainFrame.Content = new HomePage();
        }

        private void GoToBooksPage(object sender, RoutedEventArgs e)
        {
            MainFrame.Content = new BooksPage(); // You need to create BooksPage.xaml
        }

        private void GoToMembersPage(object sender, RoutedEventArgs e)
        {
            MainFrame.Content = new MembersPage(); // You need to create MembersPage.xaml
        }
    }
}
