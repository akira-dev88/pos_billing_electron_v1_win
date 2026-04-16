import React from "react";

export default function CustomerStatement({
  customer,
  ledger,
}: any) {
  const totalDebit = ledger
    .filter((l: any) => l.type === "sale")
    .reduce((sum: number, l: any) => sum + Number(l.amount), 0);

  const totalCredit = ledger
    .filter((l: any) => l.type === "payment")
    .reduce((sum: number, l: any) => sum + Number(l.amount), 0);

  return (
    <div className="p-6 text-sm print:text-black">

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold">Customer Statement</h1>
        <div>{customer.name}</div>
        <div>{customer.mobile}</div>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <div>Total Sales: ₹{totalDebit}</div>
        <div>Total Payments: ₹{totalCredit}</div>
        <div className="font-bold">
          Balance: ₹{totalDebit - totalCredit}
        </div>
      </div>

      {/* Ledger Table */}
      <table className="w-full border text-xs">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Date</th>
            <th className="text-left p-2">Type</th>
            <th className="text-left p-2">Note</th>
            <th className="text-right p-2">Amount</th>
          </tr>
        </thead>

        <tbody>
          {ledger.map((l: any) => (
            <tr key={l.id} className="border-b">
              <td className="p-2">
                {new Date(l.created_at).toLocaleDateString()}
              </td>
              <td className="p-2 capitalize">{l.type}</td>
              <td className="p-2">{l.note}</td>
              <td className="p-2 text-right">
                ₹{Number(l.amount).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}