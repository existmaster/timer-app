'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Grid, 
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Timetable from './components/Timetable';
import Timer from './components/Timer';

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  // 클라이언트 사이드에서만 렌더링되도록 설정
  useEffect(() => {
    setMounted(true);
    // 초기 마운트 시 즉시 시간 업데이트
    updateCurrentDate();
  }, []);

  // 현재 시간을 한국 시간(KST)으로 가져오는 함수
  const getKoreanTime = () => {
    const now = new Date();
    // 한국 시간으로 변환 (UTC+9)
    const koreaTimeOffset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로 변환
    const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000); // 현재 시간을 UTC로 변환
    return new Date(utc + koreaTimeOffset);
  };

  // 현재 날짜 업데이트 함수
  const updateCurrentDate = () => {
    setCurrentDate(getKoreanTime());
  };

  // 현재 날짜 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      updateCurrentDate();
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(timer);
  }, []);

  // 날짜 포맷팅
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = days[date.getDay()];
    
    return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
  };

  // 도움말 열기
  const handleOpenHelp = () => {
    setHelpOpen(true);
  };

  // 도움말 닫기
  const handleCloseHelp = () => {
    setHelpOpen(false);
  };

  // 클라이언트 사이드에서만 렌더링
  if (!mounted) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper elevation={3} sx={{ 
        p: { xs: 2.5, md: 4 }, 
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: { xs: 2, md: 3 } 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" component="h1" fontWeight="bold" color="primary.dark">
              시간표 알림 앱
            </Typography>
            <IconButton 
              color="primary" 
              onClick={handleOpenHelp} 
              size="small" 
              sx={{ ml: 1.5 }}
              aria-label="도움말"
            >
              <HelpOutlineIcon />
            </IconButton>
          </Box>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              fontWeight: 'medium',
              bgcolor: 'primary.lighter',
              px: 1.5,
              py: 0.5,
              borderRadius: 10,
              border: '1px solid',
              borderColor: 'primary.light'
            }}
          >
            {formatDate(currentDate)} (KST)
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Timer />
          </Grid>
          <Grid item xs={12} md={8}>
            <Timetable />
          </Grid>
        </Grid>
      </Paper>

      {/* 도움말 다이얼로그 */}
      <Dialog
        open={helpOpen}
        onClose={handleCloseHelp}
        aria-labelledby="help-dialog-title"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <DialogTitle id="help-dialog-title" sx={{ 
          fontWeight: 'bold', 
          pb: 1,
          bgcolor: 'primary.lighter',
          color: 'primary.dark'
        }}>
          앱 사용 안내
        </DialogTitle>
        <DialogContent dividers sx={{ py: 2 }}>
          <List>
            <ListItem>
              <ListItemText 
                primary="현재 시간과 다음 일정까지 남은 시간이 좌측에 표시됩니다." 
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="시간표에서 현재 진행 중인 일정은 파란색으로 강조되며, 진행률이 표시됩니다." 
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="현재 일정으로 자동 스크롤되어 항상 현재 진행 중인 일정을 확인할 수 있습니다."
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="다음 일정이 1분 이내로 남으면 알림 효과가 나타납니다." 
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="앱을 계속 열어두면 시간표를 실시간으로 확인할 수 있습니다." 
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="모든 시간은 한국 표준시(KST)를 기준으로 표시됩니다." 
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, bgcolor: 'grey.50' }}>
          <Button 
            onClick={handleCloseHelp} 
            color="primary" 
            variant="contained" 
            size="medium"
            sx={{ borderRadius: 2, px: 3 }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
