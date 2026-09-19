import './Header.css'
import { generalVariables } from './../../variables/variables'
import { useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import { StuffContext } from '../../context/StuffContext'
import { getLocalStorageItem } from '../../utility/LocalStorage'
import SVG from 'react-inlinesvg'

function Header() {
    const { signedIn } = useContext(StuffContext)
    const navigate = useNavigate()
    const [notificationImageDate, setNotificationImageDate] = useState(Date.now())
    const [userImageDate, setUserImageDate] = useState(Date.now())
    const user = getLocalStorageItem("user")
    const initial = user?.username ? user.username.charAt(0).toLowerCase() : '?'
    const bgColor = user?.avatar_color || '#5b55ce'

    const setNewDate = (index: number) => {
        if (index === 1) {
            setNotificationImageDate(Date.now())
        } else if (index === 2) {
            setUserImageDate(Date.now())
        }
    }

    return (
        <header className='main-header'>
            <div className='header-naming-wrapper cursor_none' onClick={() => navigate("/")}>
                <img draggable="false" src={generalVariables.logoSimple} alt="logo image" className='none-user-select'/>
                <h1 className='none-user-select'>{generalVariables.name}</h1>
            </div>

            <div className='user-side-wrapper'>
                <span className='user-interactives header-notifications-wrapper' onMouseEnter={() => setNewDate(1)}>
                    <SVG src={generalVariables.notificationsLogo} title="notifications image" key={notificationImageDate} className='none-user-select'/>
                </span>

                {signedIn ? (
                    <div 
                        className='user-user-profile-signed-in'
                        style={{ backgroundColor: bgColor }}
                        title={user?.username || ''}
                        onClick={() => navigate('/user')}
                    >
                        {initial}
                    </div>
                ) : (
                    <span className='user-user-profile' onMouseEnter={() => setNewDate(2)} onClick={() => navigate('/user')}>
                        <SVG src={generalVariables.userStaticLogo} title="user image" className='none-user-select' key={userImageDate}/>
                    </span>
                )}

                <span className='user-interactives header-settings-wrapper'>
                    <SVG src={generalVariables.settingsLogo} title="settings image" className='none-user-select'/>
                </span>
            </div>
        </header>
    )
}

export default Header