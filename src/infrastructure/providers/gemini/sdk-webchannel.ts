import {
  GEMINI_NATIVE_RECEIVE_PREDICATE_CODES,
  type GeminiNativeReceiveDiagnostic,
  type GEMINI_NATIVE_DISPATCH_REASONS,
} from '../../../application/gemini-fixed-text-trial';
import {
  assertGeminiTrialPacket,
  captureGeminiNativeWireContent,
  readGeminiNativeOutboundDiagnostic,
  readGeminiNativeReceivePredicate,
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
    'function(a,b,c,d){this.ha.debug("connect()");kt(0);this.Zc=a;this.ob=b||{};c&&d!==void 0&&(this.ob.OSID=c,this.ob.OAID=d);this.Eb=this.yd;this.ha.debug("connectChannel_()");a=plb(this,null,this.Zc);this.ha.debug("GetForwardChannelUri: "+a);this.ub=a;slb(this)}',
  dtDisconnect:
    'function(){this.ha.debug("disconnect()");zlb(this);if(this.hU==3){var a=this.Gb++,b=this.ub.clone();_.Eg(b,"SID",this.Ua);_.Eg(b,"RID",a);_.Eg(b,"TYPE","terminate");Alb(this,b);a=new lt(this,this.ha,this.Ua,a);a.mb=2;a.Ua=_.Gg(b.clone());b=!1;if(_.fa.navigator&&_.fa.navigator.sendBeacon)try{b=_.fa.navigator.sendBeacon(a.Ua.toString(),"")}catch(c){}!b&&_.fa.Image&&((new Image).src=a.Ua,b=!0);b||(a.ha=Ukb(a.Aa,null),a.ha.send(a.Ua));a.Wa=Date.now();Tkb(a)}Blb(this)}',
  eventHandler: 'function(a){_.Eb.call(this);this.Ha=a;this.wa={}}',
  listen:
    'function(a,b,c,d){Array.isArray(b)||(b&&(Xta[0]=b.toString()),b=Xta);for(let e=0;e<b.length;e++){let f=_.me(a,b[e],c||this.handleEvent,d||!1,this.Ha||this);if(!f)break;this.wa[f.key]=f}return this}',
  removeAll:
    'function(){_.Kb(this.wa,function(a,b){this.wa.hasOwnProperty(b)&&_.oe(a)},this);this.wa={}}',
  JVd: 'class{constructor(){this.Na=_.x(_.xKd);this.Ua=_.x(_.zKd);this.Va=_.x(_.CKd);this.Wa=_.x(_.dK);this.Oa=_.x(_.UC);this.Ia=_.x(_.xx);this.Da=_.x(_.Nz);this.Ha=_.x(_.GA);this.Fc=_.x(_.JA);this.nb=_.x(_.QF);this.Za=this.Da.Ea(_.rKd);var a;this.kb=(a=_.x(_.mKd,{optional:!0}))!=null?a:!1;this.ob=this.Da.Ea(_.qKd);this.ka=!1;this.ub=_.Z(this.Oa.Si,{initialValue:!1});this.ZWb=_.Z(this.nb.sG().pipe(_.v(b=>b.map(c=>c.id))),{initialValue:[]});_.x(_.AKd).register(this)}isEnabled(){return!this.kb&&_.BKd(this.Va)}Ca(){return this.ka||\n!!this.ha&&_.ZJd(this.ha.connection)}mb(){var a=this.ha;if(a&&_.ZJd(a.connection))return _.n(a.Sec,60)||void 0}Eb(a,b,c,d,e){if(this.isEnabled()){var f=e!=null?e:()=>this.Oa.aBc();a=a.map(g=>typeof g==="object"&&g!==null&&"event"in g&&"observable"in g&&_.ow(g.observable)?g:{event:"CANCELLED_INVALIDATION",observable:g});_.Jt(...a.map(({event:g,observable:k})=>k.pipe(_.sw(),_.ww(1),_.v(()=>g)))).pipe(_.Kt(()=>this.ka||this.ha!==void 0),_.cu(g=>{this.reset(g)}),_.yw(()=>_.Et(()=>f()).pipe(_.Tt(1),_.Mt(()=>\n_.It))),_.wA(b)).subscribe(g=>{d&&!d()||this.Aa(g,c())})}}Ab(){this.ha!==void 0&&ZPk(this)}Shc(a){var b=this.ha;b!=null&&_.ZJd(b.connection)&&(b.connection.Shc(a),ZPk(this))}IDc(){var a=this.Ja;this.Ja=void 0;return a}Oof(){this.wa=void 0;var a=this.ha;if(a){YPk(this);a.bEd.unsubscribe();this.ha=void 0;this.ka=!1;if(_.ZJd(a.connection))return{connection:a.connection,Sec:a.Sec,ri:a.ri,VM:a.VM};let b=a.connection.hasError;a.connection.disconnect();_.NAd(this.Fc,b?"CHANNEL_ERROR":"CHANNEL_CLOSED",a.ri)}}oa(a){var b=\nthis.ha;a==="CHANNEL_ERROR"?b&&(this.wa={conversationId:b.conversationId,ri:b.ri}):this.wa=void 0;b&&(YPk(this),b.bEd.unsubscribe(),_.ZJd(b.connection)&&a!=="CHANNEL_ERROR"&&a!=="CHANNEL_CLOSED"?_.aM(b.connection):b.connection.disconnect(),this.ha=void 0,_.NAd(this.Fc,a!=null?a:"CANCELLED_INVALIDATION",b.ri));this.ka=!1}reset(a="CANCELLED_INVALIDATION"){this.oa(a)}Aa(a,b){if(this.isEnabled()){var c=_.ti(a,50);if(!(this.Za&&(_.pL(c)||c===58)||this.ub()||this.ZWb().length>0&&b&&!this.ZWb().includes(b)||\nthis.ka)){var d,e;c=(e=(d=_.hGd(a))==null?void 0:d.ig())!=null?e:"";if(!this.wa||this.wa.conversationId!==c||this.wa.ri!==b)if(!this.ha||!_.ZJd(this.ha.connection)||this.ha.conversationId!==c||this.ha.ri!==b){this.oa();this.ka=!0;this.Ja=d=this.Wa.now();_.NAd(this.Fc,"CREATED",b);try{let g=_.yKd(this.Ua,{ri:b,isTemporaryChat:_.ni(a,46),clientTurnId:_.n(a,60),requestSource:_.FA(this.Ha)});var f=_.wKd(this.Na,this.Ia,{DS:g});f.connect();_.aKd(f,a,_.FA(this.Ha),b!=null?b:"",_.n(a,60));ZPk(this);let k=\nf.Ja.pipe(_.Tt(1),_.wA(this.Ia)).subscribe(r=>{this.oa(r!==void 0?"CHANNEL_ERROR":"CHANNEL_CLOSED")});this.ha={connection:f,ri:b,conversationId:c,Sec:a,bEd:k,VM:d}}catch(g){let k;(k=f)==null||k.disconnect();YPk(this);this.ha=void 0;this.ka=!1}finally{this.ka=!1}}}}}}',
  m: 'function(a,b,c,d){var e=a.fl,f=e[_.La]|0;b=Qoa(e,f,b,c,d);if(b==null)return b;f=e[_.La]|0;if(!_.Ra(a,f)){let g=_.Lg(b);g!==b&&(_.ub(a)&&(e=a.fl,f=e[_.La]|0),b=g,f=_.xb(e,f,c,b,d),_.Mg(e,f))}return b}',
  Ph: 'function(a,b,c,d){a=a.fl;return Qoa(a,a[_.La]|0,b,c,d)||b[_.Xd]||(b[_.Xd]=_.iba(b))}',
  Lg: 'function(a){var b=a.fl,c=b[_.La]|0;return _.Ra(a,c)?_.Rba(a,b,c)?_.Qba(a,b,!0):new a.constructor(_.tb(b,c,!1)):a}',
  Af: 'function(a){var b=a.fl,c=b[_.La]|0;return _.Ra(a,c)?a:_.Rba(a,b,c)?_.Qba(a,b):new a.constructor(_.tb(b,c,!0))}',
  Gh: 'function(a,b,c,d,e){d=Qpa(d);_.Vh(a,c,d,e);d&&!_.Ra(d)&&_.Mg(a.fl);return a}',
  ub: 'function(a){if(a.Fb!==_.Kaa)return!1;var b=a.fl;b=_.tb(b,b[_.La]|0);_.Ma(b,2048);a.fl=b;_.Laa(a,!1);a.tcc=void 0;return!0}',
  Ra: 'function(a,b){return b===void 0?a.Fb!==_.Kaa&&!!(2&(a.fl[_.La]|0)):!!(2&b)&&a.Fb!==_.Kaa}',
  zJd: 'function(a,b){return _.Ii(a,1,b)}',
  dDb: 'function(a){return Object.assign({},{locale:"ko",requestSource:a.requestSource},a.modeId!==void 0?{modeId:a.modeId}:{},a.turnId!==void 0?{turnId:a.turnId}:{})}',
  EJd: 'function(a,b){return _.Gh(a,_.$Ad,1,b)}',
  FJd: 'function(a,b){return _.Ii(a,2,b)}',
  jMd: 'function(a,b){var c=!!b.request.dLa,d,e,f;b=_.Ryd(b,a.requestSource,a.Gc,a.mb,(f=(d=a.uv())==null?void 0:d.id)!=null?f:void 0,!c&&a.Oga(),!c&&a.Wa.Ga(),a.Ac.isSupported(),a.rja&&_.mL(a.Va)?(e=a.Tb)==null?void 0:e.Ja.value:void 0);if(a.rja&&_.mL(a.Va)&&(a=_.Aed())){a:switch(a.kind){case 0:c=new yL;a=_.Mi(c,2,fGd,a.toolId);a=_.Af(a);break a;case 1:c=new yL;a=_.Mi(c,3,fGd,a.toolId);a=_.Af(a);break a;case 2:a=new yL;a=_.Fi(a,5,fGd,!0);a=_.Af(a);break a;default:throw Error("sk`"+String(a.kind));\n}if(c=a){var g;(a=(g=_.m(b,yL,109))==null?void 0:_.m(g,jxd,4))?(g=_.Lg(c),g=_.Gh(g,jxd,4,a)):g=c;_.Gh(b,yL,109,g)}}return b}',
  aKd: 'function(a,b,c,d,e){var f,g,k=((f=_.hGd(b))==null?void 0:f.ig())||((g=_.m(b,_.vL,72))==null?void 0:g.ig())||"";e&&(a.oa=_.Rh(_.MI(_.NI(new _.CI,e),k)));d=_.dDb({requestSource:c,modeId:d,turnId:e});c=(new _.$Ad).setLocale(d.locale);c=_.Ni(c,1,d.requestSource);d.modeId!==void 0&&_.Li(c,2,d.modeId);d.turnId!==void 0&&_.Li(c,4,d.turnId);d=new _.DJd;e=new hJd;b=_.Gh(e,_.wL,1,b);b=_.Ni(b,4,1);b=_.Af(b);b=_.Gh(d,hJd,5,b);c=_.EJd(_.FJd(new _.GJd,0),c);b=_.di(c,8,_.HJd,b);b=_.Af(b);c=new _.JJd;b=_.di(c,\n1,_.XL,b);b=_.Af(b);if(a.ha)a.connection.send(b);else{let r,u;(u=(r=a.connection).Afc)==null||u.call(r,b);a.wa.push(b)}}',
  AKd: 'class{register(a){this.ha=a}get(){return this.ha}}',
  xKd: 'class{constructor(){this.Da=_.x(_.Nz);this.ka=_.x(_.pKd);this.wa=_.x(_.mKd);this.oa=_.x(_.eA);this.ha=new Set}get Aa(){return this.Da.Ea(sKd)}}',
  re: '(a,b)=>{Sga||Tga();eca||(Sga(),eca=!0);bca.add(a,b)}',
  dt: 'function(a){this.Rf=0;this.oa=[];this.ha=new zkb;this.Xc=this.hf=this.ub=this.Zc=this.ka=this.Kf=this.mb=this.ob=this.Ga=this.Nc=this.Na=null;this.Jh=this.Gb=0;this.Lg=Ekb("failFast",!1,a);this.Eb=this.Va=this.Ja=this.Ca=this.wa=null;this.yd=!0;this.oc=this.xf=this.Ha=-1;this.Pc=this.Wa=this.Za=0;this.xg=Ekb("baseRetryDelayMs",5E3,a);this.Gh=Ekb("retryDelaySeedMs",1E4,a);this.wh=Ekb("forwardChannelMaxRetries",2,a);this.Cf=Ekb("forwardChannelRequestTimeoutMs",2E4,a);this.BPb=a&&a.FEa||void 0;this.Wi=\na&&a.x4g||void 0;this.Uf=a&&a.Rsg||!1;this.Tb=void 0;this.Ab=a&&a.n3a||!1;this.Ua="";this.Aa=new Fkb(a&&a.x_g);this.Wd=Math.min(a&&a.d4g||1E3,1E3);this.Yf=new Dkb;this.Ac=a&&a.cbb||!1;this.Zb=a&&a.X0g||!1;this.Ac&&this.Zb&&(this.ha.warning("Ignore encodeInitMessageHeaders because fastHandshake is set."),this.Zb=!1);this.Qh=a&&a.DZg||!1;a&&a.SId&&this.ha.SId();a&&a.sbb&&(this.yd=!1);this.Fd=!this.Ac&&this.yd&&a&&a.kId||!1;this.Sd=void 0;a&&a.v4d&&a.v4d>0&&(this.Sd=a.v4d);this.Kd=void 0;this.Fb=0;this.Yb=\n!1;this.xe=this.kb=null}',
  hmb: 'function(a){this.ha=a}',
  bmb: 'function(a,b){_.Yb.call(this);this.ha=new nt(b);this.wa=a;this.Xm=null;this.ka=b&&b.xWf||null;a=b&&b.vWf||null;b&&b.n_g&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"});this.ha.Na=a;a=b&&b.DS||null;b&&b.jBa&&(a?a["X-WebChannel-Content-Type"]=b.jBa:a={"X-WebChannel-Content-Type":b.jBa});b&&b.NDd&&(a?a["X-WebChannel-Client-Profile"]=b.NDd:a={"X-WebChannel-Client-Profile":b.NDd});this.ha.Nc=a;(a=b&&b.bdb)&&!_.ja(a)&&(this.ha.Ga=a);this.Ca=b&&b.n3a||!1;this.Aa=b&&b.L1a||\n!1;(b=b&&b.cdb)&&!_.ja(b)&&(this.ha.mb=b,a=this.ka,a!==null&&b in a&&_.Uta(this.ka,b));this.oa=new Klb(this)}',
  Jlb: 'function(a,b){return new Ilb(a,b)}',
  JDb: 'function(a,b,c={},d=!1){var e=Object.assign({},_.FDb()),f=_.Nr([]);f&&(e.Authorization=f);(f=_.Vu())&&(e["X-Goog-AuthUser"]=f);e["X-Goog-Api-Key"]=b;(b=_.hf(_.pd("PI9WOb"),""))&&(e["X-Server-Token"]=b);if(d=IDb(a,d))e["X-Origin"]=window.location.origin;return _.Jlb(a,Object.assign({},{cdb:"gsessionid",n3a:!0,L1a:!0,kId:!0},d?{}:{bdb:"$httpHeaders"},c,{DS:Object.assign({},e,c.DS||{})}))}',
  st: 'class{constructor(a){a&&(this.ha=a)}lift(a){var b=new _.st;b.source=this;b.operator=a;return b}subscribe(a,b,c){a=a&&a instanceof snb||a&&_.pt(a.next)&&_.pt(a.error)&&_.pt(a.complete)&&Olb(a)?a:new _.omb(a,b,c);b=this.operator;c=this.source;a.add(b?b.call(a,c):c?this.ha(a):this.Ca(a));return a}Ca(a){try{return this.ha(a)}catch(b){a.error(b)}}forEach(a,b){b=Slb(b);return new b((c,d)=>{var e=this.subscribe(f=>{try{a(f)}catch(g){d(g),e==null||e.unsubscribe()}},d,c)})}ha(a){var b;return(b=this.source)==\nnull?void 0:b.subscribe(a)}[Ylb](){return this}pipe(...a){return a.length?_.Rlb(a)(this):this}Qua(){var a=Slb(a);return new a((b,c)=>{var d;this.subscribe(e=>d=e,e=>c(e),()=>b(d))})}}',
  Wt: 'class extends _.st{constructor(){super();this.observers=[];this.hasError=this.Zs=this.closed=!1;this.oa=null}lift(a){var b=new vnb(this,this);b.operator=a;return b}ka(){if(this.closed)throw new unb;}next(a){this.ka();if(!this.Zs){let b=this.observers.slice();for(let c of b)c.next(a)}}error(a){this.ka();if(!this.Zs){this.hasError=this.Zs=!0;this.oa=a;let b=this.observers;for(;b.length;)b.shift().error(a)}}complete(){this.ka();if(!this.Zs){this.Zs=!0;let a=this.observers;for(;a.length;)a.shift().complete()}}unsubscribe(){this.Zs=\nthis.closed=!0;this.observers=null}get Ja(){var a;return((a=this.observers)==null?void 0:a.length)>0}Ca(a){this.ka();return super.Ca(a)}ha(a){this.ka();this.Aa(a);return this.Ga(a)}Ga(a){var b=this.Zs,c=this.observers;return this.hasError||b?_.qt.ha:(c.push(a),new _.qt(()=>Nlb(this.observers,a)))}Aa(a){var b=this.oa,c=this.Zs;this.hasError?a.error(b):c&&a.complete()}}',
  fu: 'class extends _.Wt{constructor(a){super();this.Sm=a}get value(){return this.getValue()}ha(a){var b=super.ha(a);!b.closed&&a.next(this.Sm);return b}getValue(){var a=this.oa,b=this.Sm;if(this.hasError)throw a;this.ka();return b}next(a){super.next(this.Sm=a)}}',
  $Ed: 'class{constructor(a,b,c,d,e={}){this.endpoint=a;this.apiKey=b;this.NCa=c;this.RTa=d;this.Rj=new _.Yj;this.connectedObs=this.xC=new _.fu(!1);this.z1=this.Ki=new _.Wt;this.wq=sud(this.endpoint,this.apiKey,e);this.F0a()}connect(){this.xC.value||this.wq.open()}disconnect(){this.wq.close()}send(a){this.xC.value?this.wq.send(this.NCa(a)):this.Ki.next({eventType:"channel_error",error:new _.ZJ(2,"Channel is not connected. Cannot send message")})}F0a(){this.wq&&(this.Rj.listen(this.wq,"Sd",this.jWa.bind(this)),\nthis.Rj.listen(this.wq,"Td",this.hza.bind(this)),this.Rj.listen(this.wq,"Vd",this.f$.bind(this)),this.Rj.listen(this.wq,"Ud",this.kza.bind(this)))}jWa(){this.xC.next(!0);this.Ki.next({eventType:"channel_open"})}hza(){this.Rj.removeAll();this.Ki.next({eventType:"channel_close"});this.Ki.complete();this.xC.next(!1);this.xC.complete()}f$(a){if(a.data&&Array.isArray(a.data)&&a.data.length!==0)if(a.ha==="status"){let b=_.HDb(a.data);b.mKa||this.Ki.next({eventType:"channel_error",error:new _.ZJ(1,`{status: ${b.statusCode}, message: ${b.statusMessage}}`),\nerrorDetail:JSON.stringify(a.data,void 0,2)})}else a=this.RTa(a.data[0]),this.Ki.next({eventType:"channel_message",message:a});else this.Ki.next({eventType:"channel_error",error:new _.ZJ(2,"Channel message received with empty data")})}kza(a){switch(a.status){case 1:this.Ki.next({eventType:"channel_error",error:new _.ZJ(4,"Network error")});break;case 2:this.Ki.next({eventType:"channel_error",error:new _.ZJ(3,"Server error")});break;default:this.Ki.next({eventType:"channel_error",error:new _.ZJ(2,\n"Unknown error")})}}}',
  aFd: 'class extends BHd{constructor(a,b,c,d={}){super(a,b,e=>e.serialize(),e=>_.Rh(_.Lo(c,(0,_.be)(e))),Object.assign({},{jBa:"application/json+protobuf"},d))}}',
  bFd: 'class extends BHd{constructor(a,b,c,d,e={}){super(a,b,f=>_.Qg(c(f)),f=>{f=typeof f==="string"?_.Ak(f):f;return d(f)},Object.assign({},{jBa:"application/x-protobuf"},e))}}',
  nKd: 'function(a,b,c="v1/llmBidiStreamProxy",d){return new CHd(`${a.ka}/${c}`,a.ha,b,...(d!==void 0?[d]:[]))}',
  IHd: 'class{constructor(a,b){this.connection=a;this.hasError=this.xD=this.ha=!1;this.Aa=0;this.Na=!1;this.wa=[];this.p6=!1;this.Va=this.wB=new _.Wt;this.Ja=this.ka=new _.Wt;this.Ua=this.Ca=new _.Wt;this.Ga=(b?this.connection.z1.pipe(_.wA(b)):this.connection.z1).subscribe(c=>{switch(c.eventType){case "channel_message":c=c.message;switch(_.Xh(c,_.$L)){case 2:c=_.bi(c,_.XJd,2,_.$L);var d,e,f;if(c=(d=_.bi(c,_.RJd,7,_.ZL))==null?void 0:(e=_.bi(d,_.QJd,1,_.SJd))==null?void 0:(f=_.PJd(e))==null?void 0:_.m(f,\n_.IF,4)){d=c;e=_.AL(d);if(e==null?0:_.n(e,2)){var g;f=e.ig()||((g=this.oa)==null?void 0:g.ig())||"";this.oa=g=_.Rh(_.NI(_.MI(new _.CI,f),_.n(e,2)));f&&!e.ig()&&(d=_.Lg(d),g=_.Gh(d,_.CI,2,g),d=_.Af(g))}else this.oa&&(g=(e==null?void 0:e.ig())||this.oa.ig(),e=_.n(this.oa,2),this.oa=g=_.Rh(_.NI(_.MI(new _.CI,g),e)),d=_.Lg(d),g=_.Gh(d,_.CI,2,g),d=_.Af(g));this.wB.next(d)}break;case 4:$Jd(this);this.ka.next(void 0);this.ka.complete();this.wB.complete();this.Ga.unsubscribe();this.connection.disconnect();\nbreak;case 5:$Jd(this),this.ka.next(void 0),this.ka.complete(),this.wB.complete()}break;case "channel_error":$Jd(this,!0);this.ka.next(c.error);this.wB.Ja&&this.wB.error(c.error);break;case "channel_close":$Jd(this);this.ka.next(void 0);this.wB.complete();this.Ca.complete();this.Ga.unsubscribe();break;case "channel_open":for(this.ha=!0;this.ha&&this.wa.length>0;)g=this.wa.shift(),this.connection.send(g);this.Ca.next()}})}connect(){this.connection.connect()}disconnect(){$Jd(this);this.Ga.unsubscribe();\nthis.wB.complete();this.Ca.complete();this.ka.complete();this.connection.disconnect()}Shc(a){this.Aa++;this.Na=!0;a=_.Rh(_.zJd(new _.WL,this.Aa).Ui(a));a=_.Rh((new _.JJd).Bg(a));if(this.ha)this.connection.send(a);else{let b,c;(c=(b=this.connection).Afc)==null||c.call(b,a);this.wa.push(a)}}}',
  wKd: 'function(a,b,c){if(a.wa){var d=Ctd(`${a.ka.ka}/v1/conversations:processSession`);let e=_.Nr([]);c=c==null?void 0:c.DS;d=new kKd(d,{SWb:e?e:void 0,apiKey:a.ka.ha,RWb:a.oa.Xx(),DS:c});return vKd(a,new dKd(d,b))}if(a.Aa)return d=oKd(a.ka,e=>KJd(e),e=>_.Rh(YJd(e)),c),vKd(a,new dKd(d,b));d=_.nKd(a.ka,_.Kzd,"v1/processSession",c);return vKd(a,new dKd(d,b))}',
  ybb: 'ybb(a){if(!hAd(a.request))throw Error("zk");var b=_.jMd(this,a);a.request.dLa||this.Wa.Ga.set(!1);var c=a.request,d=c.clientTurnId,e,f=(e=c.conversationId)!=null?e:"";e=c.cM;var g=c.ff===41&&(!e||e.deviceId===_.LAd(this.ob));OId(this.ka,d,_.BKd(this.Aa));\nreturn new _.st(k=>{var r={kBc:void 0,jBc:void 0,iBc:void 0},u={jBd:void 0,fge:new Set};UAd(this.zl);var w=new iMd(this.ob,f,g);hMd(w);var B=!1,C=dLd(this.Wd,b,a,{next:G=>{if(!B){if(w.enabled&&!w.ka&&!w.ha){var N=_.Dtd(G)?G.request.conversationId:G.responseType==="ROUTING"||G.responseType==="TURN_COMPLETED"||G.responseType==="CONTINUATION_UPDATE"?G.conversationId:void 0;N&&(w.ha=N,hMd(w))}k.next(G)}},error:G=>{B||(B=!0,this.ka.handleError(G instanceof Error?G:Error(String(G)),d),w.onComplete(),k.error(G))},\ncomplete:()=>{B||(B=!0,aJd(this.ka,d),w.onComplete(),k.complete())}},(G,N,T,aa)=>{if(_.BKd(this.Aa))a:{var da=this.Fb.get();if((da==null?0:da.isEnabled())&&N.sib!=="RECONNECT_TO_EXISTING_TURN"){let Jc=da.Oof();if(Jc){var ta=!N.dLa&&_.ZJd(Jc.connection);if(ta){{let Hc=cxd(Jc.Sec),ad=cxd(G);if(_.dk(Hc,ad))var ya=[];else{ya=[];uL(_.hGd(Hc),_.hGd(ad))||ya.push("IDENTIFIERS");uL(_.m(Hc,_.vL,72),_.m(ad,_.vL,72))||ya.push("CONTINUATION_IDENTIFIERS");_.ti(Hc,19)!==_.ti(ad,19)&&ya.push("REQUESTED_BARD_MODE");\n_.n(Hc,39)!==_.n(ad,39)&&ya.push("REQUESTED_MODE_ID");_.ti(Hc,80)===_.ti(ad,80)&&_.ti(Hc,76)===_.ti(ad,76)&&_.n(Hc,65)===_.n(ad,65)&&_.n(Hc,74)===_.n(ad,74)||ya.push("REQUESTED_MODE_CATEGORY");_.ti(Hc,81)!==_.ti(ad,81)&&ya.push("REQUESTED_THINKING_LEVEL");_.ti(Hc,50)!==_.ti(ad,50)&&ya.push("USER_SELECTED_FEATURE_MODE");_.ni(Hc,92)!==_.ni(ad,92)&&ya.push("SMART_MODEL_SELECTION");_.ni(Hc,97)!==_.ni(ad,97)&&ya.push("MANUAL_PICKER_OVERRIDE");_.ni(Hc,66)!==_.ni(ad,66)&&ya.push("SKIP_THINKING");uL(_.m(Hc,\n_.Ixd,42),_.m(ad,_.Ixd,42))||ya.push("MEMORY_OPTIONS");Hc.NIa()!==ad.NIa()&&ya.push("PERSONAL_CONTEXT_DISABLED");_.ni(Hc,46)!==_.ni(ad,46)&&ya.push("TEMPORARY_CHAT");var Ca=_.tL(Hc),Wa=_.tL(ad),eb,kb;((eb=Ca==null?void 0:_.mFd(Ca))!=null?eb:!1)!==((kb=Wa==null?void 0:_.mFd(Wa))!=null?kb:!1)&&ya.push("VOICE_ENTRY");var Cb,Ib;((Cb=Ca==null?void 0:_.ni(Ca,7))!=null?Cb:!1)!==((Ib=Wa==null?void 0:_.ni(Wa,7))!=null?Ib:!1)&&ya.push("ZERO_STATE_PROMPT");uL(_.m(Hc,_.Rv,34),_.m(ad,_.Rv,34))||ya.push("SYSTEM_QUERY");\nvar jc,Vb;dxd((jc=Ca==null?void 0:_.ci(Ca,_.ZK,4))!=null?jc:[],(Vb=Wa==null?void 0:_.ci(Wa,_.ZK,4))!=null?Vb:[])||ya.push("FILE_ATTACHMENTS");uL(Ca==null?void 0:_.m(Ca,_.sL,10),Wa==null?void 0:_.m(Wa,_.sL,10))||ya.push("ATTACHED_CONTEXT");(Ca==null?void 0:_.ti(Ca,11))!==(Wa==null?void 0:_.ti(Wa,11))&&ya.push("CONTEXTUAL_ACTION");dxd(_.ci(Hc,_.$y,10),_.ci(ad,_.$y,10))||ya.push("TOOL_MENTIONS");exd(_.ui(Hc,82),_.ui(ad,82))||ya.push("SELECTED_SKILL_IDS");exd(_.ui(Hc,96),_.ui(ad,96))||ya.push("SELECTED_FIRST_PARTY_SKILL_IDS");\nexd(_.ui(Hc,107),_.ui(ad,107))||ya.push("SELECTED_PLUGIN_IDS");_.n(Hc,70)!==_.n(ad,70)&&ya.push("SKILL_ID");_.ni(Hc,99)!==_.ni(ad,99)&&ya.push("CHROME_SKILLS_ENABLED");_.ni(Hc,12)===_.ni(ad,12)&&_.ni(Hc,54)===_.ni(ad,54)||ya.push("DISABLE_TOOLS_OR_QUIZ");dxd(_.ci(Hc,_.NG,9),_.ci(ad,_.NG,9))||ya.push("REQUEST_SCOPED_CONSENTS");uL(_.m(Hc,gud,55),_.m(ad,gud,55))&&uL(_.m(Hc,nud,56),_.m(ad,nud,56))||ya.push("INPUT_COMPANION");_.n(Hc,20)===_.n(ad,20)&&_.ni(Hc,37)===_.ni(ad,37)&&uL(_.m(Hc,_.hK,25),_.m(ad,\n_.hK,25))&&exd(_.ui(Hc,40),_.ui(ad,40))&&uL(_.m(Hc,pud,41),_.m(ad,pud,41))||ya.push("BOT_CONFIG_OR_METADATA");_.n(Hc,105)!==_.n(ad,105)&&ya.push("PROJECT_ID");var Lc;Ca=(Lc=_.m(Hc,_.EI,62))==null?void 0:Lc.clone();var bd;Lc=(bd=_.m(ad,_.EI,62))==null?void 0:bd.clone();var wd,Gd;((wd=Ca==null?void 0:_.oi(Ca,9))!=null?wd:0)!==((Gd=Lc==null?void 0:_.oi(Lc,9))!=null?Gd:0)&&ya.push("CAPTURED_REGIONS");Ca!=null&&_.Vh(Ca,9);Lc!=null&&_.Vh(Lc,9);!Ca&&!Lc||uL(Ca!=null?Ca:new _.EI,Lc!=null?Lc:new _.EI)||ya.push("GEMINI_IN_CHROME_METADATA");\nuL(_.m(Hc,_.gA,16),_.m(ad,_.gA,16))||ya.push("DEVICE_CONTEXT");uL(_.m(Hc,zyd,23),_.m(ad,zyd,23))||ya.push("REQUEST_LOGGING_METADATA");uL(_.m(Hc,Bud,43),_.m(ad,Bud,43))&&uL(_.m(Hc,Tud,71),_.m(ad,Tud,71))||ya.push("IMMERSIVE_OR_ARTIFACTS_CONTEXT");uL(_.m(Hc,hvd,63),_.m(ad,hvd,63))||ya.push("GOAL_INPUT");uL(_.m(Hc,_.V0c,102),_.m(ad,_.V0c,102))||ya.push("HIGHLIGHT_TO_ASK_CONTEXT");uL(_.m(Hc,Oyd,90),_.m(ad,Oyd,90))||ya.push("REMY_METADATA");uL(_.m(Hc,Myd,98),_.m(ad,Myd,98))||ya.push("DEEP_RESEARCH_METADATA");\nuL(_.m(Hc,ayd,86),_.m(ad,ayd,86))||ya.push("AGENTIC_SIGNIN_METADATA");uL(_.m(Hc,dGd,58),_.m(ad,dGd,58))||ya.push("COMPUTER_USE_METADATA");uL(_.m(Hc,qyd,87),_.m(ad,qyd,87))||ya.push("REMOTE_DEVICE_TARGET");Hc.tea()===ad.tea()&&uL(_.m(Hc,_.nLb,94),_.m(ad,_.nLb,94))&&_.n(Hc,103)===_.n(ad,103)&&_.n(Hc,108)===_.n(ad,108)&&uL(_.m(Hc,mxd,57),_.m(ad,mxd,57))||ya.push("PROMPT_SOURCE_OR_ID");uL(_.m(Hc,Lxd,85),_.m(ad,Lxd,85))||ya.push("FOLLOW_UP_METADATA");_.ti(Hc,73)===_.ti(ad,73)&&uL(_.m(Hc,_.e2c,64),_.m(ad,\n_.e2c,64))&&_.ti(Hc,100)===_.ti(ad,100)&&_.oi(Hc,104)===_.oi(ad,104)||ya.push("REGENERATE");uL(_.m(Hc,lyd,18),_.m(ad,lyd,18))||ya.push("TURN_INDEX");uL(_.m(Hc,_.mG,2),_.m(ad,_.mG,2))&&uL(_.m(Hc,_.RI,7),_.m(ad,_.RI,7))&&_.ti(Hc,69)===_.ti(ad,69)||ya.push("THEME_OR_LOCALE");exd(_.Ek(Hc,31),_.Ek(ad,31))||ya.push("CLIENT_CAPABILITIES");ya.length===0&&ya.push("OTHER")}}}else ya=["CONNECTION_UNUSABLE"];if(ta&&ya.length===0){_.NAd(this.Fc,"CONSUMED",Jc.ri);MAd(this.Fc,this.Na.now()-Jc.VM,Jc.ri,!0);da.IDc();\nG=pMd(this,Jc.connection,G,N,T,r,u,aa);break a}_.aM(Jc.connection);_.NAd(this.Fc,"MISMATCH",Jc.ri);for(let Hc of ya)ta=this.Fc,ta.Sd.increment(Hc,Jc.ri||"undefined",ta.requestSource);MAd(this.Fc,this.Na.now()-Jc.VM,Jc.ri,!1);da.IDc()}else da=da.IDc(),da!==void 0&&MAd(this.Fc,this.Na.now()-da,N.ri,!1)}G=oMd(this,G,N,T,r,u,aa)}else G=mMd(this,G,N,T,r,u,aa);return G});return()=>{w.onComplete();C();VAd(this.zl)}})}',
} as const;

// These are live method/getter pins, independent of constructor source text.
const methods = {
  kM: { get: 'get(){return this.ha}', register: 'register(a){this.ha=a}' },
  CUd: {
    isEnabled: 'isEnabled(){return!this.kb&&_.BKd(this.Va)}',
    IDc: 'IDc(){var a=this.Ja;this.Ja=void 0;return a}',
    Oof: 'Oof(){this.wa=void 0;var a=this.ha;if(a){YPk(this);a.bEd.unsubscribe();this.ha=void 0;this.ka=!1;if(_.ZJd(a.connection))return{connection:a.connection,Sec:a.Sec,ri:a.ri,VM:a.VM};let b=a.connection.hasError;a.connection.disconnect();_.NAd(this.Fc,b?"CHANNEL_ERROR":"CHANNEL_CLOSED",a.ri)}}',
  },
  ot: {
    unsubscribe:
      'unsubscribe(){if(!this.closed){this.closed=!0;let c=this.oa;if(Array.isArray(c))for(var a of c)a.remove(this);else c==null||c.remove(this);a=this.Na;if(_.pt(a))try{a()}catch(e){var b=e instanceof qnb?e.errors:[e]}let d=this.wa;if(d){this.wa=null;for(let e of d)try{_.pt(e)?e():e.unsubscribe()}catch(f){let g;b=(g=b)!=null?g:[];f instanceof qnb?b=[...b,...f.errors]:b.push(f)}}if(b)throw new qnb(b);}}',
    add: 'add(a){if(a&&a!==this)if(this.closed)_.pt(a)?a():\na.unsubscribe();else{if(a instanceof _.qt){if(a.closed||a.Ha(this))return;a.Ga(this)}let b;(this.wa=(b=this.wa)!=null?b:[]).push(a)}}',
    Ha: 'Ha(a){var b=this.oa;return b===a||Array.isArray(b)&&b.includes(a)}',
    Ga: 'Ga(a){var b=this.oa;this.oa=Array.isArray(b)?(b.push(a),b):b?[b,a]:a}',
    Ja: 'Ja(a){var b=this.oa;b===a?this.oa=null:Array.isArray(b)&&Nlb(b,a)}',
    remove: 'remove(a){var b=this.wa;b&&Nlb(b,a);a instanceof _.qt&&a.Ja(this)}',
  },
  onb: {
    next: 'next(a){this.Zs||this.Pj(a)}',
    error: 'error(a){this.Zs||(this.Zs=!0,this.a7a(a))}',
    complete: 'complete(){this.Zs||(this.Zs=!0,this.ha())}',
    unsubscribe: 'unsubscribe(){this.closed||(this.Zs=!0,super.unsubscribe())}',
    Pj: 'Pj(a){this.destination.next(a)}',
    a7a: 'a7a(a){this.destination.error(a);this.unsubscribe()}',
    ha: 'ha(){this.destination.complete();this.unsubscribe()}',
  },
  qt: {
    subscribe:
      'subscribe(a,b,c){a=a&&a instanceof snb||a&&_.pt(a.next)&&_.pt(a.error)&&_.pt(a.complete)&&Olb(a)?a:new _.omb(a,b,c);b=this.operator;c=this.source;a.add(b?b.call(a,c):c?this.ha(a):this.Ca(a));return a}',
    pipe: 'pipe(...a){return a.length?_.Rlb(a)(this):this}',
    Ca: 'Ca(a){try{return this.ha(a)}catch(b){a.error(b)}}',
    ha: 'ha(a){var b;return(b=this.source)==\nnull?void 0:b.subscribe(a)}',
  },
  Rt: {
    ka: 'ka(){if(this.closed)throw new unb;}',
    Ca: 'Ca(a){this.ka();return super.Ca(a)}',
    ha: 'ha(a){this.ka();this.Aa(a);return this.Ga(a)}',
    Ga: 'Ga(a){var b=this.Zs,c=this.observers;return this.hasError||b?_.qt.ha:(c.push(a),new _.qt(()=>Nlb(this.observers,a)))}',
    Aa: 'Aa(a){var b=this.oa,c=this.Zs;this.hasError?a.error(b):c&&a.complete()}',
    next: 'next(a){this.ka();if(!this.Zs){let b=this.observers.slice();for(let c of b)c.next(a)}}',
    error:
      'error(a){this.ka();if(!this.Zs){this.hasError=this.Zs=!0;this.oa=a;let b=this.observers;for(;b.length;)b.shift().error(a)}}',
    complete:
      'complete(){this.ka();if(!this.Zs){this.Zs=!0;let a=this.observers;for(;a.length;)a.shift().complete()}}',
  },
  $t: {
    getValue: 'getValue(){var a=this.oa,b=this.Sm;if(this.hasError)throw a;this.ka();return b}',
    ha: 'ha(a){var b=super.ha(a);!b.closed&&a.next(this.Sm);return b}',
    next: 'next(a){super.next(this.Sm=a)}',
  },
  IHd: {
    connect: 'connect(){this.connection.connect()}',
    disconnect:
      'disconnect(){$Jd(this);this.Ga.unsubscribe();\nthis.wB.complete();this.Ca.complete();this.ka.complete();this.connection.disconnect()}',
  },
  connection: {
    connect: 'connect(){this.xC.value||this.wq.open()}',
    disconnect: 'disconnect(){this.wq.close()}',
    F0a: 'F0a(){this.wq&&(this.Rj.listen(this.wq,"Sd",this.jWa.bind(this)),\nthis.Rj.listen(this.wq,"Td",this.hza.bind(this)),this.Rj.listen(this.wq,"Vd",this.f$.bind(this)),this.Rj.listen(this.wq,"Ud",this.kza.bind(this)))}',
    hza: 'hza(){this.Rj.removeAll();this.Ki.next({eventType:"channel_close"});this.Ki.complete();this.xC.next(!1);this.xC.complete()}',
  },
} as const;

const construction = {
  Uba: 'function(a,b,c,d,e){this.listener=a;this.proxy=null;this.src=b;this.type=c;this.capture=!!d;this.handler=e;this.key=++Tba;this.removed=this.E8a=!1}',
  ke: 'function(a){return!(!a||!a[_.zga])}',
  Ed: 'function(a){var b=typeof a;return b=="object"&&a!=null||b=="function"}',
  Gga: 'function(a){if(typeof a==="function")return a;a[Nga]||(a[Nga]=function(b){return a.handleEvent(b)});return a[Nga]}',

  Eb: 'function(){this.r5=this.r5;this.n_a=this.n_a}',
  Rb: 'function(a){this.src=a;this.listeners={};this.ha=0}',
  Yb: 'function(){_.Eb.call(this);this.Xpa=new _.Rb(this);this.Rgf=this;this.F1c=null}',
  Hb: 'function(a,b){this.type=a instanceof _.Gb?String(a):a;this.currentTarget=this.target=b;this.defaultPrevented=this.ka=!1}',
  pt: 'function(a){return typeof a==="function"}',
  Rlb: 'function(a){return a.length===0?_.rt:a.length===1?a[0]:function(b){return a.reduce((c,d)=>d(c),b)}}',
  wA: 'function(a){a||(a=_.x(_.xx));var b=new _.st(c=>{if(a.dg)c.next();else return a.Uc(c.next.bind(c))});return c=>c.pipe(_.au(b))}',
  me: 'function(a,b,c,d,e){if(d&&d.once)return _.le(a,b,c,d,e);if(Array.isArray(b)){for(let f=0;f<b.length;f++)_.me(a,b[f],c,d,e);return null}c=_.Gga(c);return _.ke(a)?a.listen(b,c,_.Ed(d)?!!d.capture:!!d,e):Hga(a,b,c,!1,d,e)}',
  Kb: 'function(a,b,c){for(let d in a)b.call(c,a[d],d,a)}',
  oe: 'function(a){if(typeof a==="number"||!a||a.removed)return!1;var b=a.src;if(_.ke(b))return b.s4(a);var c=a.type,d=a.proxy;b.removeEventListener?b.removeEventListener(c,d,a.capture):b.detachEvent?b.detachEvent(Kga(c),d):b.addListener&&b.removeListener&&b.removeListener(d);Fga--;(c=_.Iga(b))?(Cga(c,a),c.ha==0&&(c.src=null,b[Dga]=null)):Aga(a);return!0}',
} as const;

const eventMethods = {
  listen: 'function(a,b,c,d){return this.Xpa.add(String(a),b,!1,c,d)}',
  s4: 'function(a){return Cga(this.Xpa,a)}',
  zqa: 'function(){return this.F1c}',
  dispatchEvent:
    'function(a){var b,c=this.zqa();if(c)for(b=[];c;c=c.zqa())b.push(c);c=this.Rgf;var d=a.type||a;if(typeof a==="string")a=new _.Hb(a,c);else if(a instanceof _.Hb)a.target=a.target||c;else{var e=a;a=new _.Hb(d,c);_.Qb(a,e)}e=!0;var f;if(b)for(f=b.length-1;!a.ka&&f>=0;f--){var g=a.currentTarget=b[f];e=g.hbb(d,!0,a)&&e}a.ka||(g=a.currentTarget=c,e=g.hbb(d,!0,a)&&e,a.ka||(e=g.hbb(d,!1,a)&&e));if(b)for(f=0;!a.ka&&f<b.length;f++)g=a.currentTarget=b[f],e=g.hbb(d,!1,a)&&e;return e}',
  hbb: 'function(a,b,c){a=this.Xpa.listeners[String(a)];if(!a)return!0;a=a.concat();var d=!0;for(let e=0;e<a.length;++e){let f=a[e];if(f&&!f.removed&&f.capture==b){let g=f.listener,k=f.handler||f.src;f.E8a&&this.s4(f);d=g.call(k,c)!==!1&&d}}return d&&!c.defaultPrevented}',
} as const;

const xhrSources = {
  send: 'function(a,b,c,d){if(this.vk)throw Error("Xb`"+this.NAa+"`"+a);if(typeof b==="string")var e=b;else if(b){var f=b;e=f.method;c!=null||(c=f.body);d!=null||(d=f.headers)}e=e?e.toUpperCase():"GET";this.NAa=a;this.IG="";this.I6=0;this.WIc=!1;this.qE=!0;this.vk=this.rub(f);this.vk.onreadystatechange=(0,_.qe)((0,_.$b)(this.O8d,this));this.p5f&&"onprogress"in this.vk&&(this.vk.onprogress=(0,_.qe)((0,_.$b)(function(k){this.N8d(k,!0)},this)),this.vk.upload&&(this.vk.upload.onprogress=(0,_.qe)((0,_.$b)(this.N8d,\nthis))));try{this.EPc=!0,this.vk.open(e,String(a),!0),this.EPc=!1}catch(k){this.Cq(5,k);return}a=c||"";b=new Map(this.headers);if(d)if(Object.getPrototypeOf(d)===Object.prototype)for(var g in d)b.set(g,d[g]);else if(typeof d.keys==="function"&&typeof d.get==="function")for(let k of d.keys())b.set(k,d.get(k));else throw Error("Yb`"+String(d));d=Array.from(b.keys()).find(k=>"content-type"==k.toLowerCase());g=_.fa.FormData&&a instanceof _.fa.FormData;!_.xa(_.xta,e)||d||g||b.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");\nfor(let [k,r]of b)this.vk.setRequestHeader(k,r);this.tI&&(this.vk.responseType=this.tI);"withCredentials"in this.vk&&this.vk.withCredentials!==this.eD&&(this.vk.withCredentials=this.eD);if("setTrustToken"in this.vk&&this.Pcd)try{this.vk.setTrustToken(this.Pcd)}catch(k){}if("setAttributionReporting"in this.vk&&this.Tzc)try{this.vk.setAttributionReporting(this.Tzc)}catch(k){}try{this.Pua&&(clearTimeout(this.Pua),this.Pua=null),this.nmb>0&&(this.Pua=setTimeout(this.kH.bind(this),this.nmb)),this.K6b=\n!0,this.vk.send(a),this.K6b=!1}catch(k){this.Cq(5,k)}}',
  rub: 'function(a){return this.BPb?this.BPb.g9(a):_.aja.g9()}',
  O8d: 'function(){this.isDisposed()||(this.EPc||this.K6b||this.TWa?Cta(this):this.Y_c())}',
  constructor:
    'function(a){_.Yb.call(this);this.headers=new Map;this.BPb=a||null;this.qE=!1;this.vk=null;this.NAa="";this.I6=0;this.IG="";this.TWa=this.EPc=this.K6b=this.WIc=!1;this.nmb=0;this.Pua=null;this.tI="";this.p5f=this.eD=!1;this.Tzc=this.Pcd=null}',
  xI: 'function(a){this.eD=a}',
  uea: 'function(){return this.vk?this.vk.readyState:0}',
  J1: 'function(){return this.I6}',
  Ln: 'function(){try{return this.vk?this.vk.responseText:""}catch(a){return""}}',
  getStatus: 'function(){try{return this.uea()>2?this.vk.status:-1}catch(a){return-1}}',
  Wu: 'function(){return this.uea()==4}',
  getResponseHeader:
    'function(a){if(this.vk&&this.Wu())return a=this.vk.getResponseHeader(a),a===null?void 0:a}',
  getResponse:
    'function(){try{if(!this.vk)return null;if("response"in this.vk)return this.vk.response;switch(this.tI){case "":case "text":return this.vk.responseText;case "arraybuffer":if("mozResponseArrayBuffer"in this.vk)return this.vk.mozResponseArrayBuffer}return null}catch(a){return null}}',
  Hc: 'function(){this.vk&&(this.qE&&(this.qE=!1,this.TWa=!0,this.vk.abort(),this.TWa=!1),Bta(this,!0));_.Vj.oe.Hc.call(this)}',
  Cq: 'function(a,b){this.qE=!1;this.vk&&(this.TWa=!0,this.vk.abort(),this.TWa=!1);this.IG=b;this.I6=a;Ata(this);Bta(this)}',
  getAllResponseHeaders:
    'function(){return this.vk&&this.uea()>=2?this.vk.getAllResponseHeaders()||"":""}',
  uG: 'function(){var a={},b=this.getAllResponseHeaders().split("\\r\\n");for(let d=0;d<b.length;d++){if(_.ja(b[d]))continue;var c=_.Iha(b[d],":",1);let e=c[0];c=c[1];if(typeof c!=="string")continue;c=c.trim();let f=a[e]||[];a[e]=f;f.push(c)}return _.Lb(a,function(d){return d.join(", ")})}',
  abort:
    'function(a){this.vk&&this.qE&&(this.qE=!1,this.TWa=!0,this.vk.abort(),this.TWa=!1,this.I6=a||7,this.dispatchEvent("complete"),this.dispatchEvent("abort"),Bta(this))}',
} as const;

const physicalSources = {
  Kh: 'function(){this.Va!=null&&(this.Va=null,klb(this),llb(this),kt(19))}',
  Ei: 'function(){if(this.kb){this.kb=null;this.ha.info("BP detection timeout reached.");if(this.ka.ha!=null){let a=this.ka.ha.Ln();a&&this.ha.warning("Timer should have been cancelled : "+a)}this.ha.info("Buffering proxy detected and switch to long-polling!");this.Eb=!1;this.Yb=!0;kt(10);klb(this);Glb(this)}else this.ha.warning("Invalid operation.")}',
  qf: 'function(){this.Ja=null;Glb(this);if(this.Fd&&!this.Yb)if(this.ka==null||this.Fb<=0)this.ha.warning("Skip bpDetectionTimerId_ "+this.ka+" "+this.Fb);else{var a=4*this.Fb;this.ha.info("BP detection timer enabled: "+a);this.kb=ykb((0,_.$b)(this.Ei,this),a)}}',
  Jf: 'function(a){if(this.Ca)if(this.Ca=null,this.ha.debug("startForwardChannel_"),this.hU==1){if(!a){this.ha.debug("open_()");this.Gb=Math.floor(Math.random()*1E5);a=this.Gb++;let e=new lt(this,this.ha,"",a),f=this.Na;this.Nc&&(f?(f=_.Pb(f),_.Qb(f,this.Nc)):f=this.Nc);this.Ga!==null||this.Zb||(e.ob=f,f=null);if(this.Ac)a:{var b=0;for(var c=0;c<this.oa.length;c++){b:{var d=this.oa[c];if("__data__"in d.map&&(d=d.map.__data__,typeof d==="string")){d=d.length;break b}d=void 0}if(d===void 0)break;\nb+=d;if(b>4096){b=c;break a}if(b===4096||c===this.oa.length-1){b=c+1;break a}}b=this.Wd}else b=this.Wd;b=Elb(this,e,b);c=this.ub.clone();_.Eg(c,"RID",a);_.Eg(c,"CVER",22);this.mb&&_.Eg(c,"X-HTTP-Session-Id",this.mb);Alb(this,c);f&&(this.Zb?b="headers="+_.ld(xlb(f))+"&"+b:this.Ga&&_.ylb(c,this.Ga,f));olb(this.Aa,e);this.Qh&&_.Eg(c,"TYPE","init");this.Ac?(_.Eg(c,"$req",b),_.Eg(c,"SID","null"),e.Ac=!0,Skb(e,c,null)):Skb(e,c,b);this.hU=2}}else this.hU==3&&(a?Flb(this,a):this.oa.length==0?this.ha.debug("startForwardChannel_ returned: nothing to send"):\nulb(this.Aa)||(Flb(this),this.ha.debug("startForwardChannel_ finished, sent request")))}',
  Pc: 'function(){this.Va=null;var a=Date.now();a-this.Tb>=0?(Nkb(this.ka,this.Ga),this.mb!=2&&(ukb(3),kt(17)),alb(this),this.IG=2,blb(this)):(this.ka.warning("WatchDog timer called too early"),hlb(this,this.Tb-a))}',
  oc: 'function(a){try{a==this.ha?Vkb(this):this.ka.warning("Called back with an unexpected xmlhttp")}catch(b){this.ka.debug("Failed call to OnXmlHttpReadyStateChanged_"),Wkb(this)}finally{}}',
  Xc: 'function(a){a=a.target;var b=this.Ab;b&&a.uea()==3?(this.ka.debug("Throttling readystatechange."),b.fire()):this.oc(a)}',
  bt: 'function(a,b,c,d,e){this.Aa=a;this.ka=b;this.Zc=c;this.oa=d;this.Gb=e||1;this.Zb=new _.Yj(this);this.kH=45E3;this.ob=null;this.Ha=!1;this.Ca=this.Ga=this.Ua=this.mb=this.Wa=this.Tb=this.Va=null;this.Za=[];this.ha=null;this.Na=0;this.IG=this.Ja=null;this.Fb=-1;this.kb=!1;this.Yb=0;this.Ab=null;this.Nc=this.ub=this.Ac=this.Eb=!1;this.wa=new Akb}',
  lc: 'function(a,b,c){return a.call.apply(a.bind,arguments)}',
  xjd: 'function(){this.ha.dispatchEvent("Sd")}',
} as const;

// Admits the original cold graph, its two messages, and source-owned physical recovery.
const lifecycleSources = {
  WVb: 'class extends _.Kx{get dg(){return this.jg}constructor(a,b,c,d){super();this.parent=b;this.source=c;this.scopes=d;this.Pn=new Map;this.ixc=new Set;this.uqb=[];this.jg=!1;PNb(a,e=>yWb(this,e));this.Pn.set(vWb,KNb(void 0,this));d.has("environment")&&this.Pn.set(_.Kx,KNb(void 0,this));a=this.Pn.get(_.wWb);a!=null&&typeof a.value==="string"&&this.scopes.add(a.value);this.BWd=new Set(this.get(ANb,_.Jw,{self:!0}))}xCa(a,b){b=_.lNb(b)||0;try{return this.get(a,_.uWb,b)}catch(c){if(_.qf(c))return c;\nthrow c;}}destroy(){_.ONb(this);this.jg=!0;var a=_.cw(null);try{for(let c of this.ixc)c.Lb();let b=this.uqb;this.uqb=[];for(let c of b)c()}finally{this.Pn.clear(),this.ixc.clear(),this.BWd.clear(),_.cw(a)}}Uc(a){_.ONb(this);this.uqb.push(a);return()=>{var b=this.uqb.indexOf(a);b!==-1&&this.uqb.splice(b,1)}}get(a,b=_.uWb,c){_.ONb(this);if(Object.hasOwn(a,tWb))return a[tWb](this);c=_.lNb(c);var d=_.nf(this),e=_.Ew();try{if(!(c&4)){let r=this.Pn.get(a);if(r===void 0){let u=(typeof a==="function"||typeof a===\n"object"&&a.BZc==="InjectionToken")&&_.SMb(a);var f;if(f=u)if(u.hb){var g=_.Gw(u.hb);f=typeof g==="string"?g==="any"||this.scopes.has(g):this.BWd.has(g)}else f=!1;f?r=KNb(JNb(a),MNb):r=null;this.Pn.set(a,r)}if(r!=null)return this.u6b(r,c)}let k=c&2?_.HNb():this.parent;b=c&8&&b===_.uWb?null:b;return k.get(a,b)}catch(k){let r=k[dNb];if(r===-200||r===-201)throw new _.Cw(r,null);throw k;}finally{_.Ew(e),_.nf(d)}}Y0a(){var a=_.cw(null),b=_.nf(this),c=_.Ew();try{let d=this.get(_.BNb,_.Jw,{self:!0});for(let e of d)e()}finally{_.nf(b),\n_.Ew(c),_.cw(a)}}toString(){return"R3Injector[...]"}u6b(a,b){var c=_.cw(null);try{if(a.value===xWb)throw fNb(-200);a.value===MNb&&(a.value=xWb,a.value=a.Xa(void 0,b));var d;if(d=typeof a.value==="object"&&a.value){var e=a.value;d=e!==null&&typeof e==="object"&&typeof e.Lb==="function"}d&&this.ixc.add(a.value);return a.value}finally{_.cw(c)}}}',
  pnb: 'class{constructor(a){this.ha=a}next(a){var b=this.ha;if(b.next)try{b.next(a)}catch(c){Qlb(c)}}error(a){var b=this.ha;if(b.error)try{b.error(a)}catch(c){Qlb(c)}else Qlb(a)}complete(){var a=this.ha;if(a.complete)try{a.complete()}catch(b){Qlb(b)}}}',
  rnb: 'class extends _.Wt{constructor(a,b){super();this.destination=a;this.source=b}next(a){var b,c;(b=this.destination)==null||(c=b.next)==null||c.call(b,a)}error(a){var b,c;(b=this.destination)==null||(c=b.error)==null||c.call(b,a)}complete(){var a,b;(a=this.destination)==null||(b=a.complete)==null||b.call(a)}ha(a){var b,c;return(c=(b=this.source)==null?void 0:b.subscribe(a))!=null?c:_.qt.ha}}',
  GOb: 'class extends _.xx{constructor(){var a=_.y();super();this.Qs=a}get dg(){return _.Nw(this.Qs)}Uc(a){var b=this.Qs;_.cOb(b,a);return()=>_.dOb(b,a)}}',
  zt: 'class extends snb{constructor(a,b,c,d,e){super(a);this.Ca=e;b&&(this.Pj=function(f){try{b(f)}catch(g){this.destination.error(g)}});c&&(this.a7a=function(f){try{c(f)}catch(g){this.destination.error(g)}this.unsubscribe()});d&&(this.ha=function(){try{d()}catch(f){this.destination.error(f)}this.unsubscribe()})}unsubscribe(){var a;this.closed||(a=this.Ca)!=null&&a.call(this);super.unsubscribe()}}',
  au: 'function(a){return _.xt((b,c)=>{_.tt(a).subscribe(new _.zt(c,()=>c.complete(),void 0,_.Plb));!c.closed&&b.subscribe(c)})}',
  Tt: 'function(a){return a<=0?()=>_.It:_.xt((b,c)=>{var d=0;b.subscribe(new _.zt(c,e=>{++d<=a&&(c.next(e),a<=d&&c.complete())}))})}',
  xt: 'function(a){return b=>{if(_.pt(b==null?void 0:b.lift))return b.lift(function(c){try{return a(c,this)}catch(d){this.error(d)}});throw new TypeError("ch");}}',
  tt: 'function(a){if(a instanceof _.st)return a;if(a!=null){if(_.pt(a[Ylb]))return dmb(a);if(_.bmb(a))return emb(a);if(_.pt(a==null?void 0:a.then))return fmb(a);if(Symbol.asyncIterator&&_.pt(a==null?void 0:a[Symbol.asyncIterator]))return gmb(a);if(_.pt(a==null?void 0:a[Wlb]))return hmb(a)}throw amb(a);}',
  Plb: 'function(){}',
  Nw: 'function(a){return(a[2]&256)===256}',
  cOb: 'function(a,b){if(_.Nw(a))throw new _.Cw(911,!1);a[21]===null&&(a[21]=[]);a[21].push(b)}',
  dOb: 'function(a,b){a[21]!==null&&(b=a[21].indexOf(b),b!==-1&&a[21].splice(b,1))}',
  lift: 'lift(a){var b=new vnb(this,this);b.operator=a;return b}',
  ntUnsubscribe:
    'unsubscribe(){var a;this.closed||(a=this.Ca)!=null&&a.call(this);super.unsubscribe()}',
  ntNext: 'function(f){try{b(f)}catch(g){this.destination.error(g)}}',
  ntComplete: 'function(){try{d()}catch(f){this.destination.error(f)}this.unsubscribe()}',
  mtOperator:
    'b=>{if(_.pt(b==null?void 0:b.lift))return b.lift(function(c){try{return a(c,this)}catch(d){this.error(d)}});throw new TypeError("ch");}',
  producer:
    'k=>{var r={kBc:void 0,jBc:void 0,iBc:void 0},u={jBd:void 0,fge:new Set};UAd(this.zl);var w=new iMd(this.ob,f,g);hMd(w);var B=!1,C=dLd(this.Wd,b,a,{next:G=>{if(!B){if(w.enabled&&!w.ka&&!w.ha){var N=_.Dtd(G)?G.request.conversationId:G.responseType==="ROUTING"||G.responseType==="TURN_COMPLETED"||G.responseType==="CONTINUATION_UPDATE"?G.conversationId:void 0;N&&(w.ha=N,hMd(w))}k.next(G)}},error:G=>{B||(B=!0,this.ka.handleError(G instanceof Error?G:Error(String(G)),d),w.onComplete(),k.error(G))},\ncomplete:()=>{B||(B=!0,aJd(this.ka,d),w.onComplete(),k.complete())}},(G,N,T,aa)=>{if(_.BKd(this.Aa))a:{var da=this.Fb.get();if((da==null?0:da.isEnabled())&&N.sib!=="RECONNECT_TO_EXISTING_TURN"){let Jc=da.Oof();if(Jc){var ta=!N.dLa&&_.ZJd(Jc.connection);if(ta){{let Hc=cxd(Jc.Sec),ad=cxd(G);if(_.dk(Hc,ad))var ya=[];else{ya=[];uL(_.hGd(Hc),_.hGd(ad))||ya.push("IDENTIFIERS");uL(_.m(Hc,_.vL,72),_.m(ad,_.vL,72))||ya.push("CONTINUATION_IDENTIFIERS");_.ti(Hc,19)!==_.ti(ad,19)&&ya.push("REQUESTED_BARD_MODE");\n_.n(Hc,39)!==_.n(ad,39)&&ya.push("REQUESTED_MODE_ID");_.ti(Hc,80)===_.ti(ad,80)&&_.ti(Hc,76)===_.ti(ad,76)&&_.n(Hc,65)===_.n(ad,65)&&_.n(Hc,74)===_.n(ad,74)||ya.push("REQUESTED_MODE_CATEGORY");_.ti(Hc,81)!==_.ti(ad,81)&&ya.push("REQUESTED_THINKING_LEVEL");_.ti(Hc,50)!==_.ti(ad,50)&&ya.push("USER_SELECTED_FEATURE_MODE");_.ni(Hc,92)!==_.ni(ad,92)&&ya.push("SMART_MODEL_SELECTION");_.ni(Hc,97)!==_.ni(ad,97)&&ya.push("MANUAL_PICKER_OVERRIDE");_.ni(Hc,66)!==_.ni(ad,66)&&ya.push("SKIP_THINKING");uL(_.m(Hc,\n_.Ixd,42),_.m(ad,_.Ixd,42))||ya.push("MEMORY_OPTIONS");Hc.NIa()!==ad.NIa()&&ya.push("PERSONAL_CONTEXT_DISABLED");_.ni(Hc,46)!==_.ni(ad,46)&&ya.push("TEMPORARY_CHAT");var Ca=_.tL(Hc),Wa=_.tL(ad),eb,kb;((eb=Ca==null?void 0:_.mFd(Ca))!=null?eb:!1)!==((kb=Wa==null?void 0:_.mFd(Wa))!=null?kb:!1)&&ya.push("VOICE_ENTRY");var Cb,Ib;((Cb=Ca==null?void 0:_.ni(Ca,7))!=null?Cb:!1)!==((Ib=Wa==null?void 0:_.ni(Wa,7))!=null?Ib:!1)&&ya.push("ZERO_STATE_PROMPT");uL(_.m(Hc,_.Rv,34),_.m(ad,_.Rv,34))||ya.push("SYSTEM_QUERY");\nvar jc,Vb;dxd((jc=Ca==null?void 0:_.ci(Ca,_.ZK,4))!=null?jc:[],(Vb=Wa==null?void 0:_.ci(Wa,_.ZK,4))!=null?Vb:[])||ya.push("FILE_ATTACHMENTS");uL(Ca==null?void 0:_.m(Ca,_.sL,10),Wa==null?void 0:_.m(Wa,_.sL,10))||ya.push("ATTACHED_CONTEXT");(Ca==null?void 0:_.ti(Ca,11))!==(Wa==null?void 0:_.ti(Wa,11))&&ya.push("CONTEXTUAL_ACTION");dxd(_.ci(Hc,_.$y,10),_.ci(ad,_.$y,10))||ya.push("TOOL_MENTIONS");exd(_.ui(Hc,82),_.ui(ad,82))||ya.push("SELECTED_SKILL_IDS");exd(_.ui(Hc,96),_.ui(ad,96))||ya.push("SELECTED_FIRST_PARTY_SKILL_IDS");\nexd(_.ui(Hc,107),_.ui(ad,107))||ya.push("SELECTED_PLUGIN_IDS");_.n(Hc,70)!==_.n(ad,70)&&ya.push("SKILL_ID");_.ni(Hc,99)!==_.ni(ad,99)&&ya.push("CHROME_SKILLS_ENABLED");_.ni(Hc,12)===_.ni(ad,12)&&_.ni(Hc,54)===_.ni(ad,54)||ya.push("DISABLE_TOOLS_OR_QUIZ");dxd(_.ci(Hc,_.NG,9),_.ci(ad,_.NG,9))||ya.push("REQUEST_SCOPED_CONSENTS");uL(_.m(Hc,gud,55),_.m(ad,gud,55))&&uL(_.m(Hc,nud,56),_.m(ad,nud,56))||ya.push("INPUT_COMPANION");_.n(Hc,20)===_.n(ad,20)&&_.ni(Hc,37)===_.ni(ad,37)&&uL(_.m(Hc,_.hK,25),_.m(ad,\n_.hK,25))&&exd(_.ui(Hc,40),_.ui(ad,40))&&uL(_.m(Hc,pud,41),_.m(ad,pud,41))||ya.push("BOT_CONFIG_OR_METADATA");_.n(Hc,105)!==_.n(ad,105)&&ya.push("PROJECT_ID");var Lc;Ca=(Lc=_.m(Hc,_.EI,62))==null?void 0:Lc.clone();var bd;Lc=(bd=_.m(ad,_.EI,62))==null?void 0:bd.clone();var wd,Gd;((wd=Ca==null?void 0:_.oi(Ca,9))!=null?wd:0)!==((Gd=Lc==null?void 0:_.oi(Lc,9))!=null?Gd:0)&&ya.push("CAPTURED_REGIONS");Ca!=null&&_.Vh(Ca,9);Lc!=null&&_.Vh(Lc,9);!Ca&&!Lc||uL(Ca!=null?Ca:new _.EI,Lc!=null?Lc:new _.EI)||ya.push("GEMINI_IN_CHROME_METADATA");\nuL(_.m(Hc,_.gA,16),_.m(ad,_.gA,16))||ya.push("DEVICE_CONTEXT");uL(_.m(Hc,zyd,23),_.m(ad,zyd,23))||ya.push("REQUEST_LOGGING_METADATA");uL(_.m(Hc,Bud,43),_.m(ad,Bud,43))&&uL(_.m(Hc,Tud,71),_.m(ad,Tud,71))||ya.push("IMMERSIVE_OR_ARTIFACTS_CONTEXT");uL(_.m(Hc,hvd,63),_.m(ad,hvd,63))||ya.push("GOAL_INPUT");uL(_.m(Hc,_.V0c,102),_.m(ad,_.V0c,102))||ya.push("HIGHLIGHT_TO_ASK_CONTEXT");uL(_.m(Hc,Oyd,90),_.m(ad,Oyd,90))||ya.push("REMY_METADATA");uL(_.m(Hc,Myd,98),_.m(ad,Myd,98))||ya.push("DEEP_RESEARCH_METADATA");\nuL(_.m(Hc,ayd,86),_.m(ad,ayd,86))||ya.push("AGENTIC_SIGNIN_METADATA");uL(_.m(Hc,dGd,58),_.m(ad,dGd,58))||ya.push("COMPUTER_USE_METADATA");uL(_.m(Hc,qyd,87),_.m(ad,qyd,87))||ya.push("REMOTE_DEVICE_TARGET");Hc.tea()===ad.tea()&&uL(_.m(Hc,_.nLb,94),_.m(ad,_.nLb,94))&&_.n(Hc,103)===_.n(ad,103)&&_.n(Hc,108)===_.n(ad,108)&&uL(_.m(Hc,mxd,57),_.m(ad,mxd,57))||ya.push("PROMPT_SOURCE_OR_ID");uL(_.m(Hc,Lxd,85),_.m(ad,Lxd,85))||ya.push("FOLLOW_UP_METADATA");_.ti(Hc,73)===_.ti(ad,73)&&uL(_.m(Hc,_.e2c,64),_.m(ad,\n_.e2c,64))&&_.ti(Hc,100)===_.ti(ad,100)&&_.oi(Hc,104)===_.oi(ad,104)||ya.push("REGENERATE");uL(_.m(Hc,lyd,18),_.m(ad,lyd,18))||ya.push("TURN_INDEX");uL(_.m(Hc,_.mG,2),_.m(ad,_.mG,2))&&uL(_.m(Hc,_.RI,7),_.m(ad,_.RI,7))&&_.ti(Hc,69)===_.ti(ad,69)||ya.push("THEME_OR_LOCALE");exd(_.Ek(Hc,31),_.Ek(ad,31))||ya.push("CLIENT_CAPABILITIES");ya.length===0&&ya.push("OTHER")}}}else ya=["CONNECTION_UNUSABLE"];if(ta&&ya.length===0){_.NAd(this.Fc,"CONSUMED",Jc.ri);MAd(this.Fc,this.Na.now()-Jc.VM,Jc.ri,!0);da.IDc();\nG=pMd(this,Jc.connection,G,N,T,r,u,aa);break a}_.aM(Jc.connection);_.NAd(this.Fc,"MISMATCH",Jc.ri);for(let Hc of ya)ta=this.Fc,ta.Sd.increment(Hc,Jc.ri||"undefined",ta.requestSource);MAd(this.Fc,this.Na.now()-Jc.VM,Jc.ri,!1);da.IDc()}else da=da.IDc(),da!==void 0&&MAd(this.Fc,this.Na.now()-da,N.ri,!1)}G=oMd(this,G,N,T,r,u,aa)}else G=mMd(this,G,N,T,r,u,aa);return G});return()=>{w.onComplete();C();VAd(this.zl)}}',
  pnbMethods: {
    next: 'next(a){var b=this.ha;if(b.next)try{b.next(a)}catch(c){Qlb(c)}}',
    error: 'error(a){var b=this.ha;if(b.error)try{b.error(a)}catch(c){Qlb(c)}else Qlb(a)}',
    complete: 'complete(){var a=this.ha;if(a.complete)try{a.complete()}catch(b){Qlb(b)}}',
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
    error(diagnostic?: GeminiNativeReceiveDiagnostic): void;
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
  let receiveOrigin: GeminiNativeReceiveDiagnostic['origin'] = 'prior-guard';
  let firstReceiveDiagnostic: GeminiNativeReceiveDiagnostic | undefined;
  function rememberReceive(
    error?: unknown,
    predicate?: GeminiNativeReceiveDiagnostic['predicate'],
  ) {
    if (firstReceiveDiagnostic !== undefined) return;
    firstReceiveDiagnostic = Object.freeze({
      origin: receiveOrigin,
      predicate: readGeminiNativeReceivePredicate(error) ?? predicate ?? 'unknown',
    });
  }
  function withReceiveOrigin<T>(origin: GeminiNativeReceiveDiagnostic['origin'], call: () => T): T {
    const previous = receiveOrigin;
    receiveOrigin = origin;
    try {
      return call();
    } finally {
      receiveOrigin = previous;
    }
  }
  function caughtReceive<T>(call: () => T): T {
    try {
      return call();
    } catch (error) {
      rememberReceive(error);
      throw error;
    }
  }
  function n15(origin: Diagnostic) {
    return diagnostic === 'dispatch-native-n15' ? origin : diagnostic;
  }
  function isReceivePredicate(value: string): value is GeminiNativeReceiveDiagnostic['predicate'] {
    return Object.hasOwn(GEMINI_NATIVE_RECEIVE_PREDICATE_CODES, value);
  }
  function rememberOrigin(origin = diagnostic) {
    rememberReceive(undefined, origin && isReceivePredicate(origin) ? origin : undefined);
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
  function fail(
    origin = diagnostic,
    predicate?: GeminiNativeReceiveDiagnostic['predicate'],
  ): never {
    if (predicate) rememberReceive(undefined, predicate);
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
    rememberReceive(error, origin && isReceivePredicate(origin) ? origin : undefined);
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
  function require(
    value: unknown,
    origin = diagnostic,
    predicate?: GeminiNativeReceiveDiagnostic['predicate'],
  ): asserts value {
    if (!value) fail(origin, predicate);
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
  function replace(
    owner: any,
    key: string,
    value: Call,
    restore = false,
    origin?: Diagnostic,
    receiveBoundary?: GeminiNativeReceiveDiagnostic['origin'],
    ownedTarget?: (value: unknown) => boolean,
  ) {
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
      if (this === owner && instance && (cleaning || nativeClosed))
        acceptOriginalIdentifierRetirement(owner, key);
      if (!ownedTarget || ownedTarget(args[0]))
        withReceiveOrigin(receiveBoundary ?? receiveOrigin, () => require(!callbackActive));
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
  const apiPrototype = proto('gM');
  exact(api, apiPrototype);
  noOwn(api, 'ybb');
  source(own(apiPrototype, 'ybb'), profile.ybb);
  const session = retain(api, 'Ab'),
    registry = retain(api, 'Fb'),
    protection = retain(api, 'Ja');
  const sessionPrototype = proto('xKd', profile.xKd),
    registryPrototype = proto('AKd', profile.AKd);
  exact(session, sessionPrototype);
  exact(registry, registryPrototype);
  exact(protection, proto('UL'));
  const eligibility = retain(api, 'Aa'),
    selectedMode = retain(api, 'Ua'),
    headers = retain(api, 'Eb');
  exact(
    eligibility,
    proto(
      'CKd',
      'class{constructor(){this.Da=_.x(_.Nz);this.ka=_.x(_.cM);this.ha=this.Da.Ea(_.tKd);this.oa=this.Da.Ea(uKd)}}',
    ),
  );
  exact(selectedMode, proto('cM', 'class{constructor(){this.ha=0}reset(){this.ha=0}}'));
  exact(
    headers,
    proto(
      'zKd',
      'class{constructor(){this.ha=_.x(_.bL);this.ka=_.x(_.dL);this.oa=_.x(_.bM);this.wa=_.x(_.cM)}}',
    ),
  );
  source(
    retain(ns, 'BKd'),
    'function(a){if(!a.ha)return!1;if(a.oa)return!0;a=a.ka.ha;return a!==43&&a!==42}',
  );
  require(retain(eligibility, 'ka') === selectedMode && retain(headers, 'wa') === selectedMode);
  const routeEnabled = retain(eligibility, 'ha'),
    routeOverride = retain(eligibility, 'oa'),
    featureMode = retain(selectedMode, 'ha');
  require(
    typeof routeEnabled === 'boolean' &&
      typeof routeOverride === 'boolean' &&
      Number.isFinite(featureMode) &&
      Number.isInteger(featureMode),
  );
  require(typeof retain(api, 'kb') === 'boolean');
  require(
    routeEnabled &&
      (routeOverride || (featureMode !== 43 && featureMode !== 42)) &&
      retain(protection, 'isEnabled') === true &&
      retain(session, 'wa') === false,
  );
  const lifetime = retain(api, 'Ia'),
    requestSource = retain(api, 'requestSource');
  require(Number.isInteger(requestSource));
  const settings = retain(session, 'Da');
  object(settings);
  let settingsOwner = settings;
  for (let depth = 0; !descriptor(settingsOwner, 'Ea') && depth < 4; depth++) {
    retain(settingsOwner, 'Ea');
    settingsOwner = Object.getPrototypeOf(settingsOwner);
    object(settingsOwner);
  }
  fn(retain(settingsOwner, 'Ea'));
  retain(session, 'ka');
  retain(session, 'oa');
  const wa = descriptor(sessionPrototype, 'Aa');
  require(wa?.get && !wa.set);
  noOwn(session, 'Aa');
  source(wa.get, 'get Aa(){return this.Da.Ea(sKd)}');
  retain(session, 'Aa');
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
    managerPrototype = proto('JVd', profile.JVd);
    pinMethods(managerPrototype!, methods.CUd);
    exact(manager, managerPrototype!);
    require(Object.getPrototypeOf(managerPrototype) === Object.prototype);
    require(retain(manager, 'Na') === session && retain(manager, 'ka') === false);
    consumer = retain(manager, 'Oa');
    consumerPrototype = proto('wN');
    exact(consumer, consumerPrototype!);
    require(retain(consumer, 'ha') === api);
    require(retain(manager, 'Va') === eligibility && retain(manager, 'Ua') === headers);
    require(typeof retain(manager, 'Za') === 'boolean' && retain(manager, 'kb') === false);
    idleEnabled = true;
    for (const key of ['isEnabled', 'Oof', 'IDc']) {
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
    'Ph',
    'Lg',
    'Af',
    'Gh',
    'ub',
    'Ra',
    'dDb',
    'EJd',
    'FJd',
    'zJd',
    'jMd',
    'aKd',
    'wKd',
    'nKd',
    'JDb',
    'Jlb',
    're',
  ] as const;
  for (const key of ['jMd', 'wKd', 'aKd', 'Jlb']) {
    const d = descriptor(ns, key);
    require(d && 'value' in d && d.writable && d.configurable, 'dispatch-native-n10');
  }
  require(Object.isExtensible(registry));
  const original: Record<string, Call> = {};
  const pinOrigins: Partial<Record<(typeof sourceKeys)[number], Diagnostic>> = {
    jMd: 'dispatch-native-n01',
    wKd: 'dispatch-native-n02',
    aKd: 'dispatch-native-n03',
    Jlb: 'dispatch-native-n04',
  };
  for (const key of sourceKeys)
    original[key] = source(retain(ns, key), profile[key], pinOrigins[key] ?? 'dispatch-native-n05');
  const observablePrototype = proto('st', profile.st),
    subjectPrototype = proto('Wt', profile.Wt),
    behaviorPrototype = proto('fu', profile.fu);
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
    'class{constructor(a){this.Na=a;this.closed=!1;this.wa=this.oa=null}unsubscribe(){if(!this.closed){this.closed=!0;let c=this.oa;if(Array.isArray(c))for(var a of c)a.remove(this);else c==null||c.remove(this);a=this.Na;if(_.pt(a))try{a()}catch(e){var b=e instanceof qnb?e.errors:[e]}let d=this.wa;if(d){this.wa=null;for(let e of d)try{_.pt(e)?e():e.unsubscribe()}catch(f){let g;b=(g=b)!=null?g:[];f instanceof qnb?b=[...b,...f.errors]:b.push(f)}}if(b)throw new qnb(b);}}add(a){if(a&&a!==this)if(this.closed)_.pt(a)?a():\na.unsubscribe();else{if(a instanceof _.qt){if(a.closed||a.Ha(this))return;a.Ga(this)}let b;(this.wa=(b=this.wa)!=null?b:[]).push(a)}}Ha(a){var b=this.oa;return b===a||Array.isArray(b)&&b.includes(a)}Ga(a){var b=this.oa;this.oa=Array.isArray(b)?(b.push(a),b):b?[b,a]:a}Ja(a){var b=this.oa;b===a?this.oa=null:Array.isArray(b)&&Nlb(b,a)}remove(a){var b=this.wa;b&&Nlb(b,a);a instanceof _.qt&&a.Ja(this)}}',
  );
  pinMethods(subscriptionPrototype, methods.ot);
  const subscriberPrototype = proto(
    'omb',
    'class extends snb{constructor(a,b,c){super();var d;_.pt(a)||!a?d={next:a!=null?a:void 0,error:b!=null?b:void 0,complete:c!=null?c:void 0}:d=a;this.destination=new tnb(d)}}',
  );
  const subscriberBase = Object.getPrototypeOf(subscriberPrototype);
  source(
    own(subscriberBase, 'constructor'),
    'class extends _.qt{static create(a,b,c){return new _.omb(a,b,c)}constructor(a){super();this.Zs=!1;this.destination=a instanceof snb?a:new tnb(!a||_.pt(a)?{next:a!=null?a:void 0}:a);Olb(a)&&a.add(this)}next(a){this.Zs||this.Pj(a)}error(a){this.Zs||(this.Zs=!0,this.a7a(a))}complete(){this.Zs||(this.Zs=!0,this.ha())}unsubscribe(){this.closed||(this.Zs=!0,super.unsubscribe())}Pj(a){this.destination.next(a)}a7a(a){this.destination.error(a);this.unsubscribe()}ha(){this.destination.complete();this.unsubscribe()}}',
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
  for (const key of ['dga', 'XL', 'HJd', 'VL']) retain(ns, key);
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
    add: 'function(a,b,c,d,e){var f=a.toString();a=this.listeners[f];a||(a=this.listeners[f]=[],this.ha++);var g=Bga(a,b,d,e);g>-1?(b=a[g],c||(b.E8a=!1)):(b=new _.Uba(b,this.src,f,!!d,e),b.E8a=c,a.push(b));return b}',
  });
  const eventMarker = retain(ns, 'zga');
  require(typeof eventMarker === 'string' && retain(eventTargetPrototype, eventMarker) === true);
  const eventPrototype = proto('Yj', profile.eventHandler);
  source(own(eventPrototype, 'listen'), profile.listen);
  source(own(eventPrototype, 'removeAll'), profile.removeAll);
  for (const key of ['wL', 'CI', 'Kzd', 'JJd', 'GJd', 'DJd', '$Ad', 'WL', 'xJd', 'jJd']) proto(key);
  for (const key of Reflect.ownKeys(approved)) retain(approved, key);
  for (const key of ['Ni', 'Li', 'Ii', 'di', 'Rh', 'MI', 'NI']) fn(retain(ns, key));
  source(own(ns, 'Rh'), 'function(a){return _.Af(a)}');
  source(own(ns, 'MI'), 'function(a,b){return _.Li(a,1,b)}');
  source(own(ns, 'NI'), 'function(a,b){return _.Li(a,2,b)}');
  source(retain(ns, 'AL'), 'function(a){return _.m(a,_.CI,2)}');
  source(retain(ns, 'bi'), 'function(a,b,c,d){return _.Ph(a,b,_.Yh(a,d,c))}');
  source(retain(ns, 'PJd'), 'function(a){return _.bi(a,OJd,4,_.YL)}');
  for (const key of ['n', 'Xh', 'Yh']) fn(retain(ns, key));
  source(retain(own(ns.CI, 'prototype'), 'ig'), 'ig(){return _.n(this,1)}');
  const receipt = createGeminiNativeReceipt(ns, approved);
  const materializers = receipt.prepareMaterializers();
  let materializingOriginal = false,
    materializationRevoked = false,
    materializationCallback = false;
  for (const key of ['m', 'Roa', 'ub'] as const) {
    retain(ns, key);
    replace(
      ns,
      key,
      function (this: unknown, ...args: any[]) {
        if (!receipt.ownsMaterialization(args[0]))
          return Reflect.apply(materializers[key], this, args);
        // A refused receive still owes the original source its synchronous unwind.
        // It gets no receipt transition and cannot regain accepted output.
        if (
          materializingOriginal &&
          !materializationCallback &&
          !callbackActive &&
          (failed || receiveInvalid || materializationRevoked || !projectingFrame)
        )
          return Reflect.apply(materializers[key], this, args);
        return withReceiveOrigin('original-callback', () =>
          caughtReceive(() => {
            require(materializingOriginal &&
              !materializationRevoked &&
              !materializationCallback &&
              !callbackActive &&
              !failed &&
              !receiveInvalid &&
              !cleanupStarted &&
              sourceDispatchDepth > 0 &&
              envelopeDispatch &&
              pendingEnvelope?.kind === 'response' &&
              projectingFrame?.normalized !== undefined, diagnostic, 'receipt-state');
            try {
              if (key !== 'ub') {
                try {
                  checkpoint(false, false);
                } catch (error) {
                  materializationRevoked = receiveInvalid = true;
                  observe(() => {
                    throw error;
                  });
                  return Reflect.apply(materializers[key], this, args);
                }
              }
              const result = receipt.materialize(key, this, args);
              if (key !== 'ub') {
                try {
                  checkpoint(false, false);
                } catch (error) {
                  materializationRevoked = receiveInvalid = true;
                  observe(() => {
                    throw error;
                  });
                }
              }
              return result;
            } catch (error) {
              receiveInvalid = true;
              return refused(error);
            }
          }),
        );
      },
      true,
      undefined,
      'original-callback',
      receipt.ownsMaterialization,
    );
  }
  receipt.bindMaterializers();
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
  let identifiersRetired = false;
  let disconnectDepth = 0;
  let wrapperCallbackDepth = 0;
  function acceptOriginalIdentifierRetirement(subject: any, key: string): void {
    if (identifiersRetired || !aaSlot) return;
    const terminalBoundary =
      subject === own(instance, 'ka') &&
      (key === 'next' || key === 'complete') &&
      ((sourceDispatchDepth > 0 && nativeClosed) ||
        (cleaning && (wrapperCallbackDepth === 1 || (!lifetime && physicalDepth > 0))));
    const disconnectBoundary =
      disconnectDepth === 1 &&
      cleaning &&
      (lifetime
        ? subject === own(instance, 'Ga') && key === 'unsubscribe'
        : subject === own(instance, 'wB') && key === 'complete');
    if (!terminalBoundary && !disconnectBoundary) return;
    require(closed);
    const next = descriptor(instance, 'oa');
    require(next && same({ ...aaSlot, value: undefined }, next));
    require(
      own(instance, 'xD') === true &&
        own(instance, 'ha') === false &&
        own(instance, 'p6') === false &&
        own(instance, 'Ha') === undefined &&
        queue.length === 0,
    );
    aaWitness?.();
    seedWitness?.();
    aaSlot = next;
    identifiersRetired = true;
    cleanupStarted = true;
  }
  const seenEnvelopes = new WeakSet<object>();
  function observe(call: () => void, origin = receiveOrigin) {
    withReceiveOrigin(origin, () => {
      try {
        call();
      } catch (error) {
        rememberReceive(error);
        receiveFailure = true;
        try {
          refused(error);
        } catch {
          /* Report only after the complete source stack. */
        }
      }
    });
  }
  function receiveEvidence(): void {
    return withReceiveOrigin('receipt-currentness', () =>
      caughtReceive(() => receiveEvidenceInScope()),
    );
  }
  function receiveEvidenceInScope(): void {
    try {
      receipt.verify();
      aaWitness?.();
      if (aaSlot) require(same(aaSlot, descriptor(instance, 'oa')));
    } catch (error) {
      receiveInvalid = true;
      throw error;
    }
  }
  function verifyReceiveIntegrity(physical?: () => void): void {
    return withReceiveOrigin('owner-currentness', () =>
      caughtReceive(() => verifyReceiveIntegrityInScope(physical)),
    );
  }
  function verifyReceiveIntegrityInScope(physical?: () => void): void {
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
      withReceiveOrigin('extension-callback', () => caughtReceive(call));
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
    const snapshot =
      firstReceiveDiagnostic ??
      Object.freeze({ origin: 'prior-guard', predicate: 'unknown' } as const);
    try {
      observer.error(snapshot);
    } catch {
      /* An extension failure never escapes into provider dispatch. */
    }
    observe(verifyReceiveIntegrity);
  }
  let okWitness: (() => void) | undefined,
    configWitness: (() => void) | undefined,
    seedWitness: (() => void) | undefined,
    queryWitness: (() => void) | undefined;
  function evidence(): void {
    return withReceiveOrigin('owner-currentness', () => caughtReceive(() => evidenceInScope()));
  }
  function evidenceInScope(): void {
    sessionSetEvidence();
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
          'Ca',
          'Gb',
          'Jh',
          'oa',
          'ka',
          'Ja',
          'Va',
          'kb',
          'Ua',
          'Za',
          'Ha',
          'Wa',
          'Pc',
          'Eb',
          'Yb',
          'xe',
        ])
          require(descriptor(transport, key)?.writable === true, n15(
            'dispatch-native-n15-evidence-03',
          ));
        require((descriptor(transport, 'hU') ?? descriptor(Object.getPrototypeOf(transport), 'hU'))
          ?.writable === true, n15('dispatch-native-n15-evidence-04'));
        require(own(instance, 'connection') === connection &&
          own(instance, 'wa') === queue &&
          own(connection, 'wq') === channel &&
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
          (own(instance, 'p6') === false || (closeStarted && own(instance, 'p6') === true)) &&
          own(instance, 'Na') === false, n15('dispatch-native-n15-evidence-06'));
        if (lifetime)
          require(same(closeTimer, descriptor(instance, 'Ha')) ||
            (cleanupStarted && own(instance, 'Ha') === undefined), 'dispatch-native-n10');
        if (!cleaning && !retired && !nativeClosed)
          require(own(instance, 'xD') === false, n15('dispatch-native-n15-evidence-07'));
        if (physicalStarted) {
          require(own(transport, 'BPb') === undefined && own(transport, 'Uf') === false, n15(
            'dispatch-native-n15-evidence-08',
          ));
          physicalEvidence();
          if (!physicalDepth && !applicationClosing && (!cleaning || !cleanupStarted))
            transportWitness?.();
        } else {
          require(own(own(transport, 'Aa'), 'wa') === initialActiveCapacity, n15(
            'dispatch-native-n15-evidence-09',
          ));
          require(own(transport, 'BPb') === undefined &&
            own(transport, 'Uf') === false &&
            own(transport, 'Ua') === '', n15('dispatch-native-n15-evidence-10'));
          require(own(transport, 'Jh') === 0 &&
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
          const state = own(transport, 'hU') ?? own(Object.getPrototypeOf(transport), 'hU');
          require(state === 1 || ((cleaning || retired) && state === 0), n15(
            'dispatch-native-n15-evidence-14',
          ));
          require(own(transport, 'Ja') === null &&
            own(transport, 'Va') === null &&
            own(transport, 'kb') === null, n15('dispatch-native-n15-evidence-15'));
          const scheduled = own(transport, 'Ca');
          require(scheduled === (networkScheduled ? true : null) ||
            ((cleaning || retired) && scheduled === null), n15('dispatch-native-n15-evidence-16'));
          const backlog = own(own(transport, 'Aa'), 'oa');
          require(Array.isArray(backlog) &&
            Object.getPrototypeOf(backlog) === Array.prototype &&
            backlog.length === 0, n15('dispatch-native-n15-evidence-17'));
          if (!cleaning && !retired) {
            require((own(transport, 'hU') ?? own(Object.getPrototypeOf(transport), 'hU')) ===
              1, n15('dispatch-native-n15-evidence-18'));
            require(own(transport, 'Ca') === (networkScheduled ? true : null), n15(
              'dispatch-native-n15-evidence-19',
            ));
          }
          require(own(own(connection, 'xC'), 'Sm') === false, n15(
            'dispatch-native-n15-evidence-20',
          ));
          if (!cleaning && !retired) {
            require(own(instance, 'Aa') === (query || (queueBusy && !inConfig) ? 1 : 0), n15(
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
          require(own(instance, 'oa') === (aaSlot ? aaSlot.value : seed), n15(
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
  function checkpoint(scope = false, admission = true): void {
    return withReceiveOrigin('owner-currentness', () =>
      caughtReceive(() => checkpointInScope(scope, admission)),
    );
  }
  function checkpointInScope(scope = false, admission = true): void {
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
      jMd: 'dispatch-native-n12',
      wKd: 'dispatch-native-n14',
      Jlb: 'dispatch-native-n14',
      aKd: 'dispatch-native-n15',
      aM: 'dispatch-native-n17',
      Tt: 'dispatch-native-n17',
      wA: 'dispatch-native-n17',
      au: 'dispatch-native-n17',
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
  let sessionRegistration: LifecycleRegistration | undefined;
  let sessionWrapper: any,
    sessionRemoved = false,
    sessionNext = false,
    sessionComplete = false;
  let sessionCallback: 'next' | 'complete' | undefined;
  const sessionSet = retain(session, 'ha');
  exact(sessionSet, Set.prototype);
  const sessionSetSize = source(
    descriptor(Set.prototype, 'size')?.get,
    'function get size() { [native code] }',
  );
  retained.push({
    owner: Set.prototype,
    key: 'size',
    descriptor: descriptor(Set.prototype, 'size'),
  });
  const sessionSetHas = source(retain(Set.prototype, 'has'), 'function has() { [native code] }');
  const sessionSetAdd = source(retain(Set.prototype, 'add'), 'function add() { [native code] }');
  const sessionSetDelete = source(
    retain(Set.prototype, 'delete'),
    'function delete() { [native code] }',
  );
  for (const key of [
    'add',
    'delete',
    'has',
    'clear',
    'values',
    'entries',
    'keys',
    'forEach',
    'size',
  ])
    noOwn(sessionSet, key);
  require(!descriptor(sessionSet, Symbol.iterator));
  retain(sessionSet, Symbol.iterator);
  for (const key of ['has', 'clear', 'values', 'entries', 'keys', 'forEach', 'size'])
    retain(sessionSet, key);
  function sessionSetEvidence() {
    require(
      own(session, 'ha') === sessionSet && Object.getPrototypeOf(sessionSet) === Set.prototype,
    );
    const present = sessionWrapper !== undefined && !sessionRemoved;
    require(Reflect.apply(sessionSetSize, sessionSet, []) === (present ? 1 : 0));
    if (sessionWrapper)
      require(Reflect.apply(sessionSetHas, sessionSet, [sessionWrapper]) === present);
  }
  sessionSetEvidence();
  replace(
    sessionSet,
    'add',
    function (this: unknown, ...args: any[]) {
      require(factoryBusy && this === sessionSet && args.length === 1 && !sessionWrapper);
      sessionSetEvidence();
      constructor(args[0], profile.IHd);
      sessionWrapper = args[0];
      const result = Reflect.apply(sessionSetAdd, this, args);
      require(result === sessionSet);
      sessionSetEvidence();
      return result;
    },
    true,
  );
  replace(
    sessionSet,
    'delete',
    function (this: unknown, ...args: any[]) {
      require(
        this === sessionSet && args.length === 1 && args[0] === sessionWrapper && sessionCallback,
      );
      sessionSetEvidence();
      require(sessionCallback === 'complete' || !sessionRemoved);
      const present = !sessionRemoved;
      const result = Reflect.apply(sessionSetDelete, this, args);
      require(result === present);
      sessionRemoved = true;
      sessionSetEvidence();
      return result;
    },
    true,
  );
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

  function lifecycleEvidence(): void {
    return withReceiveOrigin('owner-currentness', () =>
      caughtReceive(() => lifecycleEvidenceInScope()),
    );
  }
  function lifecycleEvidenceInScope(): void {
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
        require(typeof own(value, 'Zs') === 'boolean', 'dispatch-native-n17');
      if (record.provisional) {
        require(own(value, 'closed') === false, 'dispatch-native-n17');
      }
    }
  }
  function snapshotLifecycle(allowRetirement = false): () => void {
    return withReceiveOrigin('owner-currentness', () =>
      caughtReceive(() => snapshotLifecycleInScope(allowRetirement)),
    );
  }
  function snapshotLifecycleInScope(allowRetirement = false): () => void {
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
      for (const key of ['closed', 'Zs', 'wa', 'oa'])
        fields.push({ owner: value, key, descriptor: descriptor(value, key) });
      const children = own(value, 'wa');
      if (children) arrays.push({ value: children, items: list(children), parent: value });
    }
    for (const value of lifecycleSubjects.keys()) {
      for (const key of ['closed', 'Zs', 'hasError', 'oa', 'observers'])
        fields.push({ owner: value, key, descriptor: descriptor(value, key) });
      const observers = own(value, 'observers');
      arrays.push({ value: observers, items: list(observers), subject: value });
    }
    const verify = () => {
      for (const entry of fields) {
        let expected = entry.descriptor;
        if (retired(entry.owner)) {
          // Only a successful captured unsubscribe proves these source-owned transitions.
          const value = entry.key === 'closed' || entry.key === 'Zs' ? true : null;
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
    return () => withReceiveOrigin('owner-currentness', () => caughtReceive(verify));
  }
  function drainDetach() {
    if (!receiveDepth && detachQueued && !cleaning) {
      detachQueued = false;
      detach();
    }
  }
  function retirementEvidence(): void {
    return withReceiveOrigin('owner-currentness', () =>
      caughtReceive(() => retirementEvidenceInScope()),
    );
  }
  function retirementEvidenceInScope(): void {
    sessionSetEvidence();
    if (sessionWrapper) require(sessionRemoved && sessionComplete, 'dispatch-native-n24');
    if (instance)
      require(queue.length === 0 &&
        own(transport, 'Ca') === null &&
        own(transport, 'hU') === 0, 'dispatch-native-n24');
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
        rememberReceive(error);
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
      ((!!lifetime && !!observable && producerActive) || (factoryBusy && !!sessionWrapper)) &&
        !acquisitionSuspended &&
        !closed &&
        !failed,
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
          if (registration === sessionRegistration) {
            require(
              this === callbacks && !sessionCallback && (key === 'next' || key === 'complete'),
            );
            require(
              key === 'next'
                ? !sessionNext && !sessionComplete && values.length === 1
                : !sessionComplete && values.length === 0,
            );
            evidence();
            sessionCallback = key;
            try {
              const result = Reflect.apply(callback, this, values);
              require(sessionRemoved);
              if (key === 'next') sessionNext = true;
              else sessionComplete = true;
              return result;
            } finally {
              sessionCallback = undefined;
              evidence();
            }
          }
          const wrapperCallback = registration?.index === 0 && key === 'next';
          if (wrapperCallback) {
            require(wrapperCallbackDepth === 0);
            wrapperCallbackDepth++;
          }
          try {
            if (!sourceDispatchDepth && (!physicalStarted || opening))
              return Reflect.apply(callback, this, values);
            const physical = kind === 'outer' ? snapshotPhysical() : undefined;
            const lifecycle = kind === 'outer' ? snapshotLifecycle(true) : undefined;
            const wasMaterializationCallback = materializationCallback;
            if (kind === 'outer') materializationCallback = true;
            try {
              return withReceiveOrigin('original-callback', () =>
                caughtReceive(() => Reflect.apply(callback, this, values)),
              );
            } catch (error) {
              observe(() => {
                throw error;
              });
              throw error;
            } finally {
              materializationCallback = wasMaterializationCallback;
              observe(() =>
                verifyReceiveIntegrity(() => {
                  lifecycle?.();
                  physical?.();
                }),
              );
            }
          } finally {
            if (wrapperCallback) wrapperCallbackDepth--;
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
      require(own(value, 'destination') === parent && own(value, 'Zs') === false);
      for (const key of ['Ca', 'Pj', 'ha', 'a7a']) require(!descriptor(value, key));
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
              require(
                !acquisitionSuspended &&
                  (producerActive || (factoryBusy && registration === sessionRegistration)),
              );
              const reg = registration;
              if (reg?.operating && reg.index !== 3 && !reg.child) {
                require(!own(value, 'closed') && value === reg.subscriber);
                reg.child = item;
                captureSubscription(item, value, 'notifier', reg);
              } else if (
                reg?.operating &&
                ((reg.index === 2 && takeLift) || reg.index === 3) &&
                !reg.take
              ) {
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
          key === 'Pj'
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
            record.kind === 'outer' && key === 'complete' && own(value, 'Zs') === false;
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
    require(!descriptor(value, 'a7a'));
    require(kind === 'notifier' ? !!descriptor(value, 'ha') : !descriptor(value, 'ha'));
    source(own(value, 'Pj'), lifecycleSources.ntNext, 'dispatch-native-n06');
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
        const reg = [
          ...lifecycleRegistrations,
          ...(sessionRegistration ? [sessionRegistration] : []),
        ].find(
          (r) => r.operating && (r.input === subject || (r.index === 2 && subject === takeInput)),
        );
        require(reg);
        if (key === 'subscribe') {
          acquisition();
          require(value === (reg.index === 2 || reg.index === 3 ? reg.take : reg.subscriber));
          if (own(subject, 'hasError') === true) {
            require(own(subject, 'Zs') === true);
            lifecycleErrors.set(subject, own(subject, 'oa'));
          }
          if (reg.index === 2 || reg.index === 3) finalizeChild(value, reg, 'take');
          return control(() => Reflect.apply(original, this, args));
        }
        // Lt.Aa may already have completed this exact prepared subscriber.
        // The following original Ga returns only the canonical closed sentinel.
        require(
          (producerActive || (factoryBusy && reg === sessionRegistration)) && !acquisitionSuspended,
        );
        evidence();
        require(
          value === (reg.index === 2 || reg.index === 3 ? reg.take : reg.subscriber) &&
            lifecycleSubscriptions.has(value) &&
            !reg.registered &&
            !reg.noRegistration,
        );
        if (closed) require(own(value, 'closed') === true && own(subject, 'Zs') === true);
        const result = Reflect.apply(original, this, args);
        if (result === own(own(ns, 'qt'), 'ha')) {
          require(own(subject, 'Zs') === true || own(subject, 'hasError') === true);
          closed = true;
          reg.noRegistration = true;
          lifecycleSubscriptions.get(value)!.children.add(result);
          return result;
        }
        exact(result, subscriptionPrototype);
        source(retain(result, 'Na'), '()=>Nlb(this.observers,a)', 'dispatch-native-n06');
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
      if (reg.index === 3) {
        require(
          args.length === 1 &&
            Object.getPrototypeOf(args[0]) === Object.prototype &&
            Reflect.ownKeys(args[0]).length === 2,
        );
        source(own(args[0], 'next'), '()=>{a.ha.delete(b)}');
        source(own(args[0], 'complete'), '()=>{a.ha.delete(b)}');
      }
      used = true;
      subscribeArgs = args;
      if (take && reg.index !== 3)
        require(args.length === 1 && args[0] === reg.subscriber && reg.operating);
      reg.subscribing = true;
      try {
        const result = control(() => Reflect.apply(subscribe, this, args));
        require(result === reg.subscriber);
        if (!take || reg.index === 3) reg.finished = true;
        return result;
      } finally {
        reg.subscribing = false;
      }
    });
    replace(value, 'operator', function (this: unknown, ...args: any[]) {
      acquisition();
      require(reg.subscribing && args.length === 1 && args[0] === input);
      if (take && reg.index !== 3) require(this === reg.subscriber);
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
    for (const key of ['au', 'Tt', 'xt', 'tt', 'Plb'] as const)
      original[key] = source(retain(ns, key), lifecycleSources[key], 'dispatch-native-n06');
    original.wA = fn(own(ns, 'wA'));
    source(resolved(subjectPrototype, 'lift'), lifecycleSources.lift, 'dispatch-native-n06');
    const lifetimePrototype = Object.getPrototypeOf(lifetime);
    const ownerSource = Reflect.apply(sourceText, own(lifetimePrototype, 'constructor'), []);
    const viewOwner = ownerSource === lifecycleSources.GOb;
    require(viewOwner || ownerSource === lifecycleSources.WVb);
    if (viewOwner) {
      constructor(lifetime, lifecycleSources.GOb, own(own(ns, 'xx'), 'prototype'));
      getter(lifetimePrototype, 'dg', 'get dg(){return _.Nw(this.Qs)}');
      for (const key of ['Nw', 'cOb', 'dOb'] as const)
        source(retain(ns, key), lifecycleSources[key], 'dispatch-native-n06');
    } else {
      exact(lifetime, proto('zWb', lifecycleSources.WVb));
      getter(lifetimePrototype, 'dg', 'get dg(){return this.jg}');
      source(retain(ns, 'ONb'), 'function(a){if(a.dg)throw new _.Cw(-205,!1);}');
    }
    noOwn(lifetime, 'dg');
    retain(lifetime, 'dg');
    const ownerRegister = source(
      resolved(lifetime, 'Uc'),
      viewOwner
        ? 'Uc(a){var b=this.Qs;_.cOb(b,a);return()=>_.dOb(b,a)}'
        : 'Uc(a){_.ONb(this);this.uqb.push(a);return()=>{var b=this.uqb.indexOf(a);b!==-1&&this.uqb.splice(b,1)}}',
    );
    const ownerView = viewOwner ? retain(lifetime, 'Qs') : lifetime;
    if (viewOwner) require(Array.isArray(ownerView));
    const listKey = viewOwner ? '21' : 'uqb';
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
      'Uc',
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
              ? '()=>_.dOb(b,a)'
              : '()=>{var b=this.uqb.indexOf(a);b!==-1&&this.uqb.splice(b,1)}',
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
    original.aM = source(
      retain(ns, 'aM'),
      'function(a){a.xD||a.p6||(a.ha?(a.p6=!0,a.connection.send(_.Rh(_.IJd(new _.JJd,_.Rh(_.iJd(new _.jJd,1))))),a.Ha=setTimeout(()=>{a.xD||a.disconnect()},2E4)):a.disconnect())}',
    );
    source(retain(ns, 'iJd'), 'function(a,b){return _.Ni(a,1,b)}');
    source(retain(ns, 'IJd'), 'function(a,b){return _.di(a,4,_.XL,b)}');
    installed('aM', function (this: unknown, ...args: any[]) {
      if (args[0] !== instance) return Reflect.apply(original.aM!, this, args);
      require(this === ns && args.length === 1 && !applicationClosing && closed);
      const wasCleaning = cleaning;
      cleaning = true;
      try {
        if (detached) require(retired && own(instance, 'xD') === true);
        else evidence();
        lifecycleEvidence();
        if (own(instance, 'xD') || own(instance, 'p6'))
          return Reflect.apply(original.aM!, this, args);
        require(!closeStarted);
        closeStarted = applicationClosing = true;
        const result = control(() => Reflect.apply(original.aM!, this, args));
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
    installed('Tt', function (this: unknown, ...args: any[]) {
      if (factoryBusy) return sessionTake(this, args);
      if (!producerActive || !lifetime) return Reflect.apply(original.Tt!, this, args);
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
      const operator = Reflect.apply(original.Tt!, this, args);
      source(operator, lifecycleSources.mtOperator, 'dispatch-native-n06');
      let used = false;
      return function (this: unknown, ...values: any[]) {
        acquisition();
        require(!used && values.length === 1 && values[0] === own(instance, 'Ua'));
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
    installed('wA', function (this: unknown, ...args: any[]) {
      if (args[0] !== lifetime || (!producerActive && !acquisitionSuspended))
        return Reflect.apply(original.wA!, this, args);
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
      const operator = source(Reflect.apply(original.wA!, this, args), 'c=>c.pipe(_.au(b))');
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
    installed('au', function (this: unknown, ...args: any[]) {
      const reg = activeCreator;
      if (!reg) return Reflect.apply(original.au!, this, args);
      acquisition();
      require(this === ns && args.length === 1 && reg.applying && !reg.notifier);
      const notifier = args[0];
      exact(notifier, observablePrototype);
      absent(notifier, 'source');
      absent(notifier, 'operator');
      reg.notifier = notifier;
      const producer = source(
        retain(notifier, 'ha'),
        'c=>{if(a.dg)c.next();else return a.Uc(c.next.bind(c))}',
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
        Reflect.apply(original.au!, this, args),
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
  function sessionTake(receiver: unknown, args: any[]) {
    acquisition();
    require(receiver === ns && args.length === 1 && args[0] === 1 && !sessionRegistration);
    const reg: LifecycleRegistration = { index: 3, input: own(sessionWrapper, 'Ja') };
    sessionRegistration = reg;
    captureSubject(reg.input);
    const operator = source(
      Reflect.apply(original.Tt!, receiver, args),
      lifecycleSources.mtOperator,
    );
    let used = false;
    return function (this: unknown, ...values: any[]) {
      acquisition();
      require(!used && values.length === 1 && values[0] === reg.input);
      used = true;
      const result = Reflect.apply(operator, this, values);
      captureLift(result, reg.input, reg, true);
      reg.lifted = result;
      return result;
    };
  }
  if (lifetime) installLifecycle();
  else {
    const nt = proto('zt', lifecycleSources.zt);
    require(Object.getPrototypeOf(nt) === subscriberBase);
    source(own(nt, 'unsubscribe'), lifecycleSources.ntUnsubscribe);
    for (const key of ['Tt', 'xt'] as const)
      original[key] = source(retain(ns, key), lifecycleSources[key]);
    source(resolved(subjectPrototype, 'lift'), lifecycleSources.lift);
    installed('Tt', function (this: unknown, ...args: any[]) {
      return factoryBusy ? sessionTake(this, args) : Reflect.apply(original.Tt!, this, args);
    });
  }
  let hjdBusy = false,
    factoryBusy = false,
    configBusy = false;
  installed('jMd', function (this: unknown, ...args: any[]) {
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
      const result = Reflect.apply(original.jMd!, this, args);
      exact(result, own(ns.wL, 'prototype'));
      ok = result;
      retain(ok, 'fl');
      const witness = captureGeminiNativeWireContent(ns, ok, 'wL');
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
  installed('Jlb', function (this: unknown, ...args: any[]) {
    require(factoryBusy && !builderEntered && this === ns);
    builderEntered = true;
    evidence();
    // Arguments include provider-owned authentication metadata: delegate them untouched.
    const value = Reflect.apply(original.Jlb!, this, args);
    evidence();
    provisionalChannel = value;
    constructor(value, profile.bmb);
    provisionalTransport = own(value, 'ha');
    constructor(provisionalTransport, profile.dt, Object.prototype);
    for (const [owner, keys] of [
      [value, ['open', 'send', 'close']],
      [provisionalTransport, ['connect', 'disconnect', 'Jf', 'qf', 'Ei', 'Kh']],
    ] as const)
      for (const key of keys) {
        noOwn(owner, key);
        replace(owner, key, deny);
        provisional.push({ owner, key, descriptor: descriptor(owner, key) });
      }
    return value;
  });
  installed('wKd', function (this: unknown, ...args: any[]) {
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
      const xR = descriptor(metadata, 'DS');
      require(xR && 'value' in xR);
      retain(metadata, 'DS'); // Its authentication-bearing contents stay opaque.
      checkpoint(true);
      require(same(xR, descriptor(metadata, 'DS')));
      cold = 'spent';
      factoryCount++;
      const result = Reflect.apply(original.wKd!, this, args);
      evidence();
      require(same(xR, descriptor(metadata, 'DS')));
      require(
        result === sessionWrapper &&
          sessionRegistration?.finished &&
          sessionRegistration.registered &&
          !sessionRemoved,
      );
      captureGraph(result);
      checkpoint(true);
      return result;
    } catch (error) {
      return refused(error);
    } finally {
      factoryBusy = false;
    }
  });
  installed('aKd', function (this: unknown, ...args: any[]) {
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
        result = Reflect.apply(original.aKd!, this, args);
      } catch (error) {
        return refused(error, n15('dispatch-native-n15-unknown-gjd'));
      }
      inConfig = false;
      require(config !== undefined && query === undefined, n15('dispatch-native-n15-config-01'));
      seed = own(instance, 'oa');
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
      aaSlot = descriptor(instance, 'oa');
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
  function receiveSubject(
    subject: any,
    key: string,
    method: Call,
    receiver: unknown,
    args: any[],
  ): any {
    return withReceiveOrigin('correlation', () =>
      caughtReceive(() => receiveSubjectInScope(subject, key, method, receiver, args)),
    );
  }
  function receiveSubjectInScope(
    subject: any,
    key: string,
    method: Call,
    receiver: unknown,
    args: any[],
  ): any {
    require(receiver === subject, diagnostic, 'event-binding');
    const root = subject === own(connection, 'Ki');
    const message = root && key === 'next' && own(args[0], 'eventType') === 'channel_message';
    const data = key === 'next' && (message || subject === own(instance, 'wB'));
    const outer = message;
    if (envelopeDispatch && pendingEnvelope?.kind === 'ignored' && !message) {
      observe(() => require(false, diagnostic, 'event-binding'));
      return;
    }
    if (data) {
      let correlated = true;
      try {
        require(message
          ? args.length === 1 &&
              Reflect.ownKeys(args[0]).length === 2 &&
              pendingEnvelope &&
              own(args[0], 'message') === pendingEnvelope.envelope
          : envelopeDispatch && pendingEnvelope?.kind === 'response', diagnostic, 'event-binding');
      } catch (error) {
        correlated = false;
        observe(() => {
          throw error;
        });
      }
      if (!correlated) return;
    }
    if (outer) require(!sourceDispatchDepth && !envelopeDispatch, diagnostic, 'event-binding');
    if (data && !root) {
      require(!responseSeen, diagnostic, 'event-binding');
      responseSeen = true;
    }
    sourceDispatchDepth++;
    if (outer) envelopeDispatch = true;
    let admitted = true;
    try {
      if (data && !root) {
        // Unsupported provider lifecycle features must never acquire an unowned subscriber.
        try {
          withReceiveOrigin('lifecycle-admission', () =>
            caughtReceive(() => assertGeminiNativeLifecycleProfile(ns, args[0])),
          );
        } catch (error) {
          admitted = false;
          observe(() => {
            throw error;
          });
        }
      }
      observe(() => {
        require(!failed &&
          args.length === (key === 'complete' ? 0 : 1), diagnostic, 'event-binding');
        if (message) {
          const event = args[0];
          require(own(event, 'eventType') === 'channel_message' &&
            Reflect.ownKeys(event).length === 2 &&
            pendingEnvelope &&
            own(event, 'message') === pendingEnvelope.envelope, diagnostic, 'event-binding');
          checkpoint(false, !nativeTerminal);
          if (pendingEnvelope.kind === 'close') {
            require(!nativeClosed, diagnostic, 'provider-control');
            try {
              receiveCallback(() => observer.control((pendingEnvelope as { field: 4 | 5 }).field));
            } finally {
              nativeClosed = closed = true;
              if (pendingEnvelope.field === 4) beginRetirement(false);
            }
          }
        } else if (root && key === 'next') {
          withReceiveOrigin('provider-terminal', () =>
            caughtReceive(() => {
              if (own(args[0], 'eventType') === 'channel_error') {
                require(
                  Reflect.ownKeys(args[0]).every((key) =>
                    ['eventType', 'error', 'errorDetail'].includes(String(key)),
                  ),
                );
                exact(own(args[0], 'error'), own(own(ns, 'ZJ'), 'prototype'));
                nativeError = nativeClosed = cleanupStarted = closed = true;
                withReceiveOrigin('provider-terminal', () => fail(diagnostic, 'provider-error'));
              }
              require(nativeClosed &&
                own(args[0], 'eventType') === 'channel_close' &&
                Reflect.ownKeys(args[0]).length === 1, diagnostic, 'provider-control');
            }),
          );
        } else if (subject === own(instance, 'wB') && key === 'next') {
          const { normalized, recoveryControl } = withReceiveOrigin('normalize', () =>
            caughtReceive(() => {
              require(envelopeDispatch &&
                pendingEnvelope?.kind === 'response' &&
                admitted, diagnostic, 'response-transition');
              const previous = aaSlot;
              require(previous &&
                own(instance, 'oa') !== previous.value, diagnostic, 'response-transition');
              aaWitness?.();
              seedWitness?.();
              const recoveryControl = receipt.recoveryControl();
              const normalized = recoveryControl
                ? (receipt.forwardRecovery(args[0], own(instance, 'oa')), undefined)
                : receipt.normalize(args[0], own(instance, 'oa'));
              const nextSlot = descriptor(instance, 'oa');
              require(nextSlot &&
                same(
                  { ...previous, value: nextSlot.value },
                  nextSlot,
                ), diagnostic, 'response-transition');
              aaSlot = nextSlot;
              const aa = nextSlot.value,
                backing = own(aa, 'fl');
              const witness = captureGeminiNativeWireContent(ns, aa, 'CI', true);
              aaWitness = () => {
                require(own(aa, 'fl') === backing);
                witness(aa);
              };
              return { normalized, recoveryControl };
            }),
          );
          checkpoint(false, !nativeTerminal);
          // Source recovery may unwind normally, but cannot produce accepted output.
          require(!recoveryControl && normalized);
          projectingFrame = normalized;
          args[0] = normalized.normalized;
          receiveCallback(() => observer.next(normalized));
          if (normalized.observation.completed) {
            receipt.terminal();
            nativeTerminal = closed = true;
          }
        } else if (key === 'error') {
          withReceiveOrigin('provider-terminal', () => fail(diagnostic, 'provider-error'));
        } else {
          require(!data && (nativeClosed || key === 'complete'));
          checkpoint(false, false);
        }
      });
      if (data && !root) {
        try {
          withReceiveOrigin('lifecycle-admission', () =>
            caughtReceive(() => assertGeminiNativeLifecycleProfile(ns, args[0])),
          );
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
      if (key === 'error' && !own(subject, 'Zs')) lifecycleErrors.set(subject, args[0]);
      try {
        let result: any;
        const forwarding = subject === own(instance, 'wB') && key === 'next';
        const priorMaterializing = materializingOriginal;
        if (forwarding) {
          require(!materializingOriginal, diagnostic, 'receipt-state');
          materializingOriginal = true;
        }
        try {
          result = withReceiveOrigin('original-callback', () =>
            caughtReceive(() => Reflect.apply(method, receiver, args)),
          );
        } finally {
          materializingOriginal = priorMaterializing;
        }
        if (data && !root) responseForwarded = true;
        observe(verifyReceiveIntegrity);
        if (
          outer &&
          (responseForwarded ||
            pendingEnvelope?.kind === 'close' ||
            pendingEnvelope?.kind === 'ignored')
        ) {
          observe(() => {
            verifyReceiveIntegrity();
            withReceiveOrigin('finish-envelope', () =>
              caughtReceive(() => receipt.finishEnvelope()),
            );
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
    absent(connection, 'Afc');
    channel = own(connection, 'wq');
    require(builderEntered && channel === provisionalChannel);
    const channelPrototype = constructor(channel, profile.bmb, eventTargetPrototype);
    require(!descriptor(channel, eventMarker) && !descriptor(channelPrototype, eventMarker));
    retain(channel, eventMarker);
    retain(channelPrototype, eventMarker);
    source(
      own(channelPrototype, 'open'),
      'function(){this.ha.wa=this.oa;this.Ca&&(this.ha.Ab=!0);this.ha.connect(this.wa,this.ka||void 0)}',
      'dispatch-native-n07',
    );
    source(
      own(channelPrototype, 'close'),
      'function(){this.ha.disconnect()}',
      'dispatch-native-n07',
    );
    source(
      own(channelPrototype, 'send'),
      'function(a){var b=this.ha;if(typeof a==="string"){var c={};c.__data__=a;a=c}else this.Aa&&(c={},c.__data__=_.Uj(a),a=c);b.oa.push(new tlb(b.Jh++,a));b.hU==3&&slb(b)}',
      'dispatch-native-n07',
    );
    transport = own(channel, 'ha');
    require(transport === provisionalTransport);
    const tp = constructor(transport, profile.dt, Object.prototype);
    source(own(tp, 'connect'), profile.dtConnect, 'dispatch-native-n07');
    source(own(tp, 'disconnect'), profile.dtDisconnect, 'dispatch-native-n07');
    for (const key of [
      'Ca',
      'Gb',
      'Jh',
      'oa',
      'ka',
      'Ja',
      'Va',
      'kb',
      'Ua',
      'Za',
      'Ha',
      'Wa',
      'Pc',
      'Eb',
      'Yb',
      'xe',
    ])
      require(descriptor(transport, key)?.writable === true);
    require(descriptor(tp, 'hU')?.writable === true);
    for (const [key, value] of Object.entries({
      xg: 5000,
      Gh: 10000,
      wh: 2,
      Cf: 20000,
      Lg: false,
      Ac: false,
      Zb: false,
      Ab: true,
      yd: true,
      Qh: false,
      Fd: true,
      Wd: 1000,
      BPb: undefined,
      Uf: false,
      Wi: undefined,
      Sd: undefined,
      Kd: undefined,
    }))
      require(retain(transport, key) === value);
    for (const [key, text] of Object.entries({
      xD: 'function(){return this.hU==0}',
      isActive: 'function(){return!!this.wa&&this.wa.isActive(this)}',
    })) {
      source(own(tp, key), text, 'dispatch-native-n07');
      noOwn(transport, key);
      retain(transport, key);
    }
    exact(own(connection, 'Rj'), eventPrototype);
    for (const key of ['listen', 'removeAll']) {
      noOwn(own(connection, 'Rj'), key);
      retain(own(connection, 'Rj'), key);
    }
    handler = retain(channel, 'oa');
    constructor(handler, profile.hmb);
    require(retain(handler, 'ha') === channel);
    source(resolved(handler, 'ald'), physicalSources.xjd, 'dispatch-native-n07');
    source(
      resolved(handler, 'Zkd'),
      'function(a){this.ha.dispatchEvent(new Llb(a))}',
      'dispatch-native-n07',
    );
    source(
      resolved(handler, 'Ykd'),
      'function(){this.ha.dispatchEvent("Td")}',
      'dispatch-native-n07',
    );
    source(resolved(channel, 'listen'), eventMethods.listen, 'dispatch-native-n07');
    source(resolved(channel, 's4'), eventMethods.s4, 'dispatch-native-n07');
    source(resolved(channel, 'zqa'), eventMethods.zqa, 'dispatch-native-n07');
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
    source(resolved(channel, 'hbb'), eventMethods.hbb, 'dispatch-native-n07');
    require(retain(channel, 'F1c') === null && retain(channel, 'Rgf') === channel);
    const listeners = retain(retain(channel, 'Xpa'), 'listeners');
    const eventHandler = retain(connection, 'Rj');
    const registrations = own(eventHandler, 'wa');
    const events = ['Sd', 'Td', 'Vd', 'Ud'].map((type) => {
      const list = own(listeners, type);
      require(Array.isArray(list) && list.length === 1);
      const record = own(list, '0');
      require(
        own(record, 'src') === channel &&
          own(record, 'capture') === false &&
          own(record, 'E8a') === false &&
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
      own(transport, 'BPb') === undefined &&
        own(transport, 'Uf') === false &&
        own(transport, 'Ca') === null &&
        own(transport, 'Ua') === '',
    );
    require(own(transport, 'Jh') === 0 && own(transport, 'Gb') === 0 && own(tp, 'hU') === 1);
    noOwn(transport, 'hU');
    const active = retain(transport, 'Aa');
    const activePrototype = constructor(
      active,
      'function(a){this.Aa=a||10;_.fa.PerformanceNavigationTiming?(a=_.fa.performance.getEntriesByType("navigation"),a=a.length>0&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(_.fa.chrome&&_.fa.chrome.loadTimes&&_.fa.chrome.loadTimes()&&_.fa.chrome.loadTimes().wasFetchedViaSpdy);this.wa=a?this.Aa:1;this.ha=null;this.wa>1&&(this.ha=new Set);this.ka=null;this.oa=[]}',
      Object.prototype,
    );
    source(
      own(activePrototype, 'cancel'),
      'function(){this.oa=vlb(this);if(this.ka)this.ka.cancel(),this.ka=null;else if(this.ha&&this.ha.size!==0){for(let a of this.ha.values())a.cancel();this.ha.clear()}}',
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
        source(own(teardown, 'Na'), '()=>Nlb(this.observers,a)', 'dispatch-native-n07');
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
        const registration = sessionRegistration;
        require(registration);
        for (const item of [subscription, teardown]) {
          require(
            own(item, 'closed') === false || (cleanupStarted && own(item, 'closed') === true),
          );
        }
        require(
          own(subscription, 'Zs') === false || (cleanupStarted && own(subscription, 'Zs') === true),
        );
        require(own(subscription, 'wa') === teardownList || own(subscription, 'wa') === null);
        require(teardownList.length === 1 && own(teardownList, '0') === teardown);
        require(own(teardown, 'oa') === subscription || own(teardown, 'oa') === null);
        for (const subject of [
          own(instance, 'wB'),
          own(instance, 'Ca'),
          own(instance, 'ka'),
          own(connection, 'xC'),
        ]) {
          const observers = own(subject, 'observers');
          require(
            Array.isArray(observers) &&
              (subject === registration.input
                ? observers.length ===
                    (own(registration.take, 'closed') ||
                    (cleaning && own(subject, 'Zs') && disconnectDepth === 1)
                      ? 0
                      : 1) &&
                  (observers.length === 0 || observers[0] === registration.take)
                : observers.length === 0),
          );
        }
        const observers = own(own(connection, 'Ki'), 'observers');
        require(
          Array.isArray(observers) &&
            (observers.length === 0 ||
              (observers.length === 1 && own(observers, '0') === subscription)),
        );
      };
    }
    queue = own(instance, 'wa');
    require(
      Array.isArray(queue) &&
        Object.getPrototypeOf(queue) === Array.prototype &&
        queue.length === 0 &&
        !descriptor(queue, 'push'),
    );
    require(own(instance, 'Aa') === 0 && !descriptor(instance, 'oa'));
    require(
      !descriptor(instance, 'Ha') && !descriptor(p, 'Ha') && !descriptor(Object.prototype, 'Ha'),
    );
    if (!lifetime) retain(instance, 'Ha');
    retain(p, 'Ha');
    retain(Object.prototype, 'Ha');
    for (const [a, b] of [
      ['Va', 'wB'],
      ['Ja', 'ka'],
      ['Ua', 'Ca'],
      ['z1', 'Ki'],
      ['connectedObs', 'xC'],
    ]) {
      const owner = a === 'z1' || a === 'connectedObs' ? connection : instance;
      const subject = own(owner, a!);
      if (lifetime && a === 'connectedObs') lifecycleSubjects.set(subject, new Set());
      require(subject === own(owner, b!));
      exact(subject, a === 'connectedObs' ? behaviorPrototype : subjectPrototype);
      retain(owner, a!);
      retain(owner, b!);
      retain(subject, 'observers');
      require(
        own(subject, 'closed') === false &&
          own(subject, 'Zs') === false &&
          own(subject, 'hasError') === false &&
          own(subject, 'oa') === null,
      );
      for (const key of ['subscribe', 'pipe', 'Ca', 'ha', 'Ga', 'Aa', 'ka', 'getValue', 'value']) {
        if (
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
          if (this === subject && (cleaning || nativeClosed))
            acceptOriginalIdentifierRetirement(subject, key);
          if (!cleaning && opening) {
            require(this === subject);
            const connected =
              subject === own(connection, 'xC') &&
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
              subject === own(instance, 'Ca') &&
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
            subject !== own(connection, 'xC') &&
            (sourceDispatchDepth || !cleaning)
          )
            return receiveSubject(subject, key, method, this, args);
          require(cleaning && this === subject);
          require(
            own(subject, 'closed') === false &&
              ((own(subject, 'hasError') === false && own(subject, 'oa') === null) ||
                (lifecycleErrors.has(subject) &&
                  own(subject, 'hasError') === true &&
                  own(subject, 'Zs') === true &&
                  own(subject, 'oa') === lifecycleErrors.get(subject))) &&
              typeof own(subject, 'Zs') === 'boolean',
          );
          require(
            key === 'error' && lifetime && subject === own(instance, 'wB')
              ? args.length === 1
              : key === 'complete'
                ? args.length === 0
                : key === 'next' &&
                  args.length === 1 &&
                  (subject === own(connection, 'xC')
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
          if (key === 'error' && !own(subject, 'Zs')) lifecycleErrors.set(subject, args[0]);
          const value = Reflect.apply(method, this, args);
          checkpoint(false, false);
          return value;
        });
      }
    }
    if (lifetime) {
      for (const key of ['subscribe', 'Ga']) replace(own(connection, 'xC'), key, deny);
      for (const subject of [own(instance, 'wB'), own(instance, 'Ca'), own(instance, 'ka')])
        captureSubject(subject);
    }
    require(own(own(connection, 'xC'), 'Sm') === false);
    const serializers: Record<string, Call> = {};
    for (const key of ['RTa', 'NCa']) {
      const expected =
        codec === profile.aFd
          ? key === 'NCa'
            ? 'e=>e.serialize()'
            : 'e=>_.Rh(_.Lo(c,(0,_.be)(e)))'
          : key === 'NCa'
            ? 'f=>_.Qg(c(f))'
            : 'f=>{f=typeof f==="string"?_.Ak(f):f;return d(f)}';
      serializers[key] = source(retain(connection, key), expected, 'dispatch-native-n07');
      replace(
        connection,
        key,
        key === 'NCa'
          ? deny
          : function (this: unknown, ...args: any[]) {
              return withReceiveOrigin('capture', () =>
                caughtReceive(() => {
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
                    const value = withReceiveOrigin('decode', () =>
                      caughtReceive(() => Reflect.apply(serializers.RTa!, this, args)),
                    );
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
                }),
              );
            },
        false,
        undefined,
        key === 'RTa' ? 'capture' : undefined,
      );
      const r = retained.find((v) => v.owner === connection && v.key === key)!;
      r.descriptor = descriptor(connection, key);
    }
    for (const key of ['Jf', 'qf', 'Ei', 'Kh']) {
      noOwn(transport, key);
      fn(own(tp, key));
      replace(transport, key, deny);
    }
    for (const [owner, key] of [
      [instance, 'Shc'],
      [connection, 'send'],
      [channel, 'send'],
    ] as const) {
      noOwn(owner, key);
      replace(owner, key, deny);
    }
    installPhysical(tp, base, channelPrototype, serializers.NCa!);
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
          // Keep the phase active until the existing catch records the first failure.
          diagnostic = 'dispatch-native-n20-connect-original';
          const value = Reflect.apply(originalConnect, this, args);
          diagnostic = 'dispatch-native-n20-connect-after';
          checkpoint(true);
          return value;
        } catch (error) {
          return refused(error);
        } finally {
          inConnect = false;
        }
      },
      false,
      'dispatch-native-n20-connect-before',
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
            require(own(transport, 'hU') === 3 && own(transport, 'ka') === activeCallback);
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
            if (owner === instance) {
              require(disconnectDepth === 0);
              disconnectDepth++;
            }
            try {
              value = Reflect.apply(method, this, args);
            } finally {
              if (owner === instance) disconnectDepth--;
            }
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
            seed = own(instance, 'oa');
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
              'JJd',
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
                'JJd',
                diagnostic === 'dispatch-native-n15',
              );
            } catch (error) {
              return refused(error, n15('dispatch-native-n15-unknown-content'));
            }
            configWitness = () => witness(config);
          } else {
            require(own(instance, 'Aa') === 1 && queryCount === 0, n15(
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
                'JJd',
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
      own(entry, 'context') === null, 'dispatch-native-n20-entry-owner');
    require(Reflect.ownKeys(retainedMap.map).length === 1 &&
      own(retainedMap.map, '__data__') === retainedMap.data, 'dispatch-native-n20-entry-data');
  }
  function checkRequest(request: any) {
    const r = requests.get(request);
    require(r &&
      own(request, 'Aa') === transport &&
      own(request, 'oa') === r.rid &&
      own(request, 'Zc') === r.sid &&
      Object.getPrototypeOf(request) === r.prototype, 'dispatch-native-n20-request-owner');
    require(own(request, 'Za') === r.batchOwner, 'dispatch-native-n20-batch-owner');
    const batch = list(own(request, 'Za'));
    require(batch.length === r.batch.length &&
      batch.every((v, i) => v === r.batch[i]), 'dispatch-native-n20-batch-content');
    batch.forEach(checkEntry);
    checkBackend?.(request);
  }
  function physicalEvidence(): void {
    return withReceiveOrigin('owner-currentness', () =>
      caughtReceive(() => physicalEvidenceInScope()),
    );
  }
  function physicalEvidenceInScope(): void {
    require(own(transport, 'Ua') === protocolSid ||
      (activeCallback && opening), 'dispatch-native-n20-session-id');
    require(own(transport, 'Jh') === maps.size &&
      maps.size <= (closeFrame ? 3 : 2), 'dispatch-native-n20-map-count');
    for (const entry of maps.keys()) checkEntry(entry);
    for (const request of requests.keys()) checkRequest(request);
    list(own(transport, 'oa')).forEach(checkEntry);
    list(own(own(transport, 'Aa'), 'oa')).forEach(checkEntry);
    if (own(transport, 'xe') !== null) list(own(transport, 'xe')).forEach(checkEntry);
    for (const request of activeRequests())
      require(requests.has(request) || physicalDepth > 0, 'dispatch-native-n20-active-request');
    const state = own(transport, 'hU') ?? own(Object.getPrototypeOf(transport), 'hU');
    require(state === 1 ||
      state === 2 ||
      state === 3 ||
      ((cleaning || retired) && state === 0), 'dispatch-native-n20-transport-state');
    require(own(instance, 'Aa') === 1 &&
      own(instance, 'oa') === (aaSlot ? aaSlot.value : seed), 'dispatch-native-n20-wrapper-state');
    require(list(queue).every(
      (v) => v === config || v === query,
    ), 'dispatch-native-n20-queue-owner');
  }
  function snapshotPhysical(): () => void {
    return withReceiveOrigin('owner-currentness', () =>
      caughtReceive(() => snapshotPhysicalInScope()),
    );
  }
  function snapshotPhysicalInScope(): () => void {
    const records: Retained[] = [];
    for (const [owner, keys] of [
      [
        transport,
        [
          'hU',
          'Ua',
          'Gb',
          'Jh',
          'Ca',
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
          'xe',
        ],
      ],
      [instance, ['ha', 'wa', 'Aa', 'oa', 'xD', 'hasError', 'p6', 'Ha']],
      [own(connection, 'xC'), ['Sm']],
      [own(transport, 'Aa'), ['ka', 'ha', 'oa', 'wa']],
    ] as const)
      for (const key of keys) records.push({ owner, key, descriptor: descriptor(owner, key) });
    for (const request of requests.keys()) {
      const xhr = own(request, 'ha');
      if (xhr !== null)
        for (const key of ['qE', 'EPc', 'K6b', 'TWa', 'r5'])
          records.push({ owner: xhr, key, descriptor: descriptor(xhr, key) });
      for (const key of ['Va', 'Ub', 'kH', 'Ha', 'Fb', 'IG', 'kb', 'Yb', 'Ab', 'ha', 'Gb', 'Pc'])
        records.push({ owner: request, key, descriptor: descriptor(request, key) });
    }
    const arrays = [queue, own(transport, 'oa'), own(own(transport, 'Aa'), 'oa')].map((value) => ({
      value,
      contents: list(value),
    }));
    const active = activeRequests();
    const verify = () => {
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
    return () => withReceiveOrigin('owner-currentness', () => caughtReceive(verify));
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
    const previousSchedule = own(transport, 'Ca');
    physicalDepth++;
    try {
      const result = call();
      const nextSchedule = own(transport, 'Ca');
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
      retain(ns, 'Gkb'),
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

    const xhrPrototype = proto('Vj', xhrSources.constructor);
    for (const [key, text] of Object.entries(xhrSources))
      if (key !== 'constructor') source(own(xhrPrototype, key), text, 'dispatch-native-n08');
    require(Object.getPrototypeOf(xhrPrototype) === eventTargetPrototype, 'dispatch-native-n19');
    require(!descriptor(xhrPrototype, eventMarker), 'dispatch-native-n19');
    retain(xhrPrototype, eventMarker);
    require(retain(own(ns, 'Vj'), 'oe') === eventTargetPrototype, 'dispatch-native-n19');
    source(
      resolved(xhrPrototype, 'dispose'),
      'function(){this.r5||(this.r5=!0,this.Hc())}',
      'dispatch-native-n08',
    );
    source(
      resolved(xhrPrototype, 'isDisposed'),
      'function(){return this.r5}',
      'dispatch-native-n08',
    );
    source(
      resolved(eventTargetPrototype, 'Hc'),
      'function(){_.Yb.oe.Hc.call(this);this.removeAllListeners();this.F1c=null}',
      'dispatch-native-n08',
    );
    source(
      resolved(eventTargetPrototype, 'removeAllListeners'),
      'function(a){return this.Xpa?this.Xpa.removeAll(a):0}',
      'dispatch-native-n08',
    );
    source(
      resolved(eventMapPrototype, 'removeAll'),
      'function(a){a=a&&a.toString();var b=0;for(let c in this.listeners)if(!a||c==a){let d=this.listeners[c];for(let e=0;e<d.length;e++)++b,Aga(d[e]);delete this.listeners[c];this.ha--}return b}',
      'dispatch-native-n08',
    );
    for (const key of ['dispatchEvent', 'removeAllListeners', 'zqa', 'hbb', 's4'])
      require(resolved(xhrPrototype, key) ===
        resolved(eventTargetPrototype, key), 'dispatch-native-n19');
    require(retain(own(ns, 'Yb'), 'oe') === own(own(ns, 'Eb'), 'prototype'), 'dispatch-native-n19');
    source(
      resolved(own(own(ns, 'Eb'), 'prototype'), 'Hc'),
      'function(){if(this.n_a)for(;this.n_a.length;)this.n_a.shift()()}',
      'dispatch-native-n08',
    );
    const nativeFactory = retain(ns, 'aja'),
      nativeFactoryPrototype = proto('bja', 'function(){}');
    exact(nativeFactory, nativeFactoryPrototype);
    noOwn(nativeFactory, 'g9');
    retain(nativeFactory, 'g9');
    source(
      own(nativeFactoryPrototype, 'g9'),
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
        own(xhr, 'qE') === true &&
        own(xhr, 'EPc') === false &&
        own(xhr, 'K6b') === false &&
        own(xhr, 'TWa') === false, 'dispatch-native-n19');
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
          own(xhr, 'qE') === true &&
          own(xhr, 'K6b') === true &&
          own(xhr, 'EPc') === false &&
          own(xhr, 'TWa') === false, 'dispatch-native-n21');
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
            own(xhr, 'qE') === false &&
            own(xhr, 'TWa') === false, 'dispatch-native-n19');
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
        'Y_c',
        'isDisposed',
        'dispatchEvent',
        'removeAllListeners',
        'zqa',
        'hbb',
        's4',
        'dispose',
      ]) {
        noOwn(xhr, key);
        if (!captured) resolved(xhr, key);
      }
      require(own(xhr, 'BPb') === null &&
        own(xhr, 'nmb') === 0 &&
        own(xhr, 'p5f') === false &&
        own(xhr, 'eD') === true &&
        own(xhr, 'tI') === '' &&
        own(xhr, 'Pcd') === null &&
        own(xhr, 'Tzc') === null, 'dispatch-native-n19');
      if (!captured) {
        for (const key of ['BPb', 'nmb', 'p5f', 'eD', 'tI', 'Pcd', 'Tzc']) retain(xhr, key);
        require(retain(xhr, 'n_a') === undefined, 'dispatch-native-n19');
        require(retain(xhr, 'F1c') === null && retain(xhr, 'Rgf') === xhr, 'dispatch-native-n19');
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
        const eventMap = retain(xhr, 'Xpa');
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
            own(record, 'listener') === own(requests.get(request)!.prototype, 'Xc') &&
            own(record, 'capture') === false &&
            own(record, 'E8a') === false &&
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
    const notify = retain(xhrPrototype, 'Y_c');
    const notifySource = Reflect.apply(sourceText, fn(notify), []);
    if (notifySource === 'function(){Cta(this)}') {
      require(own(ns, 'vga') !== true, 'dispatch-native-n19');
      return;
    }
    source(
      notify,
      'function(){if(a.isDisposed())return b.apply(this,arguments);try{return b.apply(this,arguments)}catch(d){M5o(a,d)}}',
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
      wrap: 'function(a){return J5o(this,a)}',
      unwrap: 'function(a){return a[K5o(this,!1)]||a}',
    });
    for (const key of ['wrap', 'unwrap', 'isDisposed']) {
      noOwn(monitor, key);
      retain(monitor, key);
    }
    noOwn(monitorPrototype, 'isDisposed');
    retain(monitorPrototype, 'isDisposed');
    source(resolved(monitor, 'isDisposed'), 'function(){return this.r5}', 'dispatch-native-n08');
    source(
      retain(ns, 'Fd'),
      'function(a){return Object.prototype.hasOwnProperty.call(a,Tea)&&a[Tea]||(a[Tea]=++Uea)}',
      'dispatch-native-n08',
    );
    require(retain(monitor, 'ka') === true &&
      retain(monitor, 'ha') === true &&
      retain(monitor, 'r5') === false &&
      retain(ns, 'vga') === true, 'dispatch-native-n19');
    fn(retain(monitor, 'oa'));
    const monitors = retain(ns, 'uga');
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
    const lf = source(own(tp, 'Jf'), physicalSources.Jf, 'dispatch-native-n07');
    source(
      own(proto('l'), 'serialize'),
      'serialize(a){return JSON.stringify(_.Hba(this,a))}',
      'dispatch-native-n07',
    );
    source(
      retain(ns, 'Qg'),
      'function(a,b){b===void 0&&(b=0);Woa();b=Voa[b];for(var c=Array(Math.floor(a.length/3)),d=b[64]||"",e=0,f=0;e<a.length-2;e+=3){var g=a[e],k=a[e+1],r=a[e+2],u=b[g>>2];g=b[(g&3)<<4|k>>4];k=b[(k&15)<<2|r>>6];r=b[r&63];c[f++]=u+g+k+r}u=0;r=d;switch(a.length-e){case 2:u=a[e+1],r=b[(u&15)<<2]||d;case 1:a=a[e],c[f]=b[a>>2]+b[(a&3)<<4|u>>4]+r+d}return c.join("")}',
      'dispatch-native-n07',
    );
    captureBackend();
    proto(
      'ZJ',
      'class extends Error{constructor(a,b){super(b?`error code ${a}: ${b}`:`error code ${a}`);this.Vf=a}}',
    );
    const fatalHandler = source(
      resolved(handler, 'FU'),
      'function(a,b){this.ha.dispatchEvent(new Mlb(b))}',
      'dispatch-native-n07',
    );
    noOwn(handler, 'FU');
    replace(handler, 'FU', function (this: unknown, ...args: any[]) {
      require(
        this === handler &&
          args.length === 2 &&
          args[0] === transport &&
          [2, 5, 6, 7, 10, 11].includes(args[1]) &&
          own(transport, 'hU') === 0,
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
      if (args.length === 2 && args[0] === own(own(own(ns, 'Vj'), 'prototype'), 'O8d')) {
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
        source(own(p, 'oc'), physicalSources.oc, 'dispatch-native-n07');
        source(own(p, 'Xc'), physicalSources.Xc, 'dispatch-native-n07');
        for (const [key, text] of Object.entries({
          setTimeout: 'function(a){this.kH=a}',
          cancel: 'function(){this.kb=!0;alb(this)}',
          FY: 'function(){return this.Ha}',
          getLastError: 'function(){return this.IG}',
          nm: 'function(){return this.Zc}',
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
          for (const key of ['Pc', 'oc', 'Xc']) {
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
          sid = own(candidate, 'Zc');
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
        const originalOc = own(p, 'oc');
        if (!existing)
          replace(candidate, 'oc', function (this: unknown, ...values: any[]) {
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
          for (const key of ['Aa', 'ka', 'Zc', 'oa', 'Gb', 'Za', 'mb', 'Yb', 'Ac', 'ub', 'Zb'])
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
      'Jf',
      function (this: unknown, ...args: any[]) {
        require(this === transport && args.length <= 1 && !opening);
        if (!physicalStarted) {
          require(
            args.length === 0 &&
              own(transport, 'Ca') === true &&
              list(own(transport, 'oa')).length === 0 &&
              config &&
              query,
          );
          checkpoint();
          physicalStarted = true;
          transportWitness = snapshotPhysical();
        }
        require(own(transport, 'Ca'));
        if (own(transport, 'Ca') === true) require(args.length === 0);
        else
          require(
            retrySchedule &&
              retrySchedule.handle === own(transport, 'Ca') &&
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
              own(transport, 'hU') === 3,
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
              // physicalCall catches before the outer diagnostic scope is restored.
              diagnostic = 'dispatch-native-n20-forward-original';
              const result = Reflect.apply(lf, this, args);
              diagnostic = 'dispatch-native-n20-forward-after';
              return result;
            } finally {
              constructing = undefined;
            }
          });
        } finally {
          if (closeFlush) cleaning = false;
        }
      },
      false,
      'dispatch-native-n20-forward-before',
    );
    for (const key of ['qf', 'Ei', 'Kh'] as const) {
      const original = source(own(tp, key), physicalSources[key], 'dispatch-native-n07');
      replace(transport, key, function (this: unknown, ...args: any[]) {
        require(
          this === transport &&
            args.length === 0 &&
            physicalStarted &&
            protocolSid !== '' &&
            own(transport, 'hU') === 3 &&
            !constructing,
        );
        require(
          key === 'qf'
            ? own(transport, 'ka') === null && own(transport, 'Pc') > 0
            : key === 'Ei'
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
    const opened = source(resolved(handler, 'ald'), physicalSources.xjd, 'dispatch-native-n07');
    replace(handler, 'ald', function (this: unknown, ...args: any[]) {
      require(
        this === handler &&
          args.length === 0 &&
          activeCallback &&
          !opening &&
          protocolSid === '' &&
          own(transport, 'hU') === 3,
      );
      checkRequest(activeCallback);
      require(requests.get(activeCallback)?.sid === '');
      const sid = own(transport, 'Ua');
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
              own(instance, 'p6') === true &&
              list(queue).length === 0,
          );
          require(readGeminiNativeSendKind(ns, args[0]) === 'close');
          closeFrame = args[0];
          const witness = captureGeminiNativeWireContent(ns, closeFrame, 'JJd');
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
      'NCa',
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
        const nextId = own(transport, 'Jh');
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
            own(transport, 'Jh') === nextId + 1 &&
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
        (entry.owner === ns && ['wA', 'au', 'Tt'].includes(String(entry.key))) ||
        (entry.owner === lifetime && entry.key === 'Uc')
      )
        restore(entry);
    }
  }
  function detach() {
    materializationRevoked = true;
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
        if (lifetime && r.owner === ns && r.key === 'aM') continue;
        restore(r);
      }
      receipt.restoreMaterializers();
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
        const privacy = own(own(packet, 'request'), 'x5d');
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
            source(teardown, '()=>{w.onComplete();C();VAd(this.zl)}');
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
