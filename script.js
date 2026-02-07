// brandon.md - Obsidian-style navigation

(function () {
  // Elements
  const pages = document.querySelectorAll('.page');
  const treeFiles = document.querySelectorAll('.tree-file');
  const treeFolders = document.querySelectorAll('.tree-folder');
  const tabName = document.querySelector('.tab-name');
  const breadcrumbSegment = document.querySelector('.breadcrumb-segment');
  const breadcrumbSep = document.querySelector('.breadcrumb-sep');
  const breadcrumbCurrent = document.querySelector('.breadcrumb-current');
  const statusWords = document.querySelector('.status-words');
  const statusChars = document.querySelector('.status-chars');
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');

  // Open folders by default
  treeFolders.forEach(function (folder) {
    folder.classList.add('open');
  });

  // Navigate to a page
  function navigateTo(pageId) {
    // Update pages
    pages.forEach(function (page) {
      page.classList.toggle('active', page.dataset.page === pageId);
    });

    // Update sidebar active state
    treeFiles.forEach(function (file) {
      file.classList.toggle('active', file.dataset.page === pageId);
    });

    // Update tab name
    tabName.textContent = pageId + '.md';

    // Update breadcrumb
    var activePage = document.querySelector('.page[data-page="' + pageId + '"]');
    var folder = activePage ? activePage.dataset.folder : '';
    if (folder) {
      breadcrumbSegment.textContent = folder;
      breadcrumbSegment.style.display = '';
      breadcrumbSep.style.display = '';
    } else {
      breadcrumbSegment.style.display = 'none';
      breadcrumbSep.style.display = 'none';
    }
    breadcrumbCurrent.textContent = pageId;

    // Update status bar
    updateStatusBar(activePage);

    // Scroll content to top
    var contentArea = document.querySelector('.content-area');
    if (contentArea) contentArea.scrollTop = 0;

    // Close mobile sidebar
    closeSidebar();
  }

  // Word and character count
  function updateStatusBar(pageEl) {
    if (!pageEl) return;
    var text = pageEl.textContent || '';
    var words = text.trim().split(/\s+/).filter(function (w) { return w.length > 0; });
    statusWords.textContent = words.length + ' words';
    statusChars.textContent = text.length + ' characters';
  }

  // Hash routing
  function handleHash() {
    var hash = window.location.hash.replace('#', '');
    if (!hash) hash = 'brandon';
    // Verify page exists
    var exists = document.querySelector('.page[data-page="' + hash + '"]');
    if (!exists) hash = 'brandon';
    navigateTo(hash);
  }

  window.addEventListener('hashchange', handleHash);

  // Sidebar file clicks
  treeFiles.forEach(function (file) {
    file.addEventListener('click', function () {
      var pageId = file.dataset.page;
      window.location.hash = pageId;
    });
  });

  // Folder expand/collapse
  treeFolders.forEach(function (folder) {
    var header = folder.querySelector('.tree-folder-header');
    header.addEventListener('click', function () {
      folder.classList.toggle('open');
    });
  });

  // Internal links (wikilink-style)
  document.addEventListener('click', function (e) {
    var link = e.target.closest('.internal-link');
    if (link) {
      e.preventDefault();
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        window.location.hash = href.substring(1);
      }
    }
  });

  // Mobile sidebar toggle
  function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('open');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('open');
  }

  sidebarToggle.addEventListener('click', function () {
    if (sidebar.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  sidebarOverlay.addEventListener('click', closeSidebar);

  // Blinking cursor (~530ms matches Obsidian)
  var cursors = document.querySelectorAll('.cursor-blink');
  setInterval(function () {
    cursors.forEach(function (c) {
      c.style.opacity = c.style.opacity === '0' ? '1' : '0';
    });
  }, 530);

  // Initialize
  handleHash();
})();
