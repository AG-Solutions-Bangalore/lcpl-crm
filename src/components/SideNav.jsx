import { Link, NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon,
  TableCellsIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { useEffect, useRef } from "react";
import {
  MdOutlineGasMeter,
  MdOutlinePrecisionManufacturing,
  MdOutlineViewInAr,
} from "react-icons/md";
import { CiShop } from "react-icons/ci";
import { FaShop } from "react-icons/fa6";
import { TbReport, TbReportAnalytics, TbReportSearch } from "react-icons/tb";
import { HiOutlineDocumentReport } from "react-icons/hi";
const SideNav = ({ openSideNav, setOpenSideNav }) => {
  const sidenavRef = useRef(null);
  const { pathname } = useLocation();

  // Hardcoded sidenavType to "dark"
  const sidenavType = "dark";
  const branchId = localStorage.getItem("branchId");
  const userTypeId = localStorage.getItem("userTypeId");
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-blue-300 to-blue-900 shadow-lg shadow-blue-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  // close sidebar when clicking outside

  useEffect(() => {
    function handClickOutside(e) {
      if (sidenavRef.current && !sidenavRef.current.contains(e.target)) {
        setOpenSideNav(false);
      }
    }

    document.addEventListener("mousedown", handClickOutside);
    return () => {
      document.removeEventListener("mousedown", handClickOutside);
    };
  }, [setOpenSideNav]);

  // Close sidebar on route change
  useEffect(() => {
    setOpenSideNav(false);
  }, [pathname, setOpenSideNav]);

  return (
    <aside
      ref={sidenavRef}
      className={`${sidenavTypes[sidenavType]} ${
        openSideNav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-[272px] rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div className={`relative`}>
        <Link to="/cylinder" className="flex items-center justify-center p-4">
          <div className="flex items-center bg-gradient-to-br from-blue-300 to-blue-900 rounded-lg">
            <img src="/lcpllogo.png" alt="Logo" className="h-12 w-auto" />
          </div>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSideNav(false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-4">
        <ul className="mb-4 flex flex-col gap-1">
          <li>
            <NavLink to="/manufacturer">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <MdOutlinePrecisionManufacturing className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Manufacturer
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/vendor">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <FaShop className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Vendor
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>

          <li>
            <NavLink to="/cylinder">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <MdOutlineGasMeter className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Cylinder
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/view-cylinder">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <MdOutlineViewInAr className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    View Cylinder
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>

          <hr />
          {branchId == "2" ? (
            ""
          ) : (
            <>
              <li>
                <NavLink to="/vendor-report">
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color="white"
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      <TbReportAnalytics className="w-5 h-5 text-inherit" />
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        Vendor Report
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>

              <li>
                <NavLink to="/manufacturer-report">
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color="white"
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      <TbReport className="w-5 h-5 text-inherit" />
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        Manufacturer Report
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            </>
          )}

          <li>
            <NavLink to="/cylinder-details">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <HiOutlineDocumentReport className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Cylinder Details
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>

          {branchId == "2" ? (
            ""
          ) : (
            <>
              <li>
                <NavLink to="/report-form">
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color="white"
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      <TbReportSearch className="w-5 h-5 text-inherit" />
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        Report
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            </>
          )}

          {userTypeId == "3" ? (
            <li>
              <NavLink to="/view-tara-weight">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "gradient" : "text"}
                    color="white"
                    className="flex items-center gap-4 px-4 capitalize"
                    fullWidth
                  >
                    <MdOutlineViewInAr className="w-5 h-5 text-inherit" />
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                      Tara Weight
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>
          ) : (
            ""
          )}
        </ul>
      </div>
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 font-bold text-black border-b border-dashed border-black px-4 py-1">
        Updated On : 19-Apr-2025
      </div>
    </aside>
  );
};
export default SideNav;
