import React, {Component} from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBMask
} from "mdbreact";

class topchart extends Component{

    state = {
        chartName: 'MELON'
    }

    render(){
        return (
            <>
            <MDBMask overlay="black-light" className="d-flex justify-content-center align-items-center">
                <MDBContainer>
                    <MDBRow className="preview_header d-flex h-100 justify-content-center align-items-center wow fadeIn">
                        <MDBCol className="mb-4 white-text text-center text-md-left">
                        <h1 className="display-4 font-weight-bold">Real Time in {this.state.chartName} Chart</h1>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </MDBMask>
            </>
        );
    }
}

export default topchart;