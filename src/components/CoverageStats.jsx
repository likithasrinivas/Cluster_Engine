import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import {
    getPropertyCountsAndCoverageData,
    getTop5PropertySum,
} from "../utils/helper";

const CoverageStats = ({ data, rawData }) => {
    const newData = data.filter(
        (item) =>
            item.HTS !== "null" ||
            item.PT !== "null" ||
            item.ITK !== "null"
    );


    // For HS6_PT
    const { filteredData: filteredHTSPTData } =
        getPropertyCountsAndCoverageData(data, "HS6_PT");
    const HTSPTTop5 = getTop5PropertySum(data, "HS6_PT");

    // For HS6_ITK
    const { filteredData: filteredHTSITKData } =
        getPropertyCountsAndCoverageData(filteredHTSPTData, "HS6_ITK");
    const HTSITKTop5 = getTop5PropertySum(filteredHTSPTData, "HS6_ITK");

    // For HTS
    const { filteredData: filteredHTSData } = getPropertyCountsAndCoverageData(
        filteredHTSITKData,
        "HTS"
    );
    const HTSTop5 = getTop5PropertySum(filteredHTSITKData, "HTS");

    // For PT
    const { filteredData: filteredPTData } = getPropertyCountsAndCoverageData(
        filteredHTSData,
        "PT"
    );
    const PTTop5 = getTop5PropertySum(filteredHTSData, "PT");

    // For ITK
    const { filteredData: filteredITKData } = getPropertyCountsAndCoverageData(
        filteredPTData,
        "ITK"
    );
    const ITKTop5 = getTop5PropertySum(filteredPTData, "ITK");

    // For HS6_PT_ITK
    const { filteredData: filteredHTSPTITKData } =
        getPropertyCountsAndCoverageData(filteredITKData, "HS6_PT_ITK");
    const HTSPTITKTop5 = getTop5PropertySum(filteredITKData, "HS6_PT_ITK");

    const [efficiencyList, setEfficiencyList] = useState([]);
    useEffect(() => {
        const storedEfficiencyList = localStorage.getItem("Efficiency_List");
        setEfficiencyList(
            storedEfficiencyList !== null
                ? JSON.parse(storedEfficiencyList)
                : []
        );
    }, []);

    const propertyPriorityMapping = {
        PT_classification: "HS6_PT",
        ITK_classification: "HS6_ITK",
        HS6_classification: "HS6_HS6",
        clusterid_classification: "HS6_CI",
        PT_ITK_classification: "HS6_PT_ITK",
    };

    const mappedList = efficiencyList.map(
        (property) => propertyPriorityMapping[property]
    );

    const priorities = {};
    mappedList.forEach((property, index) => {
        priorities[property] = index + 1;
    });

    return (
        <>
            <h4>Coverage Efficiency</h4>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>Cluster type</th>
                        <th>Count</th>
                        <th>Coverage (in %)</th>
                        <th>Priority</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>HS6_PT</td>
                        <td>{HTSPTTop5}</td>
                        <td>{((HTSPTTop5 / data.length) * 100).toFixed(2)}</td>
                        <td>{priorities["HS6_PT"]}</td>
                    </tr>
                    <tr>
                        <td>HS6_ITK</td>
                        <td>{HTSITKTop5}</td>
                        <td>{((HTSITKTop5 / data.length) * 100).toFixed(2)}</td>
                        <td>{priorities["HS6_ITK"]}</td>
                    </tr>
                    <tr>
                        <td>HS6</td>
                        <td>{HTSTop5}</td>
                        <td>{((HTSTop5 / data.length) * 100).toFixed(2)}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>PT</td>
                        <td>{PTTop5}</td>
                        <td>{((PTTop5 / data.length) * 100).toFixed(2)}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>ITK</td>
                        <td>{ITKTop5}</td>
                        <td>{((ITKTop5 / data.length) * 100).toFixed(2)}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>HS6_PT_ITK</td>
                        <td>{HTSPTITKTop5}</td>
                        <td>
                            {((HTSPTITKTop5 / data.length) * 100).toFixed(2)}
                        </td>
                        <td>{priorities["HS6_CI"]}</td>
                    </tr>
                </tbody>
            </Table>
        </>
    );
};

export default CoverageStats;
