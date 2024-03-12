import React from "react";
import Button from "react-bootstrap/Button";
import { saveAs } from "file-saver";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DownloadButton = ({ data1, data2, data3, data4, data5, data6 = [], data7 =[], data8 =[] }) => {
    const handleDownload = () => {
        try {
            const csvDataSheet1 = convertToCSV(data1);
            const csvDataSheet2 = convertToCSV(data2);
            const csvDataSheet3 = convertToCSV(data3);
            const csvDataSheet4 = convertToCSV(data4);
            const csvDataSheet5 = convertToCSV(data5);
            const csvDataSheet6 = convertToCSV(data6);
            const csvDataSheet7 = convertToCSV(data7);
            const csvDataSheet8 = convertToCSV(data8);

            const csvContent = `Sheet 1 Data(HTS_PT_ITK):\n${csvDataSheet1}\n\nSheet 2 Data (HTS_PT):\n${csvDataSheet2}\n\nSheet 3 Data(HTS_ITK):\n${csvDataSheet3}\n\nSheet 4 Data(HTS):\n${csvDataSheet4}\n\nSheet 5 Data(PT):\n${csvDataSheet5}\n\nSheet 6 Data(ITK):\n${csvDataSheet6}\n\nSheet 7 Data:\n${csvDataSheet7}\n\nSheet 8 Data:\n${csvDataSheet8}`;

            const blob = new Blob([csvContent], {
                type: "text/csv;charset=utf-8",
            });

            saveAs(blob, "data.csv");
            toast.success("Data downloaded successfully!");
        } catch (error) {
            console.error("Error downloading data:", error);
            toast.error("Error downloading data. Please try again.");
        }
    };

    const convertToCSV = (data) => {
        if (!data || data.length === 0) {
            return ""; // Return empty string if data is undefined or empty
        }

        const header = Object.keys(data[0]).join(",");
        const rows = data.map((obj) => {
            return Object.values(obj)
                .map((value) => {
                    if (typeof value === "string" && value.includes(",")) {
                        return `"${value}"`; // Add quotes if value contains comma
                    }
                    return value;
                })
                .join(",");
        });
        return `${header}\n${rows.join("\n")}`;
    };

    return (
        <>
            <Button variant="dark" onClick={handleDownload}>
                Download
            </Button>
            <ToastContainer />
        </>
    );
};

export default DownloadButton;
