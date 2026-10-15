import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Platform } from '../../application/ports';
import {
  GEMINI_FIXED_TEXT_TRIAL_PROMPT,
  GEMINI_NATIVE_CONFIGURATION_DIAGNOSTICS,
  type GeminiNativeConfigurationDiagnostic,
  GeminiFixedTextTrialRecord,
  GeminiFixedTextTrialResult,
  type GeminiFixedTextTrialReason,
} from '../../application/gemini-fixed-text-trial';

const uncertainty = '요청의 완료 여부는 확인하지 못했으며 자동으로 다시 보내지 않습니다.';
const explanations = {
  ...(Object.fromEntries(
    GEMINI_NATIVE_CONFIGURATION_DIAGNOSTICS.map((reason, index) => [
      reason,
      `응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N15-${index + 1}.`,
    ]),
  ) as Record<GeminiNativeConfigurationDiagnostic, string>),
  page: '새 Gemini 시험 페이지를 확인하지 못했습니다. 로그인·로딩 상태를 확인하세요.',
  model: '현재 선택된 모델을 확인하지 못했습니다.',
  'model-trigger': '모델 선택 버튼을 확인하지 못했습니다.',
  'model-trigger-compact-control': '모델 선택 버튼을 확인하지 못했습니다. 확인 코드 T1.',
  'model-trigger-final-control': '모델 선택 버튼을 확인하지 못했습니다. 확인 코드 T2.',
  'model-trigger-header-context': '모델 선택 버튼을 확인하지 못했습니다. 확인 코드 T3.',
  'model-trigger-header-deadline': '모델 선택 버튼을 확인하지 못했습니다. 확인 코드 T4.',
  'model-trigger-header-association': '모델 선택 버튼을 확인하지 못했습니다. 확인 코드 T5.',
  'model-menu': '모델 메뉴 상태를 확인하지 못했습니다.',
  'model-menu-open-trigger': '모델 메뉴 상태를 확인하지 못했습니다. 확인 코드 M1.',
  'model-menu-open-menu': '모델 메뉴 상태를 확인하지 못했습니다. 확인 코드 M2.',
  'model-menu-owner-missing': '모델 메뉴 상태를 확인하지 못했습니다. 확인 코드 M3.',
  'model-menu-owner-changed': '모델 메뉴 상태를 확인하지 못했습니다. 확인 코드 M4.',
  'model-menu-trigger-detached': '모델 메뉴 상태를 확인하지 못했습니다. 확인 코드 M9.',
  'model-menu-popover-ambiguous': '모델 메뉴 상태를 확인하지 못했습니다. 확인 코드 M5.',
  'model-menu-menu-ambiguous': '모델 메뉴 상태를 확인하지 못했습니다. 확인 코드 M6.',
  'model-menu-controls-invalid': '모델 메뉴 상태를 확인하지 못했습니다. 확인 코드 M7.',
  'model-menu-owner-duplicate': '모델 메뉴 상태를 확인하지 못했습니다. 확인 코드 M8.',
  'model-cleanup': '모델 메뉴 정리를 확인하지 못했습니다. Gemini 탭을 확인하세요.',
  'model-bindings': '모델 연결 정보를 확인하지 못했습니다.',
  'model-catalog': '모델 목록을 확인하지 못했습니다.',
  'model-selection': '모델 선택 정보를 확인하지 못했습니다.',
  'model-selection-id': '선택된 모델을 구분하지 못했습니다.',
  'model-selection-ui': '화면의 모델 선택과 연결 정보를 확인하지 못했습니다.',
  'model-selection-catalog': '선택된 모델의 목록 정보를 확인하지 못했습니다.',
  'model-settings': '모델 설정을 확인하지 못했습니다.',
  client: '현재 Gemini 웹 연결을 확인하지 못했습니다.',
  'client-initial': '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20.',
  'client-initial-page': '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-1.',
  'client-initial-owner': '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-2.',
  'client-initial-owner-context': '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-3.',
  'client-initial-owner-view': '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-4.',
  'client-initial-owner-view-registry':
    '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-5.',
  'client-initial-owner-view-missing':
    '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-6.',
  'client-initial-owner-view-shape': '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-7.',
  'client-initial-owner-view-id': '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-8.',
  'client-initial-owner-view-metadata':
    '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-9.',
  'client-initial-owner-view-flags': '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-10.',
  'client-initial-owner-slot': '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-11.',
  'client-initial-owner-declaration-1':
    '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-12.',
  'client-initial-owner-declaration-2':
    '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-13.',
  'client-initial-owner-declaration-3':
    '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-14.',
  'client-initial-owner-declaration-3-node':
    '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-15.',
  'client-initial-owner-declaration-3-template':
    '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-16.',
  'client-initial-owner-declaration-3-binding':
    '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-17.',
  'client-initial-owner-component': '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-18.',
  'client-initial-runtime-shape': '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-19.',
  'client-initial-service-identity': '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-20.',
  'client-initial-protection': '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-21.',
  'client-initial-transport-session':
    '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-22.',
  'client-initial-transport-api': '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-23.',
  'client-initial-transport-route': '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-24.',
  'client-initial-transport-sse': '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-25.',
  'client-initial-transport-rpc': '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-26.',
  'client-initial-prewarm': '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-27.',
  'client-initial-hook': '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-28.',
  'client-initial-transport-webchannel':
    '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P20-29.',
  'client-protection': '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P21.',
  'client-current': '현재 Gemini 웹 연결을 확인하지 못했습니다. 확인 코드 P22.',
  packet: '시험 요청을 확인하지 못했습니다.',
  capture: '시험에 필요한 연결 상태를 확인하지 못했습니다.',
  'capture-setup': '시험 준비 상태를 확인하지 못했습니다.',
  'capture-readiness': '시험 페이지의 준비 상태를 확인하지 못했습니다.',
  'capture-editor': '시험 입력 상태를 확인하지 못했습니다.',
  'capture-bindings': '시험 연결 정보를 확인하지 못했습니다.',
  'capture-actions': '시험 처리 상태를 확인하지 못했습니다.',
  'capture-request-id': '시험 요청의 연결을 확인하지 못했습니다.',
  'capture-observation': '대화 상태의 연결을 확인하지 못했습니다.',
  'capture-completion': '대화 상태를 계속 확인하지 못했습니다.',
  'capture-store': '시험 대화의 연결을 확인하지 못했습니다.',
  'capture-current': '시험 페이지의 연결 상태를 확인하지 못했습니다.',
  'capture-state': '대화 상태를 확인하지 못했습니다.',
  'capture-action': '대화 처리 상태를 확인하지 못했습니다.',
  dispatch: '응답 요청의 전송 상태를 확인하지 못했습니다.',
  'dispatch-native-n01': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N01.',
  'dispatch-native-n02': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N02.',
  'dispatch-native-n03': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N03.',
  'dispatch-native-n04': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N04.',
  'dispatch-native-n05': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N05.',
  'dispatch-native-n06': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N06.',
  'dispatch-native-n07': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N07.',
  'dispatch-native-n08': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N08.',
  'dispatch-native-n09': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N09.',
  'dispatch-native-n10': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N10.',
  'dispatch-native-n11': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N11.',
  'dispatch-native-n12': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N12.',
  'dispatch-native-n13': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N13.',
  'dispatch-native-n14': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N14.',
  'dispatch-native-n15': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N15.',
  'dispatch-native-n16': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N16.',
  'dispatch-native-n17': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N17.',
  'dispatch-native-n18': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N18.',
  'dispatch-native-n19': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N19.',
  'dispatch-native-n20': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N20.',
  'dispatch-native-n21': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N21.',
  'dispatch-native-n22': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N22.',
  'dispatch-native-n23': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N23.',
  'dispatch-native-n24': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N24.',
  'dispatch-native-n25': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N25.',
  'dispatch-native-n26': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N26.',
  'dispatch-native-n27': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N27.',

  'dispatch-runtime-shape': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 P1.',
  'dispatch-route': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 P2.',
  'dispatch-protection': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 P3.',
  'dispatch-source-profile': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 P4.',
  'dispatch-descriptor': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 P5.',
  'dispatch-binding': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 P6.',
  'dispatch-handoff': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 P7.',
  'dispatch-retry': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 P8.',
  'dispatch-stream': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 P9.',
  'dispatch-backend': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 P10.',
  'dispatch-closed': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 P11.',
  'dispatch-spent': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 P12.',
  'dispatch-interrupted': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 P13.',
  'dispatch-source-stream': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 P14.',
  'dispatch-source-async': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 P15.',
  'dispatch-source-factory': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 P16.',
  'dispatch-source-handler': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 P17.',
  'dispatch-observation': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 P18.',
  'dispatch-source-notify': '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 P19.',
  response: 'Gemini 응답 완료를 확인하지 못했습니다.',
  'response-request': '응답의 요청 연결을 확인하지 못했습니다.',
  'response-turn': '응답 내용을 확인하지 못했습니다.',
  'response-shape': '응답 형식을 확인하지 못했습니다.',
  'response-envelope': '응답 전달 형식을 확인하지 못했습니다.',
  'response-envelope-record': '응답 전달 정보를 확인하지 못했습니다.',
  'response-envelope-kind': '응답 유형을 확인하지 못했습니다.',
  'response-envelope-keys': '응답 구성 정보를 확인하지 못했습니다.',
  'response-envelope-meta-1': '응답 전달 상태를 확인하지 못했습니다. 확인 코드 E1.',
  'response-envelope-meta-2': '응답 전달 상태를 확인하지 못했습니다. 확인 코드 E2.',
  'response-envelope-meta-3': '응답 전달 상태를 확인하지 못했습니다. 확인 코드 E3.',
  'response-envelope-meta-4': '응답 전달 상태를 확인하지 못했습니다. 확인 코드 E4.',
  'response-envelope-meta-5': '응답 전달 상태를 확인하지 못했습니다. 확인 코드 E5.',
  'response-envelope-meta-6': '응답 전달 상태를 확인하지 못했습니다. 확인 코드 E6.',
  'response-envelope-meta-7': '응답 전달 상태를 확인하지 못했습니다. 확인 코드 E7.',
  'response-record': '응답 정보의 형식을 확인하지 못했습니다.',
  'response-identity': '응답 연결 정보를 확인하지 못했습니다.',
  'response-metadata': '응답의 부가 정보를 확인하지 못했습니다.',
  'response-lists': '응답의 추가 항목을 확인하지 못했습니다.',
  'response-flags': '응답 상태를 확인하지 못했습니다.',
  'response-flag-1': '응답 상태를 확인하지 못했습니다. 확인 코드 G1.',
  'response-flag-2': '응답 상태를 확인하지 못했습니다. 확인 코드 G2.',
  'response-flag-3': '응답 상태를 확인하지 못했습니다. 확인 코드 G3.',
  'response-flag-4': '응답 상태를 확인하지 못했습니다. 확인 코드 G4.',
  'response-flag-5': '응답 상태를 확인하지 못했습니다. 확인 코드 G5.',
  'response-flag-6': '응답 상태를 확인하지 못했습니다. 확인 코드 G6.',
  'response-flag-7': '응답 상태를 확인하지 못했습니다. 확인 코드 G7.',
  'response-flag-8': '응답 상태를 확인하지 못했습니다. 확인 코드 G8.',
  'response-extra': '응답의 추가 정보를 확인하지 못했습니다.',
  'response-raw-fields': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 R1.',
  'response-raw-field-1': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W1.',
  'response-raw-field-3': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W3.',
  'response-raw-field-4': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W4.',
  'response-raw-field-14': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W14.',
  'response-raw-field-17': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W17.',
  'response-raw-field-18': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W18.',
  'response-raw-field-19': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W19.',
  'response-raw-field-22': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W22.',
  'response-raw-field-29': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W29.',
  'response-raw-field-31': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W31.',
  'response-raw-field-38': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W38.',
  'response-raw-field-39': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W39.',
  'response-raw-field-42': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W42.',
  'response-raw-field-44': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W44.',
  'response-raw-field-45': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W45.',
  'response-raw-field-51': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W51.',
  'response-raw-field-54': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W54.',
  'response-raw-field-6': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W6.',
  'response-raw-field-7': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W7.',
  'response-raw-field-8': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W8.',
  'response-raw-field-10': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W10.',
  'response-raw-field-25': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W25.',
  'response-raw-field-30': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W30.',
  'response-raw-field-33': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W33.',
  'response-raw-field-35': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W35.',
  'response-raw-field-36': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W36.',
  'response-raw-field-41': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W41.',
  'response-raw-field-47': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W47.',
  'response-raw-field-49': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W49.',
  'response-raw-field-53': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W53.',
  'response-raw-field-57': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 W57.',
  'response-raw-continuation': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 R2.',
  'response-raw-disconnect': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 R3.',
  'response-raw-title': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 R4.',
  'response-raw-routing': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 R5.',
  'response-raw-attribution': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 R6.',
  'response-raw-history': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 R7.',
  'response-raw-quota': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 R8.',
  'response-raw-heartbeat': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 R9.',
  'response-raw-string': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 R10.',
  'response-raw-enum': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 R11.',
  'response-raw-client': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 R12.',
  'response-raw-supplement': '응답의 추가 정보를 확인하지 못했습니다. 확인 코드 R13.',
  'response-candidate-lists': '답변의 추가 내용을 확인하지 못했습니다.',
  'response-candidate-extra': '답변의 추가 정보를 확인하지 못했습니다.',
  'response-final-metadata': '최종 응답 정보를 확인하지 못했습니다.',
  'response-answer': '시험 답변을 확인하지 못했습니다.',
  'response-content': '응답의 내용 구성을 확인하지 못했습니다.',
  'response-selected': '선택된 응답을 확인하지 못했습니다.',
  'response-action': '응답 처리 상태를 확인하지 못했습니다.',
  'response-stream': '응답 종료를 확인하지 못했습니다.',
  'response-error': 'Gemini 요청 처리를 완료하지 못했습니다.',
  'response-event': '지원하지 않는 응답 흐름으로 시험을 중단했습니다.',
  'response-event-1': '지원하지 않는 응답 흐름으로 시험을 중단했습니다. 확인 코드 H1.',
  'response-event-2': '지원하지 않는 응답 흐름으로 시험을 중단했습니다. 확인 코드 H2.',
  'response-event-3': '지원하지 않는 응답 흐름으로 시험을 중단했습니다. 확인 코드 H3.',
  'response-disconnect-1': '응답 종료 정보를 확인하지 못했습니다. 확인 코드 D1.',
  'response-disconnect-2': '응답 종료 정보를 확인하지 못했습니다. 확인 코드 D2.',
  'response-disconnect-3': '응답 종료 정보를 확인하지 못했습니다. 확인 코드 D3.',
  'response-disconnect-4': '응답 종료 정보를 확인하지 못했습니다. 확인 코드 D4.',
  'response-disconnect-5': '응답 종료 정보를 확인하지 못했습니다. 확인 코드 D5.',
  'response-disconnect-6': '응답 종료 정보를 확인하지 못했습니다. 확인 코드 D6.',
  'response-completion': '완료된 시험 답변을 확인하지 못했습니다.',
  history: '저장된 응답을 확인하지 못했습니다.',
  cleanup: '시험 페이지 정리를 확인하지 못했습니다. Gemini 탭을 확인하세요.',
  interrupted: 'Gemini 응답 시험이 중단됐습니다.',
} satisfies Record<GeminiFixedTextTrialReason, string>;

export function GeminiSdkTrial({
  platform,
  disabled,
  onWorking,
}: {
  platform: Platform;
  disabled: boolean;
  onWorking: (value: boolean) => void;
}) {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [record, setRecord] = useState<GeminiFixedTextTrialRecord>();
  const [result, setResult] = useState<GeminiFixedTextTrialResult>();
  const [error, setError] = useState('');
  const [stopped, setStopped] = useState(false);
  const controller = useRef<AbortController | undefined>(undefined);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    let active = true;
    setReady(false);
    void platform
      .readGeminiSdkTrial?.()
      .then((value) => {
        if (!active) return;
        const previous = value && GeminiFixedTextTrialRecord.parse(value);
        setRecord(previous?.status === 'pending' ? { ...previous, status: 'uncertain' } : previous);
        setReady(true);
      })
      .catch(() => {
        if (active)
          setError(
            '이전 시험 상태를 읽지 못했습니다. 완료 여부를 확인할 수 없어 새 시험을 시작하지 않습니다.',
          );
      });
    return () => {
      active = false;
      mounted.current = false;
      if (controller.current) {
        controller.current.abort();
        onWorking(false);
      }
    };
  }, [platform]);
  async function start() {
    if (!ready || disabled || controller.current || !platform.startGeminiSdkTrial) return;
    const current = new AbortController();
    controller.current = current;
    setBusy(true);
    setStopped(false);
    setError('');
    setResult(undefined);
    setRecord(undefined);
    onWorking(true);
    try {
      const value = await platform.startGeminiSdkTrial(current.signal);
      if (mounted.current && controller.current === current && !current.signal.aborted)
        setResult(GeminiFixedTextTrialResult.parse(value));
    } catch (failure) {
      if (mounted.current && controller.current === current) {
        if (current.signal.aborted) setStopped(true);
        else {
          const cause =
            failure instanceof Error
              ? Object.getOwnPropertyDescriptor(failure, 'cause')?.value
              : undefined;
          const explanation =
            typeof cause === 'string' && Object.hasOwn(explanations, cause)
              ? explanations[cause as GeminiFixedTextTrialReason]
              : 'Gemini 응답 시험을 완료하지 못했습니다.';
          setError(`${explanation} ${uncertainty}`);
        }
      }
    } finally {
      if (controller.current === current) {
        controller.current = undefined;
        if (mounted.current) {
          setBusy(false);
          onWorking(false);
        }
      }
    }
  }
  function stop() {
    if (!controller.current || controller.current.signal.aborted) return;
    controller.current.abort();
    setStopped(true);
  }
  const previous = !!record || !!result || stopped || !!error;
  return (
    <details className="connection-detail">
      <summary>
        Gemini 응답 시험 <ChevronDown size={13} />
      </summary>
      <p className="hint">
        새 Gemini 시험 탭 1개를 백그라운드에서 열고, 기존 웹 로그인과 현재 모델로 요청 1회를
        보냅니다. 기존 대화와 파일은 보내지 않습니다.
      </p>
      <p className="hint">
        보낼 문장: <code>{GEMINI_FIXED_TEXT_TRIAL_PROMPT}</code>
      </p>
      <button
        className="secondary"
        disabled={!ready || disabled || busy}
        onClick={() => void start()}
      >
        {previous ? '새 Gemini 응답 시험 시작' : 'Gemini 응답 시험 시작'}
      </button>
      {busy && (
        <button className="text-button" disabled={stopped} onClick={stop}>
          시험 중지
        </button>
      )}
      {busy && !stopped && (
        <p className="hint" role="status">
          Gemini 응답과 저장 기록을 확인하고 있습니다.
        </p>
      )}
      {result && (
        <div className="gemini-trial-result" role="status">
          <p>응답 확인 완료</p>
          <p>모델: {result.model}</p>
          <p>
            <code>{result.answer}</code>
          </p>
        </div>
      )}
      {record?.status === 'done' && (
        <p className="hint">지난 시험은 완료됐습니다. 현재 연결 상태는 새 시험으로 확인하세요.</p>
      )}
      {record?.status === 'uncertain' && (
        <p className="hint" role="status">
          지난 요청의 완료 여부를 확인하지 못했습니다. 자동으로 다시 보내지 않습니다. Gemini에서
          먼저 확인하세요.
        </p>
      )}
      {stopped && (
        <p className="hint" role="status">
          Gemini 응답 시험을 중지했습니다. {uncertainty}
        </p>
      )}
      {error && (
        <p className="error" role="status">
          {error}
        </p>
      )}
    </details>
  );
}
