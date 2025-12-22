import React, { useState, useEffect } from 'react';
import { Clock, Calendar, AlertTriangle } from 'lucide-react';

interface CountdownBannerProps {
  targetDate: Date;
  title: string;
  subtitle?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({
  targetDate,
  title,
  subtitle
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeBlock: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 min-w-[60px]">
        <span className="text-2xl md:text-3xl font-bold text-white tabular-nums">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs text-white/80 mt-1 uppercase tracking-wide">{label}</span>
    </div>
  );

  if (isExpired) {
    return (
      <div className="bg-gradient-to-r from-red-600 to-red-500 py-4 px-4">
        <div className="container mx-auto flex items-center justify-center gap-3">
          <AlertTriangle className="h-6 w-6 text-white animate-pulse" />
          <span className="text-white font-semibold text-lg">
            Les inscriptions sont maintenant fermées!
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary via-secondary to-primary py-4 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          {/* Title */}
          <div className="flex items-center gap-2 text-white">
            <Clock className="h-5 w-5 animate-pulse" />
            <span className="font-semibold text-lg">{title}</span>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-2 md:gap-3">
            <TimeBlock value={timeLeft.days} label="Jours" />
            <span className="text-2xl text-white/60 font-light">:</span>
            <TimeBlock value={timeLeft.hours} label="Heures" />
            <span className="text-2xl text-white/60 font-light">:</span>
            <TimeBlock value={timeLeft.minutes} label="Min" />
            <span className="text-2xl text-white/60 font-light">:</span>
            <TimeBlock value={timeLeft.seconds} label="Sec" />
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Calendar className="h-4 w-4" />
              <span>{subtitle}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

