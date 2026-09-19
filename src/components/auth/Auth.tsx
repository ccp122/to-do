import './Auth.css'
import { validateVariables } from '../../variables/variables'
import { validateUsername, validateEmail, validatePassword } from './../../components/validations/Validations'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useState, useRef, useContext } from 'react'
import { setLocalStorageItem } from '../../utility/LocalStorage'
import { StuffContext } from './../../context/StuffContext'
import Button from '../../components/button/Button'
import axios from 'axios'

interface FormType {
    username?: string,
    email: string,
    password: string
}


function Auth() {
    const { setSignedIn } = useContext(StuffContext)
    const navigate = useNavigate()
    const location = useLocation()
    const mainPage = location.pathname === "/"
    const signUpPage = location.pathname === '/auth/2'
    const logInPage = location.pathname === '/auth/1'
    const usernameHint = useRef<HTMLParagraphElement>(null)
    const emailHint = useRef<HTMLParagraphElement>(null)
    const passwordHint = useRef<HTMLParagraphElement>(null)
    const [usernameCleanValue, setUsernameCleanValue] = useState('') 
    const [errorUsernameMessage, setErrorUsernameMessage] = useState("")
    const [errorEmailMessage, setErrorEmailMessage] = useState("")
    const [errorPasswordMessage, setErrorPasswordMessage] = useState("")
    const [finalErrorMessage, setFinalErrorMessage] = useState("")
    const [formData, setFormData] = useState<FormType>({        
        username: "",
        email: "",
        password: ""
    })

    const handleInputHintVisibility = (element_index: number, operation_index: number) => {
        if (operation_index === 1) {
            if (element_index === 1 && usernameHint.current) {
                usernameHint.current.classList.remove('opacity-0')
            } else if (element_index === 2 && emailHint.current) {
                emailHint.current.classList.remove('opacity-0')
            } else if (element_index === 3 && passwordHint.current) {
                passwordHint.current.classList.remove('opacity-0')
            }
        } else if (operation_index === 2) {
            if (element_index === 1 && usernameHint.current) {
                usernameHint.current.classList.add('opacity-0')
            } else if (element_index === 2 && emailHint.current) {
                emailHint.current.classList.add('opacity-0')
            } else if (element_index === 3 && passwordHint.current) {
                passwordHint.current.classList.add('opacity-0')
            }
        }
    }

    const handleInputChange = (field: keyof FormType, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const checkForms = (index: number, value: string) => {
        if (index === 1) {
            const { status, message, cleanValue } = validateUsername(value)
            if (status == false) {
                setErrorUsernameMessage(message)
                setUsernameCleanValue("")
            } else {
                setErrorUsernameMessage("")
                if (cleanValue) {
                    setUsernameCleanValue(cleanValue)
                }
            }
        } else if (index === 2) {
            const { status, message } = validateEmail(value)
            if (status === false) {
                setErrorEmailMessage(message)
            } else {
                setErrorEmailMessage("")
            }
        } else if (index === 3) {
            const { status, message } = validatePassword(value)
            if (status === false) {
                setErrorPasswordMessage(message)
            } else {
                setErrorPasswordMessage("")
            }
        }
    }

    const finalCheck = () => {
        if (signUpPage || mainPage) {
            if (formData.username === "" || formData.email === "" || formData.password === "") {
                setFinalErrorMessage("Fill out the input fields.")
            } else if (errorUsernameMessage !== "") {
                setFinalErrorMessage("Username input field is not valid.")
            } else if (errorEmailMessage != "") {
                setFinalErrorMessage("Email input field is not valid.")
            } else if (errorPasswordMessage != "") {
                setFinalErrorMessage("Password input field is not valid.")
            } else {
                setFinalErrorMessage("")
                registerUser()
            }
        } else if (logInPage) {
            delete formData.username
            if (formData.email === "" || formData.password === "") {
                setFinalErrorMessage("Fill out the input fields.")
            } else if (errorEmailMessage != "") {
                setFinalErrorMessage("Email input field is not valid.")
            } else if (errorPasswordMessage != "") {
                setFinalErrorMessage("Password input field is not valid.")
            } else {
                setFinalErrorMessage("")
                logInUser()
            }
        }
    }

    const registerUser = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/users/register", formData);

            const userData = response.data?.user || response.data;


            if (userData && typeof userData === 'object' && 'username' in userData) {
                setLocalStorageItem("user", userData);
            }

            setSignedIn(true);
            setLocalStorageItem('token', response.data.token)
            setLocalStorageItem("signedIn", true);
            navigate("/dashboard");
        } catch (error: any) {
            if (error.response?.data?.error) {
                setFinalErrorMessage(error.response.data.error);
            } else {
                setFinalErrorMessage("Unable to connect to the server");
            }
        }
    };

    const logInUser = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/users/login", formData)
            setFinalErrorMessage("")
            setFormData({ email: "", password: ""})
            const userData = response.data?.user || response.data
            if (userData) {
                setLocalStorageItem("user", userData)
            }
            setLocalStorageItem('token', response.data.token)
            setSignedIn(true)
            setLocalStorageItem("signedIn", true)
            navigate("/dashboard")
        } catch (error: any) {
            if (error.response?.data?.error) {
                setFinalErrorMessage(error.response.data.error);
            } else {
                setFinalErrorMessage("Unable to connect to the server")
            }
        }
    }
    
    
    return (
        <div className={mainPage ? "auth-wrapper" : signUpPage ? "auth-wrapper auth-wrapper-auth-page-sign-up" : "auth-wrapper auth-wrapper-auth-page" }>
            <h3 className='none-user-select capitalize'>{signUpPage || mainPage ? "Sign Up" : "log in"}</h3>
            <div className='auth-title-devider'></div>
            <div className='auth-form'>
                {signUpPage || mainPage ? (
                    <>
                        <p className='input_error none-user-select'>{errorUsernameMessage}</p>
                        <input
                            id='username' 
                            type="text" 
                            placeholder='Username'
                            value={formData.username}
                            maxLength={validateVariables.userNameCharMax}
                            minLength={validateVariables.userNameCharMin}
                            onChange={(e) => handleInputChange("username", e.target.value)}
                            onFocus={() => handleInputHintVisibility(1, 1)}
                            onBlur={(e) => {checkForms(1, e.target.value), handleInputHintVisibility(1, 2)}}
                        />
                        <p ref={usernameHint} className='input_hint none-user-select opacity-0'>
                            {usernameCleanValue ? `Username will be saved as "${usernameCleanValue}".` : 'Spaces will be replaced with "_" .'}
                        </p>
                    </>
                ) : (
                    null
                )}
                {signUpPage || mainPage ? (
                    <p className='input_error none-user-select'>{errorEmailMessage}</p>
                ) : null}
                <input 
                    id='email'
                    type="email" 
                    placeholder='Email'
                    value={formData.email}
                    maxLength={validateVariables.userEmailCharMax}
                    minLength={validateVariables.userEmailCharMin}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onFocus={() => signUpPage || mainPage ? handleInputHintVisibility(2, 1) : null}
                    onBlur={(e) => {signUpPage || mainPage ? checkForms(2, e.target.value) : null, signUpPage || mainPage ? handleInputHintVisibility(2, 2) : null}}
                />
                {signUpPage || mainPage ?  (
                    <>
                        <p ref={emailHint} className='input_hint none-user-select opacity-0'>Use regular email syntax.</p>
                        <p className='input_error none-user-select'>{errorPasswordMessage}</p>
                    </>
                ) : null}
                <input 
                    id='password'
                    type="password" 
                    placeholder='Password'
                    value={formData.password}
                    maxLength={validateVariables.userPasswordCharMax}
                    minLength={validateVariables.userPasswordCharMin}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onFocus={() => signUpPage || mainPage ? handleInputHintVisibility(3, 1) : null}
                    onBlur={(e) => {signUpPage || mainPage ? checkForms(3, e.target.value) : null, signUpPage || mainPage ? handleInputHintVisibility(3, 2) : null}}
                    className={logInPage ? "log-in-page-password-specific" : ""}
                />
                {signUpPage || mainPage ? (
                    <p ref={passwordHint} className='input_hint none-user-select opacity-0'>Password can not contain any spaces</p>
                ) : null} 
                <div className='auth-options-wrapper'>
                    {logInPage ? (
                        <>
                            <p>Don't have an account? <Link to='/auth/2'>Sign Up</Link></p>
                        </>
                    ) : (
                        <p className={signUpPage ? "extra-negative-left-margin" : ""}>Already have an account? <Link to='/auth/1'>Log In</Link></p>
                    )}
                </div>
                <p className='input_error none-user-select final-error'>{finalErrorMessage}</p> 
                <Button textProp="Submit" onClick={finalCheck}/>
            </div>
        </div>
    )
}

export default Auth