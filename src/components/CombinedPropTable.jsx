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
            item.HTS !== "null" ||
            item.PT !== "null" ||
            item.ITK !== "null"
    );

    // For HTS_PT
    const { propertyCounts: htsPtCounts, filteredData: filteredHTSPTData } =
        getPropertyCountsAndCoverageData(data, "HS6_PT");

    // For HTS_ITK
    const { propertyCounts: htsItkCounts, filteredData: filteredHTSITKData } =
        getPropertyCountsAndCoverageData(filteredHTSPTData, "HS6_ITK");

    // For HTS
    const { propertyCounts: htsCounts, filteredData: filteredHTSData } =
        getPropertyCountsAndCoverageData(filteredHTSITKData, "HTS");

    // For PT
    const { propertyCounts: ptCounts, filteredData: filteredPTData } =
        getPropertyCountsAndCoverageData(filteredHTSData, "PT");

    // For ITK
    const { propertyCounts: itkCounts, filteredData: filteredITKData } =
        getPropertyCountsAndCoverageData(filteredPTData, "ITK");

    // For HTS_PT_ITK
    const {
        propertyCounts: htsPtItkCounts,
        filteredData: filteredHTSPTITKData,
    } = getPropertyCountsAndCoverageData(filteredITKData, "HS6_PT_ITK");

    // Sort newData by htsPtCounts[item.HS6_PT] in descending order
    const sortedNewData = newData.sort((a, b) => {
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

    // Sort filteredHTSITKData by htsCounts[item.HTS] in descending order
    const sortedHTSITKData = filteredHTSITKData.sort((a, b) => {
        const countA = htsCounts[a.HTS] || 0;
        const countB = htsCounts[b.HTS] || 0;
        return countB - countA;
    });

    // Sort filteredHTSData by ptCounts[item.PT] in descending order
    const sortedHTSData = filteredHTSData.sort((a, b) => {
        const countA = ptCounts[a.PT] || 0;
        const countB = ptCounts[b.PT] || 0;
        return countB - countA;
    });

    // Sort filteredPTData by itkCounts[item.ITK] in descending order
    const sortedPTData = filteredPTData.sort((a, b) => {
        const countA = itkCounts[a.ITK] || 0;
        const countB = itkCounts[b.ITK] || 0;
        return countB - countA;
    });

    // Sort filteredITKData by ptCounts[item.HS6_PT_ITK] in descending order
    const sortedITKData = filteredITKData.sort((a, b) => {
        const countA = htsPtItkCounts[a.HS6_PT_ITK] || 0;
        const countB = htsPtItkCounts[b.HS6_PT_ITK] || 0;
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
                HTS: item.HTS,
                PT: item.PT,
                ITK: item.ITK,
                [property]: item[property],
                ClusterType: clusterType,
                [`${property}Count`]: counts[item[property]],
                Percentage: percentage,
            };

            dataTemp.push(rowData);
        });

        return dataTemp.slice(0, topCountProperty);
    }

    // For HS6_PT
    const htsPtData = processAndExtractDownloadData(
        sortedNewData,
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

    // For HTS_PT_ITK
    const htsPtItkData = processAndExtractDownloadData(
        sortedITKData,
        itkCounts,
        "HS6_PT_ITK",
        "HS6_PT_ITK"
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
                    data1={htsPtData.length > 0 ? htsPtData : []}
                    data2={htsItkData.length > 0 ? htsItkData : []}
                    data3={htsData.length > 0 ? htsData : []}
                    data4={ptData.length > 0 ? ptData : []}
                    data5={itkData.length > 0 ? itkData : []}
                    data6={htsPtItkData.length > 0 ? htsPtItkData : []}
                    data7={restData.length > 0 ? restData : []}
                    data8={[]}
                />
            </Col>
            <br />
            <Col>
                {header === "HS6_PT" && (
                    <CoverageData
                        header={header}
                        totalItemCount={newData.length}
                        filteredData={newData}
                        uniqueItemsCountData={data}
                        propertyName="HS6_PT"
                        sortedData={sortedNewData}
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
                        totalItemCount={filteredHTSITKData.length}
                        filteredData={filteredHTSITKData}
                        uniqueItemsCountData={filteredHTSITKData}
                        propertyName="HTS"
                        sortedData={sortedHTSITKData}
                        counts={htsCounts}
                    />
                )}

                {header === "PT" && (
                    <CoverageData
                        header={header}
                        totalItemCount={filteredHTSData.length}
                        filteredData={filteredHTSData}
                        uniqueItemsCountData={filteredHTSData}
                        propertyName="PT"
                        sortedData={sortedHTSData}
                        counts={ptCounts}
                    />
                )}

                {header === "ITK" && (
                    <CoverageData
                        header={header}
                        totalItemCount={filteredPTData.length}
                        filteredData={filteredPTData}
                        uniqueItemsCountData={filteredPTData}
                        propertyName="ITK"
                        sortedData={sortedPTData}
                        counts={itkCounts}
                    />
                )}

                {header === "HS6_PT_ITK" && (
                    <CoverageData
                        header={header}
                        totalItemCount={filteredITKData.length}
                        filteredData={filteredITKData}
                        uniqueItemsCountData={filteredITKData}
                        propertyName="HS6_PT_ITK"
                        sortedData={sortedITKData}
                        counts={htsPtItkCounts}
                    />
                )}
            </Col>
            <br />
        </>
    );
};

export default CombinedPropTable;
