import React, {Component} from 'react';
import { MDBRow, MDBCol } from "mdbreact";


import First from './First/First.jsx';
import Second from './Second/Second.jsx';
import Third from './Third/Third.jsx';

class Topchart extends Component{

    state = {
        chartname: this.props.chartname
    }

    render(){
        return (
            <>
            <MDBRow>
            <MDBRow className="preview_header d-flex h-100 justify-content-center align-items-center wow fadeIn">
                <MDBCol md="10" className="mb-4 white-text text-center text-md-left">
                    <h1 className="display-4 font-weight-bold header">Today on <strong className={this.props.chartname+"_color"}> {this.props.chartname}</strong> Chart</h1>
                    <hr className="hr-light" />
                    <First chartname={this.props.chartname}/>
                    <Second chartname={this.props.chartname}/>
                    <Third chartname={this.props.chartname}/>
                    <p className="mb-4 d-none d-md-block dummy_text">
                    <strong>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500s,
                            when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </strong>
                    </p>
                    <a target="_blank" href="#" class="btn btn-outline-white waves-effect waves-light">Sample Button
                        <i class="fab fa-youtube red-text ml-2"></i>
                    </a>
                    <a target="_blank" href="#" class="btn btn-outline-white waves-effect waves-light">Sample Button
                        <i class="fas fa-download red-text ml-2"></i>
                    </a>
                </MDBCol>
            </MDBRow>
            </MDBRow>
            </>
        );
    }
}

export default Topchart;