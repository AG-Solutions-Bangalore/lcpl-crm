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
import toast, { Toaster } from "react-hot-toast";

const ViewTaraWeight = () => {
  const [latestid, setLatestid] = useState("");
  const [latestidone, setLatestidone] = useState("");
  const [cylinders, setCylinders] = useState([]);
  const [subWeightData, setSubWeightData] = useState({
    cylinder_sub_weight: "",
    cylinder_sub_n_weight: "",
  });

  const [message, setMessage] = useState("");
  const testRef = useRef(null);
  const componentRef = useRef(null);
  const [loadingtara, setLoadingTara] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const [showmodal, setShowmodal] = useState(false);
  const [id, setId] = useState();
  const branchId = Number(localStorage.getItem("branchId"));
  const handleChange = (barcode, event) => {
    const { name, value } = event.target;
    setSubWeightData((prevData) => ({
      ...prevData,
      [barcode]: {
        ...prevData[barcode],
        [name]: value,
      },
    }));
  };

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
    setId(value);
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
      //   testRef.current.focus();
      setLatestid("");
    } catch (error) {
      console.error("Error fetching viewcylinder data", error);
      setMessage("Error fetching cylinder data.");
    } finally {
      setLoading(false);
    }
  };
  const onSubmit1 = async () => {
    try {
      setLoadingTara(true);
      const token = localStorage.getItem("token");
      console.log(subWeightData, "subWeightData");
      const response = await axios.put(
        `${BASE_URL}/api/web-update-cylinder-tareweight/${latestidone}`,
        subWeightData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.code == "200") {
        toast.success(response.data.msg || "Updated Sucessfully");
        setMessage("");
      } else {
        toast.error(response.data.msg || "Error Occurs");
      }
    } catch (error) {
      console.error("Error fetching viewcylinder data", error);
      //   setMessage("Error fetching cylinder data.");
    } finally {
      setLoadingTara(false);
    }
  };

  const checkBarcode = async (value) => {
    const barcodeId = value.trim();

    if (barcodeId.length >= 4 && barcodeId.length <= 6) {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-cylinder-by-scan/${barcodeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response?.data?.cylinderSub ?? [];
        console.log("Fetched Data:", data);

        if (data.length === 0) {
          setMessage("No cylinders found for the given ID.");
          setCylinders([]);
          setSubWeightData({});
        } else {
          setCylinders(data);

          const updatedWeights = {};
          data.forEach((item) => {
            if (item?.cylinder_sub_barcode) {
              updatedWeights = {
                cylinder_sub_weight: item[0].cylinder_sub_weight || "",
                cylinder_sub_n_weight: item[0].cylinder_sub_n_weight || "",
              };
            }
          });

          console.log("Weight Data:", updatedWeights);
          setSubWeightData(updatedWeights);
          setMessage("");
        }
        setLatestid(""); // Clear input
      } catch (err) {
        console.error("Error fetching barcode:", err);
        setMessage("Something went wrong while fetching data.");
      }
    } else {
      setMessage("Barcode Length must be between 4 to 6 characters.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <>
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
      <div className="p-4">
        <div className="text-2xl font-semibold mb-4">View Tara Cylinder</div>
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
                    label={"LCPL Serial No"}
                    name="cylinder_batch_nos"
                    value={latestid}
                    // onChange={(e) => {
                    //   setLatestid(e.target.value);
                    //   checkBarcode(e.target.value);
                    // }}
                    onChange={(e) => {
                      setLatestid(e.target.value);
                      setLatestidone(e.target.value);
                    }}
                    onBlur={(e) => {
                      checkBarcode(e.target.value);
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </div>
                <div className="w-full md:w-1/3 mb-4 flex ">
                  <Button
                    type="submit"
                    className="bg-blue-200 text-white p-4 rounded"
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Submit"}
                  </Button>

                  <Button
                    type="button"
                    className="bg-blue-200 text-white p-4 rounded"
                    color="primary"
                    onClick={handleLogout}
                  >
                    Logout
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
                      <>
                        <div
                          key={cylinder.cylinder_sub_barcode}
                          className="px-4  rounded-lg"
                        >
                          <table className="w-full border border-gray-300 mb-4">
                            <tbody>
                              <tr className="border-b border-gray-200">
                                <td className="p-2 font-semibold">
                                  LCPL Serial No
                                </td>
                                <td className="p-2">:</td>
                                <td className="p-2 font-semibold">
                                  {cylinder.cylinder_sub_barcode}
                                </td>
                                <td className="p-2 font-semibold">
                                  Cylinder No
                                </td>
                                <td className="p-2">:</td>
                                <td className="p-2 font-semibold">
                                  {cylinder.cylinder_sub_company_no}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="grid grid-cols-3 gap-4 m-4">
                          <div>
                            <TextField
                              label="Tare Weight"
                              name="cylinder_sub_weight"
                              inputProps={{
                                maxLength: 5,
                                pattern: "[0-9]*\\.?[0-9]*",
                              }}
                              value={
                                subWeightData[cylinder.cylinder_sub_barcode]
                                  ?.cylinder_sub_weight || ""
                              }
                              onChange={(e) =>
                                handleChange(cylinder.cylinder_sub_barcode, e)
                              }
                              fullWidth
                              variant="outlined"
                            />
                          </div>

                          <div>
                            <TextField
                              label="New Tare Weight(Kg)"
                              name="cylinder_sub_n_weight"
                              key={subWeightData?.cylinder_sub_n_weight}
                              value={
                                subWeightData[cylinder.cylinder_sub_barcode]
                                  ?.cylinder_sub_n_weight || ""
                              }
                              onChange={(e) =>
                                handleChange(cylinder.cylinder_sub_barcode, e)
                              }
                              fullWidth
                              variant="outlined"
                            />
                          </div>

                          <div className="w-full md:w-1/3 mb-4">
                            <Button
                              type="button"
                              className="bg-blue-200 text-white p-4 rounded"
                              color="primary"
                              onClick={() => onSubmit1()}
                            >
                              {loadingtara ? "Updatting..." : "Update"}
                            </Button>
                          </div>
                        </div>
                      </>
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
    </>
  );
};

export default ViewTaraWeight;

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
import toast, { Toaster } from "react-hot-toast";

const ViewTaraWeight = () => {
  const [latestid, setLatestid] = useState("");
  const [latestidone, setLatestidone] = useState("");
  const [cylinders, setCylinders] = useState([]);
  const [subWeightData, setSubWeightData] = useState({
    cylinder_sub_weight: "",
    cylinder_sub_n_weight: "",
  });

  const [message, setMessage] = useState("");
  const testRef = useRef(null);
  const componentRef = useRef(null);
  const [loadingtara, setLoadingTara] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const [showmodal, setShowmodal] = useState(false);
  const [id, setId] = useState();
  const branchId = Number(localStorage.getItem("branchId"));
  const handleChange = (event) => {
    const { name, value } = event.target;
    setSubWeightData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
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
      //   testRef.current.focus();
      setLatestid("");
    } catch (error) {
      console.error("Error fetching viewcylinder data", error);
      setMessage("Error fetching cylinder data.");
    } finally {
      setLoading(false);
    }
  };
  const onSubmit1 = async () => {
    try {
      setLoadingTara(true);
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${BASE_URL}/api/web-update-cylinder-tareweight/${latestidone}`,
        subWeightData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.code == "200") {
        toast.success(response.data.msg || "Updated Sucessfully");
        setMessage("");
      } else {
        toast.error(response.data.msg || "Error Occurs");
      }
    } catch (error) {
      console.error("Error fetching viewcylinder data", error);
      //   setMessage("Error fetching cylinder data.");
    } finally {
      setLoadingTara(false);
    }
  };

  const checkBarcode = async (value) => {
    const barcodeId = value;
    if (
      barcodeId.length === 6 ||
      barcodeId.length === 5 ||
      barcodeId.length === 4
    ) {
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
        const data = response?.data?.cylinderSub[0];
        setCylinders(response.data?.cylinderSub);
        setSubWeightData({
          cylinder_sub_weight: data?.cylinder_sub_weight,
          cylinder_sub_n_weight: data?.cylinder_sub_n_weight,
        });
        setMessage("");
      }
      //   testRef.current.focus();
      setLatestid("");
    } else {
      setMessage("Barcode Length must be 4 to 6");
    }
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <>
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
      <div className="p-4">
        <div className="text-2xl font-semibold mb-4">View Tara Cylinder</div>
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
                    label={"LCPL Serial No"}
                    name="cylinder_batch_nos"
                    value={latestid}
                    // onChange={(e) => {
                    //   setLatestid(e.target.value);
                    //   checkBarcode(e.target.value);
                    // }}
                    onChange={(e) => {
                      setLatestid(e.target.value);
                      setLatestidone(e.target.value);
                    }}
                    onBlur={(e) => {
                      checkBarcode(e.target.value);
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </div>
                <div className="w-full md:w-1/3 mb-4 flex">
                  <Button
                    type="submit"
                    className="bg-blue-200 text-white p-4 rounded"
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Submit"}
                  </Button>

                  <Button
                    type="button"
                    className="bg-blue-200 text-white p-4 rounded"
                    color="primary"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </form>
            {message && (
              <div className="text-red-500 font-semibold mb-4">{message}</div>
            )}
            {/* <div className="mt-4" ref={componentRef}>
              <div className="space-y-4">
                {cylinders.length > 0
                  ? cylinders.map((cylinder) => (
                      <>
                        <div
                          key={cylinder.cylinder_sub_barcode}
                          className="px-4  rounded-lg"
                        >
                          <table className="w-full border border-gray-300 mb-4">
                            <tbody>
                              <tr className="border-b border-gray-200">
                                <td className="p-2 font-semibold">
                                  LCPL Serial No
                                </td>
                                <td className="p-2">:</td>
                                <td className="p-2 font-semibold">
                                  {cylinder.cylinder_sub_barcode}
                                </td>
                                <td className="p-2 font-semibold">
                                  Cylinder No
                                </td>
                                <td className="p-2">:</td>
                                <td className="p-2 font-semibold">
                                  {cylinder.cylinder_sub_company_no}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="grid grid-cols-3 gap-4 m-4">
                          <div>
                            <TextField
                              label="Tare Weight"
                              name="cylinder_sub_weight"
                              inputProps={{
                                maxLength: 5,
                                pattern: "[0-9]*\\.?[0-9]*",
                              }}
                              value={subWeightData.cylinder_sub_weight}
                              onChange={handleChange}
                              fullWidth
                              variant="outlined"
                            />
                          </div>

                          <div>
                            <TextField
                              label="New Tare Weight(Kg)"
                              name="cylinder_sub_n_weight"
                              value={subWeightData.cylinder_sub_n_weight}
                              onChange={handleChange}
                              fullWidth
                              variant="outlined"
                            />
                          </div>

                          <div className="w-full md:w-1/3 mb-4">
                            <Button
                              type="button"
                              className="bg-blue-200 text-white p-4 rounded"
                              color="primary"
                              onClick={() => onSubmit1()}
                            >
                              {loadingtara ? "Updatting..." : "Update"}
                            </Button>
                          </div>
                        </div>
                      </>
                    ))
                  : ""}
              </div>
            </div> */}

            <div className="mt-4" ref={componentRef}>
              <div className="space-y-4">
                {cylinders.length > 0
                  ? cylinders.map((cylinder) => (
                      <div
                        key={cylinder.cylinder_sub_barcode}
                        className="flex items-center space-x-4 mb-4 px-4 rounded-lg"
                      >
                        {/* LCPL Serial No */}
                        <div className="font-semibold">
                          LCPL Serial No:{" "}
                          <span>{cylinder.cylinder_sub_barcode}</span>
                        </div>

                        {/* Cylinder No */}
                        <div className="font-semibold">
                          Cylinder No:{" "}
                          <span>{cylinder.cylinder_sub_company_no}</span>
                        </div>

                        {/* Tare Weight Input */}
                        <div className="flex-1">
                          <TextField
                            label="Tare Weight"
                            name="cylinder_sub_weight"
                            inputProps={{
                              maxLength: 5,
                              pattern: "[0-9]*\\.?[0-9]*",
                            }}
                            value={subWeightData.cylinder_sub_weight}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                          />
                        </div>

                        {/* New Tare Weight Input */}
                        <div className="flex-1">
                          <TextField
                            label="New Tare Weight(Kg)"
                            name="cylinder_sub_n_weight"
                            value={subWeightData.cylinder_sub_n_weight}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                          />
                        </div>

                        {/* Update Button */}
                        <div>
                          <Button
                            type="button"
                            className="bg-blue-200 text-white p-4 rounded"
                            color="primary"
                            onClick={() => onSubmit1()}
                          >
                            {loadingtara ? "Updatting..." : "Update"}
                          </Button>
                        </div>
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
    </>
  );
};

export default ViewTaraWeight;

