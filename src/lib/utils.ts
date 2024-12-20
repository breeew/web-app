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

const BREW_LOGIN_AUTO_DIRECT_KEY = 'brew-auto-login-direct';

export function autoLoginDirect(): boolean {
    return !sessionStorage.getItem(BREW_LOGIN_AUTO_DIRECT_KEY);
}

export function setNotAutoLoginDirect() {
    sessionStorage.setItem(BREW_LOGIN_AUTO_DIRECT_KEY, 'true');
}
