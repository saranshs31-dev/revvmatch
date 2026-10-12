import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import GarageSelector from './components/garage/GarageSelector';
import PartCard from './components/catalog/PartCard';
import PartDetailsModal from './components/catalog/PartDetailsModal';
import AuthModal from './components/auth/AuthModal';
import CartPage from './pages/CartPage';

export default function App() {
  const [activeMake, setActiveMake] = useState("");
  const [activeModel, setActiveModel] = useState("");
  const [activeGen, setActiveGen] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking...");
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [generations, setGenerations] = useState([]);
  const [parts, setParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/makes')
      .then(res => res.json())
      .then(data => setMakes(Array.isArray(data) ? data : []))
      .catch(err => console.error('Failed to fetch makes:', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then(res => res.json())
      .then(data => setBackendStatus(data.status))
      .catch(err => setBackendStatus("Backend not reachable"));
  }, []);

  useEffect(() => {
    if (!activeMake) {
      setModels([]);
      return;
    }
    const selectedMake = makes.find(make => make.slug === activeMake);
    if (!selectedMake) return;

    fetch(`http://localhost:5000/api/models?make_id=${selectedMake.id}`)
      .then(res => res.json())
      .then(data => setModels(Array.isArray(data) ? data : []))
      .catch(err => console.error('Failed to fetch models:', err));
  }, [activeMake, makes]);

  useEffect(() => {
    if (!activeModel) {
      setGenerations([]);
      return;
    }
    const selectedModel = models.find(model => model.slug === activeModel);
    if (!selectedModel) return;

    fetch(`http://localhost:5000/api/generations?model_id=${selectedModel.id}`)
      .then(res => res.json())
      .then(data => setGenerations(Array.isArray(data) ? data : []))
      .catch(err => console.error('Failed to fetch generations:', err));
  }, [activeModel, models]);

  useEffect(() => {
    if (!activeGen) {
      setParts([]);
      return;
    }
    const selectedGen = generations.find(gen => gen.slug === activeGen);
    if (!selectedGen) return;

    fetch(`http://localhost:5000/api/parts?generation_id=${selectedGen.id}`)
      .then(res => res.json())
      .then(data => setParts(Array.isArray(data) ? data : []))
      .catch(err => console.error('Failed to fetch parts:', err));
  }, [activeGen, generations]);

  const fetchCart = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:5000/api/cart', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setCartItems(Array.isArray(data) ? data : []))
      .catch(err => console.error('Failed to fetch cart:', err));
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const addToCart = (part) => {
    if (user) {
      const token = localStorage.getItem('token');
      fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ part_id: part.id }),
      })
        .then(res => res.json())
        .then(() => fetchCart())
        .catch(err => console.error('Failed to add to cart:', err));
    } else {
      setCartItems(prev => {
        const existing = prev.find(item => item.part_id === part.id);
        if (existing) {
          return prev.map(item =>
            item.part_id === part.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prev, { id: `guest-${part.id}`, part_id: part.id, quantity: 1, parts: part }];
      });
    }
  };

  const updateCartQuantity = (itemId, quantity) => {
    if (user) {
      const token = localStorage.getItem('token');
      fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quantity }),
      })
        .then(res => res.json())
        .then(() => fetchCart())
        .catch(err => console.error('Failed to update cart:', err));
    } else {
      setCartItems(prev => prev.map(item => (item.id === itemId ? { ...item, quantity } : item)));
    }
  };

  const removeFromCart = (itemId) => {
    if (user) {
      const token = localStorage.getItem('token');
      fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => fetchCart())
        .catch(err => console.error('Failed to remove cart item:', err));
    } else {
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

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

  const handleAuthSuccess = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-rev-bg font-display flex flex-col selection:bg-rev-accent selection:text-white relative overflow-hidden">

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rev-accent/5 rounded-full blur-[120px] pointer-events-none glow-breathe" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none glow-breathe" style={{ animationDelay: '2s' }} />

      <header className="border-b border-gray-900 bg-rev-panel/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-white">
              REV<span className="text-rev-accent">MATCH</span>
            </span>
          </Link>

          <div className="flex items-center gap-5">
            <Link to="/cart" className="relative text-gray-300 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-rev-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">
                  Welcome, <span className="text-white font-semibold">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-gray-400 hover:text-rev-accent transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-rev-accent hover:bg-opacity-90 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col gap-10">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="flex flex-col gap-4">
                    <span className="inline-flex items-center gap-2 w-fit  rounded-full px-3 py-1 text-[10px] font-semibold text-gray-400 tracking-wide">
                      {/* <span className="w-1.5 h-1.5 rounded-full bg-rev-accent status-dot" /> */}
                      {/* RELATIONAL FITMENT ENGINE // ZERO GUESSWORK */}
                    </span>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {"Find the Perfect Match for Your Build".split(" ").map((word, i) => (
                        <span key={i} className="hero-word" style={{ animationDelay: `${i * 0.06}s` }}>
                          {word}&nbsp;
                        </span>
                      ))}
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base max-w-xl">
                      Filter a curated catalog of coilovers, aero, exhausts, and wheels by exact chassis generation — powered by a relational fitment database, not guesswork.
                    </p>

                    <div className="flex items-center gap-6 sm:gap-10 pt-2">
                      <div className="flex flex-col">
                        <span className="text-xl sm:text-2xl font-extrabold text-white">6</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wide">Makes</span>
                      </div>
                      <div className="w-px h-8 bg-gray-800" />
                      <div className="flex flex-col">
                        <span className="text-xl sm:text-2xl font-extrabold text-white">18</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wide">Models</span>
                      </div>
                      <div className="w-px h-8 bg-gray-800" />
                      <div className="flex flex-col">
                        <span className="text-xl sm:text-2xl font-extrabold text-white">20+</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wide">Parts</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden border border-gray-800 shadow-2xl shadow-black/50 aspect-[4/3]">
                    <img
                      src="/hero/garage-hero.jpg"
                      alt="Performance workshop"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      {/* <span className="w-2 h-2 rounded-full bg-rev-accent status-dot" /> */}
                      {/* <span className="text-xs font-semibold text-white tracking-wide">Live Fitment Matching // Active</span> */}
                    </div>
                  </div>
                </div>

                <section className="relative z-10">
                  <GarageSelector
                    activeMake={activeMake}
                    activeModel={activeModel}
                    activeGen={activeGen}
                    onMakeChange={handleMakeChange}
                    onModelChange={handleModelChange}
                    onGenChange={handleGenChange}
                    makes={makes}
                    models={models}
                    generations={generations}
                  />
                </section>

                <section className="flex flex-col gap-6">
                  <div className="flex items-center justify-between border-b border-gray-900 pb-4">
                    <h2 className="text-xl font-bold text-white tracking-wide">
                      Featured High-Performance Parts
                    </h2>
                    <span className="text-xs text-gray-500 font-semibold">
                      Showing {parts.length} items
                    </span>
                  </div>

                  {!activeGen ? (
                    <div className="w-full py-16 flex flex-col items-center justify-center bg-rev-panel/30 border border-dashed border-gray-700 rounded-2xl">
                      <span className="text-5xl mb-4 opacity-80">🔧</span>
                      <h3 className="text-xl font-bold text-white mb-2">Select Your Vehicle</h3>
                      <p className="text-gray-400 max-w-md text-center text-sm leading-relaxed">
                        Choose a Make, Model, and Generation above to see parts guaranteed to fit your build.
                      </p>
                    </div>
                  ) : parts.length === 0 ? (
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
                      {parts.map(part => (
                        <PartCard
                          key={part.id}
                          image={part.image_path}
                          name={part.name}
                          manufacturer={part.manufacturer}
                          category={part.category}
                          price={part.price}
                          fitmentNote={part.fitment_note}
                          onViewDetails={() => setSelectedPart(part)}
                        />
                      ))}
                    </div>
                  )}
                </section>
              </>
            }
          />

          <Route
            path="/cart"
            element={
              <CartPage
                cartItems={cartItems}
                onUpdateQuantity={updateCartQuantity}
                onRemove={removeFromCart}
              />
            }
          />
        </Routes>
      </main>

      <footer className="border-t border-gray-900 bg-rev-panel/20 py-6 text-center text-xs text-gray-600">
        <p>&copy; {new Date().getFullYear()} RevMatch. Built with precision for automotive enthusiasts.</p>
      </footer>

      <PartDetailsModal 
        part={selectedPart} 
        onClose={() => setSelectedPart(null)} 
        onAddToCart={addToCart}
      />

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

    </div>
  );
}