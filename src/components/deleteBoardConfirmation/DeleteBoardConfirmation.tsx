import { useState, type Dispatch, type SetStateAction } from 'react'
import axios from 'axios'
import './DeleteBoardConfirmation.css'

interface Board {
    id: number
    title: string
}

interface DeleteBoardProps {
    board: Board
    setDeleteConfirmationVis: Dispatch<SetStateAction<boolean>>
    onBoardDeleted: (deletedBoardId: number) => void
}

export function DeleteBoardConfirmation({ board, setDeleteConfirmationVis, onBoardDeleted }: DeleteBoardProps) {
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await axios.delete(`http://localhost:5000/api/boards/${board.id}`)
            onBoardDeleted(board.id)
            setDeleteConfirmationVis(false)
        } catch (err: any) {
            setErrorMessage(err.response?.data?.error || "Failed to delete board")
            setIsDeleting(false)
        }
    }

    return (
        <div className='board-confirmation-box-wrapper'>
            <h1>Are you sure you want to delete "{board.title}"?</h1>
            {errorMessage && <p className='board-confirmation-error'>{errorMessage}</p>}
            
            <div className="delete-actions">
                <button onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete"}
                </button>
                <button onClick={() => setDeleteConfirmationVis(false)}>Cancel</button>
            </div>
        </div>
    )
}