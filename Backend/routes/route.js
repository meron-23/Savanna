// routes.js

import express from 'express';
import { addProspect, bulkAddProspects, deleteProspect, fetchProspectsWithAgents, getProspect, putProspect } from '../Controllers/prospectController.js';
import { addUser, deleteUser, fetchUserById, getUser, loginUser, logoutUser, putUser, verifyToken, googleLogin} from '../Controllers/userController.js';
import {
    getSupervisorAgents,
    getDashboardStats,
    getUnassignedAgentsList, // New import
    assignAgent             // New import
} from '../Controllers/supervisorController.js';
import { addVisit, getVisits, putVisit, deleteVisitRecord, fetchVisitsWithProspectsAndAgents } from "../Controllers/visitsAndSalesController.js";
import { createLeadController, deleteLeadController, getAllLeadsController, getFullLeadDetailsController, getLeadByIdController, getLeadsByProspectIdController, getLeadsWithProspectInfoController, updateLeadController, updateLeadStatusController } from '../Controllers/leadControllers.js';

const router = express.Router();

// Prospect Routes
router.post('/prospects', addProspect);
router.get('/prospects', getProspect);
router.get('/prospects-with-agents', fetchProspectsWithAgents);
router.put('/prospects/:id', putProspect);
router.delete('/prospects/:id', deleteProspect);
router.post('/bulk', bulkAddProspects);

// User Routes
router.post('/users', addUser);
router.post('/users/login', loginUser);
router.post('/users/google-login', googleLogin);
router.get('/users', getUser);
router.get('/users/:id', fetchUserById)
router.put('/users/:id', putUser);
router.delete('/users/:id', deleteUser);
router.get('/verify-token', verifyToken);
router.post('/users/logout', logoutUser);

// Visit Routes
router.post("/visits", addVisit);
router.get("/visits", getVisits);
router.get('/visits-with-prospects-and-agents', fetchVisitsWithProspectsAndAgents);
router.put("/visits/:visitId", putVisit);
router.delete("/visits/:visitId", deleteVisitRecord);

// Supervisor-specific Routes
router.get('/supervisors/:supervisorId/dashboard', getDashboardStats);
router.get('/supervisors/:supervisorId/agents', getSupervisorAgents);
router.get('/supervisors/unassigned-agents', getUnassignedAgentsList); // Route to fetch unassigned agents
router.post('/supervisors/:supervisorId/assign-agent', assignAgent);    // Route to assign an agent

// Lead Routes
router.post("/leads", createLeadController);
router.get("/full-details", getFullLeadDetailsController);
router.get("/allLeads", getAllLeadsController);
router.get("leads/:id", getLeadByIdController);
router.get("/leads/:prospectId", getLeadsByProspectIdController);
router.get("/leads/with-prospect/info", getLeadsWithProspectInfoController);
router.put("/leads/:id", updateLeadController);
router.patch("/leads/:id/status", updateLeadStatusController);
router.delete("leads/:id", deleteLeadController);

export default router;