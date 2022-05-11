import React, { useRef, useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import "../styles/LoginPageStyle.scss"

const SignupPage = () => {
	const emailRef = useRef()
	const nameRef = useRef()
	const passwordRef = useRef()
	const passwordConfirmRef = useRef()
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	const { signup } = useAuthContext()
	const navigate = useNavigate()
	const { setName} = useAuthContext();


	const nameInput = (e) => {
        setName(e.target.value);
      };
	
	

	const handleSubmit = async (e) => {
		e.preventDefault()

		// make sure user has entered the same password in both input fields
		if (passwordRef.current.value !== passwordConfirmRef.current.value) {
			return setError("Passwords do not match")
		}

		setError(null);
		try {
			setLoading(true)
			await signup(emailRef.current.value, passwordRef.current.value)
			

			navigate('/')

		} catch (e) {
			setError(e.message)
			setLoading(false)
		}
	}

	return (
		<div className="loginContainer"> 
		<div className="logInText"> <h2> Sign Up</h2></div>
					

							{error && (<Alert variant="danger">{error}</Alert>)}

							<Form onSubmit={handleSubmit}>

							<Form.Group id="name" className="mb-3">
									<Form.Label>First and Last Name</Form.Label>
									<Form.Control type="name" onChange={nameInput} ref={nameRef} required  />
								</Form.Group>

								<Form.Group id="email" className="mb-3">
									<Form.Label>Email</Form.Label>
									<Form.Control type="email" ref={emailRef} required />
								</Form.Group>

								<Form.Group id="password" className="mb-3">
									<Form.Label>Password</Form.Label>
									<Form.Control type="password" ref={passwordRef} required />
								</Form.Group>

								<Form.Group id="password-confirm" className="mb-3">
									<Form.Label>Password Confirmation</Form.Label>
									<Form.Control type="password" ref={passwordConfirmRef} required />
								</Form.Group>

								<Button className="authButton" disabled={loading} type="submit">Create Account</Button>
							</Form>


					<div className="text-center mt-3">
						Already have an account? <Link to="/login">Log In</Link>
					</div>
			</div>
	)
}

export default SignupPage