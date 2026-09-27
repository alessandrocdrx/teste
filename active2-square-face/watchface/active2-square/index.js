import { createWidget, widget, align, prop, text_style } from '@zos/ui'
import { getScene, SCENE_AOD } from '@zos/app'
import { Time, Battery, Step, HeartRate } from '@zos/sensor'

// ============================================================
//  PERSONALIZE AQUI
//  Cores no formato 0xRRGGBB. Tela do Active 2 Square: 390 x 450.
// ============================================================
const THEME = {
  background: 0x000000, // fundo da tela
  accent: 0x00d9ff, // cor de destaque (data, barra de progresso)
  time: 0xffffff, // cor da hora
  label: 0x8a8f98, // cor dos rotulos pequenos
  value: 0xffffff, // cor dos valores
  card: 0x16191f, // fundo dos cartoes inferiores
  barBg: 0x2a2e36, // fundo da barra de passos
  heart: 0xff4d6d, // cor do batimento
  battery: 0x3ddc84, // cor da bateria
  batteryLow: 0xff9f1c, // bateria abaixo de 20%
  aodTime: 0x9aa0a6, // hora no modo Always-On (use cor escura p/ economizar)
}

const WEEKDAYS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'] // getDay(): 1 = segunda
const MONTHS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']

// ============================================================

const W = 390
const H = 450

const pad2 = (n) => (n < 10 ? '0' + n : '' + n)

function text(opts) {
  return createWidget(widget.TEXT, {
    align_h: align.CENTER_H,
    align_v: align.CENTER_V,
    text_style: text_style.NONE,
    ...opts,
  })
}

// Cartao inferior: rotulo pequeno em cima, valor grande embaixo
function card(x, label, color) {
  createWidget(widget.FILL_RECT, { x, y: 318, w: 110, h: 100, radius: 20, color: THEME.card })
  text({ x, y: 330, w: 110, h: 26, text: label, text_size: 20, color: THEME.label })
  return text({ x, y: 358, w: 110, h: 48, text: '--', text_size: 38, color })
}

WatchFace({
  onInit() {
    this.time = new Time()
    this.widgets = {}
  },

  build() {
    const isAod = getScene() === SCENE_AOD

    createWidget(widget.FILL_RECT, { x: 0, y: 0, w: W, h: H, color: THEME.background })

    const w = this.widgets
    w.date = text({
      x: 0, y: 36, w: W, h: 40,
      text_size: 30,
      color: isAod ? THEME.aodTime : THEME.accent,
    })
    w.time = text({
      x: 0, y: 84, w: W, h: 150,
      text_size: 128,
      color: isAod ? THEME.aodTime : THEME.time,
    })

    if (!isAod) this.buildActivity()

    this.updateTime()
    this.onMinute = () => this.updateTime()
    this.time.onPerMinute(this.onMinute)
  },

  buildActivity() {
    const w = this.widgets

    // ---- Passos + barra de meta ----
    w.stepsLabel = text({
      x: 40, y: 238, w: 310, h: 32,
      text_size: 22, color: THEME.label,
      align_h: align.LEFT,
    })
    w.stepsPct = text({
      x: 40, y: 238, w: 310, h: 32,
      text_size: 22, color: THEME.accent,
      align_h: align.RIGHT,
    })
    createWidget(widget.FILL_RECT, { x: 40, y: 278, w: 310, h: 12, radius: 6, color: THEME.barBg })
    w.stepsBar = createWidget(widget.FILL_RECT, { x: 40, y: 278, w: 12, h: 12, radius: 6, color: THEME.accent })

    // ---- Cartoes: batimento, passos, bateria ----
    w.hr = card(24, 'BPM', THEME.heart)
    w.steps = card(140, 'PASSOS', THEME.value)
    w.battery = card(256, 'BATERIA', THEME.battery)

    // ---- Sensores ----
    this.step = new Step()
    this.heart = new HeartRate()
    this.bat = new Battery()

    this.onStep = () => this.updateSteps()
    this.onHeart = () => this.updateHeart()
    this.onBat = () => this.updateBattery()
    this.step.onChange(this.onStep)
    this.heart.onLastChange(this.onHeart)
    this.bat.onChange(this.onBat)

    this.updateSteps()
    this.updateHeart()
    this.updateBattery()
  },

  updateTime() {
    const t = this.time
    const w = this.widgets
    w.time.setProperty(prop.TEXT, pad2(t.getFormatHour()) + ':' + pad2(t.getMinutes()))
    w.date.setProperty(
      prop.TEXT,
      WEEKDAYS[t.getDay() - 1] + ' · ' + t.getDate() + ' ' + MONTHS[t.getMonth() - 1],
    )
  },

  updateSteps() {
    const w = this.widgets
    const current = this.step.getCurrent() || 0
    const target = this.step.getTarget() || 8000
    const ratio = Math.min(current / target, 1)

    w.steps.setProperty(prop.TEXT, current >= 10000 ? (current / 1000).toFixed(1) + 'k' : '' + current)
    w.stepsLabel.setProperty(prop.TEXT, 'META ' + target)
    w.stepsPct.setProperty(prop.TEXT, Math.round(ratio * 100) + '%')
    w.stepsBar.setProperty(prop.MORE, { x: 40, y: 278, w: Math.max(12, Math.round(310 * ratio)), h: 12 })
  },

  updateHeart() {
    const bpm = this.heart.getLast()
    this.widgets.hr.setProperty(prop.TEXT, bpm > 0 ? '' + bpm : '--')
  },

  updateBattery() {
    const level = this.bat.getCurrent()
    const w = this.widgets.battery
    w.setProperty(prop.TEXT, level + '%')
    w.setProperty(prop.COLOR, level < 20 ? THEME.batteryLow : THEME.battery)
  },

  onDestroy() {
    this.time && this.onMinute && this.time.offPerMinute && this.time.offPerMinute(this.onMinute)
    this.step && this.step.offChange(this.onStep)
    this.heart && this.heart.offLastChange(this.onHeart)
    this.bat && this.bat.offChange(this.onBat)
  },
})
