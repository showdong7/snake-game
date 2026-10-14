// 貪食蛇 Snake Game — 純前端，無資料庫，最高分存 localStorage
(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const highEl = document.getElementById('highScore');
  const lenEl = document.getElementById('length');
  const speedEl = document.getElementById('speed');
  const overlay = document.getElementById('overlay');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayText = document.getElementById('overlayText');
  const overlayBtn = document.getElementById('overlayBtn');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const restartBtn = document.getElementById('restartBtn');
  const difficultyEl = document.getElementById('difficulty');

  const GRID = 20;                 // 20 x 20 格
  const CELL = canvas.width / GRID; // 20px
  const SPEEDS = { easy: 160, normal: 120, hard: 85 }; // ms / step，越小越快

  let snake, dir, nextDir, food, score, eaten, timer = null, running = false, paused = false, baseSpeed = SPEEDS.normal;

  let highScore = Number(localStorage.getItem('snake-high-score') || 0);
  highEl.textContent = highScore;

  function reset() {
    snake = [{x:10,y:10},{x:9,y:10},{x:8,y:10}];
    dir = {x:1,y:0}; nextDir = dir;
    score = 0; eaten = 0;
    placeFood(); updateHUD();
  }
  function placeFood() {
    while (true) {
      const p = { x: Math.floor(Math.random()*GRID), y: Math.floor(Math.random()*GRID) };
      if (!snake.some(s => s.x===p.x && s.y===p.y)) { food = p; return; }
    }
  }
  function currentInterval() {
    // 每吃 5 顆加速 8%，最低 50ms
    const steps = Math.floor(eaten/5);
    return Math.max(50, Math.round(baseSpeed * Math.pow(0.92, steps)));
  }
  function updateHUD() {
    scoreEl.textContent = score;
    lenEl.textContent = snake ? snake.length : 3;
    speedEl.textContent = (baseSpeed/currentInterval()).toFixed(1).replace(/\.0$/,'') + 'x';
    if (score > highScore) { highScore = score; localStorage.setItem('snake-high-score', String(highScore)); }
    highEl.textContent = highScore;
  }
  function draw() {
    ctx.fillStyle = '#0b1220'; ctx.fillRect(0,0,canvas.width,canvas.height);
    // grid
    ctx.strokeStyle = 'rgba(148,163,184,.08)'; ctx.lineWidth = 1;
    for (let i=1;i<GRID;i++){ ctx.beginPath(); ctx.moveTo(i*CELL,0); ctx.lineTo(i*CELL,canvas.height); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0,i*CELL); ctx.lineTo(canvas.width,i*CELL); ctx.stroke(); }
    // food
    ctx.font = `${CELL}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('🍎', food.x*CELL+CELL/2, food.y*CELL+CELL/2+1);
    // snake
    snake.forEach((seg,i)=>{
      ctx.fillStyle = i===0 ? '#4ade80' : '#22c55e';
      const pad = i===0 ? 1 : 2;
      ctx.beginPath(); ctx.roundRect(seg.x*CELL+pad, seg.y*CELL+pad, CELL-pad*2, CELL-pad*2, 5); ctx.fill();
      if (i===0){ ctx.fillStyle='#052e12'; ctx.beginPath(); ctx.arc(seg.x*CELL+7, seg.y*CELL+8, 2, 0, Math.PI*2); ctx.arc(seg.x*CELL+13, seg.y*CELL+8, 2, 0, Math.PI*2); ctx.fill(); }
    });
  }
  function step() {
    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x<0||head.x>=GRID||head.y<0||head.y>=GRID||snake.some(s=>s.x===head.x&&s.y===head.y)) return gameOver();
    snake.unshift(head);
    if (head.x===food.x && head.y===food.y) {
      score += 10; eaten++; placeFood();
      // 速度變化時重啟 timer
      restartTimer();
    } else {
      snake.pop();
    }
    updateHUD(); draw();
  }
  function restartTimer(){ if(timer) clearInterval(timer); if(running && !paused) timer=setInterval(step, currentInterval()); }
  function start() {
    baseSpeed = SPEEDS[difficultyEl.value] || SPEEDS.normal;
    if (!running) { reset(); }
    running = true; paused = false; overlay.classList.add('hidden'); pauseBtn.textContent='⏸ 暫停'; restartTimer(); draw();
  }
  function pauseToggle() {
    if (!running) return start();
    paused = !paused; pauseBtn.textContent = paused ? '▶ 繼續' : '⏸ 暫停';
    if (paused){ clearInterval(timer); showOverlay('已暫停','按繼續或空白鍵回到遊戲','繼續'); } else { overlay.classList.add('hidden'); restartTimer(); }
  }
  function restart(){ running=false; clearInterval(timer); reset(); draw(); start(); }
  function gameOver(){
    running=false; clearInterval(timer); updateHUD();
    showOverlay('遊戲結束', `得分 ${score} 分 · 長度 ${snake.length}<br>${score>=highScore && score>0 ? '🎉 新紀錄！' : `最高分 ${highScore} 分`}`, '再玩一次');
  }
  function showOverlay(title, html, btn){ overlayTitle.textContent=title; overlayText.innerHTML=html; overlayBtn.textContent=btn; overlay.classList.remove('hidden'); }
  function setDir(x,y){ if (dir.x===-x && dir.y===-y) return; /* 不能直接回頭 */ if (snake && snake.length>1) {} nextDir={x,y}; if(!running) start(); }

  // 事件
  overlayBtn.addEventListener('click', ()=>{ if(!running && overlayTitle.textContent==='遊戲結束') reset(); start(); });
  startBtn.addEventListener('click', start);
  pauseBtn.addEventListener('click', pauseToggle);
  restartBtn.addEventListener('click', restart);
  difficultyEl.addEventListener('change', ()=>{ baseSpeed=SPEEDS[difficultyEl.value]; restartTimer(); updateHUD(); });
  document.querySelectorAll('.pad-btn').forEach(b=>b.addEventListener('click',()=>{
    const m={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[b.dataset.dir]; if(m) setDir(m[0],m[1]);
  }));
  window.addEventListener('keydown', e=>{
    const k=e.key.toLowerCase();
    if (k===' '){ e.preventDefault(); running ? pauseToggle() : start(); return; }
    const map={arrowup:[0,-1],w:[0,-1],arrowdown:[0,1],s:[0,1],arrowleft:[-1,0],a:[-1,0],arrowright:[1,0],d:[1,0]};
    if(map[k]){ e.preventDefault(); setDir(map[k][0],map[k][1]); }
  });
  // 觸控滑動
  let touchStart=null;
  canvas.addEventListener('touchstart', e=>{ touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY}; }, {passive:true});
  canvas.addEventListener('touchend', e=>{
    if(!touchStart) return;
    const dx=e.changedTouches[0].clientX-touchStart.x, dy=e.changedTouches[0].clientY-touchStart.y;
    if(Math.abs(dx)<24 && Math.abs(dy)<24) return;
    Math.abs(dx)>Math.abs(dy) ? setDir(Math.sign(dx),0) : setDir(0,Math.sign(dy));
    touchStart=null;
  }, {passive:true});

  reset(); draw();
})();
