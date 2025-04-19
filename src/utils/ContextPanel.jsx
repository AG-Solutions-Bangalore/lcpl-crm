import { createContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../base/BaseUrl";

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
  const hasRedirected = useRef(false);

  // ✅ Check panel status
  const checkPanelStatus = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/web-check-status`);
      setIsPanelUp(data);
      setError(!data?.success);
    } catch {
      setError(true);
    }
  };

  // ✅ Load user info on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const branchId = localStorage.getItem("branchId");
    const userTypeId = localStorage.getItem("userTypeId");

    if (token && branchId && userTypeId) {
      setUserInfo({
        branchId: Number(branchId),
        userTypeId: Number(userTypeId),
      });
    }
  }, []);

  // ✅ Set interval to check panel status
  useEffect(() => {
    checkPanelStatus();
    const intervalId = setInterval(checkPanelStatus, 300000);
    return () => clearInterval(intervalId);
  }, []);

  // ✅ Handle routing based on panel status, token, and path
  useEffect(() => {
    if (hasRedirected.current) return;

    const token = localStorage.getItem("token");
    const currentPath = location.pathname;

    if (error) {
      localStorage.clear();
      hasRedirected.current = true;
      navigate("/maintenance");
      return;
    }

    if (!isPanelUp?.success) return;

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
      "/view-tara-weight",
    ];

    const isPublicPath = ["/", "/register", "/forget-password"].includes(
      currentPath
    );
    const isAllowedPath = allowedPaths.some((path) =>
      currentPath.startsWith(path)
    );

    if (!token) {
      if (!isPublicPath) {
        hasRedirected.current = true;
        navigate("/");
      }
      return;
    }

    // User is logged in
    if (isAllowedPath) return;

    if (
      (userInfo.branchId === 1 || userInfo.branchId === 2) &&
      userInfo.userTypeId === 1
    ) {
      hasRedirected.current = true;
      navigate("/user-view-cylinder");
    } else if (
      (userInfo.branchId === 1 || userInfo.branchId === 2) &&
      userInfo.userTypeId === 2
    ) {
      hasRedirected.current = true;
      navigate("/cylinder");
    } else {
      hasRedirected.current = true;
      navigate("/");
    }
  }, [error, isPanelUp, location.pathname, userInfo, navigate]);

  return (
    <ContextPanel.Provider
      value={{ isPanelUp, setIsPanelUp, userInfo, setUserInfo }}
    >
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
