"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeUserContent = exports.getSocialData = void 0;
const socialDataService_1 = require("../services/socialDataService");
/**
 * Get social data for a specific Twitter handle
 */
const getSocialData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { handle } = req.params;
        if (!handle) {
            res.status(400).json({ error: 'Twitter handle is required' });
            return;
        }
        const data = yield (0, socialDataService_1.fetchTwitterData)(handle);
        res.status(200).json(data);
    }
    catch (error) {
        console.error('Error fetching social data:', error);
        res.status(500).json({ error: 'Failed to fetch social data' });
    }
});
exports.getSocialData = getSocialData;
/**
 * Generate a summary of user content
 */
const summarizeUserContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { handle } = req.body;
        if (!handle) {
            res.status(400).json({ error: 'Twitter handle is required' });
            return;
        }
        const summary = yield (0, socialDataService_1.generateSummary)(handle);
        res.status(200).json(summary);
    }
    catch (error) {
        console.error('Error generating summary:', error);
        res.status(500).json({ error: 'Failed to generate summary' });
    }
});
exports.summarizeUserContent = summarizeUserContent;
