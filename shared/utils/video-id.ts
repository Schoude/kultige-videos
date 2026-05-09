import { customAlphabet } from 'nanoid';

// This alphabet removes characters that might look similar (like l and I)
// or you can stick to the standard YT-style Base64 set:
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-';

export const generateVideoId = customAlphabet(alphabet, 11);
