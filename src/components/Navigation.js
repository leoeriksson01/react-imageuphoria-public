import { useContext, useEffect, useState } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import "./Navigation.scss";
import { Link, Navigate, useNavigate, NavLink } from "react-router-dom";
import logo from "../assets/logoText.png";
import profileIcon from "../assets/profileIcon.png";
import { useAuthContext } from '../contexts/AuthContext'


function Navigation({totalItems}) {
  const { logout, currentUser } = useAuthContext()
  const navigate = useNavigate()



  const signout = async () => {
    await logout()
    navigate("/")
  }


  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="customNav fixed-top"
      variant="dark"
    >
      <Navbar.Brand href="/" className="navBrand">
        <img
          src={logo}
          width="180"
          height="80"
          className="d-inline-block align-top"
          alt="Logo"
        />
        
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
     
        <Navbar.Collapse id="responsive-navbar-nav">
        <div className="links">
          <Nav>
            <NavLink to="/albums"> Albums </NavLink>
            <NavLink to="/newalbum"> New Album </NavLink>
          </Nav>
        </div>
      </Navbar.Collapse>
      <div className="profileContainer"> 
      <NavDropdown title={
        <div className="profileIcon">
          <img src={profileIcon} height="26" width="26"/>
          
        </div>
      } id="basic-nav-dropdown">
        <p className="loggedInStatus bold"> {currentUser ? currentUser.displayName : "You are not logged in"} </p>
          {currentUser ? "" :  <NavDropdown.Item href="/signup">Create an account</NavDropdown.Item>}
          <NavDropdown.Divider />
          {currentUser ? <NavDropdown.Item onClick={signout}>Log out</NavDropdown.Item> :<NavDropdown.Item href="/login">Sign in</NavDropdown.Item>}
        </NavDropdown>
         </div>
    </Navbar>
  );
}

export default Navigation;
