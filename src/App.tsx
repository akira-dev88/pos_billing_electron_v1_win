import { useCartStore } from "./renderer/store/cartStore";

function App() {
  const { items, addItem } = useCartStore();

  const mockProduct = {
    product_uuid: "1",
    name: "Milk",
    price: 50,
    gst_percent: 5,
  };

  return (
    <div className="flex h-screen">
      
      {/* LEFT - Products */}
      <div className="w-1/2 p-4 border-r">
        <h1 className="text-xl font-bold mb-4">Products</h1>

        <button
          className="p-4 bg-blue-500 text-white"
          onClick={() => addItem(mockProduct)}
        >
          Add Milk
        </button>
      </div>

      {/* RIGHT - Cart */}
      <div className="w-1/2 p-4">
        <h1 className="text-xl font-bold mb-4">Cart</h1>

        {items.map((item: any) => (
          <div key={item.product_uuid} className="flex justify-between">
            <span>{item.name}</span>
            <span>{item.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;