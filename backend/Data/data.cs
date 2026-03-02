using ApplicationEchange.models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace ApplicationEchange.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
    }
}