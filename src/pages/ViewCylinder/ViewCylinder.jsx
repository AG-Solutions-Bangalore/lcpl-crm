import { useState, useRef, useContext, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { FaRegCalendarAlt, FaIndustry, FaWeightHanging } from "react-icons/fa";
import Moment from "moment";
import Layout from "../../layout/Layout";
import { ContextPanel } from "../../utils/ContextPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";

import { Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";
import ScannerModel from "../../components/ScannerModel";
import { QrCodeIcon } from "lucide-react";

const ViewCylinder = () => {
  const [latestid, setLatestid] = useState("");
  const [cylinders, setCylinders] = useState([]);
  const [message, setMessage] = useState("");
  const testRef = useRef(null);
  const componentRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const [showmodal, setShowmodal] = useState(false);
  const [id, setId] = useState();
  const branchId = Number(localStorage.getItem("branchId"));

  const closegroupModal = () => {
    console.log("Closing modal");
    setShowmodal(false);
    // window.location.reload();
  };

  const openmodal = () => {
    console.log("Opening modal");
    setShowmodal(true);
  };

  const barcodeScannerValue = (value) => {
    console.log("Barcode scanned:", value);
    setShowmodal(false);
    // setId(value);
    checkBarcode(value);
  };

  // for barcode only
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-cylinder-by-scan/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCylinders(response.data.cylinderSub);
    };
    if (id) {
      fetchData();
      return;
    }
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-cylinder-by-scan/${latestid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.cylinderSub.length === 0) {
        setMessage("No cylinders found for the given ID.");
        setCylinders([]);
      } else {
        setCylinders(response.data.cylinderSub);
        setMessage("");
      }
      testRef.current.focus();
      setLatestid("");
    } catch (error) {
      console.error("Error fetching viewcylinder data", error);
      setMessage("Error fetching cylinder data.");
    } finally {
      setLoading(false);
    }
  };

  // const checkBarcode = async (value) => {
  //   const barcodeId = value;
  //   if (barcodeId.length === 6) {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.get(
  //       `${BASE_URL}/api/web-fetch-cylinder-by-scan/${barcodeId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     setCylinders(response.data.cylinderSub);
  //     testRef.current.focus();
  //     setLatestid("");
  //   }
  // };

  const checkBarcode = async (value) => {
    const barcodeId = value;
    if (barcodeId.length === 6 || barcodeId.length === 5 || barcodeId.length === 4) {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-cylinder-by-scan/${barcodeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.cylinderSub.length === 0) {
        setMessage("No cylinders found for the given ID.");
        setCylinders([]);
      } else {
        setCylinders(response.data.cylinderSub);
        setMessage("");
      }
      testRef.current.focus();
      setLatestid("");
    }else{
      setMessage("Barcode Length must be 4 to 6");
    }
    // } else if (barcodeId.length === 0) {
    //   setMessage("Please enter a valid barcode ID.");
    // }
  };  

  return (
    <Layout>
      <div className="p-4">
        <div className="text-2xl font-semibold mb-4">View Cylinder</div>
        <div className="mb-4">
          <div className="card bg-white shadow-md rounded-lg p-4">
            <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
              <div className="flex flex-wrap">
                <div className="w-full md:w-1/3 mb-4 flex items-center">
                  {branchId === 1 ? (
                    <QrCodeIcon

                      className="mdi mdi-barcode-scan mdi-48px menu-icon"
                      style={{ cursor: "pointer", marginRight: "1rem" }}
                      onClick={openmodal}
                    ></QrCodeIcon>
                  ) : (
                    ""
                  )}
                  <TextField
                    id="select-corrpreffer"
                    autoFocus
                    inputRef={testRef}
                    required
                    label={branchId === 1 ? "R K Serial No" : "Cylinder No"}
                    name="cylinder_batch_nos"
                    value={latestid}
                    // onChange={(e) => {
                    //   setLatestid(e.target.value);
                    //   checkBarcode(e.target.value);
                    // }}
                    onChange={(e) => {
                      setLatestid(e.target.value);
                    }}
                    onBlur={(e) => {
                      checkBarcode(e.target.value);
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </div>
                <div className="w-full md:w-1/3 mb-4">
                  <Button
                    type="submit"
                    className="bg-blue-200 text-white p-4 rounded"
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Submit"}
                  </Button>
                </div>
              </div>
            </form>
            {message && (
              <div className="text-red-500 font-semibold mb-4">{message}</div>
            )}
            <div className="mt-4" ref={componentRef}>
              <div className="space-y-4">
                {cylinders.length > 0
                  ? cylinders.map((cylinder) => (
                      <div
                        key={cylinder.cylinder_sub_barcode}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex flex-wrap mb-4">
                          <div className="w-full md:w-1/2 mb-2 md:mb-0 flex items-center">
                            <FaIndustry className="mr-2" />
                            <span className="font-bold">Vendor:</span>{" "}
                            <span>{cylinder.vendor_name}</span>
                          </div>
                          <div className="w-full md:w-1/4 mb-2 md:mb-0 flex items-center">
                            <FaWeightHanging className="mr-2" />
                            <span className="font-bold">Weight:</span>{" "}
                            <span>{cylinder.cylinder_sub_weight}</span>
                          </div>
                          <div className="w-full md:w-1/4 flex items-center">
                            <FaRegCalendarAlt className="mr-2" />
                            <span className="font-bold">Date:</span>{" "}
                            <span>
                              {Moment(cylinder.cylinder_date).format(
                                "DD-MM-YYYY"
                              )}
                            </span>
                          </div>
                        </div>
                        <table className="w-full border border-gray-300 mb-4">
                          <tbody>
                            <tr className="border-b border-gray-200">
                              <td className="p-2 font-semibold">
                                RK Serial No
                              </td>
                              <td className="p-2">:</td>
                              <td className="p-2 font-semibold">
                                {cylinder.cylinder_sub_barcode}
                              </td>
                              <td className="p-2 font-semibold">Batch No</td>
                              <td className="p-2">:</td>
                              <td className="p-2 font-semibold">
                                {cylinder.cylinder_sub_batch_no}
                              </td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="p-2 font-semibold">Cylinder No</td>
                              <td className="p-2">:</td>
                              <td className="p-2 font-semibold">
                                {cylinder.cylinder_sub_company_no}
                              </td>
                              <td className="p-2 font-semibold">Month/Year</td>
                              <td className="p-2">:</td>
                              <td className="p-2 font-semibold">
                                {cylinder.cylinder_sub_manufacturer_month}/
                                {cylinder.cylinder_sub_manufacturer_year}
                              </td>
                            </tr>
                            <tr>
                              <td className="p-2 font-semibold">
                                Manufacturer
                              </td>
                              <td className="p-2">:</td>
                              <td className="p-2 font-semibold">
                                {cylinder.manufacturer_name}
                              </td>
                              <td className="p-2 font-semibold">
                                R K Batch No
                              </td>
                              <td className="p-2">:</td>
                              <td className="p-2 font-semibold">
                                {cylinder.cylinder_batch_nos}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ))
                  : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for barcode scanner */}
      <Dialog open={showmodal} handler={closegroupModal} size="lg">
        <DialogBody className="h-[60vh] md:h-[75vh] lg:h-[85vh] p-4 flex justify-center">
          <ScannerModel barcodeScannerValue={barcodeScannerValue} />
        </DialogBody>
        <DialogFooter className="flex justify-between">
          <button
            onClick={closegroupModal}
            className="px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer"
          >
            Close
          </button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
};

export default ViewCylinder;
