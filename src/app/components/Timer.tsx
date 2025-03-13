'use client';

import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Divider, 
  Card, 
  CardContent,
  Alert
} from '@mui/material';
import { TimeSlot } from '../types';
import { timetableData } from '../data/timetable';

export default function Timer() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentSlot, setCurrentSlot] = useState<TimeSlot | null>(null);
  const [nextSlot, setNextSlot] = useState<TimeSlot | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [currentTimeRemaining, setCurrentTimeRemaining] = useState<string>('');
  const [isTransition, setIsTransition] = useState(false);
  const [mounted, setMounted] = useState(false);

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
    updateTimeSlots(now);
  };

  // 현재 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      updateCurrentTime();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 현재 시간대와 다음 시간대 찾기
  const updateTimeSlots = (now: Date) => {
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();
    const currentTimeInSeconds = (currentHour * 60 + currentMinute) * 60 + currentSecond;
    
    let current: TimeSlot | null = null;
    let next: TimeSlot | null = null;
    let isBeforeFirstSlot = false;
    let isAfterLastSlot = false;
    
    // 첫 시간과 마지막 시간 확인
    const firstSlot = timetableData[0];
    const lastSlot = timetableData[timetableData.length - 1];
    
    const [firstStartHour, firstStartMinute] = firstSlot.startTime.split(':').map(Number);
    const [lastEndHour, lastEndMinute] = lastSlot.endTime.split(':').map(Number);
    
    const firstStartTimeInSeconds = (firstStartHour * 60 + firstStartMinute) * 60;
    const lastEndTimeInSeconds = (lastEndHour * 60 + lastEndMinute) * 60;
    
    // 첫 시간 이전인지 확인
    if (currentTimeInSeconds < firstStartTimeInSeconds) {
      isBeforeFirstSlot = true;
      next = firstSlot;
    }
    
    // 마지막 시간 이후인지 확인
    if (currentTimeInSeconds >= lastEndTimeInSeconds) {
      isAfterLastSlot = true;
      // 마지막 시간 이후에는 다음 일정을 설정하지 않음
      next = null;
    }
    
    // 현재 시간대 찾기
    for (let i = 0; i < timetableData.length; i++) {
      const slot = timetableData[i];
      const [startHour, startMinute] = slot.startTime.split(':').map(Number);
      const [endHour, endMinute] = slot.endTime.split(':').map(Number);
      
      const startTimeInSeconds = (startHour * 60 + startMinute) * 60;
      const endTimeInSeconds = (endHour * 60 + endMinute) * 60;
      
      if (currentTimeInSeconds >= startTimeInSeconds && currentTimeInSeconds < endTimeInSeconds) {
        current = slot;
        
        // 현재 일정의 남은 시간 계산
        const remainingSeconds = endTimeInSeconds - currentTimeInSeconds;
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;
        
        setCurrentTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        
        // 다음 시간대 찾기
        if (i < timetableData.length - 1) {
          next = timetableData[i + 1];
        } else {
          // 마지막 시간대인 경우 다음 일정은 없음
          next = null;
        }
        break;
      }
    }
    
    // 현재 시간대가 없는 경우 (모든 시간대 이후인 경우)
    if (!current && !isBeforeFirstSlot && !isAfterLastSlot) {
      // 현재 일정 남은 시간 초기화
      setCurrentTimeRemaining('');
      
      // 다음 시간대 찾기 (오늘 남은 시간대 중에서)
      for (let i = 0; i < timetableData.length; i++) {
        const slot = timetableData[i];
        const [startHour, startMinute] = slot.startTime.split(':').map(Number);
        const startTimeInSeconds = (startHour * 60 + startMinute) * 60;
        
        if (startTimeInSeconds > currentTimeInSeconds) {
          next = slot;
          break;
        }
      }
      
      // 오늘 남은 시간대가 없는 경우 다음 일정은 없음
      if (!next) {
        next = null;
      }
    }
    
    setCurrentSlot(current);
    setNextSlot(next);
    
    // 다음 시간대까지 남은 시간 계산
    if (next) {
      const [nextStartHour, nextStartMinute] = next.startTime.split(':').map(Number);
      let nextStartTimeInSeconds = (nextStartHour * 60 + nextStartMinute) * 60;
      
      // 다음 시간대가 다음날인 경우 (마지막 시간 이후)
      if (isAfterLastSlot || nextStartTimeInSeconds <= currentTimeInSeconds) {
        nextStartTimeInSeconds += 24 * 60 * 60; // 24시간을 초로 추가
      }
      
      const remainingSeconds = nextStartTimeInSeconds - currentTimeInSeconds;
      const hours = Math.floor(remainingSeconds / 3600);
      const minutes = Math.floor((remainingSeconds % 3600) / 60);
      const seconds = remainingSeconds % 60;
      
      setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      
      // 다음 시간대까지 1분 이내로 남았을 때 전환 효과 활성화
      setIsTransition(remainingSeconds <= 60);
    } else {
      // 다음 일정이 없는 경우 남은 시간 초기화
      setTimeRemaining('');
      setIsTransition(false);
    }
  };

  // 현재 활동 가져오기
  const getCurrentActivity = (slot: TimeSlot | null) => {
    if (!slot) return '일정 없음';
    
    if (slot.activity) {
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
    }
    
    return '수업';
  };

  // 첫 시간 이전 또는 마지막 시간 이후인지 확인
  const isBeforeFirstSlot = () => {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeInSeconds = (currentHour * 60 + currentMinute) * 60;
    
    const firstSlot = timetableData[0];
    const [firstStartHour, firstStartMinute] = firstSlot.startTime.split(':').map(Number);
    const firstStartTimeInSeconds = (firstStartHour * 60 + firstStartMinute) * 60;
    
    return currentTimeInSeconds < firstStartTimeInSeconds;
  };
  
  const isAfterLastSlot = () => {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeInSeconds = (currentHour * 60 + currentMinute) * 60;
    
    const lastSlot = timetableData[timetableData.length - 1];
    const [lastEndHour, lastEndMinute] = lastSlot.endTime.split(':').map(Number);
    const lastEndTimeInSeconds = (lastEndHour * 60 + lastEndMinute) * 60;
    
    return currentTimeInSeconds >= lastEndTimeInSeconds;
  };

  // 시간을 한국 형식으로 포맷팅
  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // 클라이언트 사이드에서만 렌더링
  if (!mounted) {
    return null;
  }

  return (
    <Paper 
      elevation={isTransition ? 3 : 1} 
      sx={{ 
        p: { xs: 1.5, md: 2 }, 
        height: '100%',
        backgroundColor: isTransition ? '#ffebee' : 'white',
        transition: 'background-color 0.5s ease',
        animation: isTransition ? 'pulse 1.5s infinite' : 'none',
        '@keyframes pulse': {
          '0%': { opacity: 1 },
          '50%': { opacity: 0.8 },
          '100%': { opacity: 1 }
        },
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        현재 시간
      </Typography>
      
      <Card 
        elevation={0} 
        sx={{ 
          bgcolor: 'primary.lighter', 
          p: 2, 
          mb: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'primary.light'
        }}
      >
        <Typography 
          variant="h4" 
          align="center" 
          fontWeight="bold"
          color="primary.dark"
          sx={{ 
            fontFamily: 'monospace',
            letterSpacing: 1
          }}
        >
          {formatTime(currentTime)}
        </Typography>
      </Card>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          현재 일정
        </Typography>
        
        <Card 
          elevation={0} 
          sx={{ 
            p: 2, 
            mb: 2, 
            bgcolor: currentSlot ? 'primary.lighter' : 'grey.100',
            borderRadius: 2,
            border: '1px solid',
            borderColor: currentSlot ? 'primary.light' : 'grey.300'
          }}
        >
          <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
            <Typography 
              variant="body1" 
              fontWeight="medium" 
              color={currentSlot ? 'primary.dark' : 'text.secondary'}
              gutterBottom
            >
              {currentSlot ? getCurrentActivity(currentSlot) : isBeforeFirstSlot() ? '첫 일정 준비 중' : '일정 없음'}
            </Typography>
            
            {currentSlot && (
              <>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {currentSlot.startTime} ~ {currentSlot.endTime} ({currentSlot.duration})
                </Typography>
                
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="caption" color="primary.main" sx={{ mr: 1 }}>
                    남은 시간:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="primary.dark" fontFamily="monospace">
                    {currentTimeRemaining}
                  </Typography>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
        
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          다음 일정
        </Typography>
        
        <Card 
          elevation={0} 
          sx={{ 
            p: 2, 
            bgcolor: nextSlot ? (isTransition ? '#ffebee' : 'info.lighter') : 'grey.100',
            borderRadius: 2,
            border: '1px solid',
            borderColor: nextSlot ? (isTransition ? '#ef9a9a' : 'info.light') : 'grey.300',
            transition: 'all 0.3s ease'
          }}
        >
          <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
            <Typography 
              variant="body1" 
              fontWeight="medium" 
              color={nextSlot ? (isTransition ? 'error.main' : 'info.dark') : 'text.secondary'}
              gutterBottom
            >
              {nextSlot ? getCurrentActivity(nextSlot) : isAfterLastSlot() ? '오늘 일정 종료' : '다음 일정 없음'}
            </Typography>
            
            {nextSlot && (
              <>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {nextSlot.startTime} ~ {nextSlot.endTime} ({nextSlot.duration})
                </Typography>
                
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                  <Typography 
                    variant="caption" 
                    color={isTransition ? 'error.main' : 'info.main'} 
                    sx={{ mr: 1 }}
                  >
                    시작까지:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="bold" 
                    color={isTransition ? 'error.dark' : 'info.dark'} 
                    fontFamily="monospace"
                    sx={{
                      animation: isTransition ? 'blink 1s infinite' : 'none',
                      '@keyframes blink': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.5 },
                        '100%': { opacity: 1 }
                      }
                    }}
                  >
                    {timeRemaining}
                  </Typography>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
      
      {isTransition && nextSlot && (
        <Alert 
          severity="warning" 
          sx={{ 
            mt: 2, 
            animation: 'fadeIn 0.5s',
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 }
            }
          }}
        >
          <Typography variant="body2">
            <strong>{nextSlot.startTime}</strong>에 <strong>{getCurrentActivity(nextSlot)}</strong> 일정이 곧 시작됩니다!
          </Typography>
        </Alert>
      )}
    </Paper>
  );
} 