/// <reference types="vite/client" />
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? (() => { throw new Error('GEMINI_API_KEY not set'); })();
