import { Vehicle } from './vehicle.entity';
export declare class Supplier {
    id: string;
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    licenseNumber: string;
    status: string;
    vehicles: Vehicle[];
    createdAt: Date;
}
