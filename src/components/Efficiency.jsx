import React from "react";
import Table from "react-bootstrap/Table";
import { calculateEfficiency } from "../utils/helper";

const EfficiencyTable = ({ header, divisionResult }) => (
    <div>
        <h2>{header}</h2>
        <Table bordered hover>
            <thead>
                <tr>
                    <th>{header}</th>
                    <th>Count</th>
                    <th>Prefix Count</th>
                    <th>Efficiency (in %)</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(divisionResult).map((key, index) => (
                    <tr key={index}>
                        <td>{key}</td>
                        <td>{divisionResult[key].count}</td>
                        <td>{divisionResult[key].prefixCount}</td>
                        <td>{divisionResult[key].efficiency.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    </div>
);

const Efficiency = ({ data, marketPlace, header }) => {
    const filteredData = data.filter(
        (item) =>
            item.clusterid !== 1 &&
            item.classification !== "null" &&
            item.clusterid !== "null"
    );

    const efficiencyData = {
        clusterid_classification: calculateEfficiency(
            data,
            "clusterid_classification",
            marketPlace
        ),
        PT_classification: calculateEfficiency(
            filteredData,
            "PT_classification",
            marketPlace
        ),
        ITK_classification: calculateEfficiency(
            filteredData,
            "ITK_classification",
            marketPlace
        ),
        PT_ITK_classification: calculateEfficiency(
            filteredData,
            "PT_ITK_classification",
            marketPlace
        ),
        HS6_classification: calculateEfficiency(
            filteredData,
            "HS6_classification",
            marketPlace
        ),
    };

    return (
        <div>
            {header === "clusterid_classification" && (
                <EfficiencyTable
                    header="clusterid_classification"
                    divisionResult={efficiencyData.clusterid_classification}
                />
            )}
            {header === "PT_classification" && (
                <EfficiencyTable
                    header="PT_classification"
                    divisionResult={efficiencyData.PT_classification}
                />
            )}
            {header === "ITK_classification" && (
                <EfficiencyTable
                    header="ITK_classification"
                    divisionResult={efficiencyData.ITK_classification}
                />
            )}
            {header === "PT_ITK_classification" && (
                <EfficiencyTable
                    header="PT_ITK_classification"
                    divisionResult={efficiencyData.PT_ITK_classification}
                />
            )}
            {header === "HS6_classification" && (
                <EfficiencyTable
                    header="HS6_classification"
                    divisionResult={efficiencyData.HS6_classification}
                />
            )}
        </div>
    );
};

export default Efficiency;
