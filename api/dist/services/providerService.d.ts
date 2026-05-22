import Provider from '../models/Provider.js';
export declare class ProviderService {
    createProvider(userId: string, data: any): Promise<Provider>;
    getProviderById(id: string): Promise<Provider>;
    getProviderByUserId(userId: string): Promise<Provider>;
    updateProvider(id: string, userId: string, data: any): Promise<Provider>;
    getApprovedProviders(): Promise<Provider[]>;
}
declare const _default: ProviderService;
export default _default;
//# sourceMappingURL=providerService.d.ts.map