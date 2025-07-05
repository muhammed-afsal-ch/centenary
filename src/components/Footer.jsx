import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-[#0f172a] text-white mt-16">
      {/* Wave top separator */}
      <div className="absolute top-[-1px] w-full overflow-hidden leading-[0] rotate-180">
        <svg
          className="relative block w-full h-[60px]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M321.39 56.49C230.65 39.16 139.91 21.82 49.17 34.84C0 41.83 0 108.9 0 108.9H1200V0C1156.75 22.21 1107.38 35.84 1056.66 39.63C990.09 44.49 923.53 28.92 857 24.08C778.12 18.32 699.23 29.78 620.35 39.63C543.52 49.25 466.69 58.87 389.85 56.49C328.51 54.61 267.17 45.84 205.93 35.99Z"
            fill="#1e293b"
          ></path>
        </svg>
      </div>

      {/* Footer content */}
      <div className="max-w-6xl mx-auto px-6 py-14 text-center backdrop-blur-md">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-wide">
          Ahlussunna Mission
        </h3>

        <div className="flex justify-center flex-wrap gap-6 mb-8 text-sm md:text-base">
          <Link href="/" className="hover:text-green-400 transition duration-200">Home</Link>
          <Link href="/about" className="hover:text-green-400 transition duration-200">About</Link>
          <Link href="/downloads" className="hover:text-green-400 transition duration-200">Downloads</Link>
          <Link href="/gallery" className="hover:text-green-400 transition duration-200">Gallery</Link>
          <Link href="/contact" className="hover:text-green-400 transition duration-200">Contact</Link>
        </div>

        <div className="text-sm text-gray-400">
          © {new Date().getFullYear()} Ahlussunna Mission. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
