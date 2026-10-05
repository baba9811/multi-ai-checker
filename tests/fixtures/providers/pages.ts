import type { ProviderId } from '../../../src/domains/providers/model';

/** Deliberately synthetic DOM contracts, not recordings of real provider sessions. */
export function providerPage(provider: ProviderId) {
  const input =
    provider === 'chatgpt'
      ? '<textarea id="prompt-textarea"></textarea>'
      : provider === 'claude'
        ? '<div class="ProseMirror" contenteditable="true" role="textbox"></div>'
        : '<rich-textarea><div class="ql-editor" contenteditable="true" role="textbox"></div></rich-textarea>';
  const label = provider === 'chatgpt' ? 'Send prompt' : 'Send message';
  return `<!doctype html><html><head><meta charset="utf-8"><style>textarea,[contenteditable]{display:block;min-height:50px;width:400px;border:1px solid black}button{min-height:25px}article,model-response,user-query{display:block}</style></head><body><h1>LOCAL TEST FIXTURE — ${provider}</h1><main id="messages"></main>${input}<button id="send" data-testid="send-button" class="send-button" aria-label="${label}">Send</button><script>
const provider=${JSON.stringify(provider)}; window.fixtureSent=[]; window.fixtureMode='normal';
function user(text){ const wrap=document.createElement(provider==='gemini'?'user-query':'div'); const el=document.createElement('div'); if(provider==='chatgpt')el.dataset.messageAuthorRole='user'; if(provider==='claude')el.dataset.testid='user-message';if(provider==='gemini')el.className='query-text';el.textContent=text;wrap.append(el);document.getElementById('messages').append(wrap); }
function assistant(text,complete=true){const wrap=document.createElement(provider==='gemini'?'model-response':'article');wrap.dataset.isStreaming='false'; const el=document.createElement('div');if(provider==='chatgpt')el.dataset.messageAuthorRole='assistant';if(provider==='claude')el.className='font-claude-response';if(provider==='gemini')el.className='model-response-text';el.textContent=text;wrap.append(el);if(complete){const copy=document.createElement('button');copy.dataset.testid='copy-turn-action-button';copy.setAttribute('data-test-id','copy-button');copy.setAttribute('aria-label','Copy');copy.textContent='Copy';wrap.append(copy);}document.getElementById('messages').append(wrap);}
user('기존 질문');assistant('과거 답변 — 새 답변으로 수집하면 안 됨');
document.getElementById('send').onclick=()=>{const input=document.querySelector('textarea,[contenteditable]'); const text=input.value??input.innerText;window.fixtureSent.push(text);user(text);if(input instanceof HTMLTextAreaElement)input.value='';else input.textContent='';if(window.fixtureMode==='limit'){const alert=document.createElement('div');alert.setAttribute('role','alert');alert.textContent='Usage limit reached';document.body.append(alert);return;}const stop=document.createElement('button');stop.dataset.testid='stop-button';stop.setAttribute('aria-label','Stop response');stop.textContent='Stop';document.body.append(stop);setTimeout(()=>{stop.remove();assistant('새로운 '+provider+' 검증 답변',window.fixtureMode!=='no-completion');},150);};
</script></body></html>`;
}

/** Observed marker contract, not a capture of a real account or provider page. */
export function redesignedChatgptPage() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  [contenteditable] { min-height: 50px; border: 1px solid; } button { min-height: 25px; }
  [data-chatgpt-search-message-ids] { display: contents; }
  </style></head><body><main><section data-chatgpt-conversation-selection-target>
  <div data-turn-key="old-u"><div data-chatgpt-search-message-ids="old-u"><div class="bg-user-message">안녕</div></div></div>
  <div data-turn-key="old-a"><div data-chatgpt-search-message-ids="old-a"><div class="markdown">안녕하세요. 무엇을 도와드릴까요?</div></div><div class="turn-action-controls"><button aria-label="복사">복사</button></div></div>
  </section><form><div data-type="unified-composer"><div role="textbox" contenteditable="true"></div></div><button type="button" aria-label="보내기" id="send">전송</button></form></main>
  <script>window.fixtureSent=[]; const thread=document.querySelector('section'); const input=document.querySelector('[contenteditable]');
  document.getElementById('send').onclick=()=>{
    const text=input.innerText; window.fixtureSent.push(text); input.textContent='';
    // Simulate a virtualized thread unmounting the entire previous history.
    thread.replaceChildren();
    const user=document.createElement('div');user.dataset.turnKey='new-u';
    const unit=document.createElement('div');unit.dataset.chatgptSearchMessageIds='new-u';
    const bubble=document.createElement('div');bubble.className='bg-user-message';bubble.textContent=text;
    unit.append(bubble);user.append(unit);thread.append(user);
    const stop=document.createElement('button');stop.setAttribute('aria-label','응답 중지');stop.textContent='중지';document.body.append(stop);
    setTimeout(()=>{stop.remove();const answer=document.createElement('div');answer.dataset.turnKey='new-a';
      answer.innerHTML='<div data-chatgpt-search-message-ids="new-a"><div class="markdown">새로운 ChatGPT 답변</div></div><div class="turn-action-controls"><button aria-label="복사">복사</button></div>';thread.append(answer);
    },150);
  };</script></body></html>`;
}
