import Property from '../models/Property.js';
export declare class PropertyService {
    createProperty(providerId: string, data: any): Promise<Property>;
    getPropertyById(id: string): Promise<Property>;
    getProperties(filters?: any): Promise<Property[]>;
    updateProperty(id: string, providerId: string, data: any): Promise<Property>;
    deleteProperty(id: string, providerId: string): Promise<void>;
}
declare const _default: PropertyService;
export default _default;
//# sourceMappingURL=propertyService.d.ts.map