import { useState, useEffect } from 'react';
import {
  FaSearch,
  FaUserEdit,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import { callApi } from "../../Services/Api.js";
import toast from 'react-hot-toast';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editedStatus, setEditedStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch all students (admin & counsellor can access)
  const fetchStudents = async () => {
    try {
      const res = await callApi.get("/counsellor/students"); // matches backend route
      setStudents(res.data.data);
    } catch (err) {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (student) => {
    setEditingId(student._id);
    setEditedStatus(student.status || "Pending");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedStatus("");
  };

  const saveEdit = async (studentId) => {
    try {
      setUpdating(true);
      await callApi(`/updateStudent/${studentId}`, "PUT", {
        status: editedStatus,
      }); // backend route for both admin & counsellor

      setStudents(prev =>
        prev.map(s =>
          s._id === studentId ? { ...s, status: editedStatus } : s
        )
      );

      toast.success("Student updated");
      cancelEdit();
    } catch {
      toast.error("Failed to update student");
    } finally {
      setUpdating(false);
    }
  };

  const deleteStudent = async () => {
    if (!selectedStudent) return;

    try {
      setDeleting(true);
      callApi(`/counsellor/deleteStudent/${selectedStudent._id}`, "DELETE")

      setStudents(prev =>
        prev.filter(s => s._id !== selectedStudent._id)
      );
      toast.success("Student deleted");
      setSelectedStudent(null);
    } catch {
      toast.error("Failed to delete student");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-10 relative">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Students</h1>
        <p className="text-gray-400">Total {students.length} students</p>
      </div>

      {/* Search */}
      <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="relative flex-1">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 pl-4 pr-4 text-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white/5 border border-white/10 overflow-x-auto">
        <table className="min-w-[900px] w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-5 text-xs text-gray-400">Student</th>
              <th className="p-5 text-xs text-gray-400">Course</th>
              <th className="p-5 text-xs text-gray-400">Joined</th>
              <th className="p-5 text-xs text-gray-400">Status</th>
              <th className="p-5 text-xs text-gray-400 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-20 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredStudents.map(student => (
              <tr key={student._id}>
                <td className="p-5">
                  <button
                    onClick={() => setSelectedStudent(student)}
                    className="text-white font-bold hover:underline"
                  >
                    {student.name}
                  </button>
                  <p className="text-xs text-gray-500">{student.email}</p>
                </td>
                <td className="p-5 text-gray-300">{student.appliedCourse}</td>
                <td className="p-5 text-gray-300">
                  {new Date(student.createdAt).toLocaleDateString("en-IN")}
                </td>
                <td className="p-5">
                  {editingId === student._id ? (
                    <select
                      value={editedStatus}
                      onChange={(e) => setEditedStatus(e.target.value)}
                      className="bg-slate-900 border border-white/10 rounded-lg text-sm text-white px-2 py-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Enrolled">Enrolled</option>
                      <option value="Placed">Placed</option>
                    </select>
                  ) : (
                    <span className="text-sm text-gray-300">
                      {student.status || "Pending"}
                    </span>
                  )}
                </td>
                <td className="p-5 text-center">
                  {editingId === student._id ? (
                    <>
                      <button onClick={() => saveEdit(student._id)} className="text-green-400 mr-2">
                        <FaCheck />
                      </button>
                      <button onClick={cancelEdit} className="text-red-400">
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => startEdit(student)} className="text-gray-400">
                      <FaUserEdit />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-slate-900 rounded-2xl p-6 border border-white/10 space-y-4">
            <h2 className="text-xl font-bold text-white">{selectedStudent.name}</h2>
            <p className="text-gray-400">{selectedStudent.email}</p>
            <p className="text-sm text-gray-300">Course: {selectedStudent.appliedCourse}</p>
            <p className="text-sm text-gray-300">Status: {selectedStudent.status || "Pending"}</p>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-lg bg-white/10 text-gray-300"
              >
                Close
              </button>
              <button
                disabled={deleting}
                onClick={deleteStudent}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                {deleting ? "Deleting..." : "Delete Student"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
