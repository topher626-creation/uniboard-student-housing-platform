import reportService from '../services/reportService.js';
export class ReportController {
    async create(req, res, next) {
        try {
            const report = await reportService.createReport(req.body);
            res.status(201).json(report);
        }
        catch (error) {
            next(error);
        }
    }
}
export default new ReportController();
//# sourceMappingURL=reportController.js.map