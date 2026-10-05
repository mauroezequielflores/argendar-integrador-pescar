import { Router } from 'express';
import { getMetrics, getActivityChart, getRecentActivity } from '../controllers/adminDashboardController.js';
import { listUsers, updateUserStatus, deleteUser } from '../controllers/adminUsersController.js';
import { listTransactions } from '../controllers/adminTransactionsController.js';
import { listModeration, updateModerationStatus } from '../controllers/adminModerationController.js';
import { listInquiries, getInquiry, replyInquiry } from '../controllers/adminInquiriesController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  getDashboardMetricsSchema,
  getActivityChartSchema,
  getRecentActivitySchema
} from '../middlewares/schemas/adminDashboardSchemas.js';
import {
  getUsersSchema,
  updateUserStatusSchema,
  deleteUserSchema
} from '../middlewares/schemas/adminUsersSchemas.js';
import { getTransactionsSchema } from '../middlewares/schemas/adminTransactionsSchemas.js';
import { getModerationSchema, updateModerationSchema } from '../middlewares/schemas/adminModerationSchemas.js';
import {
  getInquiriesSchema,
  getInquirySchema,
  replyInquirySchema
} from '../middlewares/schemas/adminInquiriesSchemas.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.use(authMiddleware);
router.use(requireRole(ROLES.ADMIN));

// Dashboard
router.get('/dashboard/metrics', validateRequest(getDashboardMetricsSchema), getMetrics);
router.get('/dashboard/activity-chart', validateRequest(getActivityChartSchema), getActivityChart);
router.get('/dashboard/recent-activity', validateRequest(getRecentActivitySchema), getRecentActivity);

// Usuarios
router.get('/users', validateRequest(getUsersSchema), listUsers);
router.patch('/users/:id/status', validateRequest(updateUserStatusSchema), updateUserStatus);
router.delete('/users/:id', validateRequest(deleteUserSchema), deleteUser);

// Transacciones (solo lectura)
router.get('/transactions', validateRequest(getTransactionsSchema), listTransactions);

// Moderación (entity: requests | offers | reviews | appointments)
router.get('/moderation/:entity', validateRequest(getModerationSchema), listModeration);
router.patch('/moderation/:entity/:id', validateRequest(updateModerationSchema), updateModerationStatus);

// Bandeja de consultas
router.get('/inquiries', validateRequest(getInquiriesSchema), listInquiries);
router.get('/inquiries/:id', validateRequest(getInquirySchema), getInquiry);
router.post('/inquiries/:id/reply', validateRequest(replyInquirySchema), replyInquiry);

export default router;
