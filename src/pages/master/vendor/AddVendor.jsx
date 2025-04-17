import { Button, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import toast, { Toaster } from "react-hot-toast";

const AddVendor = () => {
  const [vendor, setVendor] = useState({
    vendor_name: "",
    vendor_mobile: "",
    vendor_email: "",
    vendor_state: "",
    vendor_address: "",
  });
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  const onInputChange = (e) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/web-create-vendor`,
        vendor,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.code == "200") {
        toast.success("Vendor Added");
        navigate("/vendor");
      } else {
        toast.error("error");
      }
    } catch (error) {
      console.error("Error creating maufacturer", error);
    } finally {
      setLoading(false);
    }
  };

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
          <h3 className="text-2xl font-bold">Add Vendor</h3>
        </div>
        <div className="grid grid-cols-1">
          <div className="bg-white p-6 shadow rounded-md">
            <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="mb-4">
                    <TextField
                      fullWidth
                      required
                      label="Vendor Name"
                      autoComplete="Name"
                      name="vendor_name"
                      value={vendor.vendor_name}
                      onChange={onInputChange}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <TextField
                      fullWidth
                      label="Mobile No"
                      autoComplete="Name"
                      name="vendor_mobile"
                      value={vendor.vendor_mobile}
                      onChange={onInputChange}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <TextField
                      fullWidth
                      type="email"
                      label="Email"
                      autoComplete="Name"
                      name="vendor_email"
                      value={vendor.vendor_email}
                      onChange={onInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="mb-4">
                    <TextField
                      fullWidth
                      label="State"
                      autoComplete="Name"
                      name="vendor_state"
                      value={vendor.vendor_state}
                      onChange={onInputChange}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="mb-4">
                    <TextField
                      fullWidth
                      label="Address"
                      autoComplete="Name"
                      name="vendor_address"
                      value={vendor.vendor_address}
                      onChange={onInputChange}
                    />
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
                    "Submitting..."
                  ) : (
                    <>
                      <FaCheck className="mr-2" />
                      Submit
                    </>
                  )}
                </Button>
                <Link to="vendor">
                  <Button className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                    <FaTimes className="mr-2" />
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddVendor;
