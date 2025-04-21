import { IconButton } from "@material-tailwind/react";
import logo from "../../public/lcpllogo.png";
import Logout from "./Logout";
import { useState } from "react";
import { HiArrowRightStartOnRectangle } from "react-icons/hi2";

function Navbar() {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenLogout = () => setOpenModal(!openModal);

  return (
    <nav className="sticky top-4 z-40 bg-gradient-to-br from-blue-300 to-blue-700 text-white shadow-lg shadow-blue-900 rounded-xl py-3 px-6 flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
      </div>

      <IconButton onClick={handleOpenLogout} variant="text" color="white">
        <HiArrowRightStartOnRectangle className="h-6 w-6" />
      </IconButton>

      <Logout open={openModal} handleOpen={handleOpenLogout} />
    </nav>
  );
}

export default Navbar;
