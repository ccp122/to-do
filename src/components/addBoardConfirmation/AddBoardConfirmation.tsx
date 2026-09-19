import { useState, type Dispatch, type SetStateAction } from 'react'
import './AddBoardConfirmation.css'
import { validateBoard } from '../validations/Validations'
import { validateVariables } from '../../variables/variables'
import { getLocalStorageItem } from '../../utility/LocalStorage'
import axios from 'axios'

interface BoardConfirmationProps {
    setBoardConfirmationVis: Dispatch<SetStateAction<boolean>>
    onBoardCreated: () => void
}

export function AddBoardConfirmation({ setBoardConfirmationVis, onBoardCreated }: BoardConfirmationProps) {
    const [rawInput, setRawInput] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [boardNameCleanValue, setBoardNameCleanValue] = useState<string>('')

    const validate = (string: string) => {
        setRawInput(string)
        const { status, message, cleanValue } = validateBoard(string)
        if (status === false) {
            setErrorMessage(message)
            setBoardNameCleanValue('')
        } else {
            setErrorMessage('')
            if (cleanValue) setBoardNameCleanValue(cleanValue)
        }
    }

    const handleCreateBoard = async () => {
        if (!boardNameCleanValue || errorMessage) return
        const user = getLocalStorageItem("user")
        if (!user?.id) return

        try {
            await axios.post('http://localhost:5000/api/boards/create', {
                userId: user.id,
                title: boardNameCleanValue
            })
            onBoardCreated()
            setBoardConfirmationVis(false)
        } catch (err: any) {
            setErrorMessage(err.response?.data?.error || "Failed to create board")
        }
    }

    return (
        <div className='board-confirmation-box-wrapper'>
            <h1>Name the board</h1>
            {errorMessage && <p className='board-confirmation-error'>{errorMessage}</p>}
            <input 
                type="text" 
                placeholder='Board Name' 
                value={rawInput}
                onChange={(e) => validate(e.target.value)} 
                maxLength={validateVariables.boardCharMax} 
                minLength={validateVariables.boardCharMin}
            />
            <p className='board-confirmation-hint'>
                {boardNameCleanValue ? `Name: "${boardNameCleanValue}"` : 'Spaces will be converted to "_"'}
            </p>
            <button onClick={handleCreateBoard} disabled={!boardNameCleanValue || !!errorMessage}>
                Create Board
            </button>
            <button onClick={() => setBoardConfirmationVis(false)}>Cancel</button>
        </div>
    )
}
