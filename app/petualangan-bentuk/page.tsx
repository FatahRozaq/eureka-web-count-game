'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle, Heart, Home, Lock, Sparkles, Star, XCircle } from 'lucide-react';
import { useGameProgress } from '@/app/hooks/useLocalStorage';

type ShapeOption = {
	label: string;
	shape: string;
	emoji?: string;
	count?: number;
};

type ShapeQuestion = {
	instruction: string;
	targetShape: string;
	options: ShapeOption[];
	helper?: string;
	visual?: string;
};

type Level = {
	id: number;
	title: string;
	description: string;
	questions: ShapeQuestion[];
};

type GameState = 'menu' | 'levelSelect' | 'playing' | 'complete';
type Feedback = 'correct' | 'wrong' | null;

// Komponen untuk menampilkan bentuk
const ShapeDisplay: React.FC<{ shape: string; size?: number; color?: string; emoji?: string }> = ({ 
	shape, 
	size = 60, 
	color = '#8b5cf6',
	emoji 
}) => {
	if (emoji) {
		return <span style={{ fontSize: `${size}px` }}>{emoji}</span>;
	}

	const style: React.CSSProperties = {
		width: `${size}px`,
		height: `${size}px`,
		backgroundColor: color,
		display: 'inline-block',
		margin: '4px'
	};

	switch (shape) {
		case 'circle':
			return <div style={{ ...style, borderRadius: '50%' }} />;
		case 'square':
			return <div style={style} />;
		case 'triangle':
			return (
				<div style={{ 
					width: 0, 
					height: 0, 
					borderLeft: `${size/2}px solid transparent`,
					borderRight: `${size/2}px solid transparent`,
					borderBottom: `${size}px solid ${color}`,
					display: 'inline-block',
					margin: '4px'
				}} />
			);
		case 'rectangle':
			return <div style={{ ...style, width: `${size * 1.5}px` }} />;
		case 'oval':
			return <div style={{ ...style, width: `${size * 1.4}px`, borderRadius: '50%' }} />;
		case 'star':
			return <span style={{ fontSize: `${size}px`, color }}>⭐</span>;
		case 'heart':
			return <span style={{ fontSize: `${size}px`, color }}>❤️</span>;
		case 'diamond':
			return (
				<div style={{ 
					width: `${size}px`, 
					height: `${size}px`, 
					backgroundColor: color,
					transform: 'rotate(45deg)',
					display: 'inline-block',
					margin: '12px'
				}} />
			);
		default:
			return <div style={style} />;
	}
};

const levelsData: Level[] = [
	{
		id: 1,
		title: 'Kenali Lingkaran',
		description: 'Ayo kenal bentuk bulat!',
		questions: [
			{
				instruction: 'Pilih yang berbentuk lingkaran',
				targetShape: 'circle',
				options: [
					{ label: 'Lingkaran', shape: 'circle' },
					{ label: 'Persegi', shape: 'square' },
					{ label: 'Segitiga', shape: 'triangle' }
				]
			},
			{
				instruction: 'Mana yang bulat?',
				targetShape: 'circle',
				options: [
					{ label: 'Lingkaran', shape: 'circle' },
					{ label: 'Persegi', shape: 'square' },
					{ label: 'Segitiga', shape: 'triangle' }
				]
			},
			{
				instruction: 'Pilih bentuk lingkaran',
				targetShape: 'circle',
				options: [
					{ label: 'Segitiga', shape: 'triangle' },
					{ label: 'Persegi', shape: 'square' },
					{ label: 'Lingkaran', shape: 'circle' }
				]
			}
		]
	},
	{
		id: 2,
		title: 'Kenali Persegi',
		description: 'Mari kenal bentuk kotak!',
		questions: [
			{
				instruction: 'Pilih yang berbentuk persegi',
				targetShape: 'square',
				options: [
					{ label: 'Persegi', shape: 'square' },
					{ label: 'Lingkaran', shape: 'circle' },
					{ label: 'Segitiga', shape: 'triangle' }
				]
			},
			{
				instruction: 'Mana yang kotak?',
				targetShape: 'square',
				options: [
					{ label: 'Lingkaran', shape: 'circle' },
					{ label: 'Persegi', shape: 'square' },
					{ label: 'Segitiga', shape: 'triangle' }
				]
			},
			{
				instruction: 'Pilih bentuk persegi',
				targetShape: 'square',
				options: [
					{ label: 'Segitiga', shape: 'triangle' },
					{ label: 'Lingkaran', shape: 'circle' },
					{ label: 'Persegi', shape: 'square' }
				]
			}
		]
	},
	{
		id: 3,
		title: 'Kenali Segitiga',
		description: 'Bentuk dengan 3 sudut!',
		questions: [
			{
				instruction: 'Pilih yang berbentuk segitiga',
				targetShape: 'triangle',
				options: [
					{ label: 'Segitiga', shape: 'triangle' },
					{ label: 'Lingkaran', shape: 'circle' },
					{ label: 'Persegi', shape: 'square' }
				]
			},
			{
				instruction: 'Mana yang punya 3 sudut?',
				targetShape: 'triangle',
				options: [
					{ label: 'Persegi', shape: 'square' },
					{ label: 'Segitiga', shape: 'triangle' },
					{ label: 'Lingkaran', shape: 'circle' }
				]
			},
			{
				instruction: 'Pilih bentuk segitiga',
				targetShape: 'triangle',
				options: [
					{ label: 'Lingkaran', shape: 'circle' },
					{ label: 'Persegi', shape: 'square' },
					{ label: 'Segitiga', shape: 'triangle' }
				]
			}
		]
	},
	{
		id: 4,
		title: 'Bentuk Dasar Campuran',
		description: 'Lingkaran, persegi, segitiga',
		questions: [
			{
				instruction: 'Pilih lingkaran',
				targetShape: 'circle',
				options: [
					{ label: 'Lingkaran', shape: 'circle' },
					{ label: 'Persegi', shape: 'square' },
					{ label: 'Segitiga', shape: 'triangle' }
				]
			},
			{
				instruction: 'Pilih persegi',
				targetShape: 'square',
				options: [
					{ label: 'Segitiga', shape: 'triangle' },
					{ label: 'Persegi', shape: 'square' },
					{ label: 'Lingkaran', shape: 'circle' }
				]
			},
			{
				instruction: 'Pilih segitiga',
				targetShape: 'triangle',
				options: [
					{ label: 'Persegi', shape: 'square' },
					{ label: 'Lingkaran', shape: 'circle' },
					{ label: 'Segitiga', shape: 'triangle' }
				]
			}
		]
	},
	{
		id: 5,
		title: 'Hitung Bentuk',
		description: 'Berapa banyak bentuknya?',
		questions: [
			{
				instruction: 'Berapa banyak lingkaran?',
				visual: 'circle-3',
				targetShape: '3',
				options: [
					{ label: '2', shape: '2', count: 2 },
					{ label: '3', shape: '3', count: 3 },
					{ label: '4', shape: '4', count: 4 }
				]
			},
			{
				instruction: 'Berapa banyak persegi?',
				visual: 'square-4',
				targetShape: '4',
				options: [
					{ label: '3', shape: '3', count: 3 },
					{ label: '4', shape: '4', count: 4 },
					{ label: '5', shape: '5', count: 5 }
				]
			},
			{
				instruction: 'Berapa banyak segitiga?',
				visual: 'triangle-2',
				targetShape: '2',
				options: [
					{ label: '1', shape: '1', count: 1 },
					{ label: '2', shape: '2', count: 2 },
					{ label: '3', shape: '3', count: 3 }
				]
			}
		]
	},
	{
		id: 6,
		title: 'Bentuk Lanjutan',
		description: 'Persegi panjang, oval, bintang',
		questions: [
			{
				instruction: 'Pilih persegi panjang',
				targetShape: 'rectangle',
				options: [
					{ label: 'Persegi Panjang', shape: 'rectangle' },
					{ label: 'Persegi', shape: 'square' },
					{ label: 'Lingkaran', shape: 'circle' }
				]
			},
			{
				instruction: 'Pilih oval (bulat panjang)',
				targetShape: 'oval',
				options: [
					{ label: 'Lingkaran', shape: 'circle' },
					{ label: 'Oval', shape: 'oval' },
					{ label: 'Persegi Panjang', shape: 'rectangle' }
				]
			},
			{
				instruction: 'Pilih bintang',
				targetShape: 'star',
				options: [
					{ label: 'Bintang', shape: 'star' },
					{ label: 'Lingkaran', shape: 'circle' },
					{ label: 'Segitiga', shape: 'triangle' }
				]
			}
		]
	},
	{
		id: 7,
		title: 'Cocokkan Bentuk',
		description: 'Pilih yang bentuknya sama',
		questions: [
			{
				instruction: 'Pilih yang bentuknya sama dengan ini: ⭕',
				targetShape: 'circle',
				options: [
					{ label: 'Lingkaran', shape: 'circle' },
					{ label: 'Persegi', shape: 'square' },
					{ label: 'Segitiga', shape: 'triangle' }
				]
			},
			{
				instruction: 'Pilih yang bentuknya sama dengan ini: 🔷',
				targetShape: 'diamond',
				options: [
					{ label: 'Wajik', shape: 'diamond' },
					{ label: 'Persegi', shape: 'square' },
					{ label: 'Segitiga', shape: 'triangle' }
				]
			},
			{
				instruction: 'Pilih yang bentuknya sama dengan ini: ⬛',
				targetShape: 'square',
				options: [
					{ label: 'Segitiga', shape: 'triangle' },
					{ label: 'Persegi', shape: 'square' },
					{ label: 'Lingkaran', shape: 'circle' }
				]
			}
		]
	},
	{
		id: 8,
		title: 'Bentuk di Sekitar',
		description: 'Bentuk pada benda',
		questions: [
			{
				instruction: 'Bola berbentuk...',
				targetShape: 'circle',
				options: [
					{ label: 'Lingkaran', shape: 'circle', emoji: '⚽' },
					{ label: 'Persegi', shape: 'square', emoji: '🎁' },
					{ label: 'Segitiga', shape: 'triangle', emoji: '🔺' }
				]
			},
			{
				instruction: 'Kotak kado berbentuk...',
				targetShape: 'square',
				options: [
					{ label: 'Persegi', shape: 'square', emoji: '🎁' },
					{ label: 'Lingkaran', shape: 'circle', emoji: '⚽' },
					{ label: 'Bintang', shape: 'star', emoji: '⭐' }
				]
			},
			{
				instruction: 'Bintang berbentuk...',
				targetShape: 'star',
				options: [
					{ label: 'Segitiga', shape: 'triangle', emoji: '🔺' },
					{ label: 'Lingkaran', shape: 'circle', emoji: '⚽' },
					{ label: 'Bintang', shape: 'star', emoji: '⭐' }
				]
			}
		]
	},
	{
		id: 9,
		title: 'Cerita Bentuk',
		description: 'Dengarkan dan pilih',
		questions: [
			{
				instruction: 'Ani membawa balon yang bulat. Bentuknya...',
				targetShape: 'circle',
				options: [
					{ label: 'Lingkaran', shape: 'circle', emoji: '🎈' },
					{ label: 'Persegi', shape: 'square', emoji: '🎁' },
					{ label: 'Segitiga', shape: 'triangle', emoji: '🔺' }
				]
			},
			{
				instruction: 'Budi bermain dengan dadu yang kotak. Bentuknya...',
				targetShape: 'square',
				options: [
					{ label: 'Persegi', shape: 'square', emoji: '🎲' },
					{ label: 'Lingkaran', shape: 'circle', emoji: '⚽' },
					{ label: 'Bintang', shape: 'star', emoji: '⭐' }
				]
			},
			{
				instruction: 'Di langit ada bintang bersinar. Bentuknya...',
				targetShape: 'star',
				options: [
					{ label: 'Bintang', shape: 'star', emoji: '⭐' },
					{ label: 'Lingkaran', shape: 'circle', emoji: '⚽' },
					{ label: 'Persegi', shape: 'square', emoji: '🎁' }
				]
			}
		]
	},
	{
		id: 10,
		title: 'Tantangan Akhir',
		description: 'Semua bentuk!',
		questions: [
			{
				instruction: 'Pilih persegi panjang',
				targetShape: 'rectangle',
				options: [
					{ label: 'Persegi Panjang', shape: 'rectangle' },
					{ label: 'Persegi', shape: 'square' },
					{ label: 'Oval', shape: 'oval' }
				]
			},
			{
				instruction: 'Berapa banyak segitiga?',
				visual: 'triangle-5',
				targetShape: '5',
				options: [
					{ label: '4', shape: '4', count: 4 },
					{ label: '5', shape: '5', count: 5 },
					{ label: '6', shape: '6', count: 6 }
				]
			},
			{
				instruction: 'Pilih yang berbentuk wajik',
				targetShape: 'diamond',
				options: [
					{ label: 'Wajik', shape: 'diamond' },
					{ label: 'Persegi', shape: 'square' },
					{ label: 'Oval', shape: 'oval' }
				]
			},
			{
				instruction: 'Jam dinding berbentuk...',
				targetShape: 'circle',
				options: [
					{ label: 'Lingkaran', shape: 'circle', emoji: '🕐' },
					{ label: 'Persegi', shape: 'square', emoji: '🎁' },
					{ label: 'Bintang', shape: 'star', emoji: '⭐' }
				]
			},
			{
				instruction: 'Pilih bintang',
				targetShape: 'star',
				options: [
					{ label: 'Bintang', shape: 'star' },
					{ label: 'Lingkaran', shape: 'circle' },
					{ label: 'Segitiga', shape: 'triangle' }
				]
			}
		]
	}
];

const PetualanganBentuk = () => {
	const [gameState, setGameState] = useState<GameState>('menu');
	const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [stars, setStars] = useState(0);
	const [lives, setLives] = useState(3);
	const [feedback, setFeedback] = useState<Feedback>(null);
	const [shuffledOptions, setShuffledOptions] = useState<ShapeOption[]>([]);
	const audioRef = useRef<AudioContext | null>(null);

	const { completedLevels, setCompletedLevels, totalStars, setTotalStars } = useGameProgress('petualanganBentuk');

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
		playTone(523.25, now, 0.15, 0.12);
		playTone(659.25, now + 0.1, 0.15, 0.12);
		playTone(783.99, now + 0.2, 0.2, 0.15);
		playTone(1046.50, now + 0.35, 0.4, 0.15);
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

	useEffect(() => {
		if (currentLevel && gameState === 'playing') {
			setShuffledOptions(shuffleArray(currentLevel.questions[currentQuestion].options));
		}
	}, [currentQuestion, currentLevel, gameState]);

	const handleAnswer = (selected: ShapeOption) => {
		if (!currentLevel) return;
		const question = currentLevel.questions[currentQuestion];
		const isCorrect = selected.shape === question.targetShape;

		if (isCorrect) {
			setStars(prev => prev + 1);
			setFeedback('correct');
			playSuccessSound();

			const praises = [
				'Hebat! Bentuknya tepat!',
				'Pintar sekali!',
				'Benar sekali!',
				'Kamu jago bentuk!',
				'Mantap!'
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
			}, 1500);
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
			}, 1000);
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

	const renderVisual = (visual: string) => {
		const [shape, countStr] = visual.split('-');
		const count = parseInt(countStr);
		const shapes = [];
		
		for (let i = 0; i < count; i++) {
			shapes.push(
				<ShapeDisplay 
					key={i} 
					shape={shape} 
					size={50} 
					color={['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6'][i % 5]}
				/>
			);
		}
		
		return <div className="flex flex-wrap justify-center gap-2 mb-6">{shapes}</div>;
	};

	const question = currentLevel?.questions[currentQuestion];

	if (gameState === 'menu') {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center p-4">
				<header className="w-full max-w-4xl mx-auto py-4 mb-4">
					<div className="bg-white/80 rounded-2xl shadow-lg py-3 px-6 text-center">
						<h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-purple-700 tracking-wide drop-shadow-md">Eureka Playroom</h1>
					</div>
				</header>
				<div className="text-center max-w-2xl mx-auto">
					<div className="mb-6 flex justify-center gap-3 text-5xl sm:text-7xl">
						<span className="animate-bounce" style={{ animationDelay: '0s' }}>🔴</span>
						<span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🔷</span>
						<span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🔺</span>
					</div>
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-purple-600 mb-3 drop-shadow-lg px-4">
						Petualangan<br/>Bentuk
					</h1>
					<p className="text-lg sm:text-2xl text-purple-500 mb-6 px-4">Kenali bentuk-bentuk di sekitarmu!</p>
					<button
						onClick={startGame}
						className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white text-xl sm:text-2xl font-bold py-3 px-8 sm:py-4 sm:px-12 rounded-full shadow-lg hover:scale-110 transition-transform"
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
			<div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 sm:p-8 flex flex-col">
				<header className="w-full max-w-4xl mx-auto py-4 mb-4">
					<div className="bg-white/80 rounded-2xl shadow-lg py-3 px-6 text-center">
						<h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-purple-700 tracking-wide drop-shadow-md">Eureka Playroom</h1>
					</div>
				</header>
				<div className="max-w-6xl mx-auto">
					<div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
						<div>
							<h2 className="text-3xl sm:text-4xl font-bold text-purple-600">Pilih Level</h2>
							<p className="text-sm text-gray-600">Selesaikan level untuk buka yang berikutnya!</p>
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
										{!unlocked ? <Lock className="mx-auto text-gray-500" size={42} /> : completed ? '🏆' : '🎯'}
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
							Kamu Ahli Bentuk!
							<Sparkles size={28} className="text-yellow-500" />
						</div>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100 p-4 flex flex-col">
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

					{question?.visual && renderVisual(question.visual)}

					<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
						{shuffledOptions.map((option, idx) => (
							<button
								key={idx}
								onClick={() => handleAnswer(option)}
								disabled={feedback !== null}
								className="bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 disabled:opacity-50 rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-center justify-center gap-3 border-2 border-purple-200 hover:border-purple-400 transition-all hover:scale-105 disabled:hover:scale-100 min-h-[140px] sm:min-h-[180px]"
							>
								<div className="flex justify-center items-center">
									<ShapeDisplay 
										shape={option.shape} 
										size={window.innerWidth < 640 ? 50 : 70} 
										color="#8b5cf6"
										emoji={option.emoji}
									/>
								</div>
								<span className="text-base sm:text-xl font-bold text-purple-700">{option.label}</span>
							</button>
						))}
					</div>
				</div>

				<div className="flex justify-center items-center gap-3 sm:gap-4 mb-6">
					<div className="text-4xl sm:text-5xl animate-bounce" style={{ animationDelay: '0s' }}>🔴</div>
					<div className="text-3xl sm:text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🔷</div>
					<div className="text-4xl sm:text-5xl animate-bounce" style={{ animationDelay: '0.4s' }}>🔺</div>
					<div className="text-3xl sm:text-4xl animate-bounce" style={{ animationDelay: '0.6s' }}>⭐</div>
				</div>

				<div className="bg-gradient-to-r from-blue-200 to-purple-200 rounded-2xl p-4 sm:p-6 text-center mb-4 sm:mb-6 shadow-lg">
					<p className="text-lg sm:text-2xl font-bold text-purple-700">💪 Kamu Pasti Bisa! 💪</p>
					<p className="text-sm sm:text-lg text-purple-600 mt-2">Perhatikan bentuknya baik-baik!</p>
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
									<div className="text-4xl sm:text-6xl mb-3 animate-pulse">✨🔷✨</div>
									<p className="text-xl sm:text-3xl font-bold text-white animate-bounce drop-shadow-md">Hebat!</p>
								</>
							) : (
								<>
									<div className="animate-[wiggle_0.5s_ease-in-out]">
										<XCircle size={window.innerWidth < 640 ? 80 : 120} className="text-white mx-auto mb-4 drop-shadow-lg" />
									</div>
									<p className="text-3xl sm:text-5xl font-bold text-white drop-shadow-md">Coba Lagi! 💪</p>
									<p className="text-lg sm:text-xl text-white mt-3 drop-shadow-sm">Perhatikan bentuknya!</p>
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

export default PetualanganBentuk;
