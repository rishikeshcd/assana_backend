import express from 'express';
import gutBrainAxisRoutes from './gutBrainAxisRoutes.js';
import colonHydrotherapyRoutes from './colonHydrotherapyRoutes.js';
import assanaButtCheckRoutes from './assanaButtCheckRoutes.js';
import newMomProgramRoutes from './newMomProgramRoutes.js';

const router = express.Router();

// Mount individual route files
router.use('/gut-brain-axis', gutBrainAxisRoutes);
router.use('/colon-hydrotherapy', colonHydrotherapyRoutes);
router.use('/assana-butt-check', assanaButtCheckRoutes);
router.use('/new-mom-program', newMomProgramRoutes);

// Add more routes here as they are created:
// router.use('/wellness-programmes', wellnessProgrammesRoutes);
// router.use('/new-mom-program', newMomProgramRoutes);
// router.use('/menopause-program', menopauseProgramRoutes);
// router.use('/senior-citizens-programme', seniorCitizensProgrammeRoutes);

export default router;

