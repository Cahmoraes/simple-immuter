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

      const clone = si.merge(user_1, user_2, user_3)

      expect(clone).toStrictEqual(expected)
    })

    it('should merge baseState and draftStateObject', () => {
      const name = { name: 'caique' }
      const age = { age: 29 }

      const result = si.merge(name, age)

      expect(result).toHaveProperty('age', 29)
      expect(result).toHaveProperty('name', 'caique')
    })

    it('should merge two arrays', () => {
      const books_1 = ['Design Patterns']
      const books_2 = ['Rápido e Devagar']

      const expected = [...books_1, ...books_2]

      const result = si.merge(books_1, books_2)

      expect(result).toStrictEqual(expected)
    })

    it('should merge two arrays when exists nested array', () => {
      const books_1 = ['Design Patterns']
      const books_2 = ['Rápido e Devagar']
      const books_3 = [['Rápido e Devagar']]

      const expected = [...books_1, ...books_2, ...[...books_3]]

      const result = si.merge(books_1, books_2, books_3)

      expect(result).toStrictEqual(expected)
    })

    it('should merge two arrays when exists nested array with object', () => {
      const books_1 = ['Design Patterns']
      const books_2 = ['Rápido e Devagar']
      const books_3 = [[{ book: 'Rápido e Devagar' }]] as any

      const expected = [...books_1, ...books_2, ...[...books_3]]

      const result = si.merge(books_1, books_2, books_3)

      expect(result).toStrictEqual(expected)
    })

    it('should merge three arrays', () => {
      const books_1 = ['Design Patterns']
      const books_2 = ['Rápido e Devagar']
      const books_3 = ['Sapiens']

      const expected = [...books_1, ...books_2, ...books_3]

      const result = si.merge(books_1, books_2, books_3)
      console.log('result', result)
      expect(result).toStrictEqual(expected)
    })

    it('should throw Error when marge different types ex: 5', () => {
      const books_1 = ['Design Patterns']
      const books_2 = { name: 'Rápido e Devagar' } as any

      expect(() => si.merge(books_1, books_2)).toThrowError(
        'Cannot merge these types, because they are different types',
      )
    })

    it('should throw Error when marge different types ex: 6', () => {
      const books_1 = ['Design Patterns']
      const books_2 = { name: 'Rápido e Devagar' } as any
      const books_3 = { name: 'Programador Pragmático' } as any

      expect(() => si.merge(books_1, books_2, books_3)).toThrowError(
        'Cannot merge these types, because they are different types',
      )
    })

    it('should throw Error when marge different types ex: 7', () => {
      const books_1 = { name: 'Rápido e Devagar' }
      const books_2 = { name: 'Sapiens' }
      const books_3 = ['Programador Pragmático']

      expect(() => si.merge(books_1, books_2, books_3)).toThrowError(
        'Cannot merge these types, because they are different types',
      )
    })

    it('should not change value of array resultant', () => {
      const books_1 = ['Design Patterns']
      const books_2 = ['Rápido e Devagar']
      const books_3 = ['Sapiens']

      const result = si.merge(books_1, books_2, books_3)

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

    it('Should return a new Object', () => {
      const baseState = {
        name: 'caique',
        address: {
          street: 'Rua X',
          number: 6,
        },
        phone: {
          fixo: ['0000-0000', '1111-1111'],
          mobile: ['9999-9999', 99998888],
        },
        hobbies: new Map([
          ['video game', ['crash', 'carros', new Map([['map', 'test']])]],
        ]),
        brothers: new Set(['caique', 'thomas', 'isabella', 'igor']),
        greeting() {
          return this.name
        },
      }

      const clone = si.produce(baseState)
      expect(clone).toStrictEqual(baseState)
    })
  })

  describe('Test suit about draftState', () => {
    it('should return a clone object with properties changed', () => {
      const user = { name: 'caique' }

      const result = si.produce(user, (draftState) => {
        draftState.name = 'thomas'
      })

      expect(result).toHaveProperty('name', 'thomas')
    })
  })

  describe('Test suit about states', () => {
    it('should return false when baseState and produceState are different ex: 4', () => {
      const state_1 = ['caique']
      const state_2 = { user: 'caique' } as any

      expect(() => si.produce(state_1, state_2)).toThrowError(
        'Cannot merge these types, because they are different types',
      )
    })

    it('should return false when states are different ex: 1', () => {
      const state_1 = ['caique']
      const state_2 = ['thomas']
      const state_3 = { user: 'caique' } as any

      expect(() => si.merge(state_1, state_2, state_3)).toThrowError(
        'Cannot merge these types, because they are different types',
      )
    })

    it('should return false when states are different ex: 2', () => {
      const state_1 = { name: 'caique' }
      const state_2 = { age: 29 } as any
      const state_3 = ['Sapiens'] as any

      expect(() => si.merge(state_1, state_2, state_3)).toThrowError(
        'Cannot merge these types, because they are different types',
      )
    })

    it('should return false when states are different ex: 3', () => {
      const state_1 = { name: 'caique' }
      const state_2 = { age: 29 } as any
      const state_3 = { category: 'programmer' } as any
      const state_4 = { category: 'programmer' } as any
      const state_5 = ['Rápido e Devagar'] as any

      expect(() =>
        si.merge(state_1, state_2, state_3, state_4, state_5),
      ).toThrowError(
        'Cannot merge these types, because they are different types',
      )
    })
  })

  describe('Test suit about producePromise', () => {
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
        draftState.name = 'thomas'
      })

      expect(result).toBeInstanceOf(Promise)

      const resolved = await result
      expect(resolved).toStrictEqual({ name: 'thomas' })
    })

    it('should resolve when promise is Rejected', async () => {
      const promise = Promise.reject('Promise Rejected')

      const result = si.produce(promise)

      expect(result).toBeInstanceOf(Promise)

      await expect(result).resolves.toThrow()
    })
  })

  describe('Test suite about class and prototypes', () => {
    it('should to hold the prototype inherit', () => {
      class User {
        public name: string
        constructor(name: string) {
          this.name = name
        }

        greeting() {
          return `hello, my name is ${this.name}`
        }
      }

      class Player extends User {
        public game: string
        constructor(name: string, game: string) {
          super(name)
          this.game = game
        }

        playing() {
          return `Im playing ${this.game}`
        }
      }

      const player = new Player('caique', 'RDR2')

      const clone = si.produce(player)

      expect(Object.getPrototypeOf(clone)).toBeInstanceOf(User)
      expect(clone).toBeInstanceOf(Player)
    })
  })
})
