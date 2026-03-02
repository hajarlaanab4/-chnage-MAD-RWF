namespace ApplicationEchange.models
{
    public class TauxEchange
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string FromCurrency { get; set; } = null!; // 'MAD' or 'RWF'
        public string ToCurrency { get; set; } = null!;
        public decimal AmountFrom { get; set; }
        public decimal AmountTo { get; set; }
        public decimal RateUsed { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
    }
}
