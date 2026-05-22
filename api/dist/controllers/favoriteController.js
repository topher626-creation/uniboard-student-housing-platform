import favoriteService from '../services/favoriteService.js';
import { AppError } from '../middleware/errorHandler.js';
export class FavoriteController {
    async add(req, res, next) {
        try {
            if (!req.userId)
                throw new AppError(401, 'Unauthorized');
            const favorite = await favoriteService.addFavorite(req.userId, req.params.propertyId);
            res.status(201).json(favorite);
        }
        catch (error) {
            next(error);
        }
    }
    async remove(req, res, next) {
        try {
            if (!req.userId)
                throw new AppError(401, 'Unauthorized');
            await favoriteService.removeFavorite(req.userId, req.params.propertyId);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            if (!req.userId)
                throw new AppError(401, 'Unauthorized');
            const favorites = await favoriteService.getFavorites(req.userId);
            res.status(200).json(favorites);
        }
        catch (error) {
            next(error);
        }
    }
}
export default new FavoriteController();
//# sourceMappingURL=favoriteController.js.map