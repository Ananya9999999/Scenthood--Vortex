
import React, { useState, useMemo } from 'react';
import { UserProfile, Perfume, Recommendation, SavedRecommendation } from '../types';
import { MOODS, OCCASIONS, WEATHER, TIMES, COUNTRIES } from '../constants';
import { getPerfumeRecommendation, generatePerfumeImage } from '../services/geminiService';
import { getFlipkartUrl, getAmazonUrl } from '../services/shoppingService';

interface DashboardProps {
  profile: UserProfile;
  collection: Perfume[];
  history: SavedRecommendation[];
  onBackToCollection: () => void;
  onReset: () => void;
  onSaveRecommendation: (entry: SavedRecommendation) => void;
  onUpdateBlacklist: (name: string) => void;
}

type QuizStep = 'MOOD' | 'OCCASION' | 'ATMOSPHERE' | 'RESULT';

const Dashboard: React.FC<DashboardProps> = ({ 
  profile, 
  collection, 
  history, 
  onBackToCollection, 
  onReset, 
  onSaveRecommendation,
  onUpdateBlacklist
}) => {
  const isCandle = profile.productType === 'CANDLE';
  const [step, setStep] = useState<QuizStep>('MOOD');
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);
  const [selectedOccasion, setSelectedOccasion] = useState(OCCASIONS[0]);
  const [currentWeather, setCurrentWeather] = useState('Warm');
  const [currentTime, setCurrentTime] = useState('Afternoon');
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [recImage, setRecImage] = useState<string | null>(null);
  const [collectionRecImage, setCollectionRecImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const countryData = useMemo(() => {
    return COUNTRIES.find(c => c.code === profile.country);
  }, [profile.country]);

  const handleFinishQuiz = async () => {
    setLoading(true);
    setStep('RESULT');
    setRecImage(null);
    setCollectionRecImage(null);
    try {
      const rec = await getPerfumeRecommendation(
        { ...profile, weatherPreference: currentWeather.toLowerCase() as any, timeOfDay: currentTime.toLowerCase() as any },
        collection,
        selectedMood,
        isCandle ? undefined : selectedOccasion
      );
      setRecommendation(rec);
      
      const imagePromises: Promise<void>[] = [];
      let generatedMainImg: string | null = null;
      
      imagePromises.push(
        generatePerfumeImage(rec.newDiscovery.name, rec.newDiscovery.brand, profile.productType)
          .then(img => { setRecImage(img); generatedMainImg = img; })
      );

      if (rec.collectionMatch) {
        imagePromises.push(
          generatePerfumeImage(rec.collectionMatch.name, rec.collectionMatch.brand, profile.productType)
            .then(img => { setCollectionRecImage(img); })
        );
      }

      await Promise.all(imagePromises);

      const historyEntry: SavedRecommendation = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        recommendation: rec,
        imageUrl: generatedMainImg,
        context: { 
            mood: selectedMood, 
            occasion: isCandle ? undefined : selectedOccasion,
            productType: profile.productType
        }
      };
      onSaveRecommendation(historyEntry);

    } catch (error) {
      console.error("Failed to fetch recommendation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = () => {
    if (recommendation) {
      onUpdateBlacklist(recommendation.newDiscovery.name);
      handleFinishQuiz(); // Regenerate immediately
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'Confident': return '🦁';
      case 'Relaxed': return '🍃';
      case 'Romantic': return '🌹';
      case 'Energized': return '⚡';
      case 'Mysterious': return '🌑';
      case 'Elegant': return '💎';
      case 'Cozy': return '🕯️';
      default: return '✨';
    }
  };

  const getOccasionEmoji = (occ: string) => {
    switch (occ) {
      case 'Work/Office': return '💼';
      case 'Formal Event': return '🎩';
      case 'Date Night': return '🥂';
      case 'Casual Outing': return '👟';
      case 'Wedding': return '💍';
      case 'Gym/Sport': return '🏋️';
      case 'Home Relaxation': return '🛁';
      default: return '📍';
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'MOOD':
        return (
          <div className="animate-fade-in text-center max-w-2xl mx-auto px-4">
            <h2 className="text-xs tracking-[0.4em] uppercase text-gold mb-4">Discovery Phase I 🎭</h2>
            <h3 className="text-4xl font-serif mb-12 text-white">How are you feeling today?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOODS.map(m => (
                <button 
                  key={m}
                  onClick={() => { 
                    setSelectedMood(m); 
                    if (isCandle) {
                        handleFinishQuiz();
                    } else {
                        setStep('OCCASION'); 
                    }
                  }}
                  className="group p-8 border border-white/10 hover:border-gold transition-all duration-500 bg-white/5 hover:bg-gold/5 text-left relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2 opacity-100 transition-opacity text-2xl">{getMoodEmoji(m)}</div>
                  <p className="text-xs tracking-[0.2em] uppercase text-white group-hover:text-gold transition-colors mb-2">Mood</p>
                  <p className="text-xl font-serif text-white group-hover:text-gold transition-colors">{m}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 'OCCASION':
        return (
          <div className="animate-fade-in text-center max-w-2xl mx-auto px-4">
            <h2 className="text-xs tracking-[0.4em] uppercase text-gold mb-4">Discovery Phase II 📍</h2>
            <h3 className="text-4xl font-serif mb-12 text-white">Where are you heading?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {OCCASIONS.map(o => (
                <button 
                  key={o}
                  onClick={() => { setSelectedOccasion(o); setStep('ATMOSPHERE'); }}
                  className="group p-8 border border-white/10 hover:border-gold transition-all duration-500 bg-white/5 hover:bg-gold/5 text-left relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2 opacity-100 transition-opacity text-2xl">{getOccasionEmoji(o)}</div>
                  <p className="text-xs tracking-[0.2em] uppercase text-white group-hover:text-gold transition-colors mb-2">Setting</p>
                  <p className="text-xl font-serif text-white group-hover:text-gold transition-colors">{o}</p>
                </button>
              ))}
            </div>
            <button onClick={() => setStep('MOOD')} className="mt-12 text-[10px] uppercase tracking-widest text-white hover:text-gold transition-colors underline underline-offset-8">Return to moods</button>
          </div>
        );
      case 'ATMOSPHERE':
        return (
          <div className="animate-fade-in text-center max-w-3xl mx-auto px-4">
            <h2 className="text-xs tracking-[0.4em] uppercase text-gold mb-4">Discovery Phase III 🌦️</h2>
            <h3 className="text-4xl font-serif mb-16 text-white">The current atmosphere</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div className="text-left">
                <label className="block text-[10px] uppercase tracking-widest text-gold mb-6 font-bold">Current Weather</label>
                <div className="grid grid-cols-2 gap-3">
                  {WEATHER.map(w => (
                    <button 
                      key={w}
                      onClick={() => setCurrentWeather(w)}
                      className={`px-4 py-4 text-[10px] tracking-widest border transition-all uppercase font-bold ${
                        currentWeather === w ? 'bg-gold text-black border-gold' : 'border-white/10 text-white hover:border-white/30'
                      }`}
                    >
                      {w === 'Warm' ? '☀️' : w === 'Cold' ? '❄️' : w === 'Humid' ? '💧' : '🏜️'} {w}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-left">
                <label className="block text-[10px] uppercase tracking-widest text-gold mb-6 font-bold">Current Time</label>
                <div className="grid grid-cols-2 gap-3">
                  {TIMES.map(t => (
                    <button 
                      key={t}
                      onClick={() => setCurrentTime(t)}
                      className={`px-4 py-4 text-[10px] tracking-widest border transition-all uppercase font-bold ${
                        currentTime === t ? 'bg-gold text-black border-gold' : 'border-white/10 text-white hover:border-white/30'
                      }`}
                    >
                      {t === 'Morning' ? '🌅' : t === 'Afternoon' ? '🌤️' : t === 'Evening' ? '🌇' : '🌙'} {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6">
              <button 
                onClick={handleFinishQuiz}
                className="w-full max-w-md py-6 bg-gold text-black tracking-[0.4em] uppercase text-xs font-bold hover:bg-opacity-90 transition-all shadow-[0_10px_40px_rgba(212,175,55,0.2)]"
              >
                Synthesize My Essence ✨
              </button>
              <button onClick={() => setStep('OCCASION')} className="text-[10px] uppercase tracking-widest text-white hover:text-gold transition-colors underline underline-offset-8">Return to occasions</button>
            </div>
          </div>
        );
      case 'RESULT':
        if (loading) return (
          <div className="flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
            <div className="relative mb-12">
              <div className="text-[10rem] font-serif text-gold/10 leading-none">S</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-t-2 border-gold rounded-full animate-spin"></div>
              </div>
            </div>
            <p className="text-[10px] tracking-[0.5em] uppercase text-gold animate-bounce">Curating your unique narrative...</p>
          </div>
        );

        return (
          <div className="animate-fade-in max-w-6xl mx-auto px-4 pb-20">
            <div className="text-center mb-16">
              <h2 className="text-xs tracking-[0.4em] uppercase text-gold mb-4">Your Personalized Curation</h2>
              <div className="flex justify-center flex-wrap gap-4 text-[10px] uppercase tracking-widest text-white italic">
                <span>{selectedMood}</span>
                {!isCandle && (
                  <>
                    <span className="opacity-50">•</span>
                    <span>{selectedOccasion}</span>
                    <span className="opacity-50">•</span>
                    <span>{currentWeather} Skies</span>
                    <span className="opacity-50">•</span>
                    <span>{currentTime} Mood</span>
                  </>
                )}
                <span className="opacity-50">•</span>
                <span>{profile.productType}</span>
              </div>
              <p className="text-[8px] tracking-[0.3em] uppercase text-gold mt-4">Selected within: {countryData?.currency} {profile.minPrice} - {profile.maxPrice}</p>
            </div>

            {recommendation && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-white/5 p-12 border border-white/10 backdrop-blur-md flex flex-col group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <span className="text-8xl font-serif text-white">S</span>
                  </div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-gold mb-8 block font-bold border-l border-gold pl-4">The Familiar Classic</span>
                  {recommendation.collectionMatch ? (
                    <div className="flex-1 flex flex-col lg:flex-row gap-8">
                       <div className="flex-1">
                        <h3 className="text-4xl font-serif text-white mb-3 group-hover:text-gold transition-colors duration-500">{recommendation.collectionMatch.name}</h3>
                        <p className="text-sm tracking-widest text-white uppercase mb-10">{recommendation.collectionMatch.brand}</p>
                        <p className="text-white text-sm italic leading-relaxed font-light border-t border-white/5 pt-8">
                          {isCandle 
                            ? `Revisiting your library, this candle perfectly complements a ${selectedMood.toLowerCase()} ambiance.` 
                            : `Revisiting your library, this scent resonates most with your ${selectedMood.toLowerCase()} mood.`}
                        </p>
                      </div>
                      
                      <div className="w-full lg:w-48 h-64 lg:h-auto relative overflow-hidden shadow-2xl bg-white/5 flex items-center justify-center border border-white/10 mt-8 lg:mt-0">
                        {collectionRecImage ? (
                          <img src={collectionRecImage} alt={recommendation.collectionMatch.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                        ) : (
                          <div className="text-gold/30 animate-pulse text-[8px] uppercase tracking-[0.3em] p-4 text-center font-bold">Rendering Match...</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center italic text-white text-sm px-8 text-center min-h-[150px]">
                      Your current library holds no direct counterpart for this specific atmospheric blend. A perfect moment for discovery.
                    </div>
                  )}
                </div>

                <div className="bg-gold p-12 text-black shadow-2xl flex flex-col transform hover:translate-y-[-10px] transition-all duration-700 relative overflow-hidden group">
                  {recommendation.newDiscovery.isLocalBrand && (
                    <div className="absolute top-0 right-0 bg-black text-gold text-[8px] font-bold px-4 py-1 uppercase tracking-widest z-20">
                      Local Treasure
                    </div>
                  )}
                  <span className="text-[10px] tracking-[0.3em] uppercase opacity-90 mb-8 block font-bold border-l border-black/40 pl-4">The New Discovery</span>
                  
                  <div className="flex-1 flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                      <h3 className="text-3xl md:text-5xl font-serif mb-3 leading-tight tracking-tight">{recommendation.newDiscovery.name}</h3>
                      <p className="text-sm tracking-[0.3em] opacity-90 uppercase mb-12 font-bold">{recommendation.newDiscovery.brand}</p>
                      
                      <div className="mb-8 border-y border-black/10 py-8">
                        <p className="text-[10px] uppercase tracking-[0.2em] opacity-80 mb-4 font-bold">Olfactory Character</p>
                        <p className="text-md leading-relaxed mb-6 italic font-light tracking-wide">{recommendation.newDiscovery.description}</p>
                        
                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest opacity-80 mb-2 font-bold">Investment</p>
                            <p className="text-3xl font-serif">{recommendation.newDiscovery.currency} {recommendation.newDiscovery.price}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-widest opacity-80 mb-2 font-bold">{isCandle ? 'Throw Profile' : 'Dominant Notes'}</p>
                            <p className="text-xs uppercase tracking-widest font-bold leading-relaxed">{recommendation.newDiscovery.notes}</p>
                          </div>
                        </div>

                        {/* Atomizing Strength Section */}
                        <div className="mt-8 pt-8 border-t border-black/10">
                           <p className="text-[10px] uppercase tracking-widest opacity-80 mb-2 font-bold">
                              {isCandle ? 'Atmospheric Projection' : 'Atomizing Strength'}
                           </p>
                           <div className="flex items-center gap-4">
                              <div className="w-8 h-8 flex items-center justify-center border border-black/20 rounded-full">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                 </svg>
                              </div>
                              <p className="text-sm font-bold uppercase tracking-widest">{recommendation.newDiscovery.atomizingStrength}</p>
                           </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <a 
                            href={getFlipkartUrl(recommendation.newDiscovery.brand, recommendation.newDiscovery.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-4 bg-black/40 border border-white/10 text-white text-center block tracking-widest uppercase text-[10px] font-bold hover:border-blue-500/50 hover:bg-blue-500/5 transition-all shadow-xl"
                          >
                            Flipkart
                          </a>
                          <a 
                            href={getAmazonUrl(recommendation.newDiscovery.brand, recommendation.newDiscovery.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-4 bg-black/40 border border-white/10 text-white text-center block tracking-widest uppercase text-[10px] font-bold hover:border-orange-500/50 hover:bg-orange-500/5 transition-all shadow-xl"
                          >
                            Amazon
                          </a>
                        </div>
                        <button 
                          onClick={handleReject}
                          className="w-full py-3 border border-black/20 text-black/80 text-[9px] uppercase tracking-[0.3em] font-bold hover:bg-black/5 transition-all"
                        >
                          Not for me - Change Recommendation
                        </button>
                      </div>
                    </div>

                    <div className="w-full lg:w-56 h-72 lg:h-auto relative overflow-hidden shadow-2xl bg-black/20 flex items-center justify-center border border-black/10">
                      {recImage ? (
                        <img src={recImage} alt={recommendation.newDiscovery.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      ) : (
                        <div className="text-black/40 animate-pulse text-[10px] uppercase tracking-[0.3em] p-4 text-center font-bold">Visualizing Atmosphere...</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-24 text-center flex flex-col items-center gap-4">
              <button 
                onClick={() => setStep('MOOD')}
                className="group px-12 py-5 border border-white/10 text-white hover:text-gold hover:border-gold transition-all uppercase text-[10px] tracking-[0.5em] flex items-center gap-4 mx-auto"
              >
                <span className="w-8 h-[1px] bg-white/10 group-hover:bg-gold transition-colors"></span>
                Begin New Exploration
                <span className="w-8 h-[1px] bg-white/10 group-hover:bg-gold transition-colors"></span>
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const productIcon = profile.productType === 'PERFUME' ? '✨' : '🕯️';

  return (
    <div className="min-h-screen bg-luxury text-white pb-32">
      <header className="py-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 backdrop-blur-sm sticky top-0 z-50 bg-luxury/80 shadow-xl">
        <div className="flex flex-col items-center md:items-start cursor-pointer" onClick={() => setStep('MOOD')}>
          <h1 className="text-2xl md:text-3xl font-serif tracking-[0.3em] text-gold leading-none">SCENTHOOD</h1>
          <div className="mt-2 text-[8px] tracking-[0.5em] uppercase text-white">
            {profile.productType} • {profile.country}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={onBackToCollection}
            className="group text-[10px] tracking-widest uppercase text-white hover:text-gold transition-colors flex items-center gap-3 font-bold"
          >
            Your Private Gallery {productIcon}
          </button>
          
          <div className="w-[1px] h-4 bg-white/10"></div>
          
          <button 
            onClick={() => {
              if (window.confirm("Permanently delete your profile and library?")) {
                onReset();
              }
            }} 
            className="px-4 py-2 border border-red-900/50 text-[9px] tracking-[0.2em] uppercase text-red-500 hover:bg-red-500 hover:text-white transition-all rounded font-bold"
          >
            Delete Account
          </button>
        </div>
      </header>

      <main className="mt-12 md:mt-24 px-4 md:px-8">
        {renderStep()}
      </main>
    </div>
  );
};

export default Dashboard;
