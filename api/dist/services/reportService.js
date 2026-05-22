import Report from '../models/Report.js';
import { AppError } from '../middleware/errorHandler.js';
export class ReportService {
    async createReport(data) {
        if (!data.type || !data.message) {
            throw new AppError(400, 'Report type and message are required');
        }
        return Report.create({
            type: data.type,
            listingUrl: data.listingUrl,
            message: data.message,
            contactEmail: data.isAnonymous ? undefined : data.contactEmail,
            isAnonymous: Boolean(data.isAnonymous),
            status: 'open',
        });
    }
    async getOpenReports() {
        return Report.findAll({
            where: { status: 'open' },
            order: [['createdAt', 'ASC']],
        });
    }
    async resolveReport(reportId) {
        const report = await Report.findByPk(reportId);
        if (!report) {
            throw new AppError(404, 'Report not found');
        }
        await report.update({ status: 'resolved' });
        return report;
    }
}
export default new ReportService();
//# sourceMappingURL=reportService.js.map