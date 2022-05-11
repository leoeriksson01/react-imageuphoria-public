import React, { useRef, useState } from 'react'
import {  Form, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import "../styles/LoginPageStyle.scss"
import { useAuthContext } from '../contexts/AuthContext'

const LoginPage = () => {
    const { login } = useAuthContext()
	const emailRef = useRef()
	const passwordRef = useRef()
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError(null);

        try {
			setLoading(true)
			await login(emailRef.current.value, passwordRef.current.value)
			navigate('/')

		} catch (e) {
			setError(e.message)
			setLoading(false)
		}
	}

	return (
    <div className="loginContainer"> 
    <div className="logInText"> <h2> Log In</h2></div>

							{error && (<Alert variant="danger">{error}</Alert>)}

							<Form onSubmit={handleSubmit}>

								<Form.Group id="email" className="mb-3">
									<Form.Label>Email</Form.Label>
									<Form.Control type="email" ref={emailRef} required />
								</Form.Group>

								<Form.Group id="password" className="mb-3">
									<Form.Label>Password</Form.Label>
									<Form.Control type="password" ref={passwordRef} required />
								</Form.Group>

								<Button className="authButton" disabled={loading} type="submit">Log In</Button>
							</Form>

							
						
					

					<div className="text-center mt-3">
						Need an account? <Link to="/signup">Sign Up</Link>
					</div>
				
			
                    </div>
	)
}

export default LoginPage