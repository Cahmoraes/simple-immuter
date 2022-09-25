import { describe, it, expect } from '@jest/globals'
import { si } from '../src/index'

describe('Simple Immuter Test Suite', () => {
  describe('Test suit about baseState', () => {
    it('should return a copy of object', () => {
      const user = {
        name: 'cahmoraes',
        age: 28,
        books: ['Sapiens', 'Rápido e Devagar'],
      }

      const clone = si.produce(user)

      expect(clone).toStrictEqual(user)
    })

    it('should merge three objects', () => {
      const user_1 = {
        name: 'cahmoraes',
      }

      const user_2 = {
        name: 'thomas',
      }

      const user_3 = {
        name: 'isabella',
      }

      const expected = Object.assign({}, user_1, user_2, user_3)

      const clone = si.produce(user_1, user_2, user_3)

      expect(clone).toStrictEqual(expected)
    })

    it('should merge baseState and draftStateObject', () => {
      const name = { name: 'caique' }
      const age = { age: 29 }

      const result = si.produce(name, age)

      expect(result).toHaveProperty('age', 29)
      expect(result).toHaveProperty('name', 'caique')
    })

    it('should merge two arrays', () => {
      const books_1 = ['Design Patterns']
      const books_2 = ['Rápido e Devagar']

      const expected = [...books_1, ...books_2]

      const result = si.produce(books_1, books_2)

      expect(result).toStrictEqual(expected)
    })

    it('should merge three arrays', () => {
      const books_1 = ['Design Patterns']
      const books_2 = ['Rápido e Devagar']
      const books_3 = ['Sapiens']

      const expected = [...books_1, ...books_2, ...books_3]

      const result = si.produce(books_1, books_2, books_3)

      expect(result).toStrictEqual(expected)
    })

    it('should throw Error when marge different types', () => {
      const books_1 = ['Design Patterns']
      const books_2 = { name: 'Rápido e Devagar' }

      expect(() => si.produce(books_1, books_2)).toThrowError(
        'baseState and producer are incompatibles',
      )
    })

    it('should throw Error when marge different types', () => {
      const books_1 = ['Design Patterns']
      const books_2 = { name: 'Rápido e Devagar' }
      const books_3 = { name: 'Programador Pragmático' }

      expect(() => si.produce(books_1, books_2, books_3)).toThrowError(
        'Cannot merge these types, because they are different types',
      )
    })

    it('should throw Error when marge different types', () => {
      const books_1 = { name: 'Rápido e Devagar' }
      const books_2 = { name: 'Sapiens' }
      const books_3 = ['Programador Pragmático']

      expect(() => si.produce(books_1, books_2, books_3)).toThrowError(
        'Cannot merge these types, because they are different types',
      )
    })

    it('should not change value of array resultant', () => {
      const books_1 = ['Design Patterns']
      const books_2 = ['Rápido e Devagar']
      const books_3 = ['Sapiens']

      const result = si.produce(books_1, books_2, books_3)

      expect(() => result.push('Cangaceiro Javascript')).toThrowError(
        'Cannot add property 3, object is not extensible',
      )
    })

    it('should not change value of object resultant', () => {
      const user_1 = {
        name: 'cahmoraes',
      }

      const result = si.produce(user_1)

      expect(() => (result.name = 'thomas')).toThrowError(
        "Cannot assign to read only property 'name' of object '#<Object>'",
      )
    })

    it('should return a clone of Map with properties changed', () => {
      const map = new Map().set('name', 'caique')
      const result = si.produce(map)
      expect(result).toBeInstanceOf(Map)
    })

    it('should return a clone of Set with properties changed', () => {
      const set = new Set().add('caique')
      const result = si.produce(set)
      expect(result).toBeInstanceOf(Set)
    })
  })

  describe('Test suit about draftState', () => {
    it('should return a clone object with properties changed', () => {
      const user = { name: 'caique' }

      const result = si.produce(user, (draftState) => {
        draftState.name = 'thomas'
        draftState.age = 23
      })

      expect(result).toHaveProperty('age')
      expect(result).toHaveProperty('name', 'thomas')
    })
  })

  describe('Test suit about states', () => {
    it('should return false when baseState and produceState are different', () => {
      const state_1 = ['caique']
      const state_2 = { user: 'caique' } as any

      expect(() => si.produce(state_1, state_2)).toThrowError(
        'baseState and producer are incompatibles',
      )
    })

    it('should return false when states are different', () => {
      const state_1 = ['caique']
      const state_2 = ['thomas']
      const state_3 = { user: 'caique' } as any

      expect(() => si.produce(state_1, state_2, state_3)).toThrowError(
        'Cannot merge these types, because they are different types',
      )
    })

    it('should return false when states are different', () => {
      const state_1 = { name: 'caique' }
      const state_2 = { age: 29 }
      const state_3 = ['Sapiens'] as any

      expect(() => si.produce(state_1, state_2, state_3)).toThrowError(
        'Cannot merge these types, because they are different types',
      )
    })

    it('should return false when states are different', () => {
      const state_1 = { name: 'caique' }
      const state_2 = { age: 29 }
      const state_3 = { category: 'programmer' }
      const state_4 = { category: 'programmer' }
      const state_5 = ['Rápido e Devagar'] as any

      expect(() =>
        si.produce(state_1, state_2, state_3, state_4, state_5),
      ).toThrowError(
        'Cannot merge these types, because they are different types',
      )
    })
  })

  describe('Test suit when producePromise', () => {
    it('should return immutable Promise', async () => {
      const promise = Promise.resolve({ name: 'caique' })
      const result = si.produce(promise)
      expect(result).toBeInstanceOf(Promise)

      const resolved = await result
      expect(resolved).toStrictEqual({ name: 'caique' })
    })

    it('should return immutable Promise with new Properties', async () => {
      const promise = Promise.resolve({ name: 'caique' })

      const result = si.produce(promise, (draftState) => {
        draftState.age = 28
      })

      expect(result).toBeInstanceOf(Promise)

      const resolved = await result
      expect(resolved).toStrictEqual({ name: 'caique', age: 28 })
    })

    it('should resolve when promise is Rejected', async () => {
      const promise = Promise.reject('Promise Rejected')

      const result = si.produce(promise)

      expect(result).toBeInstanceOf(Promise)

      await expect(result).resolves.toThrow()
    })
  })
})
