// src/pages/PatientDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Loader2, Clock, X, MessageCircle } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]); // Store my appointments and track their status
  const [isLoading, setIsLoading] = useState(true);

  // --- Booking Modal State ---
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null); // Time slot selected by the patient
  const [bookingReason, setBookingReason] = useState('');
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  // 1. Fetch data (doctors + my current appointments)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, apptsRes] = await Promise.all([
          api.get('/users/doctors'),
          api.get('/appointments')
        ]);
        setDoctors(docsRes.data);
        setMyAppointments(apptsRes.data);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Helper function to calculate the next date for the selected day
  const getNextDateForDay = (dayName) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetIndex = days.indexOf(dayName);
    const today = new Date();
    const currentDayIndex = today.getDay();

    let daysUntilTarget = targetIndex - currentDayIndex;
    if (daysUntilTarget <= 0) {
      daysUntilTarget += 7; // If the day has passed, get next week's day
    }

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilTarget);
    return targetDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  };

  // 3. Submit booking request
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return alert("Please select a time slot");

    setIsBookingLoading(true);
    try {
      // Automatically calculate the date based on the selected day
      const calculatedDate = getNextDateForDay(selectedSlot.day_of_week);
      
      // ✅ FIX 1: Send ONLY the start time (e.g., "09:00:00")
      // The database expects a TIME type, not a string like "09:00 - 17:00"
      const shiftTime = selectedSlot.start_time;

      await api.post('/appointments', {
        doctorId: selectedDoctor.id,
        date: calculatedDate, // Calculated date
        time: shiftTime,      // Fixed Time format
        reason: bookingReason
      });

      alert("Booking Request Sent Successfully!");

      // Refresh appointments locally so the UI updates immediately
      const res = await api.get('/appointments');
      setMyAppointments(res.data);

      setSelectedDoctor(null); // Close the modal
      setBookingReason('');    // Reset reason field
      setSelectedSlot(null);   // Reset slot selection
    } catch (error) {
      console.error(error);
      alert("Failed to book.");
    } finally {
      setIsBookingLoading(false);
    }
  };

  // 4. Start Chat
  const startChat = (doctor) => {
    navigate('/messages', {
      state: {
        startChatWith: {
          id: doctor.id,
          name: `Dr. ${doctor.first_name} ${doctor.last_name}`,
          specialty: doctor.specialty
        }
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">

      {/* Hero Section */}
      <div className="relative bg-primary rounded-3xl p-8 md:p-12 text-white overflow-hidden shadow-premium">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Find your Doctor</h1>
          <p className="text-slate-300 mb-8 text-lg">
            Book an appointment during the available shifts and consult with our specialists.
          </p>
        </div>
      </div>

      {/* Doctors List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-primary">Available Specialists</h3>

        {isLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-accent" /></div>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doctors.map((doc) => {
              // ✅ FIX 2: Match appointment using Doctor ID (More reliable than name)
              // Ensure your Backend 'getMyAppointments' returns 'doctor_id'
              const relevantAppt = myAppointments.find(a => a.doctor_id === doc.id);
              const status = relevantAppt ? relevantAppt.status : null;
              
              return (
                <div key={doc.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">

                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-full bg-surface-muted flex items-center justify-center text-xl font-bold text-primary border-2 border-white shadow-sm uppercase">
                      {doc.first_name[0]}{doc.last_name[0]}
                    </div>
                    {/* Status Badge */}
                    {status === 'confirmed' && <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold">APPROVED</span>}
                    {status === 'pending' && <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-bold">WAITING APPROVAL</span>}
                  </div>

                  <h4 className="font-bold text-primary text-lg">Dr. {doc.first_name} {doc.last_name}</h4>
                  <p className="text-sm text-slate-500 mb-3">{doc.specialty || 'General'}</p>

                  {/* Quick view of available shifts on the card */}
                  <div className="mb-6 mt-auto">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Available Shifts</p>
                    <div className="flex flex-wrap gap-2">
                      {doc.schedule?.filter(s => s.is_active).map((s, i) => (
                        <span key={i} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-1 rounded border border-slate-200">
                          {s.day_of_week.substring(0, 3)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* --- Smart Buttons --- */}
                  <div className="mt-4">
                  {/* 1. If booking is confirmed -> show chat button */}
                  {status === 'confirmed' ? (
                    <button
                      onClick={() => startChat(doc)}
                      className="w-full py-3 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 animate-in zoom-in"
                    >
                      <MessageCircle size={18} /> Chat Now
                    </button>
                  )
                    /* 2. If booking is pending -> waiting button */
                    : status === 'pending' ? (
                      <button
                        disabled
                        className="w-full py-3 rounded-xl bg-slate-100 text-slate-400 font-semibold text-sm cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Clock size={18} /> Request Pending
                      </button>
                    )
                      /* 3. No booking -> book appointment button */
                      : (
                        <button
                          onClick={() => {
                            setSelectedDoctor(doc);
                            setSelectedSlot(null);
                          }}
                          className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-light shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                        >
                          <Calendar size={18} /> Book Appointment
                        </button>
                      )}
                  </div>

                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400">No doctors available.</div>
        )}
      </div>

      {/* --- Booking Modal --- */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">

            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-primary">Select a Shift</h2>
                <p className="text-sm text-slate-500">Dr. {selectedDoctor.first_name} {selectedDoctor.last_name}</p>
              </div>
              <button onClick={() => setSelectedDoctor(null)}><X size={20} className="text-slate-400" /></button>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-8 space-y-6">

              {/* 1. Show only available doctor shifts for selection */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-primary ml-1">Available Shifts (Click to select)</label>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {selectedDoctor.schedule?.filter(s => s.is_active).length > 0 ? (
                    selectedDoctor.schedule.filter(s => s.is_active).map((s, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedSlot(s)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center
                                    ${selectedSlot === s
                            ? 'border-accent bg-accent/10 ring-1 ring-accent'
                            : 'border-slate-200 hover:border-accent/50 hover:bg-slate-50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedSlot === s ? 'border-accent' : 'border-slate-300'}`}>
                            {selectedSlot === s && <div className="w-2 h-2 rounded-full bg-accent"></div>}
                          </div>
                          <span className="font-bold text-primary">{s.day_of_week}</span>
                        </div>
                        <span className="text-sm text-slate-500 font-mono bg-white px-2 py-1 rounded border border-slate-100">
                          {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-red-400 py-4 border border-dashed rounded-xl">
                      Doctor has not set any working hours yet.
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Reason for visit */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary ml-1">Reason for Visit</label>
                <textarea
                  placeholder="e.g., Follow up, High fever..."
                  rows="2"
                  className="w-full p-4 bg-surface-muted rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-accent outline-none transition-all text-sm resize-none"
                  value={bookingReason}
                  onChange={(e) => setBookingReason(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* 3. Confirm button */}
              <Button type="submit" isLoading={isBookingLoading} disabled={!selectedSlot} className="w-full py-4 text-base shadow-xl shadow-accent/20">
                {selectedSlot
                  ? `Confirm Booking for Next ${selectedSlot.day_of_week}`
                  : 'Select a Slot First'}
              </Button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}