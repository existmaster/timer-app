'use client';

import { useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

export default function NotificationHandler() {
  const { notifications, markAsTriggered } = useNotifications();

  // 현재 시간을 한국 시간(KST)으로 가져오는 함수
  const getKoreanTime = () => {
    const now = new Date();
    // 한국 시간으로 변환 (UTC+9)
    const koreaTimeOffset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로 변환
    const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000); // 현재 시간을 UTC로 변환
    return new Date(utc + koreaTimeOffset);
  };

  useEffect(() => {
    // 1초마다 알림 확인
    const intervalId = setInterval(() => {
      const now = getKoreanTime();
      
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