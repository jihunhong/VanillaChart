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
                    <h1 className="display-4 font-weight-bold">Real Time in {this.props.chartname} Chart</h1>
                    <hr className="hr-light" />
                    <First chartname={this.props.chartname}/>
                    <Second chartname={this.props.chartname}/>
                    <Third chartname={this.props.chartname}/>
                </MDBCol>
            </MDBRow>
            </MDBRow>
            </>
        );
    }
}

export default Topchart;