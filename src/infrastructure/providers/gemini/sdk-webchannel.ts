import type { GEMINI_NATIVE_DISPATCH_REASONS } from '../../../application/gemini-fixed-text-trial';
import {
  assertGeminiTrialPacket,
  captureGeminiNativeWireContent,
  readGeminiNativeOutboundDiagnostic,
  assertGeminiNativeConfiguration,
  createGeminiNativeReceipt,
  readGeminiNativeSendKind,
  type ApprovedGeminiTrial,
  type GeminiNativeFrameReceipt,
  type GeminiNativeIdentity,
  type GeminiTrialCompletion,
  assertGeminiNativeLifecycleProfile,
} from './fixed-text-contract';

// Literal reviewed public-source fingerprints. They are data, never evaluated.
const profile = {
  dtConnect:
    'function(a,b,c,d){this.ha.debug("connect()");kt(0);this.Yc=a;this.ob=b||{};c&&d!==void 0&&(this.ob.OSID=c,this.ob.OAID=d);this.Eb=this.xd;this.ha.debug("connectChannel_()");a=qlb(this,null,this.Yc);this.ha.debug("GetForwardChannelUri: "+a);this.ub=a;tlb(this)}',
  dtDisconnect:
    'function(){this.ha.debug("disconnect()");Alb(this);if(this.fU==3){var a=this.Gb++,b=this.ub.clone();_.Fg(b,"SID",this.Sa);_.Fg(b,"RID",a);_.Fg(b,"TYPE","terminate");Blb(this,b);a=new lt(this,this.ha,this.Sa,a);a.mb=2;a.Sa=_.Jg(b.clone());b=!1;if(_.fa.navigator&&_.fa.navigator.sendBeacon)try{b=_.fa.navigator.sendBeacon(a.Sa.toString(),"")}catch(c){}!b&&_.fa.Image&&((new Image).src=a.Sa,b=!0);b||(a.ha=Vkb(a.Aa,null),a.ha.send(a.Sa));a.Wa=Date.now();Ukb(a)}Clb(this)}',
  eventHandler: 'function(a){_.Eb.call(this);this.Ha=a;this.wa={}}',
  listen:
    'function(a,b,c,d){Array.isArray(b)||(b&&(Xta[0]=b.toString()),b=Xta);for(let e=0;e<b.length;e++){let f=_.me(a,b[e],c||this.handleEvent,d||!1,this.Ha||this);if(!f)break;this.wa[f.key]=f}return this}',
  removeAll:
    'function(){_.Kb(this.wa,function(a,b){this.wa.hasOwnProperty(b)&&_.oe(a)},this);this.wa={}}',
  qVd: 'class{constructor(){this.Na=_.x(_.eKd);this.Sa=_.x(_.gKd);this.Va=_.x(_.dK);this.Oa=_.x(_.TC);this.Ia=_.x(_.yx);this.Ca=_.x(_.Lz);this.Ha=_.x(_.EA);this.Jc=_.x(_.HA);this.nb=_.x(_.PF);this.Za=this.Ca.Ea(_.jM);this.Wa=this.Ca.Ea(_.bKd);var a;this.kb=(a=_.x(_.XJd,{optional:!0}))!=null?a:!1;this.ob=this.Ca.Ea(_.aKd);this.ka=!1;this.ub=_.Z(this.Oa.Ti,{initialValue:!1});this.JWb=_.Z(this.nb.pG().pipe(_.v(b=>b.map(c=>c.id))),{initialValue:[]});_.x(_.hKd).register(this)}isEnabled(){return!this.kb&&\nthis.Za}Da(){return this.ka||!!this.ha&&_.JJd(this.ha.connection)}mb(){var a=this.ha;if(a&&_.JJd(a.connection))return _.n(a.tec,60)||void 0}Eb(a,b,c,d,e){if(this.isEnabled()){var f=e!=null?e:()=>this.Oa.sAc();a=a.map(g=>typeof g==="object"&&g!==null&&"event"in g&&"observable"in g&&_.pw(g.observable)?g:{event:"CANCELLED_INVALIDATION",observable:g});_.Jt(...a.map(({event:g,observable:k})=>k.pipe(_.uw(),_.yw(1),_.v(()=>g)))).pipe(_.Kt(()=>this.ka||this.ha!==void 0),_.du(g=>{this.reset(g)}),_.zw(()=>\n_.Et(()=>f()).pipe(_.Vt(1),_.Ot(()=>_.It))),_.uA(b)).subscribe(g=>{d&&!d()||this.Aa(g,c())})}}Ab(){this.ha!==void 0&&JOk(this)}thc(a){var b=this.ha;b!=null&&_.JJd(b.connection)&&(b.connection.thc(a),JOk(this))}aDc(){var a=this.Ja;this.Ja=void 0;return a}wnf(){this.wa=void 0;var a=this.ha;if(a){IOk(this);a.XCd.unsubscribe();this.ha=void 0;this.ka=!1;if(_.JJd(a.connection))return{connection:a.connection,tec:a.tec,wi:a.wi,UM:a.UM};let b=a.connection.hasError;a.connection.disconnect();_.AAd(this.Jc,b?\n"CHANNEL_ERROR":"CHANNEL_CLOSED",a.wi)}}oa(a){var b=this.ha;a==="CHANNEL_ERROR"?b&&(this.wa={conversationId:b.conversationId,wi:b.wi}):this.wa=void 0;b&&(IOk(this),b.XCd.unsubscribe(),_.JJd(b.connection)&&a!=="CHANNEL_ERROR"&&a!=="CHANNEL_CLOSED"?_.iM(b.connection):b.connection.disconnect(),this.ha=void 0,_.AAd(this.Jc,a!=null?a:"CANCELLED_INVALIDATION",b.wi));this.ka=!1}reset(a="CANCELLED_INVALIDATION"){this.oa(a)}Aa(a,b){if(this.isEnabled()){var c=_.ui(a,50);if(!(this.Wa&&(_.WM(c)||c===58)||this.ub()||\nthis.JWb().length>0&&b&&!this.JWb().includes(b)||this.ka)){var d,e;c=(e=(d=_.XL(a))==null?void 0:d.ig())!=null?e:"";if(!this.wa||this.wa.conversationId!==c||this.wa.wi!==b)if(!this.ha||!_.JJd(this.ha.connection)||this.ha.conversationId!==c||this.ha.wi!==b){this.oa();this.ka=!0;this.Ja=d=this.Va.now();_.AAd(this.Jc,"CREATED",b);try{let g=_.fKd(this.Sa,{wi:b,isTemporaryChat:_.oi(a,46),clientTurnId:_.n(a,60),requestSource:_.DA(this.Ha)});var f=_.dKd(this.Na,this.Ia,{zS:g});f.connect();_.LJd(f,a,_.DA(this.Ha),\nb!=null?b:"",_.n(a,60));JOk(this);let k=f.Sa.pipe(_.Vt(1),_.uA(this.Ia)).subscribe(r=>{this.oa(r!==void 0?"CHANNEL_ERROR":"CHANNEL_CLOSED")});this.ha={connection:f,wi:b,conversationId:c,tec:a,XCd:k,UM:d}}catch(g){let k;(k=f)==null||k.disconnect();IOk(this);this.ha=void 0;this.ka=!1}finally{this.ka=!1}}}}}}',
  m: 'function(a,b,c,d){var e=a.fl,f=e[_.La]|0;b=Qoa(e,f,b,c,d);if(b==null)return b;f=e[_.La]|0;if(!_.Ra(a,f)){let g=_.Mg(b);g!==b&&(_.ub(a)&&(e=a.fl,f=e[_.La]|0),b=g,f=_.yb(e,f,c,b,d),_.Ng(e,f))}return b}',
  Qh: 'function(a,b,c,d){a=a.fl;return Qoa(a,a[_.La]|0,b,c,d)||b[_.Xd]||(b[_.Xd]=_.iba(b))}',
  Mg: 'function(a){var b=a.fl,c=b[_.La]|0;return _.Ra(a,c)?_.Rba(a,b,c)?_.Qba(a,b,!0):new a.constructor(_.tb(b,c,!1)):a}',
  Bf: 'function(a){var b=a.fl,c=b[_.La]|0;return _.Ra(a,c)?a:_.Rba(a,b,c)?_.Qba(a,b):new a.constructor(_.tb(b,c,!0))}',
  Hh: 'function(a,b,c,d,e){d=Qpa(d);_.Wh(a,c,d,e);d&&!_.Ra(d)&&_.Ng(a.fl);return a}',
  ub: 'function(a){if(a.Fb!==_.Kaa)return!1;var b=a.fl;b=_.tb(b,b[_.La]|0);_.Ma(b,2048);a.fl=b;_.Laa(a,!1);a.Xbc=void 0;return!0}',
  Ra: 'function(a,b){return b===void 0?a.Fb!==_.Kaa&&!!(2&(a.fl[_.La]|0)):!!(2&b)&&a.Fb!==_.Kaa}',
  jJd: 'function(a,b){return _.Ki(a,1,b)}',
  $Cb: 'function(a){return Object.assign({},{locale:"ko",requestSource:a.requestSource},a.modeId!==void 0?{modeId:a.modeId}:{},a.turnId!==void 0?{turnId:a.turnId}:{})}',
  oJd: 'function(a,b){return _.Hh(a,_.LAd,1,b)}',
  pJd: 'function(a,b){return _.Ki(a,2,b)}',
  PLd: 'function(a,b){var c=!!b.request.ZKa,d,e,f;b=_.Fyd(b,a.requestSource,a.Gc,a.kb,(f=(d=a.uv())==null?void 0:d.id)!=null?f:void 0,!c&&a.Hga(),!c&&a.Wa.Ga(),a.Ac.isSupported(),a.lja&&_.nL(a.Va)?(e=a.Gb)==null?void 0:e.Ja.value:void 0);if(a.lja&&_.nL(a.Va)&&(a=_.ved())){a:switch(a.kind){case 0:c=new BL;a=_.Oi(c,2,QFd,a.toolId);a=_.Bf(a);break a;case 1:c=new BL;a=_.Oi(c,3,QFd,a.toolId);a=_.Bf(a);break a;case 2:a=new BL;a=_.Gi(a,5,QFd,!0);a=_.Bf(a);break a;default:throw Error("sk`"+String(a.kind));\n}if(c=a){var g;(a=(g=_.m(b,BL,109))==null?void 0:_.m(g,Ywd,4))?(g=_.Mg(c),g=_.Hh(g,Ywd,4,a)):g=c;_.Hh(b,BL,109,g)}}return b}',
  LJd: 'function(a,b,c,d,e){var f,g,k=((f=_.XL(b))==null?void 0:f.ig())||((g=_.m(b,_.yL,72))==null?void 0:g.ig())||"";e&&(a.Aa=_.Th(_.MI(_.NI(new _.CI,e),k)));d=_.$Cb({requestSource:c,modeId:d,turnId:e});c=(new _.LAd).setLocale(d.locale);c=_.Pi(c,1,d.requestSource);d.modeId!==void 0&&_.Ni(c,2,d.modeId);d.turnId!==void 0&&_.Ni(c,4,d.turnId);d=new _.nJd;e=new SId;b=_.Hh(e,_.zL,1,b);b=_.Pi(b,4,1);b=_.Bf(b);b=_.Hh(d,SId,5,b);c=_.oJd(_.pJd(new _.qJd,0),c);b=_.ei(c,8,_.rJd,b);b=_.Bf(b);c=new _.tJd;b=_.ei(c,\n1,_.eM,b);b=_.Bf(b);if(a.ha)a.connection.send(b);else{let r,u;(u=(r=a.connection).bfc)==null||u.call(r,b);a.oa.push(b)}}',
  hKd: 'class{register(a){this.ha=a}get(){return this.ha}}',
  eKd: 'class{constructor(){this.Ca=_.x(_.Lz);this.ha=_.x(_.$Jd);this.oa=_.x(_.XJd);this.ka=_.x(_.cA)}get wa(){return this.Ca.Ea(cKd)}}',
  re: '(a,b)=>{Tga||Uga();eca||(Tga(),eca=!0);bca.add(a,b)}',
  dt: 'function(a){this.Qf=0;this.oa=[];this.ha=new Akb;this.Vc=this.kf=this.ub=this.Yc=this.ka=this.Lf=this.mb=this.ob=this.Ga=this.Oc=this.Na=null;this.Ih=this.Gb=0;this.Lg=Fkb("failFast",!1,a);this.Eb=this.Va=this.Ja=this.Da=this.wa=null;this.xd=!0;this.kc=this.xf=this.Ha=-1;this.Pc=this.Wa=this.Za=0;this.zg=Fkb("baseRetryDelayMs",5E3,a);this.Fh=Fkb("retryDelaySeedMs",1E4,a);this.wh=Fkb("forwardChannelMaxRetries",2,a);this.Cf=Fkb("forwardChannelRequestTimeoutMs",2E4,a);this.lPb=a&&a.AEa||void 0;this.Wi=\na&&a.P2g||void 0;this.Uf=a&&a.org||!1;this.Ub=void 0;this.Ab=a&&a.Z2a||!1;this.Sa="";this.Aa=new Gkb(a&&a.QYg);this.Wd=Math.min(a&&a.w2g||1E3,1E3);this.Zf=new Ekb;this.Ac=a&&a.Nab||!1;this.Zb=a&&a.q_g||!1;this.Ac&&this.Zb&&(this.ha.warning("Ignore encodeInitMessageHeaders because fastHandshake is set."),this.Zb=!1);this.Ph=a&&a.WXg||!1;a&&a.NHd&&this.ha.NHd();a&&a.ebb&&(this.xd=!1);this.Fd=!this.Ac&&this.xd&&a&&a.fHd||!1;this.Sd=void 0;a&&a.r3d&&a.r3d>0&&(this.Sd=a.r3d);this.Kd=void 0;this.Fb=0;this.Yb=\n!1;this.Ae=this.kb=null}',
  hmb: 'function(a){this.ha=a}',
  bmb: 'function(a,b){_.Yb.call(this);this.ha=new nt(b);this.wa=a;this.Xm=null;this.ka=b&&b.cVf||null;a=b&&b.aVf||null;b&&b.GYg&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"});this.ha.Na=a;a=b&&b.zS||null;b&&b.bBa&&(a?a["X-WebChannel-Content-Type"]=b.bBa:a={"X-WebChannel-Content-Type":b.bBa});b&&b.JCd&&(a?a["X-WebChannel-Client-Profile"]=b.JCd:a={"X-WebChannel-Client-Profile":b.JCd});this.ha.Oc=a;(a=b&&b.Kcb)&&!_.ja(a)&&(this.ha.Ga=a);this.Da=b&&b.Z2a||!1;this.Aa=b&&b.y1a||\n!1;(b=b&&b.Lcb)&&!_.ja(b)&&(this.ha.mb=b,a=this.ka,a!==null&&b in a&&_.Uta(this.ka,b));this.oa=new Llb(this)}',
  Klb: 'function(a,b){return new Jlb(a,b)}',
  FDb: 'function(a,b,c={},d=!1){var e=Object.assign({},_.BDb()),f=_.Nr([]);f&&(e.Authorization=f);(f=_.Wu())&&(e["X-Goog-AuthUser"]=f);e["X-Goog-Api-Key"]=b;(b=_.jf(_.pd("PI9WOb"),""))&&(e["X-Server-Token"]=b);if(d=EDb(a,d))e["X-Origin"]=window.location.origin;return _.Klb(a,Object.assign({},{Lcb:"gsessionid",Z2a:!0,y1a:!0,fHd:!0},d?{}:{Kcb:"$httpHeaders"},c,{zS:Object.assign({},e,c.zS||{})}))}',
  st: 'class{constructor(a){a&&(this.ha=a)}lift(a){var b=new _.st;b.source=this;b.operator=a;return b}subscribe(a,b,c){a=a&&a instanceof snb||a&&_.pt(a.next)&&_.pt(a.error)&&_.pt(a.complete)&&Plb(a)?a:new _.Tmb(a,b,c);b=this.operator;c=this.source;a.add(b?b.call(a,c):c?this.ha(a):this.Da(a));return a}Da(a){try{return this.ha(a)}catch(b){a.error(b)}}forEach(a,b){b=Tlb(b);return new b((c,d)=>{var e=this.subscribe(f=>{try{a(f)}catch(g){d(g),e==null||e.unsubscribe()}},d,c)})}ha(a){var b;return(b=this.source)==\nnull?void 0:b.subscribe(a)}[Zlb](){return this}pipe(...a){return a.length?_.Slb(a)(this):this}VDa(){var a=Tlb(a);return new a((b,c)=>{var d;this.subscribe(e=>d=e,e=>c(e),()=>b(d))})}}',
  Yt: 'class extends _.st{constructor(){super();this.observers=[];this.hasError=this.Ys=this.closed=!1;this.oa=null}lift(a){var b=new vnb(this,this);b.operator=a;return b}ka(){if(this.closed)throw new unb;}next(a){this.ka();if(!this.Ys){let b=this.observers.slice();for(let c of b)c.next(a)}}error(a){this.ka();if(!this.Ys){this.hasError=this.Ys=!0;this.oa=a;let b=this.observers;for(;b.length;)b.shift().error(a)}}complete(){this.ka();if(!this.Ys){this.Ys=!0;let a=this.observers;for(;a.length;)a.shift().complete()}}unsubscribe(){this.Ys=\nthis.closed=!0;this.observers=null}get Ja(){var a;return((a=this.observers)==null?void 0:a.length)>0}Da(a){this.ka();return super.Da(a)}ha(a){this.ka();this.Aa(a);return this.Ga(a)}Ga(a){var b=this.Ys,c=this.observers;return this.hasError||b?_.qt.ha:(c.push(a),new _.qt(()=>Olb(this.observers,a)))}Aa(a){var b=this.oa,c=this.Ys;this.hasError?a.error(b):c&&a.complete()}}',
  gu: 'class extends _.Yt{constructor(a){super();this.Pm=a}get value(){return this.getValue()}ha(a){var b=super.ha(a);!b.closed&&a.next(this.Pm);return b}getValue(){var a=this.oa,b=this.Pm;if(this.hasError)throw a;this.ka();return b}next(a){super.next(this.Pm=a)}}',
  $Ed: 'class{constructor(a,b,c,d,e={}){this.endpoint=a;this.apiKey=b;this.FCa=c;this.NTa=d;this.Qj=new _.ak;this.connectedObs=this.uC=new _.gu(!1);this.s1=this.Ki=new _.Yt;this.uq=iud(this.endpoint,this.apiKey,e);this.s0a()}connect(){this.uC.value||this.uq.open()}disconnect(){this.uq.close()}send(a){this.uC.value?this.uq.send(this.FCa(a)):this.Ki.next({eventType:"channel_error",error:new _.ZJ(2,"Channel is not connected. Cannot send message")})}s0a(){this.uq&&(this.Qj.listen(this.uq,"Sd",this.cWa.bind(this)),\nthis.Qj.listen(this.uq,"Td",this.Xya.bind(this)),this.Qj.listen(this.uq,"Vd",this.b$.bind(this)),this.Qj.listen(this.uq,"Ud",this.aza.bind(this)))}cWa(){this.uC.next(!0);this.Ki.next({eventType:"channel_open"})}Xya(){this.Qj.removeAll();this.Ki.next({eventType:"channel_close"});this.Ki.complete();this.uC.next(!1);this.uC.complete()}b$(a){if(a.data&&Array.isArray(a.data)&&a.data.length!==0)if(a.ha==="status"){let b=_.DDb(a.data);b.hKa||this.Ki.next({eventType:"channel_error",error:new _.ZJ(1,`{status: ${b.statusCode}, message: ${b.statusMessage}}`),\nerrorDetail:JSON.stringify(a.data,void 0,2)})}else a=this.NTa(a.data[0]),this.Ki.next({eventType:"channel_message",message:a});else this.Ki.next({eventType:"channel_error",error:new _.ZJ(2,"Channel message received with empty data")})}aza(a){switch(a.status){case 1:this.Ki.next({eventType:"channel_error",error:new _.ZJ(4,"Network error")});break;case 2:this.Ki.next({eventType:"channel_error",error:new _.ZJ(3,"Server error")});break;default:this.Ki.next({eventType:"channel_error",error:new _.ZJ(2,\n"Unknown error")})}}}',
  aFd: 'class extends lHd{constructor(a,b,c,d={}){super(a,b,e=>e.serialize(),e=>_.Th(_.Lo(c,(0,_.be)(e))),Object.assign({},{bBa:"application/json+protobuf"},d))}}',
  bFd: 'class extends lHd{constructor(a,b,c,d,e={}){super(a,b,f=>_.Tg(c(f)),f=>{f=typeof f==="string"?_.Ck(f):f;return d(f)},Object.assign({},{bBa:"application/x-protobuf"},e))}}',
  YJd: 'function(a,b,c="v1/llmBidiStreamProxy",d){return new mHd(`${a.ka}/${c}`,a.ha,b,...(d!==void 0?[d]:[]))}',
  IHd: 'class{constructor(a,b){this.connection=a;this.hasError=this.wD=this.ha=!1;this.wa=0;this.Ja=!1;this.oa=[];this.t$=!1;this.Va=this.tB=new _.Yt;this.Sa=this.ka=new _.Yt;this.Na=this.Da=new _.Yt;this.Ga=(b?this.connection.s1.pipe(_.uA(b)):this.connection.s1).subscribe(c=>{switch(c.eventType){case "channel_message":c=c.message;switch(_.Yh(c,_.hM)){case 2:c=_.ci(c,_.HJd,2,_.hM);var d,e,f;if(c=(d=_.ci(c,_.BJd,7,_.gM))==null?void 0:(e=_.ci(d,_.AJd,1,_.CJd))==null?void 0:(f=_.zJd(e))==null?void 0:_.m(f,\n_.HF,4)){d=c;e=_.DL(d);if(e==null?0:_.n(e,2)){var g;f=e.ig()||((g=this.Aa)==null?void 0:g.ig())||"";this.Aa=g=_.Th(_.NI(_.MI(new _.CI,f),_.n(e,2)));f&&!e.ig()&&(d=_.Mg(d),g=_.Hh(d,_.CI,2,g),d=_.Bf(g))}else this.Aa&&(g=(e==null?void 0:e.ig())||this.Aa.ig(),e=_.n(this.Aa,2),this.Aa=g=_.Th(_.NI(_.MI(new _.CI,g),e)),d=_.Mg(d),g=_.Hh(d,_.CI,2,g),d=_.Bf(g));this.tB.next(d)}break;case 4:KJd(this);this.ka.next(void 0);this.ka.complete();this.tB.complete();this.Ga.unsubscribe();this.connection.disconnect();\nbreak;case 5:KJd(this),this.ka.next(void 0),this.ka.complete(),this.tB.complete()}break;case "channel_error":KJd(this,!0);this.ka.next(c.error);this.tB.Ja&&this.tB.error(c.error);break;case "channel_close":KJd(this);this.ka.next(void 0);this.tB.complete();this.Da.complete();this.Ga.unsubscribe();break;case "channel_open":for(this.ha=!0;this.ha&&this.oa.length>0;)g=this.oa.shift(),this.connection.send(g);this.Da.next()}})}connect(){this.connection.connect()}disconnect(){KJd(this);this.Ga.unsubscribe();\nthis.tB.complete();this.Da.complete();this.ka.complete();this.connection.disconnect()}thc(a){this.wa++;this.Ja=!0;a=_.Th(_.jJd(new _.dM,this.wa).Ni(a));a=_.Th((new _.tJd).Bg(a));if(this.ha)this.connection.send(a);else{let b,c;(c=(b=this.connection).bfc)==null||c.call(b,a);this.oa.push(a)}}}',
  dKd: 'function(a,b,c){if(a.oa){let d=vtd(`${a.ha.ka}/v1/conversations:processSession`),e=_.Nr([]);c=c==null?void 0:c.zS;a=new VJd(d,{CWb:e?e:void 0,apiKey:a.ha.ha,BWb:a.ka.Qy(),zS:c});return new OJd(a,b)}if(a.wa)return a=ZJd(a.ha,d=>uJd(d),d=>_.Th(IJd(d)),c),new OJd(a,b);a=_.YJd(a.ha,_.xzd,"v1/processSession",c);return new OJd(a,b)}',
  Zxb: 'Zxb(a){if(!Vzd(a.request))throw Error("zk");var b=_.PLd(this,a);a.request.ZKa||this.Wa.Ga.set(!1);var c=a.request,d=c.clientTurnId,e,f=(e=c.conversationId)!=null?e:"";e=c.YL;var g=c.hf===41&&(!e||e.deviceId===_.yAd(this.mb));yId(this.ka,d,this.Aa);return new _.st(k=>\n{var r={CAc:void 0,BAc:void 0,AAc:void 0},u={fAd:void 0,afe:new Set};HAd(this.zl);var w=new OLd(this.mb,f,g);NLd(w);var B=!1,C=JKd(this.Wd,b,a,{next:G=>{if(!B){if(w.enabled&&!w.ka&&!w.ha){var N=_.wtd(G)?G.request.conversationId:G.responseType==="ROUTING"||G.responseType==="TURN_COMPLETED"||G.responseType==="CONTINUATION_UPDATE"?G.conversationId:void 0;N&&(w.ha=N,NLd(w))}k.next(G)}},error:G=>{B||(B=!0,this.ka.handleError(G instanceof Error?G:Error(String(G)),d),w.onComplete(),k.error(G))},complete:()=>\n{B||(B=!0,LId(this.ka,d),w.onComplete(),k.complete())}},(G,N,T,aa)=>{if(this.Aa)a:{var da=this.Eb.get();if((da==null?0:da.isEnabled())&&N.aib!=="RECONNECT_TO_EXISTING_TURN"){let Lc=da.wnf();if(Lc){var ta=!N.ZKa&&_.JJd(Lc.connection);if(ta){{let Hc=Rwd(Lc.tec),bd=Rwd(G);if(_.gk(Hc,bd))var ya=[];else{ya=[];xL(_.XL(Hc),_.XL(bd))||ya.push("IDENTIFIERS");xL(_.m(Hc,_.yL,72),_.m(bd,_.yL,72))||ya.push("CONTINUATION_IDENTIFIERS");_.ui(Hc,19)!==_.ui(bd,19)&&ya.push("REQUESTED_BARD_MODE");_.n(Hc,39)!==_.n(bd,\n39)&&ya.push("REQUESTED_MODE_ID");_.ui(Hc,80)===_.ui(bd,80)&&_.ui(Hc,76)===_.ui(bd,76)&&_.n(Hc,65)===_.n(bd,65)&&_.n(Hc,74)===_.n(bd,74)||ya.push("REQUESTED_MODE_CATEGORY");_.ui(Hc,81)!==_.ui(bd,81)&&ya.push("REQUESTED_THINKING_LEVEL");_.ui(Hc,50)!==_.ui(bd,50)&&ya.push("USER_SELECTED_FEATURE_MODE");_.oi(Hc,92)!==_.oi(bd,92)&&ya.push("SMART_MODEL_SELECTION");_.oi(Hc,97)!==_.oi(bd,97)&&ya.push("MANUAL_PICKER_OVERRIDE");_.oi(Hc,66)!==_.oi(bd,66)&&ya.push("SKIP_THINKING");xL(_.m(Hc,_.wxd,42),_.m(bd,\n_.wxd,42))||ya.push("MEMORY_OPTIONS");Hc.JIa()!==bd.JIa()&&ya.push("PERSONAL_CONTEXT_DISABLED");_.oi(Hc,46)!==_.oi(bd,46)&&ya.push("TEMPORARY_CHAT");var Da=_.vL(Hc),Wa=_.vL(bd),eb,nb;((eb=Da==null?void 0:_.XEd(Da))!=null?eb:!1)!==((nb=Wa==null?void 0:_.XEd(Wa))!=null?nb:!1)&&ya.push("VOICE_ENTRY");var Bb,Ib;((Bb=Da==null?void 0:_.oi(Da,7))!=null?Bb:!1)!==((Ib=Wa==null?void 0:_.oi(Wa,7))!=null?Ib:!1)&&ya.push("ZERO_STATE_PROMPT");xL(_.m(Hc,_.Sv,34),_.m(bd,_.Sv,34))||ya.push("SYSTEM_QUERY");var jc,\nXb;Swd((jc=Da==null?void 0:_.di(Da,_.ZK,4))!=null?jc:[],(Xb=Wa==null?void 0:_.di(Wa,_.ZK,4))!=null?Xb:[])||ya.push("FILE_ATTACHMENTS");xL(Da==null?void 0:_.m(Da,_.tL,10),Wa==null?void 0:_.m(Wa,_.tL,10))||ya.push("ATTACHED_CONTEXT");(Da==null?void 0:_.ui(Da,11))!==(Wa==null?void 0:_.ui(Wa,11))&&ya.push("CONTEXTUAL_ACTION");Swd(_.di(Hc,_.az,10),_.di(bd,_.az,10))||ya.push("TOOL_MENTIONS");Twd(_.vi(Hc,82),_.vi(bd,82))||ya.push("SELECTED_SKILL_IDS");Twd(_.vi(Hc,96),_.vi(bd,96))||ya.push("SELECTED_FIRST_PARTY_SKILL_IDS");\nTwd(_.vi(Hc,107),_.vi(bd,107))||ya.push("SELECTED_PLUGIN_IDS");_.n(Hc,70)!==_.n(bd,70)&&ya.push("SKILL_ID");_.oi(Hc,99)!==_.oi(bd,99)&&ya.push("CHROME_SKILLS_ENABLED");_.oi(Hc,12)===_.oi(bd,12)&&_.oi(Hc,54)===_.oi(bd,54)||ya.push("DISABLE_TOOLS_OR_QUIZ");Swd(_.di(Hc,_.PG,9),_.di(bd,_.PG,9))||ya.push("REQUEST_SCOPED_CONSENTS");xL(_.m(Hc,Ytd,55),_.m(bd,Ytd,55))&&xL(_.m(Hc,dud,56),_.m(bd,dud,56))||ya.push("INPUT_COMPANION");_.n(Hc,20)===_.n(bd,20)&&_.oi(Hc,37)===_.oi(bd,37)&&xL(_.m(Hc,_.hK,25),_.m(bd,\n_.hK,25))&&Twd(_.vi(Hc,40),_.vi(bd,40))&&xL(_.m(Hc,fud,41),_.m(bd,fud,41))||ya.push("BOT_CONFIG_OR_METADATA");_.n(Hc,105)!==_.n(bd,105)&&ya.push("PROJECT_ID");var Jc;Da=(Jc=_.m(Hc,_.EI,62))==null?void 0:Jc.clone();var Zc;Jc=(Zc=_.m(bd,_.EI,62))==null?void 0:Zc.clone();var ud,Gd;((ud=Da==null?void 0:_.qi(Da,9))!=null?ud:0)!==((Gd=Jc==null?void 0:_.qi(Jc,9))!=null?Gd:0)&&ya.push("CAPTURED_REGIONS");Da!=null&&_.Wh(Da,9);Jc!=null&&_.Wh(Jc,9);!Da&&!Jc||xL(Da!=null?Da:new _.EI,Jc!=null?Jc:new _.EI)||ya.push("GEMINI_IN_CHROME_METADATA");\nxL(_.m(Hc,_.eA,16),_.m(bd,_.eA,16))||ya.push("DEVICE_CONTEXT");xL(_.m(Hc,nyd,23),_.m(bd,nyd,23))||ya.push("REQUEST_LOGGING_METADATA");xL(_.m(Hc,rud,43),_.m(bd,rud,43))&&xL(_.m(Hc,Jud,71),_.m(bd,Jud,71))||ya.push("IMMERSIVE_OR_ARTIFACTS_CONTEXT");xL(_.m(Hc,Yud,63),_.m(bd,Yud,63))||ya.push("GOAL_INPUT");xL(_.m(Hc,_.S0c,102),_.m(bd,_.S0c,102))||ya.push("HIGHLIGHT_TO_ASK_CONTEXT");xL(_.m(Hc,Cyd,90),_.m(bd,Cyd,90))||ya.push("REMY_METADATA");xL(_.m(Hc,Ayd,98),_.m(bd,Ayd,98))||ya.push("DEEP_RESEARCH_METADATA");\nxL(_.m(Hc,Pxd,86),_.m(bd,Pxd,86))||ya.push("AGENTIC_SIGNIN_METADATA");xL(_.m(Hc,OFd,58),_.m(bd,OFd,58))||ya.push("COMPUTER_USE_METADATA");xL(_.m(Hc,eyd,87),_.m(bd,eyd,87))||ya.push("REMOTE_DEVICE_TARGET");Hc.oea()===bd.oea()&&xL(_.m(Hc,_.iLb,94),_.m(bd,_.iLb,94))&&_.n(Hc,103)===_.n(bd,103)&&_.n(Hc,108)===_.n(bd,108)&&xL(_.m(Hc,axd,57),_.m(bd,axd,57))||ya.push("PROMPT_SOURCE_OR_ID");xL(_.m(Hc,zxd,85),_.m(bd,zxd,85))||ya.push("FOLLOW_UP_METADATA");_.ui(Hc,73)===_.ui(bd,73)&&xL(_.m(Hc,_.b2c,64),_.m(bd,\n_.b2c,64))&&_.ui(Hc,100)===_.ui(bd,100)&&_.qi(Hc,104)===_.qi(bd,104)||ya.push("REGENERATE");xL(_.m(Hc,$xd,18),_.m(bd,$xd,18))||ya.push("TURN_INDEX");xL(_.m(Hc,_.lG,2),_.m(bd,_.lG,2))&&xL(_.m(Hc,_.RI,7),_.m(bd,_.RI,7))&&_.ui(Hc,69)===_.ui(bd,69)||ya.push("THEME_OR_LOCALE");Twd(_.Gk(Hc,31),_.Gk(bd,31))||ya.push("CLIENT_CAPABILITIES");ya.length===0&&ya.push("OTHER")}}}else ya=["CONNECTION_UNUSABLE"];if(ta&&ya.length===0){_.AAd(this.Jc,"CONSUMED",Lc.wi);zAd(this.Jc,this.Na.now()-Lc.UM,Lc.wi,!0);da.aDc();\nG=VLd(this,Lc.connection,G,N,T,r,u,aa);break a}_.iM(Lc.connection);_.AAd(this.Jc,"MISMATCH",Lc.wi);for(let Hc of ya)ta=this.Jc,ta.Kd.increment(Hc,Lc.wi||"undefined",ta.requestSource);zAd(this.Jc,this.Na.now()-Lc.UM,Lc.wi,!1);da.aDc()}else da=da.aDc(),da!==void 0&&zAd(this.Jc,this.Na.now()-da,N.wi,!1)}G=ULd(this,G,N,T,r,u,aa)}else G=SLd(this,G,N,T,r,u,aa);return G});return()=>{w.onComplete();C();IAd(this.zl)}})}',
} as const;

// These are live method/getter pins, independent of constructor source text.
const methods = {
  kM: { get: 'get(){return this.ha}', register: 'register(a){this.ha=a}' },
  CUd: {
    isEnabled: 'isEnabled(){return!this.kb&&\nthis.Za}',
    aDc: 'aDc(){var a=this.Ja;this.Ja=void 0;return a}',
    wnf: 'wnf(){this.wa=void 0;var a=this.ha;if(a){IOk(this);a.XCd.unsubscribe();this.ha=void 0;this.ka=!1;if(_.JJd(a.connection))return{connection:a.connection,tec:a.tec,wi:a.wi,UM:a.UM};let b=a.connection.hasError;a.connection.disconnect();_.AAd(this.Jc,b?\n"CHANNEL_ERROR":"CHANNEL_CLOSED",a.wi)}}',
  },
  ot: {
    unsubscribe:
      'unsubscribe(){if(!this.closed){this.closed=!0;let c=this.oa;if(Array.isArray(c))for(var a of c)a.remove(this);else c==null||c.remove(this);a=this.Na;if(_.pt(a))try{a()}catch(e){var b=e instanceof qnb?e.errors:[e]}let d=this.wa;if(d){this.wa=null;for(let e of d)try{_.pt(e)?e():e.unsubscribe()}catch(f){let g;b=(g=b)!=null?g:[];f instanceof qnb?b=[...b,...f.errors]:b.push(f)}}if(b)throw new qnb(b);}}',
    add: 'add(a){if(a&&a!==this)if(this.closed)_.pt(a)?a():\na.unsubscribe();else{if(a instanceof _.qt){if(a.closed||a.Ha(this))return;a.Ga(this)}let b;(this.wa=(b=this.wa)!=null?b:[]).push(a)}}',
    Ha: 'Ha(a){var b=this.oa;return b===a||Array.isArray(b)&&b.includes(a)}',
    Ga: 'Ga(a){var b=this.oa;this.oa=Array.isArray(b)?(b.push(a),b):b?[b,a]:a}',
    Ja: 'Ja(a){var b=this.oa;b===a?this.oa=null:Array.isArray(b)&&Olb(b,a)}',
    remove: 'remove(a){var b=this.wa;b&&Olb(b,a);a instanceof _.qt&&a.Ja(this)}',
  },
  onb: {
    next: 'next(a){this.Ys||this.Nj(a)}',
    error: 'error(a){this.Ys||(this.Ys=!0,this.M6a(a))}',
    complete: 'complete(){this.Ys||(this.Ys=!0,this.ha())}',
    unsubscribe: 'unsubscribe(){this.closed||(this.Ys=!0,super.unsubscribe())}',
    Nj: 'Nj(a){this.destination.next(a)}',
    M6a: 'M6a(a){this.destination.error(a);this.unsubscribe()}',
    ha: 'ha(){this.destination.complete();this.unsubscribe()}',
  },
  qt: {
    subscribe:
      'subscribe(a,b,c){a=a&&a instanceof snb||a&&_.pt(a.next)&&_.pt(a.error)&&_.pt(a.complete)&&Plb(a)?a:new _.Tmb(a,b,c);b=this.operator;c=this.source;a.add(b?b.call(a,c):c?this.ha(a):this.Da(a));return a}',
    pipe: 'pipe(...a){return a.length?_.Slb(a)(this):this}',
    Da: 'Da(a){try{return this.ha(a)}catch(b){a.error(b)}}',
    ha: 'ha(a){var b;return(b=this.source)==\nnull?void 0:b.subscribe(a)}',
  },
  Rt: {
    ka: 'ka(){if(this.closed)throw new unb;}',
    Da: 'Da(a){this.ka();return super.Da(a)}',
    ha: 'ha(a){this.ka();this.Aa(a);return this.Ga(a)}',
    Ga: 'Ga(a){var b=this.Ys,c=this.observers;return this.hasError||b?_.qt.ha:(c.push(a),new _.qt(()=>Olb(this.observers,a)))}',
    Aa: 'Aa(a){var b=this.oa,c=this.Ys;this.hasError?a.error(b):c&&a.complete()}',
    next: 'next(a){this.ka();if(!this.Ys){let b=this.observers.slice();for(let c of b)c.next(a)}}',
    error:
      'error(a){this.ka();if(!this.Ys){this.hasError=this.Ys=!0;this.oa=a;let b=this.observers;for(;b.length;)b.shift().error(a)}}',
    complete:
      'complete(){this.ka();if(!this.Ys){this.Ys=!0;let a=this.observers;for(;a.length;)a.shift().complete()}}',
  },
  $t: {
    getValue: 'getValue(){var a=this.oa,b=this.Pm;if(this.hasError)throw a;this.ka();return b}',
    ha: 'ha(a){var b=super.ha(a);!b.closed&&a.next(this.Pm);return b}',
    next: 'next(a){super.next(this.Pm=a)}',
  },
  IHd: {
    connect: 'connect(){this.connection.connect()}',
    disconnect:
      'disconnect(){KJd(this);this.Ga.unsubscribe();\nthis.tB.complete();this.Da.complete();this.ka.complete();this.connection.disconnect()}',
  },
  connection: {
    connect: 'connect(){this.uC.value||this.uq.open()}',
    disconnect: 'disconnect(){this.uq.close()}',
    s0a: 's0a(){this.uq&&(this.Qj.listen(this.uq,"Sd",this.cWa.bind(this)),\nthis.Qj.listen(this.uq,"Td",this.Xya.bind(this)),this.Qj.listen(this.uq,"Vd",this.b$.bind(this)),this.Qj.listen(this.uq,"Ud",this.aza.bind(this)))}',
    Xya: 'Xya(){this.Qj.removeAll();this.Ki.next({eventType:"channel_close"});this.Ki.complete();this.uC.next(!1);this.uC.complete()}',
  },
} as const;

const construction = {
  Uba: 'function(a,b,c,d,e){this.listener=a;this.proxy=null;this.src=b;this.type=c;this.capture=!!d;this.handler=e;this.key=++Tba;this.removed=this.r8a=!1}',
  ke: 'function(a){return!(!a||!a[_.Aga])}',
  Ed: 'function(a){var b=typeof a;return b=="object"&&a!=null||b=="function"}',
  Hga: 'function(a){if(typeof a==="function")return a;a[Oga]||(a[Oga]=function(b){return a.handleEvent(b)});return a[Oga]}',

  Eb: 'function(){this.n5=this.n5;this.b_a=this.b_a}',
  Rb: 'function(a){this.src=a;this.listeners={};this.ha=0}',
  Yb: 'function(){_.Eb.call(this);this.Mpa=new _.Rb(this);this.Dff=this;this.R0c=null}',
  Hb: 'function(a,b){this.type=a instanceof _.Gb?String(a):a;this.currentTarget=this.target=b;this.defaultPrevented=this.ka=!1}',
  pt: 'function(a){return typeof a==="function"}',
  Slb: 'function(a){return a.length===0?_.rt:a.length===1?a[0]:function(b){return a.reduce((c,d)=>d(c),b)}}',
  uA: 'function(a){a||(a=_.x(_.yx));var b=new _.st(c=>{if(a.dg)c.next();else return a.Wc(c.next.bind(c))});return c=>c.pipe(_.bu(b))}',
  me: 'function(a,b,c,d,e){if(d&&d.once)return _.le(a,b,c,d,e);if(Array.isArray(b)){for(let f=0;f<b.length;f++)_.me(a,b[f],c,d,e);return null}c=_.Hga(c);return _.ke(a)?a.listen(b,c,_.Ed(d)?!!d.capture:!!d,e):Iga(a,b,c,!1,d,e)}',
  Kb: 'function(a,b,c){for(let d in a)b.call(c,a[d],d,a)}',
  oe: 'function(a){if(typeof a==="number"||!a||a.removed)return!1;var b=a.src;if(_.ke(b))return b.m4(a);var c=a.type,d=a.proxy;b.removeEventListener?b.removeEventListener(c,d,a.capture):b.detachEvent?b.detachEvent(Lga(c),d):b.addListener&&b.removeListener&&b.removeListener(d);Gga--;(c=_.Jga(b))?(Dga(c,a),c.ha==0&&(c.src=null,b[Ega]=null)):Bga(a);return!0}',
} as const;

const eventMethods = {
  listen: 'function(a,b,c,d){return this.Mpa.add(String(a),b,!1,c,d)}',
  m4: 'function(a){return Dga(this.Mpa,a)}',
  oqa: 'function(){return this.R0c}',
  dispatchEvent:
    'function(a){var b,c=this.oqa();if(c)for(b=[];c;c=c.oqa())b.push(c);c=this.Dff;var d=a.type||a;if(typeof a==="string")a=new _.Hb(a,c);else if(a instanceof _.Hb)a.target=a.target||c;else{var e=a;a=new _.Hb(d,c);_.Qb(a,e)}e=!0;var f;if(b)for(f=b.length-1;!a.ka&&f>=0;f--){var g=a.currentTarget=b[f];e=g.Sab(d,!0,a)&&e}a.ka||(g=a.currentTarget=c,e=g.Sab(d,!0,a)&&e,a.ka||(e=g.Sab(d,!1,a)&&e));if(b)for(f=0;!a.ka&&f<b.length;f++)g=a.currentTarget=b[f],e=g.Sab(d,!1,a)&&e;return e}',
  Sab: 'function(a,b,c){a=this.Mpa.listeners[String(a)];if(!a)return!0;a=a.concat();var d=!0;for(let e=0;e<a.length;++e){let f=a[e];if(f&&!f.removed&&f.capture==b){let g=f.listener,k=f.handler||f.src;f.r8a&&this.m4(f);d=g.call(k,c)!==!1&&d}}return d&&!c.defaultPrevented}',
} as const;

const xhrSources = {
  send: 'function(a,b,c,d){if(this.vk)throw Error("Xb`"+this.FAa+"`"+a);if(typeof b==="string")var e=b;else if(b){var f=b;e=f.method;c!=null||(c=f.body);d!=null||(d=f.headers)}e=e?e.toUpperCase():"GET";this.FAa=a;this.DG="";this.D6=0;this.nIc=!1;this.nE=!0;this.vk=this.Xtb(f);this.vk.onreadystatechange=(0,_.qe)((0,_.$b)(this.J7d,this));this.R3f&&"onprogress"in this.vk&&(this.vk.onprogress=(0,_.qe)((0,_.$b)(function(k){this.I7d(k,!0)},this)),this.vk.upload&&(this.vk.upload.onprogress=(0,_.qe)((0,_.$b)(this.I7d,\nthis))));try{this.TOc=!0,this.vk.open(e,String(a),!0),this.TOc=!1}catch(k){this.Aq(5,k);return}a=c||"";b=new Map(this.headers);if(d)if(Object.getPrototypeOf(d)===Object.prototype)for(var g in d)b.set(g,d[g]);else if(typeof d.keys==="function"&&typeof d.get==="function")for(let k of d.keys())b.set(k,d.get(k));else throw Error("Yb`"+String(d));d=Array.from(b.keys()).find(k=>"content-type"==k.toLowerCase());g=_.fa.FormData&&a instanceof _.fa.FormData;!_.xa(_.xta,e)||d||g||b.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");\nfor(let [k,r]of b)this.vk.setRequestHeader(k,r);this.uI&&(this.vk.responseType=this.uI);"withCredentials"in this.vk&&this.vk.withCredentials!==this.dD&&(this.vk.withCredentials=this.dD);if("setTrustToken"in this.vk&&this.Rbd)try{this.vk.setTrustToken(this.Rbd)}catch(k){}if("setAttributionReporting"in this.vk&&this.mzc)try{this.vk.setAttributionReporting(this.mzc)}catch(k){}try{this.Fua&&(clearTimeout(this.Fua),this.Fua=null),this.Vlb>0&&(this.Fua=setTimeout(this.lH.bind(this),this.Vlb)),this.t6b=\n!0,this.vk.send(a),this.t6b=!1}catch(k){this.Aq(5,k)}}',
  Xtb: 'function(a){return this.lPb?this.lPb.Z8(a):_.bja.Z8()}',
  J7d: 'function(){this.isDisposed()||(this.TOc||this.t6b||this.MWa?Cta(this):this.l_c())}',
  constructor:
    'function(a){_.Yb.call(this);this.headers=new Map;this.lPb=a||null;this.nE=!1;this.vk=null;this.FAa="";this.D6=0;this.DG="";this.MWa=this.TOc=this.t6b=this.nIc=!1;this.Vlb=0;this.Fua=null;this.uI="";this.R3f=this.dD=!1;this.mzc=this.Rbd=null}',
  yI: 'function(a){this.dD=a}',
  pea: 'function(){return this.vk?this.vk.readyState:0}',
  E1: 'function(){return this.D6}',
  Ln: 'function(){try{return this.vk?this.vk.responseText:""}catch(a){return""}}',
  getStatus: 'function(){try{return this.pea()>2?this.vk.status:-1}catch(a){return-1}}',
  Xu: 'function(){return this.pea()==4}',
  getResponseHeader:
    'function(a){if(this.vk&&this.Xu())return a=this.vk.getResponseHeader(a),a===null?void 0:a}',
  getResponse:
    'function(){try{if(!this.vk)return null;if("response"in this.vk)return this.vk.response;switch(this.uI){case "":case "text":return this.vk.responseText;case "arraybuffer":if("mozResponseArrayBuffer"in this.vk)return this.vk.mozResponseArrayBuffer}return null}catch(a){return null}}',
  Hc: 'function(){this.vk&&(this.nE&&(this.nE=!1,this.MWa=!0,this.vk.abort(),this.MWa=!1),Bta(this,!0));_.Xj.oe.Hc.call(this)}',
  Aq: 'function(a,b){this.nE=!1;this.vk&&(this.MWa=!0,this.vk.abort(),this.MWa=!1);this.DG=b;this.D6=a;Ata(this);Bta(this)}',
  getAllResponseHeaders:
    'function(){return this.vk&&this.pea()>=2?this.vk.getAllResponseHeaders()||"":""}',
  rG: 'function(){var a={},b=this.getAllResponseHeaders().split("\\r\\n");for(let d=0;d<b.length;d++){if(_.ja(b[d]))continue;var c=_.Jha(b[d],":",1);let e=c[0];c=c[1];if(typeof c!=="string")continue;c=c.trim();let f=a[e]||[];a[e]=f;f.push(c)}return _.Lb(a,function(d){return d.join(", ")})}',
  abort:
    'function(a){this.vk&&this.nE&&(this.nE=!1,this.MWa=!0,this.vk.abort(),this.MWa=!1,this.D6=a||7,this.dispatchEvent("complete"),this.dispatchEvent("abort"),Bta(this))}',
} as const;

const physicalSources = {
  Jh: 'function(){this.Va!=null&&(this.Va=null,llb(this),mlb(this),kt(19))}',
  Di: 'function(){if(this.kb){this.kb=null;this.ha.info("BP detection timeout reached.");if(this.ka.ha!=null){let a=this.ka.ha.Ln();a&&this.ha.warning("Timer should have been cancelled : "+a)}this.ha.info("Buffering proxy detected and switch to long-polling!");this.Eb=!1;this.Yb=!0;kt(10);llb(this);Hlb(this)}else this.ha.warning("Invalid operation.")}',
  uf: 'function(){this.Ja=null;Hlb(this);if(this.Fd&&!this.Yb)if(this.ka==null||this.Fb<=0)this.ha.warning("Skip bpDetectionTimerId_ "+this.ka+" "+this.Fb);else{var a=4*this.Fb;this.ha.info("BP detection timer enabled: "+a);this.kb=zkb((0,_.$b)(this.Di,this),a)}}',
  Hf: 'function(a){if(this.Da)if(this.Da=null,this.ha.debug("startForwardChannel_"),this.fU==1){if(!a){this.ha.debug("open_()");this.Gb=Math.floor(Math.random()*1E5);a=this.Gb++;let e=new lt(this,this.ha,"",a),f=this.Na;this.Oc&&(f?(f=_.Pb(f),_.Qb(f,this.Oc)):f=this.Oc);this.Ga!==null||this.Zb||(e.ob=f,f=null);if(this.Ac)a:{var b=0;for(var c=0;c<this.oa.length;c++){b:{var d=this.oa[c];if("__data__"in d.map&&(d=d.map.__data__,typeof d==="string")){d=d.length;break b}d=void 0}if(d===void 0)break;\nb+=d;if(b>4096){b=c;break a}if(b===4096||c===this.oa.length-1){b=c+1;break a}}b=this.Wd}else b=this.Wd;b=Flb(this,e,b);c=this.ub.clone();_.Fg(c,"RID",a);_.Fg(c,"CVER",22);this.mb&&_.Fg(c,"X-HTTP-Session-Id",this.mb);Blb(this,c);f&&(this.Zb?b="headers="+_.ld(ylb(f))+"&"+b:this.Ga&&_.zlb(c,this.Ga,f));plb(this.Aa,e);this.Ph&&_.Fg(c,"TYPE","init");this.Ac?(_.Fg(c,"$req",b),_.Fg(c,"SID","null"),e.Ac=!0,Tkb(e,c,null)):Tkb(e,c,b);this.fU=2}}else this.fU==3&&(a?Glb(this,a):this.oa.length==0?this.ha.debug("startForwardChannel_ returned: nothing to send"):\nvlb(this.Aa)||(Glb(this),this.ha.debug("startForwardChannel_ finished, sent request")))}',
  Pc: 'function(){this.Va=null;var a=Date.now();a-this.Ub>=0?(Okb(this.ka,this.Ga),this.mb!=2&&(vkb(3),kt(17)),blb(this),this.DG=2,clb(this)):(this.ka.warning("WatchDog timer called too early"),ilb(this,this.Ub-a))}',
  kc: 'function(a){try{a==this.ha?Wkb(this):this.ka.warning("Called back with an unexpected xmlhttp")}catch(b){this.ka.debug("Failed call to OnXmlHttpReadyStateChanged_"),Xkb(this)}finally{}}',
  Vc: 'function(a){a=a.target;var b=this.Ab;b&&a.pea()==3?(this.ka.debug("Throttling readystatechange."),b.fire()):this.kc(a)}',
  bt: 'function(a,b,c,d,e){this.Aa=a;this.ka=b;this.Yc=c;this.oa=d;this.Gb=e||1;this.Zb=new _.ak(this);this.lH=45E3;this.ob=null;this.Ha=!1;this.Da=this.Ga=this.Sa=this.mb=this.Wa=this.Ub=this.Va=null;this.Za=[];this.ha=null;this.Na=0;this.DG=this.Ja=null;this.Fb=-1;this.kb=!1;this.Yb=0;this.Ab=null;this.Oc=this.ub=this.Ac=this.Eb=!1;this.wa=new Bkb}',
  lc: 'function(a,b,c){return a.call.apply(a.bind,arguments)}',
  xjd: 'function(){this.ha.dispatchEvent("Sd")}',
} as const;

// Admits the original cold graph, its two messages, and source-owned physical recovery.
const lifecycleSources = {
  WVb: 'class extends _.Lx{get dg(){return this.jg}constructor(a,b,c,d){super();this.parent=b;this.source=c;this.scopes=d;this.Pn=new Map;this.Bwc=new Set;this.Zpb=[];this.jg=!1;KNb(a,e=>tWb(this,e));this.Pn.set(qWb,FNb(void 0,this));d.has("environment")&&this.Pn.set(_.Lx,FNb(void 0,this));a=this.Pn.get(_.rWb);a!=null&&typeof a.value==="string"&&this.scopes.add(a.value);this.zVd=new Set(this.get(vNb,_.Kw,{self:!0}))}pCa(a,b){b=_.gNb(b)||0;try{return this.get(a,_.pWb,b)}catch(c){if(_.rf(c))return c;\nthrow c;}}destroy(){_.JNb(this);this.jg=!0;var a=_.dw(null);try{for(let c of this.Bwc)c.Lb();let b=this.Zpb;this.Zpb=[];for(let c of b)c()}finally{this.Pn.clear(),this.Bwc.clear(),this.zVd.clear(),_.dw(a)}}Wc(a){_.JNb(this);this.Zpb.push(a);return()=>{var b=this.Zpb.indexOf(a);b!==-1&&this.Zpb.splice(b,1)}}get(a,b=_.pWb,c){_.JNb(this);if(Object.hasOwn(a,oWb))return a[oWb](this);c=_.gNb(c);var d=_.pf(this),e=_.Fw();try{if(!(c&4)){let r=this.Pn.get(a);if(r===void 0){let u=(typeof a==="function"||typeof a===\n"object"&&a.PYc==="InjectionToken")&&_.NMb(a);var f;if(f=u)if(u.hb){var g=_.Hw(u.hb);f=typeof g==="string"?g==="any"||this.scopes.has(g):this.zVd.has(g)}else f=!1;f?r=FNb(ENb(a),HNb):r=null;this.Pn.set(a,r)}if(r!=null)return this.d6b(r,c)}let k=c&2?_.CNb():this.parent;b=c&8&&b===_.pWb?null:b;return k.get(a,b)}catch(k){let r=k[ZMb];if(r===-200||r===-201)throw new _.Dw(r,null);throw k;}finally{_.Fw(e),_.pf(d)}}L0a(){var a=_.dw(null),b=_.pf(this),c=_.Fw();try{let d=this.get(_.wNb,_.Kw,{self:!0});for(let e of d)e()}finally{_.pf(b),\n_.Fw(c),_.dw(a)}}toString(){return"R3Injector[...]"}d6b(a,b){var c=_.dw(null);try{if(a.value===sWb)throw aNb(-200);a.value===HNb&&(a.value=sWb,a.value=a.Xa(void 0,b));var d;if(d=typeof a.value==="object"&&a.value){var e=a.value;d=e!==null&&typeof e==="object"&&typeof e.Lb==="function"}d&&this.Bwc.add(a.value);return a.value}finally{_.dw(c)}}}',
  pnb: 'class{constructor(a){this.ha=a}next(a){var b=this.ha;if(b.next)try{b.next(a)}catch(c){Rlb(c)}}error(a){var b=this.ha;if(b.error)try{b.error(a)}catch(c){Rlb(c)}else Rlb(a)}complete(){var a=this.ha;if(a.complete)try{a.complete()}catch(b){Rlb(b)}}}',
  rnb: 'class extends _.Yt{constructor(a,b){super();this.destination=a;this.source=b}next(a){var b,c;(b=this.destination)==null||(c=b.next)==null||c.call(b,a)}error(a){var b,c;(b=this.destination)==null||(c=b.error)==null||c.call(b,a)}complete(){var a,b;(a=this.destination)==null||(b=a.complete)==null||b.call(a)}ha(a){var b,c;return(c=(b=this.source)==null?void 0:b.subscribe(a))!=null?c:_.qt.ha}}',
  GOb: 'class extends _.yx{constructor(){var a=_.y();super();this.Ps=a}get dg(){return _.Ow(this.Ps)}Wc(a){var b=this.Ps;_.YNb(b,a);return()=>_.ZNb(b,a)}}',
  zt: 'class extends snb{constructor(a,b,c,d,e){super(a);this.Da=e;b&&(this.Nj=function(f){try{b(f)}catch(g){this.destination.error(g)}});c&&(this.M6a=function(f){try{c(f)}catch(g){this.destination.error(g)}this.unsubscribe()});d&&(this.ha=function(){try{d()}catch(f){this.destination.error(f)}this.unsubscribe()})}unsubscribe(){var a;this.closed||(a=this.Da)!=null&&a.call(this);super.unsubscribe()}}',
  bu: 'function(a){return _.xt((b,c)=>{_.tt(a).subscribe(new _.zt(c,()=>c.complete(),void 0,_.Qlb));!c.closed&&b.subscribe(c)})}',
  Vt: 'function(a){return a<=0?()=>_.It:_.xt((b,c)=>{var d=0;b.subscribe(new _.zt(c,e=>{++d<=a&&(c.next(e),a<=d&&c.complete())}))})}',
  xt: 'function(a){return b=>{if(_.pt(b==null?void 0:b.lift))return b.lift(function(c){try{return a(c,this)}catch(d){this.error(d)}});throw new TypeError("ch");}}',
  tt: 'function(a){if(a instanceof _.st)return a;if(a!=null){if(_.pt(a[Zlb]))return emb(a);if(_.cmb(a))return fmb(a);if(_.pt(a==null?void 0:a.then))return gmb(a);if(Symbol.asyncIterator&&_.pt(a==null?void 0:a[Symbol.asyncIterator]))return hmb(a);if(_.pt(a==null?void 0:a[Xlb]))return imb(a)}throw bmb(a);}',
  Qlb: 'function(){}',
  Ow: 'function(a){return(a[2]&256)===256}',
  YNb: 'function(a,b){if(_.Ow(a))throw new _.Dw(911,!1);a[21]===null&&(a[21]=[]);a[21].push(b)}',
  ZNb: 'function(a,b){a[21]!==null&&(b=a[21].indexOf(b),b!==-1&&a[21].splice(b,1))}',
  lift: 'lift(a){var b=new vnb(this,this);b.operator=a;return b}',
  ntUnsubscribe:
    'unsubscribe(){var a;this.closed||(a=this.Da)!=null&&a.call(this);super.unsubscribe()}',
  ntNext: 'function(f){try{b(f)}catch(g){this.destination.error(g)}}',
  ntComplete: 'function(){try{d()}catch(f){this.destination.error(f)}this.unsubscribe()}',
  mtOperator:
    'b=>{if(_.pt(b==null?void 0:b.lift))return b.lift(function(c){try{return a(c,this)}catch(d){this.error(d)}});throw new TypeError("ch");}',
  producer:
    'k=>\n{var r={CAc:void 0,BAc:void 0,AAc:void 0},u={fAd:void 0,afe:new Set};HAd(this.zl);var w=new OLd(this.mb,f,g);NLd(w);var B=!1,C=JKd(this.Wd,b,a,{next:G=>{if(!B){if(w.enabled&&!w.ka&&!w.ha){var N=_.wtd(G)?G.request.conversationId:G.responseType==="ROUTING"||G.responseType==="TURN_COMPLETED"||G.responseType==="CONTINUATION_UPDATE"?G.conversationId:void 0;N&&(w.ha=N,NLd(w))}k.next(G)}},error:G=>{B||(B=!0,this.ka.handleError(G instanceof Error?G:Error(String(G)),d),w.onComplete(),k.error(G))},complete:()=>\n{B||(B=!0,LId(this.ka,d),w.onComplete(),k.complete())}},(G,N,T,aa)=>{if(this.Aa)a:{var da=this.Eb.get();if((da==null?0:da.isEnabled())&&N.aib!=="RECONNECT_TO_EXISTING_TURN"){let Lc=da.wnf();if(Lc){var ta=!N.ZKa&&_.JJd(Lc.connection);if(ta){{let Hc=Rwd(Lc.tec),bd=Rwd(G);if(_.gk(Hc,bd))var ya=[];else{ya=[];xL(_.XL(Hc),_.XL(bd))||ya.push("IDENTIFIERS");xL(_.m(Hc,_.yL,72),_.m(bd,_.yL,72))||ya.push("CONTINUATION_IDENTIFIERS");_.ui(Hc,19)!==_.ui(bd,19)&&ya.push("REQUESTED_BARD_MODE");_.n(Hc,39)!==_.n(bd,\n39)&&ya.push("REQUESTED_MODE_ID");_.ui(Hc,80)===_.ui(bd,80)&&_.ui(Hc,76)===_.ui(bd,76)&&_.n(Hc,65)===_.n(bd,65)&&_.n(Hc,74)===_.n(bd,74)||ya.push("REQUESTED_MODE_CATEGORY");_.ui(Hc,81)!==_.ui(bd,81)&&ya.push("REQUESTED_THINKING_LEVEL");_.ui(Hc,50)!==_.ui(bd,50)&&ya.push("USER_SELECTED_FEATURE_MODE");_.oi(Hc,92)!==_.oi(bd,92)&&ya.push("SMART_MODEL_SELECTION");_.oi(Hc,97)!==_.oi(bd,97)&&ya.push("MANUAL_PICKER_OVERRIDE");_.oi(Hc,66)!==_.oi(bd,66)&&ya.push("SKIP_THINKING");xL(_.m(Hc,_.wxd,42),_.m(bd,\n_.wxd,42))||ya.push("MEMORY_OPTIONS");Hc.JIa()!==bd.JIa()&&ya.push("PERSONAL_CONTEXT_DISABLED");_.oi(Hc,46)!==_.oi(bd,46)&&ya.push("TEMPORARY_CHAT");var Da=_.vL(Hc),Wa=_.vL(bd),eb,nb;((eb=Da==null?void 0:_.XEd(Da))!=null?eb:!1)!==((nb=Wa==null?void 0:_.XEd(Wa))!=null?nb:!1)&&ya.push("VOICE_ENTRY");var Bb,Ib;((Bb=Da==null?void 0:_.oi(Da,7))!=null?Bb:!1)!==((Ib=Wa==null?void 0:_.oi(Wa,7))!=null?Ib:!1)&&ya.push("ZERO_STATE_PROMPT");xL(_.m(Hc,_.Sv,34),_.m(bd,_.Sv,34))||ya.push("SYSTEM_QUERY");var jc,\nXb;Swd((jc=Da==null?void 0:_.di(Da,_.ZK,4))!=null?jc:[],(Xb=Wa==null?void 0:_.di(Wa,_.ZK,4))!=null?Xb:[])||ya.push("FILE_ATTACHMENTS");xL(Da==null?void 0:_.m(Da,_.tL,10),Wa==null?void 0:_.m(Wa,_.tL,10))||ya.push("ATTACHED_CONTEXT");(Da==null?void 0:_.ui(Da,11))!==(Wa==null?void 0:_.ui(Wa,11))&&ya.push("CONTEXTUAL_ACTION");Swd(_.di(Hc,_.az,10),_.di(bd,_.az,10))||ya.push("TOOL_MENTIONS");Twd(_.vi(Hc,82),_.vi(bd,82))||ya.push("SELECTED_SKILL_IDS");Twd(_.vi(Hc,96),_.vi(bd,96))||ya.push("SELECTED_FIRST_PARTY_SKILL_IDS");\nTwd(_.vi(Hc,107),_.vi(bd,107))||ya.push("SELECTED_PLUGIN_IDS");_.n(Hc,70)!==_.n(bd,70)&&ya.push("SKILL_ID");_.oi(Hc,99)!==_.oi(bd,99)&&ya.push("CHROME_SKILLS_ENABLED");_.oi(Hc,12)===_.oi(bd,12)&&_.oi(Hc,54)===_.oi(bd,54)||ya.push("DISABLE_TOOLS_OR_QUIZ");Swd(_.di(Hc,_.PG,9),_.di(bd,_.PG,9))||ya.push("REQUEST_SCOPED_CONSENTS");xL(_.m(Hc,Ytd,55),_.m(bd,Ytd,55))&&xL(_.m(Hc,dud,56),_.m(bd,dud,56))||ya.push("INPUT_COMPANION");_.n(Hc,20)===_.n(bd,20)&&_.oi(Hc,37)===_.oi(bd,37)&&xL(_.m(Hc,_.hK,25),_.m(bd,\n_.hK,25))&&Twd(_.vi(Hc,40),_.vi(bd,40))&&xL(_.m(Hc,fud,41),_.m(bd,fud,41))||ya.push("BOT_CONFIG_OR_METADATA");_.n(Hc,105)!==_.n(bd,105)&&ya.push("PROJECT_ID");var Jc;Da=(Jc=_.m(Hc,_.EI,62))==null?void 0:Jc.clone();var Zc;Jc=(Zc=_.m(bd,_.EI,62))==null?void 0:Zc.clone();var ud,Gd;((ud=Da==null?void 0:_.qi(Da,9))!=null?ud:0)!==((Gd=Jc==null?void 0:_.qi(Jc,9))!=null?Gd:0)&&ya.push("CAPTURED_REGIONS");Da!=null&&_.Wh(Da,9);Jc!=null&&_.Wh(Jc,9);!Da&&!Jc||xL(Da!=null?Da:new _.EI,Jc!=null?Jc:new _.EI)||ya.push("GEMINI_IN_CHROME_METADATA");\nxL(_.m(Hc,_.eA,16),_.m(bd,_.eA,16))||ya.push("DEVICE_CONTEXT");xL(_.m(Hc,nyd,23),_.m(bd,nyd,23))||ya.push("REQUEST_LOGGING_METADATA");xL(_.m(Hc,rud,43),_.m(bd,rud,43))&&xL(_.m(Hc,Jud,71),_.m(bd,Jud,71))||ya.push("IMMERSIVE_OR_ARTIFACTS_CONTEXT");xL(_.m(Hc,Yud,63),_.m(bd,Yud,63))||ya.push("GOAL_INPUT");xL(_.m(Hc,_.S0c,102),_.m(bd,_.S0c,102))||ya.push("HIGHLIGHT_TO_ASK_CONTEXT");xL(_.m(Hc,Cyd,90),_.m(bd,Cyd,90))||ya.push("REMY_METADATA");xL(_.m(Hc,Ayd,98),_.m(bd,Ayd,98))||ya.push("DEEP_RESEARCH_METADATA");\nxL(_.m(Hc,Pxd,86),_.m(bd,Pxd,86))||ya.push("AGENTIC_SIGNIN_METADATA");xL(_.m(Hc,OFd,58),_.m(bd,OFd,58))||ya.push("COMPUTER_USE_METADATA");xL(_.m(Hc,eyd,87),_.m(bd,eyd,87))||ya.push("REMOTE_DEVICE_TARGET");Hc.oea()===bd.oea()&&xL(_.m(Hc,_.iLb,94),_.m(bd,_.iLb,94))&&_.n(Hc,103)===_.n(bd,103)&&_.n(Hc,108)===_.n(bd,108)&&xL(_.m(Hc,axd,57),_.m(bd,axd,57))||ya.push("PROMPT_SOURCE_OR_ID");xL(_.m(Hc,zxd,85),_.m(bd,zxd,85))||ya.push("FOLLOW_UP_METADATA");_.ui(Hc,73)===_.ui(bd,73)&&xL(_.m(Hc,_.b2c,64),_.m(bd,\n_.b2c,64))&&_.ui(Hc,100)===_.ui(bd,100)&&_.qi(Hc,104)===_.qi(bd,104)||ya.push("REGENERATE");xL(_.m(Hc,$xd,18),_.m(bd,$xd,18))||ya.push("TURN_INDEX");xL(_.m(Hc,_.lG,2),_.m(bd,_.lG,2))&&xL(_.m(Hc,_.RI,7),_.m(bd,_.RI,7))&&_.ui(Hc,69)===_.ui(bd,69)||ya.push("THEME_OR_LOCALE");Twd(_.Gk(Hc,31),_.Gk(bd,31))||ya.push("CLIENT_CAPABILITIES");ya.length===0&&ya.push("OTHER")}}}else ya=["CONNECTION_UNUSABLE"];if(ta&&ya.length===0){_.AAd(this.Jc,"CONSUMED",Lc.wi);zAd(this.Jc,this.Na.now()-Lc.UM,Lc.wi,!0);da.aDc();\nG=VLd(this,Lc.connection,G,N,T,r,u,aa);break a}_.iM(Lc.connection);_.AAd(this.Jc,"MISMATCH",Lc.wi);for(let Hc of ya)ta=this.Jc,ta.Kd.increment(Hc,Lc.wi||"undefined",ta.requestSource);zAd(this.Jc,this.Na.now()-Lc.UM,Lc.wi,!1);da.aDc()}else da=da.aDc(),da!==void 0&&zAd(this.Jc,this.Na.now()-da,N.wi,!1)}G=ULd(this,G,N,T,r,u,aa)}else G=SLd(this,G,N,T,r,u,aa);return G});return()=>{w.onComplete();C();IAd(this.zl)}}',
  pnbMethods: {
    next: 'next(a){var b=this.ha;if(b.next)try{b.next(a)}catch(c){Rlb(c)}}',
    error: 'error(a){var b=this.ha;if(b.error)try{b.error(a)}catch(c){Rlb(c)}else Rlb(a)}',
    complete: 'complete(){var a=this.ha;if(a.complete)try{a.complete()}catch(b){Rlb(b)}}',
  },
} as const;

// Source-owned cold transport and correlated native receive lifetime.
export function armGeminiColdWebChannel(
  namespace: unknown,
  actualApi: unknown,
  approved: ApprovedGeminiTrial,
  current: () => boolean,
  consumingOriginal: () => boolean,
  observer: {
    next(receipt: GeminiNativeFrameReceipt): void;
    control(field: 4 | 5): void;
    error(): void;
  },
): {
  bindPacket(packet: unknown): void;
  bindObservable(observable: unknown): void;
  close(): void;
  sent(): boolean;
  receiving(): boolean;
  projecting(frame: unknown): boolean;
  identity(): GeminiNativeIdentity;
  completion(value: GeminiTrialCompletion): GeminiTrialCompletion;
  detach(): void;
} {
  type Call = (this: unknown, ...args: any[]) => any;
  type Retained = { owner: object; key: PropertyKey; descriptor?: PropertyDescriptor };
  let closed = false,
    failed = false,
    detached = false,
    cleaning = false;
  let failures = 0,
    callbackActive = false;
  let cold: 'not-entered' | 'checking' | 'await-factory' | 'spent' = 'not-entered';
  let packet: unknown, ok: unknown, instance: any, connection: any, channel: any, transport: any;
  const packetKeys: Array<{ owner: object; keys: PropertyKey[] }> = [];
  let bound = false,
    hjdCount = 0,
    factoryCount = 0,
    configCount = 0,
    queryCount = 0,
    connects = 0;
  let inConfig = false,
    inConnect = false,
    queueBusy = false;
  let networkScheduled = false,
    handlerOpened = false,
    cleanupStarted = false;
  let provisionalChannel: any, provisionalTransport: any;
  const provisional: Retained[] = [];
  let builderEntered = false;
  let physicalDepth = 0,
    physicalStarted = false,
    logicalAttempt = false;
  let constructing: 'forward' | 'backchannel' | 'terminate' | undefined;
  let opening = false,
    flushing = false,
    sentMessages = 0;
  let retiring = false,
    retired = false,
    fatal = false,
    fatalEvent: unknown;
  let serializing: unknown,
    serialized: string | undefined,
    serializedOnce = false;
  let retrySchedule: { handle: unknown; request: object } | undefined;
  let protocolSid = '',
    activeCallback: any;
  let backendEvidence: (() => void) | undefined;
  let checkBackend: ((request: any) => void) | undefined;
  let armNativeSend: ((request: object, xhr: object) => void) | undefined;
  let transportWitness: (() => void) | undefined;
  const maps = new Map<object, { mapId: number; map: object; data: string }>();
  const requests = new Map<
    object,
    {
      kind: 'forward' | 'backchannel' | 'terminate';
      rid: number | 'rpc';
      sid: string;
      batch: object[];
      batchOwner: object;
      prototype: object;
    }
  >();
  let initialActiveCapacity: number;
  let handler: any;
  let queue: any[], config: unknown, query: unknown, seed: unknown;
  let cleanupEvidence: (() => void) | undefined, eventEvidence: (() => void) | undefined;
  const retained: Retained[] = [];
  const prototypes: Array<{ value: object; prototype: object | null }> = [];
  const restoration: Retained[] = [];
  const hooks: Retained[] = [];
  const sourceText = Function.prototype.toString;
  const push = Array.prototype.push;
  const refusals = new WeakSet<object>();
  type Diagnostic = (typeof GEMINI_NATIVE_DISPATCH_REASONS)[number];
  let firstFailure: Error | undefined;
  let firstOrigin: Diagnostic | null | undefined;
  let diagnostic: Diagnostic | null = null;
  function n15(origin: Diagnostic) {
    return diagnostic === 'dispatch-native-n15' ? origin : diagnostic;
  }
  function rememberOrigin(origin = diagnostic) {
    if (firstOrigin === undefined) firstOrigin = origin;
  }
  function withDiagnostic<T>(origin: Diagnostic | null, call: () => T): T {
    const previous = diagnostic;
    diagnostic = origin;
    try {
      return call();
    } finally {
      diagnostic = previous;
    }
  }
  function fail(origin = diagnostic): never {
    rememberOrigin(origin);
    failures++;
    failed = closed = true;
    const error =
      firstFailure ??
      new Error('Gemini cold WebChannel refused', { cause: 'dispatch-cold-webchannel' });
    if (!firstFailure && firstOrigin !== null && firstOrigin !== undefined)
      Object.defineProperty(error, 'geminiNativeDiagnostic', { value: firstOrigin });
    firstFailure = error;
    refusals.add(error);
    throw error;
  }
  function refused(error: unknown, origin = diagnostic): never {
    if (
      diagnostic === 'dispatch-native-n15' &&
      (origin === 'dispatch-native-n15' ||
        origin === 'dispatch-native-n15-unknown-gjd' ||
        origin === 'dispatch-native-n15-unknown-push' ||
        origin === 'dispatch-native-n15-unknown-content' ||
        origin === 'dispatch-native-n15-unknown-kind' ||
        origin === 'dispatch-native-n15-unknown-configuration')
    )
      origin =
        readGeminiNativeOutboundDiagnostic(error) ??
        (origin === 'dispatch-native-n15' ? 'dispatch-native-n15-unknown-guard' : origin);
    rememberOrigin(origin);
    failed = closed = true;
    if (typeof error === 'object' && error !== null && refusals.has(error)) throw error;
    return fail();
  }
  function require(value: unknown, origin = diagnostic): asserts value {
    if (!value) fail(origin);
  }
  function object(value: unknown): any {
    require(value !== null &&
      (typeof value === 'object' || typeof value === 'function'), diagnostic ===
      'dispatch-native-n15'
      ? 'dispatch-native-n15-object-shape'
      : (diagnostic ?? 'dispatch-native-n11'));
    return value;
  }
  function descriptor(owner: unknown, key: PropertyKey) {
    return Object.getOwnPropertyDescriptor(object(owner), key);
  }
  function own(owner: unknown, key: PropertyKey): any {
    const d = descriptor(owner, key);
    if (!d) return undefined;
    require('value' in d, 'dispatch-native-n10');
    return d.value;
  }
  function fn(value: unknown): Call {
    require(typeof value === 'function', diagnostic === 'dispatch-native-n15'
      ? 'dispatch-native-n15-fn-shape'
      : (diagnostic ?? 'dispatch-native-n11'));
    return value as Call;
  }
  function same(a?: PropertyDescriptor, b?: PropertyDescriptor) {
    return a === undefined
      ? b === undefined
      : b !== undefined &&
          a.value === b.value &&
          a.get === b.get &&
          a.set === b.set &&
          a.writable === b.writable &&
          a.enumerable === b.enumerable &&
          a.configurable === b.configurable;
  }
  function retain(owner: unknown, key: PropertyKey) {
    if (!prototypes.some((r) => r.value === owner))
      prototypes.push({ value: object(owner), prototype: Object.getPrototypeOf(object(owner)) });
    const entry = { owner: object(owner) as object, key, descriptor: descriptor(owner, key) };
    retained.push(entry);
    return own(owner, key);
  }
  function resolved(value: unknown, key: string): Call {
    let owner = object(value);
    for (let depth = 0; depth < 8; depth++) {
      const d = descriptor(owner, key);
      const method = retain(owner, key);
      if (d) return fn(method);
      owner = Object.getPrototypeOf(owner);
      object(owner);
    }
    return fail();
  }
  function source(value: unknown, expected: string, pin: Diagnostic = 'dispatch-native-n05'): Call {
    const f = fn(value);
    require(Reflect.apply(sourceText, f, []) === expected, pin);
    return f;
  }
  function pinMethods(
    p: object,
    entries: Record<string, string>,
    pin: Diagnostic = 'dispatch-native-n06',
  ) {
    for (const [key, text] of Object.entries(entries)) source(retain(p, key), text, pin);
  }
  function absent(value: unknown, key: string) {
    let owner = object(value);
    for (let depth = 0; owner !== null && depth < 8; depth++) {
      require(!descriptor(owner, key));
      retain(owner, key);
      owner = Object.getPrototypeOf(owner);
    }
    require(owner === null);
  }
  function getter(value: unknown, key: string, expected: string) {
    const d = descriptor(value, key);
    require(d?.get && !d.set && !('value' in d), 'dispatch-native-n10');
    source(d.get, expected);
    retained.push({ owner: object(value), key, descriptor: d });
  }
  function proto(name: string, expected?: string): any {
    const C = retain(namespace, name);
    fn(C);
    if (expected) source(C, expected);
    const p = retain(C, 'prototype');
    object(p);
    require(own(p, 'constructor') === C, diagnostic ?? 'dispatch-native-n11');
    for (const key of Reflect.ownKeys(p))
      retained.push({ owner: p, key, descriptor: descriptor(p, key) });
    return p;
  }
  function exact(value: unknown, p: object) {
    require(Object.getPrototypeOf(object(value)) === p, diagnostic === 'dispatch-native-n15'
      ? 'dispatch-native-n15-exact-shape'
      : (diagnostic ?? 'dispatch-native-n11'));
    if (!prototypes.some((r) => r.value === value))
      prototypes.push({ value: object(value), prototype: p });
  }
  function noOwn(value: unknown, key: string) {
    const early = provisional.find((r) => r.owner === value && r.key === key);
    require(early
      ? same(early.descriptor, descriptor(value, key))
      : !descriptor(value, key), 'dispatch-native-n10');
  }
  function replace(owner: any, key: string, value: Call, restore = false, origin?: Diagnostic) {
    const original = descriptor(owner, key);
    require(original
      ? 'value' in original && original.writable && original.configurable
      : Object.isExtensible(owner), 'dispatch-native-n10');
    if (restore) restoration.push({ owner, key, descriptor: original });
    const invoke =
      origin === undefined
        ? value
        : function (this: unknown, ...args: any[]) {
            return withDiagnostic(origin, () => Reflect.apply(value, this, args));
          };
    const guarded = function (this: unknown, ...args: any[]) {
      require(!callbackActive);
      const scoped =
        lifetime &&
        [
          'next',
          'error',
          'complete',
          'unsubscribe',
          'disconnect',
          'close',
          'dispatchEvent',
        ].includes(key) &&
        (lifecycleSubjects.has(owner) ||
          lifecycleSubscriptions.has(owner) ||
          owner === channel ||
          owner === connection ||
          owner === instance);
      const terminal =
        lifetime &&
        !cleaning &&
        !opening &&
        (lifecycleSubjects.has(owner) ||
          (!failed && !producerActive && lifecycleSubscriptions.has(owner))) &&
        (key === 'complete' || key === 'error');
      const wasCleaning = cleaning;
      if (terminal) closed = cleaning = true;
      try {
        return scoped
          ? control(() => Reflect.apply(invoke, this, args), origin)
          : Reflect.apply(invoke, this, args);
      } finally {
        if (terminal) {
          cleaning = wasCleaning;
          drainDetach();
        }
      }
    };
    if (lifetime) for (const method of ['bind', 'call', 'apply']) retain(guarded, method);
    Object.defineProperty(
      owner,
      key,
      original
        ? { ...original, value: guarded }
        : { value: guarded, writable: true, configurable: true },
    );
    for (const r of retained)
      if (r.owner === owner && r.key === key) r.descriptor = descriptor(owner, key);
    const hook = hooks.find((r) => r.owner === owner && r.key === key);
    if (hook) hook.descriptor = descriptor(owner, key);
    else hooks.push({ owner, key, descriptor: descriptor(owner, key) });
  }
  function constructor(value: unknown, expected: string, parent?: object): any {
    const p = Object.getPrototypeOf(object(value));
    object(p);
    source(own(p, 'constructor'), expected);
    exact(value, p);
    if (parent)
      require(Object.getPrototypeOf(p) === parent, diagnostic === 'dispatch-native-n15'
        ? 'dispatch-native-n15-constructor-shape'
        : (diagnostic ?? 'dispatch-native-n11'));
    for (const key of Reflect.ownKeys(p))
      retained.push({ owner: p, key, descriptor: descriptor(p, key) });
    return p;
  }
  source(push, 'function push() { [native code] }', 'dispatch-native-n09');
  retain(Array.prototype, 'push');
  const api = object(actualApi),
    ns = object(namespace);
  require(typeof current === 'function' && typeof consumingOriginal === 'function');
  for (const key of ['next', 'control', 'error']) fn(own(observer, key));
  const apiPrototype = proto('pM');
  exact(api, apiPrototype);
  noOwn(api, 'Zxb');
  source(own(apiPrototype, 'Zxb'), profile.Zxb);
  const session = retain(api, 'ub'),
    registry = retain(api, 'Eb'),
    protection = retain(api, 'Ja');
  const sessionPrototype = proto('eKd', profile.eKd),
    registryPrototype = proto('hKd', profile.hKd);
  exact(session, sessionPrototype);
  exact(registry, registryPrototype);
  exact(protection, proto('bM'));
  require(
    retain(api, 'Aa') === true &&
      retain(protection, 'isEnabled') === true &&
      retain(session, 'oa') === false,
  );
  const lifetime = retain(api, 'Ia'),
    requestSource = retain(api, 'requestSource');
  require(Number.isInteger(requestSource));
  const settings = retain(session, 'Ca');
  object(settings);
  let settingsOwner = settings;
  for (let depth = 0; !descriptor(settingsOwner, 'Ea') && depth < 4; depth++) {
    retain(settingsOwner, 'Ea');
    settingsOwner = Object.getPrototypeOf(settingsOwner);
    object(settingsOwner);
  }
  fn(retain(settingsOwner, 'Ea'));
  retain(session, 'ha');
  retain(session, 'ka');
  const wa = descriptor(sessionPrototype, 'wa');
  require(wa?.get && !wa.set);
  noOwn(session, 'wa');
  source(wa.get, 'get wa(){return this.Ca.Ea(cKd)}');
  retain(session, 'wa');
  pinMethods(registryPrototype, methods.kM);
  noOwn(registry, 'get');
  noOwn(registry, 'register');
  retain(registry, 'register');
  require(Object.getPrototypeOf(registryPrototype) === Object.prototype);
  require(!descriptor(registryPrototype, 'ha') && !descriptor(Object.prototype, 'ha'));
  retain(registryPrototype, 'ha');
  retain(Object.prototype, 'ha');
  require(Object.getPrototypeOf(Object.prototype) === null);
  const manager = retain(registry, 'ha');
  let idleConsumed = false;
  let idleEnabled = false;
  let managerPrototype: object | undefined, consumer: any, consumerPrototype: object | undefined;
  const idleWrites: Retained[] = [];
  if (manager !== undefined) {
    managerPrototype = proto('qVd', profile.qVd);
    pinMethods(managerPrototype!, methods.CUd);
    exact(manager, managerPrototype!);
    require(Object.getPrototypeOf(managerPrototype) === Object.prototype);
    require(retain(manager, 'Na') === session && retain(manager, 'ka') === false);
    consumer = retain(manager, 'Oa');
    consumerPrototype = proto('GN');
    exact(consumer, consumerPrototype!);
    require(retain(consumer, 'ha') === api);
    idleEnabled = retain(manager, 'Za');
    require(typeof idleEnabled === 'boolean' && retain(manager, 'kb') === false);
    for (const key of ['isEnabled', 'wnf', 'aDc']) {
      noOwn(manager, key);
      retain(manager, key);
    }
    for (const key of ['ha', 'wa', 'Ja', 'Ga']) {
      require(!descriptor(managerPrototype, key) && !descriptor(Object.prototype, key));
      retain(managerPrototype, key);
      retain(Object.prototype, key);
      const d = descriptor(manager, key);
      require(!d || ('value' in d && d.value === undefined));
      if (key === 'wa' || key === 'Ja') {
        if (idleEnabled) require(d ? d.writable : Object.isExtensible(manager));
        idleWrites.push({ owner: manager, key, descriptor: d });
      } else retain(manager, key);
    }
  }
  function idleEvidence(consumed = idleConsumed) {
    if (manager !== undefined) {
      exact(manager, managerPrototype!);
      exact(consumer, consumerPrototype!);
    }
    for (const r of idleWrites) {
      const expected =
        consumed && idleEnabled && !r.descriptor
          ? { value: undefined, writable: true, enumerable: true, configurable: true }
          : r.descriptor;
      require(same(expected, descriptor(r.owner, r.key)), 'dispatch-native-n13');
      require(!descriptor(Object.getPrototypeOf(r.owner), r.key) &&
        !descriptor(Object.prototype, r.key), 'dispatch-native-n13');
      if (!consumed && idleEnabled)
        require(r.descriptor
          ? r.descriptor.writable
          : Object.isExtensible(r.owner), 'dispatch-native-n13');
    }
  }
  const sourceKeys = [
    'm',
    'Qh',
    'Mg',
    'Bf',
    'Hh',
    'ub',
    'Ra',
    '$Cb',
    'oJd',
    'pJd',
    'jJd',
    'PLd',
    'LJd',
    'dKd',
    'YJd',
    'FDb',
    'Klb',
    're',
  ] as const;
  for (const key of ['PLd', 'dKd', 'LJd', 'Klb']) {
    const d = descriptor(ns, key);
    require(d && 'value' in d && d.writable && d.configurable, 'dispatch-native-n10');
  }
  require(Object.isExtensible(registry));
  const original: Record<string, Call> = {};
  const pinOrigins: Partial<Record<(typeof sourceKeys)[number], Diagnostic>> = {
    PLd: 'dispatch-native-n01',
    dKd: 'dispatch-native-n02',
    LJd: 'dispatch-native-n03',
    Klb: 'dispatch-native-n04',
  };
  for (const key of sourceKeys)
    original[key] = source(retain(ns, key), profile[key], pinOrigins[key] ?? 'dispatch-native-n05');
  const observablePrototype = proto('st', profile.st),
    subjectPrototype = proto('Yt', profile.Yt),
    behaviorPrototype = proto('gu', profile.gu);
  require(
    Object.getPrototypeOf(subjectPrototype) === observablePrototype &&
      Object.getPrototypeOf(behaviorPrototype) === subjectPrototype,
  );
  pinMethods(observablePrototype, methods.qt);
  pinMethods(subjectPrototype, methods.Rt);
  pinMethods(behaviorPrototype, methods.$t);
  for (const [p, inherited] of [
    [subjectPrototype, methods.qt],
    [behaviorPrototype, { ...methods.qt, ...methods.Rt }],
  ] as const)
    for (const [key, text] of Object.entries(inherited)) {
      const ownMethods = p === subjectPrototype ? methods.Rt : methods.$t;
      if (!Object.hasOwn(ownMethods, key)) {
        noOwn(p, key);
        retain(p, key);
        source(resolved(p, key), text, 'dispatch-native-n06');
      }
    }
  getter(behaviorPrototype, 'value', 'get value(){return this.getValue()}');
  for (const p of [observablePrototype, subjectPrototype, behaviorPrototype]) {
    absent(p, 'operator');
    absent(p, 'source');
  }
  const subscriptionPrototype = proto('qt');
  source(
    own(subscriptionPrototype, 'constructor'),
    'class{constructor(a){this.Na=a;this.closed=!1;this.wa=this.oa=null}unsubscribe(){if(!this.closed){this.closed=!0;let c=this.oa;if(Array.isArray(c))for(var a of c)a.remove(this);else c==null||c.remove(this);a=this.Na;if(_.pt(a))try{a()}catch(e){var b=e instanceof qnb?e.errors:[e]}let d=this.wa;if(d){this.wa=null;for(let e of d)try{_.pt(e)?e():e.unsubscribe()}catch(f){let g;b=(g=b)!=null?g:[];f instanceof qnb?b=[...b,...f.errors]:b.push(f)}}if(b)throw new qnb(b);}}add(a){if(a&&a!==this)if(this.closed)_.pt(a)?a():\na.unsubscribe();else{if(a instanceof _.qt){if(a.closed||a.Ha(this))return;a.Ga(this)}let b;(this.wa=(b=this.wa)!=null?b:[]).push(a)}}Ha(a){var b=this.oa;return b===a||Array.isArray(b)&&b.includes(a)}Ga(a){var b=this.oa;this.oa=Array.isArray(b)?(b.push(a),b):b?[b,a]:a}Ja(a){var b=this.oa;b===a?this.oa=null:Array.isArray(b)&&Olb(b,a)}remove(a){var b=this.wa;b&&Olb(b,a);a instanceof _.qt&&a.Ja(this)}}',
  );
  pinMethods(subscriptionPrototype, methods.ot);
  const subscriberPrototype = proto(
    'Tmb',
    'class extends snb{constructor(a,b,c){super();var d;_.pt(a)||!a?d={next:a!=null?a:void 0,error:b!=null?b:void 0,complete:c!=null?c:void 0}:d=a;this.destination=new tnb(d)}}',
  );
  const subscriberBase = Object.getPrototypeOf(subscriberPrototype);
  source(
    own(subscriberBase, 'constructor'),
    'class extends _.qt{static create(a,b,c){return new _.Tmb(a,b,c)}constructor(a){super();this.Ys=!1;this.destination=a instanceof snb?a:new tnb(!a||_.pt(a)?{next:a!=null?a:void 0}:a);Plb(a)&&a.add(this)}next(a){this.Ys||this.Nj(a)}error(a){this.Ys||(this.Ys=!0,this.M6a(a))}complete(){this.Ys||(this.Ys=!0,this.ha())}unsubscribe(){this.closed||(this.Ys=!0,super.unsubscribe())}Nj(a){this.destination.next(a)}M6a(a){this.destination.error(a);this.unsubscribe()}ha(){this.destination.complete();this.unsubscribe()}}',
  );
  require(Object.getPrototypeOf(subscriberBase) === subscriptionPrototype);
  pinMethods(subscriberBase, methods.onb);
  for (const key of [...Object.keys(methods.onb), ...Object.keys(methods.ot)]) {
    noOwn(subscriberPrototype, key);
    retain(subscriberPrototype, key);
    if (!Object.hasOwn(methods.onb, key)) {
      noOwn(subscriberBase, key);
      retain(subscriberBase, key);
    }
  }
  retain(ns, 'Kaa');
  retain(ns, 'La');
  for (const key of ['dga', 'eM', 'rJd', 'cM']) retain(ns, key);
  retain(Map, 'prototype');
  retained.push({
    owner: Map.prototype,
    key: 'size',
    descriptor: descriptor(Map.prototype, 'size'),
  });
  retain(Map.prototype, 'has');
  retain(Map.prototype, 'get');
  for (const [key, text] of Object.entries(construction))
    source(retain(ns, key), text, 'dispatch-native-n06');
  const eventTargetPrototype = proto('Yb', construction.Yb);
  pinMethods(eventTargetPrototype, eventMethods);
  const eventMapPrototype = proto('Rb', construction.Rb);
  pinMethods(eventMapPrototype, {
    add: 'function(a,b,c,d,e){var f=a.toString();a=this.listeners[f];a||(a=this.listeners[f]=[],this.ha++);var g=Cga(a,b,d,e);g>-1?(b=a[g],c||(b.r8a=!1)):(b=new _.Uba(b,this.src,f,!!d,e),b.r8a=c,a.push(b));return b}',
  });
  const eventMarker = retain(ns, 'Aga');
  require(typeof eventMarker === 'string' && retain(eventTargetPrototype, eventMarker) === true);
  const eventPrototype = proto('ak', profile.eventHandler);
  source(own(eventPrototype, 'listen'), profile.listen);
  source(own(eventPrototype, 'removeAll'), profile.removeAll);
  for (const key of ['zL', 'CI', 'xzd', 'tJd', 'qJd', 'nJd', 'LAd', 'dM', 'hJd', 'UId']) proto(key);
  for (const key of Reflect.ownKeys(approved)) retain(approved, key);
  for (const key of ['Pi', 'Ni', 'Ki', 'ei', 'Th', 'MI', 'NI']) fn(retain(ns, key));
  source(own(ns, 'Th'), 'function(a){return _.Bf(a)}');
  source(own(ns, 'MI'), 'function(a,b){return _.Ni(a,1,b)}');
  source(own(ns, 'NI'), 'function(a,b){return _.Ni(a,2,b)}');
  source(retain(ns, 'DL'), 'function(a){return _.m(a,_.CI,2)}');
  source(retain(ns, 'ci'), 'function(a,b,c,d){return _.Qh(a,b,_.Zh(a,d,c))}');
  source(retain(ns, 'zJd'), 'function(a){return _.ci(a,yJd,4,_.fM)}');
  for (const key of ['n', 'Yh', 'Zh']) fn(retain(ns, key));
  source(retain(own(ns.CI, 'prototype'), 'ig'), 'ig(){return _.n(this,1)}');
  const receipt = createGeminiNativeReceipt(ns, approved);
  let pendingEnvelope: ReturnType<typeof receipt.capture> | undefined;
  let decoding = false,
    sourceDispatchDepth = 0,
    envelopeDispatch = false,
    responseSeen = false;
  let projectingFrame: GeminiNativeFrameReceipt | undefined;
  let nativeTerminal = false,
    nativeClosed = false,
    nativeError = false,
    originalCompleted = false;
  let receiveFailure = false,
    errorReported = false,
    receiveInvalid = false,
    receiveUnwound = false,
    responseForwarded = false,
    verifyingReceive = false;
  let aaSlot: PropertyDescriptor | undefined;
  let aaWitness: (() => void) | undefined;
  const seenEnvelopes = new WeakSet<object>();
  function observe(call: () => void) {
    try {
      call();
    } catch (error) {
      receiveFailure = true;
      try {
        refused(error);
      } catch {
        /* Report only after the complete source stack. */
      }
    }
  }
  function receiveEvidence() {
    try {
      receipt.verify();
      aaWitness?.();
      if (aaSlot) require(same(aaSlot, descriptor(instance, 'Aa')));
    } catch (error) {
      receiveInvalid = true;
      throw error;
    }
  }
  function verifyReceiveIntegrity(physical?: () => void) {
    const previous = verifyingReceive;
    verifyingReceive = true;
    try {
      require(!receiveInvalid);
      physical?.();
      receiveEvidence();
      evidence();
      lifecycleEvidence();
      if (detached) retirementEvidence();
    } catch (error) {
      receiveInvalid = true;
      throw error;
    } finally {
      verifyingReceive = previous;
    }
  }
  function receiveCallback(call: () => void) {
    const lifecycle = snapshotLifecycle();
    const physical = snapshotPhysical();
    callbackActive = true;
    try {
      call();
    } finally {
      callbackActive = false;
      try {
        receiveEvidence();
        lifecycle();
        physical();
      } catch (error) {
        receiveInvalid = true;
        throw error;
      }
      checkpoint(false, false);
    }
  }
  function reportReceiveFailure() {
    if (!receiveFailure || errorReported || receiveDepth || physicalDepth) return;
    errorReported = true;
    try {
      observer.error();
    } catch {
      /* An extension failure never escapes into provider dispatch. */
    }
    observe(verifyReceiveIntegrity);
  }
  let okWitness: (() => void) | undefined,
    configWitness: (() => void) | undefined,
    seedWitness: (() => void) | undefined,
    queryWitness: (() => void) | undefined;
  function evidence() {
    try {
      require((!failed || cleaning || verifyingReceive) &&
        (!detached || (verifyingReceive && retired)), 'dispatch-native-n23');
      idleEvidence();
      for (const r of prototypes)
        require(Object.getPrototypeOf(r.value) === r.prototype, n15(
          'dispatch-native-n15-evidence-01',
        ));
      for (const r of retained)
        require(same(r.descriptor, descriptor(r.owner, r.key)), 'dispatch-native-n10');
      for (const h of hooks)
        require(same(h.descriptor, descriptor(h.owner, h.key)), 'dispatch-native-n10');
      exact(api, apiPrototype);
      exact(session, sessionPrototype);
      exact(registry, registryPrototype);
      if (bound) {
        assertGeminiTrialPacket(ns, packet, approved);
        for (const r of packetKeys) {
          const keys = Reflect.ownKeys(r.owner);
          require(keys.length === r.keys.length && keys.every((k, i) => k === r.keys[i]), n15(
            'dispatch-native-n15-evidence-02',
          ));
        }
      }
      okWitness?.();
      configWitness?.();
      seedWitness?.();
      if (!cleaning || !receiveFailure) receiveEvidence();
      queryWitness?.();
      closeWitness?.();
      lifecycleEvidence();
      eventEvidence?.();
      backendEvidence?.();
      if (cleaning) cleanupEvidence?.();
      if (instance) {
        for (const key of [
          'Da',
          'Gb',
          'Ih',
          'oa',
          'ka',
          'Ja',
          'Va',
          'kb',
          'Sa',
          'Za',
          'Ha',
          'Wa',
          'Pc',
          'Eb',
          'Yb',
          'Ae',
        ])
          require(descriptor(transport, key)?.writable === true, n15(
            'dispatch-native-n15-evidence-03',
          ));
        require((descriptor(transport, 'fU') ?? descriptor(Object.getPrototypeOf(transport), 'fU'))
          ?.writable === true, n15('dispatch-native-n15-evidence-04'));
        require(own(instance, 'connection') === connection &&
          own(instance, 'oa') === queue &&
          own(connection, 'uq') === channel &&
          own(channel, 'ha') === transport &&
          own(channel, 'oa') === handler &&
          own(handler, 'ha') === channel &&
          own(transport, 'wa') === (handlerOpened ? handler : null), n15(
          'dispatch-native-n15-evidence-05',
        ));
        require((own(instance, 'hasError') === false ||
          ((fatal || nativeError) && own(instance, 'hasError') === true)) &&
          (own(instance, 'ha') === false ||
            (physicalStarted && (flushing || sentMessages === 2))) &&
          (own(instance, 't$') === false || (closeStarted && own(instance, 't$') === true)) &&
          own(instance, 'Ja') === false, n15('dispatch-native-n15-evidence-06'));
        if (lifetime)
          require(same(closeTimer, descriptor(instance, 'Ha')) ||
            (cleanupStarted && own(instance, 'Ha') === undefined), 'dispatch-native-n10');
        if (!cleaning && !retired && !nativeClosed)
          require(own(instance, 'wD') === false, n15('dispatch-native-n15-evidence-07'));
        if (physicalStarted) {
          require(own(transport, 'lPb') === undefined && own(transport, 'Uf') === false, n15(
            'dispatch-native-n15-evidence-08',
          ));
          physicalEvidence();
          if (!physicalDepth && !applicationClosing && (!cleaning || !cleanupStarted))
            transportWitness?.();
        } else {
          require(own(own(transport, 'Aa'), 'wa') === initialActiveCapacity, n15(
            'dispatch-native-n15-evidence-09',
          ));
          require(own(transport, 'lPb') === undefined &&
            own(transport, 'Uf') === false &&
            own(transport, 'Sa') === '', n15('dispatch-native-n15-evidence-10'));
          require(own(transport, 'Ih') === 0 &&
            own(transport, 'Gb') === 0 &&
            own(transport, 'ka') === null, n15('dispatch-native-n15-evidence-11'));
          require(own(own(transport, 'Aa'), 'ka') === null &&
            (own(own(transport, 'Aa'), 'ha') === null ||
              (own(own(transport, 'Aa'), 'ha') instanceof Set &&
                Reflect.apply(
                  fn(descriptor(Set.prototype, 'size')?.get),
                  own(own(transport, 'Aa'), 'ha'),
                  [],
                ) === 0)), n15('dispatch-native-n15-evidence-12'));
          require(Array.isArray(own(transport, 'oa')) && own(transport, 'oa').length === 0, n15(
            'dispatch-native-n15-evidence-13',
          ));
          const state = own(transport, 'fU') ?? own(Object.getPrototypeOf(transport), 'fU');
          require(state === 1 || ((cleaning || retired) && state === 0), n15(
            'dispatch-native-n15-evidence-14',
          ));
          require(own(transport, 'Ja') === null &&
            own(transport, 'Va') === null &&
            own(transport, 'kb') === null, n15('dispatch-native-n15-evidence-15'));
          const scheduled = own(transport, 'Da');
          require(scheduled === (networkScheduled ? true : null) ||
            ((cleaning || retired) && scheduled === null), n15('dispatch-native-n15-evidence-16'));
          const backlog = own(own(transport, 'Aa'), 'oa');
          require(Array.isArray(backlog) &&
            Object.getPrototypeOf(backlog) === Array.prototype &&
            backlog.length === 0, n15('dispatch-native-n15-evidence-17'));
          if (!cleaning && !retired) {
            require((own(transport, 'fU') ?? own(Object.getPrototypeOf(transport), 'fU')) ===
              1, n15('dispatch-native-n15-evidence-18'));
            require(own(transport, 'Da') === (networkScheduled ? true : null), n15(
              'dispatch-native-n15-evidence-19',
            ));
          }
          require(own(own(connection, 'uC'), 'Pm') === false, n15(
            'dispatch-native-n15-evidence-20',
          ));
          if (!cleaning && !retired) {
            require(own(instance, 'wa') === (query || (queueBusy && !inConfig) ? 1 : 0), n15(
              'dispatch-native-n15-evidence-21',
            ));
            require(queue.length === (config ? 1 : 0) + (query ? 1 : 0), n15(
              'dispatch-native-n15-evidence-22',
            ));
            if (config) require(queue[0] === config, n15('dispatch-native-n15-evidence-23'));
            if (query) require(queue[1] === query, n15('dispatch-native-n15-evidence-24'));
          }
        }
        if (seed) {
          require(own(instance, 'Aa') === (aaSlot?.value ?? seed), n15(
            'dispatch-native-n15-evidence-25',
          ));
          require(own(seed, 'Fb') !== own(ns, 'Kaa') &&
            (own(own(seed, 'fl'), own(ns, 'La')) & 2) !== 0, n15(
            'dispatch-native-n15-evidence-seed-immutable',
          ));
        }
      }
    } catch (error) {
      refused(error);
    }
  }
  function checkpoint(scope = false, admission = true) {
    require(!callbackActive, 'dispatch-native-n23');
    require(cleaning || !receipt.pending() || decoding || envelopeDispatch, 'dispatch-native-n23');
    evidence();
    if (admission && !cleaning) require(!closed, 'dispatch-native-n23');
    // Retirement relies on retained ownership, never on an application lease callback.
    if (cleaning) return;
    let valid: boolean;
    const before = failures;
    const beforeCallback = physicalStarted ? snapshotPhysical() : undefined;
    const beforeLifecycle = snapshotLifecycle();
    callbackActive = true;
    try {
      valid = current() === true;
    } catch (error) {
      refused(error, 'dispatch-native-n23');
    } finally {
      callbackActive = false;
    }
    beforeCallback?.();
    beforeLifecycle();
    evidence();
    require(failures === before, 'dispatch-native-n23');
    if (admission && !cleaning) require(!closed, 'dispatch-native-n23');
    require(valid, 'dispatch-native-n23');
    if (scope) {
      const beforeScope = snapshotLifecycle();
      callbackActive = true;
      try {
        valid = consumingOriginal() === true;
      } catch (error) {
        refused(error, 'dispatch-native-n23');
      } finally {
        callbackActive = false;
      }
      beforeScope();
      evidence();
      require(failures === before, 'dispatch-native-n23');
      if (admission && !cleaning) require(!closed, 'dispatch-native-n23');
      require(valid, 'dispatch-native-n23');
    }
  }
  function deny(): never {
    return fail();
  }
  function installed(key: string, handler: Call) {
    // Global hooks replace their own original descriptor; source references stay retained separately.
    const d = descriptor(ns, key)!;
    const origins: Record<string, Diagnostic> = {
      PLd: 'dispatch-native-n12',
      dKd: 'dispatch-native-n14',
      Klb: 'dispatch-native-n14',
      LJd: 'dispatch-native-n15',
      iM: 'dispatch-native-n17',
      Vt: 'dispatch-native-n17',
      uA: 'dispatch-native-n17',
      bu: 'dispatch-native-n17',
    };
    replace(ns, key, handler, true, origins[key]);
    const r = retained.find((v) => v.owner === ns && v.key === key)!;
    r.descriptor = descriptor(ns, key);
    require(d.value === original[key]);
  }
  type LifecycleRegistration = {
    index: number;
    input?: any;
    lifted?: any;
    notifier?: any;
    subscriber?: any;
    child?: any;
    take?: any;
    removal?: any;
    unregister?: Call;
    route?: Call;
    applying?: boolean;
    subscribing?: boolean;
    operating?: boolean;
    notifying?: boolean;
    registered?: boolean;
    noRegistration?: boolean;
    finished?: boolean;
  };
  const lifecycleRegistrations: LifecycleRegistration[] = [];
  const lifecycleSubjects = new Map<any, Set<any>>();
  const lifecycleErrors = new Map<any, unknown>();
  const lifecycleSubscriptions = new Map<
    any,
    {
      parent: any;
      children: Set<any>;
      provisional: boolean;
      linked: any;
      members: any[];
      unsubscribed: boolean;
      completed: boolean;
      list?: any[];
      registration?: LifecycleRegistration;
      kind: 'destination' | 'notifier' | 'take' | 'removal' | 'outer';
    }
  >();
  let observable: any, outerSubscriber: any;
  let producerActive = false,
    producerUsed = false,
    acquisitionSuspended = 0;
  let receiveDepth = 0,
    detachQueued = false;
  let activeCreator: LifecycleRegistration | undefined;
  let takeCreated = false,
    takeInput: any,
    takeLift: any;
  let notifierSubscriber: any;
  let closeStarted = false,
    applicationClosing = false,
    closeFrame: any,
    closeFlushStarted = false;
  let closeTimer: PropertyDescriptor | undefined;
  let closeWitness: (() => void) | undefined;
  let lifetimeEvidence: (() => void) | undefined;
  let destroyState: (() => boolean) | undefined;

  function lifecycleEvidence() {
    for (const r of prototypes)
      require(Object.getPrototypeOf(r.value) === r.prototype, 'dispatch-native-n17');
    for (const r of retained)
      require(same(r.descriptor, descriptor(r.owner, r.key)), 'dispatch-native-n10');
    for (const h of hooks)
      require(same(h.descriptor, descriptor(h.owner, h.key)), 'dispatch-native-n10');
    lifetimeEvidence?.();
    for (const [subject, expected] of lifecycleSubjects) {
      const observerList = own(subject, 'observers');
      require(Object.getPrototypeOf(observerList) === Array.prototype, 'dispatch-native-n17');
      for (const key of ['push', 'indexOf', 'splice', 'slice', 'shift'])
        require(!descriptor(observerList, key), 'dispatch-native-n17');
      const observers = list(observerList);
      require(observers.every((value) => expected.has(value)), 'dispatch-native-n17');
      require(new Set(observers).size === observers.length, 'dispatch-native-n17');
    }
    for (const [value, record] of lifecycleSubscriptions) {
      require(typeof own(value, 'closed') === 'boolean', 'dispatch-native-n17');
      require(own(value, 'oa') === record.linked, 'dispatch-native-n17');
      const children = own(value, 'wa');
      if (children !== null) {
        require(Object.getPrototypeOf(children) === Array.prototype, 'dispatch-native-n17');
        require(!descriptor(children, Symbol.iterator), 'dispatch-native-n17');
        for (const key of ['push', 'indexOf', 'splice', 'slice', 'shift'])
          require(!descriptor(children, key), 'dispatch-native-n17');
      }
      if (
        record.kind === 'outer' &&
        !producerActive &&
        record.list === undefined &&
        children !== null
      ) {
        require(list(children).length === 1 &&
          record.children.has(own(children, '0')), 'dispatch-native-n17');
        record.list = children;
        record.members = list(children);
      }
      if (record.list) {
        require(!descriptor(record.list, Symbol.iterator), 'dispatch-native-n17');
        const members = list(record.list);
        require(members.length === record.members.length &&
          members.every((child, index) => child === record.members[index]), 'dispatch-native-n17');
      }
      require(children === null
        ? record.list === undefined || (record.unsubscribed && own(value, 'closed') === true)
        : children === record.list &&
            list(children).every((child) => record.children.has(child)), 'dispatch-native-n17');
      if (record.kind !== 'removal')
        require(typeof own(value, 'Ys') === 'boolean', 'dispatch-native-n17');
      if (record.provisional) {
        require(own(value, 'closed') === false, 'dispatch-native-n17');
      }
    }
  }
  function snapshotLifecycle(allowRetirement = false) {
    const fields: Retained[] = [];
    const arrays: Array<{ value: any[]; items: any[]; parent?: any; subject?: any }> = [];
    const completed = new Set(
      [...lifecycleSubscriptions].filter(([, record]) => record.completed).map(([value]) => value),
    );
    const retired = (value: any) => {
      const record = lifecycleSubscriptions.get(value);
      return allowRetirement && !completed.has(value) && record?.unsubscribed && record.completed;
    };
    for (const value of lifecycleSubscriptions.keys()) {
      for (const key of ['closed', 'Ys', 'wa', 'oa'])
        fields.push({ owner: value, key, descriptor: descriptor(value, key) });
      const children = own(value, 'wa');
      if (children) arrays.push({ value: children, items: list(children), parent: value });
    }
    for (const value of lifecycleSubjects.keys()) {
      for (const key of ['closed', 'Ys', 'hasError', 'oa', 'observers'])
        fields.push({ owner: value, key, descriptor: descriptor(value, key) });
      const observers = own(value, 'observers');
      arrays.push({ value: observers, items: list(observers), subject: value });
    }
    return () => {
      for (const entry of fields) {
        let expected = entry.descriptor;
        if (retired(entry.owner)) {
          // Only a successful captured unsubscribe proves these source-owned transitions.
          const value = entry.key === 'closed' || entry.key === 'Ys' ? true : null;
          if (expected) expected = { ...expected, value };
        }
        require(same(expected, descriptor(entry.owner, entry.key)));
      }
      for (const entry of arrays) {
        const values = list(entry.value);
        if (
          !entry.subject &&
          values.length === entry.items.length &&
          values.every((v, i) => v === entry.items[i])
        )
          continue;
        const expected = entry.items.filter((value) => {
          if (!retired(value)) return true;
          if (!entry.subject) return lifecycleSubscriptions.get(value)?.parent !== entry.parent;
          const registration = lifecycleSubscriptions.get(value)?.registration;
          return (
            !registration || registration.input !== entry.subject || !retired(registration.removal)
          );
        });
        require(values.length === expected.length && values.every((v, i) => v === expected[i]));
      }
    };
  }
  function drainDetach() {
    if (!receiveDepth && detachQueued && !cleaning) {
      detachQueued = false;
      detach();
    }
  }
  function retirementEvidence() {
    if (instance)
      require(queue.length === 0 &&
        own(transport, 'Da') === null &&
        own(transport, 'fU') === 0, 'dispatch-native-n24');
    lifecycleEvidence();
    for (const [value, record] of lifecycleSubscriptions)
      require(record.completed &&
        own(value, 'closed') === true &&
        own(value, 'wa') === null &&
        own(value, 'oa') === null, 'dispatch-native-n24');
    for (const subject of lifecycleSubjects.keys())
      require(list(own(subject, 'observers')).length === 0, 'dispatch-native-n24');
  }
  function control<T>(call: () => T, origin = diagnostic): T {
    return withDiagnostic(origin, () => {
      receiveDepth++;
      try {
        lifecycleEvidence();
        const result = call();
        lifecycleEvidence();
        return result;
      } catch (error) {
        if (sourceDispatchDepth) receiveInvalid = true;
        // ft must see the original error so its remaining proved children run and
        // its original UnsubscriptionError preserves all cleanup failures.
        rememberOrigin();
        failed = closed = true;
        throw error;
      } finally {
        receiveDepth--;
        reportReceiveFailure();
        drainDetach();
      }
    });
  }
  function acquisition() {
    require(
      !!lifetime && !!observable && producerActive && !acquisitionSuspended && !closed && !failed,
    );
    evidence();
  }
  function captureDestination(
    value: any,
    args: any[],
    kind: 'destination' | 'outer',
    registration?: LifecycleRegistration,
  ) {
    exact(value, subscriberPrototype);
    require(!lifecycleSubscriptions.has(value));
    const destination = retain(value, 'destination');
    const p = constructor(destination, lifecycleSources.pnb, Object.prototype);
    const callbacks = retain(destination, 'ha');
    require(Object.getPrototypeOf(callbacks) === Object.prototype);
    for (const key of ['next', 'error', 'complete']) {
      require(own(callbacks, key) === undefined || typeof own(callbacks, key) === 'function');
      absent(Object.prototype, key);
    }
    if (typeof args[0] === 'function' || !args[0]) {
      require(
        own(callbacks, 'next') === args[0] &&
          own(callbacks, 'error') === args[1] &&
          own(callbacks, 'complete') === args[2],
      );
    } else require(callbacks === args[0]);
    for (const key of ['next', 'error', 'complete']) {
      retain(callbacks, key);
      const callback = own(callbacks, key);
      if (callback) {
        replace(callbacks, key, function (this: unknown, ...values: any[]) {
          if (!sourceDispatchDepth && (!physicalStarted || opening))
            return Reflect.apply(callback, this, values);
          const physical = kind === 'outer' ? snapshotPhysical() : undefined;
          const lifecycle = kind === 'outer' ? snapshotLifecycle(true) : undefined;
          try {
            return Reflect.apply(callback, this, values);
          } catch (error) {
            observe(() => {
              throw error;
            });
            throw error;
          } finally {
            observe(() =>
              verifyReceiveIntegrity(() => {
                lifecycle?.();
                physical?.();
              }),
            );
          }
        });
        retained.find((entry) => entry.owner === callbacks && entry.key === key)!.descriptor =
          descriptor(callbacks, key);
      }
      noOwn(destination, key);
      const original = source(
        own(p, key),
        lifecycleSources.pnbMethods[key as 'next' | 'error' | 'complete'],
        'dispatch-native-n06',
      );
      replace(destination, key, function (this: unknown, ...values: any[]) {
        require(this === destination);
        if (sourceDispatchDepth) observe(evidence);
        else evidence();
        acquisitionSuspended++;
        try {
          return control(() => Reflect.apply(original, this, values));
        } finally {
          acquisitionSuspended--;
          if (sourceDispatchDepth) observe(evidence);
          else evidence();
        }
      });
    }
    captureSubscription(value, undefined, kind, registration);
  }
  function captureSubscription(
    value: any,
    parent: any,
    kind: 'destination' | 'notifier' | 'take' | 'removal' | 'outer',
    registration?: LifecycleRegistration,
  ) {
    require(!lifecycleSubscriptions.has(value));
    const provisional = kind === 'notifier' || kind === 'take';
    require(
      own(value, 'closed') === false && own(value, 'oa') === null && own(value, 'wa') === null,
    );
    if (provisional) {
      exact(value, own(own(ns, 'zt'), 'prototype'));
      require(own(value, 'destination') === parent && own(value, 'Ys') === false);
      for (const key of ['Ca', 'Nj', 'ha', 'M6a']) require(!descriptor(value, key));
      retain(value, 'destination');
    }
    if (kind !== 'removal') require(retain(value, 'Na') === undefined);
    const record = {
      parent: parent ?? null,
      children: new Set<any>(),
      provisional,
      linked: null as any,
      members: [] as any[],
      unsubscribed: false,
      completed: false,
      registration,
      kind,
      list: undefined as any[] | undefined,
    };
    lifecycleSubscriptions.set(value, record);
    for (const key of Object.keys(methods.ot)) {
      noOwn(value, key);
      const original = source(
        resolved(value, key),
        key === 'unsubscribe' && kind !== 'removal'
          ? provisional
            ? lifecycleSources.ntUnsubscribe
            : methods.onb.unsubscribe
          : methods.ot[key as keyof typeof methods.ot],
        'dispatch-native-n06',
      );
      replace(
        value,
        key,
        function (this: unknown, ...args: any[]) {
          require(this === value);
          if (key === 'add') {
            const item = args[0];
            require(args.length === 1);
            if (item && item !== value && !record.children.has(item)) {
              require(!acquisitionSuspended && producerActive);
              const reg = registration;
              if (reg?.operating && !reg.child) {
                require(!own(value, 'closed') && value === reg.subscriber);
                reg.child = item;
                captureSubscription(item, value, 'notifier', reg);
              } else if (reg?.operating && reg.index === 2 && takeLift && !reg.take) {
                require(!own(value, 'closed') && value === reg.subscriber);
                reg.take = item;
                captureSubscription(item, value, 'take', reg);
              } else if (
                reg?.index === 1 &&
                reg.finished &&
                !reg.route &&
                value === reg.subscriber
              ) {
                reg.route = source(
                  item,
                  '()=>{T();a.Ga.get(aa)===da&&a.Ga.delete(aa)}',
                  'dispatch-native-n06',
                );
                const routes = retain(api, 'Ga');
                exact(routes, Map.prototype);
                for (const method of ['get', 'delete'])
                  source(
                    resolved(routes, method),
                    `function ${method}() { [native code] }`,
                    'dispatch-native-n09',
                  );
                retain(item, 'call');
              } else fail();
              record.children.add(item);
            }
            if (own(value, 'closed') && item && item !== value)
              require(!lifecycleSubscriptions.get(item)?.provisional);
          } else if (key === 'unsubscribe') {
            require(!record.provisional);
            if (kind === 'outer') closed = true;
            if (kind === 'destination' && registration?.index === 1 && !producerActive)
              closed = true;
          } else if (key === 'remove') {
            require(record.children.has(args[0]));
          } else {
            require(args.length === 1 && args[0] === record.parent);
          }
          return control(() => {
            const wasOpen = own(value, 'closed') === false;
            if (key === 'unsubscribe' && wasOpen) record.unsubscribed = true;
            if (key === 'remove' && own(value, 'wa') !== null)
              record.members = record.members.filter((child) => child !== args[0]);
            const result = Reflect.apply(original, this, args);
            if (key === 'Ga' || key === 'Ja') record.linked = key === 'Ga' ? record.parent : null;
            if (key === 'add' && own(value, 'wa') !== null) {
              if (record.list === undefined) record.list = own(value, 'wa');
              const child = args[0];
              if (
                child &&
                child !== value &&
                !record.members.includes(child) &&
                (!lifecycleSubscriptions.has(child) || own(child, 'closed') === false)
              )
                record.members.push(child);
            }
            if (key === 'unsubscribe' && wasOpen) record.completed = true;
            return result;
          });
        },
        false,
        key === 'unsubscribe' ? 'dispatch-native-n18' : undefined,
      );
    }
    if (!provisional && kind !== 'removal') captureSubscriberControls(value);
  }
  function captureSubscriberControls(value: any) {
    const record = lifecycleSubscriptions.get(value)!;
    for (const key of Object.keys(methods.onb).filter((key) => key !== 'unsubscribe')) {
      const original = fn(resolved(value, key));
      if (record.kind === 'notifier' || record.kind === 'take') {
        source(
          original,
          key === 'Nj'
            ? lifecycleSources.ntNext
            : key === 'ha' && record.kind === 'notifier'
              ? lifecycleSources.ntComplete
              : methods.onb[key as keyof typeof methods.onb],
          'dispatch-native-n06',
        );
      } else source(original, methods.onb[key as keyof typeof methods.onb], 'dispatch-native-n06');
      replace(value, key, function (this: unknown, ...args: any[]) {
        require(this === value && !record.provisional);
        if (destroyState?.()) closed = true;
        return control(() => {
          const completing =
            record.kind === 'outer' && key === 'complete' && own(value, 'Ys') === false;
          const result = Reflect.apply(original, this, args);
          if (completing && nativeTerminal && !failed) originalCompleted = true;
          return result;
        });
      });
    }
  }
  function finalizeChild(value: any, reg: LifecycleRegistration, kind: 'notifier' | 'take') {
    const record = lifecycleSubscriptions.get(value);
    require(record?.provisional && record.kind === kind && record.registration === reg);
    require(own(value, 'oa') === reg.subscriber && retain(value, 'Ca') === undefined);
    require(!descriptor(value, 'M6a'));
    require(kind === 'notifier' ? !!descriptor(value, 'ha') : !descriptor(value, 'ha'));
    source(own(value, 'Nj'), lifecycleSources.ntNext, 'dispatch-native-n06');
    record.provisional = false;
    captureSubscriberControls(value);
  }
  function captureSubject(subject: any) {
    if (lifecycleSubjects.has(subject)) return;
    exact(subject, subjectPrototype);
    require(list(own(subject, 'observers')).length === 0);
    lifecycleSubjects.set(subject, new Set());
    for (const key of ['subscribe', 'Ga']) {
      noOwn(subject, key);
      const original = source(
        resolved(subject, key),
        key === 'subscribe' ? methods.qt.subscribe : methods.Rt.Ga,
        'dispatch-native-n06',
      );
      replace(subject, key, function (this: unknown, ...args: any[]) {
        require(this === subject && args.length === 1);
        const value = args[0];
        const reg = lifecycleRegistrations.find(
          (r) => r.operating && (r.input === subject || (r.index === 2 && subject === takeInput)),
        );
        require(reg);
        if (key === 'subscribe') {
          acquisition();
          require(value === (reg.index === 2 ? reg.take : reg.subscriber));
          if (own(subject, 'hasError') === true) {
            require(own(subject, 'Ys') === true);
            lifecycleErrors.set(subject, own(subject, 'oa'));
          }
          if (reg.index === 2) finalizeChild(value, reg, 'take');
          return control(() => Reflect.apply(original, this, args));
        }
        // Lt.Aa may already have completed this exact prepared subscriber.
        // The following original Ga returns only the canonical closed sentinel.
        require(producerActive && !acquisitionSuspended);
        evidence();
        require(
          value === (reg.index === 2 ? reg.take : reg.subscriber) &&
            lifecycleSubscriptions.has(value) &&
            !reg.registered &&
            !reg.noRegistration,
        );
        if (closed) require(own(value, 'closed') === true && own(subject, 'Ys') === true);
        const result = Reflect.apply(original, this, args);
        if (result === own(own(ns, 'qt'), 'ha')) {
          require(own(subject, 'Ys') === true || own(subject, 'hasError') === true);
          closed = true;
          reg.noRegistration = true;
          lifecycleSubscriptions.get(value)!.children.add(result);
          return result;
        }
        exact(result, subscriptionPrototype);
        source(retain(result, 'Na'), '()=>Olb(this.observers,a)', 'dispatch-native-n06');
        captureSubscription(result, value, 'removal', reg);
        reg.removal = result;
        reg.registered = true;
        lifecycleSubjects.get(subject)!.add(value);
        lifecycleSubscriptions.get(value)!.children.add(result);
        return result;
      });
    }
  }
  function captureLift(value: any, input: any, reg: LifecycleRegistration, take: boolean) {
    const p = constructor(value, lifecycleSources.rnb, subjectPrototype);
    require(retain(value, 'source') === input && retain(value, 'destination') === input);
    for (const key of ['subscribe', 'pipe', 'lift']) noOwn(value, key);
    source(resolved(value, 'subscribe'), methods.qt.subscribe, 'dispatch-native-n06');
    source(resolved(value, 'pipe'), methods.qt.pipe, 'dispatch-native-n06');
    source(resolved(value, 'lift'), lifecycleSources.lift, 'dispatch-native-n06');
    const operator = source(
      retain(value, 'operator'),
      'function(c){try{return a(c,this)}catch(d){this.error(d)}}',
      'dispatch-native-n06',
    );
    const subscribe = fn(own(observablePrototype, 'subscribe'));
    let used = false,
      subscribeArgs: any[];
    replace(value, 'subscribe', function (this: unknown, ...args: any[]) {
      acquisition();
      require(this === value && !used);
      used = true;
      subscribeArgs = args;
      if (take) require(args.length === 1 && args[0] === reg.subscriber && reg.operating);
      reg.subscribing = true;
      try {
        const result = control(() => Reflect.apply(subscribe, this, args));
        require(result === reg.subscriber);
        if (!take) reg.finished = true;
        return result;
      } finally {
        reg.subscribing = false;
      }
    });
    replace(value, 'operator', function (this: unknown, ...args: any[]) {
      acquisition();
      require(reg.subscribing && args.length === 1 && args[0] === input);
      if (take) require(this === reg.subscriber);
      else {
        require(!reg.subscriber);
        reg.subscriber = this;
        captureDestination(this, subscribeArgs, 'destination', reg);
      }
      const previous = reg.operating;
      reg.operating = true;
      try {
        return control(() => Reflect.apply(operator, this, args));
      } finally {
        reg.operating = previous;
      }
    });
    return p;
  }
  function installLifecycle() {
    const sentinel = retain(own(ns, 'qt'), 'ha');
    exact(sentinel, subscriptionPrototype);
    require(
      retain(sentinel, 'closed') === true &&
        retain(sentinel, 'Na') === undefined &&
        retain(sentinel, 'oa') === null &&
        retain(sentinel, 'wa') === null,
    );
    for (const key of Object.keys(methods.ot)) {
      noOwn(sentinel, key);
      retain(sentinel, key);
    }
    for (const key of ['bind', 'call', 'apply'])
      source(
        retain(Function.prototype, key),
        `function ${key}() { [native code] }`,
        'dispatch-native-n09',
      );
    for (const key of ['push', 'indexOf', 'splice', 'slice', 'shift'])
      source(
        retain(Array.prototype, key),
        `function ${key}() { [native code] }`,
        'dispatch-native-n09',
      );
    source(
      retain(Array.prototype, Symbol.iterator),
      'function values() { [native code] }',
      'dispatch-native-n09',
    );
    const nt = proto('zt', lifecycleSources.zt);
    require(Object.getPrototypeOf(nt) === subscriberBase);
    source(own(nt, 'unsubscribe'), lifecycleSources.ntUnsubscribe, 'dispatch-native-n06');
    for (const key of [...Object.keys(methods.ot), ...Object.keys(methods.onb)].filter(
      (key) => key !== 'unsubscribe',
    ))
      noOwn(nt, key);
    for (const key of ['bu', 'Vt', 'xt', 'tt', 'Qlb'] as const)
      original[key] = source(retain(ns, key), lifecycleSources[key], 'dispatch-native-n06');
    original.uA = fn(own(ns, 'uA'));
    source(resolved(subjectPrototype, 'lift'), lifecycleSources.lift, 'dispatch-native-n06');
    const lifetimePrototype = Object.getPrototypeOf(lifetime);
    const ownerSource = Reflect.apply(sourceText, own(lifetimePrototype, 'constructor'), []);
    const viewOwner = ownerSource === lifecycleSources.GOb;
    require(viewOwner || ownerSource === lifecycleSources.WVb);
    if (viewOwner) {
      constructor(lifetime, lifecycleSources.GOb, own(own(ns, 'yx'), 'prototype'));
      getter(lifetimePrototype, 'dg', 'get dg(){return _.Ow(this.Ps)}');
      for (const key of ['Ow', 'YNb', 'ZNb'] as const)
        source(retain(ns, key), lifecycleSources[key], 'dispatch-native-n06');
    } else {
      exact(lifetime, proto('uWb', lifecycleSources.WVb));
      getter(lifetimePrototype, 'dg', 'get dg(){return this.jg}');
      source(retain(ns, 'JNb'), 'function(a){if(a.dg)throw new _.Dw(-205,!1);}');
    }
    noOwn(lifetime, 'dg');
    retain(lifetime, 'dg');
    const ownerRegister = source(
      resolved(lifetime, 'Wc'),
      viewOwner
        ? 'Wc(a){var b=this.Ps;_.YNb(b,a);return()=>_.ZNb(b,a)}'
        : 'Wc(a){_.JNb(this);this.Zpb.push(a);return()=>{var b=this.Zpb.indexOf(a);b!==-1&&this.Zpb.splice(b,1)}}',
    );
    const ownerView = viewOwner ? retain(lifetime, 'Ps') : lifetime;
    if (viewOwner) require(Array.isArray(ownerView));
    const listKey = viewOwner ? '21' : 'Zpb';
    let ownerList = own(ownerView, listKey);
    let replacementList: any;
    let registering = false;
    const ownerListEvidence = () => {
      const currentList = own(ownerView, listKey);
      const destroyed = destroyState!();
      if (!viewOwner && destroyed && currentList !== ownerList && !replacementList) {
        require(Array.isArray(currentList) && currentList.length === 0);
        replacementList = currentList;
      }
      require(
        currentList === ownerList ||
          (destroyed && currentList === (viewOwner ? null : replacementList)) ||
          (registering && viewOwner && ownerList === null && Array.isArray(currentList)),
      );
      if (currentList !== null) {
        require(
          Array.isArray(currentList) && Object.getPrototypeOf(currentList) === Array.prototype,
        );
        for (const key of ['push', 'indexOf', 'splice']) require(!descriptor(currentList, key));
      } else require(viewOwner);
    };
    destroyState = () => {
      const flags = own(ownerView, viewOwner ? '2' : 'jg');
      require(viewOwner ? Number.isInteger(flags) : typeof flags === 'boolean');
      return viewOwner ? (flags & 256) === 256 : flags;
    };
    let destroyObserved = false;
    lifetimeEvidence = () => {
      const destroyed = destroyState!();
      require(!destroyObserved || destroyed);
      if (destroyed) {
        destroyObserved = true;
        closed = true;
      }
      ownerListEvidence();
    };
    replace(
      lifetime,
      'Wc',
      function (this: unknown, ...args: any[]) {
        if (!notifierSubscriber) return Reflect.apply(ownerRegister, this, args);
        acquisition();
        require(this === lifetime && args.length === 1 && !destroyState!());
        const reg = lifecycleRegistrations.find(
          (r) => r.child === notifierSubscriber && r.notifying,
        );
        require(reg && !reg.unregister);
        const callback = fn(args[0]);
        source(callback, 'function () { [native code] }', 'dispatch-native-n09');
        ownerListEvidence();
        registering = true;
        try {
          const result = Reflect.apply(ownerRegister, this, args);
          source(
            result,
            viewOwner
              ? '()=>_.ZNb(b,a)'
              : '()=>{var b=this.Zpb.indexOf(a);b!==-1&&this.Zpb.splice(b,1)}',
          );
          reg.unregister = result;
          lifecycleSubscriptions.get(notifierSubscriber)!.children.add(result);
          ownerListEvidence();
          ownerList = own(ownerView, listKey);
          return result;
        } finally {
          registering = false;
        }
      },
      true,
    );
    original.iM = source(
      retain(ns, 'iM'),
      'function(a){a.wD||a.t$||(a.ha?(a.t$=!0,a.connection.send(_.Th(_.sJd(new _.tJd,_.Th(_.TId(new _.UId,1))))),a.Ha=setTimeout(()=>{a.wD||a.disconnect()},2E4)):a.disconnect())}',
    );
    source(retain(ns, 'TId'), 'function(a,b){return _.Pi(a,1,b)}');
    source(retain(ns, 'sJd'), 'function(a,b){return _.ei(a,4,_.eM,b)}');
    installed('iM', function (this: unknown, ...args: any[]) {
      if (args[0] !== instance) return Reflect.apply(original.iM!, this, args);
      require(this === ns && args.length === 1 && !applicationClosing && closed);
      const wasCleaning = cleaning;
      cleaning = true;
      try {
        if (detached) require(retired && own(instance, 'wD') === true);
        else evidence();
        lifecycleEvidence();
        if (own(instance, 'wD') || own(instance, 't$'))
          return Reflect.apply(original.iM!, this, args);
        require(!closeStarted);
        closeStarted = applicationClosing = true;
        const result = control(() => Reflect.apply(original.iM!, this, args));
        closeTimer = descriptor(instance, 'Ha');
        if (physicalStarted) transportWitness = snapshotPhysical();
        evidence();
        return result;
      } finally {
        applicationClosing = false;
        cleaning = wasCleaning;
        drainDetach();
      }
    });
    installed('Vt', function (this: unknown, ...args: any[]) {
      if (!producerActive || !lifetime) return Reflect.apply(original.Vt!, this, args);
      acquisition();
      require(
        this === ns &&
          args.length === 1 &&
          args[0] === 1 &&
          lifecycleRegistrations.length === 2 &&
          !takeCreated &&
          lifecycleRegistrations[1]!.route,
      );
      takeCreated = true;
      const operator = Reflect.apply(original.Vt!, this, args);
      source(operator, lifecycleSources.mtOperator, 'dispatch-native-n06');
      let used = false;
      return function (this: unknown, ...values: any[]) {
        acquisition();
        require(!used && values.length === 1 && values[0] === own(instance, 'Na'));
        used = true;
        takeInput = values[0];
        captureSubject(takeInput);
        const reg = lifecycleRegistrations[2];
        require(reg);
        takeLift = Reflect.apply(operator, this, values);
        captureLift(takeLift, takeInput, reg, true);
        return takeLift;
      };
    });
    installed('uA', function (this: unknown, ...args: any[]) {
      if (args[0] !== lifetime || (!producerActive && !acquisitionSuspended))
        return Reflect.apply(original.uA!, this, args);
      acquisition();
      const index = lifecycleRegistrations.length;
      require(
        this === ns &&
          args.length === 1 &&
          index < 3 &&
          (index === 0 ? factoryBusy : !factoryBusy) &&
          (index !== 2 || takeCreated),
      );
      const reg: LifecycleRegistration = { index };
      lifecycleRegistrations.push(reg);
      const operator = source(Reflect.apply(original.uA!, this, args), 'c=>c.pipe(_.bu(b))');
      let used = false;
      return function (this: unknown, ...values: any[]) {
        acquisition();
        require(!used && values.length === 1 && !activeCreator);
        used = true;
        reg.input = values[0];
        if (index === 0) captureSubject(reg.input);
        else require(reg.input === (index === 1 ? own(instance, 'Va') : takeLift));
        activeCreator = reg;
        try {
          reg.applying = true;
          const result = Reflect.apply(operator, this, values);
          require(result === reg.lifted);
          return result;
        } finally {
          reg.applying = false;
          activeCreator = undefined;
        }
      };
    });
    installed('bu', function (this: unknown, ...args: any[]) {
      const reg = activeCreator;
      if (!reg) return Reflect.apply(original.bu!, this, args);
      acquisition();
      require(this === ns && args.length === 1 && reg.applying && !reg.notifier);
      const notifier = args[0];
      exact(notifier, observablePrototype);
      absent(notifier, 'source');
      absent(notifier, 'operator');
      reg.notifier = notifier;
      const producer = source(
        retain(notifier, 'ha'),
        'c=>{if(a.dg)c.next();else return a.Wc(c.next.bind(c))}',
      );
      const subscribe = source(resolved(notifier, 'subscribe'), methods.qt.subscribe);
      let used = false;
      replace(notifier, 'subscribe', function (this: unknown, ...values: any[]) {
        acquisition();
        require(
          this === notifier &&
            !used &&
            reg.operating &&
            values.length === 1 &&
            values[0] === reg.child,
        );
        used = true;
        finalizeChild(values[0], reg, 'notifier');
        return control(() => Reflect.apply(subscribe, this, values));
      });
      replace(notifier, 'ha', function (this: unknown, ...values: any[]) {
        acquisition();
        require(
          this === notifier &&
            values.length === 1 &&
            values[0] === reg.child &&
            !notifierSubscriber,
        );
        notifierSubscriber = reg.child;
        reg.notifying = true;
        try {
          return control(() => Reflect.apply(producer, this, values));
        } finally {
          notifierSubscriber = undefined;
          reg.notifying = false;
        }
      });
      const operator = source(
        Reflect.apply(original.bu!, this, args),
        lifecycleSources.mtOperator,
        'dispatch-native-n06',
      );
      let applied = false;
      return function (this: unknown, ...values: any[]) {
        acquisition();
        require(!applied && values.length === 1 && values[0] === reg.input);
        applied = true;
        const result = Reflect.apply(operator, this, values);
        captureLift(result, reg.input, reg, false);
        reg.lifted = result;
        return result;
      };
    });
  }
  if (lifetime) installLifecycle();
  let hjdBusy = false,
    factoryBusy = false,
    configBusy = false;
  installed('PLd', function (this: unknown, ...args: any[]) {
    require(
      !hjdBusy &&
        hjdCount === 0 &&
        bound &&
        args.length === 2 &&
        args[0] === api &&
        args[1] === packet &&
        this === ns,
    );
    hjdBusy = true;
    hjdCount++;
    try {
      checkpoint();
      const result = Reflect.apply(original.PLd!, this, args);
      exact(result, own(ns.zL, 'prototype'));
      ok = result;
      retain(ok, 'fl');
      const witness = captureGeminiNativeWireContent(ns, ok, 'zL');
      okWitness = () => witness(ok);
      checkpoint();
      return result;
    } catch (error) {
      return refused(error);
    } finally {
      hjdBusy = false;
    }
  });
  const get = own(registryPrototype, 'get');
  replace(
    registry,
    'get',
    function (this: unknown, ...args: any[]) {
      require(this === registry && args.length === 0 && cold === 'not-entered' && ok !== undefined);
      cold = 'checking';
      try {
        checkpoint(true);
        const result = Reflect.apply(get, this, args);
        evidence();
        require(result === manager);
        cold = 'await-factory';
        return result;
      } catch (error) {
        return refused(error);
      }
    },
    true,
    'dispatch-native-n13',
  );
  installed('Klb', function (this: unknown, ...args: any[]) {
    require(factoryBusy && !builderEntered && this === ns);
    builderEntered = true;
    evidence();
    // Arguments include provider-owned authentication metadata: delegate them untouched.
    const value = Reflect.apply(original.Klb!, this, args);
    evidence();
    provisionalChannel = value;
    constructor(value, profile.bmb);
    provisionalTransport = own(value, 'ha');
    constructor(provisionalTransport, profile.dt, Object.prototype);
    for (const [owner, keys] of [
      [value, ['open', 'send', 'close']],
      [provisionalTransport, ['connect', 'disconnect', 'Hf', 'uf', 'Di', 'Jh']],
    ] as const)
      for (const key of keys) {
        noOwn(owner, key);
        replace(owner, key, deny);
        provisional.push({ owner, key, descriptor: descriptor(owner, key) });
      }
    return value;
  });
  installed('dKd', function (this: unknown, ...args: any[]) {
    require(
      !factoryBusy &&
        factoryCount === 0 &&
        cold === 'await-factory' &&
        this === ns &&
        args.length === 3 &&
        args[0] === session &&
        args[1] === lifetime,
    );
    factoryBusy = true;
    try {
      idleEvidence(true);
      idleConsumed = true;
      const metadata = object(args[2]);
      require(
        Object.getPrototypeOf(metadata) === Object.prototype &&
          Reflect.ownKeys(metadata).length === 1,
      );
      const xR = descriptor(metadata, 'zS');
      require(xR && 'value' in xR);
      retain(metadata, 'zS'); // Its authentication-bearing contents stay opaque.
      checkpoint(true);
      require(same(xR, descriptor(metadata, 'zS')));
      cold = 'spent';
      factoryCount++;
      const result = Reflect.apply(original.dKd!, this, args);
      evidence();
      require(same(xR, descriptor(metadata, 'zS')));
      captureGraph(result);
      checkpoint(true);
      return result;
    } catch (error) {
      return refused(error);
    } finally {
      factoryBusy = false;
    }
  });
  installed('LJd', function (this: unknown, ...args: any[]) {
    require(!configBusy && configCount === 0 && connects === 1, n15(
      'dispatch-native-n15-config-state',
    ));
    require(this === ns, n15('dispatch-native-n15-config-receiver'));
    require(args.length === 5, n15('dispatch-native-n15-config-arity'));
    require(args[0] === instance, n15('dispatch-native-n15-argument-instance'));
    require(args[1] === ok, n15('dispatch-native-n15-argument-ok'));
    require(args[2] === requestSource, n15('dispatch-native-n15-argument-source'));
    require(args[3] === approved.modeId, n15('dispatch-native-n15-argument-mode'));
    require(args[4] === approved.clientTurnId, n15('dispatch-native-n15-argument-turn'));
    configBusy = true;
    configCount++;
    try {
      checkpoint(true);
      inConfig = true;
      let result: unknown;
      try {
        result = Reflect.apply(original.LJd!, this, args);
      } catch (error) {
        return refused(error, n15('dispatch-native-n15-unknown-gjd'));
      }
      inConfig = false;
      require(config !== undefined && query === undefined, n15('dispatch-native-n15-config-01'));
      seed = own(instance, 'Aa');
      exact(seed, own(ns.CI, 'prototype'));
      retain(seed, 'fl');
      let witness: ReturnType<typeof captureGeminiNativeWireContent>;
      try {
        witness = captureGeminiNativeWireContent(
          ns,
          seed,
          'CI',
          diagnostic === 'dispatch-native-n15',
        );
      } catch (error) {
        return refused(error, n15('dispatch-native-n15-unknown-content'));
      }
      seedWitness = () => witness(seed);
      aaSlot = descriptor(instance, 'Aa');
      checkpoint(true);
      try {
        assertGeminiNativeConfiguration(
          ns,
          config,
          ok,
          approved,
          requestSource,
          diagnostic === 'dispatch-native-n15',
        );
      } catch (error) {
        return refused(error, n15('dispatch-native-n15-unknown-configuration'));
      }
      return result;
    } catch (error) {
      return refused(error);
    } finally {
      inConfig = false;
      configBusy = false;
    }
  });
  function receiveSubject(subject: any, key: string, method: Call, receiver: unknown, args: any[]) {
    require(receiver === subject);
    const root = subject === own(connection, 'Ki');
    const message = root && key === 'next' && own(args[0], 'eventType') === 'channel_message';
    const data = key === 'next' && (message || subject === own(instance, 'tB'));
    const outer = message;
    if (data) {
      let correlated = true;
      try {
        require(
          message
            ? args.length === 1 &&
                Reflect.ownKeys(args[0]).length === 2 &&
                pendingEnvelope &&
                own(args[0], 'message') === pendingEnvelope.envelope
            : envelopeDispatch && pendingEnvelope?.kind === 'response',
        );
      } catch (error) {
        correlated = false;
        observe(() => {
          throw error;
        });
      }
      if (!correlated) return;
    }
    if (outer) require(!sourceDispatchDepth && !envelopeDispatch);
    if (data && !root) {
      require(!responseSeen);
      responseSeen = true;
    }
    sourceDispatchDepth++;
    if (outer) envelopeDispatch = true;
    let admitted = true;
    try {
      if (data && !root) {
        // Unsupported provider lifecycle features must never acquire an unowned subscriber.
        try {
          assertGeminiNativeLifecycleProfile(ns, args[0]);
        } catch (error) {
          admitted = false;
          observe(() => {
            throw error;
          });
        }
      }
      observe(() => {
        require(!failed && args.length === (key === 'complete' ? 0 : 1));
        if (message) {
          const event = args[0];
          require(
            own(event, 'eventType') === 'channel_message' &&
              Reflect.ownKeys(event).length === 2 &&
              pendingEnvelope &&
              own(event, 'message') === pendingEnvelope.envelope,
          );
          checkpoint(false, !nativeTerminal);
          if (pendingEnvelope.kind === 'close') {
            require(!nativeClosed);
            try {
              receiveCallback(() => observer.control((pendingEnvelope as { field: 4 | 5 }).field));
            } finally {
              nativeClosed = closed = true;
              if (pendingEnvelope.field === 4) beginRetirement(false);
            }
          }
        } else if (root && key === 'next') {
          if (own(args[0], 'eventType') === 'channel_error') {
            require(
              Reflect.ownKeys(args[0]).every((key) =>
                ['eventType', 'error', 'errorDetail'].includes(String(key)),
              ),
            );
            exact(own(args[0], 'error'), own(own(ns, 'ZJ'), 'prototype'));
            nativeError = nativeClosed = cleanupStarted = closed = true;
            fail();
          }
          require(
            nativeClosed &&
              own(args[0], 'eventType') === 'channel_close' &&
              Reflect.ownKeys(args[0]).length === 1,
          );
        } else if (subject === own(instance, 'tB') && key === 'next') {
          require(envelopeDispatch && pendingEnvelope?.kind === 'response' && admitted);
          const previous = aaSlot;
          require(previous && own(instance, 'Aa') !== previous.value);
          aaWitness?.();
          seedWitness?.();
          const recoveryControl = receipt.recoveryControl();
          const normalized = recoveryControl
            ? (receipt.forwardRecovery(args[0], own(instance, 'Aa')), undefined)
            : receipt.normalize(args[0], own(instance, 'Aa'));
          const nextSlot = descriptor(instance, 'Aa');
          require(nextSlot && same({ ...previous, value: nextSlot.value }, nextSlot));
          aaSlot = nextSlot;
          const aa = nextSlot.value,
            backing = own(aa, 'fl');
          const witness = captureGeminiNativeWireContent(ns, aa, 'CI');
          aaWitness = () => {
            require(own(aa, 'fl') === backing);
            witness(aa);
          };
          checkpoint(false, !nativeTerminal);
          // Source recovery may unwind normally, but cannot produce accepted output.
          require(!recoveryControl && normalized);
          projectingFrame = normalized;
          receiveCallback(() => observer.next(normalized));
          if (normalized.observation.completed) {
            receipt.terminal();
            nativeTerminal = closed = true;
          }
        } else if (key === 'error') {
          fail();
        } else {
          require(!data && (nativeClosed || key === 'complete'));
          checkpoint(false, false);
        }
      });
      if (data && !root) {
        try {
          assertGeminiNativeLifecycleProfile(ns, args[0]);
        } catch (error) {
          admitted = false;
          observe(() => {
            throw error;
          });
        }
      }
      if (!admitted) return;
      const wasCleaning = cleaning;
      if (nativeClosed) cleaning = true;
      if (key === 'error' && !own(subject, 'Ys')) lifecycleErrors.set(subject, args[0]);
      try {
        const result = Reflect.apply(method, receiver, args);
        if (data && !root) responseForwarded = true;
        observe(verifyReceiveIntegrity);
        if (outer && (responseForwarded || pendingEnvelope?.kind === 'close')) {
          observe(() => {
            verifyReceiveIntegrity();
            receipt.finishEnvelope();
            pendingEnvelope = undefined;
            receiveUnwound = true;
          });
        }
        return result;
      } finally {
        cleaning = wasCleaning;
      }
    } finally {
      if (data && !root) projectingFrame = undefined;
      if (outer) envelopeDispatch = false;
      sourceDispatchDepth--;
    }
  }
  function captureGraph(result: unknown) {
    const p = constructor(result, profile.IHd, Object.prototype);
    pinMethods(p, methods.IHd, 'dispatch-native-n07');
    instance = object(result);
    connection = own(instance, 'connection');
    const cp = Object.getPrototypeOf(object(connection)),
      base = Object.getPrototypeOf(cp);
    const codec = Reflect.apply(sourceText, fn(own(cp, 'constructor')), []);
    require(codec === profile.aFd || codec === profile.bFd);
    constructor(connection, codec, base);
    source(own(base, 'constructor'), profile.$Ed, 'dispatch-native-n07');
    for (const key of Reflect.ownKeys(base))
      retained.push({ owner: base, key, descriptor: descriptor(base, key) });
    require(Object.getPrototypeOf(base) === Object.prototype);
    pinMethods(base, methods.connection, 'dispatch-native-n07');
    for (const key of Object.keys(methods.connection)) {
      noOwn(connection, key);
      retain(connection, key);
      noOwn(cp, key);
      retain(cp, key);
    }
    absent(connection, 'bfc');
    channel = own(connection, 'uq');
    require(builderEntered && channel === provisionalChannel);
    const channelPrototype = constructor(channel, profile.bmb, eventTargetPrototype);
    require(!descriptor(channel, eventMarker) && !descriptor(channelPrototype, eventMarker));
    retain(channel, eventMarker);
    retain(channelPrototype, eventMarker);
    source(
      own(channelPrototype, 'open'),
      'function(){this.ha.wa=this.oa;this.Da&&(this.ha.Ab=!0);this.ha.connect(this.wa,this.ka||void 0)}',
      'dispatch-native-n07',
    );
    source(
      own(channelPrototype, 'close'),
      'function(){this.ha.disconnect()}',
      'dispatch-native-n07',
    );
    source(
      own(channelPrototype, 'send'),
      'function(a){var b=this.ha;if(typeof a==="string"){var c={};c.__data__=a;a=c}else this.Aa&&(c={},c.__data__=_.Wj(a),a=c);b.oa.push(new ulb(b.Ih++,a));b.fU==3&&tlb(b)}',
      'dispatch-native-n07',
    );
    transport = own(channel, 'ha');
    require(transport === provisionalTransport);
    const tp = constructor(transport, profile.dt, Object.prototype);
    source(own(tp, 'connect'), profile.dtConnect, 'dispatch-native-n07');
    source(own(tp, 'disconnect'), profile.dtDisconnect, 'dispatch-native-n07');
    for (const key of [
      'Da',
      'Gb',
      'Ih',
      'oa',
      'ka',
      'Ja',
      'Va',
      'kb',
      'Sa',
      'Za',
      'Ha',
      'Wa',
      'Pc',
      'Eb',
      'Yb',
      'Ae',
    ])
      require(descriptor(transport, key)?.writable === true);
    require(descriptor(tp, 'fU')?.writable === true);
    for (const [key, value] of Object.entries({
      zg: 5000,
      Fh: 10000,
      wh: 2,
      Cf: 20000,
      Lg: false,
      Ac: false,
      Zb: false,
      Ab: true,
      xd: true,
      Ph: false,
      Fd: true,
      Wd: 1000,
      lPb: undefined,
      Uf: false,
      Wi: undefined,
      Sd: undefined,
      Kd: undefined,
    }))
      require(retain(transport, key) === value);
    for (const [key, text] of Object.entries({
      wD: 'function(){return this.fU==0}',
      isActive: 'function(){return!!this.wa&&this.wa.isActive(this)}',
    })) {
      source(own(tp, key), text, 'dispatch-native-n07');
      noOwn(transport, key);
      retain(transport, key);
    }
    exact(own(connection, 'Qj'), eventPrototype);
    for (const key of ['listen', 'removeAll']) {
      noOwn(own(connection, 'Qj'), key);
      retain(own(connection, 'Qj'), key);
    }
    handler = retain(channel, 'oa');
    constructor(handler, profile.hmb);
    require(retain(handler, 'ha') === channel);
    source(resolved(handler, 'bkd'), physicalSources.xjd, 'dispatch-native-n07');
    source(
      resolved(handler, 'akd'),
      'function(a){this.ha.dispatchEvent(new Mlb(a))}',
      'dispatch-native-n07',
    );
    source(
      resolved(handler, 'Zjd'),
      'function(){this.ha.dispatchEvent("Td")}',
      'dispatch-native-n07',
    );
    source(resolved(channel, 'listen'), eventMethods.listen, 'dispatch-native-n07');
    source(resolved(channel, 'm4'), eventMethods.m4, 'dispatch-native-n07');
    source(resolved(channel, 'oqa'), eventMethods.oqa, 'dispatch-native-n07');
    const eventDispatch = source(
      resolved(channel, 'dispatchEvent'),
      eventMethods.dispatchEvent,
      'dispatch-native-n07',
    );
    if (lifetime)
      replace(channel, 'dispatchEvent', function (this: unknown, ...args: any[]) {
        require(this === channel);
        return Reflect.apply(eventDispatch, this, args);
      });
    source(resolved(channel, 'Sab'), eventMethods.Sab, 'dispatch-native-n07');
    require(retain(channel, 'R0c') === null && retain(channel, 'Dff') === channel);
    const listeners = retain(retain(channel, 'Mpa'), 'listeners');
    const eventHandler = retain(connection, 'Qj');
    const registrations = own(eventHandler, 'wa');
    const events = ['Sd', 'Td', 'Vd', 'Ud'].map((type) => {
      const list = own(listeners, type);
      require(Array.isArray(list) && list.length === 1);
      const record = own(list, '0');
      require(
        own(record, 'src') === channel &&
          own(record, 'capture') === false &&
          own(record, 'r8a') === false &&
          own(record, 'removed') === false,
      );
      fn(own(record, 'listener'));
      const key = String(own(record, 'key'));
      require(own(registrations, key) === record);
      return {
        type,
        list,
        record,
        key,
        fields: Reflect.ownKeys(record).map((key) => ({
          owner: record,
          key,
          descriptor: descriptor(record, key),
        })),
      };
    });
    require(Reflect.ownKeys(registrations).length === 4 && Reflect.ownKeys(listeners).length === 4);
    eventEvidence = () => {
      const removed =
        (cleaning || retired) &&
        cleanupStarted &&
        events.every((e) => own(e.record, 'removed') === true);
      const activeRegistrations = own(eventHandler, 'wa');
      if (removed) {
        require(Reflect.ownKeys(activeRegistrations).length === 0 &&
          Reflect.ownKeys(listeners).length === 0, n15('dispatch-native-n15-events-01'));
        for (const e of events) {
          require(e.list.length === 0, n15('dispatch-native-n15-events-02'));
          for (const key of ['listener', 'proxy', 'src', 'handler'])
            require(own(e.record, key) === null, n15('dispatch-native-n15-events-03'));
        }
      } else {
        require(activeRegistrations === registrations &&
          Reflect.ownKeys(registrations).length === 4 &&
          Reflect.ownKeys(listeners).length === 4, n15('dispatch-native-n15-events-04'));
        for (const e of events) {
          require(own(listeners, e.type) === e.list &&
            e.list.length === 1 &&
            own(e.list, '0') === e.record &&
            own(registrations, e.key) === e.record, n15('dispatch-native-n15-events-05'));
          for (const r of e.fields)
            require(same(r.descriptor, descriptor(r.owner, r.key)), n15(
              'dispatch-native-n15-events-06',
            ));
        }
      }
    };
    require(
      own(transport, 'lPb') === undefined &&
        own(transport, 'Uf') === false &&
        own(transport, 'Da') === null &&
        own(transport, 'Sa') === '',
    );
    require(own(transport, 'Ih') === 0 && own(transport, 'Gb') === 0 && own(tp, 'fU') === 1);
    noOwn(transport, 'fU');
    const active = retain(transport, 'Aa');
    const activePrototype = constructor(
      active,
      'function(a){this.Aa=a||10;_.fa.PerformanceNavigationTiming?(a=_.fa.performance.getEntriesByType("navigation"),a=a.length>0&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(_.fa.chrome&&_.fa.chrome.loadTimes&&_.fa.chrome.loadTimes()&&_.fa.chrome.loadTimes().wasFetchedViaSpdy);this.wa=a?this.Aa:1;this.ha=null;this.wa>1&&(this.ha=new Set);this.ka=null;this.oa=[]}',
      Object.prototype,
    );
    source(
      own(activePrototype, 'cancel'),
      'function(){this.oa=wlb(this);if(this.ka)this.ka.cancel(),this.ka=null;else if(this.ha&&this.ha.size!==0){for(let a of this.ha.values())a.cancel();this.ha.clear()}}',
      'dispatch-native-n07',
    );
    noOwn(active, 'cancel');
    retain(active, 'cancel');
    require(retain(active, 'Aa') === 10);
    initialActiveCapacity = own(active, 'wa');
    require(initialActiveCapacity === 1 || initialActiveCapacity === 10);
    source(retain(globalThis, 'Set'), 'function Set() { [native code] }', 'dispatch-native-n09');
    for (const key of ['add', 'has', 'delete', 'clear', 'values'])
      source(
        retain(Set.prototype, key),
        `function ${key}() { [native code] }`,
        'dispatch-native-n09',
      );
    retained.push({
      owner: Set.prototype,
      key: 'size',
      descriptor: descriptor(Set.prototype, 'size'),
    });
    const activeSet = own(active, 'ha');
    if (activeSet !== null) {
      exact(activeSet, Set.prototype);
      noOwn(activeSet, 'size');
      retain(activeSet, 'size');
      retained.push({
        owner: Set.prototype,
        key: 'size',
        descriptor: descriptor(Set.prototype, 'size'),
      });
    }

    object(own(transport, 'oa')); // Original amb/cmb may replace this queue with a same-entry concatenation.
    retain(transport, 'ha');
    const logger = own(transport, 'ha');
    object(logger);
    source(resolved(logger, 'debug'), 'function(){}', 'dispatch-native-n07');
    retain(instance, 'Ga');
    const subscription = own(instance, 'Ga');
    if (lifetime) {
      require(
        lifecycleRegistrations[0]?.subscriber === subscription &&
          lifecycleRegistrations[0]?.input === own(connection, 'Ki'),
      );
      cleanupEvidence = lifecycleEvidence;
    } else {
      object(subscription);
      exact(subscription, subscriberPrototype);
      source(resolved(subscription, 'unsubscribe'), methods.onb.unsubscribe, 'dispatch-native-n07');
      for (const key of [...Object.keys(methods.onb), ...Object.keys(methods.ot)]) {
        noOwn(subscription, key);
        retain(subscription, key);
      }
      // Only the directly subscribed initial graph is proved for retirement in phase1.
      // Lifecycle/operator subscriptions are quarantined until their owning phase is modeled.
      const teardownList = own(subscription, 'wa');
      const teardown =
        Array.isArray(teardownList) && teardownList.length === 1
          ? own(teardownList, '0')
          : undefined;
      const directSubscription =
        teardown && Object.getPrototypeOf(teardown) === subscriptionPrototype;
      if (directSubscription) {
        source(own(teardown, 'Na'), '()=>Olb(this.observers,a)', 'dispatch-native-n07');
        retain(teardown, 'Na');
        for (const key of Object.keys(methods.ot)) {
          noOwn(teardown, key);
          retain(teardown, key);
        }
        retain(subscription, 'Na');
        retain(subscription, 'oa');
        require(own(subscription, 'Na') === undefined && own(subscription, 'oa') === null);
        retain(teardown, 'wa');
        require(own(teardown, 'wa') === null);
      }
      cleanupEvidence = () => {
        require(directSubscription);
        for (const item of [subscription, teardown]) {
          require(
            own(item, 'closed') === false || (cleanupStarted && own(item, 'closed') === true),
          );
        }
        require(
          own(subscription, 'Ys') === false || (cleanupStarted && own(subscription, 'Ys') === true),
        );
        require(own(subscription, 'wa') === teardownList || own(subscription, 'wa') === null);
        require(teardownList.length === 1 && own(teardownList, '0') === teardown);
        require(own(teardown, 'oa') === subscription || own(teardown, 'oa') === null);
        for (const subject of [
          own(instance, 'tB'),
          own(instance, 'Da'),
          own(instance, 'ka'),
          own(connection, 'uC'),
        ]) {
          const observers = own(subject, 'observers');
          require(Array.isArray(observers) && observers.length === 0);
        }
        const observers = own(own(connection, 'Ki'), 'observers');
        require(
          Array.isArray(observers) &&
            (observers.length === 0 ||
              (observers.length === 1 && own(observers, '0') === subscription)),
        );
      };
    }
    queue = own(instance, 'oa');
    require(
      Array.isArray(queue) &&
        Object.getPrototypeOf(queue) === Array.prototype &&
        queue.length === 0 &&
        !descriptor(queue, 'push'),
    );
    require(own(instance, 'wa') === 0 && !descriptor(instance, 'Aa'));
    require(
      !descriptor(instance, 'Ha') && !descriptor(p, 'Ha') && !descriptor(Object.prototype, 'Ha'),
    );
    if (!lifetime) retain(instance, 'Ha');
    retain(p, 'Ha');
    retain(Object.prototype, 'Ha');
    for (const [a, b] of [
      ['Va', 'tB'],
      ['Sa', 'ka'],
      ['Na', 'Da'],
      ['s1', 'Ki'],
      ['connectedObs', 'uC'],
    ]) {
      const owner = a === 's1' || a === 'connectedObs' ? connection : instance;
      const subject = own(owner, a!);
      if (lifetime && a === 'connectedObs') lifecycleSubjects.set(subject, new Set());
      require(subject === own(owner, b!));
      exact(subject, a === 'connectedObs' ? behaviorPrototype : subjectPrototype);
      retain(owner, a!);
      retain(owner, b!);
      retain(subject, 'observers');
      require(
        own(subject, 'closed') === false &&
          own(subject, 'Ys') === false &&
          own(subject, 'hasError') === false &&
          own(subject, 'oa') === null,
      );
      for (const key of ['subscribe', 'pipe', 'Da', 'ha', 'Ga', 'Aa', 'ka', 'getValue', 'value']) {
        if (
          lifetime &&
          a !== 'connectedObs' &&
          lifecycleSubjects.has(subject) &&
          (key === 'subscribe' || key === 'Ga')
        )
          continue;
        noOwn(subject, key);
        retain(subject, key);
      }
      for (const key of ['next', 'error', 'complete']) {
        noOwn(subject, key);
        const method = fn(own(Object.getPrototypeOf(subject), key) ?? own(subjectPrototype, key));
        replace(subject, key, function (this: unknown, ...args: any[]) {
          if (!cleaning && opening) {
            require(this === subject);
            const connected =
              subject === own(connection, 'uC') &&
              key === 'next' &&
              args.length === 1 &&
              args[0] === true;
            const opened =
              subject === own(connection, 'Ki') &&
              key === 'next' &&
              args.length === 1 &&
              own(args[0], 'eventType') === 'channel_open' &&
              Reflect.ownKeys(args[0]).length === 1;
            const flushed =
              subject === own(instance, 'Da') &&
              key === 'next' &&
              args.length === 0 &&
              sentMessages === 2;
            require(connected || opened || flushed);
            checkpoint();
            if (opened) flushing = true;
            try {
              const value = Reflect.apply(method, this, args);
              checkpoint();
              return value;
            } finally {
              if (opened) flushing = false;
            }
          }
          if (
            lifetime &&
            physicalStarted &&
            !opening &&
            subject !== own(connection, 'uC') &&
            (sourceDispatchDepth || !cleaning)
          )
            return receiveSubject(subject, key, method, this, args);
          require(cleaning && this === subject);
          require(
            own(subject, 'closed') === false &&
              ((own(subject, 'hasError') === false && own(subject, 'oa') === null) ||
                (lifecycleErrors.has(subject) &&
                  own(subject, 'hasError') === true &&
                  own(subject, 'Ys') === true &&
                  own(subject, 'oa') === lifecycleErrors.get(subject))) &&
              typeof own(subject, 'Ys') === 'boolean',
          );
          require(
            key === 'error' && lifetime && subject === own(instance, 'tB')
              ? args.length === 1
              : key === 'complete'
                ? args.length === 0
                : key === 'next' &&
                  args.length === 1 &&
                  (subject === own(connection, 'uC')
                    ? args[0] === false
                    : subject === own(instance, 'ka') && retiring
                      ? args[0] === fatalEvent
                      : subject === own(connection, 'Ki') &&
                        ((own(args[0], 'eventType') === 'channel_close' &&
                          Reflect.ownKeys(args[0]).length === 1) ||
                          (retiring &&
                            fatal &&
                            own(args[0], 'eventType') === 'channel_error' &&
                            Reflect.ownKeys(args[0]).length === 2))),
          );
          if (retiring && subject === own(connection, 'Ki') && key === 'next') {
            if (own(args[0], 'eventType') === 'channel_error') {
              const error = own(args[0], 'error');
              exact(error, own(own(ns, 'ZJ'), 'prototype'));
              require(own(error, 'Vf') === 4 && fatalEvent === undefined);
              fatalEvent = error;
            } else fatalEvent = undefined;
          }
          checkpoint(false, false);
          if (key === 'error' && !own(subject, 'Ys')) lifecycleErrors.set(subject, args[0]);
          const value = Reflect.apply(method, this, args);
          checkpoint(false, false);
          return value;
        });
      }
    }
    if (lifetime) {
      for (const key of ['subscribe', 'Ga']) replace(own(connection, 'uC'), key, deny);
      for (const subject of [own(instance, 'tB'), own(instance, 'Da'), own(instance, 'ka')])
        captureSubject(subject);
    }
    require(own(own(connection, 'uC'), 'Pm') === false);
    const serializers: Record<string, Call> = {};
    for (const key of ['NTa', 'FCa']) {
      const expected =
        codec === profile.aFd
          ? key === 'FCa'
            ? 'e=>e.serialize()'
            : 'e=>_.Th(_.Lo(c,(0,_.be)(e)))'
          : key === 'FCa'
            ? 'f=>_.Tg(c(f))'
            : 'f=>{f=typeof f==="string"?_.Ck(f):f;return d(f)}';
      serializers[key] = source(retain(connection, key), expected, 'dispatch-native-n07');
      replace(
        connection,
        key,
        key === 'FCa'
          ? deny
          : function (this: unknown, ...args: any[]) {
              require(
                this === connection &&
                  args.length === 1 &&
                  lifetime &&
                  logicalAttempt &&
                  !decoding &&
                  !sourceDispatchDepth &&
                  !pendingEnvelope &&
                  !receipt.pending() &&
                  activeCallback &&
                  physicalDepth > 0,
              );
              checkpoint(false, !nativeTerminal);
              decoding = true;
              try {
                const value = Reflect.apply(serializers.NTa!, this, args);
                observe(() => {
                  require(!seenEnvelopes.has(object(value)));
                  receiveEvidence();
                  pendingEnvelope = receipt.capture(value);
                  responseSeen = responseForwarded = receiveUnwound = false;
                  seenEnvelopes.add(value);
                  checkpoint(false, !nativeTerminal);
                });
                return value;
              } catch (error) {
                observe(() => {
                  throw error;
                });
                throw error;
              } finally {
                decoding = false;
              }
            },
      );
      const r = retained.find((v) => v.owner === connection && v.key === key)!;
      r.descriptor = descriptor(connection, key);
    }
    for (const key of ['Hf', 'uf', 'Di', 'Jh']) {
      noOwn(transport, key);
      fn(own(tp, key));
      replace(transport, key, deny);
    }
    for (const [owner, key] of [
      [instance, 'thc'],
      [connection, 'send'],
      [channel, 'send'],
    ] as const) {
      noOwn(owner, key);
      replace(owner, key, deny);
    }
    installPhysical(tp, base, channelPrototype, serializers.FCa!);
    noOwn(instance, 'connect');
    const originalConnect = fn(own(p, 'connect'));
    replace(
      instance,
      'connect',
      function (this: unknown, ...args: any[]) {
        require(this === instance && args.length === 0 && !inConnect && connects === 0);
        inConnect = true;
        connects++;
        try {
          if (lifetime)
            require(
              lifecycleRegistrations.length === 3 &&
                lifecycleRegistrations.every(
                  (r) => r.finished && r.registered && !own(r.subscriber, 'closed'),
                ) &&
                lifecycleRegistrations[1]!.route,
            );
          checkpoint(true);
          const value = Reflect.apply(originalConnect, this, args);
          checkpoint(true);
          return value;
        } catch (error) {
          return refused(error);
        } finally {
          inConnect = false;
        }
      },
      false,
      'dispatch-native-n20',
    );
    for (const [owner, key] of [
      [connection, 'connect'],
      [channel, 'open'],
      [transport, 'connect'],
    ] as const) {
      noOwn(owner, key);
      const method = fn(own(Object.getPrototypeOf(owner), key) ?? own(base, key));
      let used = false;
      replace(owner, key, function (this: unknown, ...args: any[]) {
        require(inConnect && !used && this === owner);
        used = true;
        if (owner === transport) handlerOpened = true;
        checkpoint(true);
        const value = Reflect.apply(method, this, args);
        if (owner === transport) networkScheduled = true;
        checkpoint(true);
        return value;
      });
    }
    for (const [owner, key] of [
      [instance, 'disconnect'],
      [connection, 'disconnect'],
      [channel, 'close'],
      [transport, 'disconnect'],
    ] as const) {
      noOwn(owner, key);
      const method = fn(own(Object.getPrototypeOf(owner), key) ?? own(base, key));
      replace(owner, key, function (this: unknown, ...args: any[]) {
        if (lifetime && owner === instance && closed) cleanupStarted = true;
        const retainedCleanup = lifetime && owner === instance && closed && !cleaning;
        if (retainedCleanup) {
          cleaning = cleanupStarted = true;
        }
        try {
          if (owner === transport && !cleaning && activeCallback) {
            require(own(transport, 'fU') === 3 && own(transport, 'ka') === activeCallback);
            beginRetirement(false);
          }
          require(cleaning && this === owner && args.length === 0);
          checkpoint(false, false);
          const terminal = owner === transport && physicalStarted;
          if (terminal) {
            require(!constructing);
            constructing = 'terminate';
            physicalDepth++;
          }
          let value: unknown;
          try {
            value = Reflect.apply(method, this, args);
          } finally {
            if (terminal) {
              constructing = undefined;
              physicalDepth--;
            }
          }
          checkpoint(false, false);
          if (retainedCleanup) {
            retirementEvidence();
            retired = true;
          }
          return value;
        } finally {
          if (retainedCleanup) cleaning = false;
        }
      });
    }
    replace(
      queue,
      'push',
      function (this: unknown, ...args: any[]) {
        require(!queueBusy, n15('dispatch-native-n15-queue-state'));
        require(this === queue, n15('dispatch-native-n15-queue-receiver'));
        require(args.length === 1, n15('dispatch-native-n15-queue-arity'));
        require(connects === 1, n15('dispatch-native-n15-queue-state'));
        queueBusy = true;
        try {
          const value = args[0];
          let kind: ReturnType<typeof readGeminiNativeSendKind>;
          try {
            kind = readGeminiNativeSendKind(ns, value, diagnostic === 'dispatch-native-n15');
          } catch (error) {
            return refused(error, n15('dispatch-native-n15-unknown-kind'));
          }
          require(inConfig
            ? kind === 'configuration' && !config && !query
            : kind === 'query' && config !== undefined && !query && configCount === 1, n15(
            'dispatch-native-n15-queue-order',
          ));
          if (inConfig) {
            seed = own(instance, 'Aa');
            exact(seed, own(ns.CI, 'prototype'));
            retain(seed, 'fl');
            let witness: ReturnType<typeof captureGeminiNativeWireContent>;
            try {
              witness = captureGeminiNativeWireContent(
                ns,
                seed,
                'CI',
                diagnostic === 'dispatch-native-n15',
              );
            } catch (error) {
              return refused(error, n15('dispatch-native-n15-unknown-content'));
            }
            seedWitness = () => witness(seed);
          }
          let incoming: ReturnType<typeof captureGeminiNativeWireContent>;
          try {
            incoming = captureGeminiNativeWireContent(
              ns,
              value,
              'tJd',
              diagnostic === 'dispatch-native-n15',
            );
          } catch (error) {
            return refused(error, n15('dispatch-native-n15-unknown-content'));
          }
          const backing = descriptor(value, 'fl');
          const previousWitness = inConfig ? configWitness : queryWitness;
          const incomingWitness = () => {
            previousWitness?.();
            require(same(backing, descriptor(value, 'fl')), n15('dispatch-native-n15-queue-02'));
            incoming(value);
          };
          if (inConfig) configWitness = incomingWitness;
          else queryWitness = incomingWitness;
          checkpoint(true);
          if (inConfig) {
            try {
              assertGeminiNativeConfiguration(
                ns,
                value,
                ok,
                approved,
                requestSource,
                diagnostic === 'dispatch-native-n15',
              );
            } catch (error) {
              return refused(error, n15('dispatch-native-n15-unknown-configuration'));
            }
            config = value;
            retain(config, 'fl');
            let witness: ReturnType<typeof captureGeminiNativeWireContent>;
            try {
              witness = captureGeminiNativeWireContent(
                ns,
                value,
                'tJd',
                diagnostic === 'dispatch-native-n15',
              );
            } catch (error) {
              return refused(error, n15('dispatch-native-n15-unknown-content'));
            }
            configWitness = () => witness(config);
          } else {
            require(own(instance, 'wa') === 1 && queryCount === 0, n15(
              'dispatch-native-n15-queue-03',
            ));
            queryCount++;
            query = value;
            retain(query, 'fl');
            let witness: ReturnType<typeof captureGeminiNativeWireContent>;
            try {
              witness = captureGeminiNativeWireContent(
                ns,
                value,
                'tJd',
                diagnostic === 'dispatch-native-n15',
              );
            } catch (error) {
              return refused(error, n15('dispatch-native-n15-unknown-content'));
            }
            queryWitness = () => witness(query);
          }
          let result: unknown;
          try {
            result = Reflect.apply(push, queue, args);
          } catch (error) {
            return refused(error, n15('dispatch-native-n15-unknown-push'));
          }
          checkpoint(true);
          return result;
        } catch (error) {
          return refused(error);
        } finally {
          queueBusy = false;
        }
      },
      true,
      'dispatch-native-n15',
    );
  }
  function list(value: unknown): any[] {
    require(Array.isArray(value) && Object.getPrototypeOf(value) === Array.prototype);
    require(own(value, 'length') <= 4);
    const result: any[] = [];
    for (let i = 0; i < value.length; i++) result.push(own(value, String(i)));
    return result;
  }
  function activeRequests(): any[] {
    const active = own(transport, 'Aa');
    const single = own(active, 'ka'),
      set = own(active, 'ha');
    if (set === null) return single === null ? [] : [single];
    require(single === null && Object.getPrototypeOf(set) === Set.prototype);
    for (const key of ['size', 'add', 'has', 'delete', 'clear', 'values']) noOwn(set, key);
    const size = Reflect.apply(fn(descriptor(Set.prototype, 'size')?.get), set, []);
    require(size <= 4);
    return Array.from(Reflect.apply(Set.prototype.values, set, []));
  }
  function checkEntry(entry: unknown) {
    const retainedMap = maps.get(object(entry));
    require(retainedMap &&
      own(entry, 'mapId') === retainedMap.mapId &&
      own(entry, 'map') === retainedMap.map &&
      own(entry, 'context') === null, 'dispatch-native-n20');
    require(Reflect.ownKeys(retainedMap.map).length === 1 &&
      own(retainedMap.map, '__data__') === retainedMap.data, 'dispatch-native-n20');
  }
  function checkRequest(request: any) {
    const r = requests.get(request);
    require(r &&
      own(request, 'Aa') === transport &&
      own(request, 'oa') === r.rid &&
      own(request, 'Yc') === r.sid &&
      Object.getPrototypeOf(request) === r.prototype, 'dispatch-native-n20');
    require(own(request, 'Za') === r.batchOwner, 'dispatch-native-n20');
    const batch = list(own(request, 'Za'));
    require(batch.length === r.batch.length &&
      batch.every((v, i) => v === r.batch[i]), 'dispatch-native-n20');
    batch.forEach(checkEntry);
    checkBackend?.(request);
  }
  function physicalEvidence() {
    require(own(transport, 'Sa') === protocolSid ||
      (activeCallback && opening), 'dispatch-native-n20');
    require(own(transport, 'Ih') === maps.size &&
      maps.size <= (closeFrame ? 3 : 2), 'dispatch-native-n20');
    for (const entry of maps.keys()) checkEntry(entry);
    for (const request of requests.keys()) checkRequest(request);
    list(own(transport, 'oa')).forEach(checkEntry);
    list(own(own(transport, 'Aa'), 'oa')).forEach(checkEntry);
    if (own(transport, 'Ae') !== null) list(own(transport, 'Ae')).forEach(checkEntry);
    for (const request of activeRequests())
      require(requests.has(request) || physicalDepth > 0, 'dispatch-native-n20');
    const state = own(transport, 'fU') ?? own(Object.getPrototypeOf(transport), 'fU');
    require(state === 1 ||
      state === 2 ||
      state === 3 ||
      ((cleaning || retired) && state === 0), 'dispatch-native-n20');
    require(own(instance, 'wa') === 1 &&
      own(instance, 'Aa') === (aaSlot?.value ?? seed), 'dispatch-native-n20');
    require(list(queue).every((v) => v === config || v === query), 'dispatch-native-n20');
  }
  function snapshotPhysical() {
    const records: Retained[] = [];
    for (const [owner, keys] of [
      [
        transport,
        [
          'fU',
          'Sa',
          'Gb',
          'Ih',
          'Da',
          'Za',
          'Ja',
          'Va',
          'kb',
          'ka',
          'Ha',
          'oa',
          'Pc',
          'Wa',
          'Eb',
          'Yb',
          'Ae',
        ],
      ],
      [instance, ['ha', 'wa', 'Aa', 'oa', 'wD', 'hasError', 't$', 'Ha']],
      [own(connection, 'uC'), ['Pm']],
      [own(transport, 'Aa'), ['ka', 'ha', 'oa', 'wa']],
    ] as const)
      for (const key of keys) records.push({ owner, key, descriptor: descriptor(owner, key) });
    for (const request of requests.keys()) {
      const xhr = own(request, 'ha');
      if (xhr !== null)
        for (const key of ['nE', 'TOc', 't6b', 'MWa', 'n5'])
          records.push({ owner: xhr, key, descriptor: descriptor(xhr, key) });
      for (const key of ['Va', 'Ub', 'lH', 'Ha', 'Fb', 'DG', 'kb', 'Yb', 'Ab', 'ha', 'Gb', 'Pc'])
        records.push({ owner: request, key, descriptor: descriptor(request, key) });
    }
    const arrays = [queue, own(transport, 'oa'), own(own(transport, 'Aa'), 'oa')].map((value) => ({
      value,
      contents: list(value),
    }));
    const active = activeRequests();
    return () => {
      for (const r of records) require(same(r.descriptor, descriptor(r.owner, r.key)));
      for (const a of arrays)
        require(
          list(a.value).length === a.contents.length &&
            list(a.value).every((v, i) => v === a.contents[i]),
        );
      const now = activeRequests();
      require(now.length === active.length && now.every((v, i) => v === active[i]));
      physicalEvidence();
    };
  }
  function beginRetirement(isFatal: boolean) {
    require(physicalDepth > 0 && activeCallback && !retiring && !retired && !cleaning);
    checkRequest(activeCallback);
    cleanupEvidence?.();
    retiring = cleaning = cleanupStarted = closed = true;
    fatal = isFatal;
  }
  function physicalCall(call: () => unknown, completedRequest?: object) {
    checkpoint(false, !nativeTerminal);
    const previousSchedule = own(transport, 'Da');
    physicalDepth++;
    try {
      const result = call();
      const nextSchedule = own(transport, 'Da');
      if (nextSchedule !== previousSchedule && nextSchedule !== null && nextSchedule !== true) {
        require(completedRequest && requests.get(completedRequest)?.kind === 'forward');
        retrySchedule = { handle: nextSchedule, request: completedRequest };
      }
      physicalEvidence();
      if (receiveFailure && receiveUnwound && !receiveInvalid) {
        // Only a fully dispatched, intact native receipt authorizes advancing
        // source-consumed physical state after an observer failure.
        verifyReceiveIntegrity();
        transportWitness = snapshotPhysical();
      }
      checkpoint(false, !retiring && !nativeTerminal && !nativeClosed);
      if (physicalDepth === 1 && retiring) {
        retirementEvidence();
        retired = true;
      }
      return result;
    } catch (error) {
      return refused(error);
    } finally {
      physicalDepth--;
      if (!physicalDepth && retiring) {
        retiring = cleaning = false;
      }
      if (!physicalDepth && !failed) transportWitness = snapshotPhysical();
      if (!physicalDepth) {
        reportReceiveFailure();
        drainDetach();
      }
    }
  }
  function captureBackend() {
    source(
      retain(ns, 'Hkb'),
      'function(a,b){return a.vk?a.vk.getResponseHeader(b):null}',
      'dispatch-native-n08',
    );
    const adapter = retain(ns, 'qe');
    const adapterSource = Reflect.apply(sourceText, fn(adapter), []);
    require(adapterSource === 'a=>a' ||
      adapterSource === 'a=>a&&AsyncContext.Snapshot.wrap(a)', 'dispatch-native-n08');
    if (adapterSource !== 'a=>a') {
      const context = retain(globalThis, 'AsyncContext');
      const snapshot = retain(context, 'Snapshot');
      const wrap = retain(snapshot, 'wrap');
      const wrapSource = Reflect.apply(sourceText, fn(wrap), []);
      require(/^function[^]*\{ \[native code\] \}$/.test(wrapSource) ||
        wrapSource ===
          'function(a){var b=rd;if(!b[0])return a;var c=b[0];return function(){var d=b[0];b[0]=c;try{return a.apply(this,arguments)}finally{b[0]=d}}}', 'dispatch-native-n09');
    }

    const xhrPrototype = proto('Xj', xhrSources.constructor);
    for (const [key, text] of Object.entries(xhrSources))
      if (key !== 'constructor') source(own(xhrPrototype, key), text, 'dispatch-native-n08');
    require(Object.getPrototypeOf(xhrPrototype) === eventTargetPrototype, 'dispatch-native-n19');
    require(!descriptor(xhrPrototype, eventMarker), 'dispatch-native-n19');
    retain(xhrPrototype, eventMarker);
    require(retain(own(ns, 'Xj'), 'oe') === eventTargetPrototype, 'dispatch-native-n19');
    source(
      resolved(xhrPrototype, 'dispose'),
      'function(){this.n5||(this.n5=!0,this.Hc())}',
      'dispatch-native-n08',
    );
    source(
      resolved(xhrPrototype, 'isDisposed'),
      'function(){return this.n5}',
      'dispatch-native-n08',
    );
    source(
      resolved(eventTargetPrototype, 'Hc'),
      'function(){_.Yb.oe.Hc.call(this);this.removeAllListeners();this.R0c=null}',
      'dispatch-native-n08',
    );
    source(
      resolved(eventTargetPrototype, 'removeAllListeners'),
      'function(a){return this.Mpa?this.Mpa.removeAll(a):0}',
      'dispatch-native-n08',
    );
    source(
      resolved(eventMapPrototype, 'removeAll'),
      'function(a){a=a&&a.toString();var b=0;for(let c in this.listeners)if(!a||c==a){let d=this.listeners[c];for(let e=0;e<d.length;e++)++b,Bga(d[e]);delete this.listeners[c];this.ha--}return b}',
      'dispatch-native-n08',
    );
    for (const key of ['dispatchEvent', 'removeAllListeners', 'oqa', 'Sab', 'm4'])
      require(resolved(xhrPrototype, key) ===
        resolved(eventTargetPrototype, key), 'dispatch-native-n19');
    require(retain(own(ns, 'Yb'), 'oe') === own(own(ns, 'Eb'), 'prototype'), 'dispatch-native-n19');
    source(
      resolved(own(own(ns, 'Eb'), 'prototype'), 'Hc'),
      'function(){if(this.b_a)for(;this.b_a.length;)this.b_a.shift()()}',
      'dispatch-native-n08',
    );
    const nativeFactory = retain(ns, 'bja'),
      nativeFactoryPrototype = proto('cja', 'function(){}');
    exact(nativeFactory, nativeFactoryPrototype);
    noOwn(nativeFactory, 'Z8');
    retain(nativeFactory, 'Z8');
    source(
      own(nativeFactoryPrototype, 'Z8'),
      'function(){return new XMLHttpRequest}',
      'dispatch-native-n08',
    );
    const globals = retain(ns, 'fa'),
      NativeXHR = retain(globals, 'XMLHttpRequest');
    const nativePrototype = retain(NativeXHR, 'prototype');
    for (const [key, method] of [
      ['constructor', NativeXHR],
      ...[
        'open',
        'send',
        'abort',
        'setRequestHeader',
        'getResponseHeader',
        'getAllResponseHeaders',
      ].map((key) => [key, retain(nativePrototype, key)] as const),
    ] as const) {
      const methodSource = Reflect.apply(sourceText, fn(method), []);
      require(/^function[^]*\{ \[native code\] \}$/.test(methodSource) ||
        (key === 'send' &&
          methodSource ===
            'function(){c.set(this,rd[0]);return d.apply(this,arguments)}'), 'dispatch-native-n09');
    }
    const backends = new Map<object, { native: object; events: () => void }>();
    const controls = new Map<object, { read: () => object | null }>();
    armNativeSend = (request, xhr) => {
      require(physicalDepth > 0 &&
        !callbackActive &&
        !controls.has(xhr) &&
        own(request, 'ha') === xhr &&
        requests.get(request)?.kind === constructing &&
        own(xhr, 'nE') === true &&
        own(xhr, 'TOc') === false &&
        own(xhr, 't6b') === false &&
        own(xhr, 'MWa') === false, 'dispatch-native-n19');
      checkBackend!(request);
      const native = own(xhr, 'vk');
      const slot = descriptor(xhr, 'vk');
      require(slot?.writable &&
        slot.configurable &&
        Object.isExtensible(native), 'dispatch-native-n19');
      const send = fn(own(nativePrototype, 'send'));
      let value: object | null = native;
      let used = false;
      const gate = function (this: unknown, ...args: any[]) {
        require(this === native &&
          !used &&
          physicalDepth > 0 &&
          !callbackActive &&
          value === native &&
          own(request, 'ha') === xhr &&
          requests.get(request)?.kind === constructing &&
          own(xhr, 'nE') === true &&
          own(xhr, 't6b') === true &&
          own(xhr, 'TOc') === false &&
          own(xhr, 'MWa') === false, 'dispatch-native-n21');
        checkpoint();
        used = true;
        // Native arguments remain opaque; this is the original one-use continuation.
        const result = Reflect.apply(send, this, args);
        checkpoint();
        return result;
      };
      // Wj.send creates rk before this binder seam. Its source clears only to null;
      // each admitted bt owns a fresh Wj. Spent controls remain closed tombstones.
      Object.defineProperty(xhr, 'vk', {
        configurable: false,
        enumerable: slot.enumerable,
        get: () => value,
        set: (next: unknown) => {
          require(next === null &&
            !callbackActive &&
            (physicalDepth > 0 || cleaning) &&
            own(xhr, 'nE') === false &&
            own(xhr, 'MWa') === false, 'dispatch-native-n19');
          value = null;
        },
      });
      Object.defineProperty(native, 'send', {
        configurable: false,
        enumerable: false,
        get: () => gate,
        set: deny,
      });
      controls.set(xhr, { read: () => value });
      for (const r of retained)
        if (r.owner === native && r.key === 'send') r.descriptor = descriptor(native, 'send');
      for (const [owner, key] of [
        [xhr, 'vk'],
        [native, 'send'],
      ] as const)
        hooks.push({ owner, key, descriptor: descriptor(owner, key) });
    };
    checkBackend = (request) => {
      const xhr = own(request, 'ha');
      if (xhr === null) return;
      const captured = backends.has(xhr);
      exact(xhr, xhrPrototype);
      require(!descriptor(xhr, eventMarker), 'dispatch-native-n19');
      if (!captured) retain(xhr, eventMarker);
      for (const key of [
        ...Object.keys(xhrSources).filter((key) => key !== 'constructor'),
        'l_c',
        'isDisposed',
        'dispatchEvent',
        'removeAllListeners',
        'oqa',
        'Sab',
        'm4',
        'dispose',
      ]) {
        noOwn(xhr, key);
        if (!captured) resolved(xhr, key);
      }
      require(own(xhr, 'lPb') === null &&
        own(xhr, 'Vlb') === 0 &&
        own(xhr, 'R3f') === false &&
        own(xhr, 'dD') === true &&
        own(xhr, 'uI') === '' &&
        own(xhr, 'Rbd') === null &&
        own(xhr, 'mzc') === null, 'dispatch-native-n19');
      if (!captured) {
        for (const key of ['lPb', 'Vlb', 'R3f', 'dD', 'uI', 'Rbd', 'mzc']) retain(xhr, key);
        require(retain(xhr, 'b_a') === undefined, 'dispatch-native-n19');
        require(retain(xhr, 'R0c') === null && retain(xhr, 'Dff') === xhr, 'dispatch-native-n19');
      }
      const control = controls.get(xhr);
      const native = control ? control.read() : own(xhr, 'vk');
      if (native === null && requests.get(request)?.kind === 'terminate') return;
      exact(native, nativePrototype);
      for (const key of [
        'open',
        'send',
        'abort',
        'setRequestHeader',
        'getResponseHeader',
        'getAllResponseHeaders',
      ]) {
        if (key === 'send' && control) {
          const hook = hooks.find((r) => r.owner === native && r.key === key)!;
          require(same(hook.descriptor, descriptor(native, key)), 'dispatch-native-n19');
        } else noOwn(native, key);
        if (!captured) retain(native, key);
      }
      if (captured) {
        require(backends.get(xhr)!.native === native, 'dispatch-native-n19');
        backends.get(xhr)!.events();
      } else {
        const eventMap = retain(xhr, 'Mpa');
        exact(eventMap, eventMapPrototype);
        require(retain(eventMap, 'src') === xhr, 'dispatch-native-n19');
        noOwn(eventMap, 'removeAll');
        resolved(eventMap, 'removeAll');
        const eventLists = own(eventMap, 'listeners');
        const registrations = own(own(request, 'Zb'), 'wa');
        const terminal = requests.get(request)?.kind === 'terminate';
        const records: Retained[] = [];
        if (!terminal) {
          const list = own(eventLists, 'readystatechange');
          require(Array.isArray(list) && list.length === 1, 'dispatch-native-n19');
          const record = own(list, '0');
          require(own(record, 'src') === xhr &&
            own(record, 'handler') === request &&
            own(record, 'listener') === own(requests.get(request)!.prototype, 'Vc') &&
            own(record, 'capture') === false &&
            own(record, 'r8a') === false &&
            own(record, 'removed') === false, 'dispatch-native-n19');
          const key = String(own(record, 'key'));
          require(own(registrations, key) === record, 'dispatch-native-n19');
          for (const [owner, keys] of [
            [eventLists, ['readystatechange']],
            [list, ['length', '0']],
            [registrations, [key]],
            [record, Reflect.ownKeys(record)],
          ] as const)
            for (const key of keys)
              records.push({ owner, key, descriptor: descriptor(owner, key) });
        }
        const events = () => {
          require(own(eventMap, 'listeners') === eventLists &&
            own(own(request, 'Zb'), 'wa') === registrations, 'dispatch-native-n19');
          require(Reflect.ownKeys(eventLists).length === (terminal ? 0 : 1) &&
            Reflect.ownKeys(registrations).length === (terminal ? 0 : 1), 'dispatch-native-n19');
          for (const r of records)
            require(same(r.descriptor, descriptor(r.owner, r.key)), 'dispatch-native-n19');
        };
        events();
        backends.set(xhr, { native, events });
      }
    };
    const notify = retain(xhrPrototype, 'l_c');
    const notifySource = Reflect.apply(sourceText, fn(notify), []);
    if (notifySource === 'function(){Cta(this)}') {
      require(own(ns, 'wga') !== true, 'dispatch-native-n19');
      return;
    }
    source(
      notify,
      'function(){if(a.isDisposed())return b.apply(this,arguments);try{return b.apply(this,arguments)}catch(d){S1o(a,d)}}',
      'dispatch-native-n08',
    );
    const root = retain(ns, 'Cr'),
      monitor = retain(root, 'ka');
    const monitorPrototype = constructor(
      monitor,
      'function(a){_.Eb.call(this);this.oa=a;this.ka=!0;this.ha=!1}',
      own(own(ns, 'Eb'), 'prototype'),
    );
    pinMethods(monitorPrototype, {
      wrap: 'function(a){return P1o(this,a)}',
      unwrap: 'function(a){return a[Q1o(this,!1)]||a}',
    });
    for (const key of ['wrap', 'unwrap', 'isDisposed']) {
      noOwn(monitor, key);
      retain(monitor, key);
    }
    noOwn(monitorPrototype, 'isDisposed');
    retain(monitorPrototype, 'isDisposed');
    source(resolved(monitor, 'isDisposed'), 'function(){return this.n5}', 'dispatch-native-n08');
    source(
      retain(ns, 'Fd'),
      'function(a){return Object.prototype.hasOwnProperty.call(a,Tea)&&a[Tea]||(a[Tea]=++Uea)}',
      'dispatch-native-n08',
    );
    require(retain(monitor, 'ka') === true &&
      retain(monitor, 'ha') === true &&
      retain(monitor, 'n5') === false &&
      retain(ns, 'wga') === true, 'dispatch-native-n19');
    fn(retain(monitor, 'oa'));
    const monitors = retain(ns, 'vga');
    require(Array.isArray(monitors) &&
      own(monitors, 'length') === 1 &&
      own(monitors, '0') === monitor &&
      Reflect.ownKeys(monitors).length === 2, 'dispatch-native-n19');
    retain(monitors, '0');
    retain(monitors, 'length');
    const ids = Reflect.ownKeys(monitor).filter(
      (key) => typeof key === 'string' && /^closure_uid_/.test(key),
    );
    require(ids.length === 1, 'dispatch-native-n19');
    const uid = retain(monitor, ids[0]!);
    require(Number.isSafeInteger(uid) && uid > 0, 'dispatch-native-n19');
    const protectedKey = `__protected_${uid}__`,
      wrapperKey = `__wrapper_${uid}__`;
    const original = source(
      retain(notify, protectedKey),
      'function(){Cta(this)}',
      'dispatch-native-n08',
    );
    require(retain(original, wrapperKey) === notify, 'dispatch-native-n19');
    for (const method of [notify, original]) {
      exact(method, Function.prototype);
      noOwn(method, 'apply');
      retain(method, 'apply');
    }
    const links = (value: object) =>
      Reflect.ownKeys(value).filter(
        (key) => typeof key === 'string' && /^__(protected|wrapper)_/.test(key),
      );
    backendEvidence = () => {
      require(Reflect.ownKeys(monitors).length === 2, 'dispatch-native-n19');
      const now = Reflect.ownKeys(monitor).filter(
        (key) => typeof key === 'string' && /^closure_uid_/.test(key),
      );
      require(now.length === 1 && now[0] === ids[0], 'dispatch-native-n19');
      require(links(notify).length === 1 &&
        links(notify)[0] === protectedKey &&
        links(original).length === 1 &&
        links(original)[0] === wrapperKey, 'dispatch-native-n19');
    };
    backendEvidence();
  }
  function installPhysical(tp: any, base: any, channelPrototype: any, serializer: Call) {
    const lf = source(own(tp, 'Hf'), physicalSources.Hf, 'dispatch-native-n07');
    source(
      own(proto('l'), 'serialize'),
      'serialize(a){return JSON.stringify(_.Hba(this,a))}',
      'dispatch-native-n07',
    );
    source(
      retain(ns, 'Tg'),
      'function(a,b){b===void 0&&(b=0);Woa();b=Voa[b];for(var c=Array(Math.floor(a.length/3)),d=b[64]||"",e=0,f=0;e<a.length-2;e+=3){var g=a[e],k=a[e+1],r=a[e+2],u=b[g>>2];g=b[(g&3)<<4|k>>4];k=b[(k&15)<<2|r>>6];r=b[r&63];c[f++]=u+g+k+r}u=0;r=d;switch(a.length-e){case 2:u=a[e+1],r=b[(u&15)<<2]||d;case 1:a=a[e],c[f]=b[a>>2]+b[(a&3)<<4|u>>4]+r+d}return c.join("")}',
      'dispatch-native-n07',
    );
    captureBackend();
    proto(
      'ZJ',
      'class extends Error{constructor(a,b){super(b?`error code ${a}: ${b}`:`error code ${a}`);this.Vf=a}}',
    );
    const fatalHandler = source(
      resolved(handler, 'DU'),
      'function(a,b){this.ha.dispatchEvent(new Nlb(b))}',
      'dispatch-native-n07',
    );
    noOwn(handler, 'DU');
    replace(handler, 'DU', function (this: unknown, ...args: any[]) {
      require(
        this === handler &&
          args.length === 2 &&
          args[0] === transport &&
          [2, 5, 6, 7, 10, 11].includes(args[1]) &&
          own(transport, 'fU') === 0,
      );
      beginRetirement(true);
      checkpoint(false, false);
      return Reflect.apply(fatalHandler, this, args);
    });
    source(own(ns, '$b'), physicalSources.lc, 'dispatch-native-n07');
    const bind = Function.prototype.bind,
      call = Function.prototype.call,
      apply = Function.prototype.apply;
    for (const [key, method] of [
      ['bind', bind],
      ['call', call],
      ['apply', apply],
    ] as const) {
      source(method, `function ${key}() { [native code] }`, 'dispatch-native-n09');
      retain(Function.prototype, key);
    }
    const binder = retain(ns, '$b');
    const binderDescriptor = descriptor(ns, '$b')!;
    require(binderDescriptor.writable && binderDescriptor.configurable);
    let binding = false;
    const watchdogs = new Map<object, object>();
    const guardedBinder = function (this: unknown, ...args: any[]) {
      require(!binding);
      const candidate = args[1];
      if (args.length === 2 && args[0] === own(own(own(ns, 'Xj'), 'prototype'), 'J7d')) {
        const owned = [...requests.keys()].find((request) => own(request, 'ha') === candidate);
        if (owned) {
          require(!binding && physicalDepth > 0 && !callbackActive);
          binding = true;
          try {
            evidence();
            for (const method of [args[0], binder])
              for (const key of ['bind', 'call', 'apply']) {
                noOwn(method, key);
                retain(method, key);
              }
            armNativeSend!(owned, candidate);
            // C1d retains the actual original bound function, including adapter identity.
            return Reflect.apply(binder, this, args);
          } finally {
            binding = false;
          }
        }
        // dt.disconnect's private termination bt is exposed only by its later qlb.
        // Its original cleanup-only send has no logical maps or Wc/current callback.
      }
      if (
        args.length !== 2 ||
        !candidate ||
        (typeof candidate !== 'object' && typeof candidate !== 'function') ||
        descriptor(candidate, 'Aa')?.value !== transport ||
        args[0] !== descriptor(Object.getPrototypeOf(candidate), 'Pc')?.value
      )
        return Reflect.apply(binder, this, args);
      require(physicalDepth > 0 && !callbackActive);
      binding = true;
      try {
        const existing = requests.has(candidate);
        const p = existing
          ? requests.get(candidate)!.prototype
          : constructor(candidate, physicalSources.bt, Object.prototype);
        source(own(p, 'Pc'), physicalSources.Pc, 'dispatch-native-n07');
        source(own(p, 'kc'), physicalSources.kc, 'dispatch-native-n07');
        source(own(p, 'Vc'), physicalSources.Vc, 'dispatch-native-n07');
        for (const [key, text] of Object.entries({
          setTimeout: 'function(a){this.lH=a}',
          cancel: 'function(){this.kb=!0;blb(this)}',
          zY: 'function(){return this.Ha}',
          getLastError: 'function(){return this.DG}',
          lm: 'function(){return this.Yc}',
        })) {
          source(own(p, key), text, 'dispatch-native-n07');
          noOwn(candidate, key);
          if (!existing) retain(candidate, key);
        }
        if (existing) {
          require(activeCallback === candidate && own(candidate, 'Va') === null);
          checkRequest(candidate);
          evidence();
        } else
          for (const key of ['Pc', 'kc', 'Vc']) {
            noOwn(candidate, key);
            retain(candidate, key);
          }
        for (const method of [args[0], binder])
          for (const key of ['bind', 'call', 'apply']) {
            noOwn(method, key);
            retain(method, key);
          }
        const kind = existing ? requests.get(candidate)!.kind : constructing;
        require(
          kind &&
            (kind === 'forward'
              ? activeRequests().includes(candidate)
              : kind === 'backchannel'
                ? own(transport, 'ka') === candidate
                : cleaning && own(candidate, 'mb') === 2),
        );
        const batch = list(own(candidate, 'Za'));
        batch.forEach(checkEntry);
        const rid = own(candidate, 'oa'),
          sid = own(candidate, 'Yc');
        require(
          (kind === 'backchannel'
            ? rid === 'rpc' && batch.length === 0
            : Number.isSafeInteger(rid) && rid >= 0) &&
            (sid === protocolSid || (existing && sid === '')),
        );
        if (kind === 'terminate') require(batch.length === 0 && rid === own(transport, 'Gb') - 1);
        if (!existing)
          requests.set(candidate, {
            kind,
            rid,
            sid,
            batch,
            batchOwner: own(candidate, 'Za'),
            prototype: p,
          });
        const originalOc = own(p, 'kc');
        if (!existing)
          replace(candidate, 'kc', function (this: unknown, ...values: any[]) {
            require(
              this === candidate &&
                values.length === 1 &&
                values[0] === own(candidate, 'ha') &&
                !activeCallback,
            );
            return physicalCall(() => {
              activeCallback = candidate;
              try {
                return Reflect.apply(originalOc, this, values);
              } finally {
                activeCallback = undefined;
              }
            }, candidate);
          });
        if (!existing) {
          for (const key of ['Aa', 'ka', 'Yc', 'oa', 'Gb', 'Za', 'mb', 'Yb', 'Ac', 'ub', 'Zb'])
            retain(candidate, key);
          require(
            own(candidate, 'ka') === own(transport, 'ha') &&
              own(candidate, 'Yb') === 0 &&
              own(candidate, 'Ac') === false &&
              own(candidate, 'ub') === false,
          );
          exact(own(candidate, 'Zb'), eventPrototype);
          for (const key of ['listen', 'removeAll']) {
            noOwn(own(candidate, 'Zb'), key);
            retain(own(candidate, 'Zb'), key);
          }
        }
        const bound = Reflect.apply(binder, this, args);
        require(typeof bound === 'function');
        let used = false;
        const token = {};
        watchdogs.set(candidate, token);
        return function (this: unknown, ...values: any[]) {
          require(
            !used &&
              values.length === 0 &&
              !activeCallback &&
              physicalDepth === 0 &&
              watchdogs.get(candidate) === token &&
              own(candidate, 'Va') !== null,
          );
          used = true;
          return physicalCall(() => {
            activeCallback = candidate;
            try {
              return Reflect.apply(bound, this, values);
            } finally {
              activeCallback = undefined;
            }
          }, candidate);
        };
      } finally {
        binding = false;
      }
    };
    Object.defineProperty(ns, '$b', { ...binderDescriptor, value: guardedBinder });
    restoration.push({ owner: ns, key: '$b', descriptor: binderDescriptor });
    hooks.push({ owner: ns, key: '$b', descriptor: descriptor(ns, '$b') });
    for (const r of retained)
      if (r.owner === ns && r.key === '$b') r.descriptor = descriptor(ns, '$b');
    replace(
      transport,
      'Hf',
      function (this: unknown, ...args: any[]) {
        require(this === transport && args.length <= 1 && !opening);
        if (!physicalStarted) {
          require(
            args.length === 0 &&
              own(transport, 'Da') === true &&
              list(own(transport, 'oa')).length === 0 &&
              config &&
              query,
          );
          checkpoint();
          physicalStarted = true;
          transportWitness = snapshotPhysical();
        }
        require(own(transport, 'Da'));
        if (own(transport, 'Da') === true) require(args.length === 0);
        else
          require(
            retrySchedule &&
              retrySchedule.handle === own(transport, 'Da') &&
              args.length === 1 &&
              args[0] === retrySchedule.request,
          );
        if (args[0]) checkRequest(args[0]);
        retrySchedule = undefined;
        const closeFlush = lifetime && closed && closeFrame && !cleaning;
        if (closeFlush) {
          require(
            !failed &&
              !detached &&
              !retired &&
              !closeFlushStarted &&
              args.length === 0 &&
              own(transport, 'fU') === 3,
          );
          const pending = list(own(transport, 'oa'));
          require(pending.length === 1 && maps.get(pending[0])?.mapId === 2);
          cleanupEvidence?.();
          closeFlushStarted = cleaning = true;
        }
        try {
          return physicalCall(() => {
            require(!constructing);
            constructing = 'forward';
            try {
              return Reflect.apply(lf, this, args);
            } finally {
              constructing = undefined;
            }
          });
        } finally {
          if (closeFlush) cleaning = false;
        }
      },
      false,
      'dispatch-native-n20',
    );
    for (const key of ['uf', 'Di', 'Jh'] as const) {
      const original = source(own(tp, key), physicalSources[key], 'dispatch-native-n07');
      replace(transport, key, function (this: unknown, ...args: any[]) {
        require(
          this === transport &&
            args.length === 0 &&
            physicalStarted &&
            protocolSid !== '' &&
            own(transport, 'fU') === 3 &&
            !constructing,
        );
        require(
          key === 'uf'
            ? own(transport, 'ka') === null && own(transport, 'Pc') > 0
            : key === 'Di'
              ? own(transport, 'kb') !== null
              : own(transport, 'Va') !== null,
        );
        return physicalCall(() => {
          constructing = 'backchannel';
          try {
            return Reflect.apply(original, this, args);
          } finally {
            constructing = undefined;
          }
        });
      });
    }
    const opened = source(resolved(handler, 'bkd'), physicalSources.xjd, 'dispatch-native-n07');
    replace(handler, 'bkd', function (this: unknown, ...args: any[]) {
      require(
        this === handler &&
          args.length === 0 &&
          activeCallback &&
          !opening &&
          protocolSid === '' &&
          own(transport, 'fU') === 3,
      );
      checkRequest(activeCallback);
      require(requests.get(activeCallback)?.sid === '');
      const sid = own(transport, 'Sa');
      require(typeof sid === 'string' && sid.length > 0 && sid.length <= 512);
      protocolSid = sid;
      opening = true;
      try {
        return Reflect.apply(opened, this, args);
      } finally {
        opening = false;
      }
    });
    replace(
      connection,
      'send',
      function (this: unknown, ...args: any[]) {
        require(
          this === connection &&
            args.length === 1 &&
            ((flushing && sentMessages < 2) ||
              (applicationClosing && !closeFrame && sentMessages === 2)) &&
            serializing === undefined,
        );
        const closing = applicationClosing;
        if (closing) {
          require(
            closed &&
              cleaning &&
              closeStarted &&
              own(instance, 't$') === true &&
              list(queue).length === 0,
          );
          require(readGeminiNativeSendKind(ns, args[0]) === 'close');
          closeFrame = args[0];
          const witness = captureGeminiNativeWireContent(ns, closeFrame, 'tJd');
          closeWitness = () => witness(closeFrame);
        }
        const message = closing ? closeFrame : sentMessages === 0 ? config : query;
        require(
          args[0] === message &&
            (closing ||
              (list(queue).length === 1 - sentMessages &&
                (sentMessages !== 0 || own(queue, '0') === query))),
        );
        checkpoint();
        serializing = message;
        serialized = undefined;
        serializedOnce = false;
        try {
          if (!closing && sentMessages === 1) logicalAttempt = true;
          const value = Reflect.apply(fn(own(base, 'send')), this, args);
          require(serializedOnce && maps.size === sentMessages + 1);
          if (!closing) sentMessages++;
          checkpoint();
          return value;
        } finally {
          serializing = undefined;
          serialized = undefined;
        }
      },
      false,
      'dispatch-native-n22',
    );
    replace(
      connection,
      'FCa',
      function (this: unknown, ...args: any[]) {
        require(
          this === connection &&
            serializing !== undefined &&
            args.length === 1 &&
            args[0] === serializing &&
            !serializedOnce,
        );
        checkpoint();
        serializedOnce = true;
        const value = Reflect.apply(serializer, this, args);
        require(typeof value === 'string' && value.length <= 65536);
        serialized = value;
        checkpoint();
        return value;
      },
      false,
      'dispatch-native-n22',
    );
    replace(
      channel,
      'send',
      function (this: unknown, ...args: any[]) {
        require(
          this === channel &&
            serializing !== undefined &&
            serializedOnce &&
            args.length === 1 &&
            args[0] === serialized,
        );
        checkpoint();
        const pending = list(own(transport, 'oa'));
        const nextId = own(transport, 'Ih');
        Reflect.apply(fn(own(channelPrototype, 'send')), this, args);
        const after = list(own(transport, 'oa'));
        require(
          after.length === pending.length + 1 &&
            after.slice(0, -1).every((v, i) => v === pending[i]),
        );
        const entry = after.at(-1),
          map = own(entry, 'map');
        constructor(
          entry,
          'class{constructor(a,b){this.mapId=a;this.map=b;this.context=null}}',
          Object.prototype,
        );
        require(
          own(entry, 'mapId') === nextId &&
            own(transport, 'Ih') === nextId + 1 &&
            own(entry, 'context') === null &&
            Object.getPrototypeOf(map) === Object.prototype &&
            Reflect.ownKeys(map).length === 1 &&
            own(map, '__data__') === serialized,
        );
        maps.set(entry, { mapId: nextId, map, data: serialized! });
        checkpoint();
      },
      false,
      'dispatch-native-n22',
    );
  }
  function restore(r: Retained) {
    const index = hooks.findIndex((v) => v.owner === r.owner && v.key === r.key);
    require(index >= 0 && same(hooks[index]!.descriptor, descriptor(r.owner, r.key)));
    if (r.descriptor) Object.defineProperty(r.owner, r.key, r.descriptor);
    else Reflect.deleteProperty(r.owner, r.key);
    hooks.splice(index, 1);
    for (const entry of retained)
      if (entry.owner === r.owner && entry.key === r.key) entry.descriptor = r.descriptor;
    restoration.splice(restoration.indexOf(r), 1);
  }
  function restoreCreators() {
    for (const entry of [...restoration]) {
      if (
        (entry.owner === ns && ['uA', 'bu', 'Vt'].includes(String(entry.key))) ||
        (entry.owner === lifetime && entry.key === 'Wc')
      )
        restore(entry);
    }
  }
  function detach() {
    closed = true;
    if (receiveDepth) {
      detachQueued = true;
      return;
    }
    require(!callbackActive && !cleaning, 'dispatch-native-n24');
    if (detached) return;
    // Pending instance gates are never restored: a queued Lf remains a closed tombstone.
    cleaning = true;
    try {
      require(!provisionalChannel || instance, 'dispatch-native-n24');
      checkpoint(false, false);
      if (instance && !retired) {
        cleanupStarted = true;
        Reflect.apply(fn(own(instance, 'disconnect')), instance, []);
      }
      retirementEvidence();
      retired = true;
      require(!receiveInvalid && !pendingEnvelope && !receipt.pending(), 'dispatch-native-n24');
      for (const r of [...restoration].reverse()) {
        if (lifetime && r.owner === ns && r.key === 'iM') continue;
        restore(r);
      }
      if (physicalStarted) transportWitness = snapshotPhysical();
      retired = true;
      detached = true;
    } catch (error) {
      refused(error, 'dispatch-native-n24');
    } finally {
      cleaning = false;
    }
  }
  return {
    bindPacket(value) {
      require(!callbackActive && !bound, 'dispatch-native-n12');
      bound = true;
      packet = value;
      try {
        assertGeminiTrialPacket(ns, packet, approved);
        for (const owner of [packet, own(packet, 'request'), own(own(packet, 'request'), 'Cc')]) {
          const keys = Reflect.ownKeys(object(owner));
          packetKeys.push({ owner: object(owner), keys });
          for (const key of keys) retain(owner, key);
        }
        const privacy = own(own(packet, 'request'), 's4d');
        if (privacy !== undefined) {
          const backing = retain(privacy, 'fl');
          for (const key of Reflect.ownKeys(object(backing)))
            if (key !== own(ns, 'La')) retain(backing, key);
        }
        checkpoint();
      } catch (error) {
        refused(error, 'dispatch-native-n12');
      }
    },
    bindObservable(value) {
      require(
        !observable && bound && hjdCount === 1 && factoryCount === 0 && !callbackActive && !closed,
      );
      exact(value, observablePrototype);
      absent(value, 'operator');
      absent(value, 'source');
      noOwn(value, 'subscribe');
      const producer = source(
        retain(value, 'ha'),
        lifecycleSources.producer,
        'dispatch-native-n06',
      );
      observable = value;
      replace(
        value,
        'ha',
        function (this: unknown, ...args: any[]) {
          require(this === observable && !producerUsed && args.length === 1 && !producerActive);
          checkpoint(true);
          producerUsed = producerActive = true;
          outerSubscriber = args[0];
          if (lifetime)
            captureDestination(
              outerSubscriber,
              [own(own(outerSubscriber, 'destination'), 'ha')],
              'outer',
            );
          try {
            const teardown = control(() => Reflect.apply(producer, this, args));
            source(teardown, '()=>{w.onComplete();C();IAd(this.zl)}');
            const wrapped = function (this: unknown, ...values: any[]) {
              closed = true;
              const wasCleaning = cleaning;
              cleaning = true;
              try {
                return control(() => Reflect.apply(teardown, this, values));
              } finally {
                cleaning = wasCleaning;
                drainDetach();
              }
            };
            if (lifetime) lifecycleSubscriptions.get(outerSubscriber)!.children.add(wrapped);
            return wrapped;
          } finally {
            producerActive = false;
            if (lifetime) restoreCreators();
          }
        },
        false,
        'dispatch-native-n16',
      );
    },
    close() {
      closed = true;
    },
    sent() {
      return logicalAttempt;
    },
    receiving() {
      return receiveDepth > 0;
    },
    projecting(frame) {
      return projectingFrame !== undefined && frame === projectingFrame;
    },
    identity() {
      checkpoint(false, false);
      return receipt.identity();
    },
    completion(value) {
      require(
        originalCompleted &&
          nativeTerminal &&
          !receiveDepth &&
          !pendingEnvelope &&
          !receipt.pending(),
      );
      checkpoint(false, false);
      return receipt.completion(value);
    },
    detach,
  };
}
