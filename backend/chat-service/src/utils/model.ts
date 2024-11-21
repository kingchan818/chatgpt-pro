export function stringIncludesWithKeys(str: string, keys: string[]): boolean {
  return keys.some((key) => str.toLowerCase().includes(key.toLowerCase()));
}
