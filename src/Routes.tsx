import MainPage from "./pages/mainPage/MainPage";
import AuthPage from "./pages/authPage/AuthPage";
import Dashboard from './pages/dashboard/Dashboard'
import UserPage from "./pages/userPage/UserPage";
import { Route, Routes } from "react-router-dom";
import Header from './components/header/Header'
import Footer from './components/footer/Footer'

function AppRoutes() {
    return (
        <>
            <Header/>
                <Routes>
                    <Route path="/" element={<MainPage/>}></Route>
                    <Route path="/auth/1" element={<AuthPage/>}></Route>
                    <Route path="/auth/2" element={<AuthPage/>}></Route>
                    <Route path="/dashboard" element={<Dashboard/>}></Route>
                    <Route path="/user" element={<UserPage/>}></Route>
                </Routes>
            <Footer/>
        </>
    )
}

export default AppRoutes