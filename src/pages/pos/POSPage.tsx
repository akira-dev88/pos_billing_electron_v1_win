import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "./components/TopBar";
import ProductGrid from "./components/ProductGrid";
import CartItems from "./components/CartItems";
import CartSummary from "./components/CartSummary";
import CustomerSelect from "./components/CustomerSelect";
import DiscountSection from "./components/DiscountSection";
import PaymentSection from "./components/PaymentSection";
import CustomerModal from "./modals/CustomerModal";
import SalesModal from "./modals/SalesModal";
import CustomerStatement from "../admin/CustomerStatement";
import { useCart } from "./hooks/useCart";
import { useProducts } from "./hooks/useProducts";
import { useCustomers } from "./hooks/useCustomers";
import { IonIcon } from '@ionic/react';
import { storefrontOutline } from 'ionicons/icons';

function POSpage() {
  const navigate = useNavigate();
  const [showPrint, setShowPrint] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);

  const { products, loading: productsLoading } = useProducts();
  const {
    cartUUID,
    cartData,
    addItem,
    increaseItem,
    decreaseItem,
    applyDiscount,
    checkout,
    refreshCart,
    discount,
    setDiscount,
    payments,
    setPayments,
    totalPaid,
    grandTotal,
    balance,
    loading: cartLoading,
  } = useCart();

  const {
    customers,
    selectedCustomer,
    setSelectedCustomer,
    ledger,
    createNewCustomer,
    addPayment,
    loadSales,
    sales,
  } = useCustomers();

  const handleCheckout = async () => {
    if (!cartUUID || !cartData) return;

    const result = await checkout(
      payments,
      selectedCustomer?.customer_uuid || null,
      selectedCustomer
    );

    if (result?.success) {
      setInvoiceData(result.invoice);
      setTimeout(() => window.print(), 500);
      alert("Payment successful");
    }
  };

  const handleCustomerPayment = async (amount: number, method: string) => {
    if (!selectedCustomer) return;
    await addPayment(selectedCustomer.customer_uuid, amount, method);
  };

  return (
    <div className="h-screen flex flex-col bg-[#141414] font-inter overflow-hidden">
      <TopBar
        onNavigate={navigate}
        onShowSales={() => {
          loadSales();
          setShowSalesModal(true);
        }}
      />

      {/* 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden gap-3 p-3">

        {/* COLUMN 1: PRODUCTS */}
        <div className="w-1/2 flex flex-col">
          <div className="px-3 font-bold text-white text-start ">
            Products
          </div>
          <ProductGrid
            products={products}
            loading={productsLoading}
            onAddItem={addItem}
          />
        </div>

        {/* COLUMN 2: CART ITEMS */}
        <div className="w-1/4 flex flex-col bg-[#1a1a1a] rounded-2xl overflow-hidden">
          <div className="p-4 font-bold text-white text-start border-b border-gray-800 flex justify-between items-center">
            <span>Cart Items</span>
            <span className="text-sm text-gray-400">
              {cartData?.cart?.items?.length || 0} items
            </span>
          </div>

          {/* Store Info */}
          <div className="m-3 p-3 bg-[#212121] rounded-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-black p-2">
                <IonIcon icon={storefrontOutline} className="text-2xl text-gray-300" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-base font-bold text-white">My Store</div>
                  <div className="text-xs text-gray-400">GSTIN: 33ABCDE1234F1Z5</div>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <span>Chennai, Tamil Nadu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Items List */}
          <CartItems
            items={cartData?.cart?.items || []}
            onIncrease={increaseItem}
            onDecrease={decreaseItem}
          />
        </div>

        {/* COLUMN 3: PAYMENT SUMMARY */}
        <div className="w-1/4 flex flex-col bg-[#1a1a1a] rounded-2xl overflow-hidden">
          <div className="p-4 font-bold text-white text-start border-b border-gray-800">
            Payment Summary
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {/* Cart Summary */}
            <CartSummary
              total={cartData?.summary?.total || 0}
              tax={cartData?.summary?.tax || 0}
              grandTotal={grandTotal}
            />

            {/* Customer Select */}
            <CustomerSelect
              customers={customers}
              selectedCustomer={selectedCustomer}
              onSelectCustomer={setSelectedCustomer}
              onAddNew={() => setShowCustomerModal(true)}
            />

            {/* Discount Section */}
            <DiscountSection
              discount={discount}
              onDiscountChange={setDiscount}
              onApplyDiscount={() => applyDiscount(cartUUID, discount)}
            />

            {/* Payment Section */}
            <PaymentSection
              payments={payments}
              onPaymentChange={(index, field, value) => {
                const updated = [...payments];
                updated[index] = { ...updated[index], [field]: value };
                setPayments(updated);
              }}
              onAddRow={() =>
                setPayments([...payments, { method: "upi", amount: 0 }])
              }
              onRemoveRow={(index) => {
                const updated = payments.filter((_, i) => i !== index);
                setPayments(updated);
              }}
              totalPaid={totalPaid}
              balance={balance}
            />

            {/* Checkout Button */}
            <button
              className="w-full bg-green-600 text-white p-3 rounded-xl font-bold disabled:opacity-50 hover:bg-green-700 transition-colors"
              onClick={handleCheckout}
              disabled={cartLoading}
            >
              {cartLoading ? "Processing..." : "Checkout"}
            </button>

            {/* Clear Due Button */}
            {selectedCustomer?.credit_balance > 0 && (
              <button
                className="w-full bg-orange-500 text-white p-2 rounded-xl text-sm hover:bg-orange-600 transition-colors"
                onClick={() => {
                  setPayments([
                    { method: "cash", amount: selectedCustomer.credit_balance },
                  ]);
                }}
              >
                Clear Old Due ₹{selectedCustomer.credit_balance}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCustomerModal && (
        <CustomerModal
          onClose={() => setShowCustomerModal(false)}
          onCreateCustomer={async (customerData) => {
            const newCustomer = await createNewCustomer(customerData);
            setSelectedCustomer(newCustomer);
            setShowCustomerModal(false);
          }}
        />
      )}

      {showSalesModal && (
        <SalesModal
          sales={sales}
          onClose={() => setShowSalesModal(false)}
          onViewInvoice={(saleUUID) => {
            console.log("View invoice:", saleUUID);
          }}
        />
      )}

      {showPrint && selectedCustomer && (
        <div className="fixed inset-0 bg-white z-50">
          <CustomerStatement customer={selectedCustomer} ledger={ledger} />
        </div>
      )}
    </div>
  );
}

export default POSpage;