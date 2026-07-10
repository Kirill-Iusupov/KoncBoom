"use client";

import { useEffect, useState } from "react";
import { TimeBlock } from "../../timeBlock";
import { TimeLeft } from "@/src/shared/model/types";

interface ITimerProps {
  start: string | Date;
  end: string | Date;
}

export const PromoTimer = ({ start, end }: ITimerProps) => {
  const getTimeLeft = (start: Date, end: Date): TimeLeft => {
    const now = Date.now();
    const hasStarted = now >= start.getTime();
    const diff = end.getTime() - now;

    if (!hasStarted) {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false,
        hasStarted: false,
      };
    }

    if (diff <= 0) {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        hasStarted: true,
      };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { hours, minutes, seconds, isExpired: false, hasStarted: true };
  };
  const startDate = typeof start === "string" ? new Date(start) : start;
  const endDate = typeof end === "string" ? new Date(end) : end;

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    getTimeLeft(startDate, endDate),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(startDate, endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate.getTime(), endDate.getTime()]);

  if (timeLeft.isExpired || !timeLeft.hasStarted) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <TimeBlock value={timeLeft.hours} label="Часов" />
      <TimeBlock value={timeLeft.minutes} label="Минут" />
      <TimeBlock value={timeLeft.seconds} label="Секунд" />
    </div>
  );
};
