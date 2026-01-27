# Unicorn - AI 로봇 쇼핑몰

## GitHub Pages 배포 가이드

### 자동 배포 설정

이 프로젝트는 GitHub Actions를 사용하여 자동으로 GitHub Pages에 배포됩니다.

#### 1. GitHub 저장소 설정

1. GitHub 저장소로 이동: https://github.com/fornerds/unicorn
2. Settings > Pages로 이동
3. Source를 "GitHub Actions"로 설정
4. Save 클릭

#### 2. 배포 트리거

- `main` 또는 `master` 브랜치에 push하면 자동으로 배포됩니다
- 또는 GitHub Actions 탭에서 수동으로 워크플로우를 실행할 수 있습니다

#### 3. 배포 확인

배포가 완료되면 다음 URL에서 사이트를 확인할 수 있습니다:
- `https://fornerds.github.io/unicorn/` (저장소 이름이 basePath인 경우)
- 또는 GitHub Pages 설정에서 확인한 커스텀 도메인

### 수동 배포 (선택사항)

로컬에서 빌드하고 수동으로 배포하려면:

```bash
cd frontend
npm install
NODE_ENV=production npm run build
```

빌드된 파일은 `frontend/out` 폴더에 생성됩니다.

### 환경 변수

GitHub Pages 배포를 위해 다음 환경 변수를 설정할 수 있습니다:
- `NEXT_PUBLIC_BASE_PATH`: 기본 경로 (기본값: '')
- `NEXT_PUBLIC_ASSET_PREFIX`: 에셋 경로 (기본값: '')

### 문제 해결

배포에 문제가 있는 경우:
1. GitHub Actions 탭에서 워크플로우 로그 확인
2. `frontend/out` 폴더가 생성되었는지 확인
3. Next.js 빌드 오류 확인
