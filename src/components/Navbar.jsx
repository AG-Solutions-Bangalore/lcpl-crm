import logo from "../../public/lcpllogo.png";
import { Button } from "@material-tailwind/react";
import Logout from "./Logout";
import { useState } from "react";

function Navbar() {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenLogout = () => setOpenModal(!openModal);
  return (
    <nav className="w-full flex justify-between items-center px-6 py-3 bg-white shadow">
      {/* Left side - Logo/Image */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
      </div>

      {/* Right side - Logout button */}
      <div>
        <Button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleOpenLogout}
        >
          Logout
        </Button>
      </div>

      <Logout open={openModal} handleOpen={handleOpenLogout} />
    </nav>
  );
}
export default Navbar;
