using ApplicationEchange.Data;
using ApplicationEchange.models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace ApplicationEchange.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public UsersController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _dbContext.Users
                .AsNoTracking()
                .OrderBy(user => user.Id)
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _dbContext.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(existingUser => existingUser.Id == id);

            if (user is null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<User>> CreateUser([FromBody] CreateUserRequest request)
        {
            var email = request.Email.Trim();

            var emailExists = await _dbContext.Users.AnyAsync(existingUser => existingUser.Email == email);
            if (emailExists)
            {
                return Conflict(new { message = "A user with this email already exists." });
            }

            var user = new User
            {
                Name = request.Name.Trim(),
                Email = email,
                Phone = request.Phone?.Trim() ?? string.Empty,
                Address = request.Address?.Trim() ?? string.Empty,
                MemberSince = request.MemberSince?.Trim() ?? DateTime.UtcNow.ToString("MMMM yyyy")
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<User>> UpdateUser(int id, [FromBody] UpdateUserRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new { message = "Name and email are required." });
            }

            var user = await _dbContext.Users.FirstOrDefaultAsync(existingUser => existingUser.Id == id);
            if (user is null)
            {
                return NotFound();
            }

            var normalizedEmail = request.Email.Trim();
            var emailExists = await _dbContext.Users.AnyAsync(existingUser =>
                existingUser.Email == normalizedEmail && existingUser.Id != id);

            if (emailExists)
            {
                return Conflict(new { message = "A user with this email already exists." });
            }

            user.Name = request.Name.Trim();
            user.Email = normalizedEmail;
            user.Phone = request.Phone?.Trim() ?? string.Empty;
            user.Address = request.Address?.Trim() ?? string.Empty;
            user.MemberSince = request.MemberSince?.Trim() ?? user.MemberSince;

            await _dbContext.SaveChangesAsync();

            return Ok(user);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(existingUser => existingUser.Id == id);
            if (user is null)
            {
                return NotFound();
            }

            _dbContext.Users.Remove(user);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("profile")]
        public async Task<ActionResult<User>> GetProfile()
        {
            var user = await _dbContext.Users
                .AsNoTracking()
                .OrderBy(existingUser => existingUser.Id)
                .FirstOrDefaultAsync();

            if (user is null)
            {
                return NotFound(new { message = "No user profile found." });
            }

            return Ok(user);
        }

        [HttpPut("profile")]
        public async Task<ActionResult<User>> UpdateProfile([FromBody] UpdateUserRequest request)
        {
            var user = await _dbContext.Users.OrderBy(existingUser => existingUser.Id).FirstOrDefaultAsync();
            if (user is null)
            {
                return NotFound(new { message = "No user profile found." });
            }

            return await UpdateUser(user.Id, request);
        }

    }

    public class CreateUserRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? MemberSince { get; set; }
    }

    public class UpdateUserRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? MemberSince { get; set; }
    }
}
