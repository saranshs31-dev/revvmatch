                              //GarageSelector

import React from 'react';

export default function GarageSelector({ 
  activeMake, 
  activeModel, 
  activeGen, 
  onMakeChange, 
  onModelChange, 
  onGenChange,
  makes,
  models,
  generations 
}) {
  return (
    <div className="w-full bg-rev-panel border border-gray-800 rounded-xl p-4 md:p-6 shadow-xl shadow-black/50 transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Make Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Make</label>
          <div className="relative">
            <select 
              value={activeMake}
              onChange={(e) => onMakeChange(e.target.value)}
              className="w-full bg-rev-bg border border-gray-800 text-gray-200 px-4 py-3 rounded-lg outline-none cursor-pointer focus:border-rev-accent focus:ring-2 appearance-none font-display"
            >
              <option value="">Select Make</option>
              {makes.map(make => (
               <option key={make.id} value={make.slug}>
                {make.name}
               </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        {/* Model Select (LOCKED until Make is chosen) */}
        <div className="flex flex-col gap-1.5">
          <label className={`text-xs font-semibold uppercase tracking-wider transition-colors ${!activeMake ? 'text-gray-700' : 'text-gray-400'}`}>
            Model
          </label>
          <div className="relative">
            <select 
              value={activeModel}
              onChange={(e) => onModelChange(e.target.value)}
              disabled={!activeMake}
              className="w-full bg-rev-bg border border-gray-800 text-gray-200 px-4 py-3 rounded-lg outline-none cursor-pointer focus:border-rev-accent focus:ring-2 appearance-none font-display disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Model</option>
              {models.map(model => (
                <option key={model.id} value={model.slug}>
                  {model.name}
              </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400 opacity-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        {/* Generation Select (LOCKED until Model is chosen) */}
        <div className="flex flex-col gap-1.5">
          <label className={`text-xs font-semibold uppercase tracking-wider transition-colors ${!activeModel ? 'text-gray-700' : 'text-gray-400'}`}>
            Generation
          </label>
          <div className="relative">
            <select 
              value={activeGen}
              onChange={(e) => onGenChange(e.target.value)}
              disabled={!activeModel}
              className="w-full bg-rev-bg border border-gray-800 text-gray-200 px-4 py-3 rounded-lg outline-none cursor-pointer focus:border-rev-accent focus:ring-2 appearance-none font-display disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Generation</option>
              {generations.map(generation => (
                <option key={generation.id} value={generation.slug}>
                  {generation.name} ({generation.year_start}-{generation.year_end || 'Present'})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400 opacity-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}