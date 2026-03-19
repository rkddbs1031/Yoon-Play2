# Yoon-Play

🎧 사용자의 기분과 취향에 맞춰 AI가 음악을 추천하는 웹 기반 뮤직 플레이어

<br />

## 주요 기능

- **AI 음악 추천** — 자연어 입력(예: "비 오는 날 듣기 좋은 노래")으로 맞춤형 플레이리스트 생성
- **뮤직 플레이어** — 재생/일시정지, 이전/다음, 볼륨, 진행바 드래그 지원
- **보관함** — 좋아요 및 사용자 플레이리스트 생성·관리
- **탐색** — 장르·키워드 기반 무한 스크롤 탐색
- **상태 복원** — 새로고침 후에도 재생 중이던 곡과 목록 유지

<br />

## 기술적 의사결정

### AI 추천 파이프라인

단순히 사용자 입력을 그대로 검색하면 의도와 무관한 결과가 나올 수 있어서, 2단계 처리 구조로 설계했습니다.

```
① 관련성 검증  — 입력이 음악 추천과 관련 있는지 먼저 판단 (artist / mood / weather / time / activity)
② 추천 생성    — 감정·상황 분석 → 음악 장르·키워드 추출 → 플레이리스트 구성
```

---

### 렌더링 최적화

**커스텀 훅 구독 분리**

플레이어 상태를 역할별로 분리해 컴포넌트가 필요한 상태만 구독하도록 설계했습니다.

| 훅 | 역할 |
|---|---|
| `usePlayerCore` | 재생 목록, 재생 제어 |
| `usePlayerTime` | 현재 시간, 재생 길이 |
| `usePlayerVolume` | 볼륨 |

`currentTime`은 300ms마다 갱신되는데, 이를 읽지 않아도 되는 컴포넌트가 구독하면 불필요한 리렌더링이 연쇄적으로 발생합니다. 훅을 분리해 각 컴포넌트가 필요한 상태만 구독하도록 했습니다.

**ProgressBar 리플로우 제거**

`width` 변경은 브라우저 렌더링 파이프라인의 Layout 단계부터 재계산을 유발합니다. `transform: scaleX`는 Composite 단계에서만 처리되므로 리플로우 없이 GPU에서 처리됩니다.

```
width 변경  →  Layout  →  Paint  →  Composite  (리플로우 발생)
scaleX 변경 →                        Composite  (GPU 처리)
```

**가상화 (React Virtual)**

플레이리스트 트랙 목록에 `useVirtualizer`를 적용해 실제 DOM에는 뷰포트에 보이는 항목만 렌더링합니다.

**Streaming SSR (result 페이지)**

`/result` 페이지는 Server Component에서 YouTube 데이터를 fetch합니다. `loading.tsx`를 추가해 fetch 대기 중에 스켈레톤을 즉시 스트리밍하고, 데이터가 준비되면 실제 결과로 교체합니다.

---

### IndexedDB 스키마 설계

서버 없이 클라이언트에서 완결되는 구조가 목적이었기 때문에 IndexedDB를 선택했습니다.

초기에는 좋아요와 플레이리스트에 트랙 데이터를 각각 저장했는데, 같은 트랙이 중복 저장되는 문제가 있었습니다. 이를 관계 테이블 구조로 개선했습니다.

```
tracks          — 트랙 단일 저장소 (중복 방지)
playlists       — 플레이리스트 메타데이터
playlistTracks  — 다대다 관계 테이블 (by-playlist 인덱스, order 필드)
playerState     — 현재 재생 상태 영속화
```

<br />

## 기술 스택

| 분류 | 기술 |
|---|---|
| Framework | Next.js 16, React 19, TypeScript |
| 스타일 | Tailwind CSS 4 |
| 상태 관리 | Jotai |
| 서버 상태 | TanStack React Query v5 |
| 가상화 | TanStack React Virtual |
| AI | OpenAI API (GPT-4o-mini) |
| 로컬 저장소 | IndexedDB (idb) |

<br />

## 시작하기

### 환경 변수 설정

```bash
OPENAI_API_KEY=your_openai_api_key
YOUTUBE_API_KEY=your_youtube_api_key
```

### 설치 및 실행

```bash
npm install
npm run dev
```

<br />

## 프로젝트 구조

```
app/
├── api/          # OpenAI, YouTube API 라우트
├── explore/      # 탐색 페이지
├── library/      # 보관함, 플레이리스트 상세
├── main/         # 메인 (AI 추천 결과)
└── result/       # 검색 결과

components/       # UI 컴포넌트
hooks/            # 커스텀 훅
store/            # Jotai atoms
services/         # React Query 훅
lib/indexedDB/    # IndexedDB CRUD
```
