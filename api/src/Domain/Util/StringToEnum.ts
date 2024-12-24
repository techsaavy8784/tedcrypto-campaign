import NotValidEnumValue from './NotValidEnumValue'

export function stringToEnum<T> (value: string, enumObject: T): T {
  return stringToEnumInternal(value, enumObject as any) as T
}

export function tryStringToEnum<T> (value: string, enumType: T): T | undefined {
  try {
    return stringToEnumInternal(value, enumType as any)
  } catch (error: any) {
    if (error instanceof NotValidEnumValue) {
      return undefined
    }

    throw error
  }
}

/**
 * Type function to properly do the matching
 */
function stringToEnumInternal<T extends Record<string, string>> (value: string, enumObject: T): T[keyof T] | undefined {
  const enumKeys = Object.keys(enumObject)
  const upperCaseValue = value.toUpperCase()
  const matchingKey = enumKeys.find(key => key.toUpperCase() === upperCaseValue)

  if (matchingKey !== undefined) {
    return enumObject[matchingKey as keyof T]
  }

  throw new NotValidEnumValue(`Value ${value} is not a valid enum value`)
}
