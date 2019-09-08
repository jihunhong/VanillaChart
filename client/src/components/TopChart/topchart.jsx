import React, {Component} from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBMask
} from "mdbreact";


import First from './First/first.jsx';

class topchart extends Component{

    state = {
        chartName: 'MELON'
    }

    render(){
        return (
            <>
            <MDBRow>
            <MDBRow className="preview_header d-flex h-100 justify-content-center align-items-center wow fadeIn">
                <MDBCol md="10" className="mb-4 white-text text-center text-md-left">
                    <h1 className="display-4 font-weight-bold">Real Time in {this.state.chartName} Chart</h1>
                    <hr className="hr-light" />
                    <First />
                </MDBCol>
            </MDBRow>
            </MDBRow>
            </>
        );
    }
}

export default topchart;