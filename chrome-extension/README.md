# 와플노트 chrome extension 프로그램 
## 와플노트란
 실시간 화상 강의 내용을 인공지능과 영상처리 기술을 활용하여 자동으로 강의 내용을
기록하고 정리/분석하는 서비스를 제공한다. 이를 통해 사용자는 온전히 강의에 집중할 
수 있고, 분석된 결과물을 통해 강의 내용을 복습할 수 있다.

## 와플노트 크롬 익스텐션
프론트엔드는 크롬 익스텐션 내부에서 동작하는 “Background”와 화면 UI를 담당하는 “Main web”로 구성되어 있다. 
### Background
Chrome 내장 API 인 Chrome.desktopCapure 기능을 사용했으며 이를 통해 사용자의 강의 영상을 stream 형식의 데이터를 가져올 수 있다. 이 후 해당 데이터를 Image Processing 서버와 STT(Speech To Text) 서버에서 요구하는 데이터 형식에 맞게 (이미지 및 음성 데이터)  변환하는 작업을 수행한다. 결과값은 chrome storage에 저장한다.
 1. stream to mp3

    서버 부담을 낮추고 지연 시간을 최소화하기 위해 일반적인 음성 데이터 형식(.wav)이 아닌 mp3로 인코딩하는 작업을 수행한다. 변환된 mp3 파일은 STT 서버로 전송되며 텍스트로 변환된 결과값을 리턴받고 chrome storage에 추가한다.
 2. stream to image

    영상의 프레임을 png형식의 이미지로 변환하여 Image Processing 서버로 전송한다. 이전 프레임의 이미지와 현재 프레임의 이미지를 함께 전송하며 화면 전환을 감지했을 경우 true를 리턴받는다. 
결과값이 true일 경우 현재 이미지를 chrome storage에  추가한다.

### Main web
React 라이브러리를 활용하여 chrome extension 내에서 실시간 반응형 웹을 구현하였다. Main web은 크게 두 가지 컴포넌트로 구성된다.

1. 팝업 페이지

    크롬 브라우저 상단의 와플노트 아이콘을 클릭했을 때 렌더링되는 페이지이다. 로그인, 강의노트 조회 및 Background와 상호작용하여 사용자가 선택한 탭(강의 영상)을 Capture 하도록 Background에 요청하는 “강의노트 시작” 기능을 수행한다. 

2. 노트 페이지

    와플노트의 Main web에 해당하며 Chrome storage에 저장된 강의 슬라이드 및 스크립트를 렌더링하는 역할을 수행한다. 슬라이드, 스크립트, 사용자 메모, 주요 키워드 등의 기능을 사용할 수 있다.
 

## How to run

### on local(prov)
1. 하단 코드 실행
```
    git clone git@git.swmgit.org:swmaestro/newwave-1.git
    npm install
    npm run build
```
2. chrome://extensions/ 접속
3. "압축 해제된 확장프로그램을 로드합니다" 클릭
4. dist folder 선택
5. 크롬 브라우저 우측 상단의 와플노트 아이콘 클릭 및 실행