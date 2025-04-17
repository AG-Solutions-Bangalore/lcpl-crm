import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/auth/SignIn";
// import SIgnUp from "./pages/auth/SIgnUp";
import Maintenance from "./pages/maintenance/Maintenance";
import ProtectedRoute from "./components/ProtectedRoute";
// import ForgetPassword from "./pages/auth/ForgetPassword";
// import ChangePassword from "./pages/profile/ChangePassword";
// import Vendor from "./pages/master/vendor/Vendor";
// import Manufacturer from "./pages/master/manufacturer/Manufacturer";
// import Cylinder from "./pages/cylinder/Cylinder";
// import AddManufacturer from "./pages/master/manufacturer/AddManufacturer";
// import AddVendor from "./pages/master/vendor/AddVendor";
// import AddCylinder from "./pages/cylinder/AddCylinder";
import EditManufacturer from "./pages/master/manufacturer/EditManufacturer";
import EditVendor from "./pages/master/vendor/EditVendor";
// import AddCylinderSub from "./pages/cylinder/AddCylinderSub";
// import CylView from "./pages/cylinder/CylView";
import CylinderEdit from "./pages/cylinder/CylinderEdit";
// import ViewCylinder from "./pages/ViewCylinder/ViewCylinder";
// import UserViewCylinder from "./pages/userPage/UserViewCylinder";
import { lazy, Suspense, useContext, useEffect, useState } from "react";
import { ContextPanel } from "./utils/ContextPanel";
// import ReportVendor from "./pages/reports/vendor/ReportVendor";
// import ReportManufacturer from "./pages/reports/manufacturer/ReportManufacturer";
import ReportForm from "./pages/reports/report/ReportForm";
import ReportOne from "./pages/reports/report/ReportOne";
import ReportTwo from "./pages/reports/report/ReportTwo";
import Loader from "./components/Loader";
// import FormCylinderDetails from "./pages/reports/cylinderReport/FormCylinderDetails";
// import ReportCylinderDetails from "./pages/reports/cylinderReport/ReportCylinderDetails";

// lazy
const SIgnUp = lazy(() => import("./pages/auth/SIgnUp"));
const ForgetPassword = lazy(() => import("./pages/auth/ForgetPassword"));
const ChangePassword = lazy(() => import("./pages/profile/ChangePassword"));
const Vendor = lazy(() => import("./pages/master/vendor/Vendor"));
const Cylinder = lazy(() => import("./pages/cylinder/Cylinder"));
const Manufacturer = lazy(() =>
  import("./pages/master/manufacturer/Manufacturer")
);
const AddManufacturer = lazy(() =>
  import("./pages/master/manufacturer/AddManufacturer")
);
const AddVendor = lazy(() => import("./pages/master/vendor/AddVendor"));
const AddCylinder = lazy(() => import("./pages/cylinder/AddCylinder"));
const AddCylinderSub = lazy(() => import("./pages/cylinder/AddCylinderSub"));
const CylView = lazy(() => import("./pages/cylinder/CylView"));
const ViewCylinder = lazy(() => import("./pages/ViewCylinder/ViewCylinder"));
const UserViewCylinder = lazy(() =>
  import("./pages/userPage/UserViewCylinder")
);
const ReportVendor = lazy(() => import("./pages/reports/vendor/ReportVendor"));
const ReportManufacturer = lazy(() =>
  import("./pages/reports/manufacturer/ReportManufacturer")
);
const FormCylinderDetails = lazy(() =>
  import("./pages/reports/cylinderReport/FormCylinderDetails")
);
const ReportCylinderDetails = lazy(() =>
  import("./pages/reports/cylinderReport/ReportCylinderDetails")
);
import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  const { userInfo, setUserInfo } = useContext(ContextPanel);
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(false);
  }, [setUserInfo]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <ToastContainer />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route
          path="/register"
          element={
            <Suspense fallback={<Loader />}>
              <SIgnUp />
            </Suspense>
          }
        />
        <Route
          path="/forget-password"
          element={
            <Suspense fallback={"Loading..."}>
              <ForgetPassword />
            </Suspense>
          }
        />
        <Route path="/maintenance" element={<Maintenance />} />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loader />}>
                  <ChangePassword />
                </Suspense>
              }
            />
          }
        />

        {userInfo.branchId && userInfo.userTypeId && (
          <>
            {(userInfo.branchId === 1 || userInfo.branchId === 2) &&
              userInfo.userTypeId === 2 && (
                <>
                  <Route
                    path="/vendor"
                    element={
                      <Suspense fallback={<Loader />}>
                        <Vendor />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/add-vendor"
                    element={
                      <Suspense fallback={<Loader />}>
                        <AddVendor />
                      </Suspense>
                    }
                  />
                  <Route path="/vendor-edit/:id" element={<EditVendor />} />
                  <Route
                    path="/manufacturer"
                    element={
                      <Suspense fallback={<Loader />}>
                        <Manufacturer />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/add-manufacturer"
                    element={
                      <Suspense fallback={<Loader />}>
                        <AddManufacturer />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/manufacturer-edit/:id"
                    element={<EditManufacturer />}
                  />
                  <Route
                    path="/cylinder"
                    element={
                      <Suspense fallback={<Loader />}>
                        <Cylinder />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/add-cylinder"
                    element={
                      <Suspense fallback={<Loader />}>
                        <AddCylinder />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/add-sub-cylinder/:id"
                    element={
                      <Suspense fallback={<Loader />}>
                        <AddCylinderSub />
                      </Suspense>
                    }
                  />
                  <Route path="/cylinder-edit/:id" element={<CylinderEdit />} />
                  <Route
                    path="/cylinder-view/:id"
                    element={
                      <Suspense fallback={<Loader />}>
                        <CylView />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/view-cylinder"
                    element={
                      <Suspense fallback={<Loader />}>
                        <ViewCylinder />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/vendor-report"
                    element={
                      <Suspense fallback={<Loader />}>
                        <ReportVendor />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/manufacturer-report"
                    element={
                      <Suspense fallback={<Loader />}>
                        <ReportManufacturer />
                      </Suspense>
                    }
                  />
                  <Route path="/report-form" element={<ReportForm />} />
                  <Route path="/report-one" element={<ReportOne />} />
                  <Route path="/report-two" element={<ReportTwo />} />
                  <Route
                    path="/cylinder-details"
                    element={
                      <Suspense fallback={<Loader />}>
                        <FormCylinderDetails />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/report-cylinder"
                    element={
                      <Suspense fallback={<Loader />}>
                        <ReportCylinderDetails />
                      </Suspense>
                    }
                  />
                </>
              )}
            {(userInfo.branchId === 1 || userInfo.branchId === 2) &&
              userInfo.userTypeId === 1 && (
                <Route
                  path="/user-view-cylinder"
                  element={
                    <Suspense fallback={"Loading..."}>
                      <UserViewCylinder />
                    </Suspense>
                  }
                />
              )}
          </>
        )}
      </Routes>
    </>
  );
};

export default App;
