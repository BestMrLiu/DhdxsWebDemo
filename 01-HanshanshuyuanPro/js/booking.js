/* 寒山书院 · 在线预约系统 JS
 * 功能：
 * 1. 4 步流程
 * 2. 日历选日期
 * 3. 时间段选择
 * 4. 表单提交
 * 5. localStorage 保存（演示用，正式版本对接后端 API）
 */

const bookingApp = {
  currentStep: 1,
  selectedCourse: null,
  selectedDate: null,
  selectedTime: null,
  courseNames: {
    'trial': '免费体验课',
    'beginner': '执笔启蒙',
    'intermediate': '精研进阶',
    'creation': '笔墨创作',
    'lecture': '名家讲座 / 短期工坊',
    'visit': '书院参访',
  },

  init() {
    this.renderCalendar();
    // 如果 localStorage 有数据，恢复
    const saved = localStorage.getItem('hanshan-booking');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.selectedCourse = data.course;
        this.selectedDate = data.date;
        this.selectedTime = data.time;
      } catch (e) {}
    }
  },

  goStep(n) {
    // 校验
    if (n === 2 && !this.selectedCourse) {
      alert('请先选择课程');
      return;
    }
    if (n === 3 && (!this.selectedDate || !this.selectedTime)) {
      alert('请选择日期和时间');
      return;
    }
    if (n === 4) {
      // 收集表单
      this.collectForm();
    }

    document.querySelectorAll('.booking-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.booking-step').forEach((s, i) => {
      s.classList.remove('active', 'done');
      if (i + 1 === n) s.classList.add('active');
      if (i + 1 < n) s.classList.add('done');
    });
    document.querySelector(`[data-panel="${n}"]`).classList.add('active');
    this.currentStep = n;

    if (n === 3) this.updateSummary();
    if (n === 4) this.showSuccess();

    // 滚动到顶部
    window.scrollTo({ top: document.querySelector('.booking-panels').offsetTop - 100, behavior: 'smooth' });
  },

  selectCourse(value) {
    this.selectedCourse = value;
    const btn = document.getElementById('step1-next');
    if (btn) btn.disabled = false;
    this.save();
  },

  renderCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    this.renderMonth(year, month);
  },

  currentYear: 0,
  currentMonth: 0,

  renderMonth(year, month) {
    this.currentYear = year;
    this.currentMonth = month;
    document.getElementById('cal-title').textContent = `${year} 年 ${month + 1} 月`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    // 模拟一些日期已满
    const fullDays = [3, 7, 15, 22, 28]; // 演示数据

    const html = [];
    for (let i = 0; i < firstDay; i++) {
      html.push('<div class="cal-day empty"></div>');
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today && !isToday;
      const isFull = fullDays.includes(d);
      const dayOfWeek = date.getDay();
      const closed = dayOfWeek === 1; // 周一闭馆
      const selected = this.selectedDate === `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

      let cls = 'cal-day';
      if (isPast) cls += ' disabled';
      if (isToday) cls += ' today';
      if (isFull) cls += ' full';
      if (closed) cls += ' disabled';
      if (selected) cls += ' selected';

      // 满课日：黑色数字（红色实际由 CSS 处理）+ 划掉
      const status = isFull ? '<span class="status">满</span>' : (closed ? '' : (isToday ? '<span class="status">今</span>' : ''));

      html.push(`<div class="${cls}" onclick="bookingApp.selectDay(${d})">${d}${status}</div>`);
    }
    document.getElementById('cal-days').innerHTML = html.join('');
  },

  selectDay(d) {
    const year = this.currentYear;
    const month = this.currentMonth + 1;
    this.selectedDate = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    this.renderMonth(year, this.currentMonth);
    this.renderTimeSlots();
    // 检查时间是否也已选
    if (this.selectedTime) {
      const btn = document.getElementById('next-to-info');
      if (btn) btn.disabled = false;
    }
    this.save();
  },

  prevMonth() {
    let m = this.currentMonth - 1;
    let y = this.currentYear;
    if (m < 0) { m = 11; y--; }
    this.renderMonth(y, m);
  },

  nextMonth() {
    let m = this.currentMonth + 1;
    let y = this.currentYear;
    if (m > 11) { m = 0; y++; }
    this.renderMonth(y, m);
  },

  renderTimeSlots() {
    // 模拟时间段 - 不同日期不同时段，有些已满
    const slots = [
      { time: '10:00', available: true },
      { time: '11:00', available: true },
      { time: '14:00', available: false },  // 满
      { time: '15:00', available: true },
      { time: '16:00', available: true },
      { time: '19:00', available: true },
      { time: '20:00', available: true },
    ];

    const html = slots.map(s => {
      const cls = s.available ? '' : 'full';
      return `<div class="time-slot ${cls}" onclick="${s.available ? `bookingApp.selectTime('${s.time}')` : ''}">${s.time}</div>`;
    }).join('');

    document.getElementById('time-slots').innerHTML = html;

    // 恢复选中
    if (this.selectedTime) {
      setTimeout(() => {
        const el = document.querySelector(`.time-slot:not(.full)`);
        // 不恢复，简单重置
      }, 100);
    }
  },

  selectTime(time) {
    this.selectedTime = time;
    document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
    event.target.classList.add('selected');
    document.getElementById('next-to-info').disabled = false;
    this.save();
  },

  updateSummary() {
    const course = this.courseNames[this.selectedCourse] || this.selectedCourse;
    const text = `${course} · ${this.selectedDate} · ${this.selectedTime}`;
    document.getElementById('summary-text').textContent = text;
  },

  collectForm() {
    const form = document.querySelector('.booking-form');
    const data = {
      course: this.selectedCourse,
      courseName: this.courseNames[this.selectedCourse],
      date: this.selectedDate,
      time: this.selectedTime,
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
      wechat: form.wechat.value,
      note: form.note.value,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('hanshan-booking-latest', JSON.stringify(data));
    this.lastBooking = data;
  },

  showSuccess() {
    const d = this.lastBooking;
    if (!d) return;
    const html = `
      <strong>课程：</strong>${d.courseName}<br>
      <strong>时间：</strong>${d.date} ${d.time}<br>
      <strong>姓名：</strong>${d.name}<br>
      <strong>联系方式：</strong>${d.phone}${d.email ? ' / ' + d.email : ''}
    `;
    document.getElementById('success-detail').innerHTML = html;
  },

  save() {
    localStorage.setItem('hanshan-booking', JSON.stringify({
      course: this.selectedCourse,
      date: this.selectedDate,
      time: this.selectedTime,
    }));
  }
};

// 绑定课程 radio
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('input[name="course"]').forEach(r => {
    r.addEventListener('change', e => bookingApp.selectCourse(e.target.value));
  });
  bookingApp.init();
});
