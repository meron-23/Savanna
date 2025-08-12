import express from 'express';
import { addProspect, bulkAddProspects, deleteProspect, fetchProspectsWithAgents, getProspect, putProspect } from '../Controllers/prospectController.js';
import { addUser, deleteUser, fetchUserById, getUser, loginUser, logoutUser, putUser, verifyToken,} from '../Controllers/userController.js';
import {getSupervisorAgents,
  getDashboardStats,
  registerAgent} from '../Controllers/supervisorController.js';
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
// router.get('/users', getUser);
router.get('/users', getUser);
router.get('/users/:id', fetchUserById)
router.put('/users/:id', putUser);
router.delete('/users/:id', deleteUser);
router.get('/verify-token', verifyToken);
router.post('/users/logout', logoutUser);

//visit routes
router.post("/visits", addVisit);
router.get("/visits", getVisits);
router.get('/visits-with-prospects-and-agents', fetchVisitsWithProspectsAndAgents);
router.put("/visits/:visitId", putVisit);
router.delete("/visits/:visitId", deleteVisitRecord);

// Supervisor-specific Routes
router.get('/:supervisorId/dashboard', getDashboardStats);
router.get('/:supervisorId/agents', getSupervisorAgents);
router.post('/:supervisorId/register', registerAgent); // Register new agents under a supervisor


router.post("/leads", createLeadController);

router.get("/full-details", getFullLeadDetailsController);

// Get all leads
router.get("/allLeads", getAllLeadsController);

// Get lead by ID
router.get("leads/:id", getLeadByIdController);

// Get leads by prospect ID
router.get("/leads/:prospectId", getLeadsByProspectIdController);

// Get leads with prospect info (joined data)
router.get("/leads/with-prospect/info", getLeadsWithProspectInfoController);

// Update lead details
router.put("/leads/:id", updateLeadController);

// Update lead status only
router.patch("/leads/:id/status", updateLeadStatusController);

// Delete a lead
router.delete("leads/:id", deleteLeadController);

export default router;