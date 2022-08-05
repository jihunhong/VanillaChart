"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const isAuthenticated = (req, res, next) => {
    if (req.user) {
        next();
    }
    else {
        res.status(401).send('You must login first');
    }
};
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=index.js.map