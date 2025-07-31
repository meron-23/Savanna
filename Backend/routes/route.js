import express from 'express';
import { addProspect, deleteProspect, getProspect, putProspect } from '../Controllers/prospectController.js';
import { addUser, deleteUser, fetchUserById, getUser, loginUser, putUser } from '../Controllers/userController.js';

const router = express.Router();

// Prospect Routes
router.post('/prospects', addProspect);
router.get('/prospects', getProspect);
router.put('/prospects/:id', putProspect);
router.delete('/prospects/:id', deleteProspect);


// User Routes
router.post('/users', addUser);
router.post("/users/login", loginUser);
router.get('/users', getUser);
router.get('/users', getUser);
router.get('/users/:id', fetchUserById)
router.put('/users/:id', putUser);
router.delete('/users/:id', deleteUser);


export default router;