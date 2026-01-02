'use client';

import Link from 'next/link';

type GameCard = {
  title: string;
  slug: string;
  emoji: string;
  description: string;
  colors: string[];
};

const games: GameCard[] = [
  {
    title: 'Petualangan Hitung Ceria',
    slug: '/game-hitung',
    emoji: '🧮',
    description: 'Belajar berhitung, penjumlahan, pengurangan, dan soal cerita.',
    colors: ['from-pink-400', 'to-purple-400']
  },
  {
    title: 'Petualangan Tebak Warna',
    slug: '/tebak-warna',
    emoji: '🎨',
    description: 'Pilih warna yang diminta, kenali dasar, sekunder, dan cerita warna.',
    colors: ['from-orange-400', 'to-amber-400']
  },
  {
    title: 'Petualangan Bentuk Ceria',
    slug: '/petualangan-bentuk',
    emoji: '🧩',
    description: 'Kenali bentuk 2D dan 3D, konsep besar-kecil, dan hubungkan bayangan.',
    colors: ['from-emerald-400', 'to-sky-400']
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex flex-col p-4">
      <header className="w-full max-w-5xl mx-auto py-6 mb-4">
        <div className="bg-white/80 rounded-3xl shadow-lg py-4 px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm text-purple-500">Eureka Playroom</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-purple-700 tracking-wide drop-shadow-md">Temukan Game Edukasi Seru</h1>
          </div>
          <div className="flex items-center gap-3 text-yellow-500 text-2xl">
            <span>🌟</span>
            <span>🎯</span>
            <span>🚀</span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col items-center">
        <div className="max-w-5xl w-full bg-white/80 rounded-3xl shadow-xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-purple-700">Pilih Petualangan</h2>
              <p className="text-gray-600">Belajar sambil bermain untuk anak usia 3–7 tahun.</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 px-3 py-2 rounded-full shadow">
              <span className="text-lg">🎒</span>
              Edukasi interaktif & aman
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {games.map(game => (
              <Link
                key={game.slug}
                href={game.slug}
                className="group block rounded-3xl border-2 border-purple-100 bg-white shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div className="p-6 flex items-start gap-4">
                  <div className="text-5xl sm:text-6xl drop-shadow-md">{game.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-2">{game.title}</h3>
                    <p className="text-gray-600 mb-3 leading-relaxed">{game.description}</p>
                    <span
                      className={`inline-block bg-gradient-to-r ${game.colors.join(' ')} text-white text-sm font-bold py-2 px-4 rounded-full shadow group-hover:scale-105 transition-transform`}
                    >
                      Mainkan
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
