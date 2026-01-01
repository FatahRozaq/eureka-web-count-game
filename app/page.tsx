'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Star, Trophy, Heart, CheckCircle, XCircle, ArrowRight, Home, Lock } from 'lucide-react';

// Types
type Question = {
  question: string;
  answer: number | string;
  options: (number | string)[];
  items?: string;
  type?: string;
};

type Level = {
  id: number;
  title: string;
  description: string;
  questions: Question[];
};

type GameState = 'menu' | 'levelSelect' | 'playing' | 'complete';
type Feedback = 'correct' | 'wrong' | null;

// Data level dan soal
const levelsData: Level[] = [
  {
    id: 1,
    title: "Kenal Angka 1-3",
    description: "Ayo hitung benda!",
    questions: [
      { question: "Berapa jumlah apel?", items: "🍎🍎", answer: 2, options: [1, 2, 3] },
      { question: "Berapa jumlah bola?", items: "⚽⚽⚽", answer: 3, options: [1, 2, 3] },
      { question: "Berapa jumlah bintang?", items: "⭐", answer: 1, options: [1, 2, 3] }
    ]
  },
  {
    id: 2,
    title: "Kenal Angka 1-5",
    description: "Hitung yang lebih banyak!",
    questions: [
      { question: "Berapa jumlah jeruk?", items: "🍊🍊🍊🍊", answer: 4, options: [3, 4, 5] },
      { question: "Berapa jumlah mobil?", items: "🚗🚗🚗🚗🚗", answer: 5, options: [4, 5, 3] },
      { question: "Berapa jumlah bunga?", items: "🌸🌸🌸", answer: 3, options: [2, 3, 4] }
    ]
  },
  {
    id: 3,
    title: "Kenal Angka 1-10",
    description: "Kamu hebat! Mari hitung lebih banyak",
    questions: [
      { question: "Berapa jumlah permen?", items: "🍬🍬🍬🍬🍬🍬🍬", answer: 7, options: [6, 7, 8] },
      { question: "Berapa jumlah ikan?", items: "🐟🐟🐟🐟🐟🐟🐟🐟🐟", answer: 9, options: [8, 9, 10] },
      { question: "Berapa jumlah kupu-kupu?", items: "🦋🦋🦋🦋🦋🦋", answer: 6, options: [5, 6, 7] }
    ]
  },
  {
    id: 4,
    title: "Cocokkan Angka",
    description: "Pilih gambar yang sesuai angka",
    questions: [
      { question: "Pilih yang jumlahnya 4", answer: "🍎🍎🍎🍎", options: ["🍎🍎🍎", "🍎🍎🍎🍎", "🍎🍎"] },
      { question: "Pilih yang jumlahnya 3", answer: "⚽⚽⚽", options: ["⚽⚽", "⚽⚽⚽", "⚽⚽⚽⚽"] },
      { question: "Pilih yang jumlahnya 5", answer: "🌟🌟🌟🌟🌟", options: ["🌟🌟🌟🌟", "🌟🌟🌟🌟🌟", "🌟🌟🌟"] }
    ]
  },
  {
    id: 5,
    title: "Penjumlahan 1-5",
    description: "Ayo tambah-tambahan!",
    questions: [
      { question: "🍎🍎 + 🍎 = ?", answer: 3, options: [2, 3, 4], type: "addition" },
      { question: "⚽⚽ + ⚽⚽ = ?", answer: 4, options: [3, 4, 5], type: "addition" },
      { question: "🌸 + 🌸🌸 = ?", answer: 3, options: [2, 3, 4], type: "addition" }
    ]
  },
  {
    id: 6,
    title: "Penjumlahan 1-10",
    description: "Penjumlahan yang lebih besar!",
    questions: [
      { question: "5 + 3 = ?", items: "🍊🍊🍊🍊🍊 + 🍊🍊🍊", answer: 8, options: [7, 8, 9], type: "addition" },
      { question: "4 + 4 = ?", items: "🚗🚗🚗🚗 + 🚗🚗🚗🚗", answer: 8, options: [7, 8, 9], type: "addition" },
      { question: "6 + 2 = ?", items: "🎈🎈🎈🎈🎈🎈 + 🎈🎈", answer: 8, options: [7, 8, 9], type: "addition" }
    ]
  },
  {
    id: 7,
    title: "Pengurangan 1-5",
    description: "Ayo kurang-kurangan!",
    questions: [
      { question: "5 - 2 = ?", items: "🎈🎈🎈🎈🎈 (hilang 2)", answer: 3, options: [2, 3, 4], type: "subtraction" },
      { question: "4 - 1 = ?", items: "⚽⚽⚽⚽ (hilang 1)", answer: 3, options: [2, 3, 4], type: "subtraction" },
      { question: "3 - 2 = ?", items: "🍎🍎🍎 (hilang 2)", answer: 1, options: [1, 2, 3], type: "subtraction" }
    ]
  },
  {
    id: 8,
    title: "Pengurangan 1-10",
    description: "Pengurangan lebih besar!",
    questions: [
      { question: "9 - 4 = ?", items: "🌟 hilang 4 dari 9", answer: 5, options: [4, 5, 6], type: "subtraction" },
      { question: "10 - 3 = ?", items: "🍬 hilang 3 dari 10", answer: 7, options: [6, 7, 8], type: "subtraction" },
      { question: "8 - 5 = ?", items: "🐟 hilang 5 dari 8", answer: 3, options: [2, 3, 4], type: "subtraction" }
    ]
  },
  {
    id: 9,
    title: "Soal Cerita",
    description: "Mari baca dan hitung!",
    questions: [
      { question: "Ani punya 3 permen. Ibu memberi 2 permen lagi. Berapa permen Ani sekarang?", answer: 5, options: [4, 5, 6], type: "story" },
      { question: "Ada 7 burung di pohon. 3 burung terbang. Berapa burung yang masih di pohon?", answer: 4, options: [3, 4, 5], type: "story" },
      { question: "Budi punya 4 mobil mainan. Dia membeli 3 mobil lagi. Berapa total mobil Budi?", answer: 7, options: [6, 7, 8], type: "story" }
    ]
  },
  {
    id: 10,
    title: "Tantangan Akhir",
    description: "Kamu hebat! Level terakhir!",
    questions: [
      { question: "Berapa jumlah bintang?", items: "⭐⭐⭐⭐⭐⭐⭐⭐", answer: 8, options: [7, 8, 9] },
      { question: "6 + 4 = ?", answer: 10, options: [9, 10, 11], type: "addition" },
      { question: "10 - 6 = ?", answer: 4, options: [3, 4, 5], type: "subtraction" },
      { question: "Sinta punya 5 bunga. Dia memetik 3 bunga lagi. Berapa total bunga?", answer: 8, options: [7, 8, 9], type: "story" },
      { question: "Ada 9 balon. 5 balon meletus. Berapa balon yang tersisa?", answer: 4, options: [3, 4, 5], type: "story" }
    ]
  }
];

const PetualanganHitungCeria = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [stars, setStars] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<(number | string)[]>([]);
  const audioRef = useRef<AudioContext | null>(null);

  // Audio Context untuk sound effects
  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioRef.current = new AudioContextClass();
    }
  }, []);

  const playSuccessSound = () => {
    const audioContext = audioRef.current;
    if (!audioContext) return;

    // Sound effect success yang kalem tapi rewarding
    const playTone = (frequency: number, startTime: number, duration: number, volume = 0.15) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = audioContext.currentTime;
    // Melodic ascending notes (C-E-G-C progression)
    playTone(523.25, now, 0.15, 0.12); // C5
    playTone(659.25, now + 0.1, 0.15, 0.12); // E5
    playTone(783.99, now + 0.2, 0.2, 0.15); // G5
    playTone(1046.50, now + 0.35, 0.4, 0.15); // C6
  };

  const playErrorSound = () => {
    const audioContext = audioRef.current;
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'sine';
    
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    oscillator.start(now);
    oscillator.stop(now + 0.2);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.85;
      utterance.pitch = 1.5;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const isLevelUnlocked = (levelId: number) => {
    if (levelId === 1) return true;
    return completedLevels.includes(levelId - 1);
  };

  const startGame = () => {
    setGameState('levelSelect');
  };

  const selectLevel = (levelId: number) => {
    if (!isLevelUnlocked(levelId)) return;
    
    const level = levelsData.find(l => l.id === levelId);
    if (!level) return;
    
    setCurrentLevel(level);
    setCurrentQuestion(0);
    setStars(0);
    setLives(3);
    setFeedback(null);
    setShuffledOptions(shuffleArray(level.questions[0].options));
    setGameState('playing');
  };

  // Shuffle options saat ganti soal
  useEffect(() => {
    if (currentLevel && gameState === 'playing') {
      setShuffledOptions(shuffleArray(currentLevel.questions[currentQuestion].options));
    }
  }, [currentQuestion, currentLevel, gameState]);

  const handleAnswer = (selectedAnswer: number | string) => {
    if (!currentLevel) return;
    const question = currentLevel.questions[currentQuestion];
    const isCorrect = selectedAnswer === question.answer;

    if (isCorrect) {
      setStars(prev => prev + 1);
      setFeedback('correct');
      playSuccessSound();
      
      // Array kata-kata pujian yang ceria
      const praises = [
        'Hebat! Kamu berhasil!',
        'Pintar sekali!',
        'Wah, kamu jago!',
        'Luar biasa!',
        'Mantap!',
        'Keren banget!',
        'Bagus sekali!',
        'Ayo terus!',
        'Sempurna!'
      ];
      const randomPraise = praises[Math.floor(Math.random() * praises.length)];
      speakText(randomPraise);
      
      setTimeout(() => {
        setFeedback(null);
        if (currentQuestion < currentLevel.questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
        } else {
          completeLevel();
        }
      }, 2000);
    } else {
      setLives(prev => prev - 1);
      setFeedback('wrong');
      playErrorSound();
      
      setTimeout(() => {
        setFeedback(null);
        if (lives <= 1) {
          setGameState('levelSelect');
          setLives(3);
        }
      }, 1500);
    }
  };

  const completeLevel = () => {
    if (!currentLevel) return;
    if (!completedLevels.includes(currentLevel.id)) {
      setCompletedLevels(prev => [...prev, currentLevel.id]);
    }
    setTotalStars(prev => prev + stars);
    setGameState('complete');
  };

  const backToMenu = () => {
    setGameState('menu');
    setCurrentLevel(null);
  };

  const backToLevelSelect = () => {
    setGameState('levelSelect');
    setCurrentLevel(null);
  };

  // Menu Utama
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8 animate-bounce">
            <div className="text-6xl sm:text-8xl mb-4">🎮</div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-purple-600 mb-4 drop-shadow-lg px-4">
            Petualangan<br/>Hitung Ceria
          </h1>
          <p className="text-xl sm:text-2xl text-purple-500 mb-8 px-4">Mari Belajar Angka!</p>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-pink-400 to-purple-400 text-white text-xl sm:text-2xl font-bold py-3 px-8 sm:py-4 sm:px-12 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            Mulai Bermain 🚀
          </button>
          <div className="mt-8 flex items-center justify-center gap-2 text-yellow-600">
            <Star fill="currentColor" size={32} />
            <span className="text-2xl sm:text-3xl font-bold">{totalStars}</span>
          </div>
        </div>
      </div>
    );
  }

  // Pilih Level
  if (gameState === 'levelSelect') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-purple-600">Pilih Level</h2>
            <button
              onClick={backToMenu}
              className="bg-white text-purple-600 font-bold py-2 px-6 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Home size={24} /> Menu
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {levelsData.map(level => {
              const unlocked = isLevelUnlocked(level.id);
              const completed = completedLevels.includes(level.id);
              
              return (
                <button
                  key={level.id}
                  onClick={() => selectLevel(level.id)}
                  disabled={!unlocked}
                  className={`p-4 sm:p-6 rounded-2xl shadow-lg transition-all ${
                    unlocked 
                      ? 'bg-white hover:scale-105 cursor-pointer' 
                      : 'bg-gray-300 opacity-50 cursor-not-allowed'
                  } ${completed ? 'ring-4 ring-yellow-400' : ''}`}
                >
                  <div className="text-4xl sm:text-5xl mb-2">
                    {!unlocked ? <Lock className="mx-auto text-gray-500" size={48} /> : completed ? '🏆' : '🎯'}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: unlocked ? '#9333ea' : '#6b7280' }}>
                    Level {level.id}
                  </div>
                  <div className="text-xs sm:text-sm" style={{ color: unlocked ? '#4b5563' : '#9ca3af' }}>
                    {level.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Level Complete
  if (gameState === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 sm:p-12 rounded-3xl shadow-2xl max-w-2xl mx-4">
          <div className="text-6xl sm:text-8xl mb-6 animate-bounce">🏆</div>
          <h2 className="text-3xl sm:text-5xl font-bold text-purple-600 mb-4">
            Selamat!
          </h2>
          <p className="text-lg sm:text-2xl text-gray-700 mb-8">
            Kamu menyelesaikan<br/>{currentLevel?.title}!
          </p>
          <div className="flex justify-center gap-2 sm:gap-4 mb-8">
            {[...Array(stars)].map((_, i) => (
              <Star key={i} fill="#fbbf24" className="text-yellow-400" size={window.innerWidth < 640 ? 32 : 48} />
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={backToLevelSelect}
              className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-lg sm:text-xl font-bold py-3 px-6 sm:px-8 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              Pilih Level Lain
            </button>
            {currentLevel && currentLevel?.id < 10 && (
              <button
                onClick={() => selectLevel(currentLevel?.id + 1)}
                className="bg-gradient-to-r from-green-400 to-blue-400 text-white text-lg sm:text-xl font-bold py-3 px-6 sm:px-8 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                Level Berikutnya <ArrowRight />
              </button>
            )}
          </div>
          {currentLevel?.id === 10 && (
            <div className="mt-8 text-xl sm:text-2xl text-purple-600 font-bold animate-pulse">
              🎉 Kamu sudah jago hitung! 🎉
            </div>
          )}
        </div>
      </div>
    );
  }

  // Playing
  const question = currentLevel?.questions[currentQuestion];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-2xl font-bold text-purple-600">
                Level {currentLevel?.id} - {currentLevel?.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">Soal {currentQuestion + 1} dari {currentLevel?.questions.length}</p>
            </div>
            <div className="flex gap-3 sm:gap-4">
              <div className="flex items-center gap-1 sm:gap-2">
                {[...Array(lives)].map((_, i) => (
                  <Heart key={i} fill="#ef4444" className="text-red-500" size={window.innerWidth < 640 ? 24 : 32} />
                ))}
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                {[...Array(stars)].map((_, i) => (
                  <Star key={i} fill="#fbbf24" className="text-yellow-400" size={window.innerWidth < 640 ? 24 : 32} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Question Area */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-12 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-3xl font-bold text-center text-purple-600 mb-6 sm:mb-8">
            {question?.question}
          </h2>
          
          {question?.items && (
            <div className="text-4xl sm:text-7xl text-center mb-6 sm:mb-8 leading-relaxed break-all">
              {question.items}
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto">
            {shuffledOptions.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                disabled={feedback !== null}
                className="bg-gradient-to-br from-purple-200 to-pink-200 hover:from-purple-300 hover:to-pink-300 disabled:opacity-50 text-2xl sm:text-4xl font-bold text-purple-700 py-4 sm:py-8 rounded-2xl shadow-lg hover:scale-105 transition-transform disabled:hover:scale-100"
              >
                {typeof option === 'number' ? option : <span className="text-3xl sm:text-5xl break-all">{option}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="text-4xl sm:text-5xl animate-bounce" style={{ animationDelay: '0s' }}>🌟</div>
          <div className="text-3xl sm:text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>✨</div>
          <div className="text-4xl sm:text-5xl animate-bounce" style={{ animationDelay: '0.4s' }}>🎯</div>
          <div className="text-3xl sm:text-4xl animate-bounce" style={{ animationDelay: '0.6s' }}>✨</div>
          <div className="text-4xl sm:text-5xl animate-bounce" style={{ animationDelay: '0.8s' }}>🌟</div>
        </div>

        {/* Motivational Text */}
        <div className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-2xl p-4 sm:p-6 text-center mb-4 sm:mb-6 shadow-lg">
          <p className="text-lg sm:text-2xl font-bold text-purple-700">
            💪 Kamu Pasti Bisa! 💪
          </p>
          <p className="text-sm sm:text-lg text-purple-600 mt-2">
            Ayo pilih jawabannya!
          </p>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4`}>
            <div className={`${feedback === 'correct' ? 'bg-green-400' : 'bg-red-400'} p-8 sm:p-12 rounded-3xl shadow-2xl text-center animate-pulse max-w-md`}>
              {feedback === 'correct' ? (
                <>
                  <CheckCircle size={window.innerWidth < 640 ? 80 : 120} className="text-white mx-auto mb-4" />
                  <p className="text-3xl sm:text-5xl font-bold text-white mb-2">Benar! 🎉</p>
                  <div className="text-4xl sm:text-6xl mb-3">✨🌟✨</div>
                  <p className="text-xl sm:text-3xl font-bold text-white animate-bounce">
                    {['Hebat!', 'Pintar!', 'Mantap!', 'Keren!'][Math.floor(Math.random() * 4)]}
                  </p>
                </>
              ) : (
                <>
                  <XCircle size={window.innerWidth < 640 ? 80 : 120} className="text-white mx-auto mb-4" />
                  <p className="text-3xl sm:text-5xl font-bold text-white">Coba Lagi! 💪</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={backToLevelSelect}
            className="bg-white text-purple-600 font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg hover:scale-105 transition-transform text-sm sm:text-base"
          >
            Kembali ke Level
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetualanganHitungCeria;