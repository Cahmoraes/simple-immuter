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

    it('Should return a cloned Object', () => {
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

    it('should clone an Array', () => {
      const baseArray = ['hello', 'world']

      const nextState = si.produce(baseArray, (draftState) => {
        draftState.push('new key')
      })

      expect(nextState).toBeInstanceOf(Array)
      expect(nextState).toHaveLength(3)
      expect(nextState).not.toEqual(baseArray)
      expect(Object.isFrozen(nextState)).toBeTruthy()
      expect(() => ((nextState[0] as any) = 'invalid')).toThrow()
    })

    it('should clone an Array with objects', () => {
      const baseArray = [
        {
          _name: 'Caique',
          get name() {
            return this._name
          },
          set name(newName: string) {
            this._name = newName
          },
        },
        {
          _name: 'Thomas',
          get name() {
            return this._name
          },
          set name(newName: string) {
            this._name = newName
          },
        },
      ]

      const nextState = si.produce(baseArray, (draftState) => {
        draftState[0].name = 'Igor'
        draftState[1].name = 'Isabella'
      })

      expect(Object.isFrozen(nextState[0])).toBeTruthy()
      expect(Object.isFrozen(nextState[1])).toBeTruthy()

      expect(baseArray[0]).toHaveProperty('name', 'Caique')
      expect(nextState[0]).toHaveProperty('name', 'Igor')

      expect(baseArray[1]).toHaveProperty('name', 'Thomas')
      expect(nextState[1]).toHaveProperty('name', 'Isabella')

      expect(Object.getOwnPropertyNames(nextState)).toEqual(
        Object.getOwnPropertyNames(baseArray),
      )
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

    it('should replace baseState with initialState when producer function return a value', () => {
      const initialState = {
        name: 'cahmoraes',
        age: 28,
      }

      const expandedResult = {
        ...initialState,
        name: 'thomasmoraes',
      }

      const clone = si.produce(expandedResult, () => initialState)

      expect(clone).toStrictEqual(initialState)
    })

    it('should replace baseState with initialState when producer function return a value AND not freeze result', () => {
      const initialState = {
        name: 'cahmoraes',
        age: 28,
        address: {
          city: 'London',
          street: 'Baker Street',
        },
      }

      const expandedResult = {
        ...initialState,
        name: 'thomasmoraes',
      }

      const clone = si.produce(expandedResult, () => initialState, {
        freeze: false,
      })

      expect(clone).toStrictEqual(initialState)
      expect(Object.isFrozen(clone)).toBeFalsy()
      expect(Object.isFrozen(clone.address)).toBeFalsy()
    })

    it('Should return a deep dive cloned Object and NOT freeze nextState', () => {
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

      const clone = si.produce(
        baseState,
        (draftState) => {
          draftState.hobbies.set('new key', ['new value'])
        },
        { freeze: false },
      )

      expect(Object.isFrozen(clone.hobbies)).toBeFalsy()

      const newMapKey = 'new key 1'
      clone.hobbies.set(newMapKey, ['new value 2'])

      expect(clone.hobbies.has(newMapKey)).toBeTruthy()
      expect(clone).not.toStrictEqual(baseState)
    })
  })

  describe('Test suit about draftState', () => {
    it('should return a clone object with properties changed', () => {
      const user = {
        name: 'caique',
        address: { street: 'Baker', city: 'London' },
      }

      const result = si.produce(user, (draftState) => {
        draftState.name = 'thomas'
        draftState.address.city = 'Paris'
      })

      expect(user).not.toHaveProperty('age')
      expect(result).toHaveProperty('name', 'thomas')
      expect(Object.isFrozen(result)).toBeTruthy()
      expect(Object.isFrozen(result.address)).toBeTruthy()
    })

    it('should return a clone object with properties changed AND config producer with property freeze equals true', () => {
      const user = {
        name: 'caique',
        address: { street: 'Baker', city: 'London' },
      }

      const result = si.produce(
        user,
        (draftState) => {
          draftState.name = 'thomas'
          draftState.address.city = 'Paris'
        },
        {
          freeze: true,
        },
      )

      expect(user).not.toHaveProperty('age')
      expect(result).toHaveProperty('name', 'thomas')
      expect(Object.isFrozen(result)).toBeTruthy()
      expect(Object.isFrozen(result.address)).toBeTruthy()
    })

    it('should return a clone object with properties changed and not frozen', () => {
      const user = {
        name: 'caique',
        address: { street: 'Baker', city: 'London' },
      }

      const result = si.produce(
        user,
        (draftState) => {
          draftState.name = 'thomas'
          draftState.address.city = 'Paris'
        },
        { freeze: false },
      )

      expect(user).not.toHaveProperty('age')
      expect(result).toHaveProperty('name', 'thomas')
      expect(Object.isFrozen(result)).toBeFalsy()
      expect(Object.isFrozen(result.address)).toBeFalsy()
    })

    it('should return a clone of object Date with properties changed', () => {
      const date = new Date()

      const cloneDate = si.produce(date, (draftState) => {
        draftState.setFullYear(1993)
      })

      expect(Object.isFrozen(cloneDate)).toBeTruthy()
      expect(cloneDate.getFullYear() === date.getFullYear()).toBeFalsy()
      expect(cloneDate.getFullYear()).not.toBe(date.getFullYear())
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
