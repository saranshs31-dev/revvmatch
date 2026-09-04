import React, { useState, useEffect } from 'react';          {/* ← CHANGE 1 */}
import GarageSelector from './components/garage/GarageSelector';
import PartCard from './components/catalog/PartCard';

import exhaustImg from './assets/exhaust.png';
import coiloversImg from './assets/coilovers.png';
import wheelsImg from './assets/wheels.png';

export default function App() {
  const [activeMake, setActiveMake] = useState("");
  const [activeModel, setActiveModel] = useState("");
  const [activeGen, setActiveGen] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking...");
  const [makes, setMakes] = useState([]);

  useEffect(() => {
  fetch('http://localhost:5000/api/makes')
    .then(res => res.json())
    .then(data => setMakes(data))
    .catch(err => console.error('Failed to fetch makes:', err));
 }, []);

  // ← CHANGE 2: new useEffect, placed right after your useState lines
  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then(res => res.json())
      .then(data => setBackendStatus(data.status))
      .catch(err => setBackendStatus("Backend not reachable"));
  }, []);

  const handleMakeChange = (make) => {
    setActiveMake(make);
    setActiveModel(""); 
    setActiveGen("");   
  };

  const handleModelChange = (model) => {
    setActiveModel(model);
    setActiveGen("");   
  };

  const handleGenChange = (gen) => {
    setActiveGen(gen);
  };

  const mockParts = [
    {
      id: 1,
      name: "Cat-Back Exhaust System",
      manufacturer: "Apex Performance",
      category: "Exhaust",
      price: 1249.99,
      image: exhaustImg,
      fitmentNote: "Requires professional installation. Compatible with standard OEM bumpers only.",
      compatibleMake: "bmw",
      compatibleModel: "m3",
      compatibleGen: "e92" 
    },
    {
      id: 2,
      name: "Road & Track Coilover Kit",
      manufacturer: "Ohlins Suspension",
      category: "Suspension",
      price: 2450.00,
      image: coiloversImg,
      fitmentNote: null,
      compatibleMake: "porsche",
      compatibleModel: "911",
      compatibleGen: "992" 
    },
    {
      id: 3,
      name: "Flow-Formed RF1 Racing Wheels",
      manufacturer: "Apex Racing",
      category: "Wheels",
      price: 580.00,
      image: wheelsImg,
      fitmentNote: "Fenders may need to be rolled depending on ride height.",
      compatibleMake: "bmw",
      compatibleModel: "m3",
      compatibleGen: "e92" 
    }
  ];

  const displayedParts = mockParts.filter(part => {
    const matchMake = activeMake === "" || part.compatibleMake === activeMake;
    const matchModel = activeModel === "" || part.compatibleModel === activeModel;
    const matchGen = activeGen === "" || part.compatibleGen === activeGen;
    
    return matchMake && matchModel && matchGen;
  });

  return (
    <div className="min-h-screen bg-rev-bg font-display flex flex-col selection:bg-rev-accent selection:text-white relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rev-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <header className="border-b border-gray-900 bg-rev-panel/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-white">
              REV<span className="text-rev-accent">MATCH</span>
            </span>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col gap-10">
        
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Find the Perfect Match for Your Build
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl">
            Select your vehicle specs below to filter our high-performance catalog with guaranteed fitment.
          </p>
          {/* <p className="text-xs text-green-500">{backendStatus}</p>  ← CHANGE 3 */}
        </div>

        <section className="relative z-10">
          <GarageSelector 
            activeMake={activeMake}
            activeModel={activeModel}
            activeGen={activeGen}
            onMakeChange={handleMakeChange}
            onModelChange={handleModelChange}
            onGenChange={handleGenChange}
          />
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-gray-900 pb-4">
            <h2 className="text-xl font-bold text-white tracking-wide">
              Featured High-Performance Parts
            </h2>
            <span className="text-xs text-gray-500 font-semibold">
              Showing {displayedParts.length} items
            </span>
          </div>

          {displayedParts.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center bg-rev-panel/30 border border-dashed border-gray-700 rounded-2xl">
              <span className="text-5xl mb-4 opacity-80">⚠️</span>
              <h3 className="text-xl font-bold text-white mb-2">Configuration Mismatch</h3>
              <p className="text-gray-400 max-w-md text-center text-sm leading-relaxed">
                We couldn't find any parts matching this exact combination. Please check your Make, Model, and Generation selections.
              </p>
              <button 
                onClick={() => handleMakeChange("")}
                className="mt-6 text-rev-accent text-sm font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayedParts.map(part => (
                <PartCard 
                  key={part.id}
                  image={part.image}
                  name={part.name}
                  manufacturer={part.manufacturer}
                  category={part.category}
                  price={part.price}
                  fitmentNote={part.fitmentNote}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-gray-900 bg-rev-panel/20 py-6 text-center text-xs text-gray-600">
        <p>&copy; {new Date().getFullYear()} RevMatch. Built with precision for automotive enthusiasts.</p>
      </footer>
    </div>
  );
}