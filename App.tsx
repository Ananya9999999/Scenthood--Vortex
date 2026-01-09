
import React, { useState, useEffect } from 'react';
import { UserProfile, Perfume, AppState, SavedRecommendation, ProductType } from './types';
import Landing from './components/Landing';
import Registration from './components/Registration';
import Collection from './components/Collection';
import Dashboard from './components/Dashboard';
import { database } from './services/storageService';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>('LANDING');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedProductType, setSelectedProductType] = useState<ProductType>('PERFUME');
  const [collection, setCollection] = useState<Perfume[]>([]);
  const [history, setHistory] = useState<SavedRecommendation[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  useEffect(() => {
    const initData = () => {
      try {
        const profile = database.getProfile();
        const coll = database.getCollection();
        const hist = database.getHistory();
        
        setUserProfile(profile);
        setCollection(coll);
        setHistory(hist);
        if (profile) setSelectedProductType(profile.productType);
      } catch (e) {
        console.error("Initialization error", e);
      } finally {
        setIsInitialized(true);
      }
    };
    initData();
  }, []);

  const handleStart = () => {
    if (userProfile) {
      setView('DASHBOARD');
    } else {
      setView('PRODUCT_SELECTION');
    }
  };

  const selectProduct = (type: ProductType) => {
    setSelectedProductType(type);
    setView('REGISTRATION');
  };

  const handleRegister = (profile: UserProfile) => {
    const fullProfile = { ...profile, productType: selectedProductType };
    setUserProfile(fullProfile);
    database.saveProfile(fullProfile);
    setView('COLLECTION');
  };

  const handleCollectionUpdate = (newCollection: Perfume[]) => {
    setCollection(newCollection);
    database.saveCollection(newCollection);
  };

  const handleNewRecommendation = (entry: SavedRecommendation) => {
    setHistory(prev => {
      const updated = [entry, ...prev].slice(0, 20);
      return updated;
    });
    database.saveToHistory(entry);
  };

  const handleUpdateBlacklist = (perfumeName: string) => {
    if (userProfile) {
      const updated = {
        ...userProfile,
        blacklist: [...(userProfile.blacklist || []), perfumeName]
      };
      setUserProfile(updated);
      database.saveProfile(updated);
    }
  };

  const handleReset = () => {
    database.wipeAll();
    setUserProfile(null);
    setCollection([]);
    setHistory([]);
    setView('LANDING');
    window.location.reload();
  };

  const handleNewAccount = () => {
    if (window.confirm("Start fresh? This will delete your current profile and history.")) {
      database.wipeAll();
      setUserProfile(null);
      setCollection([]);
      setHistory([]);
      setView('PRODUCT_SELECTION');
    }
  };

  if (!isInitialized) return (
    <div className="bg-luxury min-h-screen flex items-center justify-center">
      <div className="text-gold animate-pulse font-serif text-4xl">S</div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col selection:bg-gold selection:text-black">
      {view === 'LANDING' && (
        <Landing 
          onStart={handleStart} 
          hasAccount={!!userProfile} 
          onNewAccount={handleNewAccount}
        />
      )}

      {view === 'PRODUCT_SELECTION' && (
        <div className="min-h-screen bg-luxury flex flex-col items-center justify-center p-8">
          <h2 className="text-4xl font-serif text-gold mb-16 text-center">Your Olfactory Journey Begins With...</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <button 
              onClick={() => selectProduct('PERFUME')}
              className="group p-12 border border-white/10 hover:border-gold transition-all duration-500 bg-white/5 hover:bg-gold/5 flex flex-col items-center gap-6"
            >
              <span className="text-6xl">✨</span>
              <span className="text-2xl font-serif text-white group-hover:text-gold tracking-widest uppercase">Perfumes</span>
              <p className="text-[10px] text-white/60 tracking-widest uppercase text-center leading-relaxed">Personal narratives and skin chemistry</p>
            </button>
            <button 
              onClick={() => selectProduct('CANDLE')}
              className="group p-12 border border-white/10 hover:border-gold transition-all duration-500 bg-white/5 hover:bg-gold/5 flex flex-col items-center gap-6"
            >
              <span className="text-6xl">🕯️</span>
              <span className="text-2xl font-serif text-white group-hover:text-gold tracking-widest uppercase">Candles</span>
              <p className="text-[10px] text-white/60 tracking-widest uppercase text-center leading-relaxed">Atmospheric curation and home ambiance</p>
            </button>
          </div>
          <button onClick={() => setView('LANDING')} className="mt-12 text-[10px] uppercase tracking-widest text-white hover:text-gold transition-colors underline underline-offset-8">Return Home</button>
        </div>
      )}
      
      {view === 'REGISTRATION' && (
        <Registration 
          onSubmit={handleRegister} 
          onBack={() => setView('PRODUCT_SELECTION')}
          initialData={userProfile}
          productType={selectedProductType}
        />
      )}

      {view === 'COLLECTION' && (
        <Collection 
          collection={collection} 
          history={history}
          onUpdate={handleCollectionUpdate} 
          onContinue={() => setView('DASHBOARD')} 
          onBack={() => setView('REGISTRATION')}
          productType={selectedProductType}
        />
      )}

      {view === 'DASHBOARD' && userProfile && (
        <Dashboard 
          profile={userProfile} 
          collection={collection} 
          history={history}
          onBackToCollection={() => setView('COLLECTION')}
          onReset={handleReset}
          onSaveRecommendation={handleNewRecommendation}
          onUpdateBlacklist={handleUpdateBlacklist}
        />
      )}
    </div>
  );
};

export default App;
