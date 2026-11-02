// Password rules for the reset page's meter; the same as the app (bukuresipi-flutter password_strength.dart).
// Only `length` is required (the API's rule: 8-72 bytes, not only spaces); the rest raise the strength.
export type Strength = 'weak' | 'fair' | 'good' | 'strong'

export const checkPassword = (p: string) => {
    const bytes = new TextEncoder().encode(p).length
    const c = {
        length: bytes >= 8 && bytes <= 72 && p.trim() !== '',
        lower: /\p{Ll}/u.test(p),
        upper: /\p{Lu}/u.test(p),
        number: /\d/.test(p),
        symbol: /[^\p{L}\p{N}]/u.test(p),
        long: [...p].length >= 12,
    }
    const points = [c.lower, c.upper, c.number, c.symbol, c.long].filter(Boolean).length
    const strength: Strength = !c.length || points <= 1 ? 'weak' : points === 2 ? 'fair' : points === 3 ? 'good' : 'strong'
    return { ...c, strength }
}
