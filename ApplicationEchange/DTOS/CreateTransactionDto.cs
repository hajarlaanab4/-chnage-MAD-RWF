namespace ApplicationEchange.DTOS
{
    public class CreateTransactionDto
    {
        public decimal Amount { get; set; }

        public string FromCurrency { get; set; }

        public string ToCurrency { get; set; }
    }
}
