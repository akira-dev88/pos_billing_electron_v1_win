// hooks/useCart.ts

import { useState, useEffect } from "react";
import {
  createCart,
  addItem,
  getCart,
  updateItem,
  removeItem,
  applyDiscount as applyDiscountApi,
} from "../../../renderer/services/cartApi";
import { checkoutCart, getInvoice } from "../../../renderer/services/saleApi"; // ✅ Import from saleApi

export function useCart() {
  const [cartUUID, setCartUUID] = useState<string | null>(null);
  const [cartData, setCartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [payments, setPayments] = useState([{ method: "cash", amount: 0 }]);

  // Init cart
  useEffect(() => {
    async function init() {
      const res = await createCart();
      setCartUUID(res.cart_uuid);
    }
    init();
  }, []);

  // Auto-fill first payment row
  useEffect(() => {
    if (cartData?.summary?.grand_total) {
      setPayments((prev) => {
        if (prev.length === 1 && prev[0].amount === 0) {
          return [{ method: "cash", amount: Number(cartData.summary.grand_total) }];
        }
        return prev;
      });
    }
  }, [cartData]);

  const refreshCart = async () => {
    if (!cartUUID) return;
    const updated = await getCart(cartUUID);
    setCartData(updated);
  };

  const addItemToCart = async (product: any) => {
    if (!cartUUID) return;
    await addItem(cartUUID, product.product_uuid);
    await refreshCart();
  };

  const increaseItem = async (item: any) => {
    if (!cartUUID) return;
    await addItem(cartUUID, item.product_uuid);
    await refreshCart();
  };

  const decreaseItem = async (item: any) => {
    if (!cartUUID) return;
    const newQty = item.quantity - 1;
    if (newQty <= 0) {
      await removeItem(cartUUID, item.product_uuid);
    } else {
      await updateItem(cartUUID, item.product_uuid, { quantity: newQty });
    }
    await refreshCart();
  };

  const applyDiscount = async (uuid: string | null, amount: number) => {
    if (!uuid) return;
    await applyDiscountApi(uuid, amount);
    await refreshCart();
  };

  const checkout = async (
    paymentMethods: any[],
    customerUUID: string | null,
    selectedCustomer: any
  ) => {
    if (!cartUUID || !cartData) return null;

    const totalPaid = paymentMethods.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const grandTotal = Number(cartData?.summary?.grand_total || 0);

    if (totalPaid < grandTotal && !customerUUID) {
      alert("Select customer for credit sale");
      return null;
    }

    if (totalPaid < grandTotal && selectedCustomer) {
      const remainingCredit =
        (selectedCustomer.credit_limit || 0) - (selectedCustomer.credit_balance || 0);
      const newCredit = grandTotal - totalPaid;
      if (newCredit > remainingCredit) {
        alert("Credit limit exceeded 🚫");
        return null;
      }
    }

    setLoading(true);
    try {
      // ✅ Now checkoutCart is imported from saleApi
      const res = await checkoutCart(cartUUID, paymentMethods, customerUUID);
      const saleUUID = res.sale?.sale_uuid;
      if (!saleUUID) throw new Error("sale_uuid missing");

      const invoice = await getInvoice(saleUUID);
      const newCart = await createCart();
      setCartUUID(newCart.cart_uuid);
      setCartData(null);
      setPayments([{ method: "cash", amount: 0 }]);
      setDiscount(0);

      return { success: true, invoice };
    } catch (err) {
      console.error(err);
      alert("Checkout failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const grandTotal = Number(cartData?.summary?.grand_total || 0);
  const balance = totalPaid - grandTotal;

  return {
    cartUUID,
    cartData,
    loading,
    discount,
    setDiscount,
    payments,
    setPayments,
    totalPaid,
    grandTotal,
    balance,
    addItem: addItemToCart,  // Alias for convenience
    increaseItem,
    decreaseItem,
    applyDiscount,
    checkout,
    refreshCart,
  };
}