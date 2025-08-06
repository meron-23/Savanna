import express from 'express';
import { addProspect, bulkAddProspects, deleteProspect, getProspect, putProspect } from '../Controllers/prospectController.js';
import { addUser, deleteUser, fetchUserById, getUser, loginUser, putUser,} from '../Controllers/userController.js';
import {getSupervisorAgents,
  getDashboardStats,
  registerAgent} from '../Controllers/supervisorController.js';
import { addVisit, getVisits, putVisit, deleteVisitRecord } from "../Controllers/visitsAndSalesController.js";


const router = express.Router();

// Prospect Routes
router.post('/prospects', addProspect);
router.get('/prospects', getProspect);
router.put('/prospects/:id', putProspect);
router.delete('/prospects/:id', deleteProspect);
router.post('/bulk', bulkAddProspects);


// User Routes
router.post('/users', addUser);
router.post('/users/login', loginUser);
router.get('/users', getUser);
router.get('/users', getUser);
router.get('/users/:id', fetchUserById)
router.put('/users/:id', putUser);
router.delete('/users/:id', deleteUser);

//visit routes
router.post("/visits", addVisit);
router.get("/visits", getVisits);
router.put("/visits/:visitId", putVisit);
router.delete("/visits/:visitId", deleteVisitRecord);

// Supervisor-specific Routes
router.get('/:supervisorId/dashboard', getDashboardStats);
router.get('/:supervisorId/agents', getSupervisorAgents);
router.post('/:supervisorId/register', registerAgent); // Register new agents under a supervisor



export default router;