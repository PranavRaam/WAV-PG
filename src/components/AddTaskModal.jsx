import React from 'react';
import { FiX } from 'react-icons/fi';

const AddTaskModal = ({ show, onClose, task, setTask, onSave }) => {
  if (!show) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Task</h3>
          <button className="close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Task Title</label>
            <input 
              type="text" 
              value={task.title} 
              onChange={e => setTask({...task, title: e.target.value})}
              placeholder="Enter task title"
            />
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input 
              type="date" 
              value={task.dueDate} 
              onChange={e => setTask({...task, dueDate: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Task Type</label>
            <select 
              value={task.type} 
              onChange={e => setTask({...task, type: e.target.value})}
            >
              <option value="follow-up">Follow-up</option>
              <option value="meeting">Meeting</option>
              <option value="contact">Contact</option>
              <option value="milestone">Milestone</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea 
              value={task.description} 
              onChange={e => setTask({...task, description: e.target.value})}
              placeholder="Enter task description"
              rows={3}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="save-button" onClick={onSave}>Save Task</button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal; 