import React from "react";
import Table from "react-bootstrap/Table";
import { calculateNonNullCount } from "../utils/helper";

const NonNullTable = ({ data }) => {
    const combinedData = data
        .filter((item) => item.ASIN !== "")
        .map((item) => ({
            ...item,
            HS6_PT_ITK: item.PT + "-" + item.ITK + "-" + item.HTS,
            HS6_PT: item.PT + "-" + item.HTS,
            HS6_ITK: item.ITK + "-" + item.HTS,
        }));

    const hs6PtItkCount = calculateNonNullCount(combinedData, "HS6_PT_ITK");
    const hs6PtCount = calculateNonNullCount(combinedData, "HS6_PT");
    const hs6ItkCount = calculateNonNullCount(combinedData, "HS6_ITK");
    const hs6Count = calculateNonNullCount(combinedData, "HTS");
    const ptCount = calculateNonNullCount(combinedData, "PT");
    const itkCount = calculateNonNullCount(combinedData, "ITK");

    return (
        <>
            <h4>Coverage Non Null Count</h4>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>Cluster type</th>
                        <th>Count</th>
                        <th>Coverage (in %)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>HS6_PT_ITK</td>
                        <td>{hs6PtItkCount}</td>
                        <td>
                            {((hs6PtItkCount / data.length) * 100).toFixed(2)}
                        </td>
                    </tr>
                    <tr>
                        <td>HS6_PT</td>
                        <td>{hs6PtCount}</td>
                        <td>{((hs6PtCount / data.length) * 100).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>HS6_ITK</td>
                        <td>{hs6ItkCount}</td>
                        <td>
                            {((hs6ItkCount / data.length) * 100).toFixed(2)}
                        </td>
                    </tr>
                    <tr>
                        <td>HS6</td>
                        <td>{hs6Count}</td>
                        <td>{((hs6Count / data.length) * 100).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>PT</td>
                        <td>{ptCount}</td>
                        <td>{((ptCount / data.length) * 100).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>ITK</td>
                        <td>{itkCount}</td>
                        <td>{((itkCount / data.length) * 100).toFixed(2)}</td>
                    </tr>
                </tbody>
            </Table>
        </>
    );
};

export default NonNullTable;
