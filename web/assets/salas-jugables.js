"use strict";
/* LABEY · módulo de despertar y calibración. Los sprites V3 y su física permanecen intactos. */
(() => {
  const map = new Image();
  const dummies = new Image();
  map.src = "/assets/salas-despertar-calibracion.webp";
  dummies.src = "/assets/objetivos-entrenamiento.webp";
  const worldW = 864, worldH = 1536;
  const spawn = {x: 355, y: 1225};
  const sword = {x: 686, y: 1260};
  const targets = [
    {x: 433, y: 390},
    {x: 210, y: 605},
    {x: 659, y: 605}
  ].map(p => ({...p, life: 100, phase: "ready", timer: 0, flash: 0}));
  let hasSword = false;
  let firstKill = false;
  let swingRegistered = false;
  let overlayText = "DIRECTIVA // RECUPERA LA ESPADA";
  let overlayTimer = 0;
  let prevW = screenWidth, prevH = screenHeight;
  const title = document.querySelector(".title");
  const subtitle = document.querySelector(".subtitle");
  if (title) title.textContent = "LABEY // DESPERTAR";
  if (subtitle) subtitle.textContent = "Sala 01 · Recupera la espada";
  const indicator = document.createElement("div");
  indicator.id = "calibrationDirective";
  indicator.setAttribute("aria-live", "polite");
  document.body.append(indicator);
  const pickup = document.createElement("button");
  pickup.id = "calibrationPickup";
  pickup.textContent = "RECOGER ESPADA";
  pickup.hidden = true;
  pickup.type = "button";
  pickup.setAttribute("aria-label", "Recoger la espada de su soporte");
  document.body.append(pickup);
  const style = document.createElement("style");
  style.textContent = `
    #calibrationDirective{position:fixed;z-index:3;top:max(108px,calc(env(safe-area-inset-top) + 98px));left:50%;transform:translateX(-50%);width:max-content;max-width:calc(100vw - 32px);padding:9px 15px;background:#161b3bd9;border:1px solid #80dbff;border-radius:9px;text-align:center;color:#e9faff;font:700 11px/1.4 system-ui;letter-spacing:.12em;pointer-events:none;box-shadow:0 2px 15px #13253b60}
    #calibrationPickup{position:fixed;z-index:6;left:50%;bottom:max(195px,calc(env(safe-area-inset-bottom) + 190px));transform:translateX(-50%);width:max-content;min-height:45px;max-width:65vw;padding:9px 15px;background:#3c286bec;border:1px solid #d4abff;color:#fff;border-radius:10px;font:800 12px system-ui;letter-spacing:.1em;touch-action:manipulation}
    #calibrationPickup[hidden]{display:none!important}body.menu-open #calibrationPickup,body.menu-open #calibrationDirective{display:none!important}
    @media(max-width:380px){#calibrationDirective{top:120px;font-size:10px}#calibrationPickup{bottom:165px}}
  `;
  document.head.append(style);
  function setDirective(message, seconds = 0) {
    overlayText = message;
    overlayTimer = seconds;
    indicator.textContent = message;
  }
  setDirective(overlayText);
  function resetScene() {
    hasSword = false;
    firstKill = false;
    swingRegistered = false;
    for (const t of targets) Object.assign(t, {life:100,phase:"ready",timer:0,flash:0});
    player.x = spawn.x;
    player.y = spawn.y;
    player.facing = -Math.PI / 2;
    pickup.hidden = true;
    attackButton.disabled = true; // se activa al recoger la espada
    if (subtitle) subtitle.textContent = "Sala 01 · Recupera la espada";
    setDirective("DIRECTIVA // RECUPERA LA ESPADA");
  }
  function canPickUp() {
    return !hasSword && Math.hypot(player.x - sword.x, player.y - sword.y) < 105;
  }
  function pickUp() {
    if (!canPickUp() || window.labeyMenu?.isOpen()) return;
    hasSword = true;
    attackButton.disabled = false;
    pickup.hidden = true;
    if (subtitle) subtitle.textContent = "Sala 02 · Calibración de combate";
    setDirective("DIRECTIVA // PRUEBA TU ARMA", 4);
  }
  pickup.addEventListener("click", pickUp);
  window.addEventListener("keydown", event => {
    if (event.key.toLowerCase() === "e" && !event.repeat && !window.labeyMenu?.isOpen()) pickUp();
  });
  // Colisiones con el perímetro real del mapa y los elementos sólidos.
  // Los tres objetivos no bloquean al jugador; permiten practicar el Dash.
  isBlockedAt = function(x,y) {
    const h = getPlayerHitbox(x,y);
    const inUpper = h.left >= 38 && h.right <= 826 && h.top >= 194 && h.bottom <= 871;
    const inLower = h.left >= 38 && h.right <= 826 && h.top >= 1050 && h.bottom <= 1476;
    const inPassage = h.left >= 320 && h.right <= 544 && h.top >= 852 && h.bottom <= 1070;
    if (!inUpper && !inLower && !inPassage) return true;
    // Cápsula y pedestal están incorporados en la ilustración.
    const capsule = h.right > 94 && h.left < 271 && h.bottom > 1008 && h.top < 1305;
    const pedestal = h.right > 625 && h.left < 755 && h.bottom > 1157 && h.top < 1280;
    const pads = targets.some(t => Math.hypot((x-t.x)/1.05,(y-t.y)/.7) < 44);
    return capsule || pedestal || pads;
  };
  getSafeSpawn = function(preferX = spawn.x, preferY = spawn.y) {
    const clamp = (n,min,max) => Math.max(min,Math.min(max,n));
    const x = clamp(preferX, 52, 812), y = clamp(preferY, 210, 1460);
    if (!isBlockedAt(x,y)) return {x,y};
    for (let radius=16;radius<1000;radius+=16) {
      for (let i=0;i<32;i++) {
        const angle=i*Math.PI/16;
        const ax=clamp(x+radius*Math.cos(angle),52,812),ay=clamp(y+radius*Math.sin(angle),210,1460);
        if (!isBlockedAt(ax,ay)) return {x:ax,y:ay};
      }
    }
    return {...spawn};
  };
  getBounds = function() {return {left:38,top:194,right:826,bottom:1476};};
  const baseUpdate = update;
  const baseDraw = draw;
  const baseReset = resetPlayer;
  triggerAttack = ((old) => function() {if (hasSword) old(); else if (!window.labeyMenu?.isOpen()) setDirective("DIRECTIVA // RECUPERA LA ESPADA",2);})(triggerAttack);
  function pointNearHitbox(t) {
    const dx=t.x-player.x,dy=(t.y-12)-player.y;
    const reach=Math.hypot(dx,dy/ATTACK_DEPTH_SCALE);
    if (reach>110 || reach<8) return false;
    const facingX=Math.cos(attackFacing),facingY=Math.sin(attackFacing);
    return (dx*facingX+dy*facingY)/Math.max(1,Math.hypot(dx,dy)) > .33;
  }
  function strikeTargets() {
    if (attackRemaining<=0) swingRegistered=false;
    if (!hasSword || swingRegistered || attackFrameIndex()!==1) return;
    swingRegistered=true;
    for (const t of targets) {
      if (t.phase!=="ready" || !pointNearHitbox(t)) continue;
      t.life=Math.max(0,t.life-25);
      t.flash=.16;
      if (t.life===0) {
        t.phase="broken";
        t.timer=.55;
        if (!firstKill) {
          firstKill=true;
          setDirective("CALIBRACIÓN COMPLETA // SALIDA DESBLOQUEADA",5);
        }
      }
    }
  }
  update = function(dt) {
    baseUpdate(dt);
    strikeTargets();
    for (const t of targets) {
      t.flash=Math.max(0,t.flash-dt);
      if (t.phase!=="ready") {
        t.timer-=dt;
        if (t.timer<=0) {
          if (t.phase==="broken") {t.phase="regenerating"; t.timer=1.45;}
          else {t.phase="ready";t.life=100;t.timer=0;}
        }
      }
    }
    if (overlayTimer>0) {
      overlayTimer=Math.max(0,overlayTimer-dt);
      if (!overlayTimer) setDirective(firstKill?"DIRECTIVA // ENTRENAMIENTO LIBRE":hasSword?"DIRECTIVA // DESTRUYE UN OBJETIVO":"DIRECTIVA // RECUPERA LA ESPADA");
    }
    pickup.hidden=!canPickUp() || !!window.labeyMenu?.isOpen();
  };
  function camera() {
    const scale=Math.min(1,Math.max(.68,Math.min(screenWidth/560,screenHeight/920)));
    const width=worldW*scale,height=worldH*scale;
    const offsetX=width<=screenWidth?(screenWidth-width)/2:Math.max(screenWidth-width,Math.min(0,screenWidth*.5-player.x*scale));
    const offsetY=height<=screenHeight?(screenHeight-height)/2:Math.max(screenHeight-height,Math.min(0,screenHeight*.56-player.y*scale));
    return {scale,offsetX,offsetY};
  }
  function paintTarget(t) {
    const state=t.phase==="broken"?2:t.phase==="regenerating"?3:t.flash>0?1:0;
    const width=132,height=176;
    const left=t.x-width/2, top=t.y-height+12;
    if (dummies.complete && dummies.naturalWidth) {
      const fwidth=dummies.naturalWidth/4;
      ctx.drawImage(dummies,state*fwidth,0,fwidth,dummies.naturalHeight,left,top,width,height);
    } else {
      ctx.fillStyle="#8a54cc";ctx.fillRect(t.x-28,t.y-105,56,93);
    }
    if (t.life<100 || t.phase!=="ready") {
      const barY=top-11,barW=100;
      ctx.fillStyle="#27324c";ctx.fillRect(t.x-barW/2,barY,barW,9);
      ctx.fillStyle=t.life>60?"#69df8d":t.life>25?"#ffcc64":"#ff647b";
      ctx.fillRect(t.x-barW/2+2,barY+2,(barW-4)*t.life/100,5);
    }
  }
  function paintPassage() {
    // Las puertas cerradas están pintadas en el concepto: una franja oscura
    // sustituye el centro de la conexión para que el avatar no atraviese metal.
    ctx.fillStyle="#263653";
    ctx.fillRect(345,922,174,130);
    const light=ctx.createLinearGradient(345,0,519,0);
    light.addColorStop(0,"#41ccf8");light.addColorStop(.08,"#354865");
    light.addColorStop(.92,"#354865");light.addColorStop(1,"#41ccf8");
    ctx.fillStyle=light;ctx.fillRect(340,922,8,131);ctx.fillRect(516,922,8,131);
    ctx.fillStyle="#9ad8ed";ctx.fillRect(345,1046,174,5);
  }
  function paintSword() {
    if (hasSword) return;
    ctx.save();ctx.translate(sword.x,sword.y-53);
    ctx.shadowColor="#be79ff";ctx.shadowBlur=14;ctx.strokeStyle="#cc9aff";ctx.lineWidth=6;
    ctx.beginPath();ctx.moveTo(0,-30);ctx.lineTo(0,2);ctx.stroke();
    ctx.strokeStyle="#f1efff";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-31);ctx.lineTo(0,0);ctx.stroke();
    ctx.strokeStyle="#5c3a93";ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-10,3);ctx.lineTo(10,3);ctx.stroke();
    ctx.restore();
  }
  draw = function() {
    ctx.clearRect(0,0,screenWidth,screenHeight);
    ctx.fillStyle="#101a33";ctx.fillRect(0,0,screenWidth,screenHeight);
    const view=camera();
    ctx.save();ctx.translate(view.offsetX,view.offsetY);ctx.scale(view.scale,view.scale);
    if(map.complete && map.naturalWidth) ctx.drawImage(map,0,0,worldW,worldH);
    else {ctx.fillStyle="#dae4f3";ctx.fillRect(0,0,worldW,worldH);}
    paintPassage();paintSword();
    for(const ghost of trail) drawSprite(ghost.frame,ghost.x,ghost.y,TRAIL_OPACITY*Math.pow(ghost.life/TRAIL_LIFETIME,1.5)*.4);
    for(const t of targets.filter(t=>t.y<=player.y)) paintTarget(t);
    drawPlayer();
    for(const t of targets.filter(t=>t.y>player.y)) paintTarget(t);
    if(showHitboxes){
      ctx.strokeStyle="#ff4444";ctx.lineWidth=3;ctx.strokeRect(38,194,788,1282);
      const polygon=getAttackHitbox();if(polygon)fillPolygon(polygon,"#8a56d740","#c472ff");
    }
    ctx.restore();
  };
  resetPlayer = function() {baseReset();resetScene();};
  // El listener previo de resize aún pertenece al laboratorio original.
  // Deshacemos exclusivamente su desplazamiento relativo a la pantalla.
  window.addEventListener("resize",()=>{
    player.x-=(screenWidth-prevW)/2;player.y-=(screenHeight-prevH)/2;
    prevW=screenWidth;prevH=screenHeight;
    const safe=getSafeSpawn(player.x,player.y);player.x=safe.x;player.y=safe.y;
  });
  resetButton.addEventListener("click",resetScene);
  resetScene();
  function restoreScene(saved) {
    if (!saved) return;
    hasSword = saved.hasSword === true;
    firstKill = saved.firstKill === true;
    attackButton.disabled = !hasSword;
    pickup.hidden = true;
    if (subtitle) subtitle.textContent = hasSword ? "Sala 02 · Calibración de combate" : "Sala 01 · Recupera la espada";
    setDirective(firstKill ? "DIRECTIVA // ENTRENAMIENTO LIBRE" : hasSword ? "DIRECTIVA // DESTRUYE UN OBJETIVO" : "DIRECTIVA // RECUPERA LA ESPADA");
  }
  window.labeyCalibration={targets, get hasSword(){return hasSword;},get firstKill(){return firstKill;}, reset:resetScene, restore:restoreScene};
})();
