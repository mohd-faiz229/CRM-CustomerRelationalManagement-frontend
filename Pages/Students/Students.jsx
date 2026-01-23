import { useState, useEffect } from 'react';
import { FaSearch, FaCheck, FaTimes, FaTrashAlt, FaPen } from 'react-icons/fa';
import { callApi } from "../../Services/Api.js";
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from "../../Components/CustomSelect/CustomSelect.jsx";

// Real-world status options
const statusOptions = [
  { value: "pending", label: "Pending", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  { value: "active", label: "Active", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  { value: "dropped", label: "Dropped", color: "text-rose-400 bg-rose-400/10 border-rose-400/20" },
];

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editedStatus, setEditedStatus] = useState("");
  const [fullEditStudent, setFullEditStudent] = useState(null);

  const [updating, setUpdating] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await callApi.get("/counsellor/students");
      setStudents(res.data.data);
    } catch (err) {
      console.log(err.response);
      toast.error(err.response?.data?.message || "Failed to load students");
    }

     finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const getStatusStyle = (status) => {
    return statusOptions.find(opt => opt.value === status.toLowerCase())?.color || "text-slate-400 bg-slate-400/10 border-slate-400/20";
  };

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdate = async (updatedData) => {
    try {
      setUpdating(true);
      const res = await callApi.put(`/counsellor/student/${updatedData._id}`, updatedData);
      setStudents(prev => prev.map(s => (s._id === updatedData._id ? res.data.data : s)));
      toast.success("Student updated successfully");
      setEditingId(null);
      setFullEditStudent(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    try {
      setDeleting(true);
      await callApi.delete(`/counsellor/student/${selectedStudent._id}`);
      setStudents(prev => prev.filter(s => s._id !== selectedStudent._id));
      toast.success("Student deleted successfully");
      setSelectedStudent(null);
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">Student Directory</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-500">Live Enrollment Database</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 px-4 rounded-xl w-full sm:w-72 focus-within:border-blue-500/50 transition-all">
          <FaSearch className="text-slate-500" size={12} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name or email..."
            className="bg-transparent text-xs font-bold outline-none w-full text-white placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="border border-white/5 rounded-[1.5rem] overflow-hidden shadow-2xl bg-[#0f172a]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/5">
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Identity</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Enrollment</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Current Status</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="4" className="p-20 text-center text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 animate-pulse">Synchronizing Data...</td></tr>
              ) : filteredStudents.map(student => (
                <tr key={student._id} className="hover:bg-white/[0.02] group transition-colors">
                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-white">{student.name}</span>
                      <span className="text-[10px] font-bold text-slate-500 tracking-tight">{student.email}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="text-[10px] font-black text-blue-400 bg-blue-400/5 px-3 py-1.5 rounded-lg border border-blue-400/20 uppercase tracking-tighter">
                      {student.appliedCourse || "N/A"}
                    </span>
                  </td>
                  <td className="p-5">
                    {editingId === student._id ? (
                      <div className="flex items-center gap-2 w-48 scale-90 origin-left">
                        <CustomSelect
                          value={editedStatus}
                          options={statusOptions}
                          onChange={(val) => setEditedStatus(val)}
                        />
                        <button onClick={() => handleUpdate({ ...student, status: editedStatus })} className="p-2 text-emerald-500 bg-emerald-500/10 rounded-lg hover:bg-emerald-500/20">
                          <FaCheck size={10} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-2 text-rose-500 bg-rose-500/10 rounded-lg hover:bg-rose-500/20">
                          <FaTimes size={10} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditingId(student._id); setEditedStatus(student.status || "pending"); }}
                        className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all hover:scale-105 ${getStatusStyle(student.status || "pending")}`}
                      >
                        {student.status || "pending"}
                      </button>
                    )}
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setFullEditStudent(student)} className="p-2.5 text-slate-400 hover:text-white bg-white/5 rounded-xl border border-white/5 transition-all"><FaPen size={10} /></button>
                      <button onClick={() => setSelectedStudent(student)} className="p-2.5 text-slate-400 hover:text-rose-500 bg-white/5 rounded-xl border border-white/5 transition-all"><FaTrashAlt size={10} /></button>
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
          <div className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-[90] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-[2rem] p-8 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-xl font-black text-white">Modify Record</h2>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Update profile for {fullEditStudent.name}</p>
              </div>
              <form className="grid grid-cols-2 gap-5" onSubmit={(e) => { e.preventDefault(); handleUpdate(fullEditStudent); }}>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all"
                    value={fullEditStudent.name} onChange={(e) => setFullEditStudent({ ...fullEditStudent, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all"
                    value={fullEditStudent.email} onChange={(e) => setFullEditStudent({ ...fullEditStudent, email: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Phone Number</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all"
                    value={fullEditStudent.number || ""} onChange={(e) => setFullEditStudent({ ...fullEditStudent, number: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Current Status</label>
                  <CustomSelect
                    value={fullEditStudent.status || "pending"}
                    options={statusOptions}
                    onChange={(val) => setFullEditStudent({ ...fullEditStudent, status: val })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Age</label>
                  <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all"
                    value={fullEditStudent.age || ""} onChange={(e) => setFullEditStudent({ ...fullEditStudent, age: e.target.value })} />
                </div>
                <div className="col-span-2 flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setFullEditStudent(null)} className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Discard</button>
                  <button type="submit" disabled={updating} className="px-8 py-3 rounded-xl bg-blue-600 text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50">
                    {updating ? "Committing..." : "Update Record"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-10 max-w-sm w-full text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20"><FaTrashAlt size={24} /></div>
              <div>
                <h2 className="font-black text-xl text-white">Permanently Remove?</h2>
                <p className="text-xs text-slate-500 mt-2 font-medium">You are about to delete <span className="text-white">{selectedStudent.name}</span>. This action is irreversible.</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setSelectedStudent(null)} className="flex-1 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Abort</button>
                <button onClick={handleDelete} disabled={deleting} className="flex-1 py-4 bg-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-rose-600/20 hover:bg-rose-500 transition-all">
                  {deleting ? "Deleting..." : "Confirm"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Students;