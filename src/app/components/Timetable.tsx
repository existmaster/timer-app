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

  // 클라이언트 사이드에서만 렌더링되도록 설정
  useEffect(() => {
    setMounted(true);
  }, []);

  // 현재 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 현재 시간대의 진행률 계산
  useEffect(() => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();
    const currentTimeInSeconds = (currentHour * 60 + currentMinute) * 60 + currentSecond;
    
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
        break;
      }
    }
  }, [currentTime]);

  const getDayOfWeek = () => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[currentTime.getDay()];
  };

  const getActivityForToday = (slot: TimeSlot) => {
    if (!slot.subActivities) return slot.activity;

    const today = currentTime.getDay(); // 0: 일요일, 1: 월요일, ...
    
    if (today === 1 && slot.subActivities.monday) {
      return slot.subActivities.monday;
    } else if (today === 3 && slot.subActivities.wednesday) {
      return slot.subActivities.wednesday;
    } else if (today === 5 && slot.subActivities.friday) {
      return slot.subActivities.friday;
    }
    
    return slot.activity;
  };

  const isCurrentTimeSlot = (slot: TimeSlot) => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    const [startHour, startMinute] = slot.startTime.split(':').map(Number);
    const [endHour, endMinute] = slot.endTime.split(':').map(Number);
    
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;
    
    return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes;
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
                        {getActivityForToday(slot) || '수업'}
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