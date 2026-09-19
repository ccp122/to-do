import './MainPage.css'
import Button from '../../components/button/Button'
import { useContext } from 'react'
import { StuffContext } from './../../context/StuffContext'
import Auth from '../../components/auth/Auth'

function MainPage() {
    const { signedIn } = useContext(StuffContext)



    return (
        <>
            <section className='main-page-section'>
                <div className='hero-glow-effect'></div>
                <div className={signedIn ? "main-page-hero-signed-in main-page-hero" : "main-page-hero"}>
                    <h1 className='none-user-select capitalize'>Get Things Done</h1>
                    <h2 className='none-user-select'>Organize tasks, track progress, and conquer your goals effortlessly.</h2>
                    {signedIn ? null : (
                        <>
                            <p className='none-user-select'>Sign up to get started</p>
                            <Button textProp="Get Started Free"/>
                        </>
                    )}
                </div>
                <div className="hero-divider-line"></div>
                {signedIn ? (
                    <div className='signed-in-main-page'>
                        <h2 className='capitalize'>Start organizing your day</h2>
                        <Button textProp="Go to dashboard"/>
                    </div>
                ) : (
                    <Auth/>
                )}
                
            </section>
        </>
    )
}

export default MainPage