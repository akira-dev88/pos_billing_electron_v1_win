export function calculateCart(items: any[], billDiscount = 0) {
  let total = 0;
  let taxTotal = 0;
  let itemDiscountTotal = 0;

  for (const item of items) {
    const base = item.price * item.quantity;
    const discount = item.discount || 0;
    const net = base - discount;
    const tax = (net * item.tax_percent) / 100;

    total += base;
    itemDiscountTotal += discount;
    taxTotal += tax;
  }

  const grandTotal = total - itemDiscountTotal - billDiscount + taxTotal;

  return {
    total,
    item_discount: itemDiscountTotal,
    bill_discount: billDiscount,
    tax: taxTotal,
    grand_total: grandTotal,
  };
}