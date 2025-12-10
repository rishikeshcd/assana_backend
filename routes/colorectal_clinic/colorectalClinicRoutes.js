import express from 'express';
import analFissureRoutes from './analFissureRoutes.js';
import analFistulaRoutes from './analFistulaRoutes.js';
import pilesRoutes from './pilesRoutes.js';
import pelvicFloorRoutes from './pelvicFloorRoutes.js';
import bandingPilesRoutes from './bandingPilesRoutes.js';
import colorectalSymptomsRoutes from './colorectalSymptomsRoutes.js';
import colonRectalCancerRoutes from './colonRectalCancerRoutes.js';
import laserSurgeryRoutes from './laserSurgeryRoutes.js';
import analWoundCareRoutes from './analWoundCareRoutes.js';

const router = express.Router();

// Mount all colorectal clinic routes
router.use('/anal-fissure', analFissureRoutes);
router.use('/anal-fistula', analFistulaRoutes);
router.use('/piles', pilesRoutes);
router.use('/pelvic-floor', pelvicFloorRoutes);
router.use('/banding-piles', bandingPilesRoutes);
router.use('/colorectal-symptoms', colorectalSymptomsRoutes);
router.use('/colon-rectal-cancer', colonRectalCancerRoutes);
router.use('/laser-surgery', laserSurgeryRoutes);
router.use('/anal-wound-care', analWoundCareRoutes);

export default router;

