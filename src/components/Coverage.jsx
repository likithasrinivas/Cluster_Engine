import React, { useState, useEffect, useRef } from "react";
import { Form, FormControl, Col, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { ToastContainer, toast } from "react-toastify";
import CombinedPropTable from "./CombinedPropTable";
import NonNullTable from "./NonNullTable";
import CoverageStats from "./CoverageStats";
import Papa from "papaparse";

function Coverage() {
    const [data, setData] = useState([]);
    const [uniqueMPValues, setUniqueMPValues] = useState([]);
    const [selectedMP, setSelectedMP] = useState("");
    const [selectedHeader, setSelectedHeader] = useState("");
    const file = useRef(null);

    useEffect(() => {
        const storedData = localStorage.getItem("Coverage_Data");
        if (storedData) {
            setData(JSON.parse(storedData));
        }
    }, []);

    useEffect(() => {
        const mpValues = data.map((item) => item.MP);
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
                    "Coverage_Data",
                    JSON.stringify(parsedData)
                );
            },
            header: true,
        });
        toast.success("Raw data uploaded successfully!");
    };

    const newData = data.filter(
        (item) =>
            item.HTS !== "null" ||
            item.PT !== "null" ||
            item.ITK !== "null"
    );

    console.log("aa", newData.length);

    const combinedData = newData
        .filter((item) => item.ASIN !== "")
        .map((item) => ({
            ...item,
            HS6_PT_ITK: item.PT + "-" + item.ITK + "-" + item.HTS,
            HS6_PT: item.PT + "-" + item.HTS,
            HS6_ITK: item.ITK + "-" + item.HTS,
        }));

    const filteredData = selectedMP
        ? combinedData.filter((item) => item.MP === selectedMP)
        : combinedData;

    const handleHeaderSelect = (event) => {
        setSelectedHeader(event.target.value);
    };

    return (
        <div>
            <Container fluid>
                <Row>
                    <Col>
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
                        <ToastContainer />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div
                            style={{
                                minHeight: "50vh",
                                padding: "10px",
                            }}
                        >
                            <Col md={6}>
                                {filteredData.length > 0 && (
                                    <NonNullTable data={data} />
                                )}
                            </Col>
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
                                {filteredData.length > 0 && (
                                    <CoverageStats
                                        data={filteredData}
                                        rawData={data}
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
                                            {uniqueMPValues.map(
                                                (value, index) => (
                                                    <option
                                                        key={index}
                                                        value={value}
                                                    >
                                                        {value}
                                                    </option>
                                                )
                                            )}
                                        </FormControl>
                                    </Form.Group>
                                </Form>
                            )}
                            {selectedMP && (
                                <span>You have selected : {selectedMP}</span>
                            )}
                            {data.length > 0 && (
                                <Form className="mt-4">
                                    <Form.Group controlId="headerSelect">
                                        <FormControl
                                            as="select"
                                            onChange={handleHeaderSelect}
                                            style={{ width: "100%" }}
                                        >
                                            <option value="">
                                                Select the Header
                                            </option>

                                            <option value="HS6_PT">
                                                HS6_PT
                                            </option>
                                            <option value="HS6_ITK">
                                                HS6_ITK
                                            </option>
                                            <option value="HS6">HS6</option>
                                            <option value="PT">PT</option>
                                            <option value="ITK">ITK</option>
                                            <option value="HS6_PT_ITK">
                                                HS6_PT_ITK
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
                </Row>
                <Row>
                    <Col>
                        <div
                            style={{
                                minHeight: "50vh",
                                padding: "10px",
                            }}
                        >
                            {combinedData.length > 0 && (
                                <CombinedPropTable
                                    data={combinedData}
                                    header={selectedHeader}
                                    rawData={data}
                                />
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Coverage;
