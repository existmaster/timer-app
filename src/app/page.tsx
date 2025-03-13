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
  }, []);

  // 현재 날짜 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
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
      <Paper elevation={3} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: { xs: 2, md: 3 } 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" component="h1" fontWeight="bold">
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
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
            {formatDate(currentDate)}
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
      >
        <DialogTitle id="help-dialog-title" sx={{ fontWeight: 'bold', pb: 1 }}>
          앱 사용 안내
        </DialogTitle>
        <DialogContent dividers sx={{ py: 2 }}>
          <List>
            <ListItem>
              <ListItemText 
                primary="현재 시간과 다음 일정까지 남은 시간이 좌측에 표시됩니다." 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="시간표에서 현재 진행 중인 일정은 파란색으로 강조되며, 진행률이 표시됩니다." 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="다음 일정이 1분 이내로 남으면 알림 효과가 나타납니다." 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="앱을 계속 열어두면 시간표를 실시간으로 확인할 수 있습니다." 
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseHelp} color="primary" variant="contained" size="medium">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
