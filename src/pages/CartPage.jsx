import React from 'react';
import { Link } from 'react-router-dom';

export default function CartPage({ cartItems, onUpdateQuantity, onRemove }) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.parts.price) * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center bg-rev-panel/30 border border-dashed border-gray-700 rounded-2xl">
        <span className="text-5xl mb-4 opacity-80">🛒</span>
        <h3 className="text-xl font-bold text-white mb-2">Your Cart is Empty</h3>
        <p className="text-gray-400 max-w-md text-center text-sm leading-relaxed mb-6">
          Browse the catalog and add parts that fit your build.
        </p>
        <Link
          to="/"
          className="bg-rev-accent hover:bg-opacity-90 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

      {/* Summary card */}
      <div className="lg:col-span-1 lg:sticky lg:top-24 bg-rev-panel border border-gray-800 rounded-xl p-6 flex flex-col gap-4 order-1 lg:order-2">
        <h2 className="text-lg font-bold text-white">Order Summary</h2>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Items</span>
          <span className="text-white font-semibold">{totalItems}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400 pb-4 border-b border-gray-800">
          <span>Total</span>
          <span className="text-xl font-extrabold text-white">${totalPrice.toFixed(2)}</span>
        </div>

        <button className="w-full bg-rev-accent hover:bg-opacity-90 active:scale-95 text-white text-sm font-bold uppercase tracking-wider py-3 rounded-lg transition-all">
          Proceed to Buy
        </button>

        <Link
          to="/"
          className="text-xs text-gray-500 hover:text-rev-accent text-center transition-colors"
        >
          ← Continue shopping
        </Link>
      </div>

      {/* Item list */}
      <div className="lg:col-span-2 flex flex-col gap-4 order-2 lg:order-1">
        <h1 className="text-xl font-bold text-white tracking-wide mb-2">Your Cart</h1>

        {cartItems.map(item => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-rev-panel border border-gray-800 rounded-xl p-4"
          >
            <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-black/40 flex items-center justify-center">
              {item.parts.image_path ? (
                <img
                  src={item.parts.image_path}
                  alt={item.parts.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-600">No image</span>
              )}
            </div>

            <div className="flex-grow min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-rev-accent">
                {item.parts.manufacturer}
              </span>
              <h3 className="text-sm font-bold text-white truncate">{item.parts.name}</h3>
              <span className="text-sm text-gray-400">
                ${Number(item.parts.price).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-7 h-7 rounded-lg bg-rev-bg border border-gray-800 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
              >
                −
              </button>
              <span className="w-6 text-center text-sm text-white">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="w-7 h-7 rounded-lg bg-rev-bg border border-gray-800 text-white flex items-center justify-center"
              >
                +
              </button>
            </div>

            <button
              onClick={() => onRemove(item.id)}
              className="shrink-0 text-gray-500 hover:text-rev-accent transition-colors text-xs font-semibold ml-2"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}