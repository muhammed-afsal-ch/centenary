'use client';

import HomeView from '../../components/HomeView';

export default function Home() {


  return (
    <>
      {/* Navbar */}
     
      {/* Main Content */}
      <HomeView />

      {/* Footer */}
      <footer className="relative text-center py-6 bg-black bg-opacity-70 z-10">
        <p className="text-sm text-white opacity-80">
          © 2025 Ahlussunna Mission. All rights reserved.
        </p>
      </footer>
    </>
  );
}