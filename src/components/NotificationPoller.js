import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import useApi from '../hooks/useApi';
import moment from 'moment';

const NotificationPoller = ({ interval = 60000 }) => { // Poll every 60 seconds
  const { user } = useAuth();
  const { get: getEscalationHistory } = useApi('/api/daily-attendance');
  const notificationQueue = useRef([]);

  const checkNotifications = async () => {
    if (!user || user.role !== 'Student' || !user.id) return;

    try {
      const { events, reports } = await getEscalationHistory(`/escalation/${user.id}`);

      // Process new events/reports that haven't been notified yet
      events.forEach(event => {
        if (!notificationQueue.current.some(n => n.id === event.id && n.type === 'event')) {
          let message = '';
          if (event.event_type === '1_day_absent_notification') {
            message = `You have 1 consecutive day of absence. Please confirm your reason.`;
          } else if (event.event_type === '3_day_escalation') {
            message = `URGENT: You have 3 consecutive days of absence. A reason form is required.`;
          } else if (event.event_type === '7_day_suspension') {
            message = `IMPORTANT: You have been suspended due to 7 consecutive days of absence. Contact administration.`;
          }

          if (message) {
            alert(message);
            notificationQueue.current.push({ id: event.id, type: 'event', message });
          }
        }
      });

      reports.forEach(report => {
        if (report.status === 'pending' && report.escalation_level === '3_day_consecutive' && !notificationQueue.current.some(n => n.id === report.id && n.type === 'report')) {
          const message = `ACTION REQUIRED: You have a pending absence report for ${moment(report.report_date).format('YYYY-MM-DD')}. Please submit your reason.`;
          alert(message);
          notificationQueue.current.push({ id: report.id, type: 'report', message });
        }
      });

    } catch (error) {
      console.error('Error checking for notifications:', error);
    }
  };

  useEffect(() => {
    let poller;
    if (user && user.role === 'Student') {
      // Initial check
      checkNotifications();
      // Set up polling
      poller = setInterval(checkNotifications, interval);
    }

    return () => {
      if (poller) {
        clearInterval(poller);
      }
    };
  }, [user, interval]);

  return null; // This component doesn't render anything visible
};

export default NotificationPoller;
