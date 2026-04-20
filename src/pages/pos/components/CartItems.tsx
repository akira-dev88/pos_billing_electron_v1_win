import { IonIcon } from '@ionic/react';
import { add, addCircle, checkmarkCircle, remove, removeCircle, storefrontOutline } from 'ionicons/icons';

interface CartItemsProps {
  items: any[];
  onIncrease: (item: any) => void;
  onDecrease: (item: any) => void;
}

export default function CartItems({ items, onIncrease, onDecrease }: CartItemsProps) {
  if (items.length === 0) {
    return (
      <div className="flex-1 min-h-screen overflow-y-auto p-3 text-center text-gray-500 scrollbar-hide">
        Cart is empty. Add some products!
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-[200px] max-h-full overflow-y-auto p-2 space-y-2 scrollbar-hide">
      {items.map((item: any) => (
        <div
          key={item.product_uuid}
          className="flex justify-between items-center border border-[#2a2a2a] p-2 rounded-2xl hover:bg-[#2a2a2a] cursor-pointer"
        >
          <div className="flex gap-2 justify-center items-center">
            <IonIcon icon={checkmarkCircle} className="text-2xl" />
            <div className='text-start'>
              <div className="font-medium text-white">{item.product.name}</div>
              <div className="text-xs text-gray-500">₹{item.product.price} each</div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              className="text-white rounded-full transition hover:bg-[#141414] p-1 flex items-center justify-center w-8 h-8"
              onClick={() => onDecrease(item)}
            >
              <IonIcon icon={remove} className="text-2xl" />
            </button>
            <span className="min-w-[32px] text-center text-xl leading-none flex items-center justify-center">
              {item.quantity}
            </span>
            <button
              className="text-white rounded-full transition hover:bg-[#141414] p-1 flex items-center justify-center w-8 h-8"
              onClick={() => onIncrease(item)}
            >
              <IonIcon icon={add} className="text-2xl" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}