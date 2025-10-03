import { IoMdAirplane } from "react-icons/io";

export default function ScrollIndicator() {
  const scrollToNext = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
      <button
        onClick={scrollToNext}
        className="group flex flex-col items-center space-y-2 text-white/70 hover:text-white transition-all duration-300"
      >
        <div className="flex items-center space-x-2 animate-bounce">
          <IoMdAirplane className="text-2xl transform rotate-90 group-hover:text-sky-300 transition-colors" />
          <span className="text-sm font-medium">Scroll Down</span>
        </div>
        <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent group-hover:from-sky-300/70 transition-colors"></div>
      </button>
    </div>
  );
}
