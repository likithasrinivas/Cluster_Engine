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

    const hs6PtItkCount = combinedData.filter(
        (item) =>
            item.HTS !== "null" && item.PT !== "null" && item.ITK !== "null"
    ).length;
    const hs6PtCount = combinedData.filter(
        (item) => item.HTS !== "null" && item.PT !== "null"
    ).length;
    const hs6ItkCount = combinedData.filter(
        (item) => item.HTS !== "null" && item.ITK !== "null"
    ).length;
    const hs6Count = combinedData.filter((item) => item.HTS !== "null").length;
    const ptCount = combinedData.filter((item) => item.PT !== "null").length;
    const itkCount = combinedData.filter((item) => item.ITK !== "null").length;

    const nonNullList = [
        hs6PtItkCount,
        hs6PtCount,
        hs6ItkCount,
        hs6Count,
        ptCount,
        itkCount,
    ];

    // Sort the nonNullList in descending order
    const sortedList = nonNullList.slice().sort((a, b) => b - a);

    // Create a mapping of counts to their ranks
    const rankMap = {};
    sortedList.forEach((count, index) => {
        rankMap[count] = index + 1;
    });

    const coveragePercentage = (count) =>
        ((count / data.length) * 100).toFixed(2);

    return (
        <>
            <h4>Non null count</h4>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>Attributes</th>
                        <th>Count</th>
                        <th>Coverage (in %)</th>
                        <th>Rank</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        { attribute: "HS6_PT_ITK", count: hs6PtItkCount },
                        { attribute: "HS6_PT", count: hs6PtCount },
                        { attribute: "HS6_ITK", count: hs6ItkCount },
                        { attribute: "HS6", count: hs6Count },
                        { attribute: "PT", count: ptCount },
                        { attribute: "ITK", count: itkCount },
                    ].map(({ attribute, count }) => (
                        <tr key={attribute}>
                            <td>{attribute}</td>
                            <td>{count}</td>
                            <td>{coveragePercentage(count)}</td>
                            <td>{rankMap[count]}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

export default NonNullTable;
