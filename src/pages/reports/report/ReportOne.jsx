import React, { useContext, useEffect, useRef, useState } from "react";
import { ContextPanel } from "../../../utils/ContextPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import Layout from "../../../layout/Layout";
import MUIDataTable from "mui-datatables";
import { IconButton } from "@material-tailwind/react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaRegFilePdf } from "react-icons/fa";

const ReportOne = () => {
  const [reportOne, setReportOne] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const tableRef = useRef(null);
  useEffect(() => {
    const fetchReprotOne = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const data = {
          cylinder_date_from: localStorage.getItem("cylinder_date_from"),
          cylinder_date_to: localStorage.getItem("cylinder_date_to"),
        };
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${BASE_URL}/api/fetch-report1-report`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReportOne(response.data?.cylinder);
        console.log("one report", response.data.cylinder);
      } catch (error) {
        console.error("Error fetching one report data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReprotOne();
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
      name: "cylinder_sub_company_no",
      label: "Code No",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "cylinder_sub_barcode",
      label: "R K Serial No",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "manufacturer_name",
      label: "Make",
      options: {
        filter: true,
        sort: false,
      },
    },

    {
      name: "cylinder_sub_manufacturer_month",
      label: "Month/Year",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const cylinder_sub_manufacturer_month = tableMeta.rowData[3];
          const cylinder_sub_manufacturer_year = tableMeta.rowData[4];
          return `${cylinder_sub_manufacturer_month}/${cylinder_sub_manufacturer_year}`;
        },
      },
    },
    {
      name: "cylinder_sub_manufacturer_year",
      label: "Year",
      options: {
        display: false,
      },
    },
    {
      name: "cylinder_sub_batch_no",
      label: "Batch No",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "cylinder_sub_weight",
      label: "Tare Weight",
      options: {
        filter: true,
        sort: false,
      },
    },
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,
    // pagination: false,
    search: false,
    filter: false,
    // rowsPerPage: 100000, // Set to a large number to show all rows
    // rowsPerPageOptions: [], // Empty array to hide rows per page dropdown
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 25],
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
          Report One
        </h3>
      </div>

      <div className="mt-5" ref={tableRef}>
        <MUIDataTable
          data={reportOne ? reportOne : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default ReportOne;
