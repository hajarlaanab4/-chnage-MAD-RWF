using ApplicationEchange.Data;
using ApplicationEchange.DTOS;
using ApplicationEchange.models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace ApplicationEchange.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class ControllerRegister : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public ControllerRegister(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (string.IsNullOrWhiteSpace(registerDto.FullName) ||
                string.IsNullOrWhiteSpace(registerDto.Email) ||
                string.IsNullOrWhiteSpace(registerDto.Password))
            {
                return BadRequest(new { message = "FullName, Email and Password are required." });
            }

            if (registerDto.Password.Length < 6)
            {
                return BadRequest(new { message = "Password must be at least 6 characters." });
            }

            var normalizedEmail = registerDto.Email.Trim().ToLowerInvariant();
            var userExists = await _dbContext.Users
                .AnyAsync(existingUser => existingUser.Email.ToLower() == normalizedEmail);

            if (userExists)
            {
                return Conflict(new { message = "A user with this email already exists." });
            }

            var newUser = new User
            {
                FullName = registerDto.FullName.Trim(),
                Email = normalizedEmail,
                PasswordHash = HashPassword(registerDto.Password),
                Phone = registerDto.Phone?.Trim() ?? string.Empty,
                Country = registerDto.Country?.Trim() ?? string.Empty,
                MemberSince = DateTime.UtcNow.ToString("MMMM yyyy")
            };

            _dbContext.Users.Add(newUser);
            await _dbContext.SaveChangesAsync();

            return Created(string.Empty, new
            {
                id = newUser.Id,
                fullName = newUser.FullName,
                email = newUser.Email,
                phone = newUser.Phone,
                country = newUser.Country,
                memberSince = newUser.MemberSince
            });
        }

        private static string HashPassword(string password)
        {
            byte[] salt = RandomNumberGenerator.GetBytes(16);
            byte[] passwordBytes = Encoding.UTF8.GetBytes(password);

            byte[] combined = new byte[salt.Length + passwordBytes.Length];
            Buffer.BlockCopy(salt, 0, combined, 0, salt.Length);
            Buffer.BlockCopy(passwordBytes, 0, combined, salt.Length, passwordBytes.Length);

            byte[] hashBytes = SHA256.HashData(combined);
            return $"{Convert.ToBase64String(salt)}:{Convert.ToBase64String(hashBytes)}";
        }
    }
}
