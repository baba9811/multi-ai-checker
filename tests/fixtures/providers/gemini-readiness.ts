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
export function geminiClientReadinessPage(registered = false) {
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
for(const name of ['FVb','ww','lN','HL','pL','RHd','DL','sV']) {
 ns[name]=function(){invoked();};
 for(const method of ['get','LAa','k2b','snapshot','h5a','JEa','register','sendRequest','Oub']) ns[name].prototype[method]=invoked;
}
for(const name of ['sC','IL','IHd']) ns[name]=Object.assign(Object.create(ns.ww.prototype),{RTc:'InjectionToken'});
for(const name of ['sC','IL','pL','RHd','DL','IHd']) ns[name].Za={token:ns[name],kb:'root',Xa:invoked};
ns.QHd=invoked;
const api=Object.assign(Object.create(ns.HL.prototype),{Nd:true,Aa:true});
const protection=Object.assign(Object.create(ns.pL.prototype),{isEnabled:true});
const session=Object.assign(Object.create(ns.RHd.prototype),{oa:true});
const registry=Object.create(ns.DL.prototype);
${registered ? 'registry.ha={};' : ''}
const conversation=Object.assign(Object.create(ns.lN.prototype),{ha:api});
Object.assign(api,{Ja:protection,wb:session,Fb:registry});
Object.defineProperty(api,'Ia',{get:invoked});
const values={sC:conversation,IL:api,pL:protection,RHd:session,DL:registry,IHd:true};
const cache=new Map();
for(const [name,value] of Object.entries(values)) cache.set(ns[name],{value,Xa:ns[name].Za.Xa,Ig:undefined});
const injector=Object.assign(Object.create(ns.FVb.prototype),{oq:cache,scopes:new Set(['root']),parent:null,ig:false});
const host=document.querySelector('gem-button[data-test-id="bard-mode-menu-button"]');
const owner=host.closest('bard-mode-switcher');
Object.defineProperty(host,'__ngContext__',{value:7});
ns.sV.Ra={type:ns.sV,template:invoked};
const consumer=Object.assign(Object.create(ns.sV.prototype),{Oa:conversation});
const component=[];Object.assign(component,{0:owner,1:{type:1,template:ns.sV.Ra.template,data:[]},2:0,8:consumer,19:10});
const eg=[];Object.assign(eg,{0:null,1:{type:2,data:[]},2:0,14:component,19:9});
const dg=[];Object.assign(dg,{0:null,1:{type:2,data:[]},2:0,14:eg,19:8});
const view=[];Object.assign(view,{0:null,1:{type:2,data:[]},2:0,9:injector,14:dg,19:7});
const agNode={index:30,iB:view[1]};dg[1].data[30]=agNode;view[5]=agNode;
const dgNode={index:29,iB:dg[1]};eg[1].data[29]=dgNode;dg[5]=dgNode;
const egNode={index:81,iB:eg[1]};component[1].data[81]=egNode;
const origin=[];Object.assign(origin,{1:true,3:component,5:egNode});component[81]=origin;eg[16]=origin;
eg[5]={index:28,insertion:true};
const hostNode={index:28,type:2,value:'gem-button'};view[1].data[28]=hostNode;
const child=[];Object.assign(child,{0:host,1:{},2:0,3:view,5:hostNode,14:view,19:11});
const anchor=document.createComment('');host.after(anchor);
view[28]=[child,true,0,view,null,hostNode,null,anchor,null,null];
ns.DOb=new Map([[7,view]]);
Object.defineProperty(window,'default_BardChatUi',{value:ns});
</script></body>`,
    );
}
