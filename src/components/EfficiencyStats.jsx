import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { calculateEfficiencyStats } from "../utils/helper";

const EfficiencyStats = ({ data, marketPlace }) => {
    const [efficiencyArray, setEfficiencyArray] = useState([]);

    useEffect(() => {
        const filteredData = data.filter(
            (item) =>
                item.clusterid !== 1 &&
                item.classification !== "null" &&
                item.clusterid !== "null"
        );

        const properties = [
            "clusterid_classification",
            "PT_classification",
            "ITK_classification",
            "PT_ITK_classification",
            "HS6_classification",
        ];

        const stats = properties.map((property) => {
            const result = calculateEfficiencyStats(
                filteredData,
                property,
                marketPlace
            );
            const efficiency = ((result / data.length) * 100).toFixed(2);
            return { property, result, efficiency };
        });

        stats.sort((a, b) => b.efficiency - a.efficiency);

        setEfficiencyArray(stats);

        localStorage.setItem(
            "Efficiency_List",
            JSON.stringify(stats.map((item) => item.property))
        );
    }, [data, marketPlace]);

    return (
        <div>
            <h4>Efficiency Dashboard</h4>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Count</th>
                        <th>Efficiency (in %)</th>
                        <th>Priority</th>
                    </tr>
                </thead>
                <tbody>
                    {efficiencyArray.map((item, index) => (
                        <tr key={index}>
                            <td>{item.property}</td>
                            <td>{item.result}</td>
                            <td>{item.efficiency}</td>
                            <td>{index + 1}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default EfficiencyStats;
