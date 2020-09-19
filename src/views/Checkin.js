/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";

// core components
import {
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4
} from "variables/charts.js";

class Checkin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bigChartData: "data1"
    };
  }
  setBgChartData = name => {
    this.setState({
      bigChartData: name
    });
  };
  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col xs="8">
              <Card className="card-chart">
                <CardHeader>
                  <Row>
                    <Col className="text-left" >
                      <h5 className="card-category">Rice Coffee House</h5>
                      <CardTitle tag="h2">Check In At Rice Coffee House</CardTitle>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Button color="success" className="animation-on-hover">
                    Check In
                  </Button>
                  <Button color="danger" className="animation-on-hover">
                    Check Out
                  </Button>
                  
                </CardBody>

              </Card>
            </Col>
          </Row>

          <Row>
            <Col xs="8">
              <Card className="card-chart">
                <CardHeader>
                  <Row>
                    <Col className="text-left">
                      <CardTitle tag="h4">Successfully checking out after checking in earns you points that can be redeemed for awards at CHAUS. </CardTitle>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                    <Col className="text-left">
                       Checking in earns you points based on the color of the dashboard. However, checking in at a red time reduces the number of points you earn!
                    </Col>
                </CardBody>

              </Card>
            </Col>
          </Row>
          
        </div>
      </>
    );
  }
}

export default Checkin;
