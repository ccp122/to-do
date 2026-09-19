import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { StuffContext } from './../../context/StuffContext'
import { getLocalStorageItem } from './../../utility/LocalStorage'
import './UserPage.css'

interface UserProfile {
    username: string
    email: string
    avatar_color: string
}

const UserPage: React.FC = () => {
    const { signedIn, setSignedIn } = useContext(StuffContext)
    const localUser = getLocalStorageItem("user")
    const navigate = useNavigate()

    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)

    useEffect(() => {
        if (!signedIn || !localUser?.id) {
            setLoading(false)
            return
        }

        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/users/${localUser.id}`)
                setProfile(res.data)
            } catch (err) {
                console.error("Failed to load profile:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchUserProfile()
    }, [signedIn, localUser?.id])

    const handleLogout = () => {
        localStorage.removeItem("user")
        if (setSignedIn) {
            setSignedIn(false)
        }
        navigate('/login')
    }

    const handleDeleteAccount = async () => {
        if (!localUser?.id) return

        try {
            await axios.delete(`http://localhost:5000/api/users/${localUser.id}`)
            localStorage.removeItem("user")
            if (setSignedIn) {
                setSignedIn(false)
            }
            navigate('/signup')
        } catch (err) {
            console.error("Failed to delete account:", err)
        }
    }

    if (!signedIn) {
        return (
            <section className='user-page-section'>
                <div className='user-page-not-signed-in'>
                    To view this content you need to be signed in.
                </div>
            </section>
        )
    }

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading user profile...</div>
    }

    const username = profile?.username || localUser?.username || 'User'
    const avatarColor = profile?.avatar_color || localUser?.avatar_color || '#cccccc'
    const initial = username.charAt(0).toUpperCase()

    return (
        <section className='user-page-section'>
            <div className='user-page-header'>
                <div style={{ backgroundColor: avatarColor }}>
                    {initial}
                </div>
                <h2>{username}</h2>
            </div>

            <hr className='user-page-devider'/>

            <div className='user-email-used-wrapper'>
                <span>Email address used: </span>
                <span>
                    {profile?.email || localUser?.email || 'No email provided'}
                </span>
            </div>

            <div className='user-page-button-wrapper'>
                <button onClick={handleLogout}>
                    Log Out
                </button>
                <button onClick={() => setDeleteModalOpen(true)}>
                    Delete Account
                </button>
            </div>

            {deleteModalOpen && (
                <div className='user-page-delete-confirmation-wrapper'>
                    <div>
                        <h3>Delete Account?</h3>
                        <p>Are you sure you want to permanently delete your account? This action cannot be undone.</p>
                        <div>
                            <button onClick={() => setDeleteModalOpen(false)}>
                                Cancel
                            </button>
                            <button onClick={handleDeleteAccount}>
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div> 
            )} 
        </section>
    )
}

export default UserPage