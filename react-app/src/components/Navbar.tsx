import React from 'react';
import "./Navbar.css";
import logo from "../assets/BlogNest.png";
import {Link} from 'react-router-dom';

function Navbar(){
    return(
        <div>
        <nav id="navbar" className="navbar navbar-expand-lg p-0 fixed-top">
            <div className="container">
            <Link to='/' className="navbar-brand"><img id="logo" width="50px" height="50px" src={logo} />BlogNest</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                <li className="nav-item" id="blogs-button" role="presentation"><Link to='/' className="nav-link">Blogs</Link></li>
                <li className="nav-item" id="create-button" role="presentation"><Link to='/create' className="nav-link">Create</Link></li>
                </ul>
            </div>
            </div>
        </nav>
        </div>
    )
}

export default Navbar;