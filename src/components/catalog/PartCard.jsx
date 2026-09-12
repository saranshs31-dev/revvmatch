                                    //partcard

import React from 'react';

export default function PartCard({ image, name, manufacturer, category, price, fitmentNote }) {
  return (
    <div className="group relative bg-rev-panel border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-rev-accent/5 hover:border-gray-700 transition-all duration-300 flex flex-col h-full">
      {/* Product Image Section */}
      <div className="relative aspect-video w-full overflow-hidden bg-black/40 flex items-center justify-center">
  {image ? (
    <img 
      src={image} 
      alt={name} 
      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
    />
  ) : (
    <div className="flex flex-col items-center justify-center text-gray-600">
      <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span className="text-xs">No image available</span>
    </div>
  )}
  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-xs font-semibold px-2.5 py-1 rounded text-gray-300 border border-gray-800">
    {category}
  </div>
</div>

      {/* Product Info Section */}
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-xs font-semibold uppercase tracking-wider text-rev-accent mb-1">
          {manufacturer}
        </span>
        <h3 className="text-lg font-bold text-white group-hover:text-rev-accent transition-colors duration-200 line-clamp-1 mb-2 font-display">
          {name}
        </h3>
        
        <div className="mt-auto pt-4 border-t border-gray-800 flex items-end justify-between">
          <div>
            <span className="text-xs text-gray-500 block uppercase tracking-wider">Price</span>
            <span className="text-xl font-extrabold text-white font-display">
              ${Number(price).toFixed(2)}
            </span>
          </div>
          
          <button className="bg-rev-accent hover:bg-opacity-90 active:scale-95 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all duration-200">
            View Details
          </button>
        </div>

        {/* Fitment Notes Badge */}
        {fitmentNote && (
          <div className="mt-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 p-3 rounded-lg flex flex-col gap-1 transition-all duration-250">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              ⚠️ Fitment Notes
            </span>
            <p className="text-xs text-gray-400 leading-relaxed">
              {fitmentNote}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
