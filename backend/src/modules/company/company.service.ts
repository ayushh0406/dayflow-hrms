import prisma from '../../shared/config/database';
import { AppError } from '../../shared/middlewares';

export interface CreateCompanyDto {
    name: string;
    logo?: string;
}

export interface UpdateCompanyDto {
    name?: string;
    logo?: string;
}

export class CompanyService {
    // Create company (during admin signup)
    async createCompany(data: CreateCompanyDto): Promise<any> {
        try {
            // Check if company with same name already exists
            const existingCompany = await prisma.company.findFirst({
                where: {
                    name: data.name
                }
            });
            if (existingCompany) {
                throw new AppError('Company with this name already exists', 400);
            }

            const company = await prisma.company.create({
                data: {
                    name: data.name,
                    logo: data.logo,
                },
            });

            return company;
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error('Error creating company:', error);
            throw new AppError(`Failed to create company: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
        }
    }

    // Get company by name
    async getCompanyByName(name: string): Promise<any> {
        try {
            const company = await prisma.company.findFirst({
                where: {
                    name: name
                }
            });

            return company;
        } catch (error) {
            throw new AppError('Failed to fetch company', 500);
        }
    }

    // Get company details
    async getCompany(): Promise<any> {
        try {
            const company = await prisma.company.findFirst();

            if (!company) {
                throw new AppError('Company not found', 404);
            }

            return company;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to fetch company details', 500);
        }
    }

    // Update company (Admin only)
    async updateCompany(data: UpdateCompanyDto): Promise<any> {
        try {
            const company = await prisma.company.findFirst();

            if (!company) {
                throw new AppError('Company not found. Please create company first.', 404);
            }

            const updatedCompany = await prisma.company.update({
                where: { id: company.id },
                data: {
                    ...(data.name && { name: data.name }),
                    ...(data.logo !== undefined && { logo: data.logo }),
                },
            });

            return updatedCompany;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to update company', 500);
        }
    }

    // Delete company (Admin only - for testing)
    async deleteCompany(): Promise<void> {
        try {
            const company = await prisma.company.findFirst();

            if (!company) {
                throw new AppError('Company not found', 404);
            }

            await prisma.company.delete({
                where: { id: company.id },
            });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to delete company', 500);
        }
    }
}

export default new CompanyService();
