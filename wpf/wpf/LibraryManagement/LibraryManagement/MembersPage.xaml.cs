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
            MemberGrid.ItemsSource = _db.Members.ToList();
        }

        private void Add_Member(object sender, RoutedEventArgs e)
        {
            var addMemberWindow = new AddMemberWindow();
            if (addMemberWindow.ShowDialog() == true)
            {
                _db.Members.Add(addMemberWindow.NewMember);
                _db.SaveChanges();
                LoadMembers();
                MessageBox.Show("Member added successfully.");
            }
        }

        private void Edit_Member(object sender, RoutedEventArgs e)
        {
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
            if (MemberGrid.SelectedItem is Member selectedMember)
            {
                var confirm = MessageBox.Show($"Delete '{selectedMember.Name}'?", "Confirm", MessageBoxButton.YesNo);
                if (confirm == MessageBoxResult.Yes)
                {
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