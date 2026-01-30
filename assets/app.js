let masterCandidates = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '陈十一', '林十二']
let candidates = []
let winners = []
let rolling = false
let rollInterval

function init() {
  const savedMaster = localStorage.getItem('lottery_master_candidates')
  if (savedMaster) masterCandidates = JSON.parse(savedMaster)

  const savedCandidates = localStorage.getItem('lottery_candidates')
  if (savedCandidates) {
    candidates = JSON.parse(savedCandidates)
  } else {
    candidates = [...masterCandidates]
  }

  const savedWinners = localStorage.getItem('lottery_winners')
  if (savedWinners) winners = JSON.parse(savedWinners)

  const nameInput = document.getElementById('name-input')
  if (nameInput) nameInput.value = masterCandidates.join('\n')

  updateStats()
}

function updateStats() {
  const candidateCountEl = document.getElementById('candidate-count')
  const mainWinnerListEl = document.getElementById('main-winner-list')

  if (candidateCountEl) candidateCountEl.textContent = candidates.length

  if (mainWinnerListEl) {
    mainWinnerListEl.innerHTML = winners
      .map(
        (w, i) => `
          <div class="flex items-center justify-between bg-gold/10 p-3 rounded-lg border border-gold/20 animate-fadeIn">
            <span class="text-gold font-bold">第 ${i + 1} 位</span>
            <span class="text-white text-lg">${w}</span>
          </div>
        `,
      )
      .join('')
    mainWinnerListEl.scrollTop = mainWinnerListEl.scrollHeight
  }

  localStorage.setItem('lottery_master_candidates', JSON.stringify(masterCandidates))
  localStorage.setItem('lottery_candidates', JSON.stringify(candidates))
  localStorage.setItem('lottery_winners', JSON.stringify(winners))
}

function toggleWinners() {
  const aside = document.getElementById('winner-aside')
  if (aside && window.innerWidth < 1024) aside.classList.toggle('translate-y-full')
}

function toggleSettings() {
  const panel = document.getElementById('settings-panel')
  if (!panel) return
  panel.classList.toggle('translate-x-full')
  if (!panel.classList.contains('translate-x-full')) {
    const nameInput = document.getElementById('name-input')
    if (nameInput) nameInput.value = masterCandidates.join('\n')
  }
}

function saveNames() {
  const nameInput = document.getElementById('name-input')
  if (!nameInput) return
  const input = nameInput.value.trim()

  masterCandidates = input
    .split('\n')
    .map((n) => n.trim())
    .filter((n) => n)

  const shouldReset = confirm(
    '名单已保存！\n\n是否立即重置奖池（清空已中奖记录）？\n点击[确定]：从新名单开始全新抽奖\n点击[取消]：保留已中奖人员，仅更新剩余奖池',
  )

  if (shouldReset) {
    candidates = [...masterCandidates]
    winners = []
    const nameBox = document.getElementById('name-box')
    if (nameBox) {
      nameBox.textContent = '等待开启'
      nameBox.classList.remove('winner-text')
    }
  } else {
    candidates = masterCandidates.filter((name) => !winners.includes(name))
  }

  updateStats()
  toggleSettings()
  alert('名单管理已成功更新！')
}

function resetWinners() {
  if (
    confirm(
      '确定要重置抽奖吗？\n这将把所有【原始名单】中的人员放回奖池，并清空所有中奖记录。',
    )
  ) {
    candidates = [...masterCandidates]
    winners = []
    const nameBox = document.getElementById('name-box')
    if (nameBox) {
      nameBox.textContent = '等待开启'
      nameBox.classList.remove('winner-text')
    }
    updateStats()
    alert('抽奖已重置！')
  }
}

function startRoll() {
  if (candidates.length === 0) {
    alert('当前奖池已空，请先在配置中添加名单或重置抽奖！')
    return
  }

  const nameBox = document.getElementById('name-box')
  const startBtn = document.getElementById('start-btn')
  const stopBtn = document.getElementById('stop-btn')

  rolling = true
  if (nameBox) {
    nameBox.classList.remove('winner-text')
    nameBox.classList.add('rolling')
  }
  if (startBtn) startBtn.classList.add('hidden')
  if (stopBtn) stopBtn.classList.remove('hidden')

  rollInterval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * candidates.length)
    if (nameBox) nameBox.textContent = candidates[randomIndex]
  }, 50)
}

function stopRoll() {
  rolling = false
  clearInterval(rollInterval)

  const nameBox = document.getElementById('name-box')
  const startBtn = document.getElementById('start-btn')
  const stopBtn = document.getElementById('stop-btn')

  if (nameBox) nameBox.classList.remove('rolling')
  if (startBtn) startBtn.classList.remove('hidden')
  if (stopBtn) stopBtn.classList.add('hidden')

  const winnerIndex = Math.floor(Math.random() * candidates.length)
  const winner = candidates.splice(winnerIndex, 1)[0]
  winners.push(winner)

  if (nameBox) {
    nameBox.textContent = winner
    nameBox.classList.add('winner-text')
  }

  triggerConfetti()
  updateStats()
}

function triggerConfetti() {
  if (typeof confetti !== 'function') return
  const duration = 3 * 1000
  const end = Date.now() + duration

  ;(function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#ffd700', '#ff0000', '#ffffff'],
    })
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#ffd700', '#ff0000', '#ffffff'],
    })

    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

document.addEventListener('DOMContentLoaded', () => {
  init()
  const startBtn = document.getElementById('start-btn')
  const stopBtn = document.getElementById('stop-btn')
  if (startBtn) startBtn.addEventListener('click', startRoll)
  if (stopBtn) stopBtn.addEventListener('click', stopRoll)
})

window.toggleWinners = toggleWinners
window.toggleSettings = toggleSettings
window.saveNames = saveNames
window.resetWinners = resetWinners

