import Property from '../models/Property.js';
import { AppError } from '../middleware/errorHandler.js';
import { Op } from 'sequelize';

export class PropertyService {
  async createProperty(providerId: string, data: any) {
    const property = await Property.create({
      providerId,
      ...data,
    });
    return property;
  }

  async getPropertyById(id: string) {
    const property = await Property.findByPk(id);
    if (!property) {
      throw new AppError(404, 'Property not found');
    }
    await property.increment('views');
    return property;
  }

  async getProperties(filters: any = {}) {
    const where: any = { isApproved: true, isActive: true };

    if (filters.nearestUniversity) where.nearestUniversity = filters.nearestUniversity;
    if (filters.location) where.location = { [Op.like]: `%${filters.location}%` };
    if (filters.bedType) where.bedType = filters.bedType;
    if (filters.genderPreference) where.genderPreference = filters.genderPreference;

    const priceWhere: any = {};
    if (filters.minPrice) {
      const minPrice = Number(filters.minPrice);
      if (!Number.isNaN(minPrice)) priceWhere[Op.gte] = minPrice;
    }
    if (filters.maxPrice) {
      const maxPrice = Number(filters.maxPrice);
      if (!Number.isNaN(maxPrice)) priceWhere[Op.lte] = maxPrice;
    }
    if (Object.keys(priceWhere).length > 0) {
      where.pricePerMonth = priceWhere;
    }

    const limit = Number(filters.limit) || 20;
    const offset = Number(filters.offset) || 0;

    const properties = await Property.findAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return properties;
  }

  async updateProperty(id: string, providerId: string, data: any) {
    const property = await Property.findByPk(id);
    if (!property) {
      throw new AppError(404, 'Property not found');
    }
    if (property.providerId !== providerId) {
      throw new AppError(403, 'Forbidden: Not your property');
    }
    await property.update(data);
    return property;
  }

  async deleteProperty(id: string, providerId: string) {
    const property = await Property.findByPk(id);
    if (!property) {
      throw new AppError(404, 'Property not found');
    }
    if (property.providerId !== providerId) {
      throw new AppError(403, 'Forbidden: Not your property');
    }
    await property.destroy();
  }
}

export default new PropertyService();
