import React from "react";

function calculateTop3Counts(data) {
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

function calculateTop3CountsAndFilter(data, propertyName) {
    // Step 1: Calculate counts for unique items based on the specified property name
    const propertyCounts = {};
    data.forEach((item) => {
        const propertyValue = item[propertyName];
        propertyCounts[propertyValue] =
            (propertyCounts[propertyValue] || 0) + 1;
    });

    // Step 2: Identify the top 3 highest repeated items
    const countsArray = Object.entries(propertyCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 3)
        .map(([value]) => value);

    // Step 3: Filter the data to exclude items with ASINs that match the ASINs of the top 3 highest repeated items
    const filteredData = data.filter(
        (item) => !countsArray.includes(item.ASIN)
    );

    return {
        top3Counts: countsArray,
        filteredData: filteredData,
    };
}

function YourComponent({ data }) {
    const top3Count = calculateTop3Counts(data);
    const { top3Counts, filteredData } = calculateTop3CountsAndFilter(
        data,
        "HTS"
    );
    const firstKey = Object.keys(top3Count[0])[0];
    const two = Object.keys(top3Count[1])[0];
    const three = Object.keys(top3Count[2])[0];
    const four = Object.keys(top3Count[3])[0];
    const five = Object.keys(top3Count[4])[0];
    return (
        <div>
            <h2>{firstKey}</h2>
            <h2>{two}</h2>
            <h2>{three}</h2>
            <h2>{four}</h2>
            <h2>{five}</h2>
            <ul>
                {top3Counts.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            <h2>Filtered Data:</h2>
            <ul>
                {filteredData.map((item) => (
                    <li key={item.ASIN}>{item.ASIN}</li>
                ))}
            </ul>
        </div>
    );
}

export default YourComponent;
