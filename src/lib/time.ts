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

export function getDurationString(start: Date, end: Date | null) {
  const duration = getDuration(start, end);

  // Normalize negative values
  if (duration.days < 0) {
    duration.months--;
    const lastMonth = new Date(
      end?.getFullYear() || new Date().getFullYear(),
      (end?.getMonth() || new Date().getMonth()) - 1,
      0,
    );
    duration.days += lastMonth.getDate();
  }

  if (duration.months < 0) {
    duration.years--;
    duration.months += 12;
  }

  const parts: string[] = [];

  if (duration.years > 0) {
    parts.push(`${duration.years} year${duration.years !== 1 ? 's' : ''}`);
  }

  if (duration.months > 0) {
    parts.push(`${duration.months} month${duration.months !== 1 ? 's' : ''}`);
  }

  if (parts.length === 0) {
    return `${duration.days} day${duration.days !== 1 ? 's' : ''}`;
  }

  return parts.join(' ');
}
