/* ============================================
   墨韵学堂 · 在线预约系统
   Multi-step Booking with Time Slot Selection
   ============================================ */

(function() {
  'use strict';

  const container = document.getElementById('bookingWidget');
  if (!container) return;

  // State
  let currentStep = 1;
  let selectedCourse = '';
  let selectedDate = '';
  let selectedSlot = '';
  let formData = {};

  // Time slots data
  const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const SLOTS = {
    morning:  { label: '上午', time: '9:00 - 11:00', icon: 'sunrise' },
    afternoon:{ label: '下午', time: '14:00 - 16:00', icon: 'sun' },
    evening:  { label: '晚上', time: '19:00 - 21:00', icon: 'moon' }
  };

  // Available slots per course (simulated)
  const COURSE_SCHEDULES = {
    '书法': { youth: ['周六上午','周六下午','周日上午','周日下午'], adult: ['周二晚上','周三晚上','周四晚上','周六下午'] },
    '国画': { youth: ['周六上午','周日上午'], adult: ['周三晚上','周五晚上','周六上午'] },
    '篆刻': { youth: ['周六下午'], adult: ['周四晚上','周六上午'] },
    '古琴': { youth: ['周日上午'], adult: ['周二晚上','周五晚上','周六下午'] },
    '茶道': { youth: [], adult: ['周三晚上','周六下午','周日下午'] }
  };

  // Render
  function render() {
    container.innerHTML = `
      <div class="booking-steps">
        ${[1,2,3,4].map(s => `
          <div class="booking-step ${s <= currentStep ? 'active' : ''} ${s < currentStep ? 'done' : ''}">
            <div class="booking-step-num">${s < currentStep ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' : s}</div>
            <div class="booking-step-label">${['选课程','选时段','填信息','确认'][s-1]}</div>
          </div>
        `).join('')}
      </div>
      <div class="booking-body">
        ${currentStep === 1 ? renderStep1() : ''}
        ${currentStep === 2 ? renderStep2() : ''}
        ${currentStep === 3 ? renderStep3() : ''}
        ${currentStep === 4 ? renderStep4() : ''}
      </div>
    `;
    bindEvents();
  }

  // Step 1: Select course
  function renderStep1() {
    const courses = [
      { name: '书法', desc: '楷行草隶篆五体研习', price: '¥3,600起', duration: '24课时' },
      { name: '国画', desc: '工笔花鸟·写意山水', price: '¥3,800起', duration: '24课时' },
      { name: '篆刻', desc: '方寸之间·刀石相搏', price: '¥3,200', duration: '16课时' },
      { name: '古琴', desc: '七弦之上·山水在耳', price: '¥5,000', duration: '20课时' },
      { name: '茶道', desc: '一期一会·一盏清茶', price: '¥2,400', duration: '12课时' }
    ];
    return `
      <h3 class="booking-title">选择感兴趣的课程</h3>
      <p class="booking-subtitle">首次体验课免费，少儿班 / 成人班均可预约，选择课程后可预约体验时间</p>
      <div class="booking-course-grid">
        ${courses.map(c => {
          const sch = COURSE_SCHEDULES[c.name] || { youth: [], adult: [] };
          const tags = [];
          if (sch.youth.length) tags.push('少儿班');
          if (sch.adult.length) tags.push('成人班');
          const ageLabel = tags.join(' / ') || '详情咨询';
          return `
          <div class="booking-course-card ${selectedCourse === c.name ? 'selected' : ''}" data-course="${c.name}">
            <div class="booking-course-name">${c.name}</div>
            <div class="booking-course-desc">${c.desc}</div>
            <div class="booking-course-meta">
              <span>${c.duration}</span>
              <span>${ageLabel}</span>
              <span>${c.price}</span>
            </div>
          </div>
        `;
        }).join('')}
      </div>
      <div class="booking-nav">
        <div></div>
        <button class="btn btn-vermilion booking-next" ${!selectedCourse ? 'disabled' : ''}>
          下一步 · 选择时段
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </button>
      </div>
    `;
  }

  // Step 2: Select time slot
  function renderStep2() {
    // Generate next 2 weeks of dates
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d);
    }

    const schedule = COURSE_SCHEDULES[selectedCourse] || { youth: [], adult: [] };
    const allSlots = [...schedule.youth, ...schedule.adult];

    return `
      <h3 class="booking-title">选择体验时间</h3>
      <p class="booking-subtitle">${selectedCourse}课程 · 请选择方便的日期和时段</p>
      <div class="booking-age-toggle">
        <button class="booking-age-btn active" data-age="youth">少儿班</button>
        <button class="booking-age-btn" data-age="adult">成人班</button>
      </div>
      <div class="booking-calendar">
        ${dates.map(d => {
          const dayName = WEEKDAYS[(d.getDay() + 6) % 7]; // Monday=0
          const dateStr = `${d.getMonth()+1}/${d.getDate()}`;
          const fullDate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
          const daySlots = allSlots.filter(s => s.startsWith(dayName.replace('周','周')));
          const isSelected = selectedDate === fullDate;
          return `
            <div class="booking-date-cell ${daySlots.length ? '' : 'disabled'} ${isSelected ? 'selected' : ''}" data-date="${fullDate}" data-day="${dayName}">
              <div class="booking-date-day">${dayName}</div>
              <div class="booking-date-num">${dateStr}</div>
              <div class="booking-date-dots">
                ${daySlots.length ? '<span class="dot active"></span>' : '<span class="dot"></span>'}
              </div>
            </div>
          `;
        }).join('')}
      </div>
      ${selectedDate ? renderSlotsForDate(selectedDate, allSlots) : '<p style="text-align:center;color:var(--text-faded);font-size:var(--fs-sm);margin-top:var(--sp-lg)">请先选择日期</p>'}
      <div class="booking-nav">
        <button class="btn btn-outline booking-prev">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 12H5M11 19l-7-7 7-7"/></svg>
          上一步
        </button>
        <button class="btn btn-vermilion booking-next" ${!selectedSlot ? 'disabled' : ''}>
          下一步 · 填写信息
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </button>
      </div>
    `;
  }

  function renderSlotsForDate(dateStr, allSlots) {
    const d = new Date(dateStr);
    const dayName = WEEKDAYS[(d.getDay() + 6) % 7];
    const availableSlots = allSlots.filter(s => s.startsWith(dayName.replace('周','周')));

    if (!availableSlots.length) return '<p style="text-align:center;color:var(--text-faded)">该日期暂无可用时段</p>';

    return `
      <div class="booking-slots">
        <div style="font-size:var(--fs-sm);color:var(--text-faded);margin-bottom:var(--sp-sm)">可选时段：</div>
        <div class="booking-slot-grid">
          ${availableSlots.map(slot => {
            const time = slot.replace(/^[^ ]+ /, '');
            const period = time.includes('9:00') ? '上午' : time.includes('14:00') ? '下午' : '晚上';
            return `
              <button class="booking-slot-btn ${selectedSlot === slot ? 'selected' : ''}" data-slot="${slot}">
                <span class="booking-slot-period">${period}</span>
                <span class="booking-slot-time">${time}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // Step 3: Fill info
  function renderStep3() {
    return `
      <h3 class="booking-title">填写联系信息</h3>
      <p class="booking-subtitle">${selectedCourse} · ${selectedSlot}</p>
      <div class="booking-form">
        <div class="form-row">
          <div class="form-group">
            <label class="booking-label" for="bookName">姓名 *</label>
            <input type="text" id="bookName" class="form-input" placeholder="您的姓名" value="${formData.name || ''}" required>
          </div>
          <div class="form-group">
            <label class="booking-label" for="bookPhone">手机号 *</label>
            <input type="tel" id="bookPhone" class="form-input" placeholder="手机号码" value="${formData.phone || ''}" required>
          </div>
        </div>
        <div class="form-group">
          <label class="booking-label" for="bookAge">年龄段</label>
          <select id="bookAge" class="form-select">
            <option value="">请选择</option>
            <option value="8-14" ${formData.age === '8-14' ? 'selected' : ''}>8-14 岁（少儿）</option>
            <option value="25-50" ${formData.age === '25-50' ? 'selected' : ''}>25-50 岁（成人）</option>
          </select>
        </div>
        <div class="form-group">
          <label class="booking-label" for="bookNote">备注（选填）</label>
          <textarea id="bookNote" class="form-textarea" placeholder="您想了解的内容，或其他问题" rows="3">${formData.note || ''}</textarea>
        </div>
      </div>
      <div class="booking-nav">
        <button class="btn btn-outline booking-prev">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 12H5M11 19l-7-7 7-7"/></svg>
          上一步
        </button>
        <button class="btn btn-vermilion booking-next" id="bookingSubmitInfo">
          确认预约信息
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </button>
      </div>
    `;
  }

  // Step 4: Confirmation
  function renderStep4() {
    return `
      <div class="booking-confirm">
        <div class="booking-confirm-icon">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--celadon)" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h3 class="booking-title">预约提交成功</h3>
        <p class="booking-subtitle">我们会在24小时内通过电话确认您的预约</p>
        <div class="booking-summary">
          <div class="booking-summary-row">
            <span class="booking-summary-label">预约课程</span>
            <span class="booking-summary-value">${selectedCourse}</span>
          </div>
          <div class="booking-summary-row">
            <span class="booking-summary-label">体验时间</span>
            <span class="booking-summary-value">${selectedSlot}</span>
          </div>
          <div class="booking-summary-row">
            <span class="booking-summary-label">预约人</span>
            <span class="booking-summary-value">${formData.name}</span>
          </div>
          <div class="booking-summary-row">
            <span class="booking-summary-label">联系电话</span>
            <span class="booking-summary-value">${formData.phone}</span>
          </div>
          <div class="booking-summary-note">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--gold)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>首次体验课免费 · 请提前5分钟到达</span>
          </div>
        </div>
        <button class="btn btn-outline" onclick="location.reload()">返回首页</button>
      </div>
    `;
  }

  // Event binding
  function bindEvents() {
    // Course selection
    container.querySelectorAll('.booking-course-card').forEach(card => {
      card.addEventListener('click', () => {
        selectedCourse = card.getAttribute('data-course');
        selectedDate = '';
        selectedSlot = '';
        render();
      });
    });

    // Age toggle
    container.querySelectorAll('.booking-age-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.booking-age-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedDate = '';
        selectedSlot = '';
        render();
      });
    });

    // Date selection
    container.querySelectorAll('.booking-date-cell:not(.disabled)').forEach(cell => {
      cell.addEventListener('click', () => {
        selectedDate = cell.getAttribute('data-date');
        selectedSlot = '';
        render();
      });
    });

    // Slot selection
    container.querySelectorAll('.booking-slot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedSlot = btn.getAttribute('data-slot');
        render();
      });
    });

    // Next button
    const nextBtn = container.querySelector('.booking-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentStep === 3) {
          // Validate form
          const name = document.getElementById('bookName')?.value.trim();
          const phone = document.getElementById('bookPhone')?.value.trim();
          if (!name || !phone) {
            alert('请填写姓名和手机号');
            return;
          }
          formData = {
            name,
            phone,
            age: document.getElementById('bookAge')?.value || '',
            note: document.getElementById('bookNote')?.value || ''
          };
          // Save to localStorage
          try {
            const bookings = JSON.parse(localStorage.getItem('moyun_bookings') || '[]');
            bookings.push({ ...formData, course: selectedCourse, slot: selectedSlot, date: selectedDate, timestamp: Date.now() });
            localStorage.setItem('moyun_bookings', JSON.stringify(bookings));
          } catch(e) {}
        }
        if (currentStep < 4) {
          currentStep++;
          render();
        }
      });
    }

    // Prev button
    const prevBtn = container.querySelector('.booking-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep--;
          render();
        }
      });
    }
  }

  // Init
  render();

})();
