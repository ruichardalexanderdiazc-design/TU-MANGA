const adminEmail = 'richardalexanderdiaz0@gmail.com';
const firebaseConfig = {
  apiKey: "AIzaSyD4t6Tq1bAell9u6V8UcErv1Ee4gFo78y0",
  authDomain: "nexusapp-c0a21.firebaseapp.com",
  databaseURL: "https://nexusapp-c0a21-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "nexusapp-c0a21",
  storageBucket: "nexusapp-c0a21.firebasestorage.app",
  messagingSenderId: "487113661451",
  appId: "1:487113661451:web:d8407d9235631b7fc6fb0e"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

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
  btnEmailSignIn: document.getElementById('btnEmailSignIn'),
  btnEmailRegister: document.getElementById('btnEmailRegister'),
  btnGoogleSignIn: document.getElementById('btnGoogleSignIn'),
  btnSignOut: document.getElementById('btnSignOut'),
  authEmail: document.getElementById('authEmail'),
  authPassword: document.getElementById('authPassword'),
  authForm: document.getElementById('authForm'),
  profileView: document.getElementById('profileView'),
  profileAvatar: document.getElementById('profileAvatar'),
  profileName: document.getElementById('profileName'),
  profileEmail: document.getElementById('profileEmail'),
  btnProfileSettings: document.getElementById('btnProfileSettings'),
  btnProfileLanguage: document.getElementById('btnProfileLanguage'),
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
  navHome: document.getElementById('navHome'),
  navDiscover: document.getElementById('navDiscover'),
  navLibrary: document.getElementById('navLibrary'),
  navProfile: document.getElementById('navProfile'),
  navStudio: document.getElementById('navStudio'),
  btnCloseSearchOnPage: document.getElementById('btnCloseSearch')
};
let currentUser = null;
let currentWork = null;
let currentChapters = [];
let currentChapter = null;
let selectedTags = new Set();
let savedLibrary = new Set();

const genreOptions = ['Acci�n','Aventura','Drama','Suspenso','Romance','Fantas�a','Ciencia ficci�n','Vida escolar','Yaoi','BL','+18','Gore','Magia'];
const categoryLabels = ['Acci�n','Aventura','Romance','Fantas�a','Drama','Suspenso','Ciencia ficci�n','Vida escolar','BL','Yaoi','+18','Gore','Magia','Urban'];
const workStatusLabels = { finalizado: 'FINALIZADO', 'en emisión': 'EN EMISIÓN' };
const works = [];
const chapterMap = {};

const showToast = message => {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  window.clearTimeout(toast.timeout);
  toast.timeout = window.setTimeout(() => toast.classList.add('hidden'), 3200);
};

const openPanel = panel => panel.classList.remove('hidden');
const closePanel = panel => panel.classList.add('hidden');

const setAuthState = user => {
  currentUser = user;
  const isAdmin = user?.email === adminEmail;
  controls.btnSignIn.classList.toggle('hidden', !!user);
  controls.btnAdminPanel.classList.toggle('hidden', !isAdmin);
  controls.navStudio.classList.toggle('hidden', !isAdmin);
  if (user) {
    controls.btnSignIn.textContent = user.email.split('@')[0];
    controls.authForm.classList.add('hidden');
    controls.profileView.classList.remove('hidden');
    renderProfile(user);
  } else {
    controls.btnSignIn.textContent = 'Entrar / Registro';
    controls.authForm.classList.remove('hidden');
    controls.profileView.classList.add('hidden');
    controls.authEmail.value = '';
    controls.authPassword.value = '';
  }
};

const getSavedLibrary = () => {
  if (!currentUser) return new Set();
  const raw = localStorage.getItem(`library_${currentUser.uid}`) || '[]';
  try { return new Set(JSON.parse(raw)); } catch { return new Set(); }
};

const saveLibrary = () => {
  if (!currentUser) return;
  localStorage.setItem(`library_${currentUser.uid}`, JSON.stringify([...savedLibrary]));
};

const buildCard = work => {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `<img src="${work.cover_url}" alt="${work.title}" loading="lazy" />
    <div class="card-body">
      <h3>${work.title}</h3>
      <p>${work.author}</p>
      <div class="card-footer">
        <span class="tag">${work.work_type}</span>
        <span class="tag">${work.status.toUpperCase()}</span>
      </div>
    </div>`;
  card.addEventListener('click', () => openWorkDetail(work));
  return card;
};

const renderCards = (element, list) => {
  element.innerHTML = '';
  if (!list.length) {
    element.innerHTML = '<div style="grid-column: 1/-1; padding: 40px; text-align: center; color: #999;"><p>No hay nada por ver...por ahora.</p></div>';
    return;
  }
  list.forEach(item => element.appendChild(buildCard(item)));
};

const fetchChapters = async workId => chapterMap[workId] || [];

const buildSection = async () => {
  const now = new Date();
  const upcoming = works.filter(work => work.scheduled_at && new Date(work.scheduled_at) > now);
  const recent = works.filter(work => !work.scheduled_at && new Date(work.created_at) > new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000));
  const daily = works.filter(work => new Date(work.created_at) > new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000));
  const trending = [...works].sort((a,b) => (b.read_count + b.likes_count) - (a.read_count + a.likes_count)).slice(0, 8);
  const allWorks = works.filter(work => ['COMIC','MANHWA'].includes(work.work_type));
  const finished = works.filter(work => work.status === 'finalizado');
  renderCards(sections.new, recent);
  renderCards(sections.soon, upcoming);
  renderCards(sections.daily, daily);
  renderCards(sections.trending, trending);
  renderCards(sections.all, allWorks);
  renderCards(sections.finished, finished);
  renderCards(sections.finals, finished);
};

const setActiveNav = tab => {
  ['navHome','navDiscover','navLibrary','navProfile','navStudio'].forEach(id => {
    controls[id].classList.toggle('active', id === `nav${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
  });
  if (tab === 'home') {
    document.getElementById('mainContent').scrollIntoView({ behavior: 'smooth' });
  }
  if (tab === 'discover') {
    openPanel(controls.panelSearch);
  }
  if (tab === 'library') {
    if (!currentUser) openPanel(controls.panelAuth);
    else showToast('Tu biblioteca está vacía por ahora.');
  }
  if (tab === 'profile') {
    openPanel(controls.panelAuth);
  }
  if (tab === 'studio') {
    if (!currentUser || currentUser.email !== adminEmail) {
      showToast('Solo el admin puede acceder al estudio.');
    } else {
      loadAdminWorks();
      openPanel(controls.panelAdmin);
    }
  }
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

const performSearch = () => {
  const query = controls.searchInput.value.trim().toLowerCase();
  let filtered = [...works];
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
  currentChapters = await fetchChapters(work.id);
  controls.detailTitle.textContent = work.title;
  controls.detailStatus.textContent = `${work.work_type} � ${workStatusLabels[work.status] || work.status}`;
  controls.detailCover.src = work.cover_url;
  controls.detailType.textContent = work.work_type;
  controls.detailFinal.textContent = work.status.toUpperCase();
  controls.detailAuthor.textContent = work.author;
  controls.detailTags.innerHTML = '';
  (work.tags || []).slice(0, 6).forEach(tag => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = tag;
    controls.detailTags.appendChild(span);
  });
  const synopsis = work.synopsis || 'Sinopsis no disponible.';
  controls.detailSynopsis.textContent = synopsis;
  controls.btnToggleSynopsis.classList.toggle('hidden', synopsis.length < 220);
  controls.detailReadCount.textContent = `Le�dos ${work.read_count}`;
  controls.detailLikeCount.textContent = `Likes ${work.likes_count}`;
  controls.detailCommentCount.textContent = `Comentarios ${work.comments_count}`;
  if (synopsis.length > 220) {
    controls.detailSynopsis.style.maxHeight = '138px';
    controls.btnToggleSynopsis.textContent = 'Leer m�s';
  }
  controls.chapterList.innerHTML = '';
  currentChapters.slice(0, 5).forEach(chapter => controls.chapterList.appendChild(buildChapterCard(chapter)));
  openPanel(controls.panelDetail);
  if (currentUser) addLibraryEntry(work.id);
};

const buildChapterCard = chapter => {
  const article = document.createElement('article');
  article.className = 'chapter-card card';
  article.innerHTML = `<img src="${chapter.cover_url}" alt="Cap�tulo ${chapter.chapter_number}" />
    <div class="card-body"><p>Cap�tulo ${chapter.chapter_number}</p><button class="pill small">Leer</button></div>`;
  article.addEventListener('click', () => openReader(chapter));
  return article;
};

const openChaptersPanel = () => {
  controls.chapterGrid.innerHTML = '';
  if (!currentChapters.length) {
    controls.chapterGrid.innerHTML = '<div class="card"><div class="card-body"><p>No hay cap�tulos.</p></div></div>';
  } else {
    currentChapters.forEach(chapter => {
      const card = document.createElement('article');
      card.className = 'card chapter-card';
      card.innerHTML = `<img src="${chapter.cover_url}" alt="Cap�tulo ${chapter.chapter_number}" /><div class="card-body"><h3>Cap�tulo ${chapter.chapter_number}</h3><p>Selecciona para leer</p></div>`;
      card.addEventListener('click', () => openReader(chapter));
      controls.chapterGrid.appendChild(card);
    });
  }
  openPanel(controls.panelChapters);
};

const openReader = chapter => {
  currentChapter = chapter;
  controls.readerPages.innerHTML = '';
  const pages = chapter.pages || [];
  if (!pages.length) {
    controls.readerPages.innerHTML = '<p style="color:#333; padding:24px;">No hay p�ginas cargadas para este cap�tulo.</p>';
  } else {
    pages.forEach((page, index) => {
      const img = document.createElement('img');
      img.src = page;
      img.alt = `P�gina ${index + 1}`;
      controls.readerPages.appendChild(img);
    });
  }
  controls.readerHeader.classList.remove('hidden');
  controls.readerFooter.classList.remove('hidden');
  controls.readerTitle.textContent = `${currentWork.title} � Cap�tulo ${chapter.chapter_number}`;
  controls.readerSubtitle.textContent = currentWork.author;
  openPanel(controls.readerOverlay);
  trackRead(chapter);
};

const trackRead = chapter => {
  if (!currentWork) return;
  currentWork.read_count += 1;
  addLibraryEntry(currentWork.id);
  buildSection();
};

const addLibraryEntry = workId => {
  if (!currentUser) return;
  savedLibrary.add(workId);
  saveLibrary();
};

const toggleSynopsis = () => {
  const isExpanded = controls.detailSynopsis.style.maxHeight !== 'none';
  controls.detailSynopsis.style.maxHeight = isExpanded ? '138px' : 'none';
  controls.btnToggleSynopsis.textContent = isExpanded ? 'Leer m�s' : 'Leer menos';
};

const reportWork = () => {
  if (!currentUser) { showToast('Debes iniciar sesi�n para reportar.'); return; }
  const reason = prompt('Motivo del reporte:');
  if (!reason) return;
  showToast('Reporte enviado. Gracias.');
};

const shareCurrentWork = async () => {
  if (!currentWork) return;
  const shareText = `Estoy leyendo ${currentWork.title} en TU MANGA.`;
  const shareUrl = window.location.href;
  if (navigator.share) {
    await navigator.share({ title: currentWork.title, text: shareText, url: shareUrl });
  } else {
    const link = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(link, '_blank');
  }
};

const loadAdminWorks = () => {
  const list = works.filter(work => work.author === adminEmail || work.author === 'Admin');
  controls.adminWorksList.innerHTML = '';
  if (!list.length) {
    controls.adminWorksList.innerHTML = '<p>No hay obras publicadas a�n.</p>';
    return;
  }
  list.forEach(work => {
    const row = document.createElement('div');
    row.className = 'card';
    row.style.padding = '14px 16px';
    row.innerHTML = `<strong>${work.title}</strong><p>${work.work_type} � ${work.status}</p>`;
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
  showScheduleRow();
  openStudioStep(1);
};

const openStudioStep = step => {
  document.querySelectorAll('.studio-step').forEach(el => el.classList.add('hidden'));
  const active = document.getElementById(`studioStep${step}`);
  if (active) active.classList.remove('hidden');
};

const showScheduleRow = () => {
  controls.workScheduleRow.classList.toggle('hidden', controls.workStatus.value !== 'en emisi�n');
};

const prepareReview = () => {
  const tags = [...controls.categoryOptions.querySelectorAll('.selected')].map(el => el.textContent);
  const schedule = controls.workSchedule.value ? new Date(controls.workSchedule.value).toLocaleString() : 'Sin programaci�n';
  controls.reviewCover.src = controls.workCover.value || 'https://via.placeholder.com/400x520/ffccd7/333?text=Portada';
  controls.reviewTitle.textContent = controls.workTitle.value || 'T�tulo pendiente';
  controls.reviewSummary.textContent = controls.workSynopsis.value || 'No hay sinopsis.';
  controls.reviewInfo.textContent = `Estado: ${workStatusLabels[controls.workStatus.value] || controls.workStatus.value}. Cap�tulos: ${controls.workChapterCount.value}. Tipo: ${controls.workType.value}. Etiquetas: ${tags.join(', ') || 'Sin etiquetas'}. Programado: ${schedule}`;
};

const publishWork = () => {
  if (!currentUser || currentUser.email !== adminEmail) { showToast('Necesitas iniciar sesi�n con la cuenta correcta.'); return; }
  const tags = [...controls.categoryOptions.querySelectorAll('.selected')].map(el => el.textContent);
  const newWork = {
    id: `w${Date.now()}`,
    title: controls.workTitle.value || 'Sin t�tulo',
    synopsis: controls.workSynopsis.value || 'Sinopsis pendiente.',
    cover_url: controls.workCover.value || 'https://via.placeholder.com/400x520/ffccd7/333?text=Portada',
    work_type: controls.workType.value,
    status: controls.workStatus.value,
    tags,
    author: adminEmail,
    read_count: 0,
    likes_count: 0,
    comments_count: 0,
    created_at: new Date().toISOString()
  };
  works.unshift(newWork);
  chapterMap[newWork.id] = Array.from({ length: Number(controls.workChapterCount.value) || 1 }, (_, index) => ({
    id: `c${Date.now()}_${index}`,
    manga_work_id: newWork.id,
    chapter_number: `${index + 1}`,
    cover_url: newWork.cover_url,
    pages: ['https://via.placeholder.com/800x1000/fff0f6/333?text=P�gina+1']
  }));
  showToast(`Obra ${newWork.title} publicada.`);
  closePanel(controls.panelStudio);
  loadAdminWorks();
  buildSection();
};

const handleEmailSignIn = async () => {
  const email = controls.authEmail.value.trim();
  const password = controls.authPassword.value;
  if (!email || !password) { showToast('Ingresa correo y contrase�a.'); return; }
  try {
    await auth.signInWithEmailAndPassword(email, password);
    closePanel(controls.panelAuth);
    showToast('Sesi�n iniciada.');
  } catch (error) {
    showToast(error.message || 'Error al iniciar sesi�n.');
    console.error(error);
  }
};

const handleEmailRegister = async () => {
  const email = controls.authEmail.value.trim();
  const password = controls.authPassword.value;
  if (!email || !password) { showToast('Ingresa correo y contrase�a.'); return; }
  try {
    await auth.createUserWithEmailAndPassword(email, password);
    closePanel(controls.panelAuth);
    showToast('Cuenta creada. Bienvenido.');
  } catch (error) {
    showToast(error.message || 'Error al crear cuenta.');
    console.error(error);
  }
};

const handleGoogleSignIn = async () => {
  try {
    await auth.signInWithPopup(googleProvider);
    closePanel(controls.panelAuth);
    showToast('Has iniciado sesi�n con Google.');
  } catch (error) {
    showToast(error.message || 'Error con Google.');
    console.error(error);
  }
};

const renderProfile = user => {
  const name = user.displayName || user.email.split('@')[0] || 'Usuario';
  const avatar = user.photoURL || null;
  controls.profileName.textContent = name;
  controls.profileEmail.textContent = user.email || '';
  if (avatar) {
    controls.profileAvatar.style.backgroundImage = `url(${avatar})`;
    controls.profileAvatar.textContent = '';
  } else {
    controls.profileAvatar.style.backgroundImage = 'none';
    controls.profileAvatar.textContent = name.charAt(0).toUpperCase();
  }
};

const handleSignOut = async () => {
  try {
    await auth.signOut();
    showToast('Sesión cerrada.');
    closePanel(controls.panelAuth);
    closePanel(controls.panelAdmin);
    closePanel(controls.panelStudio);
  } catch (error) {
    showToast('No se pudo cerrar sesión.');
  }
};

const init = () => {
  setAuthState(null);
  buildSection();
  loadGenreFilters();
  prepareStudio();
  auth.onAuthStateChanged(user => {
    setAuthState(user);
    savedLibrary = getSavedLibrary();
  });
  controls.btnHeroExplore.addEventListener('click', () => openPanel(controls.panelSearch));
  controls.btnExplore.addEventListener('click', () => openPanel(controls.panelSearch));
  controls.btnGoList.addEventListener('click', () => openPanel(controls.panelSearch));
  controls.btnCloseSearch.addEventListener('click', () => closePanel(controls.panelSearch));
  controls.btnSearch.addEventListener('click', performSearch);
  controls.navHome.addEventListener('click', () => setActiveNav('home'));
  controls.navDiscover.addEventListener('click', () => setActiveNav('discover'));
  controls.navLibrary.addEventListener('click', () => setActiveNav('library'));
  controls.navProfile.addEventListener('click', () => setActiveNav('profile'));
  controls.navStudio.addEventListener('click', () => setActiveNav('studio'));
  controls.searchInput.addEventListener('keyup', e => e.key === 'Enter' && performSearch());
  controls.btnBackDetail.addEventListener('click', () => closePanel(controls.panelDetail));
  controls.btnViewAllChapters.addEventListener('click', openChaptersPanel);
  controls.btnBackChapters.addEventListener('click', () => closePanel(controls.panelChapters));
  controls.btnToggleSynopsis.addEventListener('click', toggleSynopsis);
  controls.btnReportDetail.addEventListener('click', reportWork);
  controls.btnShareDetail.addEventListener('click', shareCurrentWork);
  controls.btnAddLibrary.addEventListener('click', () => currentWork && addLibraryEntry(currentWork.id));
  controls.btnStartRead.addEventListener('click', () => currentChapters[0] && openReader(currentChapters[0]));
  controls.readerOverlay.addEventListener('click', event => { if (event.target === controls.readerOverlay) closePanel(controls.readerOverlay); });
  controls.btnReaderBack.addEventListener('click', () => closePanel(controls.readerOverlay));
  controls.btnReaderShare.addEventListener('click', shareCurrentWork);
  controls.btnReaderFavorite.addEventListener('click', () => showToast('Guardado en tu biblioteca.'));
  controls.btnToggleEps.addEventListener('click', openChaptersPanel);
  controls.btnPrevChapter.addEventListener('click', () => {
    if (!currentChapter) return; const index = currentChapters.findIndex(ch => ch.id === currentChapter.id);
    if (index > 0) openReader(currentChapters[index - 1]);
  });
  controls.btnNextChapter.addEventListener('click', () => {
    if (!currentChapter) return; const index = currentChapters.findIndex(ch => ch.id === currentChapter.id);
    if (index < currentChapters.length - 1) openReader(currentChapters[index + 1]);
  });
  controls.btnSignIn.addEventListener('click', () => openPanel(controls.panelAuth));
  controls.btnCloseAuth.addEventListener('click', () => closePanel(controls.panelAuth));
  controls.btnEmailSignIn.addEventListener('click', handleEmailSignIn);
  controls.btnEmailRegister.addEventListener('click', handleEmailRegister);
  controls.btnGoogleSignIn.addEventListener('click', handleGoogleSignIn);
  controls.btnSignOut.addEventListener('click', handleSignOut);
  controls.btnProfileSettings.addEventListener('click', () => showToast('Ajustes de perfil no disponibles aún.'));
  controls.btnProfileLanguage.addEventListener('click', () => showToast('Cambiar idioma no está activado aún.'));
  controls.btnAdminPanel.addEventListener('click', () => { loadAdminWorks(); openPanel(controls.panelAdmin); });
  controls.btnCloseAdmin.addEventListener('click', () => closePanel(controls.panelAdmin));
  controls.btnCreateWork.addEventListener('click', () => { prepareStudio(); openPanel(controls.panelStudio); });
  controls.btnBackStudio.addEventListener('click', () => closePanel(controls.panelStudio));
  controls.btnStep1Next.addEventListener('click', () => { prepareReview(); openStudioStep(2); });
  controls.btnStep2Next.addEventListener('click', () => { prepareReview(); openStudioStep(3); });
  controls.btnPublishWork.addEventListener('click', publishWork);
  controls.btnBackStudioStep.addEventListener('click', () => openStudioStep(2));
  controls.workStatus.addEventListener('change', showScheduleRow);
};

window.addEventListener('load', init);
