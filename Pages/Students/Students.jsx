import { useState, useEffect } from 'react';
import { FaSearch, FaUserEdit, FaCheck, FaTimes, FaTrashAlt, FaPen } from 'react-icons/fa';
import { callApi } from "../../Services/Api.js";
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Edit States
  const [editingId, setEditingId] = useState(null); // For inline status edit
  const [editedStatus, setEditedStatus] = useState("");
  const [fullEditStudent, setFullEditStudent] = useState(null); // For full detail modal

  const [updating, setUpdating] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await callApi.get("/counsellor/students");
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

  // --- LOGIC: SAVE UPDATE (Used for both status and full edits) ---
  const handleUpdate = async (updatedData) => {
    try {
      setUpdating(true);
      // Matches backend PUT: /updateStudent/:studentId
      const res = await callApi.put(`/counsellor/updateStudent/${updatedData._id}`, updatedData);

      setStudents(prev => prev.map(s => (s._id === updatedData._id ? res.data.data : s)));
      toast.success("Student updated successfully");

      // Close all edit states
      setEditingId(null);
      setFullEditStudent(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed. All fields are required.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    try {
      setDeleting(true);
      await callApi.delete(`/counsellor/deleteStudent/${selectedStudent._id}`);
      setStudents(prev => prev.filter(s => s._id !== selectedStudent._id));
      toast.success("Student removed");
      setSelectedStudent(null);
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Student Directory</h2>
          <p className="text-[11px] text-gray-500 uppercase tracking-[0.2em] font-bold">Registration Records</p>
        </div>
        <div className="flex items-center gap-3 bg-[#121418] border border-white/5 p-1.5 rounded-xl w-full sm:w-72">
          <FaSearch className="text-gray-500 ml-2" size={12} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search records..."
            className="bg-transparent text-xs font-bold text-white outline-none w-full placeholder:text-gray-600"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[#121418] border border-white/5 rounded-[1.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Student Info</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Course</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="4" className="p-20 text-center text-[10px] font-black text-gray-600 uppercase tracking-widest">Loading...</td></tr>
              ) : filteredStudents.map(student => (
                <tr key={student._id} className="hover:bg-white/[0.01] group transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white">{student.name}</span>
                      <span className="text-[10px] text-gray-500 font-bold">{student.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-black text-blue-400 bg-blue-400/10 px-2 py-1 rounded border border-blue-400/20">
                      {student.appliedCourse}
                    </span>
                  </td>
                  <td className="p-4">
                    {editingId === student._id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={editedStatus}
                          onChange={(e) => setEditedStatus(e.target.value)}
                          className="bg-[#0a0c10] border border-blue-500/50 rounded-lg text-[10px] font-black text-white px-2 py-1 outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="active">Active</option>
                          <option value="graduated">Graduated</option>
                          <option value="dropped">Dropped</option>
                        </select>
                        <button onClick={() => handleUpdate({ ...student, status: editedStatus })} className="text-emerald-500"><FaCheck size={10} /></button>
                        <button onClick={() => setEditingId(null)} className="text-red-500"><FaTimes size={10} /></button>
                      </div>
                    ) : (
                      <span onClick={() => { setEditingId(student._id); setEditedStatus(student.status); }} className="cursor-pointer text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                        {student.status || "pending"}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setFullEditStudent(student)} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg"><FaPen size={12} /></button>
                      <button onClick={() => setSelectedStudent(student)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/5 rounded-lg"><FaTrashAlt size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL EDIT MODAL */}
      <AnimatePresence>
        {fullEditStudent && (
          <div className="fixed inset-0 bg-[#0a0c10]/90 backdrop-blur-md flex items-center justify-center z-[60] p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="w-full max-w-lg bg-[#121418] border border-white/10 rounded-[2rem] p-8 shadow-2xl">
              <h2 className="text-xl font-black text-white mb-6">Edit Student Details</h2>
              <form className="grid grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); handleUpdate(fullEditStudent); }}>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-500 uppercase">Full Name</label>
                  <input className="bg-[#0a0c10] border border-white/5 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-blue-500"
                    value={fullEditStudent.name} onChange={(e) => setFullEditStudent({ ...fullEditStudent, name: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-500 uppercase">Email</label>
                  <input className="bg-[#0a0c10] border border-white/5 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-blue-500"
                    value={fullEditStudent.email} onChange={(e) => setFullEditStudent({ ...fullEditStudent, email: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-500 uppercase">Phone</label>
                  <input className="bg-[#0a0c10] border border-white/5 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-blue-500"
                    value={fullEditStudent.number} onChange={(e) => setFullEditStudent({ ...fullEditStudent, number: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-500 uppercase">Course</label>
                  <input className="bg-[#0a0c10] border border-white/5 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-blue-500"
                    value={fullEditStudent.appliedCourse} onChange={(e) => setFullEditStudent({ ...fullEditStudent, appliedCourse: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-500 uppercase">Age</label>
                  <input type="number" className="bg-[#0a0c10] border border-white/5 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-blue-500"
                    value={fullEditStudent.age} onChange={(e) => setFullEditStudent({ ...fullEditStudent, age: e.target.value })} />
                </div>
                <div className="col-span-2 flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setFullEditStudent(null)} className="px-6 py-3 rounded-xl text-[10px] font-black text-gray-500 uppercase hover:text-white transition-all">Cancel</button>
                  <button type="submit" disabled={updating} className="px-6 py-3 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL (Keep previous logic) */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 bg-[#0a0c10]/80 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-[#121418] border border-white/5 rounded-[2rem] p-8 max-w-sm w-full text-center space-y-6">
              <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto"><FaTrashAlt size={20} /></div>
              <h2 className="text-white font-black">Delete {selectedStudent.name}?</h2>
              <div className="flex gap-3">
                <button onClick={() => setSelectedStudent(null)} className="flex-1 py-3 text-[10px] font-black text-gray-500 uppercase">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-3 bg-red-600 rounded-xl text-[10px] font-black text-white uppercase shadow-lg shadow-red-600/20">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Students;