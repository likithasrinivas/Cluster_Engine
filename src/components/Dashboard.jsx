import React, { useState, useEffect } from "react";
import { Form, FormControl, Col, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import EfficiencyStats from "./EfficiencyStats";
import CoverageStats from "./CoverageStats";

const Dashboard = () => {
    const coverageData = JSON.parse(localStorage.getItem("Coverage_Data"));
    const efficiencyData = JSON.parse(localStorage.getItem("Efficiency_Data"));
    const [uniqueMPValues, setUniqueMPValues] = useState([]);
    const [selectedMP, setSelectedMP] = useState("");

    useEffect(() => {
        if (efficiencyData && efficiencyData.length > 0) {
            const mpValues = efficiencyData.map((item) => item.countrycode);
            const uniqueValues = [...new Set(mpValues)];
            setUniqueMPValues(uniqueValues);
        }
    }, [efficiencyData]);

    const combinedCoverageData = coverageData.map((item) => ({
        ...item,
        HS6_PT_ITK: item.PT + "-" + item.ITK + "-" + item.HTS,
        HS6_PT: item.PT + "-" + item.HTS,
        HS6_ITK: item.ITK + "-" + item.HTS,
    }));

    const customData = efficiencyData.map((item) => ({
        ...item,
        clusterid_classification: item.clusterid + item.classification,
        PT_classification: item.PT + item.classification,
        ITK_classification: item.ITK + item.classification,
        PT_ITK_classification: item.PT + item.ITK + item.classification,
        HS6_classification: item.HS6 + item.classification,
    }));

    const MP = localStorage.getItem("MP") ?? "";

    const combinedData = selectedMP
        ? customData.filter((item) => item.countrycode === selectedMP)
        : [];

    return (
        <div>
            <Container fluid>
                <Row>
                    <Col md={6}>
                        {efficiencyData.length > 0 && (
                            <Form className="mt-4">
                                <Form.Group controlId="mpSelect">
                                    <FormControl
                                        as="select"
                                        onChange={(e) =>
                                            setSelectedMP(e.target.value)
                                        }
                                        style={{ width: "100%" }}
                                    >
                                        <option value="">
                                            Select the Market Place
                                        </option>
                                        {uniqueMPValues.map((value, index) => (
                                            <option key={index} value={value}>
                                                {value}
                                            </option>
                                        ))}
                                    </FormControl>
                                </Form.Group>
                            </Form>
                        )}
                        {selectedMP && (
                            <span>You have selected : {selectedMP}</span>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <div
                            style={{
                                minHeight: "50vh",
                                padding: "10px",
                            }}
                        >
                            <Col>
                                {combinedCoverageData.length > 0 && (
                                    <CoverageStats
                                        data={combinedCoverageData}
                                        rawData={coverageData}
                                    />
                                )}
                            </Col>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div
                            style={{
                                minHeight: "50vh",
                                padding: "10px",
                            }}
                        >
                            {selectedMP && (
                                <EfficiencyStats
                                    data={combinedData}
                                    marketPlace={selectedMP ? selectedMP : ""}
                                />
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Dashboard;
