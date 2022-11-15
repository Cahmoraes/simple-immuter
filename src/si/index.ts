export default (() => {
  const errors = new Map([
    [1, 'This object has been frozen and should not be mutated'],
    [2, 'baseState and producer are incompatibles'],
    [3, `Cannot merge these types, because they are different types`],
  ])

  const die = (errorNumber: number) => () =>
    console.log(errors.get(errorNumber))

  const pipe =
    (...fns: any[]) =>
    (value: any) =>
      fns.reduce((acc, fn) => fn(acc), value)

  const flat = (element: any, depth = Infinity) => {
    if (typeCheck(element) !== 'array') return element
    return depth > 0
      ? element.reduce(
          (flatArray: any[], array: any[]) =>
            flatArray.concat(flat(array, --depth)),
          [],
        )
      : element
  }

  const createObjectFromEntries = (entries: any[]) =>
    Object.fromEntries(entries)

  const getKeysAndSymbolsFromObject = (object: object) =>
    Reflect.ownKeys(object)

  const immuterSet = (setToImmuter: any): Set<any> => {
    setToImmuter.add = die(1)
    setToImmuter.delete = die(1)
    setToImmuter.clear = die(1)
    return setToImmuter
  }

  const immuterMap = (mapToImmuter: any) => {
    mapToImmuter.set = die(1)
    mapToImmuter.delete = die(1)
    mapToImmuter.clear = die(1)
    return mapToImmuter
  }

  const setPrototypeOf = (prototype: object) => (object: object) =>
    Object.setPrototypeOf(object, prototype)

  const getPrototypeOf = <T>(object: T) => Object.getPrototypeOf(object)

  const typeCheck = (elementToCheck: unknown) => {
    const stringType = Reflect.apply(
      Object.prototype.toString,
      elementToCheck,
      [],
    )
    return stringType
      .substring(stringType.indexOf(' ') + 1, stringType.indexOf(']'))
      .toLowerCase()
  }

  const isArray = <T>(state: unknown): state is Array<T> =>
    typeCheck(state) === 'array'

  const isObject = <T>(state: unknown): state is T =>
    typeCheck(state) === 'object'

  const isFunction = (state: unknown): state is (...props: unknown[]) => any =>
    typeCheck(state) === 'function'

  const isPromise = <T>(state: unknown): state is Promise<T> =>
    typeCheck(state) === 'promise'

  const isUndefined = (state: unknown): state is undefined =>
    typeCheck(state) === 'undefined'

  const arrayEveryArray = <T>(states: T[]): states is T[] =>
    states.every(isArray)

  const arrayEveryObject = <T>(states: T[]): states is T[] =>
    states.every(isObject)

  const areAllSameType =
    <T, K>(type: T) =>
    (...objs: K[]): boolean =>
      objs.every((obj) => typeCheck(obj) === type)

  const areAllObjects = areAllSameType('object')

  const areAllArrays = areAllSameType('array')

  const freeze = <T>(object: T) => Object.freeze(object)

  const mergeAllObjectsOrArrays = (
    clonedBaseState: any,
    producer: any,
    states: any[],
  ) => {
    if (areAllObjects(clonedBaseState, producer) && arrayEveryObject(states)) {
      return deepFreeze(Object.assign(clonedBaseState, producer, ...states))
    }

    if (areAllArrays(clonedBaseState, producer) && arrayEveryArray(states)) {
      return deepFreeze([...clonedBaseState, ...producer, ...flat(states, 1)])
    }

    throw new Error(errors.get(3))
  }

  const deepFreeze = <T extends CloneType>(elementToFreeze: T): T => {
    switch (typeCheck(elementToFreeze)) {
      case 'object':
        return pipe(
          createObjectFromEntries,
          setPrototypeOf(getPrototypeOf(elementToFreeze)),
          freeze,
        )(
          getKeysAndSymbolsFromObject(elementToFreeze).map((key) => [
            key,
            deepFreeze((elementToFreeze as any)[key]),
          ]),
        )
      case 'array':
        return freeze((elementToFreeze as any).map(deepFreeze))
      case 'set':
        return immuterSet(elementToFreeze as any) as T
      case 'map': {
        const freezedMap = new Map()
        ;(elementToFreeze as any[]).forEach((value: unknown, key: unknown) => {
          freezedMap.set(key, deepFreeze(value as any))
        })
        return immuterMap(freezedMap)
      }
      default:
        return elementToFreeze
    }
  }

  const producePromise = async (baseState: Promise<any>, producer: any) => {
    try {
      const resolvedState = await baseState
      if (isUndefined(producer)) {
        return deepFreeze(resolvedState)
      }

      if (isFunction(producer)) {
        producer(resolvedState)
        return deepFreeze(resolvedState)
      }
    } catch (error: any) {
      return new Error(error)
    }
  }

  type BaseStateType<T> = T | Promise<T>

  type DraftState<T> = T & { [key: string]: any }

  type ProducerType<T> = ((draftState: DraftState<T>) => any) | object

  type ReturnProduce<T, K extends ProducerType<T> | undefined> = K extends (
    args: any,
  ) => any
    ? T & ReturnType<K>
    : T

  type ProduceProps = <T extends CloneType>(
    baseState: BaseStateType<T>,
    producer?: ProducerType<T>,
    ...states: any[]
  ) => ReturnProduce<T, typeof producer>

  const produce: ProduceProps = <T extends CloneType>(
    baseState: BaseStateType<T>,
    producer?: ProducerType<T>,
    ...states: any[]
  ) => {
    if (isPromise(baseState)) {
      return producePromise(baseState, producer)
    }

    const clonedBaseState = deepClone(baseState)

    if (isUndefined(producer)) {
      return deepFreeze(clonedBaseState)
    }

    if (isFunction(producer)) {
      producer(clonedBaseState)
      return deepFreeze(clonedBaseState)
    }

    if (states.length > 0) {
      return mergeAllObjectsOrArrays(clonedBaseState, producer, states)
    }

    if (areAllObjects(clonedBaseState, producer)) {
      return deepFreeze(Object.assign(clonedBaseState, producer))
    }

    if (areAllArrays(clonedBaseState, producer)) {
      if (Array.isArray(producer) && Array.isArray(clonedBaseState)) {
        return deepFreeze([...clonedBaseState, ...producer])
      }
    }

    throw new Error(errors.get(3))
  }

  const cloneArray = <T extends any[]>(elementToClone: T) =>
    elementToClone.map(deepClone)

  const cloneObject = <T extends { [hey: string | symbol]: any }>(
    elementToClone: T,
  ): T => {
    const prototype = Object.getPrototypeOf(elementToClone)
    return pipe(
      createObjectFromEntries,
      setPrototypeOf(prototype),
    )(
      getKeysAndSymbolsFromObject(elementToClone).map((key) => [
        key,
        deepClone(elementToClone[key]),
      ]),
    )
  }

  const cloneMap = <K, V extends CloneType>(elementToClone: Map<K, V>) => {
    const clonedMap = new Map()
    elementToClone.forEach((value, key) => {
      clonedMap.set(key, deepClone(value))
    })
    return clonedMap
  }

  const cloneSet = <T extends CloneType>(
    elementToClone: Set<T>,
  ): Set<unknown> => {
    const clonedSet = new Set()
    elementToClone.forEach((value) => clonedSet.add(deepClone(value)))
    return clonedSet
  }

  type CloneType = object | Map<any, any> | Set<any> | any[]

  const deepClone = <T extends CloneType>(element: T): T => {
    switch (typeCheck(element)) {
      case 'object':
        return cloneObject(element)
      case 'array':
        return cloneArray(element as any[]) as T
      case 'map':
        return cloneMap(element as Map<any, any>) as T
      case 'set':
        return cloneSet(element as Set<any>) as T
      default:
        return element
    }
  }

  return {
    produce,
    deepClone,
    deepFreeze,
  }
})()
