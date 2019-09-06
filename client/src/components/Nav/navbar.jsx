import React, {Component} from 'react';
import {MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon 
} from "mdbreact";
import { BrowserRouter as Router } from 'react-router-dom';


class Navbar extends Component{
    
    state = {
        isOpen : false
    };

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen});
    };
    
    

    render(){
        
        const navbarColor = {
            backgroundColor: '#161c27b5'
        };

        return(
            <Router>
                <MDBNavbar style={navbarColor} dark expand="md">
                <MDBNavbarBrand>
                <strong className="white-text">Navbar</strong>
                </MDBNavbarBrand>
                <MDBNavbarToggler onClick={this.toggleCollapse} />
                <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
                <MDBNavbarNav left>
                        <MDBNavItem active>
                        <MDBNavLink to="/">Home</MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem>
                        <MDBNavLink to="/melon">melon</MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem>
                        <MDBNavLink to="/genie">genie</MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem>
                         <MDBNavLink to="/bugs">bugs</MDBNavLink>
                        </MDBNavItem>
                    </MDBNavbarNav>
                    <MDBNavbarNav right>
                        <MDBNavItem>
                        <MDBNavLink className="waves-effect waves-light" to="#!">
                            <MDBIcon fab icon="twitter" />
                        </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem>
                        <MDBNavLink className="waves-effect waves-light" to="#!">
                            <MDBIcon fab icon="google-plus-g" />
                        </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem>
                        <MDBDropdown>
                            <MDBDropdownToggle nav caret>
                            <MDBIcon icon="user" />
                            </MDBDropdownToggle>
                            <MDBDropdownMenu className="dropdown-default">
                            <MDBDropdownItem href="#!">Action</MDBDropdownItem>
                            <MDBDropdownItem href="#!">Another Action</MDBDropdownItem>
                            <MDBDropdownItem href="#!">Something else here</MDBDropdownItem>
                            <MDBDropdownItem href="#!">Something else here</MDBDropdownItem>
                            </MDBDropdownMenu>
                        </MDBDropdown>
                        </MDBNavItem>
                    </MDBNavbarNav>
                    </MDBCollapse>
                </MDBNavbar>
            </Router>
        )
    }
}

export default Navbar;