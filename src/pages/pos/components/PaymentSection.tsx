import { IonIcon } from '@ionic/react';
import { trashBin, checkmarkCircle, cardOutline, qrCodeOutline, cashOutline } from 'ionicons/icons';
import { useState } from 'react';

interface PaymentSectionProps {
  payments: Array<{ method: string; amount: number }>;
  onPaymentChange: (index: number, field: string, value: any) => void;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  totalPaid: number;
  balance: number;
}

export default function PaymentSection({
  payments,
  onPaymentChange,
  onAddRow,
  onRemoveRow,
  totalPaid,
  balance,
}: PaymentSectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>(payments[0]?.method || "cash");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    onPaymentChange(0, "method", method);
  };

  const handleAmountChange = (amount: number) => {
    onPaymentChange(0, "amount", amount);
  };

  return (
    <div className="space-y-4">
      <div className="font-medium text-sm text-gray-300">Payment Methods</div>
      
      {/* Payment Method Selector as Cards */}
      <div className="grid grid-cols-3 gap-2">
        {/* Cash Option */}
        <div
          className={`border-2 rounded-xl p-3 cursor-pointer transition-all ${
            selectedMethod === "cash"
              ? "border-green-500 bg-green-500/10"
              : "border-gray-700 bg-[#212121] hover:border-gray-600"
          }`}
          onClick={() => handleMethodSelect("cash")}
        >
          <div className="flex flex-col items-center gap-1">
            <span className={`text-sm font-medium ${selectedMethod === "cash" ? "text-green-500" : "text-white"}`}>Cash</span>
          </div>
        </div>

        {/* UPI Option */}
        <div
          className={`border-2 rounded-xl p-3 cursor-pointer transition-all ${
            selectedMethod === "upi"
              ? "border-purple-500 bg-purple-500/10"
              : "border-gray-700 bg-[#212121] hover:border-gray-600"
          }`}
          onClick={() => handleMethodSelect("upi")}
        >
          <div className="flex flex-col items-center gap-1">
            <span className={`text-sm font-medium ${selectedMethod === "upi" ? "text-purple-500" : "text-white"}`}>UPI</span>
            {selectedMethod === "upi" && (
              <IonIcon icon={checkmarkCircle} className="text-purple-500 text-xs absolute top-2 right-2" />
            )}
          </div>
        </div>

        {/* Card Option */}
        <div
          className={`border-2 rounded-xl p-3 cursor-pointer transition-all ${
            selectedMethod === "card"
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-700 bg-[#212121] hover:border-gray-600"
          }`}
          onClick={() => handleMethodSelect("card")}
        >
          <div className="flex flex-col items-center gap-1">
            <span className={`text-sm font-medium ${selectedMethod === "card" ? "text-blue-500" : "text-white"}`}>Card</span>
            {selectedMethod === "card" && (
              <IonIcon icon={checkmarkCircle} className="text-blue-500 text-xs absolute top-2 right-2" />
            )}
          </div>
        </div>
      </div>

      {/* UPI Details (shown only when UPI is selected) */}
      {selectedMethod === "upi" && (
        <div className="space-y-2 animate-fadeIn">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3">
            <label className="text-xs text-purple-400 mb-1 block">UPI ID</label>
            <input
              type="text"
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
              placeholder="username@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3">
            <label className="text-xs text-purple-400 mb-1 block">Amount</label>
            <input
              type="number"
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
              placeholder="Enter amount"
              value={payments[0]?.amount || ""}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
            />
          </div>
        </div>
      )}

      {/* Card Details (shown only when Card is selected) */}
      {selectedMethod === "card" && (
        <div className="space-y-2 animate-fadeIn">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
            <label className="text-xs text-blue-400 mb-1 block">Card Number</label>
            <input
              type="text"
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="XXXX XXXX XXXX XXXX"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
              <label className="text-xs text-blue-400 mb-1 block">Expiry Date</label>
              <input
                type="text"
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="MM/YY"
              />
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
              <label className="text-xs text-blue-400 mb-1 block">CVV</label>
              <input
                type="password"
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="XXX"
                maxLength={3}
              />
            </div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
            <label className="text-xs text-blue-400 mb-1 block">Amount</label>
            <input
              type="number"
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter amount"
              value={payments[0]?.amount || ""}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
            />
          </div>
        </div>
      )}

      {/* Cash Amount Input (shown when Cash is selected) */}
      {selectedMethod === "cash" && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 animate-fadeIn">
          <label className="text-xs text-green-400 mb-1 block">Amount</label>
          <input
            type="number"
            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-green-500"
            placeholder="Enter amount"
            value={payments[0]?.amount || ""}
            onChange={(e) => handleAmountChange(Number(e.target.value))}
          />
        </div>
      )}

      {/* Multiple Payment Methods Button */}
      {/* <button
        className="text-blue-400 text-sm hover:text-blue-300 transition-colors flex items-center gap-1 mt-2"
        onClick={onAddRow}
      >
        + Add Another Payment Method
      </button> */}

      {/* Summary */}
      <div className="text-sm border-t border-gray-700 pt-3 mt-2">
        <div className="flex justify-between items-center py-1">
          <span className="text-gray-400">Total Paid</span>
          <span className="font-bold text-white text-lg">₹{totalPaid.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-gray-400">Balance</span>
          <span className={balance < 0 ? "text-red-500 font-bold text-lg" : "text-green-500 font-bold text-lg"}>
            {balance < 0 ? `Due: ₹${Math.abs(balance)}` : `Change: ₹${balance}`}
          </span>
        </div>
      </div>
    </div>
  );
}