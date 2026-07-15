<template>
  <Header />
  
  <div class="admin-dashboard">
    <div class="admin-header">
      <h2>데이터 적재 관리자 패널</h2>
    </div>
    
    <div class="admin-card">
      <form @submit.prevent="handleDataLoad">
        <!-- 드래그 앤 드롭 파일 업로드 영역 -->
        <div class="form-section">
          <label class="section-label">데이터 파일 업로드</label>
          
          <div 
            class="dropzone" 
            :class="{ 'is-dragging': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            @click="triggerFileInput"
          >
            <div class="dropzone-content">
              <span class="upload-icon">📁</span>
              <p v-if="!isDragging">클릭하거나 파일을 이곳으로 드래그하세요.</p>
              <p v-else class="drag-active-text">여기에 파일을 놓아주세요!</p>
              <small>.json 확장자만 지원됩니다.</small>
            </div>
            <input 
              type="file" 
              id="jsonFiles" 
              ref="fileInputRef"
              accept=".json" 
              multiple
              @change="onFilesSelected" 
              class="hidden-input"
            />
          </div>

          <!-- 선택된 파일 미리보기 목록 -->
          <ul v-if="selectedFiles.length > 0" class="selected-files-list">
            <li v-for="(file, index) in selectedFiles" :key="index" class="file-badge">
              <span class="file-name">{{ file.name }}</span>
              <button type="button" class="btn-remove" @click.stop="removeFile(index)">✕</button>
            </li>
          </ul>
        </div>

        <!-- 관리자 비밀번호 입력 영역 -->
        <div class="form-section">
          <label for="adminPassword" class="section-label">관리자 비밀번호</label>
          <input 
            type="password" 
            id="adminPassword" 
            v-model="password" 
            placeholder="비밀번호를 입력하세요" 
            class="styled-input"
            required 
          />
        </div>

        <!-- 실행 버튼 -->
        <button 
          type="submit" 
          class="btn-submit" 
          :class="{ 'is-loading': isLoading }"
          :disabled="isLoading || selectedFiles.length === 0"
        >
          <span v-if="isLoading" class="loader"></span>
          <span>{{ isLoading ? '업로드 중...' : '업로드' }}</span>
        </button>
      </form>

      <!-- 개별 파일 처리 결과 리스트 -->
      <div v-if="results.length > 0" class="results-container">
        <div class="results-header">
          <h3>업로드 결과 리포트</h3>
          <span class="total-badge">총 {{ totalInserted.toLocaleString() }}건 적재 완료</span>
        </div>
        <ul class="result-list">
          <li 
            v-for="(res, index) in results" 
            :key="index"
            :class="['result-item', res.isError ? 'error-item' : 'success-item']"
          >
            <div class="result-info">
              <span class="status-icon">{{ res.isError ? '❌' : '✅' }}</span>
              <strong>{{ res.fileName }}</strong>
              <span class="divider">|</span>
              <span class="message">{{ res.message }}</span>
            </div>
            <div v-if="!res.isError" class="count-tag">
              {{ res.count.toLocaleString() }}건
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { loadTourData } from '@/services/adminApi';
import Header from '@/components/common/Header.vue';

const fileInputRef = ref(null);
const selectedFiles = ref([]);
const password = ref('');
const isLoading = ref(false);
const isDragging = ref(false);
const results = ref([]);

// 총 적재량 계산
const totalInserted = computed(() => {
  return results.value.reduce((total, res) => total + (res.count || 0), 0);
});

// 파일 선택 공통 로직
const processFiles = (files) => {
  results.value = []; 
  const fileArray = Array.from(files);
  const validFiles = fileArray.filter(file => file.name.endsWith('.json'));
  
  if (validFiles.length !== fileArray.length) {
    alert('JSON 파일만 업로드 가능합니다. 유효하지 않은 파일은 제외되었습니다.');
  }
  
  selectedFiles.value = [...selectedFiles.value, ...validFiles];
};

// input 태그 변경 시
const onFilesSelected = (event) => {
  processFiles(event.target.files);
  event.target.value = ''; // 동일 파일 재선택을 위해 초기화
};

// 드래그 앤 드롭 이벤트
const handleDrop = (event) => {
  isDragging.value = false;
  if (event.dataTransfer.files) {
    processFiles(event.dataTransfer.files);
  }
};

// 영역 클릭 시 숨겨진 파일 인풋 트리거
const triggerFileInput = () => {
  fileInputRef.value.click();
};

// 선택된 파일 개별 삭제
const removeFile = (index) => {
  selectedFiles.value.splice(index, 1);
};

// 비동기 병렬 업로드
const handleDataLoad = async () => {
  if (selectedFiles.value.length === 0) return;

  isLoading.value = true;
  results.value = [];
  
  const uploadPromises = selectedFiles.value.map(async (file) => {
    try {
      const resData = await loadTourData(file, password.value);
      return {
        fileName: file.name,
        isError: false,
        message: resData.message,
        count: resData.inserted_count
      };
    } catch (error) {
      return {
        fileName: file.name,
        isError: true,
        message: error.detail || '서버 통신 오류',
        count: 0
      };
    }
  });

  const uploadResults = await Promise.all(uploadPromises);
  results.value = uploadResults;
  
  selectedFiles.value = [];
  isLoading.value = false;
};
</script>

<style scoped>
/* 전체 컨테이너 및 헤더 */
.admin-dashboard {
  max-width: 960px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
  color: #333;
}

.admin-header {
  text-align: center;
  margin-bottom: 24px;
}

.admin-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.admin-header p {
  color: #666;
  font-size: 0.95rem;
}

/* 카드 UI */
.admin-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.form-section {
  margin-bottom: 24px;
}

.section-label {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #4a4a4a;
}

/* 드롭존 (Drag & Drop) */
.dropzone {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  background-color: #f9fafb;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropzone:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.dropzone.is-dragging {
  border-color: #2563eb;
  background-color: #dbeafe;
  transform: scale(1.02);
}

.dropzone-content p {
  margin: 12px 0 4px 0;
  font-weight: 500;
  color: #374151;
}

.drag-active-text {
  color: #2563eb !important;
  font-weight: 600 !important;
}

.dropzone-content small {
  color: #9ca3af;
}

.upload-icon {
  font-size: 2.5rem;
}

.hidden-input {
  display: none;
}

/* 선택된 파일 뱃지 */
.selected-files-list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.file-badge {
  display: inline-flex;
  align-items: center;
  background-color: #f3f4f6;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  border: 1px solid #e5e7eb;
}

.file-name {
  margin-right: 8px;
  color: #4b5563;
  font-weight: 500;
}

.btn-remove {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.btn-remove:hover {
  color: #ef4444;
}

/* 일반 인풋 */
.styled-input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.styled-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

/* 서밋 버튼 */
.btn-submit {
  width: 100%;
  padding: 14px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background-color 0.2s, transform 0.1s;
}

.btn-submit:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-submit:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-submit:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

/* 로딩 스피너 */
.loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 결과 리포트 섹션 */
.results-container {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.results-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.total-badge {
  background-color: #dbeafe;
  color: #1e40af;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
}

.result-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-radius: 8px;
  font-size: 0.95rem;
}

.result-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.divider {
  color: #cbd5e1;
}

.message {
  color: #475569;
}

.success-item {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.success-item strong {
  color: #166534;
}

.error-item {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
}

.error-item strong {
  color: #991b1b;
}

.count-tag {
  background-color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #15803d;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
</style>