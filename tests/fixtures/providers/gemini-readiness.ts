import { rolldown } from 'rolldown';
import { providerPage } from './pages';

export function geminiReadinessPage(protection: boolean | undefined) {
  const bootstrap = {
    TSDtV: JSON.stringify({ flags: protection === undefined ? {} : { '45428920': protection } }),
    SNlM0e: 'SYNTHETIC_PRIVATE_MARKER',
  };
  return providerPage('gemini').replace(
    '</body>',
    `<input-container>
<button data-test-id="bard-mode-menu-button" aria-controls="fixture-mode-menu" aria-expanded="false"><span>Gemini</span><span>Automatic fixture</span></button></input-container>
<script>window.WIZ_global_data=${JSON.stringify(bootstrap)};</script><script>
const modeButton=document.querySelector('[data-test-id="bard-mode-menu-button"]');
modeButton.onclick=()=>{
 const menu=document.createElement('div');menu.id='fixture-mode-menu';menu.setAttribute('role','menu');
 const row=document.createElement('gem-menu-item');row.setAttribute('role','menuitem');row.setAttribute('data-mode-id','fixture-mode-key');row.setAttribute('aria-disabled','false');row.className='selected';
 row.innerHTML='<gem-menu-item-content><span class="label-container"><span class="label">Automatic fixture</span><span class="sublabel">Gemini fixture model</span></span></gem-menu-item-content>';
 const effort=document.createElement('gem-menu-item');effort.setAttribute('role','menuitem');effort.className='selected';effort.textContent='Low effort';menu.append(row,effort);
 document.body.append(menu);modeButton.setAttribute('aria-expanded','true');row.tabIndex=0;row.focus();
 menu.onkeydown=event=>{if(event.key==='Escape'){menu.remove();modeButton.setAttribute('aria-expanded','false');}};
};
window.fixtureNetworkCalls=0;window.fetch=async()=>{window.fixtureNetworkCalls++;throw Error('Readiness must not fetch');};
document.getElementById('messages').replaceChildren();
</script></body>`,
  );
}

// Invented runtime profile, not captured account or provider objects.
export function geminiClientReadinessPage(
  registered = false,
  idle: { nativeSse: boolean; enabled: boolean } | undefined = undefined,
) {
  return geminiReadinessPage(true)
    .replace(
      '<button data-test-id="bard-mode-menu-button"',
      '<bard-mode-switcher data-test-id="bard-mode-switcher"><gem-button data-test-id="bard-mode-menu-button"><button',
    )
    .replace(
      '</button></input-container>',
      '</button></gem-button></bard-mode-switcher></input-container>',
    )
    .replace(
      'const modeButton=document.querySelector(\'[data-test-id="bard-mode-menu-button"]\');',
      'const modeButton=document.querySelector(\'gem-button[data-test-id="bard-mode-menu-button"] button\');',
    )
    .replace(
      '</body>',
      `<script>
window.fixtureClientCalls=0;
const invoked=()=>{window.fixtureClientCalls++;throw Error('SYNTHETIC_PRIVATE_MARKER');};
const ns={};
for(const name of ['FVb','zw','wN','gM','UL','xKd','AKd','SU']) {
 ns[name]=function(){invoked();};
 for(const method of ['get','LAa','k2b','snapshot','h5a','JEa','register','sendRequest','ybb']) ns[name].prototype[method]=invoked;
}
for(const name of ['uC','KL','RHd']) ns[name]=Object.assign(Object.create(ns.zw.prototype),{RTc:'InjectionToken'});
for(const name of ['uC','KL','UL','xKd','AKd','RHd']) ns[name].Za={token:ns[name],kb:'root',Xa:invoked};
ns.wKd=invoked;
const api=Object.assign(Object.create(ns.gM.prototype),{Kd:true});
const protection=Object.assign(Object.create(ns.UL.prototype),{isEnabled:true});
const session=Object.assign(Object.create(ns.xKd.prototype),{wa:${idle?.nativeSse ?? true}});
const registry=Object.create(ns.AKd.prototype);
ns.CKd=class {};ns.cM=class {};ns.zKd=class {};
const selectedMode=Object.assign(Object.create(ns.cM.prototype),{ha:67});
const eligibility=Object.assign(Object.create(ns.CKd.prototype),{ha:true,oa:false,ka:selectedMode});
const headers=Object.assign(Object.create(ns.zKd.prototype),{wa:selectedMode});
Object.assign(api,{Aa:eligibility,Ua:selectedMode,Eb:headers});
${registered ? 'registry.ha={};' : ''}
const conversation=Object.assign(Object.create(ns.wN.prototype),{ha:api});
${
  idle
    ? `ns.JVd=class {isEnabled(){invoked();}rmf(){invoked();}HCc(){invoked();}Aa(){invoked();}oa(){invoked();}};
registry.ha=Object.assign(Object.create(ns.JVd.prototype),{Na:session,Oa:conversation,Va:eligibility,Ua:headers,ka:false,Za:${idle.enabled},kb:${idle.nativeSse}});
Object.defineProperty(registry.ha,'Wa',{get:invoked});`
    : ''
}
Object.assign(api,{Ja:protection,Ab:session,Fb:registry});
Object.defineProperty(api,'Ia',{get:invoked});
const values={uC:conversation,KL:api,UL:protection,xKd:session,AKd:registry,RHd:${idle?.nativeSse ?? true}};
const cache=new Map();
for(const [name,value] of Object.entries(values)) cache.set(ns[name],{value,Xa:ns[name].Za.Xa,Ig:undefined});
const injector=Object.assign(Object.create(ns.FVb.prototype),{oq:cache,scopes:new Set(['root']),parent:null,ig:false});
const host=document.querySelector('gem-button[data-test-id="bard-mode-menu-button"]');
const owner=host.closest('bard-mode-switcher');
Object.defineProperty(host,'__ngContext__',{value:7});
ns.SU.Ra={type:ns.SU,template:invoked};
const consumer=Object.assign(Object.create(ns.SU.prototype),{Oa:conversation});
${geminiOwnerGraph}
Object.defineProperty(window,'default_BardChatUi',{value:ns});
</script></body>`,
    );
}

const geminiOwnerGraph = `const component=[];Object.assign(component,{0:owner,1:{type:1,template:ns.SU.Ra.template,data:[]},2:0,8:consumer,19:10});
const eg=[];Object.assign(eg,{0:null,1:{type:2,data:[]},2:0,14:component,19:9});
const dg=[];Object.assign(dg,{0:null,1:{type:2,data:[]},2:0,14:eg,19:8});
const view=[];Object.assign(view,{0:null,1:{type:2,data:[]},2:0,9:injector,14:dg,19:7});
const agNode={index:30,DB:view[1]};dg[1].data[30]=agNode;view[5]=agNode;
const dgNode={index:29,DB:dg[1]};eg[1].data[29]=dgNode;dg[5]=dgNode;
const egNode={index:83,DB:eg[1]};component[1].data[83]=egNode;
const origin=[];Object.assign(origin,{1:true,3:component,5:egNode});component[83]=origin;eg[16]=origin;
eg[5]={index:28,insertion:true};
const hostNode={index:28,type:2,value:'gem-button'};view[1].data[28]=hostNode;
const child=[];Object.assign(child,{0:host,1:{},2:0,3:view,5:hostNode,14:view,19:11});
const anchor=document.createComment('');host.after(anchor);
view[28]=[child,true,0,view,null,hostNode,null,anchor,null,null];
ns.zPb=new Map([[7,view]]);
`;

// SDK-only support restriction; ordinary readiness and client-preparation pages stay unchanged.
export function geminiSdkTrialReadinessPage() {
  return geminiReadinessPage(true)
    .replace(
      '<button data-test-id="bard-mode-menu-button"',
      '<chat-app-side-nav-menu-button><new-model-picker-glow class="header-model-picker-glow"><div class="glow-content"><bard-mode-switcher data-test-id="bard-mode-switcher"><gem-button data-test-id="bard-mode-menu-button"><button',
    )
    .replace(
      '</button></input-container>',
      '</button></gem-button></bard-mode-switcher></div></new-model-picker-glow></chat-app-side-nav-menu-button></input-container>',
    )
    .replace(
      'const modeButton=document.querySelector(\'[data-test-id="bard-mode-menu-button"]\');',
      'const modeButton=document.querySelector(\'gem-button[data-test-id="bard-mode-menu-button"] button\');',
    )
    .replaceAll('fixture-mode-key', 'synthetic-ui-mode');
}

// Test seam: retain the final source-shaped graph while a separate provisional DOM owner is visible.
export function geminiColdHeaderFixture() {
  const glow = document.querySelector<HTMLElement>(
    'new-model-picker-glow.header-model-picker-glow',
  )!;
  const owner = glow.querySelector<HTMLElement>('bard-mode-switcher')!;
  const finalButton = owner.querySelector<HTMLButtonElement>('button')!;
  const provisional = owner.cloneNode(true) as HTMLElement;
  const provisionalButton = provisional.querySelector<HTMLButtonElement>('button')!;
  const provisionalHost = provisional.querySelector<HTMLElement>('gem-button')!;
  provisionalButton.removeAttribute('aria-controls');
  const state = {
    provisionalClicks: 0,
    finalClicks: 0,
    restored: false,
    started: false,
    starts: 0,
    provisionalAtStart: false,
  };
  provisionalButton.onclick = () => {
    state.provisionalClicks++;
  };
  const open = finalButton.onclick!;
  finalButton.onclick = function (event) {
    state.finalClicks++;
    return open.call(this, event);
  };
  glow.replaceWith(provisional);
  const query = provisionalHost.querySelectorAll;
  // Arm at the actual compact-control resolver, never during test setup or allocation.
  Object.defineProperty(provisionalHost, 'querySelectorAll', {
    value: function (this: HTMLElement, selector: string) {
      const result = query.call(this, selector);
      if (selector === 'button' && !state.started) {
        state.started = true;
        state.starts++;
        state.provisionalAtStart =
          provisional.isConnected &&
          provisional.parentElement?.matches('chat-app-side-nav-menu-button') === true &&
          document.querySelector('bard-mode-switcher') === provisional &&
          !glow.isConnected;
        setTimeout(() => {
          provisional.replaceWith(glow);
          state.restored = true;
        }, 240);
      }
      return result;
    },
  });
  Object.assign(window, { fixtureColdHeader: { state } });
}

// Bundle the actual imported fixture dependencies into the receiving page; no production bundle is replaced.
export async function geminiNativeTrialSource() {
  const bundle = await rolldown({
    input: 'tests/fixtures/providers/gemini-sdk-fixed-text-trial.ts',
  });
  let source: string;
  try {
    const generated = await bundle.generate({ format: 'iife', name: 'GeminiTrialFixture' });
    if (generated.output.length !== 1 || generated.output[0]!.type !== 'chunk')
      throw new Error('Unexpected fixture bundle');
    source = generated.output[0]!.code;
  } finally {
    await bundle.close();
  }
  return source;
}

export async function geminiNativeTrialPage(
  codec: 'json' | 'protobuf' = 'json',
  polyfills?: { snapshot: 'native' | 'polyfill'; send: 'native' | 'polyfill'; active?: boolean },
) {
  const source = await geminiNativeTrialSource();
  const page = geminiSdkTrialReadinessPage();
  return page.replace(
    '</body>',
    () => `<script>${source.replaceAll('</script', '<\\/script')}</script><script>
const f=GeminiTrialFixture.geminiSdkFixedTextTrialFixture(${JSON.stringify(codec)},{document,window,location});
window.fixtureNative=f;
${polyfills ? `const p=f.native.asyncContext(${JSON.stringify(polyfills)});Object.defineProperty(window,'AsyncContext',{value:p.context,writable:true,configurable:true});window.fixtureContext=p;` : ''}
</script></body>`,
  );
}

/** Self-contained test seam: install in the same world as the receiving inspector. */
export function installGeminiHeaderObservationFixture(delay = 0, visible = false) {
  const state = { hidden: !visible, reads: 0, clicks: 0, privateReads: 0, started: false };
  (window as any).fixtureHeader = state;
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => (state.hidden ? 'hidden' : 'visible'),
  });
  Object.defineProperty(window, 'WIZ_global_data', {
    configurable: true,
    get: () => {
      state.privateReads++;
      throw Error('Forbidden private access');
    },
  });
  (window as any).fixtureNetworkCalls = 0;
  window.fetch = async () => {
    (window as any).fixtureNetworkCalls++;
    throw Error('Observation must not fetch');
  };
  const headerGlow = document.querySelector<HTMLElement>('new-model-picker-glow')!;
  const headerOwner = headerGlow.querySelector<HTMLElement>('bard-mode-switcher')!;
  const delayedOwner = headerOwner.cloneNode(true) as HTMLElement;
  const originalHost = headerOwner.querySelector<HTMLElement>('gem-button')!;
  const delayedHost = delayedOwner.querySelector<HTMLElement>('gem-button')!;
  for (const host of [originalHost, delayedHost]) {
    const query = host.querySelectorAll.bind(host);
    host.querySelectorAll = function (selector: string) {
      if (selector === 'button') {
        state.reads++;
        if (!state.started) {
          state.started = true;
          if (delay > 0) setTimeout(() => delayedOwner.replaceWith(headerGlow), delay);
        }
      }
      return query(selector);
    } as typeof host.querySelectorAll;
    host.addEventListener('click', () => state.clicks++);
  }
  if (delay > 0) headerGlow.replaceWith(delayedOwner);
}

/** Synthetic MAIN-world browser seam; installed tests install the same function in ISOLATED. */
export function geminiHeaderObservationPage(delay = 0) {
  return geminiSdkTrialReadinessPage().replace(
    '</body>',
    `<script>(${installGeminiHeaderObservationFixture.toString()})(${JSON.stringify(delay)});</script></body>`,
  );
}
