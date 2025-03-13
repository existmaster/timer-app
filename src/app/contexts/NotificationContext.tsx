'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification, TimeSlot } from '../types';
import { timetableData } from '../data/timetable';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'triggered'>) => void;
  removeNotification: (id: string) => void;
  markAsTriggered: (id: string) => void;
  generateNotificationsFromTimetable: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

// 로컬 스토리지에서 불러온 알림 데이터 타입 정의
interface StoredNotification {
  id: string;
  title: string;
  message: string;
  time: string; // JSON에서는 Date가 문자열로 저장됨
  triggered: boolean;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 로컬 스토리지에서 알림 데이터 로드
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications) as StoredNotification[];
        // Date 객체로 변환
        const notificationsWithDateObjects = parsedNotifications.map((notification: StoredNotification) => ({
          ...notification,
          time: new Date(notification.time),
        }));
        setNotifications(notificationsWithDateObjects);
      } catch (error) {
        console.error('Failed to parse notifications from localStorage:', error);
      }
    }
  }, []);

  // 알림 데이터가 변경될 때 로컬 스토리지에 저장
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // 알림 추가
  const addNotification = (notification: Omit<Notification, 'id' | 'triggered'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      triggered: false,
    };
    setNotifications((prev) => [...prev, newNotification]);
  };

  // 알림 제거
  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  // 알림 트리거 상태 변경
  const markAsTriggered = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, triggered: true } : notification
      )
    );
  };

  // 시간표 데이터로부터 알림 생성
  const generateNotificationsFromTimetable = () => {
    const today = new Date();
    const newNotifications: Notification[] = [];

    timetableData.forEach((slot: TimeSlot) => {
      const [startHour, startMinute] = slot.startTime.split(':').map(Number);
      
      // 알림 시간 설정 (정각에 알림)
      const notificationTime = new Date(today);
      notificationTime.setHours(startHour, startMinute, 0, 0);
      
      // 이미 지난 시간이면 다음 날로 설정
      if (notificationTime < today) {
        notificationTime.setDate(notificationTime.getDate() + 1);
      }
      
      // 모든 시간대에 알림 생성
      let activity = slot.activity;
      let message = '';
      
      // 요일별 서브 활동이 있는 경우
      if (slot.subActivities) {
        const dayOfWeek = today.getDay(); // 0: 일요일, 1: 월요일, ...
        
        if (dayOfWeek === 1 && slot.subActivities.monday) {
          activity = `${slot.activity} (${slot.subActivities.monday})`;
        } else if (dayOfWeek === 2 && slot.subActivities.tuesday) {
          activity = `${slot.activity} (${slot.subActivities.tuesday})`;
        } else if (dayOfWeek === 3 && slot.subActivities.wednesday) {
          activity = `${slot.activity} (${slot.subActivities.wednesday})`;
        } else if (dayOfWeek === 4 && slot.subActivities.thursday) {
          activity = `${slot.activity} (${slot.subActivities.thursday})`;
        } else if (dayOfWeek === 5 && slot.subActivities.friday) {
          activity = `${slot.activity} (${slot.subActivities.friday})`;
        }
      }
      
      // 활동이 있으면 해당 활동 메시지, 없으면 수업 시작 메시지
      if (activity) {
        message = `${activity} 시간이 시작되었습니다.`;
      } else {
        message = '수업 시간이 시작되었습니다.';
      }
      
      newNotifications.push({
        id: `${slot.startTime}-${Date.now()}`,
        title: `${slot.startTime} 일정 알림`,
        message: message,
        time: notificationTime,
        triggered: false,
      });
    });

    // 기존 알림 제거 후 새 알림 설정
    setNotifications(newNotifications);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsTriggered,
        generateNotificationsFromTimetable,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}; 