using System.Windows;

namespace LibraryManagement
{
    public partial class EditMemberWindow : Window
    {
        public Member CurrentMember { get; private set; }

        public EditMemberWindow(Member member)
        {
            InitializeComponent();
            CurrentMember = member;
            NameBox.Text = member.Name;
            EmailBox.Text = member.Email;
        }

        private void Save_Click(object sender, RoutedEventArgs e)
        {
            CurrentMember.Name = NameBox.Text;
            CurrentMember.Email = EmailBox.Text;
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
