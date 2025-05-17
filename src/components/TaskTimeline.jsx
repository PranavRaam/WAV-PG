import React from 'react';
import { FiCheck, FiPhone, FiCalendar, FiClock, FiCheckCircle, FiFileText, FiPlus } from 'react-icons/fi';

// Task Timeline Component
const TaskTimeline = ({ tasks, onAddTask }) => {
  const getTaskIcon = (type) => {
    switch (type) {
      case 'follow-up':
        return <FiClock />;
      case 'meeting':
        return <FiCalendar />;
      case 'contact':
        return <FiPhone />;
      case 'milestone':
        return <FiCheckCircle />;
      default:
        return <FiFileText />;
    }
  };
  
  const getTaskTypeLabel = (type) => {
    switch (type) {
      case 'follow-up':
        return 'Follow-up';
      case 'meeting':
        return 'Meeting';
      case 'contact':
        return 'Contact';
      case 'milestone':
        return 'Milestone';
      default:
        return 'Task';
    }
  };
  
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.date) - new Date(b.date));
  const today = new Date();
  
  // Calculate days since last contact
  const getLastContactDays = () => {
    const contactTasks = tasks.filter(task => task.completed && (task.type === 'contact' || task.type === 'meeting'));
    if (contactTasks.length === 0) return null;
    
    const lastContact = contactTasks.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    const daysSince = Math.floor((today - new Date(lastContact.date)) / (1000 * 60 * 60 * 24));
    
    // Ensure the displayed days are realistic (max 45 days)
    const maxDays = 45;
    const displayDays = Math.min(daysSince, maxDays);
    
    return { days: displayDays, task: lastContact };
  };
  
  const lastContactInfo = getLastContactDays();
  
  // Get next upcoming task
  const getNextTask = () => {
    const upcomingTasks = tasks.filter(task => !task.completed && new Date(task.date) >= today);
    if (upcomingTasks.length === 0) return null;
    
    return upcomingTasks.sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  };
  
  const nextTask = getNextTask();
  
  return (
    <div className="detail-card task-timeline-card">
      <div className="detail-card-header">
        <div className="detail-card-title">
          <span className="detail-icon">📅</span>
          Task Timeline
        </div>
        <button className="add-task-button" onClick={onAddTask}>
          <FiPlus /> Add Task
        </button>
      </div>
      
      <div className="timeline-summary">
        {lastContactInfo && (
          <div className="timeline-stat">
            <div className="timeline-stat-value">
              {lastContactInfo.days} {lastContactInfo.days === 1 ? 'day' : 'days'}
            </div>
            <div className="timeline-stat-label">
              Since last contact
            </div>
          </div>
        )}
        
        {nextTask && (
          <div className="timeline-stat">
            <div className="timeline-stat-value">
              {getTaskTypeLabel(nextTask.type)}
            </div>
            <div className="timeline-stat-label">
              Next: {nextTask.title} ({new Date(nextTask.date).toLocaleDateString()})
            </div>
          </div>
        )}
      </div>
      
      <div className="horizontal-timeline-container">
        <div className="horizontal-timeline">
          <div className="timeline-track">
            {sortedTasks.map((task, index) => {
              const taskDate = new Date(task.date);
              const isPast = taskDate < today;
              const isToday = taskDate.toDateString() === today.toDateString();
              const isFuture = taskDate > today;
              
              return (
                <div 
                  key={task.id} 
                  className={`timeline-event ${task.completed ? 'completed' : ''} ${isPast ? 'past' : ''} ${isToday ? 'today' : ''} ${isFuture ? 'future' : ''}`}
                >
                  <div className={`event-marker ${task.type}`}>
                    {getTaskIcon(task.type)}
                  </div>
                  
                  <div className="event-date">
                    {new Date(task.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                  </div>
                  
                  <div className="event-content">
                    <div className="event-title">{task.title}</div>
                    <div className="event-type-badge">
                      {getTaskTypeLabel(task.type)}
                      {task.completed && <span className="completed-indicator"><FiCheck /></span>}
                    </div>
                    <div className="event-description">{task.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Horizontal connector line */}
          <div className="timeline-line"></div>
        </div>
      </div>
    </div>
  );
};

export default TaskTimeline; 