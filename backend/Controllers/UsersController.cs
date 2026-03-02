using ApplicationEchange.Data;
using ApplicationEchange.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApplicationEchange.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public UsersController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var user = await _dbContext.Users
                .AsNoTracking()
                .OrderBy(existingUser => existingUser.Id)
                .FirstOrDefaultAsync();

            if (user is null)
            {
                return NotFound(new { message = "No user profile found." });
            }

            return Ok(new
            {
                id = user.Id,
                name = user.FullName,
                email = user.Email,
                phone = user.Phone,
                country = user.Country,
                memberSince = user.MemberSince
            });
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto updateProfileDto)
        {
            var user = await _dbContext.Users
                .OrderBy(existingUser => existingUser.Id)
                .FirstOrDefaultAsync();

            if (user is null)
            {
                return NotFound(new { message = "No user profile found." });
            }

            if (string.IsNullOrWhiteSpace(updateProfileDto.Name) || string.IsNullOrWhiteSpace(updateProfileDto.Email))
            {
                return BadRequest(new { message = "Name and email are required." });
            }

            var normalizedEmail = updateProfileDto.Email.Trim().ToLowerInvariant();
            var emailTaken = await _dbContext.Users
                .AnyAsync(existingUser => existingUser.Id != user.Id && existingUser.Email.ToLower() == normalizedEmail);

            if (emailTaken)
            {
                return Conflict(new { message = "A user with this email already exists." });
            }

            user.FullName = updateProfileDto.Name.Trim();
            user.Email = normalizedEmail;
            user.Phone = updateProfileDto.Phone?.Trim() ?? string.Empty;
            user.Country = updateProfileDto.Country?.Trim() ?? string.Empty;

            await _dbContext.SaveChangesAsync();

            return Ok(new
            {
                id = user.Id,
                name = user.FullName,
                email = user.Email,
                phone = user.Phone,
                country = user.Country,
                memberSince = user.MemberSince
            });
        }
    }

    public class UpdateProfileDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Country { get; set; }
    }
}
