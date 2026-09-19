import './AuthPage.css'
import Auth from '../../components/auth/Auth'
import { useLocation } from 'react-router-dom'

function AuthPage() {
    const navigate = useLocation()
    const loginPage = navigate.pathname == "/auth/1"

    return (
        <section className='auth-section-wrapper'>
            <div className='auth-hero-section'>

                <h1 className='none-user-select'>{loginPage ? "Pick Up Where You Left Off" : "Build Your Ideal Workspace"}</h1>
                <div className='auth-hero-title-devider'></div>
                <h2 className='none-user-select'>{loginPage ? "Access your workspace, sync your active tasks, and stay on track." : "Organize your projects, streamline your workflow, and conquer your daily goals."}</h2>
                <p className='none-user-select'>{loginPage ? "Sign in to sync your progress and clear your daily queue." : "Create your free account today to start capturing tasks and boosting your output."}</p>

                <div className='auth-hero-features'>
                    <div className='feature-pill'>✓ Real-time Sync</div>
                    <div className='feature-pill'>✓ Priority Queue</div>
                    <div className='feature-pill'>✓ Task Analytics</div>
                </div>

                <div className='auth-hero-card'>
                    <div className='card-dot-wrapper'>
                        <div className='card-dot red'></div>
                        <div className='card-dot yellow'></div>
                        <div className='card-dot green'></div>
                    </div>
                    <div className='card-preview-line first_1'></div>
                    <div className='card-preview-line second_1'></div>
                    <div className='card-preview-line fourth_1'></div>
                    <div className='card-preview-line second_2'></div>
                    <div className='card-preview-line fourth_2'></div>
                    <div className='card-preview-line third'></div>
                    <div className='card-preview-line second_3'></div>
                    <div className='card-preview-line first_2'></div>
                </div>
            </div>
            <Auth/>
        </section>
    )
}

export default AuthPage