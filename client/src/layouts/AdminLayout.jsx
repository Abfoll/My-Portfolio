import AdminNavbar from "../components/AdminNavbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="d-lg-flex" style={{ width: "100%", height: "100vh" }}>
      <Sidebar />
     <div className="d-lg-none ">
       <AdminNavbar/>
     </div>
      <div className="flex-grow-1 p-3" style={{ overflowY: "auto" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
