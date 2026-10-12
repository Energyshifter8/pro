// Easing curves measured on the reference (GSAP naming). Usable as framer-motion `ease`.
export const power1Out = (t: number) => 1 - (1 - t) ** 2;
export const power2Out = (t: number) => 1 - (1 - t) ** 3;
export const power3Out = (t: number) => 1 - (1 - t) ** 4;
export const power4Out = (t: number) => 1 - (1 - t) ** 5;
export const power2InOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
export const sineInOut = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
export const expoOut = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

// CSS cubic-bezier equivalents for transitions.
export const outQuint = [0.22, 1, 0.36, 1] as const;
