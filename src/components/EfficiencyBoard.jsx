import React, { useState, useEffect, useRef } from "react";
import { Form, FormControl, Col, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { toast } from "react-toastify";
import Efficiency from "./Efficiency";
import Papa from "papaparse";
import EfficiencyStats from "./EfficiencyStats";

function EfficiencyBoard() {
    const [data, setData] = useState([]);
    const [uniqueMPValues, setUniqueMPValues] = useState([]);
    const [selectedMP, setSelectedMP] = useState("");
    const [selectedHeader, setSelectedHeader] = useState("");
    const file = useRef(null);

    useEffect(() => {
        const storedData = localStorage.getItem("Efficiency_Data");
        if (storedData) {
            setData(JSON.parse(storedData));
        }
        localStorage.setItem("MP", selectedMP);
    }, []);

    useEffect(() => {
        localStorage.setItem("MP", selectedMP);
    }, [selectedMP]);

    useEffect(() => {
        const mpValues = data.map((item) => item.countrycode);
        const uniqueValues = [...new Set(mpValues)];
        setUniqueMPValues(uniqueValues);
    }, [data]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        Papa.parse(file, {
            complete: (result) => {
                const parsedData = result.data;
                setData(parsedData);
                localStorage.setItem(
                    "Efficiency_Data",
                    JSON.stringify(parsedData)
                );
            },
            header: true,
        });
        toast.success("Raw data uploaded successfully!");
    };

    const filteredData = selectedMP
        ? data.filter((item) => item.countrycode === selectedMP)
        : data;

    const customData = filteredData.map((item) => ({
        ...item,
        clusterid_classification: item.clusterid + item.classification,
        PT_classification: item.PT + item.classification,
        ITK_classification: item.ITK + item.classification,
        PT_ITK_classification: item.PT + item.ITK + item.classification,
        HS6_classification: item.HS6 + item.classification,
    }));
    
    const combinedData = selectedMP
        ? customData.filter((item) => item.countrycode === selectedMP)
        : [];

    const handleHeaderSelect = (event) => {
        setSelectedHeader(event.target.value);
    };

    return (
        <Container fluid>
            <Row>
                <Col>
                    <div
                        style={{
                            minHeight: "50vh",
                            padding: "10px",
                        }}
                    >
                        <div className="pt-4 d-flex justify-content-between">
                            <label
                                htmlFor="fileInput"
                                className="btn btn-dark mr-2"
                            >
                                Upload
                                <input
                                    type="file"
                                    id="fileInput"
                                    accept=".csv"
                                    style={{ display: "none" }}
                                    ref={file}
                                    onChange={handleFileUpload}
                                />
                            </label>
                        </div>

                        {data.length > 0 && (
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

                        {combinedData.length > 0 && (
                            <Form className="mt-4">
                                <Form.Group controlId="headerSelect">
                                    <FormControl
                                        as="select"
                                        onChange={handleHeaderSelect}
                                        style={{
                                            width: "100%",
                                        }}
                                    >
                                        <option value="">
                                            Select the Header
                                        </option>
                                        <option value="clusterid_classification">
                                            ClusterId_Classification
                                        </option>
                                        <option value="PT_classification">
                                            PT_Classification
                                        </option>
                                        <option value="ITK_classification">
                                            ITK_Classification
                                        </option>
                                        <option value="PT_ITK_classification">
                                            PT_ITK_Classification
                                        </option>
                                        <option value="HS6_classification">
                                            HS6_Classification
                                        </option>
                                    </FormControl>
                                </Form.Group>
                            </Form>
                        )}
                        {selectedHeader && (
                            <span>
                                You have selected header: {selectedHeader}
                            </span>
                        )}
                    </div>
                </Col>
                <Col>
                    <div
                        style={{
                            minHeight: "50vh",
                            padding: "10px",
                        }}
                    >
                        <Col md={6}>
                            {data.length > 0 && selectedMP && (
                                <EfficiencyStats
                                    data={combinedData}
                                    marketPlace={selectedMP ? selectedMP : ""}
                                />
                            )}
                        </Col>
                    </div>
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
                        {data.length > 0 && (
                            <Efficiency
                                data={combinedData}
                                marketPlace={selectedMP ? selectedMP : ""}
                                header={selectedHeader}
                            />
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default EfficiencyBoard;
