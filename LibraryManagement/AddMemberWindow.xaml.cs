using System;
using System.Windows;

namespace LibraryManagement
{
    public partial class AddMemberWindow : Window
    {
        private LibraryDbContext _dbContext;

        public Member NewMember { get; private set; }

        public AddMemberWindow()
        {
            InitializeComponent();
            _dbContext = new LibraryDbContext(); // Initialize the database context
        }

        private void AddButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                // Get values from textboxes and create a new member
                NewMember = new Member
                {
                    Name = NameTextBox.Text,
                    Email = EmailTextBox.Text,
                    PhoneNumber = PhoneNumberTextBox.Text
                };

                // Add to the database and save changes
                _dbContext.Members.Add(NewMember);
                _dbContext.SaveChanges();

                MessageBox.Show("Member added successfully!", "Success", MessageBoxButton.OK, MessageBoxImage.Information);
                DialogResult = true;
                Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error adding member: " + ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }
}
