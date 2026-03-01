using System.ComponentModel.DataAnnotations;

namespace ApplicationEchange.models
{
    public class Transaction
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        [Required]
        [MaxLength(3)]
        public string FromCurrency { get; set; } = string.Empty;

        [Required]
        [MaxLength(3)]
        public string ToCurrency { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal ConvertedAmount { get; set; }

        [Range(0.000001, double.MaxValue)]
        public decimal ExchangeRate { get; set; }

        public DateTime Date { get; set; } = DateTime.UtcNow;

        [Required]
        [MaxLength(30)]
        public string Status { get; set; } = "completed";

        public User? User { get; set; }
    }
}
