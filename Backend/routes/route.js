import express from 'express';
import { addProspect, deleteProspect, getProspect, putProspect } from '../Controllers/prospectController.js';
import { addUser, deleteUser, getUser, putUser } from '../Controllers/userController.js';

const router = express.Router();

// Prospect Routes
router.post('/prospects', addProspect);
router.get('/prospects', getProspect);
router.put('/prospects/:id', putProspect);
router.delete('/prospects/:id', deleteProspect);


// User Routes
router.post('/users', addUser);
router.get('/users', getUser);
router.put('/users/:id', putUser);
router.delete('/users/:id', deleteUser);


export default router;