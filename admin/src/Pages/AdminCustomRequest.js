import React, { useEffect, useState } from "react";

const AdminCustomRequests = () => {
  const [customRequests, setCustomRequests] = useState([]);

  useEffect(() => {
    fetch(`${backendUrl}/api/custom-box`)
      .then((res) => res.json())
      .then((data) => setCustomRequests(data))
      .catch((error) => console.error("Error fetching custom requests:", error));
  }, []);

  return (
    <div>
      <h2>Customer Custom Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Size</th>
            <th>Height</th>
            {/* <th>Weight</th>
            <th>Special Request</th> */}
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {customRequests.map((item, index) => (
            <tr key={index}>
              <td>{item.size || "N/A"}</td>
              {/* <td>{item.height || "N/A"}</td>
              <td>{item.weight || "N/A"}</td> */}
              <td>{item.specialRequest || "N/A"}</td>
              <td>{new Date(item.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCustomRequests;
