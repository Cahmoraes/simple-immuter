export default (() => {
  const errors = new Map([
    [1, 'This object has been frozen and should not be mutated'],
    [2, 'baseState and producer are incompatibles'],
    [3, `Cannot merge these types, because they are different types`],
  ])

  const die = (errorNumber: number) => () =>
    console.log(errors.get(errorNumber))

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
        return freeze(createClone(elementToFreeze, freezeDeep))
      case 'date':
        return freeze(cloneDate(elementToFreeze as any)) as Readonly<T>
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

  type CloneType =
    | object
    | Map<unknown, unknown>
    | Set<unknown>
    | unknown[]
    | Date
  type BaseStateType<T> = DraftState<T>
  type DraftState<T> = T & { [key: string]: any }
  type DraftResult<T> = DraftState<T> | void
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
      const producedResult = producer(clonedBaseState)
      if (!producedResult) return freezeDeep(clonedBaseState)
      return freezeDeep(producedResult)
    }

    throw new Error(errors.get(3))
  }

  const createClone = (
    anObject: object,
    strategy: (...args: any) => unknown,
  ) => {
    const descriptors = Object.getOwnPropertyDescriptors(anObject)
    const cloneObj = Object.create(Object.getPrototypeOf(anObject), descriptors)

    for (const descriptor of Reflect.ownKeys(descriptors)) {
      if (!isEligible(descriptor)) continue
      cloneObj[descriptor] = strategy(Reflect.get(anObject, descriptor))
    }

    return cloneObj

    function isEligible(descriptor: string | symbol) {
      return (
        descriptors[String(descriptor)] &&
        Reflect.has(descriptors[String(descriptor)], 'value')
      )
    }
  }

  const cloneArray = <T extends any[]>(elementToClone: T) =>
    elementToClone.map(cloneDeep)

  const cloneObject = <T extends { [key: string | symbol]: any }>(
    elementToClone: T,
  ): T => {
    return createClone(elementToClone, cloneDeep)
  }

  const cloneDate = (aDate: Date): Date => new Date(aDate)

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

  function assertTypeOf<T>(
    anElement: unknown,
    aType: string,
  ): asserts anElement is T {
    if (typeCheck(anElement) !== aType)
      throw new Error(`element is not type of [${aType}]`)
  }

  const cloneDeep = <T extends CloneType>(anElement: T): T => {
    switch (typeCheck(anElement)) {
      case 'object':
        return cloneObject(anElement)
      case 'array':
        assertTypeOf<Array<unknown>>(anElement, 'array')
        return cloneArray(anElement) as T
      case 'map':
        assertTypeOf<Map<unknown, CloneType>>(anElement, 'map')
        return cloneMap(anElement) as T
      case 'set':
        assertTypeOf<Set<CloneType>>(anElement, 'set')
        return cloneSet(anElement) as T
      case 'date':
        assertTypeOf<Date>(anElement, 'date')
        return cloneDate(anElement) as T
      default:
        return anElement
    }
  }

  return {
    produce,
    cloneDeep,
    freezeDeep,
  }
})()
