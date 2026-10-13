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
