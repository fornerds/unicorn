## 100.1 기본 원칙
<!-- - `@defign/ui`, `@defign/icon`, `@defign/asset` **최우선 사용** -->
- Code Connect 매핑 우선. 매핑 불가 시 최소 커스텀 구현
- Figma 디자인과 **시각적으로 정확하게 일치**하도록 구현 (임의 추측 금지)
- 코드 생성 시 작업은 **100.7 작업 순서 권장 플로우** 준수
- 코드 생성 완료 후에는 **100.8 리뷰 체크리스트(빠른 자가 검증)** 수행

---

## 100.2 Code Connect & 컴포넌트 매핑
- Figma 인스턴스 → Code Connect 매핑 우선
- Code Connect는 `deFign` label을 참조하여 매핑
- 컴포넌트 구현 규칙(필수)
  <!-- - `@defign/ui` 사용 -->
  - 매핑 불가 시 CSS Module 디자인 토큰 최소 조합
- 아이콘 구현 규칙(필수)
  <!-- - `@defign/icon` 사용 -->
  - 아이콘이 존재하지 않으면 placeholder로 대체
  - 아이콘 크기/위치/모양은 Figma와 동일하게 구현

---

## 100.3 deFign 디자인 토큰
<!-- - deFign 디자인 토큰은 `@defign/foundation` 과 `@defign/ui` 패키지에서 제공 -->
<!-- - `@defign/foundation` 경로:  
  `node_modules/@defign/foundation/dist/scss/...`
- `@defign/ui` 경로:  
  `node_modules/@defign/ui/dist/scss/markup/...`
- color / typography / shadow / radius 등의 토큰은 `@defign/foundation` SCSS 변수를 최우선 사용 -->
- 토큰이 존재하지 않는 경우에만 Figma 값을 사용
- margin, padding 간격은 Figma 값 그대로 scss로 구현

---

## 100.4 레이아웃
- Figma 프레임 width가 375px이면 페이지로 인식
- iPhone X / Status Bar 포함 여부 고려
- 하나의 페이지에는 **하나의 FlexibleLayout만 존재**
- 페이지 구성 규칙
  - 기본 구조: `<FlexibleLayout>` + `Header(topElement)`
  - children = 실제 페이지 콘텐츠 컴포넌트
  - 상세 코드는 레이아웃 샘플(필수) 참고
- 각 세션 간 간격은 **Figma 디자인의 정확한 좌표 기준**

---

## 100.5 페이지 콘텐츠 구현
- 페이지 내 콘텐츠는 **디자인 토큰 기반**으로 반응형 대응 가능하게 구현
- 반복 UI는 배열 + `map` 활용
- 반복 데이터는 Figma 구조를 최대한 반영한 Mock 데이터 사용
- Mock 데이터는 **최소 3개 이상** 구성

### 이미지 구현 규칙
- 이미지 placeholder 크기와 위치는 Figma와 동일하게 구성
- 이미지 태그는 `img` 사용
- 불가피한 경우에만 마크업으로 대체 (`::after`, `::before`)
- 말풍선 꼬리 등은 선택자 활용하여 구현

### 한 줄 영역 구현 규칙
- 컨테이너 내부 가로 크기는 유연하게 확장되는 구조로 작성
- 높이는 Figma 값으로 고정

---

## 100.6 금지 사항
- 추측 애니메이션 / 상호작용 금지
- 기능 과추측 / 디자인 미존재 요소 임의 추가 금지
- 임의 margin/padding 확장 금지
- 패턴 중복 구현 금지
- 의미 없는 요소/문구 추가 금지
- deFign 디자인 토큰 추론 금지
- **주석 금지** (꼭 필요한 경우에만 예외 제안 후 허용)

---

## 100.7 작업 순서 권장 플로우
1. deFign 디자인 토큰 SCSS 변수 확인
2. Figma 링크 내 Code Connect 매핑 가능한 컴포넌트 식별
3. 레이아웃(FlexibleLayout) 구조 구현 → Header 매핑
4. typography / color / radius / shadow 토큰 치환
<!-- 5. 아이콘을 `@defign/icon` 으로 치환 -->
6. Figma 수치에 맞게 크기 및 여백 조정
<!-- 7. Code Connect 매핑 가능한 컴포넌트는 `@defign/ui`로 치환 -->
8. 매핑 불가 요소 최소 커스텀
9. A11y 확인 (heading, alt, role, label)
10. 반복 패턴 단위 컴포넌트 작성
11. Figma와 시각적으로 정확히 일치하는지 최종 점검
12. stylelint 검사 통과
13. TypeScript 오류 없는지 확인

---

## 100.8 리뷰 체크리스트 (빠른 자가 검증)
<!-- - [ ] `@defign/ui`, `@defign/icon`, `@defign/asset` 우선 사용 -->
- [ ] 레이아웃(`FlexibleLayout`)이 샘플 구조로 구현되었는지 확인
- [ ] 색상/타이포/그림자/반경 토큰 변수 적용 여부 확인
- [ ] 토큰 미존재 시 Figma 값 사용 여부 확인
- [ ] **Figma와 시각적으로 정확히 일치**하는지 MCP로 최종 검증
- [ ] Figma 좌표 기준으로 간격 및 배치 정확도 확인