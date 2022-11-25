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

    it('should return an immutable copy', () => {
      const user = {
        name: 'cahmoraes',
        age: 28,
        books: ['Sapiens', 'Rápido e Devagar'],
      }

      const clone = si.produce(user)

      expect(Object.isFrozen(clone)).toBeTruthy()
    })

    it('should not change value of object resultant', () => {
      const user_1 = {
        name: 'cahmoraes',
      }

      const result: any = si.produce(user_1)

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

    it('should preserve prototype inheritance', () => {
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

  describe('Test suit about draftState', () => {
    it('should return a clone object with properties changed', () => {
      const user = { name: 'caique' }

      const result = si.produce(user, (draftState) => {
        draftState.name = 'thomas'
      })

      expect(user).not.toHaveProperty('age')
      expect(result).toHaveProperty('name', 'thomas')
    })

    it('should return a clone object with nested properties changed', () => {
      const user = {
        name: 'caique',
        age: 29,
        address: {
          street: 'Baker',
          city: 'London',
        },
        hobbiesSet: new Set(['books', 'sports']),
        hooks: ['book', 'car'],
      }

      const result = si.produce(user, (draftState) => {
        draftState.name = 'thomas'
        draftState.age = 20
        draftState.address.city = 'Constantinopla'
        draftState.address.street = 'Rua X'
        draftState.hobbiesSet.add('games')
        draftState.hobbiesSet.delete('sports')
      })

      expect(user).toHaveProperty('age', 29)
      expect(user.hobbiesSet.has('sports')).toBeTruthy()

      expect(result).toHaveProperty('age', 20)
      expect(result).toHaveProperty('name', 'thomas')
      expect(result.hobbiesSet.has('games')).toBeTruthy()
      expect(result.hobbiesSet.has('sports')).not.toBeTruthy()
    })

    it('should throw an Erro when draftState is not a function', () => {
      const notFunction: any = []

      expect(() => si.produce({ name: 'caique' }, notFunction)).toThrow(
        'Cannot merge these types, because they are different types',
      )
    })
  })

  describe('Test suit about freezeDeep', () => {
    it('should return a deep freeze clone from object', () => {
      const user = {
        name: 'cahmoraes',
        age: 28,
        books: ['Sapiens', 'Rápido e Devagar'],
      }

      const result = si.freezeDeep(user)
      expect(Object.isFrozen(result.books)).toBeTruthy()

      expect(Object.isFrozen(result)).toBeTruthy()
      expect(result).not.toBe(user)
    })

    it('should return a deep freeze clone from Map', () => {
      const map = new Map([
        ['name', 'caique'],
        ['age', '29'],
      ])

      const result = si.freezeDeep(map)

      expect(Object.isFrozen(result)).toBeTruthy()
      expect(result.get('name')).toBe('caique')
    })

    it('should return a deep freeze clone from Set', () => {
      const set = new Set(['name', 'caique'])

      const result = si.freezeDeep(set)

      expect(Object.isFrozen(result)).toBeTruthy()
    })
  })

  describe('Test suit about cloneDeep', () => {
    it('should return a deep clone from object', () => {
      const user = {
        name: 'cahmoraes',
        age: 28,
        books: ['Sapiens', 'Rápido e Devagar'],
      }

      const result = si.cloneDeep(user)
      result.name = 'thomas'
      result.books.push('Arquitetura Limpa')

      expect(Object.isFrozen(result)).toBeFalsy()
      expect(result).not.toBe(user)
      expect(result).toHaveProperty('name', 'thomas')
      expect(result.books[2]).toBe('Arquitetura Limpa')

      expect(user).toHaveProperty('name', 'cahmoraes')
    })

    it('should clone getters and setters properties', () => {
      const obj = {
        get name() {
          return 'Caique'
        },
      }

      const cloned = si.cloneDeep(obj)

      expect(Object.getOwnPropertyDescriptor(obj, 'name')).toStrictEqual(
        Object.getOwnPropertyDescriptor(cloned, 'name'),
      )
    })

    it('should clone an object with setter and getter', () => {
      const proto = { randomProperty: 'anAnyProto' }
      const original = Object.create(proto, {
        prop: {
          get() {
            return this._prop
          },
          set(newProp: string) {
            this._prop = newProp
          },
        },
      })

      const cloned = si.cloneDeep(original)

      expect(Object.getPrototypeOf(original)).toBe(
        Object.getPrototypeOf(cloned),
      )

      expect(Object.getOwnPropertyDescriptors(original)).toStrictEqual(
        Object.getOwnPropertyDescriptors(cloned),
      )
    })

    it('should clone an object with complex descriptor', () => {
      const proto = { randomProperty: 'anAnyProto' }
      const original = Object.create(proto, {
        prop: {
          value: 'any value',
          configurable: false,
          writable: true,
          enumerable: false,
        },
      })

      const cloned = si.cloneDeep(original)

      expect(Object.getPrototypeOf(original)).toBe(
        Object.getPrototypeOf(cloned),
      )

      const originalDescriptors = Object.getOwnPropertyDescriptors(original)
      const cloneDescriptors = Object.getOwnPropertyDescriptors(cloned)

      expect(cloneDescriptors).toStrictEqual(originalDescriptors)

      expect(cloneDescriptors.prop.enumerable).toBe(
        originalDescriptors.prop.enumerable,
      )

      expect(cloneDescriptors.prop.writable).toBe(
        originalDescriptors.prop.writable,
      )

      expect(cloneDescriptors.prop.configurable).toBe(
        originalDescriptors.prop.configurable,
      )

      expect(cloneDescriptors.prop.value).toBe(originalDescriptors.prop.value)

      expect(cloned).not.toBe(original)
    })

    it('should clone symbols', () => {
      const nameSymbol = Symbol('name')
      const obj = {
        get name() {
          return 'Caique'
        },
        [nameSymbol]: 'nameSymbol',
      }

      const cloned = si.cloneDeep(obj)

      expect(obj).toStrictEqual(cloned)
    })

    it('should clone an object Date', () => {
      const date = new Date()

      const cloneDate = si.cloneDeep(date)
      expect(cloneDate.getFullYear() === date.getFullYear()).toBeTruthy()
      cloneDate.setFullYear(1993)
      expect(cloneDate.getFullYear() === date.getFullYear()).toBeFalsy()
      expect(cloneDate.getFullYear()).not.toBe(date.getFullYear())
    })
  })
})
