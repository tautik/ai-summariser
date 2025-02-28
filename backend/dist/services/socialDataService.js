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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSummary = exports.fetchTwitterData = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SOCIAL_DATA_API_KEY = process.env.SOCIAL_DATA_API_KEY || '2315|FcPglN4lMDKYHFVglhpS5nr6m8ynOtE02oDP5K18407e911d';
const SOCIAL_DATA_BASE_URL = 'https://api.socialdata.tools/v1';
// Create axios instance with default config
const socialDataApi = axios_1.default.create({
    baseURL: SOCIAL_DATA_BASE_URL,
    headers: {
        'Authorization': `Bearer ${SOCIAL_DATA_API_KEY}`,
        'Content-Type': 'application/json',
    }
});
/**
 * Fetch Twitter data for a specific handle
 */
const fetchTwitterData = (handle) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get user profile
        const profileResponse = yield socialDataApi.get(`/twitter/users/by/username/${handle}`);
        const userId = profileResponse.data.data.id;
        // Get user tweets
        const tweetsResponse = yield socialDataApi.get(`/twitter/users/${userId}/tweets`, {
            params: {
                max_results: 10,
            }
        });
        // Get user following
        const followingResponse = yield socialDataApi.get(`/twitter/users/${userId}/following`, {
            params: {
                max_results: 10,
            }
        });
        return {
            profile: profileResponse.data,
            tweets: tweetsResponse.data,
            following: followingResponse.data
        };
    }
    catch (error) {
        console.error('Error fetching Twitter data:', error);
        throw new Error('Failed to fetch Twitter data');
    }
});
exports.fetchTwitterData = fetchTwitterData;
/**
 * Generate a summary of user content
 */
const generateSummary = (handle) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, exports.fetchTwitterData)(handle);
        // Extract tweets text
        const tweets = data.tweets.data || [];
        const tweetTexts = tweets.map((tweet) => tweet.text).join('\n\n');
        // Extract following users
        const following = data.following.data || [];
        const followingNames = following.map((user) => user.name).join(', ');
        // Create a simple summary
        const summary = {
            profile: data.profile.data,
            tweetSummary: `${handle} has posted ${tweets.length} recent tweets.`,
            tweetContent: tweetTexts,
            followingSummary: `${handle} follows ${following.length} accounts including: ${followingNames}`,
        };
        return summary;
    }
    catch (error) {
        console.error('Error generating summary:', error);
        throw new Error('Failed to generate summary');
    }
});
exports.generateSummary = generateSummary;
