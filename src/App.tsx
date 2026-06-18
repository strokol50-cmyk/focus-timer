import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Moon, Sun, Crown, X, Sparkles, BarChart3, Palette, Wind as WindIcon } from 'lucide-react';

type TimerState = 'idle' | 'running' | 'paused' | 'completed';
type AmbientSound = 'rain' | 'forest' | 'ocean' | 'fire' | 'wind' | 'night' | 'cafe' | 'thunder' | 'birds' | 'none';

interface AmbientConfig {
  label: string;
  gradient: string;
  premium?: boolean;
}

const AMBIENT_CONFIG: Record<AmbientSound, AmbientConfig> = {
  rain: { label: 'Rain', gradient: 'from-slate-700 to-slate-900' },
  forest: { label: 'Forest', gradient: 'from-emerald-900 to-slate-950' },
  ocean: { label: 'Ocean', gradient: 'from-cyan-900 to-slate-950' },
  fire: { label: 'Fire', gradient: 'from-orange-950 to-slate-950' },
  wind: { label: 'Wind', gradient: 'from-gray-800 to-slate-950' },
  night: { label: 'Night', gradient: 'from-indigo-950 to-slate-950', premium: true },
  cafe: { label: 'Cafe', gradient: 'from-amber-900 to-slate-950', premium: true },
  thunder: { label: 'Thunder', gradient: 'from-gray-900 to-slate-950', premium: true },
  birds: { label: 'Birds', gradient: 'from-lime-900 to-slate-950', premium: true },
  none: { label: 'Silent', gradient: 'from-slate-950 to-black' },
};

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const PRESETS = [
  { seconds: 5 * 3, label: '5seg' },
  { seconds: 5 * 60, label: '5min' },
  { seconds: 10 * 60, label: '10min' },
  { seconds: 15 * 60, label: '15min' },
  { seconds: 25 * 60, label: '25min' },
  { seconds: 45 * 60, label: '45min' },
  { seconds: 60 * 60, label: '1horas' },
];

const PREMIUM_FEATURES = [
  {
    icon: WindIcon,
    title: 'Exclusive Sounds',
    description: 'Night, Cafe, Thunder, Birds and more ambient environments',
  },
  {
    icon: BarChart3,
    title: 'Focus Statistics',
    description: 'Track your focus sessions with detailed analytics and insights',
  },
  {
    icon: Palette,
    title: 'Custom Themes',
    description: 'Personalize your experience with beautiful color themes',
  },
  {
    icon: Sparkles,
    title: 'AI Relaxation',
    description: 'Adaptive sessions that respond to your focus patterns',
  },
];

function PremiumScreen({ onClose }: { onClose: () => void }) {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 sticky top-0 bg-black/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3">
          <Crown className="w-5 h-5 text-amber-400" />
          <span className="text-white text-sm tracking-[0.2em] uppercase font-medium">Premium</span>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={20} className="text-[#666]" />
        </button>
      </div>

      {/* Hero */}
      <div className="px-6 pt-8 pb-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 mb-6">
          <Crown className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-3xl font-light text-white mb-3">Unlock Your Focus</h1>
        <p className="text-[#666] text-sm max-w-xs mx-auto leading-relaxed">
          Elevate your mindfulness practice with premium features designed for deep focus.
        </p>
      </div>

      {/* Features */}
      <div className="px-6 space-y-3 mb-10">
        {PREMIUM_FEATURES.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] flex items-center justify-center">
              <feature.icon className="w-5 h-5 text-[#888]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white text-sm font-medium mb-1">{feature.title}</h3>
              <p className="text-[#555] text-xs leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing toggle */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-center gap-3 p-1 rounded-full bg-white/[0.03]">
          <button
            onClick={() => setIsAnnual(false)}
            className={`flex-1 py-2.5 rounded-full text-xs tracking-wide uppercase transition-all duration-300 ${
              !isAnnual ? 'bg-white text-black' : 'text-[#555]'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`flex-1 py-2.5 rounded-full text-xs tracking-wide uppercase transition-all duration-300 ${
              isAnnual ? 'bg-white text-black' : 'text-[#555]'
            }`}
          >
            Annual
            <span className="ml-2 text-[10px] text-emerald-400">Save 50%</span>
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="px-6 mb-8 text-center">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-5xl font-extralight text-white tabular-nums">
            ${isAnnual ? '2.49' : '4.99'}
          </span>
          <span className="text-[#555] text-sm">/month</span>
        </div>
        {isAnnual && (
          <p className="text-[#444] text-xs mt-2">Billed annually at $29.99</p>
        )}
      </div>

      {/* CTA */}
      <div className="px-6 pb-8">
        <button className="w-full py-4 rounded-2xl bg-white text-black font-medium text-sm tracking-wide uppercase hover:bg-gray-100 transition-colors duration-200">
          Start 7-Day Free Trial
        </button>
        <p className="text-center text-[#444] text-xs mt-4">
          Cancel anytime. No commitment required.
        </p>
      </div>

      {/* Footer note */}
      <div className="px-6 py-6 border-t border-white/[0.05]">
        <p className="text-[#333] text-xs text-center leading-relaxed">
          Premium subscription unlocks all features across your devices.
          Your subscription supports ongoing development.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [duration, setDuration] = useState(25 * 60);
  const [remaining, setRemaining] = useState(25 * 60);
  const [ambient, setAmbient] = useState<AmbientSound>('none');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [isPremium] = useState(true); // Would come from auth/subscription
  const [completedSessions, setCompletedSessions] = useState(() => {
  return Number(localStorage.getItem('completedSessions') || 0);
});

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedRemainingRef = useRef<number>(0);

  // Timer logic
  useEffect(() => {
    if (timerState === 'running') {
      startTimeRef.current = Date.now();
      const remainingAtStart = remaining;

      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const newRemaining = Math.max(0, remainingAtStart - elapsed);

        setRemaining(newRemaining);

        if (newRemaining <= 0) {
          clearInterval(intervalRef.current!);
          const newCount = completedSessions + 1;
          setCompletedSessions(newCount);
          localStorage.setItem('completedSessions', String(newCount));
          console.log("FIN DEL TEMPORIZADOR");

const bell = new Audio('/sounds/bell.mp3');
bell.volume = 0.6;

bell.play().then(() => {
  console.log("SONIDO REPRODUCIDO");
}).catch((err) => {
  console.error("ERROR AUDIO:", err);
});

          setTimerState('completed');
        }
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState]);

  // Audio handling
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (ambient !== 'none' && soundEnabled && (timerState === 'running' || timerState === 'paused')) {
     const soundFiles: Record<string, string> = {
  rain: '/sounds/rain.mp3',
  forest: '/sounds/forest.mp3',
  ocean: '/sounds/ocean.mp3',
  fire: '/sounds/fire.mp3',
  wind: '/sounds/wind.mp3',
  night: '/sounds/night.mp3',
  cafe: '/sounds/cafe.mp3',
  thunder: '/sounds/thunder.mp3',
  birds: '/sounds/birds.mp3',
};

      audioRef.current = new Audio(soundFiles[ambient]);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => {});
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [ambient, soundEnabled, timerState]);

  const startTimer = useCallback(() => {
    setTimerState('running');
  }, []);

  const pauseTimer = useCallback(() => {
    pausedRemainingRef.current = remaining;
    setTimerState('paused');
  }, [remaining]);

  const resetTimer = useCallback(() => {
    setTimerState('idle');
    setRemaining(duration);
  }, [duration]);

  const selectDuration = useCallback((seconds: number) => {
    setDuration(seconds);
    setRemaining(seconds);
    setTimerState('idle');
  }, []);

  const selectAmbient = useCallback((sound: AmbientSound) => {
    if (AMBIENT_CONFIG[sound].premium && !isPremium) {
      setShowPremium(true);
      return;
    }
    setAmbient(sound);
  }, [isPremium]);

  const progress = duration > 0 ? (remaining / duration) * 100 : 0;
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const isOff = timerState === 'idle';
  const isComplete = timerState === 'completed';
  const isRunning = timerState === 'running';
  const isPaused = timerState === 'paused';

  return (
    <>
      <div className="min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden relative">
        {/* Subtle gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-b ${AMBIENT_CONFIG[ambient].gradient} opacity-30 transition-opacity duration-1000`} />

        {/* Animated particles */}
        {(isRunning || isPaused) && ambient !== 'none' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/10 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 flex justify-between items-center p-6 z-20">
          <div className="text-[#333] text-xs tracking-[0.3em] uppercase font-medium">OFF</div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPremium(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-colors duration-200"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] tracking-[0.15em] uppercase text-amber-400/80">Pro</span>
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-[#333] hover:text-white transition-colors duration-300"
            >
              {showSettings ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-col items-center justify-center flex-1 relative z-10 px-6">
          {/* Timer ring and button */}
          <div className="relative flex items-center justify-center mb-8">
            <svg width="320" height="320" className="absolute -rotate-90">
              <circle cx="160" cy="160" r="140" fill="none" stroke="#1a1a1a" strokeWidth="2" />
              <circle
                cx="160"
                cy="160"
                r="140"
                fill="none"
                stroke={isComplete ? '#22c55e' : isPaused ? '#666' : '#fff'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-200 ease-linear"
                style={{ opacity: isOff ? 0 : 1 }}
              />
            </svg>

            <button
              onClick={() => {
                if (isOff) startTimer();
                else if (isRunning) pauseTimer();
                else if (isPaused) startTimer();
                else resetTimer();
              }}
              className={`relative w-64 h-64 rounded-full flex flex-col items-center justify-center transition-all duration-500 ${
                isOff
                  ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
                  : isComplete
                  ? 'bg-emerald-500/10 border border-emerald-500/30'
                  : isPaused
                  ? 'bg-white/5 border border-white/20'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              <div className={`absolute inset-4 rounded-full transition-all duration-500 ${
                isOff
                  ? 'bg-gradient-to-b from-white/[0.03] to-transparent'
                  : isComplete
                  ? 'bg-gradient-to-b from-emerald-500/10 to-transparent'
                  : 'bg-gradient-to-b from-white/[0.05] to-transparent'
              }`} />

              {isOff ? (
                <div className="relative flex flex-col items-center">
                  <span className="text-white text-2xl font-extralight tracking-[0.4em] mb-2">OFF</span>
                  <span className="text-[#444] text-xs tracking-[0.2em] uppercase">tap to focus</span>
                </div>
              ) : isComplete ? (
                <div className="relative flex flex-col items-center">
                  <span className="text-emerald-400 text-lg font-light tracking-[0.3em] mb-1">complete</span>
                  <span className="text-[#666] text-xs tracking-[0.15em]">tap to reset</span>
                </div>
              ) : (
                <div className="relative flex flex-col items-center">
                  <span className="text-white text-5xl font-extralight tabular-nums tracking-tight mb-1">
                    {formatTime(remaining)}
                  </span>
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); resetTimer(); }}
                      className="p-3 rounded-full hover:bg-white/10 transition-colors duration-200"
                    >
                      <RotateCcw size={16} className="text-[#555]" />
                    </button>
                    {isPaused && <span className="text-[#555] text-xs tracking-[0.2em] uppercase">paused</span>}
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* Duration presets */}
          <div className={`flex flex-wrap justify-center gap-2 mb-8 transition-all duration-500 ${
            isOff ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            {PRESETS.map((preset) => (
              <button
                key={preset.seconds}
                onClick={() => selectDuration(preset.seconds)}
                className={`px-4 py-2 rounded-full text-xs tracking-[0.15em] uppercase transition-all duration-300 ${
                  duration === preset.seconds
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'bg-transparent text-[#444] border border-white/5 hover:border-white/10 hover:text-[#666]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Ambient sounds */}
          <div className={`flex flex-wrap justify-center gap-3 transition-all duration-500 ${
            isOff || isPaused ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            {(Object.keys(AMBIENT_CONFIG) as AmbientSound[]).map((sound) => {
              const config = AMBIENT_CONFIG[sound];
              const isLocked = config.premium && !isPremium;
              const isSelected = ambient === sound;

              return (
                <button
                  key={sound}
                  onClick={() => selectAmbient(sound)}
                  className={`relative px-4 py-2 rounded-full text-xs tracking-[0.15em] uppercase transition-all duration-300 ${
                    isSelected
                      ? 'bg-white text-black'
                      : isLocked
                      ? 'bg-white/5 text-[#333] border border-white/5'
                      : 'bg-white/5 text-[#555] hover:bg-white/10 hover:text-[#777]'
                  }`}
                >
                  {config.label}
                  {isLocked && (
                    <Crown className="absolute -top-1 -right-1 w-3 h-3 text-amber-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Sound toggle */}
          {ambient !== 'none' && (
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`mt-4 p-2 rounded-full transition-all duration-300 ${
                soundEnabled ? 'text-white/50' : 'text-[#333]'
              }`}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          )}
        </div>

        {/* Session stats */}
        {(isRunning || isPaused || isComplete) && (
          <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 transition-all duration-500 ${
            isRunning || isPaused || isComplete ? 'opacity-100' : 'opacity-0'
          }`}
         >
         <div className="text-center text-white/60 text-sm tracking-wide">
          Sesiones completadas: {localStorage.getItem('completedSessions') || 0}
        </div>

            <div className="text-[#333] text-xs tracking-[0.2em] uppercase">
              {formatTime(duration - remaining)} elapsed · {formatTime(remaining)} remaining
            </div>
          </div>
        )}

        {/* Background glow */}
        {isRunning && (
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/2 rounded-full blur-3xl animate-pulse-slow" />
          </div>
        )}
      </div>

      {/* Premium modal */}
      {showPremium && <PremiumScreen onClose={() => setShowPremium(false)} />}
    </>
  );
}
