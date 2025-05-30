import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { deleteTimesheet, getAllTimesheet } from "../../api/api";
import { format } from "date-fns";
import ConfirmDialog from "../../components/ConfirmationModal";
import { getRolesFromToken } from "../../helpers/helpers";

export default function TimesheetPage() {
  const { authUser } = useAuthContext();
  const [tsList, setTsList] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const getTsList = async () => {
      try {
        const ts = await getAllTimesheet(authUser);
        setTsList(ts);
      } catch (error) {
        console.log(error);
        setTsList([]);
      }
    };
    getTsList();
  }, [authUser]);

  const onDelete = async () => {
    try {
      await deleteTimesheet(authUser, selectedId);
      const newTimesheet = tsList.filter((item) => item.id != selectedId);
      setTsList(newTimesheet);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div class="d-flex">
      <Sidebar />

      <div className="p-5" style={{ width: "100%" }}>
        <h2 class="text-center">Timesheet Views</h2>

        <div className="mt-4 d-flex justify-content-between">
          <Link to="/timesheet/create" class="btn btn-primary mb-3">
            New Timesheet
          </Link>
          <Link to="/" class="btn btn-primary mb-3">
            Home
          </Link>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Project Name</th>
              <th>Project Lead</th>
              <th>Location</th>
              <th>Maker</th>
              <th>Remarks</th>
              <th>Submit Date</th>
              <th>Checker</th>
              <th>Checker Status</th>
              <th>Checker Remark</th>
              <th>Checker Submit Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody class="table-group-divider">
            {tsList.map((ts, index) => (
              <tr key={index}>
                <td className="text-center align-middle">{ts.id}</td>
                <td className="text-center align-middle">{ts.pname}</td>
                <td className="text-center align-middle">{ts.plead.empName}</td>
                <td className="text-center align-middle">{ts.location}</td>
                <td className="text-center align-middle">{ts.maker.empName}</td>
                <td className="text-center align-middle">{ts.remarks}</td>
                <td className="text-center align-middle">
                  {format(ts.submitDate, "dd/MM/yyyy")}
                </td>
                <td className="text-center align-middle">
                  {ts.checker.empName}
                </td>
                <td className="text-center align-middle">{ts.checkerStatus}</td>
                <td className="text-center align-middle">
                  {ts.checkerRemark ? ts.checkerRemark : "-"}
                </td>
                <td className="text-center align-middle">
                  {ts.checkerSubmitDate
                    ? format(ts.checkerSubmitDate, "dd/MM/yyyy")
                    : "-"}
                </td>
                <td>
                  {ts.checkerStatus === "Pending" && (
                    <>
                      <Link
                        class="btn btn-primary btn-sm"
                        to={`/timesheet/edit/${ts.id}`}
                        style={{ width: "70px" }}
                      >
                        EDIT
                      </Link>

                      <button
                        class="btn btn-danger btn-sm mt-1"
                        style={{ width: "70px" }}
                        onClick={() => {
                          setShowDialog(true);
                          setSelectedId(ts.id);
                        }}
                      >
                        DELETE
                      </button>
                      <ConfirmDialog
                        show={showDialog}
                        onHide={() => setShowDialog(false)}
                        onConfirm={() => {
                          onDelete();
                          setShowDialog(false);
                        }}
                        title="Delete Employee"
                        message={`Are you sure you want to delete ?`}
                      />
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
