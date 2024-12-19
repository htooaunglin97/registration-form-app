using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

public class AppDbContext : DbContext
{
  private readonly IConfiguration _configuration;

  public DbSet<User> Users { get; set; }

  public AppDbContext(DbContextOptions<AppDbContext> options, IConfiguration configuration)
      : base(options)
  {
    _configuration = configuration;
  }

  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
  {
    if (!optionsBuilder.IsConfigured)
    {
      optionsBuilder.UseNpgsql(_configuration.GetConnectionString("DefaultConnection"));
    }
  }
}