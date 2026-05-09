const adminEmail = 'richardalexanderdiaz0@gmail.com';
const sections = {
  new: document.getElementById('newCards'),
  soon: document.getElementById('soonCards'),
  daily: document.getElementById('dailyCards'),
  trending: document.getElementById('trendingCards'),
  all: document.getElementById('allWorksCards'),
  finished: document.getElementById('finishedCards'),
  finals: document.getElementById('finalsCards')
};
const controls = {
  panelSearch: document.getElementById('panelSearch'),
  panelDetail: document.getElementById('panelDetail'),
  panelChapters: document.getElementById('panelChapters'),
  readerOverlay: document.getElementById('readerOverlay'),
  panelAuth: document.getElementById('panelAuth'),
  panelAdmin: document.getElementById('panelAdmin'),
  panelStudio: document.getElementById('panelStudio'),
  btnSignIn: document.getElementById('btnSignIn'),
  btnHeroExplore: document.getElementById('btnHeroExplore'),
  btnExplore: document.getElementById('btnExplore'),
  btnGoList: document.getElementById('btnGoList'),
  btnCloseSearch: document.getElementById('btnCloseSearch'),
  btnSearch: document.getElementById('btnSearch'),
  searchInput: document.getElementById('searchInput'),
  genreFilters: document.getElementById('genreFilters'),
  searchResults: document.getElementById('searchResults'),
  btnBackDetail: document.getElementById('btnBackDetail'),
  btnShareDetail: document.getElementById('btnShareDetail'),
  btnReportDetail: document.getElementById('btnReportDetail'),
  detailTitle: document.getElementById('detailTitle'),
  detailStatus: document.getElementById('detailStatus'),
  detailCover: document.getElementById('detailCover'),
  detailType: document.getElementById('detailType'),
  detailFinal: document.getElementById('detailFinal'),
  detailAuthor: document.getElementById('detailAuthor'),
  detailTags: document.getElementById('detailTags'),
  detailSynopsis: document.getElementById('detailSynopsis'),
  btnToggleSynopsis: document.getElementById('btnToggleSynopsis'),
  detailReadCount: document.getElementById('detailReadCount'),
  detailLikeCount: document.getElementById('detailLikeCount'),
  detailCommentCount: document.getElementById('detailCommentCount'),
  btnAddLibrary: document.getElementById('btnAddLibrary'),
  btnStartRead: document.getElementById('btnStartRead'),
  chapterList: document.getElementById('chapterList'),
  btnViewAllChapters: document.getElementById('btnViewAllChapters'),
  btnBackChapters: document.getElementById('btnBackChapters'),
  chapterGrid: document.getElementById('chapterGrid'),
  readerHeader: document.getElementById('readerHeader'),
  btnReaderBack: document.getElementById('btnReaderBack'),
  btnReaderFavorite: document.getElementById('btnReaderFavorite'),
  btnReaderShare: document.getElementById('btnReaderShare'),
  readerPages: document.getElementById('readerPages'),
  readerFooter: document.getElementById('readerFooter'),
  btnPrevChapter: document.getElementById('btnPrevChapter'),
  btnToggleEps: document.getElementById('btnToggleEps'),
  btnNextChapter: document.getElementById('btnNextChapter'),
  btnCloseAuth: document.getElementById('btnCloseAuth'),
  btnSendMagicLink: document.getElementById('btnSendMagicLink'),
  authEmail: document.getElementById('authEmail'),
  btnAdminPanel: document.getElementById('btnAdminPanel'),
  btnCloseAdmin: document.getElementById('btnCloseAdmin'),
  btnCreateWork: document.getElementById('btnCreateWork'),
  adminWorksList: document.getElementById('adminWorksList'),
  btnBackStudio: document.getElementById('btnBackStudio'),
  btnStep1Next: document.getElementById('btnStep1Next'),
  btnStep2Next: document.getElementById('btnStep2Next'),
  btnPublishWork: document.getElementById('btnPublishWork'),
  btnBackStudioStep: document.getElementById('btnBackStudioStep'),
  workType: document.getElementById('workType'),
  workTitle: document.getElementById('workTitle'),
  workSynopsis: document.getElementById('workSynopsis'),
  workCover: document.getElementById('workCover'),
  workStatus: document.getElementById('workStatus'),
  workChapterCount: document.getElementById('workChapterCount'),
  workSchedule: document.getElementById('workSchedule'),
  workScheduleRow: document.getElementById('workScheduleRow'),
  categoryOptions: document.getElementById('categoryOptions'),
  reviewCover: document.getElementById('reviewCover'),
  reviewTitle: document.getElementById('reviewTitle'),
  reviewSummary: document.getElementById('reviewSummary'),
  reviewInfo: document.getElementById('reviewInfo'),
  btnCloseSearchOnPage: document.getElementById('btnCloseSearch')
};
let currentUser = null;
let currentWork = null;
let currentChapters = [];
let currentChapter = null;
let currentPageIndex = 0;
let selectedTags = new Set();
const genreOptions = ['Acción','Aventura','Drama','Suspenso','Romance','Fantasía','Ciencia ficción','Historias cotidianas','Bullying','Vida escolar','Yaoi','BL','+18','Gore'];
const categoryLabels = ['Acción','Aventura','Drama','Suspenso','Romance','Fantasía','Yaoi','BL','+18','Gore','Vida escolar','Vida cotidiana','Bullying','Cuerpo urbano','Magia'];
const workStatusLabels = { 'finalizado': 'FINALIZADO', 'en emisión': 'EN EMISIÓN' };
const showToast = message => {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  window.clearTimeout(toast.timeout);
  toast.timeout = window.setTimeout(() => toast.classList.add('hidden'), 3000);
};
const openPanel = panel => panel.classList.remove('hidden');
const closePanel = panel => panel.classList.add('hidden');
const getUser = async () => {
  const { data } = await supabase.auth.getSession();
  currentUser = data.session?.user || null;
  if (currentUser) {
    controls.btnSignIn.textContent = 'Mi cuenta';
    if (currentUser.email === adminEmail) controls.btnAdminPanel.classList.remove('hidden');
    else controls.btnAdminPanel.classList.add('hidden');
  } else {
    controls.btnSignIn.textContent = 'Entrar / Registro';
    controls.btnAdminPanel.classList.add('hidden');
  }
};
const buildCard = work => {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `<img src="${work.cover_url || 'https://via.placeholder.com/400x520?text=Portada'}" alt="${work.title}" loading="lazy" />
    <div class="card-body">
      <h3>${work.title}</h3>
      <p>${work.author || 'Autor desconocido'}</p>
      <div class="card-footer">
        <span class="tag">${work.work_type || 'OBRA'}</span>
        <span class="tag">${work.status || 'SIN ESTADO'}</span>
      </div>
    </div>`;
  card.addEventListener('click', () => openWorkDetail(work));
  return card;
};
const renderCards = (element, works) => {
  element.innerHTML = '';
  if (!works.length) {
    element.innerHTML = '<div class="card"><div class="card-body"><p>No hay obras aquí todavía.</p></div></div>';
    return;
  }
  works.forEach(work => element.appendChild(buildCard(work)));
};
const fetchWorks = async () => {
  const { data: works, error } = await supabase.from('manga_works').select('*').order('created_at', { ascending: false });
  if (error) { showToast('Error cargando obras'); console.error(error); return []; }
  return works || [];
};
const fetchChapters = async workId => {
  const { data, error } = await supabase.from('manga_chapters').select('*').eq('manga_work_id', workId).order('chapter_number', { ascending: true });
  if (error) { console.error(error); return []; }
  return data || [];
};
const buildSection = async () => {
  const works = await fetchWorks();
  const now = new Date();
  const upcoming = works.filter(work => work.scheduled_at && new Date(work.scheduled_at) > now);
  const recent = works.filter(work => !work.scheduled_at && new Date(work.created_at) > new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000));
  const daily = works.filter(work => new Date(work.created_at) > new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000));
  const trending = [...works].sort((a,b) => (b.read_count||0) + (b.likes_count||0) - ((a.read_count||0)+(a.likes_count||0))).slice(0, 8);
  const allWorks = works.filter(work => ['COMIC','MANHWA'].includes(work.work_type));
  const finished = works.filter(work => work.status === 'finalizado');
  const finals = finished;
  renderCards(sections.new, recent);
  renderCards(sections.soon, upcoming);
  renderCards(sections.daily, daily);
  renderCards(sections.trending, trending);
  renderCards(sections.all, allWorks);
  renderCards(sections.finished, finished);
  renderCards(sections.finals, finals);
};
const loadGenreFilters = () => {
  controls.genreFilters.innerHTML = '';
  genreOptions.forEach(label => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'filter-pill';
    pill.textContent = label;
    pill.addEventListener('click', () => {
      const active = pill.classList.toggle('active');
      if (active) selectedTags.add(label); else selectedTags.delete(label);
      performSearch();
    });
    controls.genreFilters.appendChild(pill);
  });
};
const performSearch = async () => {
  const query = controls.searchInput.value.trim().toLowerCase();
  const { data: works, error } = await supabase.from('manga_works').select('*');
  if (error) { showToast('Error en búsqueda'); return; }
  let filtered = works || [];
  if (query) {
    filtered = filtered.filter(w => [w.title, w.author].join(' ').toLowerCase().includes(query) || (w.tags || []).join(' ').toLowerCase().includes(query));
  }
  if (selectedTags.size) {
    filtered = filtered.filter(w => {
      const tags = (w.tags || []).map(String);
      return [...selectedTags].every(tag => tags.includes(tag));
    });
  }
  renderCards(controls.searchResults, filtered);
};
const openWorkDetail = async work => {
  currentWork = work;
  const chapters = await fetchChapters(work.id);
  currentChapters = chapters;
  controls.detailTitle.textContent = work.title;
  controls.detailStatus.textContent = `${work.work_type || ''} · ${workStatusLabels[work.status] || work.status || ''}`;
  controls.detailCover.src = work.cover_url || 'https://via.placeholder.com/800x1000?text=Portada';
  controls.detailType.textContent = work.work_type;
  controls.detailFinal.textContent = work.status === 'finalizado' ? 'FINALIZADO' : work.status === 'en emisión' ? 'EN EMISIÓN' : work.status;
  controls.detailAuthor.textContent = work.author || 'Autor desconocido';
  controls.detailTags.innerHTML = '';
  (work.tags || []).slice(0, 6).forEach(tag => {
    const span = document.createElement('span'); span.className = 'tag'; span.textContent = tag; controls.detailTags.appendChild(span);
  });
  const longSynopsis = work.synopsis || 'Sinopsis no disponible.';
  controls.detailSynopsis.textContent = longSynopsis;
  controls.btnToggleSynopsis.classList.toggle('hidden', longSynopsis.length < 220);
  controls.detailReadCount.textContent = `Leídos ${work.read_count || 0}`;
  controls.detailLikeCount.textContent = `Likes ${work.likes_count || 0}`;
  controls.detailCommentCount.textContent = `Comentarios ${work.comments_count || 0}`;
  if (longSynopsis.length > 220) {
    controls.detailSynopsis.style.maxHeight = '138px';
    controls.btnToggleSynopsis.textContent = 'Leer más';
  }
  controls.chapterList.innerHTML = '';
  const previewChapters = chapters.slice(0, 5);
  previewChapters.forEach(chapter => controls.chapterList.appendChild(buildChapterCard(chapter)));
  openPanel(controls.panelDetail);
  if (currentUser) addLibraryEntry(work.id);
};
const buildChapterCard = chapter => {
  const article = document.createElement('article');
  article.className = 'chapter-card card';
  const cover = document.createElement('img');
  cover.src = chapter.cover_url || 'https://via.placeholder.com/400x520?text=Capítulo';
  cover.alt = `Capítulo ${chapter.chapter_number}`;
  const info = document.createElement('div');
  info.innerHTML = `<p>Capítulo ${chapter.chapter_number}</p><button class="pill small">Leer</button>`;
  article.append(cover, info);
  article.addEventListener('click', () => openReader(chapter));
  return article;
};
const openChaptersPanel = () => {
  controls.chapterGrid.innerHTML = '';
  if (!currentChapters.length) {
    controls.chapterGrid.innerHTML = '<div class="card"><div class="card-body"><p>No hay capítulos.</p></div></div>';
  } else {
    currentChapters.forEach(chapter => {
      const card = document.createElement('article');
      card.className = 'card chapter-card';
      card.innerHTML = `<img src="${chapter.cover_url || 'https://via.placeholder.com/400x520?text=Capítulo'}" alt="Capítulo ${chapter.chapter_number}" />
        <div><h3>Capítulo ${chapter.chapter_number}</h3><p>Selecciona para leer</p></div>`;
      card.addEventListener('click', () => openReader(chapter));
      controls.chapterGrid.appendChild(card);
    });
  }
  openPanel(controls.panelChapters);
};
const openReader = async chapter => {
  currentChapter = chapter;
  currentPageIndex = 0;
  controls.readerPages.innerHTML = '';
  const pages = chapter.pages || [];
  if (!pages.length) {
    controls.readerPages.innerHTML = '<p style="color:#fff; padding:24px;">No hay páginas cargadas para este capítulo.</p>';
  } else {
    pages.forEach((page, index) => {
      const img = document.createElement('img');
      img.src = page.url || page;
      img.alt = `Página ${index + 1}`;
      controls.readerPages.appendChild(img);
    });
  }
  controls.readerTitle.textContent = `${currentWork.title} · Capítulo ${chapter.chapter_number}`;
  controls.readerSubtitle.textContent = currentWork.author || 'Autor desconocido';
  openPanel(controls.readerOverlay);
  setTimeout(() => {
    controls.readerHeader.classList.add('hidden');
    controls.readerFooter.classList.add('hidden');
  }, 100);
  if (currentUser) trackRead(chapter);
};
const trackRead = async chapter => {
  await supabase.from('manga_works').update({ read_count: (currentWork.read_count || 0) + 1 }).eq('id', currentWork.id);
  await addLibraryEntry(currentWork.id);
};
const addLibraryEntry = async workId => {
  if (!currentUser) return;
  const { error } = await supabase.from('manga_library').upsert({ user_id: currentUser.id, manga_work_id: workId });
  if (error) console.warn('Biblioteca error', error);
};
const toggleSynopsis = () => {
  const isExpanded = controls.detailSynopsis.style.maxHeight === 'none';
  controls.detailSynopsis.style.maxHeight = isExpanded ? '138px' : 'none';
  controls.btnToggleSynopsis.textContent = isExpanded ? 'Leer más' : 'Leer menos';
};
const reportWork = async () => {
  const reason = prompt('Motivo por el reporte:');
  if (!reason) return;
  showToast('Reporte enviado. Gracias.');
};
const shareCurrentWork = async () => {
  const shareText = `¡NO DEJO DE LEER ${currentWork.title}! TE INVITO A LEERLO en TU MANGA.`;
  const shareUrl = window.location.href;
  if (navigator.share) {
    await navigator.share({ title: currentWork.title, text: shareText, url: shareUrl });
  } else {
    const link = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(link, '_blank');
  }
};
const handleReaderInteraction = () => {
  const visible = controls.readerHeader.classList.contains('hidden');
  if (visible) {
    controls.readerHeader.classList.remove('hidden');
    controls.readerFooter.classList.remove('hidden');
  } else {
    controls.readerHeader.classList.add('hidden');
    controls.readerFooter.classList.add('hidden');
  }
};
const loadAdminWorks = async () => {
  const { data, error } = await supabase.from('manga_works').select('*').order('created_at',{ascending:false});
  controls.adminWorksList.innerHTML = '';
  if (error || !data.length) {
    controls.adminWorksList.innerHTML = '<p>No hay obras publicadas aún.</p>';
    return;
  }
  data.forEach(work => {
    const row = document.createElement('div');
    row.className = 'card';
    row.style.padding = '12px 16px';
    row.innerHTML = `<strong>${work.title}</strong><p>${work.work_type} · ${work.status}</p>`;
    controls.adminWorksList.appendChild(row);
  });
};
const prepareStudio = () => {
  controls.categoryOptions.innerHTML = '';
  categoryLabels.forEach(label => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tag-item';
    btn.textContent = label;
    btn.addEventListener('click', () => btn.classList.toggle('selected'));
    controls.categoryOptions.appendChild(btn);
  });
};
const openStudioStep = (step) => {
  document.querySelectorAll('.studio-step').forEach(el => el.classList.add('hidden'));
  document.getElementById(`studioStep${step}`).classList.remove('hidden');
};
const showScheduleRow = () => {
  controls.workScheduleRow.classList.toggle('hidden', controls.workStatus.value !== 'en emisión');
};
const prepareReview = () => {
  const tags = [...controls.categoryOptions.querySelectorAll('.selected')].map(el => el.textContent);
  const schedule = controls.workSchedule.value ? new Date(controls.workSchedule.value).toLocaleString() : 'Sin programar';
  controls.reviewCover.src = controls.workCover.value || 'https://via.placeholder.com/320x440?text=Portada';
  controls.reviewTitle.textContent = controls.workTitle.value || 'Título pendiente';
  controls.reviewSummary.textContent = controls.workSynopsis.value || 'No hay sinopsis.';
  controls.reviewInfo.textContent = `Estado: ${workStatusLabels[controls.workStatus.value] || controls.workStatus.value}. Capítulos: ${controls.workChapterCount.value}. Tipo: ${controls.workType.value}. Etiquetas: ${tags.join(', ') || 'Sin etiquetas'}. Publicar: ${schedule}`;
};
const publishWork = async () => {
  if (!currentUser || currentUser.email !== adminEmail) { showToast('Solo administrador puede publicar.'); return; }
  const tags = [...controls.categoryOptions.querySelectorAll('.selected')].map(el => el.textContent);
  const chapterCount = Number(controls.workChapterCount.value) || 1;
  const status = controls.workStatus.value;
  const scheduledAt = controls.workSchedule.value ? new Date(controls.workSchedule.value).toISOString() : null;
  const { data: work, error } = await supabase.from('manga_works').insert([{ title: controls.workTitle.value, synopsis: controls.workSynopsis.value, cover_url: controls.workCover.value, work_type: controls.workType.value, status, scheduled_at: scheduledAt, tags, author: currentUser.email, read_count: 0, likes_count: 0 }]).select().single();
  if (error || !work) { showToast('Error publicando obra'); console.error(error); return; }
  const chapterInserts = Array.from({ length: chapterCount }, (_, index) => ({ manga_work_id: work.id, chapter_number: `${index + 1}`, cover_url: '', pages: [] }));
  await supabase.from('manga_chapters').insert(chapterInserts);
  showToast(`Obra ${work.title} publicada.`);
  loadAdminWorks();
  closePanel(controls.panelStudio);
  await buildSection();
};
const init = async () => {
  await getUser();
  await buildSection();
  loadGenreFilters();
  prepareStudio();
};
controls.btnHeroExplore.addEventListener('click', () => openPanel(controls.panelSearch));
controls.btnExplore.addEventListener('click', () => openPanel(controls.panelSearch));
controls.btnGoList.addEventListener('click', () => openPanel(controls.panelSearch));
controls.btnCloseSearch.addEventListener('click', () => closePanel(controls.panelSearch));
controls.btnSearch.addEventListener('click', performSearch);
controls.searchInput.addEventListener('keyup', e => e.key === 'Enter' && performSearch());
controls.btnBackDetail.addEventListener('click', () => closePanel(controls.panelDetail));
controls.btnViewAllChapters.addEventListener('click', openChaptersPanel);
controls.btnBackChapters.addEventListener('click', () => closePanel(controls.panelChapters));
controls.btnToggleSynopsis.addEventListener('click', toggleSynopsis);
controls.btnReportDetail.addEventListener('click', reportWork);
controls.btnShareDetail.addEventListener('click', shareCurrentWork);
controls.btnAddLibrary.addEventListener('click', () => currentWork && addLibraryEntry(currentWork.id));
controls.btnStartRead.addEventListener('click', () => currentChapters[0] && openReader(currentChapters[0]));
controls.readerOverlay.addEventListener('click', event => {
  if (event.target === controls.readerOverlay) handleReaderInteraction();
});
controls.btnReaderBack.addEventListener('click', () => closePanel(controls.readerOverlay));
controls.btnReaderShare.addEventListener('click', shareCurrentWork);
controls.btnReaderFavorite.addEventListener('click', () => {
  const isFollowed = controls.btnReaderFavorite.textContent.includes('✓');
  controls.btnReaderFavorite.textContent = isFollowed ? '♡ +' : '✓ Guardado';
  showToast(isFollowed ? 'Notificaciones desactivadas' : 'ENTENDIDO, RECIBIRÁS UNA NOTIFICACIÓN DE TU CAMPAÑA CUANDO HAYA UNA NUEVA ACTUALIZACIÓN DE CAPÍTULO');
});
controls.btnToggleEps.addEventListener('click', openChaptersPanel);
controls.btnPrevChapter.addEventListener('click', () => {
  if (!currentChapter) return;
  const index = currentChapters.findIndex(ch => ch.id === currentChapter.id);
  if (index > 0) openReader(currentChapters[index - 1]);
});
controls.btnNextChapter.addEventListener('click', () => {
  if (!currentChapter) return;
  const index = currentChapters.findIndex(ch => ch.id === currentChapter.id);
  if (index < currentChapters.length - 1) openReader(currentChapters[index + 1]);
});
controls.btnSignIn.addEventListener('click', () => openPanel(controls.panelAuth));
controls.btnCloseAuth.addEventListener('click', () => closePanel(controls.panelAuth));
controls.btnSendMagicLink.addEventListener('click', async () => {
  const email = controls.authEmail.value.trim();
  if (!email) return showToast('Ingresa un correo válido.');
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) { showToast('Error enviando enlace'); console.error(error); return; }
  showToast('Revisa tu correo para entrar.');
});
controls.btnAdminPanel.addEventListener('click', async () => { await loadAdminWorks(); openPanel(controls.panelAdmin); });
controls.btnCloseAdmin.addEventListener('click', () => closePanel(controls.panelAdmin));
controls.btnCreateWork.addEventListener('click', () => { openPanel(controls.panelStudio); openStudioStep(1); });
controls.btnBackStudio.addEventListener('click', () => closePanel(controls.panelStudio));
controls.btnStep1Next.addEventListener('click', () => { prepareReview(); openStudioStep(2); });
controls.btnStep2Next.addEventListener('click', () => { prepareReview(); openStudioStep(3); });
controls.btnPublishWork.addEventListener('click', publishWork);
controls.btnBackStudioStep.addEventListener('click', () => openStudioStep(2));
controls.workStatus.addEventListener('change', showScheduleRow);
window.addEventListener('load', init);
window.addEventListener('hashchange', () => {});
