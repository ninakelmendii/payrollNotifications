export interface Barber{
    id: number,
    firstName: string,
    lastName: string,
    workHours: {
        id: number,
        day: number,
        startHour: number,
        endHour: number,
        lunchTime: {
            startHour: number,
            durationMinutes: number
        }
    }[]
}