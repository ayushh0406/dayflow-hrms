import { Request, Response } from 'express';
import companyService, { CreateCompanyDto, UpdateCompanyDto } from './company.service';

export class CompanyController {
    // Create company
    async createCompany(req: Request, res: Response): Promise<void> {
        const data: CreateCompanyDto = req.body;
        const company = await companyService.createCompany(data);
        res.status(201).json({
            success: true,
            message: 'Company created successfully',
            data: company,
        });
    }

    // Get company details
    async getCompany(_req: Request, res: Response): Promise<void> {
        const company = await companyService.getCompany();
        res.status(200).json({
            success: true,
            data: company,
        });
    }

    // Update company
    async updateCompany(req: Request, res: Response): Promise<void> {
        const data: UpdateCompanyDto = req.body;
        const company = await companyService.updateCompany(data);
        res.status(200).json({
            success: true,
            message: 'Company updated successfully',
            data: company,
        });
    }

    // Delete company
    async deleteCompany(_req: Request, res: Response): Promise<void> {
        await companyService.deleteCompany();
        res.status(200).json({
            success: true,
            message: 'Company deleted successfully',
        });
    }
}
