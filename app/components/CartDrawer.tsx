"use client";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, totalPrice } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0d0722] border-l border-purple-950 p-6 flex flex-col justify-between text-white shadow-2xl">
          <div>
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-4">
              <h2 className="text-xl font-bold">Shopping Cart 🛒</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-slate-400 hover:text-white text-lg px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <p className="text-slate-400 text-center py-12">Your cart is empty.</p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-purple-950/30 border border-purple-900/40 p-3 rounded-2xl"
                  >
                    <div>
                      <h4 className="font-semibold text-sm line-clamp-1">
                        {item.title || item.name}
                      </h4>
                      <p className="text-xs text-purple-300 mt-0.5">
                        ${item.price} × {item.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 text-xs px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-purple-900/40 pt-6">
            <div className="flex items-center justify-between text-base font-semibold mb-4">
              <span className="text-slate-300">Subtotal</span>
              <span className="text-2xl font-black text-purple-300">${totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={() => alert("Checkout simulated successfully! Ready for real payment gateway integration.")}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-600/40 transition-all active:scale-95"
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}