export function convertEnum<T extends object>(target: T, value: string):T[keyof T] {
    return (target as any)[value]
}