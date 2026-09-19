import { db } from '../config/db.js'
import bcrypt from 'bcrypt'

const AVATAR_COLORS = [
    '#ff5f56', '#ffbd2e', '#27c93f', '#5b55ce', 
    '#e84118', '#00a8ff', '#9c88ff', '#fbc531'
];

export const getAllUsers = async (req, res) => {
    try {
        const query = 'SELECT id, username, email, admin, created_at FROM users'
        const result = await db.query(query)

        res.status(200).json(result.rows)
    } catch (err) {
        console.error('Error fatching users: ', err)
        res.status(500).json({ error: 'Failed to retrieve users' })
    }
}

export const registerUser = async (req, res) => {
    const usernameSpecialCharRegex = /[^a-zA-Z0-9 _]/
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const repeatedLetterRegex = /([a-zA-Z])\1{2,}/
    const specialCharRegex = /[^a-zA-Z0-9]/
    const doubleSpecialCharRegex = /[^a-zA-Z0-9].*[^a-zA-Z0-9]/
    const numberRegex = /\d/
    const lowercaseRegex = /[a-z]/
    const uppercaseRegex = /[A-Z]/
    const { username, email, password } = req.body
    const cleanUsername = username.trim().replace(/\s/g, "_")
    const cleanEmail = email.trim().replace(/\s/g, "")
    const cleanPassword = password.trim().replace(/\s/g, "")

    if (cleanUsername.length < 3 || cleanUsername.length > 12 || usernameSpecialCharRegex.test(username)) {
        return res.status(400).json({ error: "Username input is not valid."})
    } else if (cleanEmail.length < 6 || cleanEmail.length > 64 || !emailRegex.test(cleanEmail)) {
        return res.status(400).json({ error: "Email input is not valid."})
    } else if (cleanPassword.length < 8 || cleanPassword.length > 44 || repeatedLetterRegex.test(cleanPassword) || !specialCharRegex.test(cleanPassword) || !doubleSpecialCharRegex.test(cleanPassword) || !numberRegex.test(cleanPassword) || !lowercaseRegex.test(cleanPassword) || !uppercaseRegex.test(cleanPassword)) {
        return res.status(400).json({ error: "Password input is not valid."})
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
    const theUsername = username
    const theEmail = email
    const thePassword = hashedPassword

    try {
        const query = `
            INSERT INTO users (username, email, password, avatar_color)
            VALUES ($1, $2, $3, $4)
            RETURNING id, username, email, avatar_color
        `
        const result = await db.query(query, [theUsername, theEmail, thePassword, randomColor])
        res.status(201).json(result.rows[0])
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: "Email already exists." })
        }
        res.status(500).json({ error: "Server error"})
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." })
    }

    const cleanEmail = email.trim().toLowerCase()

    try {
        const userQuery = 'SELECT * FROM users WHERE email = $1'
        const result = await db.query(userQuery, [cleanEmail])

        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Invalid email or password." })
        }

        const user = result.rows[0]

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid email or password." })
        }

        const { password: _, ...userWithoutPassword } = user

        return res.status(200).json({
            message: "Login successful",
            user: userWithoutPassword
        })

    } catch (err) {
        console.error("Error logging in: ", err)
        return res.status(500).json({ error: "Server error during authentication." })
    }
}