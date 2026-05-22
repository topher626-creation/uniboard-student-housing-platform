import Report from '../models/Report.js';
export declare class ReportService {
    createReport(data: any): Promise<Report>;
    getOpenReports(): Promise<Report[]>;
    resolveReport(reportId: string): Promise<Report>;
}
declare const _default: ReportService;
export default _default;
//# sourceMappingURL=reportService.d.ts.map