import { rateLimit } from 'express-rate-limit'

export const apiLimiter = rateLimit({
    windowMs: 20 * 60 * 1000,
    limit: 50,
    message: {
        error: "Too many requests from this ip. Please try again after 20 minutes."
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false
})

export const forgivingApiLimiter = rateLimit({
    windowMs: 20 * 60 * 1000,
    limit: 120,
    message: {
        error: "Too many requests from this ip. Please try again after 20 minutes."
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false
})

export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    message: {
        error: "Too many login or registration attempts. You are locked out for 1 hour."
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false
})