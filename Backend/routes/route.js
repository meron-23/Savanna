import express from 'express';
import { addProspect, deleteProspect, getProspect, putProspect, bulkAddProspects } from '../Controllers/prospectController.js';
import { addUser, deleteUser, getUser, loginUser, putUser } from '../Controllers/userController.js';

const router = express.Router();

// Prospect Routes
router.post('/prospects', addProspect);
router.get('/prospects', getProspect);
router.put('/prospects/:id', putProspect);
router.delete('/prospects/:id', deleteProspect);
router.post('/bulk', bulkAddProspects);


// User Routes
router.post('/users', addUser);
router.post("/users/login", loginUser);
router.get('/users', getUser);
router.put('/users/:id', putUser);
router.delete('/users/:id', deleteUser);


export default router;