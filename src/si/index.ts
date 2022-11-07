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

  const freeze = <T>(object: T) => Object.freeze(object)

  const freezeDeep = (elementToFreeze: any): any => {
    switch (typeCheck(elementToFreeze)) {
      case 'object':
        return pipe(
          createObjectFromEntries,
          setPrototypeOf(getPrototypeOf(elementToFreeze)),
          freeze,
        )(
          getKeysAndSymbolsFromObject(elementToFreeze).map((key) => [
            key,
            freezeDeep(elementToFreeze[key]),
          ]),
        )
      case 'array':
        return freeze(elementToFreeze.map(freezeDeep))
      case 'set':
        return immuterSet(elementToFreeze)
      case 'map': {
        const freezedMap = new Map()
        elementToFreeze.forEach((value: unknown, key: unknown) => {
          freezedMap.set(key, freezeDeep(value))
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
        return freezeDeep(resolvedState)
      }

      if (isFunction(producer)) {
        producer(resolvedState)
        return freezeDeep(resolvedState)
      }
    } catch (error: any) {
      return new Error(error)
    }
  }

  type BaseStateType<T> = T | Promise<T>

  type ProducerType<T> = (draft: T) => void

  type ProduceProps = <T>(
    baseState: BaseStateType<T>,
    producer?: ProducerType<T>,
  ) => any

  const produce: ProduceProps = <T>(
    baseState: BaseStateType<T>,
    producer?: ProducerType<T>,
  ) => {
    if (isPromise(baseState)) {
      return producePromise(baseState, producer)
    }

    const clonedBaseState = cloneDeep(baseState)

    if (isUndefined(producer)) {
      return freezeDeep(clonedBaseState)
    }

    if (isFunction(producer)) {
      producer(clonedBaseState)
      return freezeDeep(clonedBaseState)
    }

    throw new Error(errors.get(3))
  }

  const cloneArray = (elementToClone: unknown[]): unknown[] =>
    elementToClone.map(cloneDeep)

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
        cloneDeep(elementToClone[key]),
      ]),
    )
  }

  const cloneMap = <K, V>(elementToClone: Map<K, V>) => {
    const clonedMap = new Map()
    elementToClone.forEach((value, key) => {
      clonedMap.set(key, cloneDeep(value))
    })
    return clonedMap
  }

  const cloneSet = <T>(elementToClone: Set<T>): Set<unknown> => {
    const clonedSet = new Set()
    elementToClone.forEach((value) => clonedSet.add(cloneDeep(value)))
    return clonedSet
  }

  const cloneDeep = (element: any): any => {
    switch (typeCheck(element)) {
      case 'object':
        return cloneObject(element)
      case 'array':
        return cloneArray(element)
      case 'map':
        return cloneMap(element)
      case 'set':
        return cloneSet(element)
      default:
        return element
    }
  }

  type MergeProps = <T, K extends object[]>(
    baseState: BaseStateType<T>,
    ...states: K
  ) => T & K

  const merge: MergeProps = (baseState, ...states) => {
    const clonedBaseState = cloneDeep(baseState)

    if (isArray(clonedBaseState) && arrayEveryArray(states)) {
      return freezeDeep([...clonedBaseState, ...flat(states, 1)])
    }

    if (isObject(baseState) && arrayEveryObject(states)) {
      return freezeDeep(Object.assign(clonedBaseState, ...states))
    }

    throw new Error(errors.get(3))
  }

  return {
    produce,
    merge,
  }
})()
