'use client';

import { useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

declare global {
  interface Window {
    electronAPI?: {
      sendNotification: (title: string, message: string) => void;
    };
  }
}

export default function NotificationHandler() {
  const { notifications, markAsTriggered } = useNotifications();

  useEffect(() => {
    // 1초마다 알림 확인
    const intervalId = setInterval(() => {
      const now = new Date();
      
      notifications.forEach((notification) => {
        if (!notification.triggered && notification.time <= now) {
          // 알림 표시
          if (window.electronAPI) {
            // Electron 환경에서 실행 중인 경우
            window.electronAPI.sendNotification(notification.title, notification.message);
          } else {
            // 브라우저 환경에서 실행 중인 경우
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