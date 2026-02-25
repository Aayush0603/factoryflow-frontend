import React, { useEffect, useState } from "react";
import API from "../api";

function Inquiries() {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await API.get("/admin/inquiries");
      setInquiries(res.data);
    } catch (error) {
      console.error("Error fetching inquiries");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Customer Inquiries</h2>

      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inq) => (
            <tr key={inq._id}>
              <td>{inq.name}</td>
              <td>{inq.email}</td>
              <td>{inq.phone}</td>
              <td>{inq.product?.name}</td>
              <td>{inq.quantity}</td>
              <td>{new Date(inq.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inquiries;