import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { TextField, MenuItem, Button } from "@mui/material";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { ContextPanel } from "../../../utils/ContextPanel";
import { useNavigate } from "react-router-dom";

const FormCylinderDetails = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  var todayback = yyyy + "-" + mm + "-" + dd;
  const [cylinderDownload, setCylinderDownload] = useState({
    cylinder_date_from: "2024-09-14",
    cylinder_date_to: todayback,
    cylinder_vendor_id: "",
    cylinder_sub_barcode: "",
  });

  const [vendor, setVendor] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Handle input change
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setCylinderDownload({
      ...cylinderDownload,
      [name]: value,
    });


  };

  useEffect(() => {
    const fetchVend = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/web-fetch-vendor`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setVendor(response.data?.vendor);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVend();
    setLoading(false);
  }, []);

  const downloadReport = async (url, fileName) => {
    try {
      const data = {
        cylinder_date_from: localStorage.getItem("cylinder_date_from"),
        cylinder_date_to: localStorage.getItem("cylinder_date_to"),
        cylinder_vendor_id: localStorage.getItem("cylinder_vendor_id"),
        cylinder_sub_barcode: localStorage.getItem("cylinder_sub_barcode"),
      };
      const token = localStorage.getItem("token");
      const res = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      console.log(`${fileName} downloaded successfully.`);
    } catch (err) {
      console.error(`Error downloading ${fileName}:`, err);
    }
  };

  // download
  const onSubmit = (e) => {
    e.preventDefault();
    downloadReport(
      `${BASE_URL}/api/download-cylinder-details-report`,
      "cylinder-report.csv"
    );
  };

  //  report view
  const onReportView = (e) => {
    e.preventDefault();
    localStorage.setItem(
      "cylinder_date_from",
      cylinderDownload.cylinder_date_from
    );
    localStorage.setItem("cylinder_date_to", cylinderDownload.cylinder_date_to);
    localStorage.setItem(
      "cylinder_vendor_id",
      cylinderDownload.cylinder_vendor_id
    );
    localStorage.setItem(
      "cylinder_sub_barcode",
      cylinderDownload.cylinder_sub_barcode
    );

    navigate("/report-cylinder");
  };
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold">Cylinder Details Report</h3>
        </div>
        <div className="grid gap-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <form id="addIndiv" autoComplete="off">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="form-group">
                  <TextField
                    fullWidth
                    required
                    label="From Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    autoComplete="off"
                    name="cylinder_date_from"
                    value={cylinderDownload.cylinder_date_from}
                    onChange={onInputChange}
                  />
                </div>
                <div className="form-group">
                  <TextField
                    fullWidth
                    required
                    label="To Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    autoComplete="off"
                    name="cylinder_date_to"
                    value={cylinderDownload.cylinder_date_to}
                    onChange={onInputChange}
                  />
                </div>
                <div className="form-group">
                  <TextField
                    fullWidth
                    label="Vendor Name"
                    autoComplete="off"
                    select
                    name="cylinder_vendor_id"
                    value={cylinderDownload.cylinder_vendor_id}
                    onChange={onInputChange}
                  >
                    {vendor.map((vendorName) => (
                      <MenuItem key={vendorName.id} value={vendorName.id}>
                        {vendorName.vendor_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="form-group">
                  <TextField
                    fullWidth
                    label="R K Batch No"
                    autoComplete="off"
                    name="cylinder_sub_barcode"
                    value={cylinderDownload.cylinder_sub_barcode}
                    onChange={onInputChange}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-start gap-5">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-100 to-red-300 text-white py-2 px-4 rounded-md mr-4"
                  onClick={onSubmit}
                  disabled={isButtonDisabled}
                >
                  Download
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-100 to-indigo-300 text-white py-2 px-4 rounded-md"
                  onClick={onReportView}
                  disabled={isButtonDisabled}
                >
                  View
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FormCylinderDetails;
