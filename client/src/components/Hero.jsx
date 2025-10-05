import ScrollIndicator from "./ScrollIndicator";

export default function Hero() {
  return (
    <section
      className="relative bg-gradient-to-br from-sky-900 to-indigo-900 text-white"
      style={{ minHeight: "calc(100vh - 70px)" }} // Navbar yüksekliği çıkarıldı
    >
      {/* Arka plan görseli */}
      <div className="absolute inset-0">
        <img
          src="/plane.webp"
          alt="Hero Background"
          className="w-full h-full object-cover opacity-20"
        />
        {/* Overlay efekti */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
      {/* İçerik */}
      <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24 lg:py-32 flex flex-col items-center justify-center text-center h-full">
        {/* Başlık */}
        <h1 className="text-4xl sm:text-6xl font-bold pb-2 mb-6 bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
          Plan, Manage, and Track Your Flights
        </h1>

        {/* Alt metin */}
        <p className="text-lg sm:text-xl max-w-2xl mb-8 text-gray-300">
          A modern flight management system to optimize scheduling, reduce
          delays, and improve operational efficiency for airlines and operators.
        </p>

        {/* Butonlar */}
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-sky-500 hover:bg-sky-600 rounded-2xl font-semibold shadow-lg transition-transform transform hover:scale-105">
            Get Started
          </button>
          <button className="px-6 py-3 bg-white text-sky-700 hover:bg-gray-100 rounded-2xl font-semibold shadow-lg transition-transform transform hover:scale-105">
            View Demo
          </button>
        </div>
      </div>
      <ScrollIndicator />
    </section>
  );
}
