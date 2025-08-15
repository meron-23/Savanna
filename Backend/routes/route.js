import express from 'express';
import { addProspect, bulkAddProspects, deleteProspect, fetchProspectsWithAgents, getProspect, putProspect } from '../Controllers/prospectController.js';
import { addUser, deleteUser, fetchUserById, getUser, loginUser, logoutUser, putUser, verifyToken, googleLogin } from '../Controllers/userController.js';
import { getSupervisorAgents, getDashboardStats, registerAgent } from '../Controllers/supervisorController.js';
import { addVisit, getVisits, putVisit, deleteVisitRecord, fetchVisitsWithProspectsAndAgents } from "../Controllers/visitsAndSalesController.js";
import { createLeadController, deleteLeadController, getAllLeadsController, getFullLeadDetailsController, getLeadByIdController, getLeadsByProspectIdController, getLeadsWithProspectInfoController, updateLeadController, updateLeadStatusController } from '../Controllers/leadControllers.js';
import { requestPasswordReset, resetPassword } from '../Controllers/passwordController.js';

const router = express.Router();

// Authentication Routes
router.post('/users/login', loginUser);
router.post('/google-login', googleLogin);
router.post('/logout', logoutUser);
router.get('/verify-token', verifyToken);

// Password Reset Routes
router.post("/auth/request-password-reset", requestPasswordReset);
router.post("/auth/reset-password", resetPassword);


// User Routes
router.post('/users', addUser);
router.get('/users', getUser);
router.get('/users/:id', fetchUserById);
router.put('/users/:id', putUser);
router.delete('/users/:id', deleteUser);

// Prospect Routes
router.post('/prospects', addProspect);
router.get('/prospects', getProspect);
router.get('/prospects-with-agents', fetchProspectsWithAgents);
router.put('/prospects/:id', putProspect);
router.delete('/prospects/:id', deleteProspect);
router.post('/bulk-prospects', bulkAddProspects);

// Visit Routes
router.post('/visits', addVisit);
router.get('/visits', getVisits);
router.get('/visits-with-prospects-and-agents', fetchVisitsWithProspectsAndAgents);
router.put('/visits/:visitId', putVisit);
router.delete('/visits/:visitId', deleteVisitRecord);

// Lead Routes
router.post('/leads', createLeadController);
router.get('/leads', getAllLeadsController);
router.get('/leads/full-details', getFullLeadDetailsController);
router.get('/leads/:id', getLeadByIdController);
router.get('/leads/prospect/:prospectId', getLeadsByProspectIdController);
router.get('/leads-with-prospect-info', getLeadsWithProspectInfoController);
router.put('/leads/:id', updateLeadController);
router.patch('/leads/:id/status', updateLeadStatusController);
router.delete('/leads/:id', deleteLeadController);

// Supervisor Routes
router.get('/supervisors/:supervisorId/dashboard', getDashboardStats);
router.get('/supervisors/:supervisorId/agents', getSupervisorAgents);
router.post('/supervisors/:supervisorId/register', registerAgent);

export default router;