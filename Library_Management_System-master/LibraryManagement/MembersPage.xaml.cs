using System.Linq;
using System.Windows;
using System.Windows.Controls;

namespace LibraryManagement
{
    public partial class MembersPage : Page
    {
        private LibraryDbContext _db = new LibraryDbContext();

        public MembersPage()
        {
            InitializeComponent();
            LoadMembers();
        }

        private void LoadMembers()
        {
            // Refreshes the grid with the current list of members
            MemberGrid.ItemsSource = _db.Members.ToList();
        }

        private void Add_Member(object sender, RoutedEventArgs e)
        {
            // Open the AddMemberWindow
            var addMemberWindow = new AddMemberWindow();

            // Show the window as a dialog and check if the user clicked "Save"
            if (addMemberWindow.ShowDialog() == true)
            {
                // Retrieve the new member from the window
                Member newMember = addMemberWindow.NewMember;

                // Add the new member to the database
                _db.Members.Add(newMember);
                _db.SaveChanges();

                // Reload members and show confirmation message
                LoadMembers();
                MessageBox.Show("Member added successfully.");
            }
        }

        private void Edit_Member(object sender, RoutedEventArgs e)
        {
            // Check if a member is selected in the grid
            if (MemberGrid.SelectedItem is Member selectedMember)
            {
                var editWindow = new EditMemberWindow(selectedMember);
                if (editWindow.ShowDialog() == true)
                {
                    _db.SaveChanges();
                    LoadMembers();
                    MessageBox.Show("Member edited successfully.");
                }
            }
            else
            {
                MessageBox.Show("Please select a member to edit.");
            }
        }

        private void Delete_Member(object sender, RoutedEventArgs e)
        {
            // Check if a member is selected in the grid
            if (MemberGrid.SelectedItem is Member selectedMember)
            {
                var confirm = MessageBox.Show($"Delete '{selectedMember.Name}'?", "Confirm", MessageBoxButton.YesNo);
                if (confirm == MessageBoxResult.Yes)
                {
                    // Remove the selected member and save changes
                    _db.Members.Remove(selectedMember);
                    _db.SaveChanges();
                    LoadMembers();
                    MessageBox.Show("Member deleted successfully.");
                }
            }
            else
            {
                MessageBox.Show("Please select a member to delete.");
            }
        }
    }
}