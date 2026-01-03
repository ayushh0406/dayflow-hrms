import { Router } from 'express';
import { CompanyController } from './company.controller';
import { authenticate, authorize } from '../../shared/middlewares';
import { upload } from '../../shared/middlewares/upload';

const router = Router();
const companyController = new CompanyController();

// Get company details (all authenticated users)
router.get('/', authenticate, companyController.getCompany);

// Create company (Admin only - typically during signup)
router.post('/', authenticate, authorize('ADMIN'), upload.single('logo'), companyController.createCompany);

// Update company (Admin only)
router.put('/', authenticate, authorize('ADMIN'), upload.single('logo'), companyController.updateCompany);

// Delete company (Admin only - for testing)
router.delete('/', authenticate, authorize('ADMIN'), companyController.deleteCompany);

export default router;
