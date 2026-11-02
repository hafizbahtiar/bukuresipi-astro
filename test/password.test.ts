import { describe, expect, test } from 'bun:test'
import { checkPassword } from '../src/password'

describe('checkPassword (same rules as the app and the API)', () => {
    test('each rule on its own', () => {
        expect(checkPassword('abcDEF1!')).toMatchObject({ length: true, lower: true, upper: true, number: true, symbol: true, long: false })
        expect(checkPassword('abc')).toMatchObject({ length: false, lower: true, upper: false, number: false, symbol: false })
    })
    test('a space counts as a symbol', () => expect(checkPassword('two words').symbol).toBe(true))
    test('only spaces is not a password', () => expect(checkPassword('         ').length).toBe(false))
    test('strength levels', () => {
        expect(checkPassword('').strength).toBe('weak')
        expect(checkPassword('Ab1!').strength).toBe('weak')
        expect(checkPassword('password').strength).toBe('weak')
        expect(checkPassword('password1').strength).toBe('fair')
        expect(checkPassword('Password1').strength).toBe('good')
        expect(checkPassword('Password1!').strength).toBe('strong')
        expect(checkPassword('correct horse battery').strength).toBe('good')
    })
    test('72 bytes max, counted in UTF-8 like the API', () => {
        expect(checkPassword('a'.repeat(72)).length).toBe(true)
        expect(checkPassword('a'.repeat(73)).length).toBe(false)
        expect(checkPassword('é'.repeat(37)).length).toBe(false)
    })
})
