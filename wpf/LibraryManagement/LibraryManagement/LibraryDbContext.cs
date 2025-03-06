using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Windows;

namespace LibraryManagement
{
    public class LibraryDbContext : DbContext
    {
        public DbSet<Book> Books { get; set; }
        public DbSet<Member> Members { get; set; } // Members table

        private static readonly string DbPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "library_app.db");

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            try
            {
                optionsBuilder.UseSqlite($"Data Source={DbPath}");
            }
            catch (Exception ex)
            {
                MessageBox.Show("Database connection error: " + ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Add constraints or seed data if needed
            modelBuilder.Entity<Book>()
                .Property(b => b.Title)
                .IsRequired();

            modelBuilder.Entity<Member>()
                .Property(m => m.Name)
                .IsRequired();
        }

        public static void InitializeDatabase()
        {
            try
            {
                using (var context = new LibraryDbContext())
                {
                    if (!File.Exists(DbPath)) // Only create if the database file doesn't exist
                    {
                        context.Database.EnsureCreated();
                        MessageBox.Show("Database created successfully.", "Info", MessageBoxButton.OK, MessageBoxImage.Information);
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Database initialization error: " + ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }
}
