import { db } from '../config/db.js'

export const getUserBoards = async (req, res) => {
    const { userId } = req.params
    try {
        const result = await db.query('SELECT * FROM boards WHERE user_id = $1 ORDER BY created_at ASC', [userId])
        res.status(200).json(result.rows)
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch boards" })
    }
}

export const createBoard = async (req, res) => {
    const { userId, title } = req.body
    if (!title || !userId) return res.status(400).json({ error: "Title and userId are required" })

    try {
        const countCheck = await db.query('SELECT COUNT(*) FROM boards WHERE user_id = $1', [userId])
        if (parseInt(countCheck.rows[0].count) >= 5) {
            return res.status(400).json({ error: "Board limit reached. Maximum 5 boards allowed." })
        }

        const result = await db.query(
            'INSERT INTO boards (user_id, title) VALUES ($1, $2) RETURNING *',
            [userId, title.trim().replace(/\s+/g, '_')]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: "Failed to create board" })
    }
}

export const deleteBoard = async (req, res) => {
    const { id } = req.params
    try {
        await db.query('DELETE FROM boards WHERE id = $1', [id])
        res.status(200).json({ message: "Board deleted successfully" })
    } catch (err) {
        res.status(500).json({ error: "Failed to delete board" })
    }
}

export const getFullBoardData = async (req, res) => {
    const { boardId } = req.params
    try {
        const colsResult = await db.query('SELECT * FROM columns WHERE board_id = $1 ORDER BY position ASC, id ASC', [boardId])
        const columns = colsResult.rows

        for (let col of columns) {
            const tasksResult = await db.query('SELECT * FROM tasks WHERE column_id = $1 ORDER BY position ASC, id ASC', [col.id])
            col.tasks = tasksResult.rows
        }

        res.status(200).json(columns)
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch board details" })
    }
}

export const createColumn = async (req, res) => {
    const { boardId, title } = req.body
    if (!title || !boardId) return res.status(400).json({ error: "Title and boardId are required" })

    try {
        const result = await db.query(
            'INSERT INTO columns (board_id, title) VALUES ($1, $2) RETURNING *',
            [boardId, title]
        )
        const newCol = result.rows[0]
        newCol.tasks = []
        res.status(201).json(newCol)
    } catch (err) {
        res.status(500).json({ error: "Failed to create column" })
    }
}

export const deleteColumn = async (req, res) => {
    const { id } = req.params
    try {
        await db.query('DELETE FROM columns WHERE id = $1', [id])
        res.status(200).json({ message: "Column deleted successfully" })
    } catch (err) {
        res.status(500).json({ error: "Failed to delete column" })
    }
}

export const createTask = async (req, res) => {
    const { columnId, title, description } = req.body
    if (!title || !columnId) return res.status(400).json({ error: "Title and columnId are required" })

    try {
        const result = await db.query(
            'INSERT INTO tasks (column_id, title, description) VALUES ($1, $2, $3) RETURNING *',
            [columnId, title, description || null]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: "Failed to create task" })
    }
}

export const deleteTask = async (req, res) => {
    const { id } = req.params
    try {
        await db.query('DELETE FROM tasks WHERE id = $1', [id])
        res.status(200).json({ message: "Task deleted successfully" })
    } catch (err) {
        res.status(500).json({ error: "Failed to delete task" })
    }
}

export const moveTask = async (req, res) => {
    const { taskId, targetColumnId } = req.body
    try {
        await db.query(
            'UPDATE tasks SET column_id = $1 WHERE id = $2',
            [targetColumnId, taskId]
        )
        res.status(200).json({ message: "Task moved successfully" })
    } catch (err) {
        res.status(500).json({ error: "Failed to move task" })
    }
}