import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBDT(amount: number): string {
  return '৳' + amount.toLocaleString('en-IN');
}

export function formatBDTShort(amount: number): string {
  if (amount >= 100000) {
    const lac = amount / 100000;
    return `৳${lac % 1 === 0 ? lac : lac.toFixed(1)}L`;
  }
  if (amount >= 1000) {
    const k = amount / 1000;
    return `৳${k % 1 === 0 ? k : k.toFixed(0)}k`;
  }
  return `৳${amount}`;
}
