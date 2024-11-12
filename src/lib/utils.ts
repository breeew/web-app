import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isJsonString(input: string): boolean {
    try {
        if (typeof JSON.parse(input) == 'object') {
            return true;
        }
    } catch (e) {}

    return false;
}
