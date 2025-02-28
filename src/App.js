import React, { useState, useEffect } from 'react';
import './App.css';
import gsap from 'gsap';

import axios from 'axios';

const API_URL = 'http://localhost:5000';

const handleSignup = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, { username, email, password });
        alert('Signup Successful');
        console.log(response.data);
    } catch (error) {
        console.error('Signup Error:', error.response.data.message);
        alert(error.response.data.message);
    }
};

const handleLogin = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        alert('Login Successful');
        console.log(response.data);
    } catch (error) {
        console.error('Login Error:', error.response.data.message);
        alert(error.response.data.message);
    }
};





function App() {
    const [isSignup, setIsSignup] = useState(false);
    const [signupData, setSignupData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    const handleSignupChange = (e) => {
        setSignupData({ ...signupData, [e.target.name]: e.target.value });
    };

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        await handleSignup(signupData.username, signupData.email, signupData.password);
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        await handleLogin(loginData.email, loginData.password);
    };


    useEffect(() => {
        gsap.to(".shape", {
            left: isSignup ? "50%" : "0%",
            borderTopLeftRadius: isSignup ? "300px" : "0px",
            borderBottomLeftRadius: isSignup ? "300px" : "0px",
            borderTopRightRadius: isSignup ? "0px" : "300px",
            borderBottomRightRadius: isSignup ? "0px" : "300px",
            duration: 0.5,
           
            ease: "power2.inOut"
           
        });
    }, [isSignup]);

    return (
        <div className={`container ${isSignup ? 'signup' : ''}`}>

            <div className="shape">
               
                <p className="toggle" onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? "Don't have an account? Sign up":'Already have an account? Login'}
            </p>
            </div>

            <div className="forms">
                
            {/* Login Form */}
            <form className="form login" onSubmit={handleLoginSubmit}>
                <h2>Login</h2>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    value={loginData.email}
                    onChange={handleLoginChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    value={loginData.password}
                    onChange={handleLoginChange}
                />
                <button type="submit">Login</button>
            </form>

                
                {/* Signup Form */}
            <form className="form signup" onSubmit={handleSignupSubmit}>
                <h2>Sign Up</h2>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    required
                    value={signupData.username}
                    onChange={handleSignupChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    value={signupData.email}
                    onChange={handleSignupChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    value={signupData.password}
                    onChange={handleSignupChange}
                />
                <button type="submit">Sign Up</button>
            </form>
            </div>
            
        </div>
    );
}
export default App;
