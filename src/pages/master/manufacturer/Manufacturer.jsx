import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import MUIDataTable from "mui-datatables";
import { CiEdit } from "react-icons/ci";

// web-fetch-manufacturer-list
const Manufacturer = () => {
  const [manufacturerData, setManufactureData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchManuData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-manufacturer-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setManufactureData(response.data.manufacturer);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchManuData();
    setLoading(false);
  }, []);

  const columns = [
    {
      name: "slNo",
      label: "SL No",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          return tableMeta.rowIndex + 1;
        },
      },
    },
    {
      name: "manufacturer_name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "manufacturer_state",
      label: "State",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "manufacturer_mobile",
      label: "Mobile",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "manufacturer_email",
      label: "Email",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "manufacturer_status",
      label: "Status",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "id",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id) => {
          return (
            <div
              onClick={() => navigate(`/manufacturer-edit/${id}`)}
              className="flex items-center space-x-2"
            >
              <CiEdit title="Edit" className="h-5 w-5 cursor-pointer" />
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
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Manufacturer
        </h3>

        <Link
          to="/add-manufacturer"
          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
        >
          + Add Manufacturer
        </Link>
      </div>

      <div className="mt-5">
        <MUIDataTable
          data={manufacturerData ? manufacturerData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default Manufacturer;
