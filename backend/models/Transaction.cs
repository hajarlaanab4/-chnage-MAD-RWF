using System.Globalization;
using System.Runtime.InteropServices.Marshalling;

namespace ApplicationEchange.models
{
    public class Transaction
    {
        public int Id { get; set; }
        public decimal Amount { get; set; } = Decimal.Zero;
        public string FromCurrency { get; set; } = string.Empty;
        public string ToCurrency { get; set; } = string.Empty;
        public string name { get; set; }
        public decimal ExchangeRate { get; set; } // Taux de change

        public decimal ResultAmount { get; set; } // Montant converti

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public User user { get; set; }
        public int UserId { get; set; }


    }
}
