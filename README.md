# 시간표 알림 앱

시간표를 관리하고 일정에 대한 알림을 제공하는 웹 애플리케이션입니다. 이 프로젝트는 [Next.js](https://nextjs.org)를 기반으로 개발되었습니다.

## 기능

- 현재 시간 및 다음 일정까지 남은 시간 표시
- 시간표에서 현재 진행 중인 일정 강조 표시
- 일정 시작 전 브라우저 알림 제공
- 반응형 디자인으로 모바일 및 데스크톱 환경 지원
- PWA(Progressive Web App) 지원으로 설치 가능

## 시작하기

개발 서버를 실행하려면:

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
# 또는
bun dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

## 빌드 및 배포

정적 웹사이트로 빌드하려면:

```bash
npm run build
# 또는
yarn build
```

빌드 결과는 `out` 디렉토리에 생성됩니다.

## PWA 기능

이 앱은 PWA(Progressive Web App)로 개발되어 다음과 같은 기능을 제공합니다:

- 브라우저에서 '설치' 버튼을 통해 앱처럼 설치 가능
- 오프라인에서도 기본 기능 사용 가능
- 홈 화면에 아이콘 추가 가능
- 앱 실행 시 스플래시 화면 표시

PWA를 설치하려면:
1. 웹 브라우저에서 앱에 접속합니다.
2. 주소 표시줄 오른쪽 또는 메뉴에서 '설치' 버튼을 클릭합니다.
3. 설치 확인 메시지가 표시되면 '설치'를 선택합니다.
4. 이제 앱이 설치되어 데스크톱이나 모바일 기기의 홈 화면에서 실행할 수 있습니다.

## 무료 호스팅 서비스에 배포하기

이 프로젝트는 정적 웹사이트로 빌드되므로 다음과 같은 무료 호스팅 서비스에 쉽게 배포할 수 있습니다:

### GitHub Pages

1. GitHub 저장소를 생성합니다.
2. 프로젝트를 저장소에 푸시합니다.
3. GitHub Actions를 설정하거나 수동으로 빌드 결과를 `gh-pages` 브랜치에 푸시합니다.
4. 저장소 설정에서 GitHub Pages를 활성화합니다.

### Netlify

1. [Netlify](https://www.netlify.com/)에 가입합니다.
2. 새 사이트를 GitHub 저장소에서 가져옵니다.
3. 빌드 명령어를 `npm run build`로 설정하고 게시 디렉토리를 `out`으로 설정합니다.

### Vercel

1. [Vercel](https://vercel.com/)에 가입합니다.
2. 새 프로젝트를 GitHub 저장소에서 가져옵니다.
3. Next.js 프로젝트가 자동으로 감지되어 배포됩니다.

## 기술 스택

- [Next.js](https://nextjs.org/) - React 프레임워크
- [Material UI](https://mui.com/) - UI 컴포넌트 라이브러리
- [TypeScript](https://www.typescriptlang.org/) - 정적 타입 지원
- [next-pwa](https://github.com/shadowwalker/next-pwa) - PWA 지원

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
