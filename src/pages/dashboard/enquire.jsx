import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Typography } from "@material-tailwind/react";

export default function DynamicTable() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Replace this URL with your actual API endpoint
    axios.get("http://localhost:8000/api/v1/enquiries")
      .then((response) => {
        const data = response.data.data;

        if (Array.isArray(data) && data.length > 0) {
          setColumns([...Object.keys(data[0]), ""]); // "" for the Edit column
          setRows(data);
        } else {
          setColumns([]);
          setRows([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch data.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-blue-500">Loading table...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <Card className="h-full w-full overflow-auto">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {columns.map((head, index) => (
              <th
                key={index}
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {head || "Actions"}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const isLast = index === rows.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            return (
              <tr key={index}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {col === "" ? (
                        <a href="#" className="font-medium text-blue-500 hover:underline">
                          Edit
                        </a>
                      ) : (
                        row[col]
                      )}
                    </Typography>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
