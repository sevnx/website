import { m } from '@/paraglide/messages.js';
import type { Locale } from '@/i18n/locales';

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

export function formatDuration(start: Date, end: Date | null, locale: Locale = 'en'): string {
  const duration = getDuration(start, end);

  let amount = 0;
  let message = m.duration_days;

  if (duration.years >= 2) {
    amount = duration.years;
    message = m.duration_years;
  } else {
    const totalMonths = duration.years * 12 + duration.months;

    if (totalMonths >= 1) {
      amount = totalMonths;
      message = m.duration_months;
    } else {
      // A project started and finished on the same date still took one day.
      amount = duration.days === 0 ? 1 : duration.days;
      message = m.duration_days;
    }
  }

  return message({ count: amount, suffix: end === null ? '+' : '' }, { locale });
}
