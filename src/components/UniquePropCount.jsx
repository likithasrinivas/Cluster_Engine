import React from "react";
import Table from "react-bootstrap/Table";
import { Col } from "react-bootstrap";
import { calculateUniqueItemsCount } from "../utils/helper";

const UniqueItemsCount = ({ data, propertyName }) => {
    const uniqueItemsCount = calculateUniqueItemsCount(data, propertyName);

    return (
        <div>
            {data.length > 0 && (
                <Col md={6}>
                    <h2>Unique Items Count</h2>
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>ASIN</th>
                                <th>
                                    {propertyName === "HTS"
                                        ? "HS6"
                                        : propertyName}
                                </th>
                                <th>Count</th>
                                <th>Coverage (in %)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {uniqueItemsCount.map((item) => (
                                <tr key={item[propertyName]}>
                                    <td>{item.ASIN}</td>
                                    <td>{item[propertyName]}</td>
                                    <td>{item.count}</td>
                                    <td>
                                        {(
                                            (item.count / data.length) *
                                            100
                                        ).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            )}
        </div>
    );
};

export default UniqueItemsCount;
