import { useState, useEffect } from 'react';
import { galleryItems as fallbackItems } from '../../data/projects';
import { API_BASE_URL } from '../../config.js';

const API = API_BASE_URL;

const accentColorMap = {
  'primary': 'bg-primary/40',
  'accent-magenta': 'bg-accent-magenta/40',
  'accent-green': 'bg-accent-green/40',
};

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState(fallbackItems); // hardcoded fallback

  useEffect(() => {
    fetch(`${API}/gallery`)
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data) && data.length) setGalleryItems(data); })
      .catch(() => {}); // keep fallback if API fails
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white" id="gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4">Gallery of Impact</h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Snapshots from various panels, training cohorts, and field operations.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="masonry">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="masonry-item rounded-lg sm:rounded-xl overflow-hidden group relative"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div
                className={`absolute inset-0 ${accentColorMap[item.accentColor] || 'bg-primary/40'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4`}
              >
                <span className="text-white font-bold text-xs sm:text-sm text-center">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
