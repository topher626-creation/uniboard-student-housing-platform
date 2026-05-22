import { Model, Optional } from 'sequelize';
interface FavoriteAttributes {
    id: string;
    studentId: string;
    propertyId: string;
    createdAt: Date;
    updatedAt: Date;
}
interface FavoriteCreationAttributes extends Optional<FavoriteAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
export declare class Favorite extends Model<FavoriteAttributes, FavoriteCreationAttributes> implements FavoriteAttributes {
    id: string;
    studentId: string;
    propertyId: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Favorite;
//# sourceMappingURL=Favorite.d.ts.map