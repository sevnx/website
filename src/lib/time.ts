export interface Duration {
  years: number;
  months: number;
  days: number;
}

export function getDuration(start: Date, end: Date | null): Duration {
  if (!end) {
    end = new Date();
  }

  const years = end.getFullYear() - start.getFullYear() + (end.getMonth() < start.getMonth() ? -1 : 0);
  const months = end.getMonth() - start.getMonth();
  const days = end.getDate() - start.getDate();

  const duration = {
    years,
    months: months < 0 ? months + 12 : months,
    days,
  };

  return duration;
}
