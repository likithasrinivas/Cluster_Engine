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
        localStorage.removeItem("Coverage_Data");
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

    const customData = filteredData.map((item) => {
        const newItem = { ...item };

        // Check if properties exist before computing
        if (item.clusterid && item.clusterid !=="null" && item.classification) {
            newItem.clusterid_classification =
                item.clusterid + item.classification;
        }
        if (item.PT && item.PT !=="null" && item.classification) {
            newItem.PT_classification = item.PT + item.classification;
        }
        if (item.ITK && item.ITK !=="null" && item.classification) {
            newItem.ITK_classification = item.ITK + item.classification;
        }
        if (item.PT && item.ITK && item.PT !=="null" && item.ITK !=="null" && item.classification) {
            newItem.PT_ITK_classification =
                item.PT + item.ITK + item.classification;
        }
        if (item.HS6 && item.HS6 !=="null" && item.classification) {
            newItem.HS6_classification = item.HS6 + item.classification;
        }

        return newItem;
    });

    const combinedData = selectedMP
        ? customData.filter((item) => item.countrycode === selectedMP)
        : [];

    const handleHeaderSelect = (event) => {
        setSelectedHeader(event.target.value);
    };

    const excludedProperties = [
        "asin",
        "classification",
        "countrycode",
        "clusterid",
        "HS6",
        "ITK",
        "PT",
    ];

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
                                        {Object.keys(combinedData[0]).map(
                                            (property) => {
                                                if (
                                                    !excludedProperties.includes(
                                                        property
                                                    )
                                                ) {
                                                    return (
                                                        <option
                                                            key={property}
                                                            value={property}
                                                        >
                                                            {property}
                                                        </option>
                                                    );
                                                }
                                                return null;
                                            }
                                        )}
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
