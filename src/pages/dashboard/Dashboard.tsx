import { useState, useContext, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import './Dashboard.css'
import { generalVariables, validateVariables } from './../../variables/variables'
import { AddBoardConfirmation } from './../../components/addBoardConfirmation/AddBoardConfirmation'
import { DeleteBoardConfirmation } from '../../components/deleteBoardConfirmation/DeleteBoardConfirmation'
import { StuffContext } from '../../context/StuffContext'
import { getLocalStorageItem } from '../../utility/LocalStorage'
import axios from 'axios'

interface Task {
  id: number
  title: string
  description?: string
}

interface Column {
  id: number
  title: string
  tasks: Task[]
}

interface Board {
  id: number
  title: string
}

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [boardConfirmationVis, setBoardConfirmationVis] = useState<boolean>(false)
  const [deleteConfirmationVis, setDeleteConfirmationVis] = useState<boolean>(false)
  const [boardToDelete, setBoardToDelete] = useState<Board | null>(null)
  const { signedIn } = useContext(StuffContext)

  const [openAddTaskColumnId, setOpenAddTaskColumnId] = useState<number | null>(null)
  const [boards, setBoards] = useState<Board[]>([])
  const [activeBoardId, setActiveBoardId] = useState<number | null>(null)
  const [columns, setColumns] = useState<Column[]>([])

  const [newColTitle, setNewColTitle] = useState('')
  const [taskInputs, setTaskInputs] = useState<{ [key: number]: { title: string; desc: string } }>({})

  const user = getLocalStorageItem('user')

  const getAuthHeader = () => {
    const token = getLocalStorageItem('token')
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {}
  }

  const fetchBoards = async () => {
    if (!user?.id) return
    try {
      const res = await axios.get(`http://localhost:5000/api/boards/user/${user.id}`, getAuthHeader())
      const boardData: Board[] = res.data
      setBoards(boardData)

      if (boardData.length > 0) {
        setActiveBoardId((prev) => (prev && boardData.some((b) => b.id === prev) ? prev : boardData[0].id))
      } else {
        setActiveBoardId(null)
      }
    } catch (err) {
      console.error('Error fetching boards:', err)
    }
  }

  const fetchBoardDetails = async (boardId: number) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/boards/details/${boardId}`, getAuthHeader())
      setColumns(res.data)
    } catch (err) {
      console.error('Error fetching board details:', err)
    }
  }

  useEffect(() => {
    if (signedIn) fetchBoards()
  }, [signedIn])

  useEffect(() => {
    if (activeBoardId) {
      fetchBoardDetails(activeBoardId)
    } else {
      setColumns([])
    }
  }, [activeBoardId])

  const handleAddColumn = async () => {
    if (!newColTitle.trim() || !activeBoardId) return
    try {
      await axios.post(
        'http://localhost:5000/api/boards/column/create',
        {
          boardId: activeBoardId,
          title: newColTitle.trim(),
        },
        getAuthHeader()
      )
      setNewColTitle('')
      fetchBoardDetails(activeBoardId)
    } catch (err) {
      console.error('Error adding column:', err)
    }
  }

  const handleDeleteColumn = async (columnId: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/boards/column/${columnId}`, getAuthHeader())
      if (activeBoardId) fetchBoardDetails(activeBoardId)
    } catch (err) {
      console.error('Error deleting column:', err)
    }
  }

  const handleAddTask = async (columnId: number) => {
    const input = taskInputs[columnId]
    if (!input?.title?.trim()) return

    try {
      await axios.post(
        'http://localhost:5000/api/boards/task/create',
        {
          columnId,
          title: input.title.trim(),
          description: input.desc ? input.desc.trim() : '',
        },
        getAuthHeader()
      )
      setTaskInputs((prev) => ({ ...prev, [columnId]: { title: '', desc: '' } }))
      setOpenAddTaskColumnId(null)
      if (activeBoardId) fetchBoardDetails(activeBoardId)
    } catch (err) {
      console.error('Error adding task:', err)
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/boards/task/${taskId}`, getAuthHeader())
      if (activeBoardId) fetchBoardDetails(activeBoardId)
    } catch (err) {
      console.error('Error deleting task:', err)
    }
  }

  const handleOnDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result

    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const sourceColId = Number(source.droppableId)
    const destColId = Number(destination.droppableId)
    const taskId = Number(draggableId)

    const nextColumns = columns.map((col) => {
      if (col.id === sourceColId && sourceColId === destColId) {
        const updatedTasks = [...col.tasks]
        const [movedTask] = updatedTasks.splice(source.index, 1)
        updatedTasks.splice(destination.index, 0, movedTask)
        return { ...col, tasks: updatedTasks }
      }

      if (col.id === sourceColId) {
        const updatedTasks = [...col.tasks]
        updatedTasks.splice(source.index, 1)
        return { ...col, tasks: updatedTasks }
      }

      if (col.id === destColId) {
        const sourceColumn = columns.find((c) => c.id === sourceColId)
        if (!sourceColumn) return col
        const movedTask = sourceColumn.tasks[source.index]
        const updatedTasks = [...col.tasks]
        updatedTasks.splice(destination.index, 0, movedTask)
        return { ...col, tasks: updatedTasks }
      }

      return col
    })

    setColumns(nextColumns)

    try {
      await axios.put(
        'http://localhost:5000/api/boards/task/move',
        {
          taskId,
          targetColumnId: destColId,
        },
        getAuthHeader()
      )
    } catch (err) {
      console.error('Failed to persist task movement:', err)
      if (activeBoardId) fetchBoardDetails(activeBoardId)
    }
  }

  const handleBoardDeleted = (deletedBoardId: number) => {
    const updatedBoards = boards.filter((b) => b.id !== deletedBoardId)
    setBoards(updatedBoards)

    if (activeBoardId === deletedBoardId) {
      setActiveBoardId(updatedBoards.length > 0 ? updatedBoards[0].id : null)
    }
  }

  const triggerDeleteModal = (e: React.MouseEvent, board: Board) => {
    e.stopPropagation()
    setBoardToDelete(board)
    setDeleteConfirmationVis(true)
  }

  return (
    <section className="dashboard-wrapper">
      {signedIn ? (
        <>
          {boardConfirmationVis && (
            <AddBoardConfirmation
              setBoardConfirmationVis={setBoardConfirmationVis}
              onBoardCreated={fetchBoards}
            />
          )}

          {deleteConfirmationVis && boardToDelete && (
            <DeleteBoardConfirmation
              board={boardToDelete}
              setDeleteConfirmationVis={setDeleteConfirmationVis}
              onBoardDeleted={handleBoardDeleted}
            />
          )}

          <aside className={sidebarOpen ? 'open' : ''}>
            <div className="side-bar-top-part">
              <div
                className="side-bar-extender-wrapper user_interactives"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <img
                  className={sidebarOpen ? 'open' : ''}
                  src={generalVariables.rightArrowLogo}
                  alt="toggle"
                />
              </div>
              <div className="add_boards">
                <h2 className="capitalize none-user-select">Boards ({boards.length}/5)</h2>
                {boards.length < 5 && (
                  <div
                    className="plus-wrapper user_interactives"
                    onClick={() => setBoardConfirmationVis(true)}
                  >
                    <img src={generalVariables.plusLogo} alt="add board image" />
                  </div>
                )}
              </div>
            </div>

            <ul className="sidebar-boards-list">
              {boards ? (
                boards.map((b) => (
                  <li
                    key={b.id}
                    className={b.id === activeBoardId ? 'active-board' : 'non-active-board'}
                    onClick={() => setActiveBoardId(b.id)}
                  >
                    <span>{b.title}</span>
                    <img
                      src={generalVariables.trashLogo}
                      alt="trash logo image"
                      className="trash-icon user_interactives"
                      onClick={(e) => triggerDeleteModal(e, b)}
                    />
                  </li>
                ))
              ) : (
                <h1 className="loading-text">Loading...</h1>
              )}
            </ul>
          </aside>

          <main className="dashboard-main-content">
            {activeBoardId ? (
              <div className="board-view">
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <div className="columns-container">
                    {columns.map((col) => (
                      <div key={col.id} className="kanban-column">
                        <div className="kanban-column-top-part">
                          <h3>{col.title}</h3>
                          <img
                            src={generalVariables.trashLogo}
                            alt="delete column"
                            className="trash-icon user_interactives"
                            onClick={() => handleDeleteColumn(col.id)}
                          />
                        </div>

                        <Droppable droppableId={String(col.id)}>
                          {(provided, snapshot) => (
                            <div
                              className={`tasks-list ${
                                snapshot.isDraggingOver ? 'dragging-over' : ''
                              }`}
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {col.tasks.map((task, index) => (
                                <Draggable
                                  key={task.id}
                                  draggableId={String(task.id)}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      className={`task-card ${
                                        snapshot.isDragging ? 'dragging' : ''
                                      }`}
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <div className="task-card-header">
                                        <h4>{task.title}</h4>
                                        <img
                                          src={generalVariables.trashLogo}
                                          alt="delete task"
                                          className="trash-icon user_interactives"
                                          onClick={() => handleDeleteTask(task.id)}
                                        />
                                      </div>
                                      {task.description && <p>{task.description}</p>}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>

                        <div className="add-task-box">
                          {openAddTaskColumnId === col.id ? (
                            <>
                              <input
                                autoFocus
                                type="text"
                                placeholder="Task title"
                                maxLength={validateVariables.taskTitleCharMax}
                                minLength={validateVariables.taskTitleCharMin}
                                value={taskInputs[col.id]?.title || ''}
                                onChange={(e) =>
                                  setTaskInputs((prev) => ({
                                    ...prev,
                                    [col.id]: { ...prev[col.id], title: e.target.value },
                                  }))
                                }
                              />
                              <input
                                type="text"
                                placeholder="Description (optional)"
                                maxLength={validateVariables.descriptionCharMax}
                                minLength={validateVariables.descriptionCharMin}
                                value={taskInputs[col.id]?.desc || ''}
                                onChange={(e) =>
                                  setTaskInputs((prev) => ({
                                    ...prev,
                                    [col.id]: { ...prev[col.id], desc: e.target.value },
                                  }))
                                }
                              />
                              <button onClick={() => handleAddTask(col.id)}>+ Task</button>
                              <button onClick={() => setOpenAddTaskColumnId(null)}>Hide</button>
                            </>
                          ) : (
                            <button onClick={() => setOpenAddTaskColumnId(col.id)}>
                              Add task
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="add-column-box">
                      <input
                        type="text"
                        placeholder="New Column Name"
                        maxLength={validateVariables.columnCharMax}
                        minLength={validateVariables.columnCharMin}
                        value={newColTitle}
                        onChange={(e) => setNewColTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
                      />
                      <button onClick={handleAddColumn}>+ Column</button>
                    </div>
                  </div>
                </DragDropContext>
              </div>
            ) : (
              <div className="no-board-selected">
                <h2>Select or create a board to start.</h2>
              </div>
            )}
          </main>
        </>
      ) : (
        <div className="not-sign-in-wrapper">
          <h1>To use this page you need to be signed in</h1>
        </div>
      )}
    </section>
  )
}

export default Dashboard