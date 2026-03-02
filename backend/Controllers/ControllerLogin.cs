using ApplicationEchange.Data;
using ApplicationEchange.DTOS;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace ApplicationEchange.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class ControllerLogin : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public ControllerLogin(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (string.IsNullOrWhiteSpace(loginDto.Email) || string.IsNullOrWhiteSpace(loginDto.Password))
            {
                return BadRequest(new { message = "Email and password are required." });
            }

            var normalizedEmail = loginDto.Email.Trim().ToLowerInvariant();
            var user = await _dbContext.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(existingUser => existingUser.Email.ToLower() == normalizedEmail);

            if (user is null || !VerifyPassword(loginDto.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            return Ok(new
            {
                message = "Login successful.",
                user = new
                {
                    id = user.Id,
                    fullName = user.FullName,
                    email = user.Email
                }
            });
        }

        private static bool VerifyPassword(string password, string storedHash)
        {
            var parts = storedHash.Split(':');
            if (parts.Length != 2)
            {
                return false;
            }

            try
            {
                byte[] salt = Convert.FromBase64String(parts[0]);
                byte[] expectedHash = Convert.FromBase64String(parts[1]);

                byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
                byte[] combined = new byte[salt.Length + passwordBytes.Length];
                Buffer.BlockCopy(salt, 0, combined, 0, salt.Length);
                Buffer.BlockCopy(passwordBytes, 0, combined, salt.Length, passwordBytes.Length);

                byte[] actualHash = SHA256.HashData(combined);
                return CryptographicOperations.FixedTimeEquals(actualHash, expectedHash);
            }
            catch
            {
                return false;
            }
        }
    }
}
