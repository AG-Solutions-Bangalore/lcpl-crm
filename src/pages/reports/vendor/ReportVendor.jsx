import React, { useContext, useEffect, useRef, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import MUIDataTable from "mui-datatables";
import { IconButton } from "@material-tailwind/react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaRegFilePdf } from "react-icons/fa";

const ReportVendor = () => {
  const [vendorReport, setVendorReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchVendorReprot = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${BASE_URL}/api/fetch-vendor-report`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setVendorReport(response.data?.vendor);
        console.log("vendor report", response.data.vendor);
      } catch (error) {
        console.error("Error fetching vendor report data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendorReprot();
    setLoading(false);
  }, []);

  const handleSavePDF = () => {
    const input = tableRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("vendor-report.pdf");
    });
  };
  const columns = [
    {
      name: "vendor_name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "vendor_address",
      label: "Address",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "vendor_state",
      label: "State",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "vendor_mobile",
      label: "Mobile",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "vendor_email",
      label: "Email",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "vendor_status",
      label: "Status",
      options: {
        filter: true,
        sort: false,
      },
    },
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,
    pagination: false,
    search: false,
    filter: false,
    rowsPerPage: 100000, // Set to a large number to show all rows
    rowsPerPageOptions: [], // Empty array to hide rows per page dropdown
    // rowsPerPage: 5,
    // rowsPerPageOptions: [5, 10, 25],
    responsive: "standard",
    viewColumns: false,
    // Add custom toolbar for PDF export
    // Add custom toolbar for PDF export
    customToolbar: () => {
      return (
        <IconButton
          onClick={handleSavePDF}
          title="Save as PDF"
          className="bg-white text-black"
        >
          <FaRegFilePdf className="w-5 h-5" />
        </IconButton>
      );
    },
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Vendor Report
        </h3>
      </div>

      <div className="mt-5" ref={tableRef}>
        <MUIDataTable
          data={vendorReport ? vendorReport : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default ReportVendor;
