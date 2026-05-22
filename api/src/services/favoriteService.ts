import Favorite from '../models/Favorite.js';
import { AppError } from '../middleware/errorHandler.js';

export class FavoriteService {
  async addFavorite(studentId: string, propertyId: string) {
    try {
      const favorite = await Favorite.create({ studentId, propertyId });
      return favorite;
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new AppError(400, 'Already favorited');
      }
      throw error;
    }
  }

  async removeFavorite(studentId: string, propertyId: string) {
    const result = await Favorite.destroy({
      where: { studentId, propertyId },
    });

    if (result === 0) {
      throw new AppError(404, 'Favorite not found');
    }
  }

  async getFavorites(studentId: string) {
    return Favorite.findAll({
      where: { studentId },
      order: [['createdAt', 'DESC']],
    });
  }
}

export default new FavoriteService();
