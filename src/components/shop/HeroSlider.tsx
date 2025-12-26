import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSite } from "@/contexts/SiteContext";

const HeroSlider = () => {
  const { sliders, isLoading } = useSite();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (sliders.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [sliders.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
  };

  if (isLoading) {
    return (
      <div className="relative h-[400px] md:h-[500px] bg-muted animate-pulse flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (sliders.length === 0) {
    return (
      <section className="relative h-[400px] md:h-[500px] bg-gradient-to-bl from-primary/10 via-background to-muted/30 flex items-center justify-center">
        <div className="container text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">به فروشگاه خوش آمدید</h1>
          <p className="text-muted-foreground mb-6">برای نمایش اسلایدر، از پنل مدیریت اقدام کنید</p>
          <Link to="/products">
            <Button size="lg">مشاهده محصولات</Button>
          </Link>
        </div>
      </section>
    );
  }

  const slide = sliders[currentSlide];

  return (
    <section className="relative h-[400px] md:h-[500px] overflow-hidden">
      {/* Slides */}
      <div className="absolute inset-0">
        {sliders.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-l from-background/90 via-background/60 to-transparent z-10" />
            <img
              src={s.image}
              alt={s.title}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 container h-full flex items-center">
        <div className="max-w-lg space-y-4 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            {slide.title}
          </h2>
          {slide.subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground">
              {slide.subtitle}
            </p>
          )}
          {slide.link && slide.button_text && (
            <Link to={slide.link}>
              <Button size="lg" className="mt-4 gap-2">
                {slide.button_text}
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {sliders.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-background/80 hover:bg-background border shadow-lg transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-background/80 hover:bg-background border shadow-lg transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots */}
      {sliders.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {sliders.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-primary w-8'
                  : 'bg-foreground/30 hover:bg-foreground/50'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSlider;
