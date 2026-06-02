export function resolveDayRange(dateString?: string) {
    const date = dateString ? new Date(dateString) : new Date()

    const start = new Date(date)
    start.setHours(0, 0, 0, 0)

    const end = new Date(start)
    end.setDate(end.getDate() + 1)

    return {start, end}
}