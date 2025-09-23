export interface Duration {
  years: number;
  months: number;
  days: number;
}

export function getDuration(start: Date, end: Date | null): Duration {
  if (!end) {
    end = new Date();
  }

  const duration = {
    years: end.getFullYear() - start.getFullYear(),
    months: end.getMonth() - start.getMonth(),
    days: end.getDate() - start.getDate(),
  };

  return duration;
}
