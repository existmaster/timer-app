'use client';

import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  LinearProgress
} from '@mui/material';
import { timetableData } from '../data/timetable';
import { TimeSlot } from '../types';

export default function Timetable() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [progressPercent, setProgressPercent] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [currentSlot, setCurrentSlot] = useState<TimeSlot | null>(null);

  // 클라이언트 사이드에서만 렌더링되도록 설정
  useEffect(() => {
    setMounted(true);
    // 초기 마운트 시 즉시 시간 업데이트
    updateCurrentTime();
  }, []);

  // 현재 시간을 한국 시간(KST)으로 가져오는 함수
  const getKoreanTime = () => {
    const now = new Date();
    // 한국 시간으로 변환 (UTC+9)
    const koreaTimeOffset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로 변환
    const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000); // 현재 시간을 UTC로 변환
    return new Date(utc + koreaTimeOffset);
  };

  // 현재 시간 업데이트 함수
  const updateCurrentTime = () => {
    const now = getKoreanTime();
    setCurrentTime(now);
    updateCurrentSlotAndProgress(now);
  };

  // 현재 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      updateCurrentTime();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 현재 시간대의 진행률 계산
  const updateCurrentSlotAndProgress = (now: Date) => {
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();
    const currentTimeInSeconds = (currentHour * 60 + currentMinute) * 60 + currentSecond;
    
    let foundCurrentSlot = false;
    
    for (const slot of timetableData) {
      const [startHour, startMinute] = slot.startTime.split(':').map(Number);
      const [endHour, endMinute] = slot.endTime.split(':').map(Number);
      
      const startTimeInSeconds = (startHour * 60 + startMinute) * 60;
      const endTimeInSeconds = (endHour * 60 + endMinute) * 60;
      
      if (currentTimeInSeconds >= startTimeInSeconds && currentTimeInSeconds < endTimeInSeconds) {
        const totalDuration = endTimeInSeconds - startTimeInSeconds;
        const elapsed = currentTimeInSeconds - startTimeInSeconds;
        const percent = Math.floor((elapsed / totalDuration) * 100);
        setProgressPercent(percent);
        setCurrentSlot(slot);
        foundCurrentSlot = true;
        break;
      }
    }
    
    if (!foundCurrentSlot) {
      setCurrentSlot(null);
      setProgressPercent(0);
    }
  };

  const getDayOfWeek = () => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[currentTime.getDay()];
  };

  // 첫 시간 이전 또는 마지막 시간 이후인지 확인
  const isBeforeFirstSlot = () => {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    const firstSlot = timetableData[0];
    const [firstStartHour, firstStartMinute] = firstSlot.startTime.split(':').map(Number);
    const firstStartTimeInMinutes = firstStartHour * 60 + firstStartMinute;
    
    return currentTimeInMinutes < firstStartTimeInMinutes;
  };
  
  const isAfterLastSlot = () => {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    const lastSlot = timetableData[timetableData.length - 1];
    const [lastEndHour, lastEndMinute] = lastSlot.endTime.split(':').map(Number);
    const lastEndTimeInMinutes = lastEndHour * 60 + lastEndMinute;
    
    return currentTimeInMinutes >= lastEndTimeInMinutes;
  };

  const getActivityForToday = (slot: TimeSlot) => {
    if (!slot.activity) return '수업';
    
    if (slot.subActivities) {
      const today = currentTime.getDay(); // 0: 일요일, 1: 월요일, ...
      
      if (today === 1 && slot.subActivities.monday) {
        return `${slot.activity} (${slot.subActivities.monday})`;
      } else if (today === 2 && slot.subActivities.tuesday) {
        return `${slot.activity} (${slot.subActivities.tuesday})`;
      } else if (today === 3 && slot.subActivities.wednesday) {
        return `${slot.activity} (${slot.subActivities.wednesday})`;
      } else if (today === 4 && slot.subActivities.thursday) {
        return `${slot.activity} (${slot.subActivities.thursday})`;
      } else if (today === 5 && slot.subActivities.friday) {
        return `${slot.activity} (${slot.subActivities.friday})`;
      }
    }
    
    return slot.activity;
  };

  const isCurrentTimeSlot = (slot: TimeSlot) => {
    return currentSlot === slot;
  };

  // 클라이언트 사이드에서만 렌더링
  if (!mounted) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        오늘의 시간표 ({getDayOfWeek()}요일)
      </Typography>
      
      {(isBeforeFirstSlot() || isAfterLastSlot()) && (
        <Box sx={{ mb: 2, p: 1.5, bgcolor: 'info.lighter', borderRadius: 1 }}>
          <Typography variant="body2" fontWeight="medium" color="info.dark">
            {isBeforeFirstSlot() 
              ? `첫 시간 준비 중 - ${timetableData[0].startTime}에 첫 일정이 시작됩니다` 
              : '오늘 일정 종료 - 수고하셨습니다! 내일 뵙겠습니다'}
          </Typography>
        </Box>
      )}
      
      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 280px)' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>시간</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>일정</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timetableData.map((slot, index) => {
              const isCurrent = isCurrentTimeSlot(slot);
              return (
                <TableRow 
                  key={index} 
                  sx={{ 
                    backgroundColor: isCurrent ? 'primary.lighter' : index % 2 === 0 ? '#f5f5f5' : 'white',
                    '&:hover': {
                      backgroundColor: isCurrent ? 'primary.lighter' : '#e3f2fd'
                    }
                  }}
                >
                  <TableCell sx={{ p: 1.5 }}>
                    <Typography variant="body2">
                      {slot.startTime} ~ {slot.endTime}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({slot.duration})
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ p: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: isCurrent ? 'bold' : 'regular',
                          color: isCurrent ? 'primary.dark' : 'inherit'
                        }}
                      >
                        {getActivityForToday(slot)}
                      </Typography>
                      
                      {isCurrent && (
                        <Chip 
                          label="진행 중" 
                          size="small" 
                          color="primary" 
                          sx={{ height: 20, fontSize: '0.65rem' }}
                        />
                      )}
                    </Box>
                    
                    {isCurrent && (
                      <Box sx={{ width: '100%', mt: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={progressPercent} 
                          color="primary"
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 