export function getEnumValues(e: any): string[] {
  return Object.keys(e).map(key => e[key]);
}
