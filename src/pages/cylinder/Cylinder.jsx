import React, { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import BASE_URL from "../../base/BaseUrl";
import { ContextPanel } from "../../utils/ContextPanel";
import { CiSquarePlus } from "react-icons/ci";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import Moment from "moment";

const Cylinder = () => {
  const [cylinderData, setCylinderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCylData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-cylinder-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCylinderData(response.data.cylinder);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCylData();
    setLoading(false);
  }, []);

  const columns = [
    {
      name: "vendor_name",
      label: <span className="text-[10px] md:text-[12px]">Vendor</span>,

      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          return (
            <span className="font-semibold text-slate-800 text-[10px] md:text-[12px]">
              {value}
            </span>
          );
        },
      },
    },

    {
      name: "cylinder_count",
      label: <span className="text-[10px] md:text-[12px]">Cyl Count</span>,

      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const cylinderQnty = tableMeta.rowData[3];
          const cylinderSize = tableMeta.rowData[4];

          return (
            <div className="flex flex-col p-0">
              <span className="font-semibold text-slate-800 text-[10px] md:text-[12px]">
                {value}
              </span>
              <span className="text-slate-500 text-[10px] md:text-[12px] w-[3rem]">
                {" "}
                Qty: {cylinderQnty}
              </span>
              <span className="text-slate-500 text-[10px] md:text-[12px]">
                {" "}
                Size: {cylinderSize}
              </span>
            </div>
          );
        },
      },
    },
    {
      name: "cylinder_batch_nos",
      label: <span className="text-[10px] md:text-[12px]">LCPL Batch no</span>,
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const serialNoFrom = tableMeta.rowData[5];

          const serialNoTo = tableMeta.rowData[6];
          return (
            <div className="flex flex-col">
              <span className="font-semibold text-slate-800 text-[10px] md:text-[12px]">
                {value}
              </span>
              <span className="text-slate-500 text-[10px] md:text-[12px]">
                {" "}
                From: {serialNoFrom}
              </span>
              <span className="text-slate-500 text-[10px] md:text-[12px]">
                To: {serialNoTo}
              </span>
            </div>
          );
        },
      },
    },

    {
      name: "cylinder_qnty",
      label: "Quantity",
      options: {
        filter: true,
        sort: false,
        display: false,
      },
    },
    {
      name: "cylinder_size",
      label: "Size",
      options: {
        filter: true,
        sort: false,
        display: false,
      },
    },
    {
      name: "cylinder_serial_from_no",
      label: "From",
      options: {
        filter: true,
        sort: false,
        display: false,
      },
    },
    {
      name: "cylinder_serial_to_no",
      label: "To",
      options: {
        filter: true,
        sort: false,
        display: false,
      },
    },
    {
      name: "id",
      label: <span className="text-[10px] md:text-[12px]">Action</span>,

      options: {
        filter: false,
        sort: false,
        customBodyRender: (id) => {
          return (
            <div className="flex items-center space-x-2">
              <CiSquarePlus
                onClick={() => navigate(`/add-sub-cylinder/${id}`)}
                title="Add Cylinder Info"
                className="h-5 w-5 cursor-pointer"
              />
              <MdOutlineRemoveRedEye
                onClick={() => {
                  localStorage.setItem("viewedCylinderId", id);
                  navigate(`/cylinder-view/${id}`);
                }}
                title="View Cylinder Info"
                className="h-5 w-5 cursor-pointer"
              />
            </div>
          );
        },
      },
    },
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 25],
    responsive: "standard",
    viewColumns: false,
    download: false,
    print: false,
    state: {
      isLoading: loading,
    },
  };
  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Cylinder List
        </h3>

        <Link
          to="/add-cylinder"
          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
        >
          + Create
        </Link>
      </div>
      <div className="mt-5">
        <MUIDataTable
          data={cylinderData ? cylinderData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default Cylinder;
