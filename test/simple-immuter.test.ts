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
      const result = si.produce(map, (draftState) => {
        draftState.set('age', 29)
      })

      expect(result).toBeInstanceOf(Map)
      expect(result.get('age')).toBe(29)
      expect(map.get('age')).toBe(undefined)
      expect(result).not.toStrictEqual(map)
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
        draftState.age = 23
      })

      result.name

      expect(result).toHaveProperty('age')
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
