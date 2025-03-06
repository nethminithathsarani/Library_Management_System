using System;
using System.Windows;

namespace LibraryManagement
{
    public partial class AddMemberWindow : Window
    {
        public Member NewMember { get; private set; }

        public AddMemberWindow()
        {
            InitializeComponent();
        }

        private void Save_Click(object sender, RoutedEventArgs e)
        {
            // Check if inputs are not empty
            if (string.IsNullOrWhiteSpace(NameBox.Text) ||
                string.IsNullOrWhiteSpace(EmailBox.Text) ||
                string.IsNullOrWhiteSpace(PhoneBox.Text))
            {
                MessageBox.Show("Please enter Name, Email, and Phone Number.", "Error", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            // Create a new Member object
            NewMember = new Member
            {
                Name = NameBox.Text,
                Email = EmailBox.Text,
                PhoneNumber = PhoneBox.Text
            };

            DialogResult = true; // Mark success
            Close();
        }

        private void Cancel_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false; // Cancel operation
            Close();
        }
    }
}