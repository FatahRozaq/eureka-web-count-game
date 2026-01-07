'use client';

import Image from 'next/image';
import Link from 'next/link';

type GameCard = {
  title: string;
  slug: string;
  emoji: string;
  description: string;
  bgImage?: string;
  colors: string[];
};

const games: GameCard[] = [
  {
    title: 'Petualangan Hitung Ceria',
    slug: '/game-hitung',
    emoji: '🧮',
    description: 'Belajar berhitung, penjumlahan, pengurangan, dan soal cerita.',
    bgImage: '/berhitung.png',
    colors: ['from-pink-400', 'to-purple-400']
  },
  {
    title: 'Petualangan Tebak Warna',
    slug: '/tebak-warna',
    emoji: '🎨',
    description: 'Pilih warna yang diminta, kenali dasar, sekunder, dan cerita warna.',
    bgImage: '/warna.png',
    colors: ['from-orange-400', 'to-amber-400']
  },
  {
    title: 'Petualangan Bentuk Ceria',
    slug: '/petualangan-bentuk',
    emoji: '🧩',
    description: 'Kenali bentuk 2D dan 3D, konsep besar-kecil, dan hubungkan bayangan.',
    bgImage: '/bentuk.png',
    colors: ['from-emerald-400', 'to-sky-400']
  },
  {
    title: 'Petualangan Bentuk Ceria',
    slug: '/petualangan-sayur-buah',
    emoji: '🧩',
    description: 'Kenali bentuk 2D dan 3D, konsep besar-kecil, dan hubungkan bayangan.',
    bgImage: '/sayur-buah.png',
    colors: ['from-emerald-400', 'to-sky-400']
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex flex-col font-sans">
      <header className="w-full mb-4">
        <div className="flex justify-center items-center bg-purple-700 shadow-lg py-4 px-8">
          <div className="flex items-center justify-center gap-4">
            <Image src="/eureka-logo.png" alt="Eureka Playroom Logo" width={80} height={80} className="mx-auto"/>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide drop-shadow-md">Temukan Game Edukasi Seru</h1>
          </div>
          <div className="flex items-center gap-3 text-yellow-500 text-2xl">
            <span>🌟</span>
            <span>🎯</span>
            <span>🚀</span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col items-center">
        <div className="w-full max-w-4xl px-6 py-6">
          <p className="text-center text-purple-800 text-4xl font-medium mb-4">
            Selamat datang di Eureka Playroom 
          </p>

          <p className='text-center text-purple-800 text-lg sm:text-xl font-medium mb-4'>
            Pilih permainan untuk belajar sambil bermain!
          </p>

          <div className="flex justify-center gap-3">
            <span className="bg-purple-500 text-white px-3 py-1 h-12 w-auto flex justify-center items-center rounded-3xl text-lg">
              Interaktif
            </span>
            <span className="bg-sky-500 text-white px-3 py-1 h-12 w-auto flex justify-center items-center rounded-3xl text-lg">
              Edukatif
            </span>
            <span className="bg-emerald-500 text-white px-3 py-1 h-12 w-auto flex justify-center items-center rounded-3xl text-lg">
              Bebas Iklan
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {games.map(game => (
              <Link
                key={game.slug}
                href={game.slug}
                className="inline-block group rounded-3xl border-2 border-purple-100 shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <img
                  src={game.bgImage ?? '/eureka-logo.png'}
                  alt={game.title}
                  className="block rounded-3xl w-78 h-auto object-contain mx-auto"
                />
              </Link>
            ))}
          </div>
      </main>
    </div>
  );
}
