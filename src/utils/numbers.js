const DISPLAY_DECIMALS_IF_LT_ZERO = 4;
const DISPLAY_DECIMALS_IF_GT_ZERO = 2;

export function formatAmount(balance, decimals) {
  const balanceFloat = parseFloat(balance);
  const divider = Math.pow(10, decimals);
  const amount = balanceFloat / divider;

  return amount.toFixed(
    amount > 1.0 ? DISPLAY_DECIMALS_IF_GT_ZERO : DISPLAY_DECIMALS_IF_LT_ZERO,
  );
}
