import React, {Component} from 'react';
import {MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon, MDBContainer 
} from "mdbreact";


class Navbar extends Component{
    
    state = {
        isOpen : false
    };

    toggleCollapse  = () => {
        this.setState({isOpen: !this.state.isOpen});
    };
    
    

    render(){
        
        const navbarColor = {
            backgroundColor: '#161c27b5'
        };

        return(
            
                <MDBNavbar style={navbarColor} dark expand="lg" scrolling="true" fixed="top" color="black" transparent="true">
                    <MDBContainer>
                        <MDBNavbarBrand href="/">
                            <strong className="logo">
                                <span className="cherry_color">C</span>herry
                            </strong>
                        </MDBNavbarBrand>
                        <MDBNavbarToggler onClick={this.toggleCollapse} />
                        <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
                        <MDBNavbarNav left>
                                <MDBNavItem>
                                <MDBNavLink to="/melon" chartname={"melon"}><span className="melon_color">M</span>ELON</MDBNavLink>
                                </MDBNavItem>
                                <MDBNavItem>
                                <MDBNavLink to="/genie" chartname={"genie"}><span className="genie_color">G</span>ENIE</MDBNavLink>
                                </MDBNavItem>
                                <MDBNavItem>
                                <MDBNavLink to="/bugs" chartname={"bugs"}><span className="bugs_color">B</span>UGS</MDBNavLink>
                                </MDBNavItem>
                            </MDBNavbarNav>
                            <MDBNavbarNav right>
                                <MDBNavItem>
                                </MDBNavItem>
                                <MDBNavItem>
                                <MDBNavLink className="waves-effect waves-light" onClick={() => window.location = 'http://localhost:8080/auth/google'}>
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
                        </MDBContainer>
                </MDBNavbar>
        )
    }
}

export default Navbar;