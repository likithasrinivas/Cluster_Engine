import Table from "react-bootstrap/Table";
import { Col } from "react-bootstrap";
import UniqueItemsCount from "../components/UniquePropCount";

// Component used: CombinedPropTable
export function calculateTop3Counts(data) {
    // Create an object to store counts of unique property values
    const propertyCounts = {};

    // Count occurrences of each property value for all properties
    data.forEach((item) => {
        Object.keys(item).forEach((key) => {
            if (key in propertyCounts) {
                if (item[key] in propertyCounts[key]) {
                    propertyCounts[key][item[key]]++;
                } else {
                    propertyCounts[key][item[key]] = 1;
                }
            } else {
                propertyCounts[key] = { [item[key]]: 1 };
            }
        });
    });

    // Convert counts object into an array of objects
    const countsArray = [];
    for (const property in propertyCounts) {
        const propertyCount = {};
        const counts = Object.values(propertyCounts[property]);
        counts.sort((a, b) => b - a);
        const sumTop3 = counts
            .slice(0, 3)
            .reduce((sum, count) => sum + count, 0);
        propertyCount[property] = sumTop3;
        countsArray.push(propertyCount);
    }

    countsArray.sort((a, b) => Object.values(b)[0] - Object.values(a)[0]);

    return countsArray;
}

// Component used: CombinedPropTable and CoverageStats
export function getPropertyCountsAndCoverageData(data, property) {
    // Calculate the occurrence of the property
    const propertyCounts = data.reduce((acc, obj) => {
        const propertyValue = obj[property];
        acc[propertyValue] = (acc[propertyValue] || 0) + 1;
        return acc;
    }, {});

    // Sort the data based on occurrence in descending order
    const sortedPropertyCounts = Object.entries(propertyCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 5); // Select the top 5 highest counts

    // Get ASINs with the top 5 highest property counts
    const top5Asins = sortedPropertyCounts.map(([propertyValue]) =>
        data
            .filter((item) => item[property] === propertyValue)
            .map((item) => item.ASIN)
    );

    // Flatten the array of ASINs
    const top5AsinsFlattened = [].concat(...top5Asins);

    // Filter out ASINs with the top 5 highest property counts
    const filteredData = data.filter(
        (item) => !top5AsinsFlattened.includes(item.ASIN)
    );

    return { propertyCounts, filteredData };
}

// Component used: CoverageStats
export function getTop5PropertySum(data, property) {
    // Calculate the occurrence of the property
    const propertyCounts = data.reduce((acc, obj) => {
        const propertyValue = obj[property];
        acc[propertyValue] = (acc[propertyValue] || 0) + 1;
        return acc;
    }, {});

    // Sort the property counts in descending order
    const sortedPropertyCounts = Object.entries(propertyCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 5); // Select the top 5 highest counts

    // Sum the top 5 property counts
    const sum = sortedPropertyCounts.reduce(
        (total, [, count]) => total + count,
        0
    );

    return sum;
}

// Component used: Efficiency
export function calculateEfficiency(data, propertyName, marketPlace) {
    // Count the number of unique occurrences of propertyName
    const dataCountObj = {};
    data.forEach((item) => {
        const key = item[propertyName];
        dataCountObj[key] = (dataCountObj[key] || 0) + 1;
    });

    const dataList = Object.keys(dataCountObj).map((key) => {
        return { [key]: dataCountObj[key] };
    });

    // Get the list of prefixes in the propertyName and count their occurrences
    const prefixCountObj = {};
    data.forEach((item) => {
        const prefix =
            typeof item[propertyName] === "string"
                ? item[propertyName].slice(0, marketPlace === "BR" ? -8 : -10)
                : "";
        prefixCountObj[prefix] = (prefixCountObj[prefix] || 0) + 1;
    });

    // Calculate the efficiency based on the count of unique propertyNames and count of unique prefixes in the propertyNames
    const divisionResult = {};

    dataList.forEach((dataItem) => {
        const dataKey = Object.keys(dataItem)[0];
        const dataCount = dataItem[dataKey];
        const prefix = dataKey.slice(0, marketPlace === "BR" ? -8 : -10);
        const prefixCount = prefixCountObj[prefix];

        // Calculate efficiency
        const efficiency = (dataCount / prefixCount) * 100;

        // Include count of unique property names and unique prefixes in the division result
        if (dataCount !== prefixCount) {
            divisionResult[dataKey] = {
                efficiency,
                count: dataCount,
                prefixCount,
            };
        }
    });

    // Convert divisionResult to an array of key-value pairs and sort by efficiency in descending order
    const sortedDivisionResult = Object.entries(divisionResult)
        .sort(([, a], [, b]) => b.efficiency - a.efficiency)
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

    return sortedDivisionResult;
}

// Component used: EfficiencyStats
export function calculateEfficiencyStats(data, propertyName, marketPlace) {
    // Count the number of unique occurrences of propertyName
    const dataCountObj = {};
    data.forEach((item) => {
        const key = item[propertyName];
        dataCountObj[key] = (dataCountObj[key] || 0) + 1;
    });

    const dataList = Object.keys(dataCountObj).map((key) => {
        return { [key]: dataCountObj[key] };
    });

    // Get the list of prefixes in the propertyName and count their occurrences
    const prefixCountObj = {};
    data.forEach((item) => {
        const prefix =
            typeof item[propertyName] === "string"
                ? item[propertyName].slice(0, marketPlace === "BR" ? -8 : -10)
                : "";
        prefixCountObj[prefix] = (prefixCountObj[prefix] || 0) + 1;
    });

    // Calculate the efficiency based on the count of unique propertyNames and count of unique prefixes in the propertyNames
    const propertySumResult = {};

    dataList.forEach((dataItem) => {
        const dataKey = Object.keys(dataItem)[0];
        const dataCount = dataItem[dataKey];
        const prefix = dataKey.slice(0, marketPlace === "BR" ? -8 : -10);
        const prefixCount = prefixCountObj[prefix];

        // Include count of unique property names and unique prefixes in the division result
        if (dataCount !== prefixCount) {
            propertySumResult[dataKey] = {
                count: dataCount,
            };
        }
    });

    // Sum of dataCount present in propertySumResult
    let sumOfDataCount = 0;
    for (const key in propertySumResult) {
        sumOfDataCount += propertySumResult[key].count;
    }

    return sumOfDataCount;
}

//Function to calculate non null items
//Component used: NonNullTable
export const calculateNonNullCount = (data, propertyName) => {
    let count;

    if (!["PT", "ITK", "HTS"].includes(propertyName)) {
        count = data.filter(
            (item) =>
                item[propertyName] &&
                !String(item[propertyName]).includes("null")
        ).length;
    } else {
        count = data.filter((item) => item[propertyName] !== "null").length;
    }

    return count;
};

// Function to calculate unique items count
// Component used: UniquePropCount
export const calculateUniqueItemsCount = (data, propertyName) => {
    const countOccurrences = (arr) => {
        return arr.reduce((acc, curr) => {
            acc[curr] ? acc[curr]++ : (acc[curr] = 1);
            return acc;
        }, {});
    };

    const propertyValues = data.map((item) => item[propertyName]);
    const occurrences = countOccurrences(propertyValues);

    const occurrencesArray = Object.entries(occurrences);
    occurrencesArray.sort((a, b) => b[1] - a[1]);

    const uniqueItemsWithProperties = occurrencesArray.map(([value, count]) => {
        const item = data.find((item) => item[propertyName] === value);
        return {
            ASIN: item.ASIN,
            [propertyName]: value,
            count,
            HTS: item.HTS,
            PT: item.PT,
            ITK: item.ITK,
            ClusterId: item.ClusterId,
            HTS_PT: item.HTS_PT,
            HTS_ITK: item.ClusterId,
        };
    });

    return uniqueItemsWithProperties;
};

// Component used: ComninedPropTable
export const CoverageData = ({
    header,
    totalItemCount,
    filteredData,
    uniqueItemsCountData,
    propertyName,
    sortedData,
    counts,
}) => {
    return (
        <>
            <Col md={6}>
                <p>Total item count: {totalItemCount}</p>
            </Col>
            <UniqueItemsCount
                data={uniqueItemsCountData}
                propertyName={propertyName}
            />
            <Col md={6}>
                <h5>Sorted Data Table</h5>
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th>ASIN</th>
                            <th>{header}</th>
                            <th>Count</th>
                            <th>Coverage (in %)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.ASIN}</td>
                                <td>{item[header]}</td>
                                <td>{counts[item[header]]}</td>
                                <td>
                                    {(
                                        (counts[item[header]] /
                                            filteredData.length) *
                                        100
                                    ).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Col>
        </>
    );
};
