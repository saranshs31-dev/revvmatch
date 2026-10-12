import React from 'react';
import { complianceNotes, complianceDisclaimer } from '../../data/complianceNotes';

export default function PartDetailsModal({ part, onClose, onAddToCart }) {
  if (!part) return null;

  const note = complianceNotes[part.category];

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-rev-panel border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video w-full overflow-hidden bg-black/40">
          {part.image_path ? (
            <img 
              src={part.image_path} 
              alt={part.name} 
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600">
              No image available
            </div>
          )}
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg"
          >
            ×
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
  <div>
    <span className="text-xs font-semibold uppercase tracking-wider text-rev-accent">
      {part.manufacturer}
    </span>
    <h2 className="text-2xl font-bold text-white font-display">
      {part.name}
    </h2>
  </div>
  <button
    onClick={() => onAddToCart(part)}
    className="shrink-0 bg-rev-accent hover:bg-opacity-90 active:scale-95 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all duration-200"
  >
    Add to Cart
  </button>
</div>

          <div className="flex items-center justify-between border-t border-b border-gray-800 py-3">
            <div>
              <span className="text-xs text-gray-500 block uppercase tracking-wider">Price</span>
              <span className="text-2xl font-extrabold text-white">
                ${Number(part.price).toFixed(2)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 block uppercase tracking-wider">Origin</span>
              <span className="text-sm text-gray-300">
                {part.origin || 'Not specified'}
              </span>
            </div>
          </div>

          {part.fitment_note && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-3 rounded-lg">
              <span className="text-xs font-bold uppercase tracking-wider">⚠️ Fitment Notes</span>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {part.fitment_note}
              </p>
            </div>
          )}

          {note && (
            <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 p-3 rounded-lg">
              <span className="text-xs font-bold uppercase tracking-wider">🇮🇳 India Compliance Note</span>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {note}
              </p>
              <p className="text-[10px] text-gray-600 mt-2 italic">
                {complianceDisclaimer}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}