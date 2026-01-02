'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle, Heart, Home, Lock, Sparkles, Star, XCircle } from 'lucide-react';
import { useGameProgress } from '@/app/hooks/useLocalStorage';

type ColorOption = {
	label: string;
	color: string;
	icon?: string;
};

type ColorQuestion = {
	instruction: string;
	targetColor: string;
	options: ColorOption[];
	helper?: string;
};

type Level = {
	id: number;
	title: string;
	description: string;
	questions: ColorQuestion[];
};

type GameState = 'menu' | 'levelSelect' | 'playing' | 'complete';
type Feedback = 'correct' | 'wrong' | null;

const levelsData: Level[] = [
	{
		id: 1,
		title: 'Warna Dasar 1',
		description: 'Kenali warna merah',
		questions: [
			{
				instruction: 'Pilih warna merah',
				targetColor: '#ef4444',
				options: [
					{ label: 'Merah', color: '#ef4444' },
					{ label: 'Kuning', color: '#fbbf24' },
					{ label: 'Biru', color: '#3b82f6' }
				]
			},
			{
				instruction: 'Lingkaran mana yang merah?',
				targetColor: '#ef4444',
				options: [
					{ label: 'Merah', color: '#ef4444' },
					{ label: 'Hijau', color: '#22c55e' },
					{ label: 'Ungu', color: '#8b5cf6' }
				]
			},
			{
				instruction: 'Kotak merah ada di mana?',
				targetColor: '#ef4444',
				options: [
					{ label: 'Oranye', color: '#f97316' },
					{ label: 'Merah', color: '#ef4444' },
					{ label: 'Biru', color: '#2563eb' }
				]
			}
		]
	},
	{
		id: 2,
		title: 'Warna Dasar 2',
		description: 'Kenali warna kuning',
		questions: [
			{
				instruction: 'Pilih warna kuning',
				targetColor: '#facc15',
				options: [
					{ label: 'Kuning', color: '#facc15' },
					{ label: 'Merah', color: '#ef4444' },
					{ label: 'Biru', color: '#3b82f6' }
				]
			},
			{
				instruction: 'Matahari biasanya berwarna...',
				targetColor: '#fbbf24',
				options: [
					{ label: 'Kuning', color: '#fbbf24', icon: '☀️' },
					{ label: 'Ungu', color: '#8b5cf6' },
					{ label: 'Hijau', color: '#22c55e' }
				]
			},
			{
				instruction: 'Pilih balon kuning',
				targetColor: '#facc15',
				options: [
					{ label: 'Merah', color: '#ef4444', icon: '🎈' },
					{ label: 'Kuning', color: '#facc15', icon: '🎈' },
					{ label: 'Biru', color: '#3b82f6', icon: '🎈' }
				]
			}
		]
	},
	{
		id: 3,
		title: 'Warna Dasar 3',
		description: 'Kenali warna biru',
		questions: [
			{
				instruction: 'Pilih warna biru',
				targetColor: '#3b82f6',
				options: [
					{ label: 'Biru', color: '#3b82f6' },
					{ label: 'Merah', color: '#ef4444' },
					{ label: 'Kuning', color: '#fbbf24' }
				]
			},
			{
				instruction: 'Langit cerah warnanya...',
				targetColor: '#60a5fa',
				options: [
					{ label: 'Biru', color: '#60a5fa', icon: '☁️' },
					{ label: 'Hijau', color: '#22c55e' },
					{ label: 'Oranye', color: '#f97316' }
				]
			},
			{
				instruction: 'Pilih kotak biru',
				targetColor: '#2563eb',
				options: [
					{ label: 'Ungu', color: '#8b5cf6' },
					{ label: 'Biru', color: '#2563eb' },
					{ label: 'Kuning', color: '#facc15' }
				]
			}
		]
	},
	{
		id: 4,
		title: 'Dasar Campuran',
		description: 'Merah, kuning, biru',
		questions: [
			{
				instruction: 'Pilih warna merah',
				targetColor: '#ef4444',
				options: [
					{ label: 'Merah', color: '#ef4444' },
					{ label: 'Kuning', color: '#facc15' },
					{ label: 'Biru', color: '#3b82f6' }
				]
			},
			{
				instruction: 'Pilih warna kuning',
				targetColor: '#facc15',
				options: [
					{ label: 'Biru', color: '#3b82f6' },
					{ label: 'Kuning', color: '#facc15' },
					{ label: 'Merah', color: '#ef4444' }
				]
			},
			{
				instruction: 'Pilih warna biru',
				targetColor: '#2563eb',
				options: [
					{ label: 'Kuning', color: '#fbbf24' },
					{ label: 'Biru', color: '#2563eb' },
					{ label: 'Merah', color: '#ef4444' },
					{ label: 'Ungu', color: '#8b5cf6' }
				]
			}
		]
	},
	{
		id: 5,
		title: 'Warna Sekunder',
		description: 'Hijau, oranye, ungu',
		questions: [
			{
				instruction: 'Pilih warna hijau',
				targetColor: '#22c55e',
				options: [
					{ label: 'Hijau', color: '#22c55e' },
					{ label: 'Oranye', color: '#f97316' },
					{ label: 'Ungu', color: '#8b5cf6' }
				]
			},
			{
				instruction: 'Pilih warna oranye',
				targetColor: '#f97316',
				options: [
					{ label: 'Oranye', color: '#f97316' },
					{ label: 'Hijau', color: '#22c55e' },
					{ label: 'Ungu', color: '#8b5cf6' }
				]
			},
			{
				instruction: 'Pilih warna ungu',
				targetColor: '#8b5cf6',
				options: [
					{ label: 'Ungu', color: '#8b5cf6' },
					{ label: 'Hijau', color: '#22c55e' },
					{ label: 'Oranye', color: '#f97316' }
				]
			}
		]
	},
	{
		id: 6,
		title: 'Tebak Warna Objek',
		description: 'Pilih warna sesuai benda',
		questions: [
			{
				instruction: 'Pilih balon berwarna merah',
				targetColor: '#ef4444',
				options: [
					{ label: 'Balon Merah', color: '#ef4444', icon: '🎈' },
					{ label: 'Balon Biru', color: '#3b82f6', icon: '🎈' },
					{ label: 'Balon Kuning', color: '#facc15', icon: '🎈' }
				]
			},
			{
				instruction: 'Pilih mobil kuning',
				targetColor: '#fbbf24',
				options: [
					{ label: 'Mobil Kuning', color: '#fbbf24', icon: '🚗' },
					{ label: 'Mobil Hijau', color: '#22c55e', icon: '🚗' },
					{ label: 'Mobil Biru', color: '#2563eb', icon: '🚗' }
				]
			},
			{
				instruction: 'Pilih bola biru',
				targetColor: '#2563eb',
				options: [
					{ label: 'Bola Merah', color: '#ef4444', icon: '⚽' },
					{ label: 'Bola Biru', color: '#2563eb', icon: '⚽' },
					{ label: 'Bola Oranye', color: '#f97316', icon: '⚽' }
				]
			}
		]
	},
	{
		id: 7,
		title: 'Terang vs Gelap',
		description: 'Pilih yang lebih terang',
		questions: [
			{
				instruction: 'Pilih yang paling terang',
				targetColor: '#fde047',
				options: [
					{ label: 'Kuning Terang', color: '#fde047' },
					{ label: 'Kuning Gelap', color: '#f59e0b' },
					{ label: 'Coklat', color: '#92400e' }
				]
			},
			{
				instruction: 'Pilih hijau yang lebih terang',
				targetColor: '#4ade80',
				options: [
					{ label: 'Hijau Terang', color: '#4ade80' },
					{ label: 'Hijau Gelap', color: '#15803d' },
					{ label: 'Hijau Tua', color: '#166534' }
				]
			},
			{
				instruction: 'Mana biru muda?',
				targetColor: '#93c5fd',
				options: [
					{ label: 'Biru Muda', color: '#93c5fd' },
					{ label: 'Biru', color: '#2563eb' },
					{ label: 'Biru Tua', color: '#1e3a8a' }
				]
			}
		]
	},
	{
		id: 8,
		title: 'Warna Mirip',
		description: 'Biru vs biru muda',
		questions: [
			{
				instruction: 'Pilih biru muda',
				targetColor: '#bfdbfe',
				options: [
					{ label: 'Biru Muda', color: '#bfdbfe' },
					{ label: 'Biru', color: '#3b82f6' },
					{ label: 'Biru Tua', color: '#1e40af' }
				]
			},
			{
				instruction: 'Pilih ungu muda',
				targetColor: '#ddd6fe',
				options: [
					{ label: 'Ungu Muda', color: '#ddd6fe' },
					{ label: 'Ungu', color: '#8b5cf6' },
					{ label: 'Ungu Tua', color: '#6b21a8' }
				]
			},
			{
				instruction: 'Pilih merah muda',
				targetColor: '#fbcfe8',
				options: [
					{ label: 'Merah Muda', color: '#fbcfe8' },
					{ label: 'Merah', color: '#ef4444' },
					{ label: 'Magenta', color: '#db2777' }
				]
			}
		]
	},
	{
		id: 9,
		title: 'Cerita Pendek',
		description: 'Pilih warna sesuai cerita',
		questions: [
			{
				instruction: 'Bola Ali berwarna merah',
				targetColor: '#ef4444',
				options: [
					{ label: 'Merah', color: '#ef4444', icon: '⚽' },
					{ label: 'Biru', color: '#3b82f6', icon: '⚽' },
					{ label: 'Kuning', color: '#facc15', icon: '⚽' }
				]
			},
			{
				instruction: 'Topi Lala berwarna ungu',
				targetColor: '#8b5cf6',
				options: [
					{ label: 'Ungu', color: '#8b5cf6', icon: '🎩' },
					{ label: 'Hijau', color: '#22c55e', icon: '🎩' },
					{ label: 'Oranye', color: '#f97316', icon: '🎩' }
				]
			},
			{
				instruction: 'Mobil Budi berwarna biru',
				targetColor: '#2563eb',
				options: [
					{ label: 'Merah', color: '#ef4444', icon: '🚗' },
					{ label: 'Biru', color: '#2563eb', icon: '🚗' },
					{ label: 'Kuning', color: '#fbbf24', icon: '🚗' }
				]
			}
		]
	},
	{
		id: 10,
		title: 'Tantangan Warna',
		description: 'Campuran semua level',
		questions: [
			{
				instruction: 'Pilih warna oranye',
				targetColor: '#f97316',
				options: [
					{ label: 'Oranye', color: '#f97316' },
					{ label: 'Hijau', color: '#22c55e' },
					{ label: 'Ungu', color: '#8b5cf6' }
				]
			},
			{
				instruction: 'Pilih balon biru muda',
				targetColor: '#93c5fd',
				options: [
					{ label: 'Biru', color: '#2563eb', icon: '🎈' },
					{ label: 'Biru Muda', color: '#93c5fd', icon: '🎈' },
					{ label: 'Merah', color: '#ef4444', icon: '🎈' }
				]
			},
			{
				instruction: 'Mana warna paling terang?',
				targetColor: '#fde047',
				options: [
					{ label: 'Kuning Terang', color: '#fde047' },
					{ label: 'Kuning Gelap', color: '#f59e0b' },
					{ label: 'Coklat', color: '#78350f' }
				]
			},
			{
				instruction: 'Pilih bunga ungu',
				targetColor: '#a855f7',
				options: [
					{ label: 'Bunga Ungu', color: '#a855f7', icon: '🌸' },
					{ label: 'Bunga Merah', color: '#ef4444', icon: '🌸' },
					{ label: 'Bunga Biru', color: '#2563eb', icon: '🌸' }
				]
			},
			{
				instruction: 'Pilih warna biru',
				targetColor: '#2563eb',
				options: [
					{ label: 'Biru', color: '#2563eb' },
					{ label: 'Hijau', color: '#22c55e' },
					{ label: 'Kuning', color: '#facc15' }
				]
			}
		]
	}
];

const PetualanganTebakWarna = () => {
	const [gameState, setGameState] = useState<GameState>('menu');
	const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [stars, setStars] = useState(0);
	const [lives, setLives] = useState(3);
	const [feedback, setFeedback] = useState<Feedback>(null);
	const [shuffledOptions, setShuffledOptions] = useState<ColorOption[]>([]);
	const audioRef = useRef<AudioContext | null>(null);

	const { completedLevels, setCompletedLevels, totalStars, setTotalStars } = useGameProgress('petualanganTebakWarna');

	useEffect(() => {
		const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
		if (AudioContextClass) {
			audioRef.current = new AudioContextClass();
		}
	}, []);

	const playSuccessSound = () => {
		const audioContext = audioRef.current;
		if (!audioContext) return;

		const playTone = (frequency: number, startTime: number, duration: number, volume = 0.12) => {
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
		playTone(659.25, now, 0.15, 0.12);
		playTone(783.99, now + 0.1, 0.15, 0.12);
		playTone(987.77, now + 0.2, 0.2, 0.12);
		playTone(1174.66, now + 0.35, 0.35, 0.1);
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
		gainNode.gain.setValueAtTime(0.08, now);
		gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

		oscillator.start(now);
		oscillator.stop(now + 0.2);
	};

	const speakText = (text: string) => {
		if ('speechSynthesis' in window) {
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = 'id-ID';
			utterance.rate = 0.92;
			utterance.pitch = 1.4;
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

	useEffect(() => {
		if (currentLevel && gameState === 'playing') {
			setShuffledOptions(shuffleArray(currentLevel.questions[currentQuestion].options));
		}
	}, [currentQuestion, currentLevel, gameState]);

	const handleAnswer = (selected: ColorOption) => {
		if (!currentLevel) return;
		const question = currentLevel.questions[currentQuestion];
		const isCorrect = selected.color === question.targetColor;

		if (isCorrect) {
			setStars(prev => prev + 1);
			setFeedback('correct');
			playSuccessSound();

			const praises = [
				'Hebat! Warna tepat!',
				'Pintar sekali!',
				'Warna itu benar!',
				'Keren, lanjut!',
				'Bagus sekali!'
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
			}, 1200);
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
			}, 900);
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

	const question = currentLevel?.questions[currentQuestion];

	if (gameState === 'menu') {
		return (
			<div className="min-h-screen bg-gradient-to-br from-amber-100 via-pink-100 to-sky-100 flex flex-col items-center justify-center p-4">
				<header className="w-full max-w-4xl mx-auto py-4 mb-4">
					<div className="bg-white/80 rounded-2xl shadow-lg py-3 px-6 text-center">
						<h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-purple-700 tracking-wide drop-shadow-md">Eureka Playroom</h1>
					</div>
				</header>
				<div className="text-center max-w-2xl mx-auto">
					<div className="mb-6 flex justify-center gap-3 text-5xl sm:text-7xl animate-pulse">
						<span>🎨</span>
						<span>🌈</span>
					</div>
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-purple-600 mb-3 drop-shadow-lg px-4">
						Petualangan<br/>Tebak Warna
					</h1>
					<p className="text-lg sm:text-2xl text-purple-500 mb-6 px-4">Pilih warna yang diminta, kumpulkan bintang!</p>
					<button
						onClick={startGame}
						className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 text-white text-xl sm:text-2xl font-bold py-3 px-8 sm:py-4 sm:px-12 rounded-full shadow-lg hover:scale-110 transition-transform"
					>
						Mulai Bermain 🚀
					</button>
					<div className="mt-6 flex items-center justify-center gap-2 text-yellow-600">
						<Star fill="currentColor" size={32} />
						<span className="text-2xl sm:text-3xl font-bold">{totalStars}</span>
					</div>
				</div>
			</div>
		);
	}

	if (gameState === 'levelSelect') {
		return (
			<div className="min-h-screen bg-gradient-to-br from-amber-100 via-pink-100 to-sky-100 p-4 sm:p-8 flex flex-col">
				<header className="w-full max-w-4xl mx-auto py-4 mb-4">
					<div className="bg-white/80 rounded-2xl shadow-lg py-3 px-6 text-center">
						<h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-purple-700 tracking-wide drop-shadow-md">Eureka Playroom</h1>
					</div>
				</header>
				<div className="max-w-6xl mx-auto">
					<div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
						<div>
							<h2 className="text-3xl sm:text-4xl font-bold text-purple-600">Pilih Level</h2>
							<p className="text-sm text-gray-600">Buka level berikutnya dengan menyelesaikan level sebelumnya.</p>
						</div>
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
									className={`p-4 sm:p-5 rounded-2xl shadow-lg transition-all ${
										unlocked ? 'bg-white hover:scale-105 cursor-pointer' : 'bg-gray-200 opacity-60 cursor-not-allowed'
									} ${completed ? 'ring-4 ring-yellow-400' : ''}`}
								>
									<div className="text-4xl sm:text-5xl mb-2">
										{!unlocked ? <Lock className="mx-auto text-gray-500" size={42} /> : completed ? '🏆' : '🌈'}
									</div>
									<div className="text-xl sm:text-2xl font-bold mb-1" style={{ color: unlocked ? '#9333ea' : '#6b7280' }}>
										Level {level.id}
									</div>
									<div className="text-xs sm:text-sm text-gray-600">{level.title}</div>
								</button>
							);
						})}
					</div>
				</div>
			</div>
		);
	}

	if (gameState === 'complete') {
		return (
			<div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 flex flex-col items-center justify-center p-4">
				<header className="w-full max-w-4xl mx-auto py-4 mb-4">
					<div className="bg-white/80 rounded-2xl shadow-lg py-3 px-6 text-center">
						<h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-purple-700 tracking-wide drop-shadow-md">Eureka Playroom</h1>
					</div>
				</header>
				<div className="text-center bg-white p-8 sm:p-12 rounded-3xl shadow-2xl max-w-2xl mx-4">
					<div className="text-6xl sm:text-8xl mb-6 animate-bounce">🏆</div>
					<h2 className="text-3xl sm:text-5xl font-bold text-purple-600 mb-3">Selamat!</h2>
					<p className="text-lg sm:text-2xl text-gray-700 mb-6">Kamu menyelesaikan<br/>{currentLevel?.title}!</p>
					<div className="flex justify-center gap-2 sm:gap-4 mb-6">
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
								onClick={() => selectLevel(currentLevel.id + 1)}
								className="bg-gradient-to-r from-green-400 to-blue-400 text-white text-lg sm:text-xl font-bold py-3 px-6 sm:px-8 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
							>
								Level Berikutnya <ArrowRight />
							</button>
						)}
					</div>
					{currentLevel?.id === 10 && (
						<div className="mt-6 text-xl sm:text-2xl text-purple-600 font-bold animate-pulse flex items-center justify-center gap-2">
							<Sparkles size={28} className="text-yellow-500" />
							Selamat! Kamu Jago Mengenal Warna!
							<Sparkles size={28} className="text-yellow-500" />
						</div>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-sky-100 via-pink-100 to-amber-100 p-4 flex flex-col">
			<header className="w-full max-w-4xl mx-auto py-4 mb-4">
				<div className="bg-white/80 rounded-2xl shadow-lg py-3 px-6 text-center">
					<h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-purple-700 tracking-wide drop-shadow-md">Eureka Playroom</h1>
				</div>
			</header>
			<div className="max-w-4xl mx-auto">
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

				<div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-12 mb-4 sm:mb-6">
					<h2 className="text-xl sm:text-3xl font-bold text-center text-purple-600 mb-6 sm:mb-8">
						{question?.instruction}
					</h2>
					{question?.helper && (
						<p className="text-center text-sm sm:text-base text-gray-600 mb-4">{question.helper}</p>
					)}

					<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
						{shuffledOptions.map((option, idx) => (
							<button
								key={idx}
								onClick={() => handleAnswer(option)}
								disabled={feedback !== null}
								className="rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-center justify-center gap-2 border-2 border-white hover:border-purple-200 transition-all hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
								style={{ backgroundColor: option.color }}
							>
								<span className="text-3xl sm:text-4xl">{option.icon ?? '⬤'}</span>
								<span className="text-lg sm:text-xl font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">{option.label}</span>
							</button>
						))}
					</div>
				</div>

				<div className="bg-gradient-to-r from-orange-200 to-pink-200 rounded-2xl p-4 sm:p-6 text-center mb-4 sm:mb-6 shadow-lg">
					<p className="text-lg sm:text-2xl font-bold text-purple-700">Ayo pilih warna yang benar!</p>
					<p className="text-sm sm:text-lg text-purple-600 mt-2">Fokus pada instruksi di atas ya.</p>
				</div>

				{feedback && (
					<div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-md bg-white/30">
						<div
							className={`${
								feedback === 'correct'
									? 'bg-gradient-to-br from-green-400 to-green-500'
									: 'bg-gradient-to-br from-red-400 to-red-500'
							} p-8 sm:p-12 rounded-3xl shadow-2xl text-center max-w-md transform transition-all duration-500 scale-100 animate-[bounce_0.5s_ease-in-out]`}
							style={{
								animation: feedback === 'correct'
									? 'bounce 0.6s ease-in-out, pulse 1s ease-in-out infinite'
									: 'shake 0.5s ease-in-out'
							}}
						>
							{feedback === 'correct' ? (
								<>
									<div className="animate-[spin_0.5s_ease-in-out]">
										<CheckCircle size={window.innerWidth < 640 ? 80 : 120} className="text-white mx-auto mb-4 drop-shadow-lg" />
									</div>
									<p className="text-3xl sm:text-5xl font-bold text-white mb-2 drop-shadow-md">Benar! 🎉</p>
									<div className="text-4xl sm:text-6xl mb-3 animate-pulse">✨🌈✨</div>
									<p className="text-xl sm:text-3xl font-bold text-white animate-bounce drop-shadow-md">Keren!</p>
								</>
							) : (
								<>
									<div className="animate-[wiggle_0.5s_ease-in-out]">
										<XCircle size={window.innerWidth < 640 ? 80 : 120} className="text-white mx-auto mb-4 drop-shadow-lg" />
									</div>
									<p className="text-3xl sm:text-5xl font-bold text-white drop-shadow-md">Coba Lagi! 💪</p>
									<p className="text-lg sm:text-xl text-white mt-3 drop-shadow-sm">Lihat instruksinya ya.</p>
								</>
							)}
						</div>
						<style jsx>{`
							@keyframes shake {
								0%, 100% { transform: translateX(0) rotate(0deg); }
								25% { transform: translateX(-10px) rotate(-5deg); }
								75% { transform: translateX(10px) rotate(5deg); }
							}
							@keyframes wiggle {
								0%, 100% { transform: rotate(0deg); }
								25% { transform: rotate(-10deg); }
								75% { transform: rotate(10deg); }
							}
						`}</style>
					</div>
				)}

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

export default PetualanganTebakWarna;
