import React, { useContext, useEffect } from "react";
import { Button, TextField, MenuItem } from "@mui/material";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const status = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Inactive",
    label: "Inactive",
  },
];

const EditManufacturer = () => {
  const [manufacturer, setManufacturer] = useState({
    manufacturer_name: "",
    manufacturer_mobile: "",
    manufacturer_email: "",
    manufacturer_address: "",
    manufacturer_state: "",
    manufacturer_status: "",
  });

  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const { id } = useParams();

  const onInputChange = (e) => {
    setManufacturer({ ...manufacturer, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchManufactureId = async () => {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-manufacturer-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setManufacturer(response.data.manufacturer);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchManufactureId();
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    setLoading(true);
    try {
      const data = {
        manufacturer_name: manufacturer.manufacturer_name,
        manufacturer_address: manufacturer.manufacturer_address,
        manufacturer_state: manufacturer.manufacturer_state,
        manufacturer_mobile: manufacturer.manufacturer_mobile,
        manufacturer_email: manufacturer.manufacturer_email,
        manufacturer_status: manufacturer.manufacturer_status,
      };
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/api/web-update-manufacturer/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.code == "200") {
        toast.success("Manufacture Edited Succesfully");
        navigate("/manufacturer");
      } else {
        toast.error("error");
      }
    } catch (error) {
      console.error("Error creating maufacturer", error);
    } finally {
      setLoading(false);
    }
  };

  // web-fetch-manufacturer-by-id/" + params.id,

  //web-update-manufacturer
  return (
    <Layout>
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "green",
            },
          },
          error: {
            style: {
              background: "red",
            },
          },
        }}
        position="top-right"
        reverseOrder={false}
      />
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-2xl font-bold">Edit Manufacturer</h3>
        </div>
        <div className="bg-white p-6 shadow rounded-md">
          <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1">
                <div className="mb-4">
                  <TextField
                    fullWidth
                    required
                    label="Full Name"
                    autoComplete="Name"
                    name="manufacturer_name"
                    value={manufacturer.manufacturer_name}
                    onChange={onInputChange}
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="mb-4">
                  <TextField
                    fullWidth
                    label="Mobile"
                    autoComplete="Name"
                    name="manufacturer_mobile"
                    value={manufacturer.manufacturer_mobile}
                    onChange={onInputChange}
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="mb-4">
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    autoComplete="Name"
                    name="manufacturer_email"
                    value={manufacturer.manufacturer_email}
                    onChange={onInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <TextField
                fullWidth
                label="Address"
                autoComplete="Name"
                name="manufacturer_address"
                value={manufacturer.manufacturer_address}
                onChange={onInputChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1">
                <div className="mb-4">
                  <TextField
                    fullWidth
                    label="State"
                    autoComplete="Name"
                    name="manufacturer_state"
                    value={manufacturer.manufacturer_state}
                    onChange={onInputChange}
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="mb-4">
                  <TextField
                    fullWidth
                    label="Status"
                    autoComplete="Name"
                    name="manufacturer_status"
                    select
                    value={manufacturer.manufacturer_status}
                    onChange={onInputChange}
                  >
                    {status.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button
                type="submit"
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? (
                  "Updating..."
                ) : (
                  <>
                    <FaCheck className="mr-2" />
                    Update
                  </>
                )}
              </Button>
              <Link to="../manufacturer">
                <Button className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                  <FaTimes className="mr-2" />
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditManufacturer;
