// brandon.md - Obsidian-style navigation

(function () {
  // Elements
  const pages = document.querySelectorAll('.page');
  const treeFiles = document.querySelectorAll('.tree-file');
  const treeFolders = document.querySelectorAll('.tree-folder');
  const paneLeft = document.querySelector('.pane-left');
  const paneRight = document.querySelector('.pane-right');
  const tabName = paneLeft.querySelector('.tab-name');
  const tabPage = paneLeft.querySelector('.tab-page');
  const breadcrumbSegment = paneLeft.querySelector('.breadcrumb-segment');
  const breadcrumbSep = paneLeft.querySelector('.breadcrumb-sep');
  const breadcrumbCurrent = paneLeft.querySelector('.breadcrumb-current');
  const statusWords = paneLeft.querySelector('.status-words');
  const statusChars = paneLeft.querySelector('.status-chars');
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

    // Update tab
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
    var paneContent = paneLeft.querySelector('.pane-content');
    if (paneContent) paneContent.scrollTop = 0;

    // Close mobile sidebar
    closeSidebar();

    // On mobile, show left pane when navigating to a page
    if (window.innerWidth < 1024) {
      paneLeft.classList.add('active');
      paneRight.classList.remove('active');
    }
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
    if (!hash || hash === 'press' || hash === 'graph') hash = 'brandon';
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

  // Mobile pane switching
  function isMobile() {
    return window.innerWidth < 1024;
  }

  // Graph tab click on mobile shows right pane
  var graphTab = paneRight.querySelector('.tab-graph');
  if (graphTab) {
    graphTab.addEventListener('click', function () {
      if (isMobile()) {
        paneRight.classList.add('active');
        paneLeft.classList.remove('active');
      }
    });
  }

  // Page tabs click on mobile shows left pane (already handled in navigateTo)

  // Blinking cursor (~530ms matches Obsidian)
  var cursors = document.querySelectorAll('.cursor-blink');
  setInterval(function () {
    cursors.forEach(function (c) {
      c.style.opacity = c.style.opacity === '0' ? '1' : '0';
    });
  }, 530);


  // ══════════════════════════════════════════
  // Graph View
  // ══════════════════════════════════════════

  (function initGraph() {
    var canvas = document.querySelector('.graph-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    // Node data
    var realPages = ['brandon', 'zar', 'sadapay', 'gasninjas', 'endeavor', 'others', 'links'];

    var ghostNames = [
      'Anatoly Yakovenko', 'Raj Gokal', 'Balaji Srinivasan', 'Nic Carter',
      'Andreessen Horowitz', 'Dragonfly', 'Coinbase Ventures', 'Papara',
      'Exajoule', 'Endeavor Catalyst',
      'Pakistan', 'Global South', 'Miami', 'Silicon Valley',
      'University of Miami',
      'Stablecoins', 'Distribution', 'Fintech'
    ];

    var edges = [
      // brandon connections
      ['brandon', 'zar'], ['brandon', 'sadapay'], ['brandon', 'gasninjas'],
      ['brandon', 'endeavor'], ['brandon', 'others'], ['brandon', 'links'],
      ['brandon', 'Distribution'], ['brandon', 'University of Miami'],
      // zar connections
      ['zar', 'Andreessen Horowitz'], ['zar', 'Dragonfly'], ['zar', 'Coinbase Ventures'],
      ['zar', 'Endeavor Catalyst'], ['zar', 'Stablecoins'], ['zar', 'Pakistan'],
      ['zar', 'Global South'], ['zar', 'Anatoly Yakovenko'], ['zar', 'Raj Gokal'],
      ['zar', 'Balaji Srinivasan'], ['zar', 'Nic Carter'],
      // sadapay connections
      ['sadapay', 'Pakistan'], ['sadapay', 'Papara'], ['sadapay', 'Endeavor Catalyst'],
      ['sadapay', 'Fintech'],
      // gasninjas connections
      ['gasninjas', 'Miami'], ['gasninjas', 'Exajoule'], ['gasninjas', 'Silicon Valley'],
      // endeavor connections
      ['endeavor', 'Endeavor Catalyst'], ['endeavor', 'Pakistan'],
      ['endeavor', 'sadapay'], ['endeavor', 'zar']
    ];

    var ghostDescriptions = {
      'Anatoly Yakovenko': 'Co-founder of Solana. Angel investor in ZAR.',
      'Raj Gokal': 'Co-founder of Solana. Angel investor in ZAR.',
      'Balaji Srinivasan': 'Former CTO of Coinbase, former GP at a16z. Angel investor in ZAR.',
      'Nic Carter': 'GP, Castle Island Ventures. Angel investor in ZAR.',
      'Andreessen Horowitz': "World's preeminent VC fund. Led ZAR's last round via a16z crypto.",
      'Dragonfly': 'Crypto venture fund. Major investor in ZAR.',
      'Coinbase Ventures': 'Seed investor in ZAR.',
      'Papara': 'Turkish fintech unicorn. Acquired SadaPay in 2024.',
      'Exajoule': 'Silicon Valley energy company. Acquired GasNinjas in 2017.',
      'Endeavor Catalyst': "Endeavor's $540M investment arm. Seed investor in ZAR.",
      'Pakistan': 'First live market for ZAR. Home of SadaPay.',
      'Global South': "ZAR's target: a billion people with unstable currencies.",
      'Miami': 'Where GasNinjas launched and operated.',
      'Silicon Valley': 'Where Exajoule (GasNinjas acquirer) is based.',
      'University of Miami': 'Where Brandon studied before dropping out.',
      'Stablecoins': "Digital dollars. ZAR's core product.",
      'Distribution': "Brandon's self-described superpower.",
      'Fintech': "SadaPay was Pakistan's leading neobank."
    };

    var tooltip = document.querySelector('.graph-tooltip');
    var tooltipName = document.querySelector('.graph-tooltip-name');
    var tooltipDesc = document.querySelector('.graph-tooltip-desc');

    function hideTooltip() {
      tooltip.hidden = true;
    }

    function showTooltip(name, desc, nx, ny) {
      tooltipName.textContent = name;
      tooltipDesc.textContent = desc;
      tooltip.hidden = false;

      if (window.innerWidth < 768) {
        // Mobile: fixed bottom bar, CSS handles positioning
        tooltip.style.left = '';
        tooltip.style.top = '';
      } else {
        // Desktop: position near node
        var rect = canvas.getBoundingClientRect();
        var parentRect = canvas.parentElement.getBoundingClientRect();
        var tx = nx - parentRect.left + 15;
        var ty = ny - parentRect.top - 10;
        // Clamp so tooltip doesn't overflow right edge
        var maxX = parentRect.width - 240;
        if (tx > maxX) tx = nx - parentRect.left - 235;
        tooltip.style.left = tx + 'px';
        tooltip.style.top = ty + 'px';
      }
    }

    // Build node list
    var nodes = [];
    var nodeMap = {};

    realPages.forEach(function (id) {
      var node = { id: id, label: id, real: true, x: 0, y: 0, vx: 0, vy: 0, phase: Math.random() * Math.PI * 2 };
      nodes.push(node);
      nodeMap[id] = node;
    });

    ghostNames.forEach(function (name) {
      var node = { id: name, label: name, real: false, x: 0, y: 0, vx: 0, vy: 0, phase: Math.random() * Math.PI * 2 };
      nodes.push(node);
      nodeMap[name] = node;
    });

    // Initialize positions randomly around center
    nodes.forEach(function (n) {
      n.x = 0.5 + (Math.random() - 0.5) * 0.6;
      n.y = 0.5 + (Math.random() - 0.5) * 0.6;
    });
    // brandon starts at center
    nodeMap['brandon'].x = 0.5;
    nodeMap['brandon'].y = 0.5;

    // Force-directed layout (run once to settle)
    var iterations = 400;
    for (var iter = 0; iter < iterations; iter++) {
      var repulsion = 0.00015;
      var springLen = 0.12;
      var springK = 0.1;
      var damping = 0.82;
      var gravity = 0.012;
      var brandonGravity = 0.15;

      // Repulsion between all pairs
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[i].x - nodes[j].x;
          var dy = nodes[i].y - nodes[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.01) dist = 0.01;
          var force = repulsion / (dist * dist);
          var fx = (dx / dist) * force;
          var fy = (dy / dist) * force;
          nodes[i].vx += fx;
          nodes[i].vy += fy;
          nodes[j].vx -= fx;
          nodes[j].vy -= fy;
        }
      }

      // Spring forces along edges
      edges.forEach(function (e) {
        var a = nodeMap[e[0]];
        var b = nodeMap[e[1]];
        if (!a || !b) return;
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.01) dist = 0.01;
        var force = (dist - springLen) * springK;
        var fx = (dx / dist) * force;
        var fy = (dy / dist) * force;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      });

      // Center gravity on all nodes
      nodes.forEach(function (n) {
        n.vx += (0.5 - n.x) * gravity;
        n.vy += (0.5 - n.y) * gravity;
      });

      // Much stronger gravity for brandon to pin it to center
      var bn = nodeMap['brandon'];
      bn.vx += (0.5 - bn.x) * brandonGravity;
      bn.vy += (0.5 - bn.y) * brandonGravity;

      // Update positions
      nodes.forEach(function (n) {
        n.vx *= damping;
        n.vy *= damping;
        n.x += n.vx;
        n.y += n.vy;
        // Soft bounds with padding for labels
        n.x = Math.max(0.08, Math.min(0.92, n.x));
        n.y = Math.max(0.08, Math.min(0.92, n.y));
      });
    }

    // Clear velocities (positions are now fixed)
    nodes.forEach(function (n) { n.vx = 0; n.vy = 0; });

    // Rendering
    var animId = null;
    var dpr = window.devicePixelRatio || 1;

    function sizeCanvas() {
      var parent = canvas.parentElement;
      var w = parent.clientWidth;
      var h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
    }

    function isMobile() {
      return window.innerWidth < 768;
    }

    function draw(time) {
      var w = canvas.width / dpr;
      var h = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      var mobile = isMobile();
      var realRadius = mobile ? 8 : 10;
      var ghostRadius = mobile ? 4 : 5;
      var fontSize = mobile ? 9 : 11;
      var floatAmp = mobile ? 1.5 : 3;
      var t = time / 1000;

      // Map normalized coords into a square region centered in the canvas
      var side = Math.min(w, h);
      var offsetX = (w - side) / 2;
      var offsetY = (h - side) / 2;

      // Compute screen positions with floating offset
      var screenPos = {};
      nodes.forEach(function (n) {
        var ox = Math.sin(t * 0.7 + n.phase) * floatAmp;
        var oy = Math.cos(t * 0.5 + n.phase * 1.3) * floatAmp;
        screenPos[n.id] = {
          x: offsetX + n.x * side + ox,
          y: offsetY + n.y * side + oy
        };
      });

      // Draw edges
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      edges.forEach(function (e) {
        var a = screenPos[e[0]];
        var b = screenPos[e[1]];
        if (!a || !b) return;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });

      // Draw nodes and labels
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      nodes.forEach(function (n) {
        var pos = screenPos[n.id];
        var r = n.real ? realRadius : ghostRadius;
        var fill = n.real ? '#7f6df2' : '#555';

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();

        ctx.font = fontSize + 'px Inter, sans-serif';
        ctx.fillStyle = n.real ? '#dcddde' : '#888';
        ctx.fillText(n.label, pos.x, pos.y + r + 4);
      });

      animId = requestAnimationFrame(draw);
    }

    function startGraph() {
      sizeCanvas();
      if (!animId) animId = requestAnimationFrame(draw);
    }

    // Resize handling
    var graphPane = canvas.parentElement;
    var resizeObserver = new ResizeObserver(function () {
      sizeCanvas();
    });
    resizeObserver.observe(graphPane);

    // Click/tap navigation on real nodes, tooltip on ghost nodes
    function handleCanvasClick(e) {
      var rect = canvas.getBoundingClientRect();
      var mx, my, clientX, clientY;
      if (e.changedTouches) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      mx = clientX - rect.left;
      my = clientY - rect.top;

      var w = rect.width;
      var h = rect.height;
      var side = Math.min(w, h);
      var ox = (w - side) / 2;
      var oy = (h - side) / 2;
      var hitRadius = 30;

      // Check real nodes first
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if (!n.real) continue;
        var nx = ox + n.x * side;
        var ny = oy + n.y * side;
        var dx = mx - nx;
        var dy = my - ny;
        if (Math.sqrt(dx * dx + dy * dy) < hitRadius) {
          hideTooltip();
          window.location.hash = n.id;
          return;
        }
      }

      // Check ghost nodes
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if (n.real) continue;
        var nx = ox + n.x * side;
        var ny = oy + n.y * side;
        var dx = mx - nx;
        var dy = my - ny;
        if (Math.sqrt(dx * dx + dy * dy) < hitRadius) {
          var desc = ghostDescriptions[n.id] || '';
          showTooltip(n.label, desc, clientX, clientY);
          return;
        }
      }

      // Tap on empty space: hide tooltip
      hideTooltip();
    }

    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('touchend', function (e) {
      e.preventDefault();
      handleCanvasClick(e);
    });

    // Start graph immediately (always visible now)
    startGraph();
  })();

  // Initialize
  handleHash();
})();
