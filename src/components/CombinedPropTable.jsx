import React from "react";
import { Col } from "react-bootstrap";
import DownloadButton from "./FileDownload";
import {
    CoverageData,
    getPropertyCountsAndCoverageData,
    getTop5PropertySum,
} from "../utils/helper";

const CombinedPropTable = ({ data, header, rawData }) => {
    const newData = data.filter(
        (item) =>
            item.HTS !== null &&
            item.PT !== null &&
            item.ITK !== null &&
            item.HTS !== "null" &&
            item.PT !== "null" &&
            item.ITK !== "null"
    );

    const nullData = rawData.filter((item) => {
        for (const key in item) {
            if (item.hasOwnProperty(key) && item[key] === "null") {
                return true;
            }
        }
        return false;
    });

    const filteredNullData = [...nullData];

    // For ClusterId
    const {
        propertyCounts: clusterIdCounts,
        filteredData: filteredClusterIdData,
    } = getPropertyCountsAndCoverageData(data, "HS6_PT_ITK");

    // For HTS_PT
    const { propertyCounts: htsPtCounts, filteredData: filteredHTSPTData } =
        getPropertyCountsAndCoverageData(filteredClusterIdData, "HS6_PT");

    // For HTS_ITK
    const { propertyCounts: htsItkCounts, filteredData: filteredHTSITKData } =
        getPropertyCountsAndCoverageData(filteredHTSPTData, "HS6_ITK");

    const filteredHTSITKData_Null = [
        ...filteredHTSITKData,
        ...filteredNullData,
    ];
    const htsNonNullData = filteredHTSITKData_Null.filter(
        (item) => item.HTS !== "null"
    );

    // For HTS
    const { propertyCounts: htsCounts, filteredData: filteredHTSData } =
        getPropertyCountsAndCoverageData(filteredHTSITKData_Null, "HTS");
    const ptNonNullData = filteredHTSData.filter((item) => item.PT !== "null");

    // For PT
    const { propertyCounts: ptCounts, filteredData: filteredPTData } =
        getPropertyCountsAndCoverageData(filteredHTSData, "PT");
    const itkNonNullData = filteredPTData.filter((item) => item.ITK !== "null");

    // For ITK
    const { propertyCounts: itkCounts, filteredData: filteredITKData } =
        getPropertyCountsAndCoverageData(filteredPTData, "ITK");

    // Sort newData by clusterIdCounts[item.ClusterId] in descending order
    const sortedNewData = newData.sort((a, b) => {
        const countA = clusterIdCounts[a.HS6_PT_ITK] || 0;
        const countB = clusterIdCounts[b.HS6_PT_ITK] || 0;
        return countB - countA;
    });

    // Sort filteredClusterIdData by htsPtCounts[item.HS6_PT] in descending order
    const sortedFilteredClusterIdData = filteredClusterIdData.sort((a, b) => {
        const countA = htsPtCounts[a.HS6_PT] || 0;
        const countB = htsPtCounts[b.HS6_PT] || 0;
        return countB - countA;
    });

    // Sort filteredHTSPTData by htsItkCounts[item.HS6_ITK] in descending order
    const sortedHTSPTData = filteredHTSPTData.sort((a, b) => {
        const countA = htsItkCounts[a.HS6_ITK] || 0;
        const countB = htsItkCounts[b.HS6_ITK] || 0;
        return countB - countA;
    });

    // Sort filteredHTSITKData_Null by htsCounts[item.HTS] in descending order
    const sortedHTSITKData = htsNonNullData.sort((a, b) => {
        const countA = htsCounts[a.HTS] || 0;
        const countB = htsCounts[b.HTS] || 0;
        return countB - countA;
    });

    // Sort filteredHTSData by htsCounts[item.PT] in descending order
    const sortedHTSData = ptNonNullData.sort((a, b) => {
        const countA = ptCounts[a.PT] || 0;
        const countB = ptCounts[b.PT] || 0;
        return countB - countA;
    });

    // Sort filteredPTData by ptCounts[item.ITK] in descending order
    const sortedPTData = itkNonNullData.sort((a, b) => {
        const countA = itkCounts[a.ITK] || 0;
        const countB = itkCounts[b.ITK] || 0;
        return countB - countA;
    });

    // Calcluate coverage
    // Function to process and extract top data based on a property
    function processAndExtractDownloadData(
        data,
        counts,
        property,
        clusterType
    ) {
        const topCountProperty = getTop5PropertySum(data, property);
        const dataTemp = [];

        data.forEach((item) => {
            const percentage = (
                (counts[item[property]] / data.length) *
                100
            ).toFixed(2);
            const rowData = {
                ASIN: item.ASIN,
                [property]: item[property],
                ClusterType: clusterType,
                [`${property}Count`]: counts[item[property]],
                Percentage: percentage,
            };

            dataTemp.push(rowData);
        });

        return dataTemp.slice(0, topCountProperty);
    }

    // For HS6_PT_ITK
    const clusterIdData = processAndExtractDownloadData(
        sortedNewData,
        clusterIdCounts,
        "HS6_PT_ITK",
        "HS6_PT_ITK"
    );

    // For HS6_PT
    const htsPtData = processAndExtractDownloadData(
        sortedFilteredClusterIdData,
        htsPtCounts,
        "HS6_PT",
        "HS6_PT"
    );

    // For HS6_ITK
    const htsItkData = processAndExtractDownloadData(
        sortedHTSPTData,
        htsItkCounts,
        "HS6_ITK",
        "HS6_ITK"
    );

    // For HTS
    const htsData = processAndExtractDownloadData(
        sortedHTSITKData,
        htsCounts,
        "HTS",
        "HS6"
    );

    // For PT
    const ptData = processAndExtractDownloadData(
        sortedHTSData,
        ptCounts,
        "PT",
        "PT"
    );

    // For ITK
    const itkData = processAndExtractDownloadData(
        sortedPTData,
        itkCounts,
        "ITK",
        "ITK"
    );

    const restData = filteredITKData.map((item) => ({
        ASIN: item.ASIN,
        Cluster_Type: "N/A",
        HTS: item.HTS,
        PT: item.PT,
        ITK: item.ITK,
    }));

    return (
        <>
            <Col md={6}>
                <DownloadButton
                    data1={clusterIdData.length > 0 ? clusterIdData : []}
                    data2={htsPtData.length > 0 ? htsPtData : []}
                    data3={htsItkData.length > 0 ? htsItkData : []}
                    data4={htsData.length > 0 ? htsData : []}
                    data5={ptData.length > 0 ? ptData : []}
                    data6={itkData.length > 0 ? itkData : []}
                    data7={restData.length > 0 ? restData : []}
                    data8={filteredNullData.length > 0 ? filteredNullData : []}
                />
            </Col>
            <br />
            <Col>
                {header === "HS6_PT_ITK" && (
                    <CoverageData
                        header={header}
                        totalItemCount={newData.length}
                        filteredData={newData}
                        uniqueItemsCountData={data}
                        propertyName="HS6_PT_ITK"
                        sortedData={sortedNewData}
                        counts={clusterIdCounts}
                    />
                )}

                {header === "HS6_PT" && (
                    <CoverageData
                        header={header}
                        totalItemCount={filteredClusterIdData.length}
                        filteredData={filteredClusterIdData}
                        uniqueItemsCountData={filteredClusterIdData}
                        propertyName="HS6_PT"
                        sortedData={sortedFilteredClusterIdData}
                        counts={htsPtCounts}
                    />
                )}

                {header === "HS6_ITK" && (
                    <CoverageData
                        header={header}
                        totalItemCount={filteredHTSPTData.length}
                        filteredData={filteredHTSPTData}
                        uniqueItemsCountData={filteredHTSPTData}
                        propertyName="HS6_ITK"
                        sortedData={sortedHTSPTData}
                        counts={htsItkCounts}
                    />
                )}

                {header === "HS6" && (
                    <CoverageData
                        header={header}
                        totalItemCount={filteredHTSITKData_Null.length}
                        filteredData={htsNonNullData}
                        uniqueItemsCountData={htsNonNullData}
                        propertyName="HTS"
                        sortedData={sortedHTSITKData}
                        counts={htsCounts}
                    />
                )}

                {header === "PT" && (
                    <CoverageData
                        header={header}
                        totalItemCount={filteredHTSData.length}
                        filteredData={ptNonNullData}
                        uniqueItemsCountData={ptNonNullData}
                        propertyName="PT"
                        sortedData={sortedHTSData}
                        counts={ptCounts}
                    />
                )}

                {header === "ITK" && (
                    <CoverageData
                        header={header}
                        totalItemCount={filteredPTData.length}
                        filteredData={itkNonNullData}
                        uniqueItemsCountData={itkNonNullData}
                        propertyName="ITK"
                        sortedData={sortedPTData}
                        counts={itkCounts}
                    />
                )}
            </Col>
            <br />
        </>
    );
};

export default CombinedPropTable;
