export const formatCurrency = (
  input: { currencyCode: string; amount: number } | undefined | null,
  location?: string
): string => {
  if (!input) {
    return "N/A"; // Handle undefined input gracefully
  }

  const { currencyCode, amount } = input;

  try {
    const formattedNumber = new Intl.NumberFormat(location || "en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
    return formattedNumber;
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `${currencyCode} ${amount.toFixed(2)}`; // Fallback formatting
  }
};
