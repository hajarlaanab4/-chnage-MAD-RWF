using ApplicationEchange.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add controller support (API endpoints)
builder.Services.AddControllers();

// Configure SQLite database connection
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure CORS policy for local frontend access
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .SetIsOriginAllowed(origin =>
            {
                // Validate origin URI
                if (!Uri.TryCreate(origin, UriKind.Absolute, out var uri))
                {
                    return false;
                }

                // Allow only localhost origins (http/https)
                return uri.Scheme is "http" or "https"
                    && (uri.Host.Equals("localhost", StringComparison.OrdinalIgnoreCase)
                        || uri.Host.Equals("127.0.0.1"));
            })
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Enable OpenAPI (Swagger-like docs)
builder.Services.AddOpenApi();

var app = builder.Build();

// Ensure database is created at startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        context.Database.EnsureCreated();
    }
    catch (Exception ex)
    {
        // Log database creation errors
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while creating the database.");
    }
}

// Enable OpenAPI only in development
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Redirect HTTP → HTTPS outside development
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Apply CORS policy
app.UseCors("Frontend");

app.UseAuthorization();

// Map controller routes
app.MapControllers();

app.Run();