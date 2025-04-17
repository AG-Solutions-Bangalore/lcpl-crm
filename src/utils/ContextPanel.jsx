import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../base/BaseUrl";
import axios from "axios";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const [isPanelUp, setIsPanelUp] = useState(true);
  const [userInfo, setUserInfo] = useState({
    branchId: null,
    userTypeId: null,
  });

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkPanelStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/web-check-status`);
      const datas = await response.data;
      setIsPanelUp(datas);
      if (datas?.success) {
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    const branchId = localStorage.getItem("branchId");
    const userTypeId = localStorage.getItem("userTypeId");

    if (token && branchId && userTypeId) {
      setUserInfo({
        branchId: Number(branchId),
        userTypeId: Number(userTypeId),
      });
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    checkPanelStatus();
    const intervalId = setInterval(checkPanelStatus, 300000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentPath = location.pathname;

    if (error) {
      localStorage.clear();
      navigate("/maintenance");
    } else if (isPanelUp?.success) {
      if (token) {
        const allowedPaths = [
          "/profile",
          "/change-password",
          "/vendor",
          "/add-vendor",
          "/vendor-edit",
          "/manufacturer",
          "/cylinder",
          "/add-cylinder",
          "/add-sub-cylinder",
          "/cylinder-view",
          "/cylinder-edit",
          "/add-manufacturer",
          "/manufacturer-edit",
          "/vendor-report",
          "/manufacturer-report",
          "/report-form",
          "/report-one",
          "/report-two",
          "/cylinder-details",
          "/report-cylinder",
          "/view-cylinder",
          "/user-view-cylinder",
        ];
        const isAllowedPath = allowedPaths.some((path) =>
          currentPath.startsWith(path)
        );
        if (isAllowedPath) {
          navigate(currentPath);
        } else {
          if (
            (userInfo.branchId === 1 || userInfo.branchId === 2) &&
            userInfo.userTypeId === 1
          ) {
            navigate("/user-view-cylinder");
          } else if (
            (userInfo.branchId === 1 || userInfo.branchId === 2) &&
            userInfo.userTypeId === 2
          ) {
            navigate("/cylinder");
          } else {
            navigate("/");
          }
        }
      } else {
        if (
          currentPath === "/" ||
          currentPath === "/register" ||
          currentPath === "/forget-password"
        ) {
          navigate(currentPath);
        } else {
          navigate("/"); // Redirect to login if no token
        }
      }
    }
  }, [error, navigate, isPanelUp, location.pathname, userInfo]);

  return (
    <ContextPanel.Provider
      value={{ isPanelUp, setIsPanelUp, userInfo, setUserInfo }}
    >
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
