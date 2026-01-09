
import React from 'react';

const Awareness: React.FC = () => {
  const notes = [
    {
      title: "Top Notes",
      subtitle: "The First Impression",
      description: "Ephemeral and light, these scents greet you immediately. Often citrus or herbal, they fade within 15 minutes but define the initial narrative.",
      examples: "Bergamot, Lemon, Lavender"
    },
    {
      title: "Heart Notes",
      subtitle: "The Soul of the Scent",
      description: "Emerging as the top notes dissipate, these form the core of the fragrance. They are well-rounded and linger for several hours.",
      examples: "Rose, Jasmine, Cinnamon, Neroli"
    },
    {
      title: "Base Notes",
      subtitle: "The Lasting Memory",
      description: "The foundation that anchors the fragrance. Heavy molecules that evaporate slowly, providing depth and staying power for the entire day.",
      examples: "Sandalwood, Vanilla, Musk, Amber"
    }
  ];

  const families = [
    { name: "Citrus", character: "Zesty, vibrant, and energetic." },
    { name: "Floral", character: "Romantic, blooming, and delicate." },
    { name: "Woody", character: "Earthy, grounded, and sophisticated." },
    { name: "Oriental", character: "Warm, spicy, and exotic." }
  ];

  return (
    <section id="awareness" className="py-24 px-6 md:px-12 bg-white/5 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-xs tracking-[0.6em] uppercase text-gold mb-4">Olfactory Education</h2>
          <h3 className="text-4xl md:text-6xl font-serif text-white mb-6">The Anatomy of Scent</h3>
          <div className="w-24 h-[1px] bg-gold mx-auto mb-8"></div>
          <p className="max-w-2xl mx-auto text-white/60 leading-relaxed font-light">
            To choose a masterpiece, one must understand its composition. A fragrance is a symphony, 
            evolving over time through three distinct movements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          {notes.map((note, index) => (
            <div key={index} className="group p-8 border border-white/5 bg-black/20 hover:border-gold/30 transition-all duration-700">
              <span className="text-gold/20 text-6xl font-serif absolute -mt-12 group-hover:text-gold/40 transition-colors">0{index + 1}</span>
              <h4 className="text-2xl font-serif text-white mb-1 mt-4">{note.title}</h4>
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-6">{note.subtitle}</p>
              <p className="text-sm text-white/50 leading-relaxed mb-6 font-light">{note.description}</p>
              <div className="pt-4 border-t border-white/10">
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Signature Accents</p>
                <p className="text-xs text-gold/80 italic">{note.examples}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-12">
            <div>
              <h4 className="text-2xl font-serif text-white mb-4">Fragrance Families</h4>
              <p className="text-white/40 text-sm leading-relaxed mb-8 font-light">
                Beyond the notes, every scent belongs to a lineage. Understanding these families 
                helps you identify the silhouettes that resonate with your skin chemistry.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {families.map((family, index) => (
                <div key={index} className="border-l border-gold/30 pl-6">
                  <h5 className="text-white font-serif text-lg mb-1">{family.name}</h5>
                  <p className="text-xs text-white/40 leading-relaxed">{family.character}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] bg-white/5 border border-white/10 flex items-center justify-center p-12 overflow-hidden group">
              <div className="absolute inset-0 opacity-20 group-hover:scale-110 transition-transform duration-1000 bg-[url('https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center"></div>
              <div className="relative z-10 text-center">
                <div className="text-8xl font-serif text-gold/20 mb-4 select-none">S</div>
                <p className="text-[10px] tracking-[0.5em] uppercase text-gold">The Artisan's Guide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Awareness;
