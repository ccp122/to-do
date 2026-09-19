import jwt from 'jsonwebtoken'

export const protectRoute = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "Access Denied. No authorization token provided." })
        }

        const token = authHeader.split(' ')[1]

        const secret = process.env.JWT_SECRET
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in environment variables.")
        }

        const decodedPayload = jwt.verify(token, secret)

        req.user = decodedPayload
        next()
    } catch (err) {
        console.error(err)
        return res.status(403).json({ error: "Invalid or expired token. Authentication failed." })
    }
}

