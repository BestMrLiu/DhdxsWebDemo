/* ============================================
   墨韵学堂 · 新闻数据驱动加载（内嵌数据）
   ============================================ */

(function() {
  'use strict';

  const grid = document.getElementById('newsGrid');
  if (!grid) return;

  let currentFilter = 'all';

  // 内嵌数据 —— 修改这里就能更新新闻内容
  const allNews = [
    { id:1, date:'2026-07-15', category:'公告', title:'墨韵学堂2026年秋季班招生启动', excerpt:'新学期书法、国画、篆刻、古琴、茶道五大课程全面开放报名。少儿班增设周末早间时段，成人班新增周三晚间古琴班。', content:'新学期书法、国画、篆刻、古琴、茶道五大课程全面开放报名。少儿班增设周末早间时段（9:00-11:00），成人班新增周三晚间古琴班（19:00-21:00）。\n\n秋季班将于9月1日正式开课，即日起接受预约报名。前20名报名学员享受9折优惠，老学员续课享受85折。\n\n咨询电话：0571-8888-6688', image:'https://images.pexels.com/photos/36171312/pexels-photo-36171312.jpeg?auto=compress&cs=tinysrgb&w=600&h=338&fit=crop&dpr=1' },
    { id:2, date:'2026-06-20', category:'活动', title:'"笔墨新声"学员年度作品展在浙江美术馆开幕', excerpt:'展出学员作品120余件，涵盖书法、国画、篆刻三大门类。展览持续至7月30日。', content:'6月20日，墨韵学堂"笔墨新声"学员年度作品展在浙江美术馆隆重开幕。本次展览共展出学员作品120余件，涵盖书法、国画、篆刻三大门类。\n\n参展学员年龄从8岁到65岁，既有初学半年的新学员，也有研习五年以上的老学员。每一件作品都记录了他们在笔墨间成长的轨迹。\n\n展览将持续至7月30日，免费开放参观。', image:'https://images.pexels.com/photos/35346910/pexels-photo-35346910.jpeg?auto=compress&cs=tinysrgb&w=600&h=338&fit=crop&dpr=1' },
    { id:3, date:'2026-05-18', category:'活动', title:'端午茶会 · 一期一会', excerpt:'端午节当天，谢茶隐老师带领学员举办了一场特别的茶会。以粽子佐茶，以艾草入席。', content:'端午节当天，茶道导师谢茶隐带领20余位学员，在学堂庭院举办了一场别开生面的端午茶会。\n\n茶席以艾草、菖蒲装饰，选用三款时令茶品：明前龙井、白毫银针、正山小种。学员们亲手包制的粽子作为茶点，在品茗中感受传统节日的文化内涵。', image:'https://images.pexels.com/photos/6691991/pexels-photo-6691991.jpeg?auto=compress&cs=tinysrgb&w=600&h=338&fit=crop&dpr=1' },
    { id:4, date:'2026-04-22', category:'荣誉', title:'苏听泉老师受邀在国家大剧院演出', excerpt:'古琴导师苏听泉受邀参加"中国古琴艺术展演"，演奏《流水》《平沙落雁》两首经典琴曲。', content:'4月22日，墨韵学堂古琴导师苏听泉受邀参加在国家大剧院举办的"中国古琴艺术展演"。\n\n苏老师演奏了《流水》和《平沙落雁》两首经典琴曲，以虞山派特有的清微淡远风格，赢得了现场500余位观众的热烈掌声。\n\n此次展演由中国音乐家协会主办，全国仅邀请了12位古琴演奏家参加。', image:'https://images.pexels.com/photos/32562614/pexels-photo-32562614.jpeg?auto=compress&cs=tinysrgb&w=600&h=338&fit=crop&dpr=1' },
    { id:5, date:'2026-03-15', category:'活动', title:'"方寸之间"篆刻体验工作坊回顾', excerpt:'30位零基础学员在赵石庵老师的指导下，完成了人生第一方印章。', content:'3月15日，墨韵学堂举办了"方寸之间"篆刻体验工作坊。30位零基础学员在篆刻导师赵石庵的指导下，用三个小时完成了人生中的第一方印章。\n\n从选石、写稿、奏刀到完成，学员们体验了篆刻艺术的完整流程。赵老师说："篆刻是最容易获得成就感的艺术。三个小时，一方印章，就能让人爱上这门艺术。"', image:'https://images.pexels.com/photos/18709055/pexels-photo-18709055.jpeg?auto=compress&cs=tinysrgb&w=600&h=338&fit=crop&dpr=1' },
    { id:6, date:'2026-02-28', category:'荣誉', title:'墨韵学子在全国少儿书法大赛中斩获佳绩', excerpt:'第十二届全国少儿书法大赛中，12名参赛学员获得金奖3人、银奖5人、铜奖4人。', content:'在刚刚结束的第十二届全国少儿书法大赛中，墨韵学堂12名参赛学员获得金奖3人、银奖5人、铜奖4人的优异成绩。\n\n其中，9岁的张思远同学以一幅楷书《岳阳楼记》获得小学组金奖第一名。\n\n本次大赛共有来自全国各地的3000余名少儿书法爱好者参加。', image:'https://images.pexels.com/photos/6156194/pexels-photo-6156194.jpeg?auto=compress&cs=tinysrgb&w=600&h=338&fit=crop&dpr=1' },
    { id:7, date:'2026-01-10', category:'教学', title:'教学手记：为什么我们坚持小班制', excerpt:'6人小班，不是为了显得高端，而是因为书法教学需要每个学生都被"看见"。', content:'经常有家长问：为什么你们的班这么小？6个人，是不是为了显得高端？\n\n不是的。书法教学的特殊性在于，每个学生的笔性不同。有人天生用笔重，有人用笔轻；有人擅长楷书，有人更适合行书。大班教学只能教"共性"，而小班才能关注"个性"。\n\n陈墨之老师说："我能看到每个学生执笔的角度、运笔的节奏、用墨的浓淡。这些细节，在20人的大班里是不可能注意到的。"', image:'https://images.pexels.com/photos/9016466/pexels-photo-9016466.jpeg?auto=compress&cs=tinysrgb&w=600&h=338&fit=crop&dpr=1' },
    { id:8, date:'2025-12-20', category:'活动', title:'冬至雅集 · 琴茶共赏', excerpt:'冬至之夜，古琴与茶道的跨界雅集，30余位学员共度了一个温暖的夜晚。', content:'冬至之夜，墨韵学堂举办了一场别开生面的"琴茶共赏"雅集。古琴导师苏听泉与茶道导师谢茶隐联手，为30余位学员呈现了一场听觉与味觉的双重盛宴。\n\n雅集以《梅花三弄》开场，配以白毫银针的清雅；中段《流水》配正山小种的醇厚；尾声《平沙落雁》配陈年普洱的沉稳。', image:'https://images.pexels.com/photos/6691991/pexels-photo-6691991.jpeg?auto=compress&cs=tinysrgb&w=600&h=338&fit=crop&dpr=1' }
  ];

  render();

  function render() {
    const filtered = currentFilter === 'all' ? allNews : allNews.filter(n => n.category === currentFilter);
    const categories = ['all', ...new Set(allNews.map(n => n.category))];

    // Filter buttons
    const filterContainer = document.getElementById('newsFilter');
    if (filterContainer) {
      filterContainer.innerHTML = categories.map(cat => `
        <button class="gallery-filter-btn ${currentFilter === cat ? 'active' : ''}" data-filter="${cat}">
          ${cat === 'all' ? '全部' : cat}
          <span style="font-size:11px;opacity:0.6;margin-left:4px">${cat === 'all' ? allNews.length : allNews.filter(n => n.category === cat).length}</span>
        </button>
      `).join('');
      filterContainer.querySelectorAll('.gallery-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => { currentFilter = btn.getAttribute('data-filter'); render(); });
      });
    }

    // News cards
    grid.innerHTML = filtered.map(news => `
      <div class="news-card" data-id="${news.id}">
        <div class="news-card-img"><img src="${news.image}" alt="${news.title}" loading="lazy"></div>
        <div class="news-card-body">
          <div class="news-card-meta-row">
            <span class="news-card-date">${formatDate(news.date)}</span>
            <span class="news-card-category">${news.category}</span>
          </div>
          <h3 class="news-card-title">${news.title}</h3>
          <p class="news-card-excerpt">${news.excerpt}</p>
          <button class="news-read-more" data-id="${news.id}">阅读全文 <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg></button>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.news-read-more').forEach(btn => {
      btn.addEventListener('click', () => openModal(allNews.find(n => n.id === parseInt(btn.getAttribute('data-id')))));
    });
  }

  function formatDate(d) { const p = new Date(d); return `${p.getFullYear()}.${String(p.getMonth()+1).padStart(2,'0')}.${String(p.getDate()).padStart(2,'0')}`; }

  function openModal(news) {
    if (!news) return;
    const modal = document.createElement('div');
    modal.className = 'news-modal-overlay';
    modal.innerHTML = `<div class="news-modal"><button class="news-modal-close" aria-label="关闭"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button><div class="news-modal-img"><img src="${news.image}" alt="${news.title}"></div><div class="news-modal-body"><div class="news-modal-meta"><span>${formatDate(news.date)}</span><span class="news-card-category">${news.category}</span></div><h2 class="news-modal-title">${news.title}</h2><div class="news-modal-content">${news.content.split('\n').map(p => p ? `<p>${p}</p>` : '').join('')}</div></div></div>`;
    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('open'));
    modal.querySelector('.news-modal-close').addEventListener('click', () => { modal.classList.remove('open'); setTimeout(() => modal.remove(), 300); });
    modal.addEventListener('click', e => { if (e.target === modal) { modal.classList.remove('open'); setTimeout(() => modal.remove(), 300); } });
  }
})();
