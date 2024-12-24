export default class NotValidEnumValue extends Error {
  constructor (value: string) {
    super(`Value ${value} is not a valid enum value`)
  }
}
