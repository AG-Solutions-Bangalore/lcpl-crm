import { useState } from "react";
import Layout from "../../../layout/Layout";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";

const ReportForm = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  var todayback = yyyy + "-" + mm + "-" + dd;
  const [cylinderDownload, setCylinderDownload] = useState({
    cylinder_date_from: "2024-09-14",
    cylinder_date_to: todayback,
  });
  const navigate = useNavigate();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setCylinderDownload((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const downloadReport = async (url, fileName) => {
    try {
      const data = {
        cylinder_date_from: cylinderDownload.cylinder_date_from,
        cylinder_date_to: cylinderDownload.cylinder_date_to,
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

  const onSubmit1 = (e) => {
    e.preventDefault();

    downloadReport(`${BASE_URL}/api/download-report1-report`, "report1.csv");
  };

  const onSubmit2 = (e) => {
    e.preventDefault();

    downloadReport(`${BASE_URL}/api/download-report2-report`, "report2.csv");
  };

  const onReportView1 = (e) => {
    e.preventDefault();
    localStorage.setItem(
      "cylinder_date_from",
      cylinderDownload.cylinder_date_from
    );
    localStorage.setItem("cylinder_date_to", cylinderDownload.cylinder_date_to);
    navigate("/report-one");
  };

  const onReportView2 = (e) => {
    e.preventDefault();

    localStorage.setItem(
      "cylinder_date_from",
      cylinderDownload.cylinder_date_from
    );
    localStorage.setItem("cylinder_date_to", cylinderDownload.cylinder_date_to);
    navigate("/report-two");
  };
  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Report
        </h3>
      </div>
      <div className="mt-5">
        <div className="flex justify-center">
          <div className="w-full  bg-white shadow-md rounded-lg p-6">
            <form id="addIndiv" autoComplete="off">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date
                  </label>
                  <TextField
                    fullWidth
                    required
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    name="cylinder_date_from"
                    value={cylinderDownload.cylinder_date_from}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date
                  </label>
                  <TextField
                    fullWidth
                    required
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    name="cylinder_date_to"
                    value={cylinderDownload.cylinder_date_to}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 justify-start">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-100 to-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
                  onClick={(e) => onSubmit1(e)}
                  disabled={isButtonDisabled}
                >
                  Download 1
                </Button>

                <Button
                  className="bg-gradient-to-r from-blue-100 to-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
                  onClick={(e) => onReportView1(e)}
                  disabled={isButtonDisabled}
                >
                  View 1
                </Button>

                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-100 to-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
                  onClick={(e) => onSubmit2(e)}
                  disabled={isButtonDisabled}
                >
                  Download 2
                </Button>

                <Button
                  className="bg-gradient-to-r from-blue-100 to-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
                  onClick={(e) => onReportView2(e)}
                  disabled={isButtonDisabled}
                >
                  View 2
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportForm;
