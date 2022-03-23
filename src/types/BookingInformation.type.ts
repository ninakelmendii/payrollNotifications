export interface BookingInformation{
    firstName: string,
    lastName: string,
    email: string,
    contactNumber: number,
    serviceId?: number,
    barberId?: number,
    date?: Date,
    time?: string,
    price?: number,
}