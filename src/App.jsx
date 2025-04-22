import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/auth/SignIn";
import ProtectedRoute from "./components/ProtectedRoute";
import Maintenance from "./pages/maintenance/Maintenance";
import EditManufacturer from "./pages/master/manufacturer/EditManufacturer";
import EditVendor from "./pages/master/vendor/EditVendor";
import CylinderEdit from "./pages/cylinder/CylinderEdit";
import { lazy, Suspense, useContext, useEffect, useState } from "react";
import { ContextPanel } from "./utils/ContextPanel";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import Loader from "./components/Loader";
import ReportForm from "./pages/reports/report/ReportForm";
import ReportOne from "./pages/reports/report/ReportOne";
import ReportTwo from "./pages/reports/report/ReportTwo";
import { Toaster } from "react-hot-toast";
import DisableRightClick from "./components/DisableRightClick";

// lazy
const SIgnUp = lazy(() => import("./pages/auth/SIgnUp"));
const ViewTaraWeight = lazy(() =>
  import("./pages/ViewTaraWeight/ViewTaraWeight")
);
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
      <DisableRightClick />
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
                    <Suspense fallback={<Loader />}>
                      <UserViewCylinder />
                    </Suspense>
                  }
                />
              )}
          </>
        )}
        {userInfo.branchId && userInfo.userTypeId && (
          <>
            {(userInfo.branchId === 1 || userInfo.branchId === 2) &&
              userInfo.userTypeId === 3 && (
                // <Route path="/view-tare-weight" element={<ViewTaraWeight />} />

                <Route
                  path="/view-tare-weight"
                  element={
                    <Suspense fallback={<Loader />}>
                      <ViewTaraWeight />
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
