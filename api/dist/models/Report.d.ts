import { Model, Optional } from 'sequelize';
interface ReportAttributes {
    id: string;
    type: 'fake_listing' | 'scam' | 'misconduct' | 'suspicious_activity';
    listingUrl?: string;
    message: string;
    contactEmail?: string;
    isAnonymous: boolean;
    status: 'open' | 'resolved';
    createdAt: Date;
    updatedAt: Date;
}
interface ReportCreationAttributes extends Optional<ReportAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {
}
export declare class Report extends Model<ReportAttributes, ReportCreationAttributes> implements ReportAttributes {
    id: string;
    type: 'fake_listing' | 'scam' | 'misconduct' | 'suspicious_activity';
    listingUrl?: string;
    message: string;
    contactEmail?: string;
    isAnonymous: boolean;
    status: 'open' | 'resolved';
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Report;
//# sourceMappingURL=Report.d.ts.map