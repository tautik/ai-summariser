"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socialDataRoutes = void 0;
const express_1 = require("express");
const socialDataController_1 = require("../controllers/socialDataController");
const router = (0, express_1.Router)();
// Get social data for a specific Twitter handle
router.get('/twitter/:handle', socialDataController_1.getSocialData);
// Generate a summary of user content
router.post('/summarize', socialDataController_1.summarizeUserContent);
exports.socialDataRoutes = router;
