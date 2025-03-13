# 시간표 알림 앱 배포 정보

## 배포 세부 정보

- **프로젝트명**: 시간표 알림 앱
- **배포 URL**: https://kt-alp-timer.netlify.app
- **배포 플랫폼**: Netlify
- **사이트 ID**: 38cd2341-1828-4d99-b9d6-b8b24ba8ead6
- **마지막 배포 날짜**: 2024년 6월 25일
- **배포 로그**: https://app.netlify.com/sites/kt-alp-timer/deploys
- **관리자 URL**: https://app.netlify.com/sites/kt-alp-timer

## 배포 방법

### Netlify CLI를 사용한 배포

```bash
# Netlify CLI 설치
npm install -g netlify-cli

# Netlify 로그인
netlify login

# 프로젝트 초기화 (처음 배포 시)
netlify init

# 빌드
npm run build

# 배포
netlify deploy --prod
```

### Netlify 웹 인터페이스를 통한 배포

1. [Netlify](https://www.netlify.com/)에 로그인합니다.
2. 사이트 대시보드에서 "kt-alp-timer" 사이트를 선택합니다.
3. "Deploys" 탭으로 이동합니다.
4. "Deploy manually" 버튼을 클릭합니다.
5. 빌드된 `out` 디렉토리를 업로드합니다.

## 주요 기능 및 업데이트 내역

### 2024년 6월 25일 업데이트
- 특별활동 표시 방식 개선 ("특별활동 (스트레칭)" 형식으로 표시)
- 특별활동 요일별 데이터 수정 (월/화/목: 스트레칭, 수: 선배와의 대화, 금: 조별 활동)
- 알림 메시지 형식 통일

### 2024년 3월 13일 업데이트
- 한국 표준시(KST) 적용
- 시간 비교 로직 개선
- 활동 표시 로직 개선
- PWA 기능 추가

## 환경 설정

- **빌드 명령어**: `npm run build`
- **게시 디렉토리**: `out`
- **프레임워크**: Next.js
- **Node.js 버전**: 20.x

## 문제 해결

배포 후 문제가 발생하면 다음을 확인하세요:

1. Netlify 배포 로그에서 오류 메시지 확인
2. 로컬에서 `npm run build` 명령어로 빌드 테스트
3. 브라우저 개발자 도구의 콘솔에서 오류 메시지 확인

## 관련 리소스

- [Netlify 문서](https://docs.netlify.com/)
- [Next.js 배포 가이드](https://nextjs.org/docs/app/building-your-application/deploying)
- [PWA 문서](https://web.dev/progressive-web-apps/) 