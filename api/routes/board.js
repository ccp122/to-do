import express from 'express'
import { getUserBoards, createBoard, deleteBoard, getFullBoardData, createColumn, createTask, deleteColumn, deleteTask, moveTask } from '../controllers/board.js'
import { apiLimiter, forgivingApiLimiter } from '../middleware/rateLimiter.js'

const boardRouter = express.Router()

boardRouter.get('/user/:userId', apiLimiter, getUserBoards)
boardRouter.post('/create', apiLimiter, createBoard)
boardRouter.delete('/:id', apiLimiter, deleteBoard)

boardRouter.get('/details/:boardId', apiLimiter, getFullBoardData)
boardRouter.post('/column/create', forgivingApiLimiter, createColumn)
boardRouter.delete('/column/:id', forgivingApiLimiter, deleteColumn)
boardRouter.post('/task/create', forgivingApiLimiter, createTask)
boardRouter.delete('/task/:id', forgivingApiLimiter, deleteTask)
boardRouter.put('/task/move', forgivingApiLimiter, moveTask)

export default boardRouter