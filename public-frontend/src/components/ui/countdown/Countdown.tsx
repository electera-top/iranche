import { useState, useEffect } from 'react';

interface CountdownProps {
  endDate: Date;
}

const Countdown = ({ endDate }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +endDate - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex items-center justify-between">
      <div className="text-center">
        <span className="text-lg font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</span>
        <span className="text-xs block">ثانیه</span>
      </div>
      <span className="text-lg">:</span>
      <div className="text-center">
        <span className="text-lg font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</span>
        <span className="text-xs block">دقیقه</span>
      </div>
      <span className="text-lg">:</span>
      <div className="text-center">
        <span className="text-lg font-bold">{timeLeft.hours.toString().padStart(2, '0')}</span>
        <span className="text-xs block">ساعت</span>
      </div>
      <span className="text-lg">:</span>
      <div className="text-center">
        <span className="text-lg font-bold">{timeLeft.days.toString().padStart(2, '0')}</span>
        <span className="text-xs block">روز</span>
      </div>
    </div>
  );
};

export default Countdown; 