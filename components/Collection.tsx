
import React, { useState } from 'react';
import { Perfume, SavedRecommendation, ProductType } from '../types';
import { getFlipkartUrl, getAmazonUrl } from '../services/shoppingService';

interface CollectionProps {
  collection: Perfume[];
  history: SavedRecommendation[];
  onUpdate: (newCollection: Perfume[]) => void;
  onContinue: () => void;
  onBack: () => void;
  productType: ProductType;
}

const Collection: React.FC<CollectionProps> = ({ collection, history, onUpdate, onContinue, onBack, productType }) => {
  const [newName, setNewName] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newBrand) return;
    const newItem: Perfume = {
      id: Date.now().toString(),
      name: newName,
      brand: newBrand,
      notes: newNotes
    };
    onUpdate([...collection, newItem]);
    setNewName('');
    setNewBrand('');
    setNewNotes('');
  };

  const handleRemove = (id: string) => {
    onUpdate(collection.filter(p => p.id !== id));
  };

  const productIcon = productType === 'PERFUME' ? '✨' : '🕯️';
  const labelBrand = productType === 'PERFUME' ? 'Maison / Brand' : 'House / Brand';
  const labelName = productType === 'PERFUME' ? 'Fragrance Name' : 'Candle Name';
  const labelNotes = productType === 'PERFUME' ? 'Scent Notes' : 'Aroma Profile';

  return (
    <div className="min-h-screen bg-luxury text-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={onBack}
            className="text-[10px] tracking-[0.3em] uppercase text-white hover:text-gold transition-colors"
          >
            ← Back
          </button>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-5xl font-serif text-gold mb-4">Your Private Gallery {productIcon}</h2>
          <p className="text-[10px] tracking-[0.5em] uppercase text-white">Index the {productType.toLowerCase()} masterpieces you own</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16">
          <div className="lg:col-span-1">
            <div className="bg-white/5 p-8 border border-white/10 backdrop-blur-md sticky top-10 shadow-2xl">
              <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-8">Add to Library</h3>
              <form onSubmit={handleAdd} className="space-y-6">
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.3em] text-white mb-1">{labelBrand}</label>
                  <input 
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="e.g. Diptyque"
                    className="w-full bg-transparent border-b border-white/10 py-3 text-sm outline-none focus:border-gold transition-all text-white placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.3em] text-white mb-1">{labelName}</label>
                  <input 
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Feu de Bois"
                    className="w-full bg-transparent border-b border-white/10 py-3 text-sm outline-none focus:border-gold transition-all text-white placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.3em] text-white mb-1">{labelNotes}</label>
                  <input 
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="e.g. Smoked Woods, Lapsang Souchong"
                    className="w-full bg-transparent border-b border-white/10 py-3 text-sm outline-none focus:border-gold transition-all text-white placeholder:text-white/30"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-white/5 border border-gold text-gold text-[10px] tracking-[0.3em] uppercase hover:bg-gold hover:text-black transition-all duration-500 font-bold"
                >
                  Archive {productType === 'PERFUME' ? 'Scent' : 'Atmosphere'}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-20">
            <section>
               <h4 className="text-[10px] tracking-[0.5em] uppercase text-gold mb-8 border-b border-white/10 pb-4">Owned Pieces</h4>
              {collection.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/10 bg-white/5 px-8 text-center">
                  <p className="text-white font-serif italic text-xl mb-4">Your shelf awaits its first {productType.toLowerCase()}...</p>
                  <div className="w-12 h-[1px] bg-gold/50 mt-8"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {collection.map((item) => (
                    <div key={item.id} className="bg-white/5 p-6 border border-white/10 group relative hover:border-gold/50 transition-all duration-500">
                      <p className="text-[9px] tracking-[0.3em] text-gold uppercase mb-1">{item.brand}</p>
                      <p className="text-lg font-serif text-white mb-2">{item.name}</p>
                      {item.notes && (
                        <p className="text-[9px] text-white italic truncate" title={item.notes}>{item.notes}</p>
                      )}
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {history.length > 0 && (
              <section className="animate-fade-in">
                <h4 className="text-[10px] tracking-[0.5em] uppercase text-gold mb-8 border-b border-white/10 pb-4">Discovery Archive</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {history.map(entry => (
                    <div key={entry.id} className="bg-white/5 border border-white/10 p-6 text-left group hover:border-gold/30 transition-all duration-500 flex flex-col gap-4">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 bg-black/40 border border-white/5 flex-shrink-0 overflow-hidden">
                            {entry.imageUrl ? (
                              <img src={entry.imageUrl} alt={entry.recommendation.newDiscovery.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[8px] text-white uppercase">No Img</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[8px] tracking-widest text-gold uppercase mb-1">{entry.recommendation.newDiscovery.brand}</p>
                            <h5 className="text-md font-serif text-white truncate mb-1">{entry.recommendation.newDiscovery.name}</h5>
                            <div className="flex flex-col gap-1">
                               <p className="text-[8px] text-white uppercase tracking-widest">
                                  {entry.context.productType} | {entry.context.mood}
                               </p>
                               <p className="text-[7px] text-gold/80 uppercase tracking-[0.2em] font-bold">
                                  Strength: {entry.recommendation.newDiscovery.atomizingStrength}
                               </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <a 
                            href={getFlipkartUrl(entry.recommendation.newDiscovery.brand, entry.recommendation.newDiscovery.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 bg-white/5 border border-white/10 text-white text-center block tracking-widest uppercase text-[8px] font-bold hover:border-blue-500/50 hover:bg-blue-500/5 transition-all shadow-lg"
                          >
                            Flipkart
                          </a>
                          <a 
                            href={getAmazonUrl(entry.recommendation.newDiscovery.brand, entry.recommendation.newDiscovery.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 bg-white/5 border border-white/10 text-white text-center block tracking-widest uppercase text-[8px] font-bold hover:border-orange-500/50 hover:bg-orange-500/5 transition-all shadow-lg"
                          >
                            Amazon
                          </a>
                        </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="flex justify-center pb-12">
              <button 
                onClick={onContinue}
                className="group relative px-16 md:px-24 py-5 tracking-[0.4em] uppercase text-[11px] font-bold transition-all duration-700 bg-gold text-black hover:scale-105 shadow-[0_10px_30px_rgba(212,175,55,0.3)]"
              >
                Return to discovery
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
