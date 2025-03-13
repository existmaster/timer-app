'use client';

import { useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

export default function NotificationHandler() {
  const { notifications, markAsTriggered } = useNotifications();

  useEffect(() => {
    // 1초마다 알림 확인
    const intervalId = setInterval(() => {
      const now = new Date();
      
      notifications.forEach((notification) => {
        if (!notification.triggered && notification.time <= now) {
          // 브라우저 환경에서 알림 표시
          if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'granted') {
              new Notification(notification.title, { body: notification.message });
            } else if (Notification.permission !== 'denied') {
              Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                  new Notification(notification.title, { body: notification.message });
                }
              });
            }
          }
          
          // 알림을 트리거된 상태로 표시
          markAsTriggered(notification.id);
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [notifications, markAsTriggered]);

  // 브라우저 알림 권한 요청
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
} 