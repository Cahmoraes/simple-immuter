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

  const createObjectFromEntries = (entries: any[]) =>
    Object.fromEntries(entries)

  const getKeysAndSymbolsFromObject = (object: object) =>
    Reflect.ownKeys(object)

  const immuterSet = (setToImmuter: any): Readonly<Set<unknown>> => {
    setToImmuter.add = die(1)
    setToImmuter.delete = die(1)
    setToImmuter.clear = die(1)
    return freeze(setToImmuter)
  }

  const immuterMap = (mapToImmuter: any): Readonly<Map<unknown, unknown>> => {
    mapToImmuter.set = die(1)
    mapToImmuter.delete = die(1)
    mapToImmuter.clear = die(1)
    return freeze(mapToImmuter)
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

  const isFunction = (state: unknown): state is (...props: unknown[]) => any =>
    typeCheck(state) === 'function'

  const isUndefined = (state: unknown): state is undefined =>
    typeCheck(state) === 'undefined'

  const freeze = <T>(object: T) => Object.freeze(object)

  const freezeDeep = <T extends CloneType>(elementToFreeze: T): Readonly<T> => {
    switch (typeCheck(elementToFreeze)) {
      case 'object':
        return pipe(
          createObjectFromEntries,
          setPrototypeOf(getPrototypeOf(elementToFreeze)),
          freeze,
        )(
          getKeysAndSymbolsFromObject(elementToFreeze).map((key) => [
            key,
            freezeDeep((elementToFreeze as any)[key]),
          ]),
        )
      case 'array':
        return freeze((elementToFreeze as any).map(freezeDeep))
      case 'set':
        return immuterSet(elementToFreeze as any) as Readonly<T>
      case 'map': {
        const freezedMap = new Map()
        ;(elementToFreeze as any[]).forEach((value: unknown, key: unknown) => {
          freezedMap.set(key, freezeDeep(value as any))
        })
        return immuterMap(freezedMap) as Readonly<T>
      }
      default:
        return elementToFreeze
    }
  }

  type CloneType = object | Map<unknown, unknown> | Set<unknown> | unknown[]
  type BaseStateType<T> = DraftState<T>
  type DraftState<T> = T
  type DraftResult<T> = Readonly<DraftState<T>> | void
  type ProducerType<T> = (draftState: DraftState<T>) => DraftResult<T>
  type ReturnProduce<
    T,
    K extends ProducerType<T> | undefined,
  > = K extends ProducerType<T> ? T : Readonly<T>

  function produce<T extends CloneType>(
    baseState: BaseStateType<T>,
  ): Readonly<T>
  function produce<T extends CloneType>(
    baseState: BaseStateType<T>,
    producer: ProducerType<T>,
  ): ReturnProduce<Readonly<T>, typeof producer>
  function produce<T extends CloneType>(
    baseState: BaseStateType<T>,
    producer?: ProducerType<T>,
  ): ReturnProduce<Readonly<T>, typeof producer> {
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

  const cloneArray = <T extends any[]>(elementToClone: T) =>
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

  const cloneMap = <K, V extends CloneType>(elementToClone: Map<K, V>) => {
    const clonedMap = new Map()
    elementToClone.forEach((value, key) => {
      clonedMap.set(key, cloneDeep(value))
    })
    return clonedMap
  }

  const cloneSet = <T extends CloneType>(
    elementToClone: Set<T>,
  ): Set<unknown> => {
    const clonedSet = new Set()
    elementToClone.forEach((value) => clonedSet.add(cloneDeep(value)))
    return clonedSet
  }

  const cloneDeep = <T extends CloneType>(element: T): T => {
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
    cloneDeep,
    freezeDeep,
  }
})()
