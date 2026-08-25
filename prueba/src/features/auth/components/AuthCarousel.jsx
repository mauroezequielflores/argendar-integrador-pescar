import { useState, useEffect } from 'react';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80',
    text: 'Transformando la forma de contratar y ofrecer servicios para tu hogar.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80',
    text: 'Conecta con los mejores profesionales de tu zona.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80',
    text: 'Gestiona tus turnos y clientes de manera eficiente.'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80',
    text: 'La plataforma que impulsa tu trabajo independiente.'
  }
];

export const AuthCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full hidden lg:block overflow-hidden bg-black">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt="Carousel background"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
      ))}

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col justify-end items-center pb-16 px-12">
        <h2 className="text-white text-3xl font-bold text-center mb-8 max-w-lg">
          {slides[currentSlide].text}
        </h2>
        
        {/* Indicators */}
        <div className="flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Ir a la diapositiva ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
