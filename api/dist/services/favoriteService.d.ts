import Favorite from '../models/Favorite.js';
export declare class FavoriteService {
    addFavorite(studentId: string, propertyId: string): Promise<Favorite>;
    removeFavorite(studentId: string, propertyId: string): Promise<void>;
    getFavorites(studentId: string): Promise<Favorite[]>;
}
declare const _default: FavoriteService;
export default _default;
//# sourceMappingURL=favoriteService.d.ts.map