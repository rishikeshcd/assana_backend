import express from 'express';
import gutBrainAxisRoutes from './gutBrainAxisRoutes.js';

const router = express.Router();

// Mount individual route files
router.use('/gut-brain-axis', gutBrainAxisRoutes);

// Add more routes here as they are created:
// router.use('/colon-hydrotherapy', colonHydrotherapyRoutes);
// router.use('/wellness-programmes', wellnessProgrammesRoutes);
// router.use('/assana-butt-check', assanaButtCheckRoutes);
// router.use('/new-mom-program', newMomProgramRoutes);
// router.use('/menopause-program', menopauseProgramRoutes);
// router.use('/senior-citizens-programme', seniorCitizensProgrammeRoutes);

export default router;

