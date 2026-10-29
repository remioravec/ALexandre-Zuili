/* DRS Experience — tous les blocs de la page, dans l'ordre d'origine.
   Un bloc = une IIFE : portée isolée, sortie anticipée possible sur les
   pages qui n'ont pas l'élément visé. */

/* ── bloc 1 ───────────────────────────────────────────────────────── */
(function(){
  /* ═══ grille tarifaire réelle — affiches GL Coaching Racing ═══ */
  window.GT3 = (function(){
    const GRILLE = {
      A: [[50,820],[70,1140],[120,1900],[150,2300],[200,3100]],
      B: [[90,2430],[140,3690],[200,4800],[300,6500]],
      C: [[90,3490],[140,4990],[200,6790],[300,8990]]
    };
    const PALIER = {
      'Le Bugatti — Le Mans':'B','Magny-Cours':'B','Dijon-Prenois':'B','La Ferté-Gaucher':'B',
      'Paul Ricard — Le Castellet':'C','Spa-Francorchamps':'C',
      'Clastres':'A','Les Écuyers':'A'
    };
    const NOM = {50:'Initiation',70:'Découverte',120:'Performance',150:'Grand format',200:'VIP GT3 Touring',
                 90:'Découverte',140:'Performance',300:'Exclusive'};
    const eur = n => n.toLocaleString('fr-FR').replace(/\u202f|\u00a0/g,' ') + ' €';
    function palier(circuit){ return PALIER[circuit] || 'B'; }
    function offres(circuit){
      return GRILLE[palier(circuit)].map(([km,prix]) => ({km, prix, nom:NOM[km]||km+' km'}));
    }
    function compris(circuit){
      const base = 'Coaching · carburant · inscription circuit';
      return palier(circuit)==='C' ? base + ' · transport du véhicule' : base;
    }
    return {offres, compris, eur, palier};
  })();
})();

/* ── bloc 2 ───────────────────────────────────────────────────────── */
(function(){
  /* ═══ méga-menu ═══ */
  const navBar=document.getElementById('top'),veil=document.getElementById('veil');
    if(!navBar) return;
  const trigs=[...document.querySelectorAll('.navlink[data-mega]')];
  let openId=null,hoverTimer=null;
  function showMega(id){
    document.querySelectorAll('.mega').forEach(m=>m.classList.toggle('on',m.id===id));
    trigs.forEach(t=>t.setAttribute('aria-expanded',String(t.dataset.mega===id)));
    veil.classList.add('on');navBar.classList.add('menu-open');openId=id;
  }
  function hideMega(){
    document.querySelectorAll('.mega').forEach(m=>m.classList.remove('on'));
    trigs.forEach(t=>t.setAttribute('aria-expanded','false'));
    veil.classList.remove('on');navBar.classList.remove('menu-open');openId=null;
  }
  trigs.forEach(t=>{
    t.addEventListener('click',e=>{e.stopPropagation();openId===t.dataset.mega?hideMega():showMega(t.dataset.mega);});
    t.addEventListener('mouseenter',()=>{if(matchMedia('(pointer:fine)').matches){clearTimeout(hoverTimer);showMega(t.dataset.mega);}});
  });
  document.querySelectorAll('.mega').forEach(m=>{
    m.addEventListener('mouseenter',()=>clearTimeout(hoverTimer));
    m.addEventListener('mouseleave',()=>{if(matchMedia('(pointer:fine)').matches)hoverTimer=setTimeout(hideMega,180);});
    m.querySelectorAll('a').forEach(a=>a.addEventListener('click',hideMega));
  });
  navBar.addEventListener('mouseleave',()=>{if(matchMedia('(pointer:fine)').matches)hoverTimer=setTimeout(hideMega,180);});
  veil.addEventListener('click',hideMega);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){hideMega();closeDrawer();}});

  /* ═══ menu mobile ═══ */
  const burger=document.getElementById('burger'),drawer=document.getElementById('drawer'),dfoot=document.getElementById('dfoot');
  function closeDrawer(){drawer.classList.remove('on');dfoot.style.display='none';burger.setAttribute('aria-expanded','false');document.body.classList.remove('locked');}
  burger.addEventListener('click',()=>{
    const open=!drawer.classList.contains('on');
    drawer.classList.toggle('on',open);dfoot.style.display=open?'flex':'none';
    burger.setAttribute('aria-expanded',String(open));document.body.classList.toggle('locked',open);
    if(open)hideMega();
  });
  drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeDrawer));

  const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target);}})},{threshold:.1,rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.rise').forEach(el=>io.observe(el));

  const deck=document.getElementById('deck'),hero=document.getElementById('hero');
  if(deck&&hero&&matchMedia('(pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
    let raf=0;
    hero.addEventListener('mousemove',e=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{
      const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      deck.style.setProperty('--ry',(x*6).toFixed(2)+'deg');deck.style.setProperty('--rx',(-y*2.6).toFixed(2)+'deg');});});
    hero.addEventListener('mouseleave',()=>{deck.style.setProperty('--ry','0deg');deck.style.setProperty('--rx','0deg');});
  }

  const simC=document.getElementById('simC'),simF=document.getElementById('simF');
  function simOptions(){
    const c=simC.querySelector('input:checked').value;
    const o=GT3.offres(c);
    const garde=simF.querySelector('input:checked');
    const km=garde?parseInt(garde.value,10):null;
    simF.innerHTML=o.map((x,i)=>{
      const on=(km!==null&&x.km===km)||(km===null&&i===0);
      return '<label><input type="radio" name="simf" value="'+x.km+'"'+(on?' checked':'')+
             '><span>'+x.nom+' · '+x.km+' km</span></label>';
    }).join('');
    if(!simF.querySelector('input:checked')) simF.querySelector('input').checked=true;
  }
  function sync(){
    const c=simC.querySelector('input:checked').value;
    const km=parseInt(simF.querySelector('input:checked').value,10);
    const x=GT3.offres(c).find(v=>v.km===km)||GT3.offres(c)[0];
    document.getElementById('oC').textContent=c;
    document.getElementById('oF').textContent=x.nom;
    document.getElementById('oT').textContent=x.km+' km';
    document.getElementById('oI').textContent=GT3.compris(c);
    document.getElementById('oP').textContent=GT3.eur(x.prix);
    document.getElementById('simCta').textContent='Demander cette date — '+c.split(' —')[0];
  }
  if(simC&&simF){
    simC.addEventListener('change',()=>{simOptions();sync();});
    simF.addEventListener('change',sync);
    simOptions();sync();
  }
})();

/* ── bloc 3 ───────────────────────────────────────────────────────── */
(function(){
  /* ═══ tunnel de réservation ═══ */
  (function(){
    const rv=document.getElementById('rv'),rvVeil=document.getElementById('rvVeil');
    if(!rv) return;
    const panes=[...rv.querySelectorAll('.rv-pane')],sts=[...rv.querySelectorAll('.rv-st')];
    const bar=document.getElementById('rvBar'),bPrev=document.getElementById('rvPrev'),bNext=document.getElementById('rvNext');
    let step=0,sent=false,lastFocus=null,picked=null;
    /* ── branchement /api/dates : creneaux[nom du circuit] = Map(AAAA-MM-JJ -> entrée) ── */
    let creneaux=null,idem=null,ouverture=0,chargement=null;
    let cur=new Date();cur.setDate(1);cur.setHours(0,0,0,0);
    const today=new Date();today.setHours(0,0,0,0);
    const MOIS=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];

    function iso(dt){
      return dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')+'-'+String(dt.getDate()).padStart(2,'0');
    }
    function circuitChoisi(){
      const r=rv.querySelector('input[name="rvc"]:checked');
      return r?r.value:null;
    }
    function creneau(nom,dt){
      if(!creneaux||!dt)return null;
      const m=creneaux[nom];
      return m?(m.get(iso(dt))||null):null;
    }
    /* Les jours absents de /api/dates sont désactivés ; les circuits sans date
       ouverte sortent du sélecteur. Si l'API ne répond pas, le calendrier reste
       ouvert et la note le dit : mieux vaut une demande à vérifier qu'un tunnel
       mort. Passer STRICT à true pour refuser toute date sans confirmation. */
    const STRICT=false;
    function chargerDates(){
      if(chargement)return chargement;
      chargement=fetch('/api/dates',{headers:{accept:'application/json'}})
        .then(function(r){ if(!r.ok)throw new Error('HTTP '+r.status); return r.json(); })
        .then(function(d){
          const par={};
          (d.dates||[]).forEach(function(x){
            if(!par[x.nom])par[x.nom]=new Map();
            par[x.nom].set(x.date,x);
          });
          creneaux=par;
          filtrerCircuits();
          majNote();
          drawCal();
        })
        .catch(function(e){
          creneaux=null;
          console.warn('[dates] disponibilités indisponibles :',e.message);
          majNote();
          drawCal();
        });
      return chargement;
    }
    function filtrerCircuits(){
      if(!creneaux)return;
      const radios=[...rv.querySelectorAll('input[name="rvc"]')];
      let coche=null;
      radios.forEach(function(r){
        const ouvert=!!creneaux[r.value];
        const lab=r.closest('label');
        if(lab)lab.style.display=ouvert?'':'none';
        r.disabled=!ouvert;
        if(ouvert&&!coche)coche=r;
      });
      const actuel=radios.find(function(r){return r.checked;});
      if((!actuel||actuel.disabled)&&coche){coche.checked=true;rvOptions();}
      /* Aucune date ouverte nulle part : sans ce message, l'étape 1 est un
         écran vide sans explication (fin de saison, base non remplie). */
      let vide=document.getElementById('rvVide');
      if(!coche){
        if(!vide){
          vide=document.createElement('p');
          vide.id='rvVide';vide.className='rv-hint';
          vide.style.cssText='margin:0;padding:18px;border:1px solid var(--line);color:var(--bone)';
          vide.innerHTML='Aucune date n\'est ouverte à la réservation en ligne pour le moment.<br>'+
            'Appelez-nous au <b>06 38 68 59 61</b> : nous regardons ensemble les prochaines disponibilités.';
          document.getElementById('rvC').appendChild(vide);
        }
        vide.style.display='block';
        bNext.disabled=true;
      }else if(vide){
        vide.style.display='none';bNext.disabled=false;
      }
    }
    function majNote(){
      const n=document.getElementById('calNote');
      if(!n)return;
      if(!creneaux){
        n.textContent='Disponibilités non vérifiées — votre demande sera confirmée sous 24 h.';
        n.style.display='block';return;
      }
      const nom=circuitChoisi();
      const m=nom?creneaux[nom]:null;
      const nb=m?m.size:0;
      n.textContent=nb?(nb>1?nb+' dates ouvertes sur ce circuit.':'1 date ouverte sur ce circuit.')
                      :'Aucune date ouverte sur ce circuit pour le moment.';
      n.style.display='block';
    }

    function drawCal(){
      const y=cur.getFullYear(),m=cur.getMonth();
      document.getElementById('calMonth').textContent=MOIS[m]+' '+y;
      document.getElementById('calPrev').disabled=(y===today.getFullYear()&&m<=today.getMonth())||new Date(y,m,1)<=new Date(today.getFullYear(),today.getMonth(),1);
      const first=(new Date(y,m,1).getDay()+6)%7, days=new Date(y,m+1,0).getDate();
      const g=document.getElementById('calGrid');g.innerHTML='';
      for(let i=0;i<first;i++){const s=document.createElement('span');s.className='void';g.appendChild(s);}
      for(let dd=1;dd<=days;dd++){
        const dt=new Date(y,m,dd),b=document.createElement('button');
        b.type='button';b.textContent=dd;
        const dow=dt.getDay();
        if(dow===0||dow===6)b.classList.add('wk');
        if(dt<today)b.disabled=true;
        if(creneaux){
          const e=creneau(circuitChoisi(),dt);
          if(!e||e.places<=0)b.disabled=true;
          else b.title=e.nom+' — '+(e.places>1?e.places+' places':'1 place');
        }else if(STRICT){b.disabled=true;}
        if(picked&&dt.getTime()===picked.getTime())b.classList.add('sel');
        b.addEventListener('click',()=>{picked=dt;document.getElementById('errDate').classList.remove('on');drawCal();});
        g.appendChild(b);
      }
    }
    function fmt(dt){return dt?dt.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}):'—';}

    function openRV(pre){
      lastFocus=document.activeElement;
      rv.classList.add('on');rvVeil.classList.add('on');document.body.classList.add('locked');
      if(pre&&pre.circuit){const r=[...rv.querySelectorAll('input[name="rvc"]')].find(x=>x.value===pre.circuit);if(r)r.checked=true;}
      if(pre&&pre.circuit){rvOptions();}
      if(pre&&pre.km){const r=[...rv.querySelectorAll('input[name="rvf"]')].find(x=>x.value===String(pre.km));if(r)r.checked=true;}
      rvOptions();go(0,true);drawCal();
      idem=(crypto&&crypto.randomUUID)?crypto.randomUUID():String(Date.now())+'-'+Math.random().toString(16).slice(2);
      ouverture=Date.now();
      sent=false;
      document.getElementById('rvRecap').style.display='';
      document.getElementById('rvDone').style.display='none';
      document.getElementById('errEnvoi').classList.remove('on');
      chargerDates();
      setTimeout(()=>document.getElementById('rvClose').focus(),340);
    }
    function closeRV(){
      rv.classList.remove('on');rvVeil.classList.remove('on');document.body.classList.remove('locked');
      if(lastFocus)lastFocus.focus();
    }
    function go(n,silent){
      const back=n<step;step=n;
      panes.forEach(p=>p.classList.remove('on','back'));
      panes[n].classList.add('on');if(back&&!silent)panes[n].classList.add('back');
      sts.forEach((s,i)=>{s.classList.toggle('act',i===n);s.classList.toggle('done',i<n);});
      bar.style.width=((n+1)/4*100)+'%';
      bPrev.style.visibility=(n===0||sent)?'hidden':'visible';
      bNext.textContent=n===3?(sent?'Fermer':'Envoyer ma demande'):'Continuer';
      if(n===3&&!sent)recap();
      rv.querySelector('.rv-body').scrollTop=0;
    }
    /* #errEnvoi vit dans le panneau 3 : invisible dès qu'on renvoie
       l'utilisateur au calendrier. Les messages qui ramènent à l'étape date
       passent donc par #errDate, qui est sur le bon panneau. */
    const ERR_DATE_DEFAUT=document.getElementById('errDate').textContent;
    function erreurDate(txt){
      const e=document.getElementById('errDate');
      e.textContent=txt||ERR_DATE_DEFAUT;
      e.classList.add('on');
    }
    function bad(id,is){document.getElementById(id).closest('.fld').classList.toggle('bad',is);return !is;}
    function valid(n){
      if(n===1){
        const ok=!!picked,e=document.getElementById('errDate');
        e.textContent=ERR_DATE_DEFAUT;
        e.classList.toggle('on',!ok);
        return ok;
      }
      if(n===2){
        let ok=true;
        ok=bad('rvPre',!document.getElementById('rvPre').value.trim())&&ok;
        ok=bad('rvNom',!document.getElementById('rvNom').value.trim())&&ok;
        ok=bad('rvMail',!/^\S+@\S+\.\S+$/.test(document.getElementById('rvMail').value))&&ok;
        ok=bad('rvTel',document.getElementById('rvTel').value.replace(/\D/g,'').length<9)&&ok;
        return ok;
      }
      return true;
    }

    function rvOptions(){
      const box=document.getElementById('rvF');
      const c=rv.querySelector('input[name="rvc"]:checked').value;
      const garde=box.querySelector('input:checked');
      const km=garde?parseInt(garde.value,10):null;
      box.innerHTML=GT3.offres(c).map((x,i)=>{
        const on=(km!==null&&x.km===km)||(km===null&&i===0);
        return '<label class="wide"><input type="radio" name="rvf" value="'+x.km+'"'+(on?' checked':'')+'>'+
          '<span class="face"><span class="tx"><b>'+x.nom+'</b><span>'+x.km+' km au volant · '+GT3.compris(c)+'</span></span>'+
          '<span class="px">'+GT3.eur(x.prix)+'</span><span class="rd"></span></span></label>';
      }).join('');
      if(!box.querySelector('input:checked')) box.querySelector('input').checked=true;
    }
    rv.querySelectorAll('input[name="rvc"]').forEach(r=>r.addEventListener('change',function(){
      rvOptions();
      /* une date retenue sur le circuit précédent peut ne pas exister ici */
      if(creneaux&&picked&&!creneau(circuitChoisi(),picked))picked=null;
      majNote();drawCal();
    }));
    rv.querySelectorAll('.fld input').forEach(el=>el.addEventListener('input',()=>el.closest('.fld').classList.remove('bad')));

    function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');}
    function recap(){
      const c=rv.querySelector('input[name="rvc"]:checked').value;
      const km=parseInt(rv.querySelector('input[name="rvf"]:checked').value,10);
      const x=GT3.offres(c).find(v=>v.km===km)||GT3.offres(c)[0];
      const rows=[
        ['Voiture','Porsche 911 GT3 992.2 Touring'],
        ['Circuit',esc(c)],
        ['Formule',esc(x.nom)],
        ['Distance au volant',x.km+' km'],
        ['Date souhaitée',fmt(picked)],
        ['Flexibilité',esc(document.getElementById('rvFlex').value)],
        ['Accompagnants',esc(document.getElementById('rvPax').value)],
        ['Compris',esc(GT3.compris(c))],
        ['Pilote',esc(document.getElementById('rvPre').value)+' '+esc(document.getElementById('rvNom').value)],
        ['Expérience',esc(document.getElementById('rvNiv').value)],
        ['Contact',esc(document.getElementById('rvMail').value)+'<br>'+esc(document.getElementById('rvTel').value)]
      ];
      const msg=document.getElementById('rvMsg').value.trim();
      if(msg)rows.push(['Message',esc(msg)]);
      document.getElementById('rvBox').innerHTML=
        rows.map(r=>'<div class="rw"><span class="k">'+r[0]+'</span><span class="v">'+r[1]+'</span></div>').join('')+
        '<div class="rw tt"><span class="k">Tarif TTC</span><span class="v">'+GT3.eur(x.prix)+'</span></div>';
    }
    function confirmer(){
      sent=true;
      document.getElementById('rvRecap').style.display='none';
      document.getElementById('rvDone').style.display='block';
      document.getElementById('rvDoneMsg').textContent=
        'Merci '+document.getElementById('rvPre').value.trim()+'. Nous vérifions la disponibilité de la 992.2 pour le '+fmt(picked)+' et revenons vers vous sous 24 heures à '+document.getElementById('rvMail').value.trim()+'.';
      bPrev.style.visibility='hidden';bNext.textContent='Fermer';bNext.disabled=false;
    }
    function messageErreur(code,d){
      if(code===422&&d&&d.erreur==='km_incompatible')return 'Cette distance n\'est pas proposée sur ce circuit.';
      if(code===422)return 'Une information du formulaire est invalide. Vérifiez vos coordonnées.';
      if(code===429)return 'Trop de tentatives. Patientez quelques minutes avant de réessayer.';
      if(code===503)return 'Le service de réservation est momentanément indisponible. Appelez-nous au 06 38 68 59 61.';
      return 'Envoi impossible pour le moment. Appelez-nous au 06 38 68 59 61.';
    }
    bNext.addEventListener('click',function(){
      if(step<3){if(valid(step))go(step+1);return;}
      if(sent){closeRV();return;}

      const err=document.getElementById('errEnvoi');
      err.classList.remove('on');
      const nom=circuitChoisi();
      const km=parseInt(rv.querySelector('input[name="rvf"]:checked').value,10);
      const entree=creneau(nom,picked);

      /* Sans créneau identifié, le serveur ne peut ni relire la date dans Notion
         ni la verrouiller : on renvoie l'utilisateur à l'étape du calendrier. */
      if(!entree){
        if(creneaux){
          picked=null;go(1);
          erreurDate('Cette date n\'est plus ouverte sur ce circuit. Choisissez-en une autre.');
        }else{
          err.textContent='Les disponibilités n\'ont pas pu être vérifiées. Appelez-nous au 06 38 68 59 61.';
          err.classList.add('on');
        }
        return;
      }

      bNext.disabled=true;bNext.textContent='Envoi…';
      fetch('/api/reservation',{
        method:'POST',
        headers:{'content-type':'application/json','idempotency-key':idem},
        body:JSON.stringify({
          trackdayId:entree.id,
          km:km,
          prenom:document.getElementById('rvPre').value.trim(),
          nom:document.getElementById('rvNom').value.trim(),
          email:document.getElementById('rvMail').value.trim(),
          telephone:document.getElementById('rvTel').value.trim(),
          experience:document.getElementById('rvNiv').value,
          flexibilite:document.getElementById('rvFlex').value,
          accompagnants:document.getElementById('rvPax').value,
          message:document.getElementById('rvMsg').value.trim()||undefined,
          hp:document.getElementById('rvHp').value,
          ouvertureMs:ouverture
        })
      }).then(function(r){
        if(r.status===201){confirmer();return null;}
        if(r.status===409){
          picked=null;
          chargement=null;creneaux=null;
          chargerDates().then(function(){
            go(1);
            erreurDate('Ce créneau vient d\'être pris. Choisissez une autre date.');
          });
          return null;
        }
        return r.json().catch(function(){return {};}).then(function(d){
          err.textContent=messageErreur(r.status,d);
          err.classList.add('on');
        });
      }).catch(function(){
        err.textContent='Envoi impossible. Vérifiez votre connexion et réessayez.';
        err.classList.add('on');
      }).then(function(){
        if(!sent){bNext.disabled=false;bNext.textContent='Envoyer ma demande';}
      });
    });
    bPrev.addEventListener('click',()=>{if(step>0)go(step-1);});
    document.getElementById('rvClose').addEventListener('click',closeRV);
    rvVeil.addEventListener('click',closeRV);
    document.getElementById('calPrev').addEventListener('click',()=>{cur.setMonth(cur.getMonth()-1);drawCal();});
    document.getElementById('calNext').addEventListener('click',()=>{cur.setMonth(cur.getMonth()+1);drawCal();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&rv.classList.contains('on'))closeRV();});

    /* tous les CTA de réservation ouvrent le tunnel */
    document.querySelectorAll('a[href="#reserver"],a[href="/reservation/"]').forEach(a=>{
      a.addEventListener('click',e=>{e.preventDefault();
        const s=document.getElementById('simC'),g=document.getElementById('simF');
        const pre={};
        if(s&&g&&a.id==='simCta'){pre.circuit=s.querySelector('input:checked').value;pre.km=g.querySelector('input:checked').value;}
        openRV(pre);});
    });
    drawCal();
  })();
})();

/* ── bloc 4 ───────────────────────────────────────────────────────── */
(function(){
  /* ═══ carrousel d'avis ═══ */
  (function(){
    const view=document.getElementById('avView'),track=document.getElementById('avTrack');
    if(!view||!track) return;
    const slides=[...track.children],dots=[...document.getElementById('avDots').children];
    const prog=document.getElementById('avProg');
    const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
    const DUR=6000;
    let i=0,timer=null,paused=false;

    function perView(){return Math.max(1,Math.round(view.clientWidth/slides[0].getBoundingClientRect().width));}
    function maxIndex(){return Math.max(0,slides.length-perView());}
    function render(){
      i=Math.min(i,maxIndex());
      track.style.transform='translateX(-'+(i*100/perView())+'%)';
      dots.forEach((d,k)=>{
        const on=k===i; d.setAttribute('aria-current',on?'true':'false');
        d.style.display=k>maxIndex()?'none':'grid';
      });
      slides.forEach((s,k)=>s.setAttribute('aria-hidden',(k<i||k>=i+perView())?'true':'false'));
      restart();
    }
    function restart(){
      if(calm) return;
      prog.classList.remove('run');void prog.offsetWidth;
      prog.style.setProperty('--dur',DUR+'ms');
      if(!paused)prog.classList.add('run');
      clearTimeout(timer);
      if(!paused)timer=setTimeout(()=>{i=i>=maxIndex()?0:i+1;render();},DUR);
    }
    function goto(n){i=n<0?maxIndex():(n>maxIndex()?0:n);render();}

    document.getElementById('avNext').addEventListener('click',()=>goto(i+1));
    document.getElementById('avPrev').addEventListener('click',()=>goto(i-1));
    dots.forEach(d=>d.addEventListener('click',()=>goto(+d.dataset.i)));

    function pause(){paused=true;clearTimeout(timer);prog.classList.remove('run');}
    function play(){if(paused){paused=false;restart();}}
    view.addEventListener('mouseenter',pause);view.addEventListener('mouseleave',play);
    view.addEventListener('focusin',pause);view.addEventListener('focusout',play);
    document.addEventListener('visibilitychange',()=>document.hidden?pause():play());

    /* glissé tactile */
    let x0=null,dx=0;
    view.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;dx=0;pause();},{passive:true});
    view.addEventListener('touchmove',e=>{if(x0!==null)dx=e.touches[0].clientX-x0;},{passive:true});
    view.addEventListener('touchend',()=>{
      if(x0!==null&&Math.abs(dx)>46)goto(i+(dx<0?1:-1));else{paused=false;restart();}
      x0=null;
    });

    let rt=null;
    addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{track.classList.add('nodur');render();setTimeout(()=>track.classList.remove('nodur'),50);},160);});
    render();
  })();
})();

/* ── bloc 5 ───────────────────────────────────────────────────────── */
(function(){
  /* ═══ moteur de parallaxe : un seul rAF, transform uniquement ═══ */
  (function(){
    const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
    if(calm) return;
    const items=[...document.querySelectorAll('[data-par]')].map(el=>({el,s:parseFloat(el.dataset.par)||20,vis:false}));
    const hero=document.getElementById('hero');
    const frame=document.querySelector('.frame');
    if(!items.length && !hero) return;

    const io=new IntersectionObserver(es=>es.forEach(e=>{
      const it=items.find(x=>x.el===e.target); if(it) it.vis=e.isIntersecting;
    }),{rootMargin:'120px 0px'});
    items.forEach(i=>io.observe(i.el));

    let ticking=false;
    function frameFn(){
      const vh=innerHeight;
      /* plans indépendants du hero */
      if(hero){
        const r=hero.getBoundingClientRect();
        if(r.bottom>-100){
          const p=Math.min(1,Math.max(0,-r.top/Math.max(1,r.height)));   /* 0 en haut, 1 quand le hero sort */
          if(frame) frame.style.setProperty('--pyf',(p*-90).toFixed(1)+'px');
          const bg=hero.querySelector('.bg img');
          if(bg) bg.style.setProperty('--pyb',(p*r.height*0.30).toFixed(1)+'px');
        }
      }
      /* éléments génériques */
      for(const it of items){
        if(!it.vis) continue;
        const r=it.el.getBoundingClientRect();
        const off=((r.top+r.height/2)-vh/2)/vh;      /* ≈ -1 … 1 */
        it.el.style.setProperty('--py',(off*it.s).toFixed(1)+'px');
      }
      ticking=false;
    }
    function onScroll(){ if(!ticking){ ticking=true; requestAnimationFrame(frameFn); } }
    addEventListener('scroll',onScroll,{passive:true});
    addEventListener('resize',onScroll,{passive:true});
    frameFn();
  })();
})();

/* ── bloc 6 ───────────────────────────────────────────────────────── */
(function(){
  (function(){
    const views=[...document.querySelectorAll('.view')];
    if(!views.length) return;          /* page réelle : pas de routeur, pas de titre réécrit */
    const routes=views.map(v=>v.dataset.route);
    const TITRES={
      '/':'Location voiture circuit GT3 992.2 — DRS Experience',
      '/le-moniteur/':'Guillaume Léger — moniteur de pilotage sur circuit | DRS Experience'
    };

    /* ── déclaré AVANT toute utilisation : marque() est appelé dès le premier show() ── */
    const liens=[...document.querySelectorAll('.top nav a[href^="#"],.top nav a[href="/le-moniteur/"]')];
    function marque(){
      const vue=document.querySelector('.view:not([hidden])');
      if(!vue) return;
      const route=vue.dataset.route;
      liens.forEach(l=>l.classList.toggle('cur', l.getAttribute('href')===route));
    }

    const spy=new IntersectionObserver(es=>{
      const vis=es.filter(e=>e.isIntersecting).sort((x,y)=>y.intersectionRatio-x.intersectionRatio)[0];
      if(!vis) return;
      const id='#'+vis.target.id;
      liens.forEach(l=>{
        const href=l.getAttribute('href');
        if(href && href.startsWith('#')) l.classList.toggle('cur', href===id);
      });
    },{rootMargin:'-45% 0px -50% 0px',threshold:[0,.25,.5]});

    function observer(){
      spy.disconnect();
      document.querySelectorAll('.view:not([hidden]) section[id]').forEach(s=>spy.observe(s));
    }

    function show(route,opts){
      opts=opts||{};
      const scroll=opts.scroll!==false, push=opts.push!==false;
      if(routes.indexOf(route)===-1) route='/';
      views.forEach(v=>{v.hidden = v.dataset.route!==route;});
      document.title=TITRES[route]||document.title;
      const c=document.querySelector('link[rel="canonical"]');
      if(c) c.href='https://drs-experience.com'+route;
      const vue=document.querySelector('.view:not([hidden])');
      if(vue) vue.querySelectorAll('.rise').forEach(el=>el.classList.add('on'));
      if(push && location.pathname!==route) history.pushState({route:route},'',route);
      if(scroll) window.scrollTo({top:0,behavior:'auto'});
      marque();
      observer();
    }

    document.addEventListener('click',function(e){
      const a=e.target.closest('a[href]');
      if(!a) return;
      const href=a.getAttribute('href');
      if(!href||href.indexOf('http')===0||href.indexOf('tel:')===0||href.indexOf('mailto:')===0) return;
      if(href.charAt(0)==='#' && href.length>1){
        /* ancre visée dans une vue masquée : on affiche la vue avant de défiler */
        const cible=document.getElementById(href.slice(1));
        const vue=cible&&cible.closest('.view');
        if(vue&&vue.hidden){
          e.preventDefault();
          show(vue.dataset.route,{scroll:false});
          cible.scrollIntoView({block:'start'});
        }
        return;
      }
      if(routes.indexOf(href)!==-1){ e.preventDefault(); show(href); }
    });

    /* L'URL porte la route : /le-moniteur/ est servi par le catch-all et rendu
       directement, donc indexable. Le hash reste accepté pour les anciens liens. */
    function routeCourante(){
      const p=location.pathname.replace(/\/*$/,'/')||'/';
      if(routes.indexOf(p)!==-1) return p;
      const h=location.hash.slice(1);
      if(routes.indexOf(h)!==-1) return h;
      return '/';
    }

    window.addEventListener('popstate',function(){ show(routeCourante(),{push:false}); });

    show(routeCourante(),{scroll:false,push:false});
  })();
})();

/* ── bloc 7 ───────────────────────────────────────────────────────── */
(function(){
  /* ── Google Analytics 4 ────────────────────────────────────────────────
     GA4_ID vide = aucun tag, aucun bandeau. Renseigner l'identifiant de flux
     (G-XXXXXXXXXX) suffit à activer la mesure.                            */
  (function(){
    var GA4_ID='';
    if(!GA4_ID) return;

    window.dataLayer=window.dataLayer||[];
    function gtag(){dataLayer.push(arguments);}
    window.gtag=gtag;
    gtag('consent','default',{
      ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',
      analytics_storage:'denied',wait_for_update:500
    });

    var CLE='drs-consent', boite=document.getElementById('cookie'), choix=null;
    try{ choix=localStorage.getItem(CLE); }catch(e){}

    function charge(){
      if(document.getElementById('ga4-src')) return;
      var s=document.createElement('script');
      s.async=true; s.id='ga4-src';
      s.src='https://www.googletagmanager.com/gtag/js?id='+GA4_ID;
      document.head.appendChild(s);
      gtag('js',new Date());
      gtag('config',GA4_ID,{anonymize_ip:true});
    }

    function repond(ok){
      try{ localStorage.setItem(CLE, ok?'ok':'non'); }catch(e){}
      if(ok){ gtag('consent','update',{analytics_storage:'granted'}); charge(); }
      if(boite) boite.hidden=true;
    }

    if(choix==='ok'){ gtag('consent','update',{analytics_storage:'granted'}); charge(); }
    else if(choix!=='non' && boite){
      boite.hidden=false;
      document.getElementById('ckOk').addEventListener('click',function(){repond(true);});
      document.getElementById('ckNo').addEventListener('click',function(){repond(false);});
    }
  })();
})();
