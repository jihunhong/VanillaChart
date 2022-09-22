"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.get('/google/login', passport_1.default.authenticate('google', {
    accessType: 'offline',
    prompt: 'consent',
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/youtube.force-ssl',
        'https://www.googleapis.com/auth/youtubepartner'
    ],
}));
router.get('/google/callback', passport_1.default.authenticate('google', {
    successRedirect: 'http://localhost:3000/login/success',
    failureMessage: 'Cannot login to Google, please try again later',
    failureRedirect: 'http://localhost:3000/login/error'
}), (req, res) => {
    console.log('User: ', req.user);
    res.send('Thank you for siginning in');
});
exports.default = router;
//# sourceMappingURL=oauth-routes.js.map