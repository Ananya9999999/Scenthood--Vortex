
import React, { useState, useMemo } from 'react';
import { UserProfile, ProductType } from '../types';
import { COUNTRIES, GENDERS } from '../constants';

interface RegistrationProps {
  onSubmit: (profile: UserProfile) => void;
  onBack: () => void;
  initialData?: UserProfile | null;
  productType: ProductType;
}

const Registration: React.FC<RegistrationProps> = ({ onSubmit, onBack, initialData, productType }) => {
  const [formData, setFormData] = useState<UserProfile>(initialData || {
    age: 25,
    gender: 'Female',
    weatherPreference: 'warm',
    timeOfDay: 'morning',
    country: 'US',
    occupation: '',
    minPrice: 50,
    maxPrice: 250,
    blacklist: [],
    productType: productType
  });

  const selectedCountryData = useMemo(() => {
    return COUNTRIES.find(c => c.code === formData.country) || COUNTRIES[0];
  }, [formData.country]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'age' || name === 'minPrice' || name === 'maxPrice') ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-luxury py-12 px-4 flex flex-col items-center overflow-y-auto">
      <div className="max-w-xl w-full bg-white/5 backdrop-blur-md p-8 md:p-12 border border-white/10 shadow-2xl animate-fade-in relative">
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 text-[10px] tracking-[0.3em] uppercase text-white hover:text-gold transition-colors"
        >
          ← Back
        </button>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-gold mb-3">Define Your Essence</h2>
          <p className="text-[10px] tracking-[0.4em] uppercase text-white">Create your {productType.toLowerCase()} profile</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <label className="block text-[10px] uppercase tracking-widest text-white mb-2 transition-colors group-focus-within:text-gold">Age</label>
              <input 
                type="number" 
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white/10 py-3 focus:border-gold outline-none transition-all text-white font-light text-xl"
                required
              />
            </div>
            <div className="group">
              <label className="block text-[10px] uppercase tracking-widest text-white mb-2">Gender Perspective</label>
              <select 
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white/10 py-3 focus:border-gold outline-none transition-all text-white appearance-none cursor-pointer text-xl font-light"
              >
                {GENDERS.map(g => <option key={g} value={g} className="bg-neutral-900">{g}</option>)}
              </select>
            </div>
          </div>

          <div className="group">
            <label className="block text-[10px] uppercase tracking-widest text-white mb-2">Occupation</label>
            <input 
              type="text" 
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="e.g. Creative Director"
              className="w-full bg-transparent border-b border-white/10 py-3 focus:border-gold outline-none transition-all text-white font-light text-xl placeholder:text-white/30"
              required
            />
          </div>

          <div className="group">
            <label className="block text-[10px] uppercase tracking-widest text-white mb-2">Country of Residence</label>
            <select 
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-white/10 py-3 focus:border-gold outline-none transition-all text-white appearance-none cursor-pointer text-xl font-light"
            >
              {COUNTRIES.sort((a,b) => a.name.localeCompare(b.name)).map(c => (
                <option key={c.code} value={c.code} className="bg-neutral-900">{c.name}</option>
              ))}
            </select>
          </div>

          <div className="group">
            <label className="block text-[10px] uppercase tracking-widest text-white mb-4">Preferred Investment Range ({selectedCountryData.currency})</label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-[9px] text-white uppercase mb-1">Min</p>
                <input 
                  type="number" 
                  name="minPrice"
                  value={formData.minPrice}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/10 py-2 focus:border-gold outline-none transition-all text-white font-light text-lg"
                />
              </div>
              <div className="text-white">to</div>
              <div className="flex-1">
                <p className="text-[9px] text-white uppercase mb-1">Max</p>
                <input 
                  type="number" 
                  name="maxPrice"
                  value={formData.maxPrice}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/10 py-2 focus:border-gold outline-none transition-all text-white font-light text-lg"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-6 bg-gold text-black tracking-[0.5em] uppercase text-[10px] font-bold hover:bg-opacity-90 transition-all shadow-xl mt-8"
          >
            Confirm {productType} Identity
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
