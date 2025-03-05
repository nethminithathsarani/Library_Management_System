using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryManagement
{
    public class Book
    {
        public int Id { get; set; } // Primary key in Entity Framework
        public string Title { get; set; }
        public string Author { get; set; }
        public int Year { get; set; }
    }
}
