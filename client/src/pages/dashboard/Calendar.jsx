import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../../services/eventService';
import { ChevronLeft, ChevronRight, Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import '../../styles/Calendar.css';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    color: '#3b82f6'
  });

  // Fetch events on mount
  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    try {
      const data = await fetchEvents();
      if (Array.isArray(data)) {
        setEvents(data);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  }

  // Date Calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate grid cells for the 42-day calendar view
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(year, month, 1);
    const startDayIndex = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday ...
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Prev month days
    for (let i = startDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, totalDaysInPrevMonth - i),
        isCurrentMonth: false
      });
    }

    // Current month days
    const today = new Date();
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday:
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
      });
    }

    // Next month days to pad to a multiple of 7 (usually 35 or 42 cells)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Open Modal helpers
  const openCreateModal = (date = new Date()) => {
    // Format date as YYYY-MM-DD for input fields
    const formattedDate = date.toISOString().split('T')[0];
    setFormData({
      id: null,
      title: '',
      description: '',
      startDate: `${formattedDate}T09:00`,
      endDate: `${formattedDate}T10:00`,
      color: '#3b82f6'
    });
    setModalMode('create');
    setIsModalOpen(true);
  };

  const openEditModal = (event, e) => {
    if (e) e.stopPropagation(); // Prevent trigger day cell click

    // Convert date string/timezone values to local datetime-local format: YYYY-MM-DDTHH:MM
    const formatToLocalInput = (dateStr) => {
      const d = new Date(dateStr);
      const pad = (num) => String(num).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    setFormData({
      id: event.id,
      title: event.title,
      description: event.description || '',
      startDate: formatToLocalInput(event.start_date),
      endDate: formatToLocalInput(event.end_date),
      color: event.color || '#3b82f6'
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // Submit Handler
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.startDate || !formData.endDate) return;

    const payload = {
      title: formData.title,
      description: formData.description,
      start_date: new Date(formData.startDate).toISOString(),
      end_date: new Date(formData.endDate).toISOString(),
      color: formData.color
    };

    if (modalMode === 'create') {
      const newEv = await createEvent(payload);
      if (newEv && !newEv.error) {
        setEvents([...events, newEv]);
        setIsModalOpen(false);
      }
    } else {
      const updatedEv = await updateEvent(formData.id, payload);
      if (updatedEv && !updatedEv.error) {
        setEvents(events.map(ev => ev.id === formData.id ? updatedEv : ev));
        setIsModalOpen(false);
      }
    }
  };

  // Delete Handler
  const handleDelete = async () => {
    if (!formData.id) return;
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (!confirmDelete) return;

    const res = await deleteEvent(formData.id);
    if (res && !res.error) {
      setEvents(events.filter(ev => ev.id !== formData.id));
      setIsModalOpen(false);
    }
  };

  // Filter events for a specific day
  const getEventsForDay = (dateObj) => {
    return events.filter(event => {
      const eventStart = new Date(event.start_date);
      return (
        eventStart.getDate() === dateObj.getDate() &&
        eventStart.getMonth() === dateObj.getMonth() &&
        eventStart.getFullYear() === dateObj.getFullYear()
      );
    });
  };

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <DashboardLayout title="Calendar">
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div className="calendar-container animate-fade-in">
          {/* Header & Controls */}
          <div className="calendar-header">
            <div className="calendar-title-nav">
              <span className="calendar-month-title">
                {monthNames[month]} {year}
              </span>
              <div className="calendar-nav-buttons">
                <button className="calendar-nav-btn" onClick={handlePrevMonth} title="Previous Month">
                  <ChevronLeft size={16} />
                </button>
                <button className="calendar-nav-btn" onClick={handleToday}>
                  Today
                </button>
                <button className="calendar-nav-btn" onClick={handleNextMonth} title="Next Month">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <Button onClick={() => openCreateModal()} className="flex items-center gap-2">
              <Plus size={16} /> Add Event
            </Button>
          </div>

          {/* Monthly Grid */}
          <div className="calendar-grid-wrapper">
            <div className="calendar-weekdays-grid">
              {weekdays.map((day) => (
                <div key={day} className="calendar-weekday">
                  {day}
                </div>
              ))}
            </div>

            <div className="calendar-days-grid">
              {calendarDays.map((cell, index) => {
                const dayEvents = getEventsForDay(cell.date);
                return (
                  <div
                    key={index}
                    className={`calendar-day-cell ${!cell.isCurrentMonth ? 'other-month' : ''} ${cell.isToday ? 'today' : ''}`}
                    onClick={() => openCreateModal(cell.date)}
                  >
                    <div className="calendar-day-number-wrapper">
                      <span className="calendar-day-number">{cell.date.getDate()}</span>
                    </div>

                    <div className="calendar-events-container">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className="calendar-event-badge"
                          style={{ backgroundColor: event.color || '#3b82f6' }}
                          onClick={(e) => openEditModal(event, e)}
                          title={`${event.title}${event.description ? ': ' + event.description : ''}`}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Create Calendar Event' : 'Edit Calendar Event'}
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Event Title"
            placeholder="e.g. Sales Review"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label className="input-label" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Description</label>
            <textarea
              placeholder="Event notes or details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input, transparent)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              type="datetime-local"
              label="Start Date & Time"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              type="datetime-local"
              label="End Date & Time"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label className="input-label" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Color Tag</label>
            <div className="color-picker-container">
              {colors.map((c) => (
                <div
                  key={c}
                  className={`color-option ${formData.color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setFormData({ ...formData, color: c })}
                />
              ))}
            </div>
          </div>

          <div className="modal-footer-buttons">
            {modalMode === 'edit' ? (
              <Button variant="danger" onClick={handleDelete} className="flex items-center gap-1">
                <Trash2 size={16} /> Delete
              </Button>
            ) : (
              <div />
            )}
            <div className="modal-footer-right">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
