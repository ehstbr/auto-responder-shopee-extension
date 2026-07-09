(() => {
  const EXT = 'ldb-shopee';
  const PANEL_ID = `${EXT}-panel`;
  const FLOAT_ID = `${EXT}-floating-button`;
  const FLOAT_SUMMARY_ID = `${EXT}-floating-summary`;
  const SHOPEE_LOCK_CLASS = `${EXT}-hide-reply-controls`;
  const EXT_VERSION = (chrome.runtime && chrome.runtime.getManifest && chrome.runtime.getManifest().version) || '0.5.23';
  const TERMS_ACCEPTED_KEY = `${EXT}-terms-accepted-v1`;
  const TERMS_ACCEPTED_VERSION_KEY = `${EXT}-terms-accepted-version`;
  const ONBOARDING_STEPS = 4;
  const PENDING_RUN_KEY = `${EXT}-pending-run-v1`;
  const RATING_SUMMARY_KEY = `${EXT}-rating-summary-v1`;
  const RATING_PAGE_URL = 'https://seller.shopee.com.br/portal/settings/shop/rating?replied=TO_REPLY';
  const RATING_API_PATH = '/api/v3/settings/search_shop_rating_comments_new/';
  const TERMS_HTML = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<style>
  body { font-family: Arial, Helvetica, sans-serif; color: #222; margin: 0; padding: 16px; line-height: 1.48; font-size: 14px; }
  h1 { font-size: 18px; margin: 0 0 10px; }
  h2 { font-size: 15px; margin: 16px 0 8px; }
  p { margin: 0 0 10px; }
  ul { margin: 8px 0 12px 20px; padding: 0; }
  li { margin: 0 0 8px; }
  .warn { background: #fff7f4; border: 1px solid #ffd5cc; border-radius: 8px; padding: 10px; }
  .muted { color: #666; font-size: 12px; }
</style>
</head>
<body>
  <h1>Termos de Uso e Isenção de Responsabilidade</h1>
  <p class="warn"><strong>Leia com atenção:</strong> ao utilizar esta extensão, você declara estar ciente de que o uso ocorre por sua conta e risco.</p>

  <h2>1. Uso por conta e risco</h2>
  <p>Esta extensão automatiza ações dentro da Central do Vendedor da Shopee com base nas configurações definidas pelo próprio usuário. O usuário é o único responsável por revisar as respostas, configurar os limites, ativar ou desativar o modo teste e decidir quando iniciar a automação.</p>

  <h2>2. Extensão não oficial</h2>
  <p>Esta ferramenta não é oficial, não é afiliada, endossada, mantida ou autorizada pela Shopee. A Shopee pode alterar a página, regras, políticas, limites, mecanismos de segurança ou funcionamento interno a qualquer momento, o que pode afetar ou impedir o funcionamento da extensão.</p>

  <h2>3. Sem garantias</h2>
  <p>A extensão é fornecida “como está”, sem garantia de funcionamento contínuo, compatibilidade, disponibilidade, estabilidade, ausência de erros ou adequação a qualquer finalidade específica.</p>

  <h2>4. Isenção de responsabilidade</h2>
  <p>Eduardo Henrique Silva Teixeira, EduhCommerce e eventuais responsáveis pela distribuição desta extensão não se responsabilizam por uso indevido, respostas incorretas, perdas comerciais, falhas, instabilidades, alterações na plataforma, bloqueios, suspensões, limitações, penalidades, restrições ou quaisquer ações tomadas pela Shopee ou por terceiros em razão do uso da extensão.</p>

  <h2>5. Políticas da Shopee</h2>
  <p>O usuário deve verificar e respeitar os termos, políticas, regras de uso e boas práticas da Shopee. O uso desta extensão não garante conformidade com regras da plataforma.</p>

  <h2>6. Sem obrigação de suporte</h2>
  <p>Não há garantia de suporte, manutenção, atualização, correção de erros ou adaptação futura da extensão.</p>

  <p class="muted">Copyright © Eduardo Henrique Silva Teixeira. Instagram @eduhcommerce · Facebook @eduhcommerce · Site www.eduhcommerce.com.br · GitHub ehstbr/auto-responder-shopee-extension</p>
</body>
</html>`;

  const DEFAULT_TEMPLATES = {
    5: [
`Olá, tudo bem?

Antes de qualquer coisa, gostaríamos de agradecer pela confiança! Esperamos que sua compra atenda todas suas expectativas, mas em caso de dúvidas ou problemas, estamos à disposição!

Atenciosamente,
Equipe Lojão das Baterias.`,
`Olá! Muito obrigado pela sua avaliação e pela confiança em nossa loja.

Ficamos felizes em saber que deu tudo certo com sua compra. Sempre que precisar, conte com a Equipe Lojão das Baterias!`,
`Olá, tudo bem?

Agradecemos muito pela avaliação! É uma satisfação saber que sua experiência foi positiva. Qualquer dúvida, seguimos à disposição.

Atenciosamente,
Equipe Lojão das Baterias.`
    ],
    4: [
`Olá, tudo bem?

Muito obrigado pela avaliação e pela confiança em nossa loja! Ficamos felizes com sua compra e seguimos à disposição caso precise de qualquer suporte.

Atenciosamente,
Equipe Lojão das Baterias.`,
`Olá! Agradecemos pela sua avaliação.

Esperamos que o produto atenda bem sua necessidade. Se tiver qualquer dúvida ou sugestão, nossa equipe está à disposição para ajudar.`
    ],
    3: [
`Olá, tudo bem?

Agradecemos pela sua avaliação e pela confiança. Caso algo não tenha saído como esperado ou você precise de suporte, por favor entre em contato conosco para que possamos ajudar.

Atenciosamente,
Equipe Lojão das Baterias.`,
`Olá! Obrigado por avaliar sua compra.

Queremos entender se ficou alguma dúvida ou ponto a melhorar. Nossa equipe está à disposição para orientar e buscar a melhor solução possível.`
    ],
    2: [
`Olá, tudo bem?

Sentimos muito que sua experiência não tenha sido totalmente satisfatória. Por favor, entre em contato conosco pelo chat do pedido para entendermos o ocorrido e buscarmos a melhor solução.

Atenciosamente,
Equipe Lojão das Baterias.`,
`Olá! Agradecemos seu retorno e lamentamos qualquer transtorno.

Queremos entender melhor o que aconteceu para ajudar da forma correta. Chame nossa equipe pelo chat do pedido, por favor.`
    ],
    1: [
`Olá, tudo bem?

Sentimos muito por sua experiência. Queremos entender o ocorrido e ajudar a resolver da melhor forma possível. Por favor, entre em contato conosco pelo chat do pedido para analisarmos o caso.

Atenciosamente,
Equipe Lojão das Baterias.`,
`Olá! Lamentamos que sua compra não tenha atendido às expectativas.

Nossa equipe está à disposição para verificar o problema e orientar a melhor solução. Por favor, nos chame pelo chat do pedido.`
    ]
  };

  const DEFAULT_SETTINGS = {
    forceToReply: true,
    autoNextPage: false,
    dryRun: true,
    maxReplies: 10,
    maxPages: 0,
    minDelay: 1.4,
    maxDelay: 3.8,
    afterSubmitMin: 2.0,
    afterSubmitMax: 5.0,
    pageDelay: 1.5,
    processStars: { 1: true, 2: true, 3: true, 4: true, 5: true },
    templates: DEFAULT_TEMPLATES
  };

  let running = false;
  let paused = false;
  let stopRequested = false;
  let settingsCache = null;
  let progressTotal = null;
  let counters = { sent: 0, dryRuns: 0, skipped: 0, errors: 0, pages: 0 };
  let processedInRun = new Set();
  let dragState = null;
  let shopeeStarSyncTimer = null;
  let shopeeStarSyncing = false;
  let ratingSummaryCache = null;
  let floatingSummaryHideTimer = null;
  let ratingSummaryLoading = false;
  let ratingSummaryApiRefreshPromise = null;

  function isRatingPage() {
    return location.hostname === 'seller.shopee.com.br' && location.pathname.includes('/portal/settings/shop/rating');
  }
  function isSellerPage() {
    return location.hostname === 'seller.shopee.com.br';
  }

  function getRatingPageUrl() {
    return RATING_PAGE_URL;
  }

  function formatCompactCount(value) {
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0) return '?';
    if (number > 9999) return `${Math.floor(number / 1000)}k+`;
    return String(number);
  }

  function formatSummaryUpdatedAt(timestamp) {
    if (!timestamp) return 'Ainda não atualizado';
    const diffMs = Date.now() - Number(timestamp);
    if (!Number.isFinite(diffMs) || diffMs < 0) return 'Atualizado recentemente';
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Atualizado agora';
    if (diffMin < 60) return `Atualizado há ${diffMin} min`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `Atualizado há ${diffHours} h`;
    return `Atualizado em ${new Date(Number(timestamp)).toLocaleDateString()}`;
  }

  function isInsideExtension(el) {
    if (!el?.closest) return false;
    if (el.ownerDocument && el.ownerDocument !== document) return false;
    return Boolean(el.closest(`#${PANEL_ID}, #${FLOAT_ID}, #${FLOAT_SUMMARY_ID}`));
  }

  function getShopeePageText(root = document) {
    const body = root?.body || root?.documentElement;
    const clone = body?.cloneNode(true);
    if (!clone) return '';
    [PANEL_ID, FLOAT_ID, FLOAT_SUMMARY_ID].forEach(id => clone.querySelector(`#${id}`)?.remove());
    return textOf(clone);
  }

  function normalizeRatingSummaryCache(summary) {
    if (!summary || typeof summary !== 'object') return null;
    const stars = summary.stars || {};
    const normalizedStars = {};
    for (const star of [1, 2, 3, 4, 5]) {
      const value = Number(stars[star]);
      normalizedStars[star] = Number.isFinite(value) && value >= 0 ? value : 0;
    }
    const total = Number(summary.total);
    if (!Number.isFinite(total) || total < 0) return null;
    const starTotal = Object.values(normalizedStars).reduce((acc, value) => acc + value, 0);
    if (total === 0 && starTotal === 0 && summary.confirmedZero !== true) return null;
    return { ...summary, total, stars: normalizedStars };
  }

  function scheduleRatingSummaryRefresh() {
    if (!isRatingPage()) return;
    [700, 1800, 3500, 6500].forEach(delay => {
      setTimeout(() => {
        if (isRatingPage()) saveRatingSummaryFromPage();
      }, delay);
    });
  }

  function getSummaryFromDocument(root = document, source = 'rating-page') {
    const tabTotalRaw = getToReplyCount(root);
    const tabTotal = Number(tabTotalRaw);
    const tabTotalIsValid = Number.isFinite(tabTotal) && tabTotal >= 0;

    const stars = {};
    let validStarCount = 0;
    for (const star of [1, 2, 3, 4, 5]) {
      const value = Number(getStarCount(star, root));
      if (Number.isFinite(value) && value >= 0) {
        stars[star] = value;
        validStarCount += 1;
      } else {
        const cachedValue = Number(ratingSummaryCache?.stars?.[star]);
        stars[star] = Number.isFinite(cachedValue) && cachedValue >= 0 ? cachedValue : 0;
      }
    }

    const hasCompleteStars = validStarCount === 5;
    const starTotal = Object.values(stars).reduce((acc, value) => acc + value, 0);

    let total = null;
    if (hasCompleteStars && starTotal > 0) total = starTotal;
    else if (tabTotalIsValid && tabTotal > 0) total = tabTotal;
    else if (hasCompleteStars && tabTotalIsValid && tabTotal === 0 && starTotal === 0) total = 0;

    if (total === null) return null;

    return {
      total,
      stars,
      updatedAt: Date.now(),
      source,
      confirmedZero: total === 0 && hasCompleteStars && tabTotalIsValid && tabTotal === 0
    };
  }

  function getSummaryFromPage() {
    if (!isRatingPage()) return null;
    return getSummaryFromDocument(document, 'rating-page');
  }

  function getStoredShopeeSecurityParams() {
    const candidates = [];

    const addCandidate = (spcCds, spcCdsVer = '2', source = 'unknown') => {
      if (!spcCds) return;
      const cds = String(spcCds).trim();
      const ver = String(spcCdsVer || '2').trim() || '2';
      if (!/^[a-z0-9-]{12,}$/i.test(cds)) return;
      candidates.push({ spcCds: cds, spcCdsVer: ver, source });
    };

    try {
      const params = new URLSearchParams(location.search);
      addCandidate(params.get('SPC_CDS'), params.get('SPC_CDS_VER') || '2', 'location');
    } catch (_error) {}

    try {
      const cookies = Object.fromEntries(document.cookie.split(';').map(item => {
        const [key, ...rest] = item.trim().split('=');
        return [key, decodeURIComponent(rest.join('=') || '')];
      }).filter(([key]) => key));
      addCandidate(cookies.SPC_CDS, cookies.SPC_CDS_VER || '2', 'cookie');
    } catch (_error) {}

    try {
      const entries = performance.getEntriesByType('resource') || [];
      for (const entry of entries.slice().reverse()) {
        const name = String(entry?.name || '');
        if (!name.includes('SPC_CDS=')) continue;
        const parsed = new URL(name, location.origin);
        addCandidate(parsed.searchParams.get('SPC_CDS'), parsed.searchParams.get('SPC_CDS_VER') || '2', 'performance');
      }
    } catch (_error) {}

    const scanStorage = storage => {
      try {
        for (let i = 0; i < storage.length; i += 1) {
          const key = storage.key(i);
          const value = storage.getItem(key) || '';
          if (key === 'SPC_CDS') addCandidate(value, storage.getItem('SPC_CDS_VER') || '2', 'web-storage');
          const pairMatch = value.match(/SPC_CDS=([a-z0-9-]+).*?SPC_CDS_VER=([0-9]+)/i);
          if (pairMatch) addCandidate(pairMatch[1], pairMatch[2], 'web-storage');
          const jsonMatch = value.match(/"SPC_CDS"\s*:\s*"([^"]+)"/i);
          if (jsonMatch) {
            const verMatch = value.match(/"SPC_CDS_VER"\s*:\s*"?([0-9]+)"?/i);
            addCandidate(jsonMatch[1], verMatch?.[1] || '2', 'web-storage');
          }
        }
      } catch (_error) {}
    };
    scanStorage(window.localStorage);
    scanStorage(window.sessionStorage);

    try {
      const html = document.documentElement?.innerHTML || '';
      const pairMatch = html.match(/SPC_CDS=([a-z0-9-]+).*?SPC_CDS_VER=([0-9]+)/i);
      if (pairMatch) addCandidate(pairMatch[1], pairMatch[2], 'html');
      const jsonMatch = html.match(/"SPC_CDS"\s*:\s*"([^"]+)"/i);
      if (jsonMatch) {
        const verMatch = html.match(/"SPC_CDS_VER"\s*:\s*"?([0-9]+)"?/i);
        addCandidate(jsonMatch[1], verMatch?.[1] || '2', 'html');
      }
    } catch (_error) {}

    return candidates[0] || null;
  }

  function createRatingSummaryApiUrl(security = null) {
    const url = new URL(RATING_API_PATH, location.origin);
    if (security?.spcCds) {
      url.searchParams.set('SPC_CDS', security.spcCds);
      url.searchParams.set('SPC_CDS_VER', security.spcCdsVer || '2');
    }
    url.searchParams.set('rating_star', '5,4,3,2,1');
    url.searchParams.set('page_number', '1');
    url.searchParams.set('page_size', '20');
    url.searchParams.set('cursor', '0');
    url.searchParams.set('from_page_number', '1');
    url.searchParams.set('reply_status', '1');
    url.searchParams.set('language', 'pt-br');
    return url;
  }

  function buildRatingSummaryApiUrls() {
    const urls = [];
    const security = getStoredShopeeSecurityParams();
    if (security?.spcCds) urls.push(createRatingSummaryApiUrl(security));

    // Fallback sem SPC_CDS: em algumas sessões a própria página não expõe o token no DOM,
    // mas a API ainda responde usando os cookies/sessão já autenticados do Seller Center.
    urls.push(createRatingSummaryApiUrl(null));

    const seen = new Set();
    return urls.filter(url => {
      const key = url.toString();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function getSummaryFromApiData(data, source = 'rating-api') {
    const counts = data?.counts || {};
    const stars = {
      1: Number(counts.one_star_count),
      2: Number(counts.two_star_count),
      3: Number(counts.three_star_count),
      4: Number(counts.four_star_count),
      5: Number(counts.five_star_count)
    };

    for (const star of [1, 2, 3, 4, 5]) {
      if (!Number.isFinite(stars[star]) || stars[star] < 0) stars[star] = 0;
    }

    const toReplyCount = Number(counts.to_reply_count);
    const pageTotal = Number(data?.page_info?.total);
    const starTotal = Object.values(stars).reduce((acc, value) => acc + value, 0);
    let total = null;

    if (Number.isFinite(toReplyCount) && toReplyCount >= 0) total = toReplyCount;
    else if (Number.isFinite(pageTotal) && pageTotal >= 0) total = pageTotal;
    else if (starTotal > 0) total = starTotal;

    if (total === null) return null;

    return {
      total,
      stars,
      updatedAt: Date.now(),
      source,
      confirmedZero: total === 0
    };
  }

  async function refreshRatingSummaryFromApi({ force = false } = {}) {
    if (!isSellerPage()) return null;
    if (ratingSummaryApiRefreshPromise) return ratingSummaryApiRefreshPromise;

    const cacheAge = ratingSummaryCache?.updatedAt ? Date.now() - Number(ratingSummaryCache.updatedAt) : Infinity;
    if (!force && ratingSummaryCache && cacheAge < 3 * 60 * 1000) return ratingSummaryCache;

    const apiUrls = buildRatingSummaryApiUrls();
    if (!apiUrls.length) return null;

    ratingSummaryApiRefreshPromise = (async () => {
      ratingSummaryLoading = true;
      updateFloatingSummaryDisplay();
      let lastError = null;
      try {
        for (const apiUrl of apiUrls) {
          try {
            const response = await fetch(apiUrl.toString(), {
              method: 'GET',
              credentials: 'include',
              headers: {
                'accept': 'application/json, text/plain, */*',
                'x-requested-with': 'XMLHttpRequest'
              }
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const json = await response.json();
            if (Number(json?.code) !== 0 || !json?.data) throw new Error(json?.message || 'Resposta inesperada da API da Shopee.');
            const normalized = normalizeRatingSummaryCache(getSummaryFromApiData(json.data));
            if (!normalized) throw new Error('Não foi possível interpretar os contadores retornados pela API da Shopee.');
            ratingSummaryCache = normalized;
            updateFloatingSummaryDisplay();
            updateStarFilterCounts();
            updateRunEstimate();
            await safeStorageSet({ [RATING_SUMMARY_KEY]: normalized });
            return normalized;
          } catch (error) {
            lastError = error;
          }
        }
        if (lastError) console.debug('[Auto Responder Shopee] API de contagens indisponível.', String(lastError?.message || lastError));
        return null;
      } finally {
        ratingSummaryLoading = false;
        ratingSummaryApiRefreshPromise = null;
        updateFloatingSummaryDisplay();
      }
    })();

    return ratingSummaryApiRefreshPromise;
  }

  async function loadRatingSummaryCache() {
    const data = await safeStorageGet(RATING_SUMMARY_KEY, {});
    ratingSummaryCache = normalizeRatingSummaryCache(data?.[RATING_SUMMARY_KEY]);
    updateFloatingSummaryDisplay();
    updateStarFilterCounts();
    updateRunEstimate();
    if (isSellerPage()) refreshRatingSummaryFromApi({ force: !ratingSummaryCache });
    return ratingSummaryCache;
  }

  async function saveRatingSummaryFromPage() {
    const apiSummary = await refreshRatingSummaryFromApi({ force: true });
    if (apiSummary) return apiSummary;
    const summary = getSummaryFromPage();
    if (!summary) return null;
    const normalized = normalizeRatingSummaryCache(summary);
    if (!normalized) return null;
    ratingSummaryCache = normalized;
    updateFloatingSummaryDisplay();
    updateStarFilterCounts();
    updateRunEstimate();
    await safeStorageSet({ [RATING_SUMMARY_KEY]: normalized });
    return normalized;
  }

  function showFloatingSummary() {
    clearTimeout(floatingSummaryHideTimer);
    const summary = document.getElementById(FLOAT_SUMMARY_ID);
    if (summary) summary.classList.add('ldb-open');
  }

  function hideFloatingSummarySoon() {
    clearTimeout(floatingSummaryHideTimer);
    floatingSummaryHideTimer = setTimeout(() => {
      const summary = document.getElementById(FLOAT_SUMMARY_ID);
      if (summary) summary.classList.remove('ldb-open');
    }, 220);
  }

  function updateFloatingSummaryDisplay() {
    const btn = document.getElementById(FLOAT_ID);
    const summary = document.getElementById(FLOAT_SUMMARY_ID);
    if (!btn || !summary) return;

    const cache = ratingSummaryCache;
    const total = cache?.total;
    const badge = btn.querySelector('.ldb-floating-badge');
    if (badge) {
      const badgeText = ratingSummaryLoading && !cache ? '…' : formatCompactCount(total);
      badge.textContent = badgeText;
      badge.classList.toggle('ldb-unknown', !Number.isFinite(Number(total)));
      badge.classList.toggle('ldb-zero', Number(total) === 0);
    }

    const stars = cache?.stars || {};
    const updated = ratingSummaryLoading ? 'Atualizando contagem...' : formatSummaryUpdatedAt(cache?.updatedAt);
    const rows = [5, 4, 3, 2, 1].map(star => {
      const value = Number.isFinite(Number(stars[star])) ? Number(stars[star]) : (cache ? 0 : '—');
      return `<div class="ldb-floating-summary-row"><span>${'⭐'.repeat(star)} ${star} estrela${star > 1 ? 's' : ''}</span><strong>${value}</strong></div>`;
    }).join('');

    summary.innerHTML = `
      <div class="ldb-floating-summary-head">
        <strong>Avaliações para responder</strong>
        <span>${ratingSummaryLoading && !cache ? '…' : (Number.isFinite(Number(total)) ? formatCompactCount(total) : '?')}</span>
      </div>
      ${rows}
      <div class="ldb-floating-summary-foot">${updated}</div>
    `;
    updateRunEstimate();
  }

  function updateFloatingMode() {
    const btn = document.getElementById(FLOAT_ID);
    const summary = document.getElementById(FLOAT_SUMMARY_ID);
    if (!btn) return;
    const ratingPage = isRatingPage();
    btn.style.display = isSellerPage() ? 'block' : 'none';
    btn.classList.toggle('ldb-floating-rating-page', ratingPage);
    btn.classList.toggle('ldb-floating-global', !ratingPage);
    btn.title = ratingPage ? 'Abrir Auto Responder' : 'Abrir avaliações para responder';
    if (summary) summary.classList.toggle('ldb-floating-rating-page', ratingPage);
    updateFloatingSummaryDisplay();
    if (isSellerPage()) refreshRatingSummaryFromApi();
  }


  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function extensionContextIsAlive() {
    try {
      return Boolean(chrome?.runtime?.id && chrome?.storage?.local);
    } catch (_error) {
      return false;
    }
  }

  function isExtensionContextInvalidatedError(error) {
    return /extension context invalidated/i.test(String(error?.message || error || ''));
  }

  async function safeStorageGet(keys, fallback = {}) {
    try {
      if (!extensionContextIsAlive()) return fallback;
      return await chrome.storage.local.get(keys);
    } catch (error) {
      if (!isExtensionContextInvalidatedError(error)) {
        console.debug('[Auto Responder Shopee] Falha ao ler armazenamento local.', String(error?.message || error));
      }
      return fallback;
    }
  }

  async function safeStorageSet(values) {
    try {
      if (!extensionContextIsAlive()) return false;
      await chrome.storage.local.set(values);
      return true;
    } catch (error) {
      if (!isExtensionContextInvalidatedError(error)) {
        console.debug('[Auto Responder Shopee] Falha ao salvar armazenamento local.', String(error?.message || error));
      }
      return false;
    }
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  async function waitWhilePaused() {
    while (running && paused) {
      setStatus('⏸️ Pausado. Clique em ▶️ Continuar para retomar.');
      updateButtons();
      await wait(250);
    }
  }

  async function delaySeconds(min, max) {
    const total = Math.max(0, rand(min, max) * 1000);
    const start = Date.now();
    while (Date.now() - start < total) {
      if (!running || stopRequested) break;
      await waitWhilePaused();
      await wait(Math.min(250, total - (Date.now() - start)));
    }
  }

  function textOf(el) {
    return (el?.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function isVisible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
  }

  function isDisabled(el) {
    if (!el) return true;
    const cls = String(el.className || '');
    return Boolean(el.disabled) || cls.includes('disabled') || el.getAttribute('aria-disabled') === 'true';
  }

  function waitFor(predicate, timeoutMs = 12000, label = 'condição') {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      let done = false;
      let observer = null;
      const finish = value => {
        if (done) return;
        done = true;
        clearInterval(interval);
        if (observer) observer.disconnect();
        resolve(value);
      };
      const check = () => {
        if (done) return;
        try {
          const value = predicate();
          if (value) return finish(value);
        } catch (e) {}
        if (Date.now() - start > timeoutMs) {
          done = true;
          clearInterval(interval);
          if (observer) observer.disconnect();
          reject(new Error(`Tempo esgotado aguardando: ${label}`));
        }
      };
      const interval = setInterval(check, 180);
      observer = new MutationObserver(check);
      observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, characterData: true });
      check();
    });
  }

  function isShopeeListLoading() {
    const loadingSelectors = [
      '.eds-react-spin',
      '.eds-react-loading',
      '[class*="loading"]',
      '[class*="Loading"]',
      '[class*="spinner"]',
      '[class*="Spinner"]',
      '[class*="skeleton"]',
      '[class*="Skeleton"]',
      '[aria-busy="true"]'
    ];
    return Array.from(document.querySelectorAll(loadingSelectors.join(','))).some(el => {
      if (isInsideExtension(el)) return false;
      if (!isVisible(el)) return false;
      const rect = el.getBoundingClientRect();
      if (rect.width < 6 || rect.height < 6) return false;
      const txt = textOf(el).toLowerCase();
      if (txt && txt.length > 240) return false;
      return true;
    });
  }

  function hasShopeeRatingListSurface() {
    const text = textOf(document.body);
    return /Lista de Avalia[cç][aã]o de Loja/i.test(text)
      || /Avalia[cç][oõ]es dos Compradores/i.test(text)
      || /Voc[eê] n[aã]o recebeu avalia[cç][oõ]es/i.test(text)
      || Boolean(document.querySelector('[data-testid="pagination"]'))
      || getReplyButtons().length > 0;
  }

  async function waitForShopeeListReady(options = {}) {
    const timeoutMs = Number(options.timeoutMs ?? 14000);
    const stableMs = Number(options.stableMs ?? 750);
    const minWaitMs = Number(options.minWaitMs ?? 250);
    const label = options.label || 'lista da Shopee';
    const start = Date.now();
    let lastFingerprint = getListFingerprint();
    let stableSince = 0;

    await wait(Math.max(0, minWaitMs));

    while (Date.now() - start < timeoutMs) {
      await waitWhilePaused();
      const loading = isShopeeListLoading();
      const fingerprint = getListFingerprint();
      const surfaceReady = hasShopeeRatingListSurface();
      const changedOrStable = fingerprint === lastFingerprint;

      if (!loading && surfaceReady && changedOrStable) {
        if (!stableSince) stableSince = Date.now();
        if (Date.now() - stableSince >= stableMs) return true;
      } else {
        stableSince = 0;
        lastFingerprint = fingerprint;
      }

      await wait(180);
    }

    console.debug(`[Auto Responder Shopee] Tempo esgotado aguardando ${label}; seguindo com a página no estado atual.`);
    return false;
  }

  function log(message) {
    const line = `[${new Date().toLocaleTimeString()}] ${message}`;
    const box = document.querySelector(`#${PANEL_ID} .ldb-log`);
    if (box) {
      box.textContent += (box.textContent ? '\n' : '') + line;
      box.scrollTop = box.scrollHeight;
    }
    updateProgress();
    console.log('[LDB Shopee]', message);
  }

  function setStatus(message) {
    const el = document.querySelector(`#${PANEL_ID} .ldb-status`);
    if (el) el.textContent = message;
  }

  function setFloatingDisabled(disabled) {
    const btn = document.getElementById(FLOAT_ID);
    if (!btn) return;
    btn.disabled = Boolean(disabled);
    btn.classList.toggle('ldb-floating-disabled', Boolean(disabled));
    btn.title = disabled ? 'Feche o painel da extensão para abrir novamente.' : 'Abrir Auto Responder';
  }

  function setPageInteractionLocked(locked) {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    panel.classList.toggle('ldb-page-locked', Boolean(locked));
  }

  function nativeSetValue(element, value) {
    const prototype = Object.getPrototypeOf(element);
    const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
    if (descriptor?.set) descriptor.set.call(element, value);
    else element.value = value;
    element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: value }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  async function safeClick(el, reason = 'clique') {
    if (!el) throw new Error(`Elemento não encontrado para ${reason}`);
    await waitWhilePaused();
    el.scrollIntoView({ block: 'center', inline: 'center' });
    await wait(rand(180, 480));
    el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerType: 'mouse' }));
    el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true, pointerType: 'mouse' }));
    el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
    el.click();
  }

  function getReplyButtons() {
    return Array.from(document.querySelectorAll('[data-testid="reply-button"]'))
      .filter(btn => textOf(btn).includes('Responder'))
      .filter(btn => isVisible(btn) && !isDisabled(btn))
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
  }

  function getReviewCard(button) {
    let el = button;
    for (let i = 0; i < 12 && el; i += 1, el = el.parentElement) {
      const cls = el.classList;
      if (cls && cls.contains('rounded') && cls.contains('border-solid') && textOf(el).includes('ID do pedido')) {
        return el;
      }
    }
    return button.closest('div');
  }

  function getOrderId(card) {
    const idEl = Array.from(card.querySelectorAll('[id]'))
      .find(el => /^[0-9A-Z]{10,}$/.test((el.id || '').trim()));
    if (idEl) return idEl.id;
    const match = textOf(card).match(/ID do pedido\s*([0-9A-Z]+)/i);
    return match ? match[1] : 'sem-id';
  }

  function getRatingFromCard(card) {
    const rate = card.querySelector('.eds-react-rate');
    if (!rate) return 5;

    const starNodes = Array.from(rate.querySelectorAll('.eds-react-rate-star'));
    if (!starNodes.length) return 5;

    let score = 0;
    for (const star of starNodes) {
      const front = star.querySelector('.eds-react-rate-star__front');
      const style = front?.getAttribute('style') || '';
      const match = style.match(/width\s*:\s*([\d.]+)%/i);
      const width = match ? Number(match[1]) : (front && isVisible(front) ? 100 : 0);
      if (width >= 50) score += 1;
    }
    return Math.max(1, Math.min(5, Math.round(score || 5)));
  }

  function getVisibleTextarea() {
    tagShopeeReplyModalControls();
    return Array.from(document.querySelectorAll('textarea[name="comment"], textarea.eds-react-input__textarea'))
      .find(ta => ta.getAttribute('aria-hidden') !== 'true' && isVisible(ta));
  }

  function getSubmitButton() {
    tagShopeeReplyModalControls();
    return Array.from(document.querySelectorAll('[data-testid="reply-submit-button"], button[type="submit"]'))
      .find(btn => textOf(btn).includes('Enviar') && isVisible(btn));
  }

  function getCancelButton() {
    tagShopeeReplyModalControls();
    return Array.from(document.querySelectorAll('[data-testid="reply-cancel-button"], button'))
      .find(btn => textOf(btn).includes('Cancelar') && isVisible(btn));
  }

  function modalIsOpen() {
    return Boolean(getVisibleTextarea() || getSubmitButton() || document.querySelector('.eds-react-modal__content'));
  }


  function setShopeeReplyControlsHidden(hidden) {
    document.documentElement.classList.toggle(SHOPEE_LOCK_CLASS, Boolean(hidden));
    tagShopeeReplyModalControls();
  }

  function tagShopeeReplyModalControls() {
    if (!document.documentElement.classList.contains(SHOPEE_LOCK_CLASS)) return;

    const textarea = document.querySelector('textarea[name="comment"], textarea.eds-react-input__textarea');
    const modal =
      textarea?.closest('form')?.parentElement?.parentElement ||
      document.querySelector('.eds-react-modal') ||
      document.querySelector('.eds-react-modal__content') ||
      document.body;

    const candidates = Array.from(modal.querySelectorAll([
      '[data-testid="reply-submit-button"]',
      '[data-testid="reply-cancel-button"]',
      '.eds-react-modal__close',
      '[aria-label="close"]',
      '[aria-label="Close"]',
      '[aria-label="Fechar"]',
      'button',
      '[role="button"]',
      'span[class*="close"]',
      'i[class*="close"]',
      'svg[data-icon="close"]'
    ].join(',')));

    for (const el of candidates) {
      const text = textOf(el);
      const testId = el.getAttribute('data-testid') || '';
      const aria = el.getAttribute('aria-label') || el.getAttribute('title') || '';
      const className = String(el.className || '');
      const dataIcon = el.getAttribute('data-icon') || '';
      const normalizedText = text.replace(/\s+/g, '');
      const lower = `${aria} ${className} ${dataIcon}`.toLowerCase();
      const isReplyControl =
        testId === 'reply-submit-button' ||
        testId === 'reply-cancel-button' ||
        text === 'Enviar' ||
        text === 'Cancelar' ||
        normalizedText === '×' ||
        lower.includes('fechar') ||
        lower.includes('close');

      if (isReplyControl) {
        el.classList.add('ldb-shopee-reply-control-hidden');
        const clickableParent = el.closest('button,[role="button"],.eds-react-modal__close');
        if (clickableParent) clickableParent.classList.add('ldb-shopee-reply-control-hidden');
      }
    }
  }

  function normalizeTemplateList(value, fallback = []) {
    if (Array.isArray(value)) return value.map(v => String(v || '').trim()).filter(Boolean);
    if (typeof value === 'string') {
      return value
        .split(/\n\s*-{3,}\s*\n/g)
        .map(t => t.trim())
        .filter(Boolean);
    }
    return fallback.map(v => String(v || '').trim()).filter(Boolean);
  }

  function getTemplatesForStar(star, settings) {
    const saved = settings.templates?.[String(star)] ?? settings.templates?.[star];
    const list = normalizeTemplateList(saved);
    return list.length ? list : DEFAULT_TEMPLATES[star];
  }

  function chooseTemplate(star, settings) {
    const list = getTemplatesForStar(star, settings) || DEFAULT_TEMPLATES[5];
    const template = list[Math.floor(Math.random() * list.length)] || DEFAULT_TEMPLATES[5][0];
    return template.length > 500 ? template.slice(0, 500) : template;
  }

  async function ensureToReplyTab(settings) {
    if (!settings.forceToReply) return;
    const tab = document.querySelector('[data-testid="reply-status-tab-TO_REPLY"]');
    if (!tab) {
      log('Aba "Para Responder" não encontrada. Continuando na aba atual.');
      return;
    }
    if (String(tab.className || '').includes('active')) return;

    const before = getListFingerprint();
    log('Selecionando filtro "Para Responder"...');
    await safeClick(tab, 'selecionar Para Responder');
    await Promise.race([
      waitFor(() => String(document.querySelector('[data-testid="reply-status-tab-TO_REPLY"]')?.className || '').includes('active'), 10000, 'aba Para Responder ativa'),
      waitFor(() => getListFingerprint() !== before, 10000, 'lista atualizar')
    ]).catch(() => {});
    await waitForShopeeListReady({ label: 'aba Para Responder' });
  }

  function getSelectedStars(settings) {
    return [1, 2, 3, 4, 5].filter(star => settings.processStars[String(star)] || settings.processStars[star]);
  }

  function starListKey(starsList) {
    return (starsList || []).map(Number).filter(Number.isFinite).sort((a, b) => a - b).join(',');
  }

  function getTextAroundElement(el, maxDepth = 4) {
    let node = el;
    for (let depth = 0; node && depth <= maxDepth; depth += 1) {
      const txt = textOf(node).replace(/\s+/g, ' ').trim();
      if (txt && txt.length <= 160) return txt;
      node = node.parentElement;
    }
    return textOf(el).replace(/\s+/g, ' ').trim();
  }

  function isCheckedControl(el) {
    if (!el) return false;
    if (el.matches?.('input[type="checkbox"]')) return Boolean(el.checked);
    const aria = el.getAttribute?.('aria-checked');
    if (aria === 'true') return true;
    if (aria === 'false') return false;
    const cls = String(el.className || '').toLowerCase();
    return /checked|selected|active/.test(cls) && !/unchecked/.test(cls);
  }

  function getShopeeStarCheckbox(star) {
    const re = new RegExp(`(^|\\s)${star}\\s*estrela`, 'i');
    const inputs = Array.from(document.querySelectorAll('input[type="checkbox"]'))
      .filter(el => !isInsideExtension(el) && isVisible(el.closest('label') || el.parentElement || el));

    for (const input of inputs) {
      const label = input.closest('label') || input.closest('[class*="checkbox"]') || input.parentElement;
      const txt = getTextAroundElement(label || input, 5);
      if (re.test(txt)) return { control: input, clickTarget: label || input, text: txt };
    }

    const candidates = Array.from(document.querySelectorAll('[role="checkbox"], label, [class*="checkbox"]'))
      .filter(el => !isInsideExtension(el) && isVisible(el));

    for (const el of candidates) {
      const txt = getTextAroundElement(el, 3);
      if (!re.test(txt)) continue;
      const input = el.querySelector?.('input[type="checkbox"]');
      return { control: input || el, clickTarget: el, text: txt };
    }

    return null;
  }

  function getCurrentShopeeStarSelectionFromForm() {
    const result = [];
    for (const star of [1, 2, 3, 4, 5]) {
      const option = getShopeeStarCheckbox(star);
      if (option && isCheckedControl(option.control)) result.push(star);
    }
    return result;
  }

  function shopeeFormMatchesStars(settings) {
    const selected = getSelectedStars(settings);
    const desired = !selected.length || selected.length === 5 ? [1, 2, 3, 4, 5] : selected;
    const current = getCurrentShopeeStarSelectionFromForm();
    if (current.length === 0) return false;
    return starListKey(current) === starListKey(desired);
  }

  async function waitForShopeeFilterAutoUpdate(beforeFingerprint, beforeUrl) {
    const start = Date.now();
    while (Date.now() - start < 3500) {
      if (location.href !== beforeUrl || getListFingerprint() !== beforeFingerprint || isShopeeListLoading()) break;
      await wait(180);
    }
    await waitForShopeeListReady({ label: 'filtro de estrelas', stableMs: 850 });
  }

  async function applyShopeeRatingFiltersIfNeeded(settings, options = {}) {
    const selected = getSelectedStars(settings);
    const desired = !selected.length || selected.length === 5 ? [1, 2, 3, 4, 5] : selected;
    const desiredLabel = desired.length === 5 ? 'Todos' : `${desired.slice().sort((a, b) => b - a).join(', ')} estrela(s)`;

    const beforeSelection = getCurrentShopeeStarSelectionFromForm();
    if (beforeSelection.length && starListKey(beforeSelection) === starListKey(desired)) return false;

    log(`Ajustando filtro de estrelas na Shopee: ${desiredLabel}.`);
    if (options.statusMessage !== undefined) setStatus(options.statusMessage);
    else setStatus('🔎 Atualizando filtro de estrelas na Shopee...');

    let changed = false;
    for (const star of [5, 4, 3, 2, 1]) {
      const shouldBeChecked = desired.includes(star);
      const option = getShopeeStarCheckbox(star);
      if (!option) {
        log(`Checkbox de ${star} estrela(s) não encontrado na Shopee.`);
        continue;
      }

      const currentlyChecked = isCheckedControl(option.control);
      if (currentlyChecked === shouldBeChecked) continue;

      const beforeFingerprint = getListFingerprint();
      const beforeUrl = location.href;
      log(`${shouldBeChecked ? 'Marcando' : 'Desmarcando'} ${star} estrela(s)...`);
      await safeClick(option.clickTarget, `alterar filtro de ${star} estrela(s)`);
      changed = true;
      await waitForShopeeFilterAutoUpdate(beforeFingerprint, beforeUrl);
    }

    if (changed) {
      scheduleRatingSummaryRefresh();
      updateModalStarCheckboxesFromShopee();
      log('Filtro de estrelas ajustado pela interface da Shopee.');
      setStatus(options.doneStatus !== undefined ? options.doneStatus : (running ? '▶️ Executando...' : ''));
      await wait(300);
      return false;
    }

    if (!shopeeFormMatchesStars(settings)) {
      log('Não foi possível confirmar o ajuste do filtro de estrelas pela interface da Shopee. Continuando na página atual.');
    }
    setStatus(options.doneStatus !== undefined ? options.doneStatus : (running ? '▶️ Executando...' : ''));
    return false;
  }

  async function resumePendingRunIfAny() {
    // Mantido apenas para compatibilidade com versões antigas que gravavam execução pendente.
    try { sessionStorage.removeItem(PENDING_RUN_KEY); } catch (_error) {}
  }

  function getListFingerprint() {
    const container = document.querySelector('.ratingListWrap-0-2-8') || document.querySelector('[data-testid="pagination"]')?.parentElement || document.body;
    return textOf(container).slice(0, 1600);
  }

  function getNextPageButton() {
    const pagination = document.querySelector('[data-testid="pagination"]');
    if (!pagination) return null;
    return Array.from(pagination.querySelectorAll('button'))
      .find(btn => String(btn.className || '').includes('button-next') && !isDisabled(btn) && isVisible(btn));
  }

  async function goNextPage(settings = settingsCache) {
    const next = getNextPageButton();
    if (!next) return false;
    const before = getListFingerprint();
    log('Indo para a próxima página...');
    await safeClick(next, 'próxima página');
    await waitFor(() => getListFingerprint() !== before, 15000, 'próxima página carregar').catch(() => {});
    await waitForShopeeListReady({ label: 'próxima página' });
    const pageDelay = Math.max(0, Number(settings?.pageDelay ?? DEFAULT_SETTINGS.pageDelay) || 0);
    await wait(Math.round(pageDelay * 1000));
    return true;
  }

  function getShopeeResetButton() {
    const candidates = Array.from(document.querySelectorAll('button, [role="button"]'));
    return candidates.find(el => {
      if (el.closest(`#${PANEL_ID}`)) return false;
      if (!isVisible(el) || isDisabled(el)) return false;
      return /^(resetar|redefinir|limpar)$/i.test(textOf(el).trim()) || /resetar/i.test(textOf(el));
    }) || null;
  }

  async function resetShopeeFiltersAfterRun() {
    const resetButton = getShopeeResetButton();
    if (!resetButton) {
      log('Botão "Resetar" da Shopee não encontrado ou indisponível.');
      return false;
    }

    const beforeUrl = location.href;
    const beforeFingerprint = getListFingerprint();
    log('Acionando "Resetar" da Shopee para atualizar a lista...');
    setStatus('🔄 Atualizando lista da Shopee...');

    await safeClick(resetButton, 'resetar filtros da Shopee');
    await Promise.race([
      waitFor(() => location.href !== beforeUrl, 12000, 'URL atualizar após resetar'),
      waitFor(() => getListFingerprint() !== beforeFingerprint, 12000, 'lista atualizar após resetar')
    ]).catch(() => {});
    await waitForShopeeListReady({ label: 'reset da Shopee' });
    log('Reset da Shopee acionado.');
    scheduleRatingSummaryRefresh();
    return true;
  }

  function parseCountFromText(text) {
    const match = String(text || '').match(/\(([\d.]+)\)/);
    if (!match) return null;
    const number = Number(match[1].replace(/\D/g, ''));
    return Number.isFinite(number) ? number : null;
  }

  function getToReplyCount(root = document) {
    const directTab = root.querySelector('[data-testid="reply-status-tab-TO_REPLY"]');
    const directCount = parseCountFromText(textOf(directTab));
    if (Number.isFinite(Number(directCount))) return directCount;

    const candidates = Array.from(root.querySelectorAll('button, [role="button"], div, span'))
      .filter(el => !isInsideExtension(el) && isVisible(el));
    const found = candidates.find(el => /Para\s+Responder/i.test(textOf(el)) && /\([\d.]+\)/.test(textOf(el)));
    return parseCountFromText(textOf(found));
  }

  function getStarCount(star, root = document) {
    const pageText = getShopeePageText(root);
    const re = new RegExp(`${star}\\s*estrela(?:s)?\\s*\\(\\s*([\\d.]+)\\s*\\)`, 'i');
    const match = pageText.match(re);
    if (!match) return null;
    const number = Number(match[1].replace(/\D/g, ''));
    return Number.isFinite(number) ? number : null;
  }

  function computeProgressTarget(settings) {
    const selectedStars = [1, 2, 3, 4, 5].filter(star => settings.processStars[String(star)] || settings.processStars[star]);
    let total = null;

    if (selectedStars.length > 0 && selectedStars.length < 5) {
      const sum = selectedStars.reduce((acc, star) => acc + (getStarCount(star) || 0), 0);
      if (sum > 0) total = sum;
    }

    if (!total) total = getToReplyCount();
    if (settings.maxReplies > 0) total = total ? Math.min(total, settings.maxReplies) : settings.maxReplies;
    return total && total > 0 ? total : null;
  }

  function secondsPerReplyRange(settings = settingsCache) {
    const source = settings || DEFAULT_SETTINGS;
    const minDelay = Math.max(0.2, Number(source.minDelay ?? DEFAULT_SETTINGS.minDelay) || DEFAULT_SETTINGS.minDelay);
    const maxDelay = Math.max(minDelay, Number(source.maxDelay ?? DEFAULT_SETTINGS.maxDelay) || minDelay);
    const afterMin = Math.max(0.2, Number(source.afterSubmitMin ?? DEFAULT_SETTINGS.afterSubmitMin) || DEFAULT_SETTINGS.afterSubmitMin);
    const afterMax = Math.max(afterMin, Number(source.afterSubmitMax ?? DEFAULT_SETTINGS.afterSubmitMax) || afterMin);

    if (source.dryRun) {
      // No modo teste a extensão abre, preenche e cancela o modal, sem a espera pós-envio.
      return { min: (minDelay * 2) + 1.1, max: (maxDelay * 2) + 1.1 };
    }

    // No envio real há delay antes de abrir, preencher, enviar e a espera após o envio.
    return { min: (minDelay * 3) + afterMin, max: (maxDelay * 3) + afterMax };
  }

  function countRemainingPageTransitions(settings = settingsCache, done = 0, total = progressTotal) {
    if (!settings?.autoNextPage || !total || total <= 20) return 0;
    const currentPageIndex = Math.max(0, Math.floor(Math.max(0, done) / 20));
    const lastPageIndex = Math.max(0, Math.floor(Math.max(0, total - 1) / 20));
    return Math.max(0, lastPageIndex - currentPageIndex);
  }

  function formatEtaClock(secondsFromNow) {
    const date = new Date(Date.now() + (Math.max(0, Number(secondsFromNow) || 0) * 1000));
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function estimateRemainingRuntime(settings = settingsCache, done = 0, total = progressTotal) {
    if (!total || total <= 0) return null;
    const remaining = Math.max(0, total - done);
    const perReply = secondsPerReplyRange(settings);
    const pageDelay = Math.max(0, Number(settings?.pageDelay ?? DEFAULT_SETTINGS.pageDelay) || 0);
    const pageTransitions = countRemainingPageTransitions(settings, done, total);
    const min = remaining * perReply.min + (pageTransitions * pageDelay);
    const max = remaining * perReply.max + (pageTransitions * pageDelay);
    return { remaining, min, max };
  }

  function updateProgressEta() {
    const panel = document.getElementById(PANEL_ID);
    const eta = panel?.querySelector('[data-ldb="progress-eta"]');
    if (!eta) return;

    const done = counters.sent + counters.dryRuns;
    const estimate = estimateRemainingRuntime(settingsCache, done, progressTotal);

    if (!running && !panel?.classList.contains('ldb-finished')) {
      eta.textContent = '';
      eta.hidden = true;
      return;
    }

    eta.hidden = false;

    if (!estimate) {
      eta.textContent = '⏱️ Restante estimado: calculando...';
      return;
    }

    if (estimate.remaining <= 0) {
      eta.textContent = '⏱️ Restante estimado: concluído.';
      return;
    }

    const minLabel = formatDuration(estimate.min);
    const maxLabel = formatDuration(estimate.max);
    const minClock = formatEtaClock(estimate.min);
    const maxClock = formatEtaClock(estimate.max);
    const rangeLabel = minLabel === maxLabel ? minLabel : `entre ${minLabel} e ${maxLabel}`;
    const clockLabel = minClock === maxClock ? minClock : `${minClock}–${maxClock}`;
    eta.innerHTML = `<div class="ldb-progress-eta-row ldb-progress-eta-remaining"><span class="ldb-progress-eta-icon">⏱️</span><span><strong>Restante estimado:</strong> ${rangeLabel}</span></div><div class="ldb-progress-eta-row ldb-progress-eta-clock"><span class="ldb-progress-eta-icon">🎯</span><span><strong>Término aprox.:</strong> ${clockLabel}</span></div>`;
  }

  function updateProgress() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    const done = counters.sent + counters.dryRuns;
    const percent = progressTotal ? Math.min(100, Math.round((done / progressTotal) * 100)) : 0;
    const fill = panel.querySelector('.ldb-progress-fill');
    const label = panel.querySelector('.ldb-progress-label');
    const detail = panel.querySelector('.ldb-progress-detail');
    const title = panel.querySelector('.ldb-progress-title');
    if (fill) fill.style.width = `${percent}%`;
    if (title) title.textContent = settingsCache?.dryRun ? '📊 Progresso (modo teste)' : '📊 Progresso';
    if (label) {
      label.textContent = progressTotal
        ? `${done}/${progressTotal} (${percent}%)`
        : `${done} processada(s)`;
    }
    if (detail) {
      detail.textContent = `✅ Sucesso: ${done} · 🚫 Ignoradas: ${counters.skipped} · ⚠️ Erros: ${counters.errors} · 📄 Pág.: ${counters.pages || 1}`;
    }
    updateProgressEta();
  }

  async function processOne(button, settings) {
    await waitWhilePaused();
    const card = getReviewCard(button);
    const rating = getRatingFromCard(card);
    const orderId = getOrderId(card);

    if (!settings.processStars[String(rating)] && !settings.processStars[rating]) {
      counters.skipped += 1;
      log(`Ignorando pedido ${orderId}: ${rating} estrela(s) fora da seleção.`);
      return 'skipped';
    }

    const reply = chooseTemplate(rating, settings);
    log(`Abrindo resposta do pedido ${orderId} (${rating} estrela${rating > 1 ? 's' : ''})...`);
    setShopeeReplyControlsHidden(true);
    await delaySeconds(settings.minDelay, settings.maxDelay);
    if (!running) return 'stopped';
    await safeClick(button, 'abrir modal de resposta');

    const textarea = await waitFor(getVisibleTextarea, 15000, 'textarea do modal');
    await delaySeconds(settings.minDelay, settings.maxDelay);
    if (!running) return 'stopped';
    nativeSetValue(textarea, reply);
    textarea.focus();

    const submit = await waitFor(getSubmitButton, 10000, 'botão Enviar');
    await waitFor(() => !isDisabled(submit), 8000, 'botão Enviar habilitar').catch(() => {});

    if (settings.dryRun) {
      log(`Modo teste: resposta preenchida no pedido ${orderId}, mas NÃO enviada.`);
      await wait(1100);
      const cancel = getCancelButton();
      if (cancel) await safeClick(cancel, 'cancelar modo teste');
      await waitFor(() => !modalIsOpen(), 8000, 'modal fechar após cancelar').catch(() => {});
      setShopeeReplyControlsHidden(false);
      counters.dryRuns += 1;
      processedInRun.add(orderId);
      updateProgress();
      return 'dry-run';
    }

    log(`Enviando resposta do pedido ${orderId}...`);
    await delaySeconds(settings.minDelay, settings.maxDelay);
    if (!running) return 'stopped';
    await safeClick(submit, 'enviar resposta');
    await waitFor(() => !modalIsOpen(), 22000, 'modal fechar após envio');
    setShopeeReplyControlsHidden(false);
    counters.sent += 1;
    processedInRun.add(orderId);
    updateProgress();
    log(`Resposta enviada no pedido ${orderId}.`);
    await delaySeconds(settings.afterSubmitMin, settings.afterSubmitMax);
    return 'sent';
  }

  async function runAutomation(settings) {
    if (running) return;
    let navigatingForFilter = false;
    running = true;
    paused = false;
    stopRequested = false;
    setPageInteractionLocked(true);
    counters = { sent: 0, dryRuns: 0, skipped: 0, errors: 0, pages: 0 };
    processedInRun = new Set();
    updateButtons();
    setStatus('▶️ Executando...');
    log('Automação iniciada.');

    try {
      await ensureToReplyTab(settings);
      if (await applyShopeeRatingFiltersIfNeeded(settings)) {
        navigatingForFilter = true;
        return;
      }
      await waitForShopeeListReady({ label: 'início da automação' });
      progressTotal = computeProgressTarget(settings);
      updateProgress();
      let page = 1;

      while (running && !stopRequested) {
        await waitWhilePaused();
        if (stopRequested) break;
        counters.pages = page;
        updateProgress();
        let processedThisPage = 0;

        while (running && !stopRequested) {
          await waitWhilePaused();
          if (stopRequested) break;
          const completed = counters.sent + counters.dryRuns;
          if (settings.maxReplies > 0 && completed >= settings.maxReplies) {
            log(`Limite de ${settings.maxReplies} resposta(s) atingido.`);
            running = false;
            break;
          }

          await waitForShopeeListReady({ label: 'lista antes de procurar botões', timeoutMs: 8000, stableMs: 550 });
          const buttons = getReplyButtons();
          if (!buttons.length) {
            log('Não há mais botões "Responder" disponíveis nesta página.');
            break;
          }

          const next = buttons.find(btn => {
            const card = getReviewCard(btn);
            const orderId = getOrderId(card);
            if (processedInRun.has(orderId)) return false;
            const rating = getRatingFromCard(card);
            return settings.processStars[String(rating)] || settings.processStars[rating];
          });

          if (!next) {
            log('Nenhuma avaliação visível bate com as estrelas selecionadas.');
            break;
          }

          try {
            const result = await processOne(next, settings);
            if (result !== 'stopped') processedThisPage += 1;
          } catch (err) {
            counters.errors += 1;
            log(`Erro: ${err.message}`);
            const cancel = getCancelButton();
            if (cancel) await safeClick(cancel, 'fechar modal após erro').catch(() => {});
            setShopeeReplyControlsHidden(false);
            await wait(1000);
          }
        }

        if (!running || stopRequested) break;
        if (!settings.autoNextPage) break;
        const moved = await goNextPage(settings);
        if (!moved) {
          log('Botão de próxima página não disponível.');
          break;
        }
        page += 1;
        if (processedThisPage === 0) await wait(1000);
      }
    } finally {
      const stoppedByUser = stopRequested;
      setShopeeReplyControlsHidden(false);
      running = false;
      paused = false;
      stopRequested = false;
      updateProgress();
      const summary = `✅ Sucesso: ${counters.sent + counters.dryRuns}. 🚫 Ignoradas: ${counters.skipped}. ⚠️ Erros: ${counters.errors}.`;

      if (!navigatingForFilter) {
        await resetShopeeFiltersAfterRun();
      }

      if (stoppedByUser) {
        setStatus(`⏹️ Parado. ${summary}`);
        log('Automação parada após finalizar a tarefa em andamento.');
        markCompactFinished();
        setPageInteractionLocked(false);
      } else if (navigatingForFilter) {
        setStatus('🔎 Aplicando filtro de estrelas na Shopee...');
        setPageInteractionLocked(false);
      } else {
        setStatus(`✅ Finalizado. ${summary}`);
        log('Automação finalizada.');
        markCompactFinished();
        setPageInteractionLocked(false);
      }
      updateButtons();
    }
  }

  function readLimitInput(input) {
    const raw = String(input?.value ?? '').trim();
    if (raw === '' || raw === '0') return 0;
    return Math.max(1, Math.floor(Number(raw) || 1));
  }

  function parseDecimalInput(input, fallback = 0) {
    const raw = String(input?.value ?? '').trim().replace(',', '.');
    if (!raw) return fallback;
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  }

  function getSettingsFromForm() {
    const panel = document.getElementById(PANEL_ID);
    const get = name => panel.querySelector(`[name="${name}"]`);
    const templates = {};
    for (const star of [1, 2, 3, 4, 5]) {
      templates[star] = Array.from(panel.querySelectorAll(`.ldb-template-list[data-star="${star}"] .ldb-template-textarea`))
        .map(textarea => textarea.value.trim())
        .filter(Boolean);
      if (!templates[star].length) templates[star] = DEFAULT_TEMPLATES[star];
    }
    return {
      forceToReply: get('forceToReply').checked,
      autoNextPage: get('autoNextPage').checked,
      dryRun: get('dryRun').checked,
      maxReplies: readLimitInput(get('maxReplies')),
      maxPages: 0,
      minDelay: Math.max(0.2, parseDecimalInput(get('minDelay'), 1)),
      maxDelay: Math.max(0.3, parseDecimalInput(get('maxDelay'), 2)),
      afterSubmitMin: Math.max(0.2, parseDecimalInput(get('afterSubmitMin'), 2)),
      afterSubmitMax: Math.max(0.3, parseDecimalInput(get('afterSubmitMax'), 5)),
      pageDelay: Math.max(0, parseDecimalInput(get('pageDelay'), 1.5)),
      processStars: {
        1: get('star1').checked,
        2: get('star2').checked,
        3: get('star3').checked,
        4: get('star4').checked,
        5: get('star5').checked
      },
      templates
    };
  }

  async function saveSettings(settings) {
    settingsCache = settings;
    await safeStorageSet({ ldbShopeeReviewSettings: settings });
  }

  async function loadSettings() {
    if (settingsCache) return settingsCache;
    const data = await safeStorageGet('ldbShopeeReviewSettings');
    settingsCache = mergeSettings(DEFAULT_SETTINGS, data.ldbShopeeReviewSettings || {});
    return settingsCache;
  }

  function mergeSettings(base, saved) {
    const mergedTemplates = { ...base.templates };
    for (const star of [1, 2, 3, 4, 5]) {
      const list = normalizeTemplateList(saved.templates?.[String(star)] ?? saved.templates?.[star], base.templates[star]);
      mergedTemplates[star] = list.length ? list : base.templates[star];
    }
    return {
      ...base,
      ...saved,
      maxReplies: Number(saved.maxReplies ?? base.maxReplies),
      maxPages: Number(saved.maxPages ?? base.maxPages),
      pageDelay: Number(saved.pageDelay ?? base.pageDelay),
      processStars: { ...base.processStars, ...(saved.processStars || {}) },
      templates: mergedTemplates
    };
  }

  function limitDisplayValue(value) {
    return Number(value) === 0 ? '' : value;
  }

  function stars(star) {
    return '⭐'.repeat(star);
  }

  function starLabel(star) {
    return `${stars(star)} ${star} estrela${star > 1 ? 's' : ''}`;
  }

  function escapeHtmlAttr(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  async function getTermsState() {
    const data = await safeStorageGet([TERMS_ACCEPTED_KEY, TERMS_ACCEPTED_VERSION_KEY]);
    const accepted = data[TERMS_ACCEPTED_KEY] === true || Boolean(data[TERMS_ACCEPTED_VERSION_KEY]);
    return { accepted };
  }

  async function hasAcceptedTerms() {
    const state = await getTermsState();
    return state.accepted;
  }

  async function acceptTerms() {
    await safeStorageSet({
      [TERMS_ACCEPTED_KEY]: true,
      [TERMS_ACCEPTED_VERSION_KEY]: 'accepted'
    });
  }

  function setOnboardingStep(step) {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    const total = ONBOARDING_STEPS;
    const current = Math.max(0, Math.min(total - 1, Number(step) || 0));
    panel.dataset.onboardingStep = String(current);

    panel.querySelectorAll('[data-ldb-onboarding-slide]').forEach((slide, index) => {
      slide.hidden = index !== current;
      slide.classList.toggle('ldb-active', index === current);
    });

    panel.querySelectorAll('[data-ldb-onboarding-dot]').forEach((dot, index) => {
      dot.classList.toggle('ldb-active', index === current);
    });

    const count = panel.querySelector('[data-ldb="onboarding-count"]');
    if (count) count.textContent = `${current + 1}/${total}`;

    const prev = panel.querySelector('[data-ldb="onboarding-prev"]');
    const next = panel.querySelector('[data-ldb="onboarding-next"]');
    const accept = panel.querySelector('[data-ldb="terms-accept"]');
    if (prev) prev.disabled = current === 0;
    if (next) next.hidden = current === total - 1;
    if (accept) accept.hidden = current !== total - 1;
  }

  function updateTemplateCounter(textarea) {
    const item = textarea.closest('.ldb-template-item');
    const counter = item?.querySelector('.ldb-template-counter');
    if (!counter) return;
    const len = textarea.value.length;
    counter.textContent = `${len}/500`;
    counter.classList.toggle('ldb-over-limit', len > 500);
  }

  function createTemplateItem(star, value = '', index = 0) {
    const item = document.createElement('div');
    item.className = 'ldb-template-item';
    item.innerHTML = `
      <div class="ldb-template-item-head">
        <strong>Resposta ${index + 1}</strong>
        <div class="ldb-template-item-actions">
          <span class="ldb-template-counter">0/500</span>
          <button class="ldb-mini-danger" type="button" data-template-remove>🗑️ Remover</button>
        </div>
      </div>
      <textarea class="ldb-template-textarea" data-star="${star}" maxlength="4000"></textarea>
    `;
    const textarea = item.querySelector('textarea');
    textarea.value = value;
    textarea.addEventListener('input', () => updateTemplateCounter(textarea));
    updateTemplateCounter(textarea);
    return item;
  }

  function refreshTemplateNumbers(list) {
    Array.from(list.querySelectorAll('.ldb-template-item')).forEach((item, index) => {
      const title = item.querySelector('strong');
      if (title) title.textContent = `Resposta ${index + 1}`;
      const remove = item.querySelector('[data-template-remove]');
      if (remove) remove.disabled = list.querySelectorAll('.ldb-template-item').length <= 1;
    });
  }

  function renderTemplateEditors(settings) {
    const panel = document.getElementById(PANEL_ID);
    for (const star of [1, 2, 3, 4, 5]) {
      const list = panel.querySelector(`.ldb-template-list[data-star="${star}"]`);
      if (!list) continue;
      const templates = getTemplatesForStar(star, settings);
      list.innerHTML = '';
      templates.forEach((template, index) => list.appendChild(createTemplateItem(star, template, index)));
      if (!templates.length) list.appendChild(createTemplateItem(star, '', 0));
      refreshTemplateNumbers(list);
    }
  }

  function updateStarAllCheckbox(panel = document.getElementById(PANEL_ID)) {
    if (!panel) return;
    const all = panel.querySelector('[name="starAll"]');
    const stars = [1, 2, 3, 4, 5].map(star => panel.querySelector(`[name="star${star}"]`)).filter(Boolean);
    if (!all || !stars.length) return;
    const checkedCount = stars.filter(input => input.checked).length;
    all.checked = checkedCount === 5;
    all.indeterminate = checkedCount > 0 && checkedCount < 5;
  }

  function setModalStarCheckboxesFromList(list) {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return false;
    const normalized = (list || []).map(Number).filter(Number.isFinite);
    if (!normalized.length) return false;
    for (const star of [1, 2, 3, 4, 5]) {
      const input = panel.querySelector(`[name="star${star}"]`);
      if (input) input.checked = normalized.includes(star);
    }
    updateStarAllCheckbox(panel);
    return true;
  }

  function updateStarFilterCounts(panel = document.getElementById(PANEL_ID)) {
    if (!panel) return;
    const summary = ratingSummaryCache;
    const setCount = (key, value) => {
      const target = panel.querySelector(`[data-ldb-star-count="${key}"]`);
      if (!target) return;
      target.textContent = Number.isFinite(Number(value)) ? formatCompactCount(Number(value)) : '—';
      target.classList.toggle('ldb-muted-count', !Number.isFinite(Number(value)));
    };

    if (!summary?.stars) {
      setCount('all', null);
      for (const star of [1, 2, 3, 4, 5]) setCount(star, null);
      return;
    }

    setCount('all', summary.total);
    for (const star of [1, 2, 3, 4, 5]) setCount(star, summary.stars?.[star]);
  }

  function getModalSelectedStars(panel = document.getElementById(PANEL_ID)) {
    if (!panel) return [1, 2, 3, 4, 5];
    const selected = [1, 2, 3, 4, 5].filter(star => panel.querySelector(`[name="star${star}"]`)?.checked);
    return selected.length ? selected : [];
  }

  function formatDuration(seconds) {
    const value = Math.max(0, Math.round(Number(seconds) || 0));
    if (value < 60) return `${value} segundo${value === 1 ? '' : 's'}`;
    const minutes = Math.round(value / 60);
    if (minutes < 60) return `${minutes} minuto${minutes === 1 ? '' : 's'}`;
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    if (!rest) return `${hours} hora${hours === 1 ? '' : 's'}`;
    return `${hours}h ${String(rest).padStart(2, '0')}min`;
  }

  function updateRunEstimate() {
    const panel = document.getElementById(PANEL_ID);
    const box = panel?.querySelector('[data-ldb="run-estimate"]');
    if (!panel || !box) return;

    updateStarFilterCounts(panel);
    const selected = getModalSelectedStars(panel);
    if (!selected.length) {
      box.classList.add('ldb-warning');
      box.innerHTML = `
        <div class="ldb-run-summary-head">📌 Resumo da execução</div>
        <div class="ldb-run-summary-grid">
          <div class="ldb-run-summary-card ldb-run-summary-wide">
            <span>Filtro selecionado</span>
            <strong>Nenhuma estrela</strong>
            <small>Marque pelo menos uma estrela para iniciar.</small>
          </div>
        </div>
      `;
      return;
    }

    box.classList.remove('ldb-warning');
    const summary = ratingSummaryCache;
    if (!summary?.stars) {
      box.innerHTML = `
        <div class="ldb-run-summary-head">📌 Resumo da execução</div>
        <div class="ldb-run-summary-grid">
          <div class="ldb-run-summary-card ldb-run-summary-wide">
            <span>Contagem da Shopee</span>
            <strong>Aguardando atualização</strong>
            <small>A estimativa aparece assim que a extensão conseguir ler as quantidades.</small>
          </div>
        </div>
      `;
      return;
    }

    const totalByFilter = selected.reduce((acc, star) => acc + (Number(summary.stars?.[star]) || 0), 0);
    const maxReplies = readLimitInput(panel.querySelector('[name="maxReplies"]'));
    const autoNextPage = Boolean(panel.querySelector('[name="autoNextPage"]')?.checked);
    const firstPageLimit = autoNextPage ? totalByFilter : Math.min(totalByFilter, 20);
    const runLimit = maxReplies > 0 ? Math.min(maxReplies, firstPageLimit) : firstPageLimit;
    const limitText = maxReplies > 0 ? `Até ${formatCompactCount(runLimit)}` : (autoNextPage ? 'Sem limite' : `Até ${formatCompactCount(runLimit)}`);
    const limitNote = !autoNextPage && totalByFilter > 20
      ? 'Sem avançar páginas, a tarefa fica limitada às avaliações visíveis na primeira página.'
      : (maxReplies > 0 && totalByFilter > maxReplies
        ? 'A tarefa considera somente o limite programado.'
        : 'A tarefa cobre todo o filtro selecionado.');

    const timingSettings = {
      dryRun: Boolean(panel.querySelector('[name="dryRun"]')?.checked),
      autoNextPage,
      minDelay: parseDecimalInput(panel.querySelector('[name="minDelay"]'), DEFAULT_SETTINGS.minDelay),
      maxDelay: parseDecimalInput(panel.querySelector('[name="maxDelay"]'), DEFAULT_SETTINGS.maxDelay),
      afterSubmitMin: parseDecimalInput(panel.querySelector('[name="afterSubmitMin"]'), DEFAULT_SETTINGS.afterSubmitMin),
      afterSubmitMax: parseDecimalInput(panel.querySelector('[name="afterSubmitMax"]'), DEFAULT_SETTINGS.afterSubmitMax),
      pageDelay: parseDecimalInput(panel.querySelector('[name="pageDelay"]'), DEFAULT_SETTINGS.pageDelay)
    };
    const perReply = secondsPerReplyRange(timingSettings);
    const pageTransitions = countRemainingPageTransitions(timingSettings, 0, runLimit);
    const minSeconds = runLimit * perReply.min + (pageTransitions * timingSettings.pageDelay);
    const maxSeconds = runLimit * perReply.max + (pageTransitions * timingSettings.pageDelay);
    const selectedLabel = selected.length === 5 ? 'Todos os filtros de estrela' : selected.slice().sort((a, b) => b - a).map(star => `${star}⭐`).join(', ');
    const estimateText = runLimit > 0
      ? `Entre ${formatDuration(minSeconds)} e ${formatDuration(maxSeconds)}`
      : 'Sem respostas previstas';

    const filterTip = 'Filtro de estrelas selecionado no modal e espelhado no filtro da Shopee.';
    const countTip = 'Quantidade de avaliações para responder dentro do filtro de estrelas selecionado.';
    const limitTip = limitNote;
    const timeTip = 'Estimativa mínima e máxima calculada pelos intervalos configurados e pela quantidade programada para esta execução. Pode variar conforme carregamento da Shopee, pausas e resposta da página.';

    box.innerHTML = `
      <div class="ldb-run-summary-head">📌 Resumo da execução</div>
      <div class="ldb-run-summary-grid">
        <div class="ldb-run-summary-card ldb-has-tooltip" data-tooltip="${escapeHtmlAttr(filterTip)}" title="${escapeHtmlAttr(filterTip)}">
          <span>Filtro</span>
          <strong>${selectedLabel}</strong>
        </div>
        <div class="ldb-run-summary-card ldb-has-tooltip" data-tooltip="${escapeHtmlAttr(countTip)}" title="${escapeHtmlAttr(countTip)}">
          <span>Avaliações no filtro</span>
          <strong>${formatCompactCount(totalByFilter)}</strong>
        </div>
        <div class="ldb-run-summary-card ldb-has-tooltip" data-tooltip="${escapeHtmlAttr(limitTip)}" title="${escapeHtmlAttr(limitTip)}">
          <span>Respostas nesta tarefa</span>
          <strong>${runLimit > 0 ? formatCompactCount(runLimit) : '0'}</strong>
        </div>
        <div class="ldb-run-summary-card ldb-has-tooltip" data-tooltip="${escapeHtmlAttr(timeTip)}" title="${escapeHtmlAttr(timeTip)}">
          <span>Tempo estimado da tarefa</span>
          <strong>${estimateText}</strong>
        </div>
      </div>
    `;
  }

  function updateModalStarCheckboxesFromShopee() {
    if (!isRatingPage()) return false;
    const selected = getCurrentShopeeStarSelectionFromForm();
    return setModalStarCheckboxesFromList(selected);
  }

  function setStarInputsBusy(busy) {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    panel.classList.toggle('ldb-filter-syncing', Boolean(busy));
    panel.querySelectorAll('[name="starAll"],[name^="star"]').forEach(input => {
      if (input.name === 'start') return;
      input.disabled = Boolean(busy || running);
    });
  }

  function scheduleShopeeStarSyncFromModal() {
    if (!isRatingPage() || running) return;
    clearTimeout(shopeeStarSyncTimer);
    shopeeStarSyncTimer = window.setTimeout(async () => {
      if (shopeeStarSyncing || running) return;
      shopeeStarSyncing = true;
      setStarInputsBusy(true);
      try {
        const settings = getSettingsFromForm();
        await applyShopeeRatingFiltersIfNeeded(settings, {
          statusMessage: '',
          doneStatus: ''
        });
      } catch (error) {
        log(`Não foi possível espelhar o filtro de estrelas: ${error.message}`);
        setStatus('');
      } finally {
        shopeeStarSyncing = false;
        setStarInputsBusy(false);
        updateModalStarCheckboxesFromShopee();
        updateRunEstimate();
      }
    }, 250);
  }

  function fillForm(settings) {
    const panel = document.getElementById(PANEL_ID);
    const set = (name, value) => {
      const el = panel.querySelector(`[name="${name}"]`);
      if (!el) return;
      if (el.type === 'checkbox') el.checked = Boolean(value);
      else el.value = value;
    };
    set('forceToReply', settings.forceToReply);
    set('autoNextPage', settings.autoNextPage);
    set('dryRun', settings.dryRun);
    set('maxReplies', limitDisplayValue(settings.maxReplies));
    set('maxPages', limitDisplayValue(settings.maxPages));
    set('minDelay', settings.minDelay);
    set('maxDelay', settings.maxDelay);
    set('afterSubmitMin', settings.afterSubmitMin);
    set('afterSubmitMax', settings.afterSubmitMax);
    set('pageDelay', settings.pageDelay ?? DEFAULT_SETTINGS.pageDelay);
    for (const star of [1, 2, 3, 4, 5]) {
      set(`star${star}`, settings.processStars[String(star)] ?? settings.processStars[star]);
    }
    updateModalStarCheckboxesFromShopee();
    updateStarAllCheckbox(panel);
    updateStarFilterCounts(panel);
    renderTemplateEditors(settings);
    updateRunEstimate();
  }

  function updateButtons() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    const start = panel.querySelector('[data-ldb="start"]');
    const stop = panel.querySelector('[data-ldb="stop"]');
    const pause = panel.querySelector('[data-ldb="pause"]');
    const finishedCompact = panel.classList.contains('ldb-finished') && panel.classList.contains('ldb-compact') && !running;

    if (start) start.disabled = running;
    panel.querySelectorAll('[name="starAll"],[name^="star"]').forEach(input => {
      if (input.name !== 'start') input.disabled = running || shopeeStarSyncing;
    });

    if (pause) {
      pause.disabled = !running || stopRequested || finishedCompact;
      pause.textContent = paused ? '▶️ Continuar' : '⏸️ Pausar';
      pause.classList.toggle('ldb-paused', paused);
    }

    if (stop) {
      stop.classList.toggle('ldb-finished-close', finishedCompact);
      if (finishedCompact) {
        stop.disabled = false;
        stop.textContent = '✖️ Fechar';
      } else if (running) {
        stop.disabled = stopRequested;
        stop.textContent = stopRequested ? '⏳ Parando...' : '⏹️ Parar';
      } else {
        stop.disabled = true;
        stop.textContent = '⏹️ Parar';
      }
    }
  }

  function activateTemplateTab(star) {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    panel.querySelectorAll('[data-template-tab]').forEach(btn => {
      btn.classList.toggle('ldb-active', Number(btn.dataset.templateTab) === Number(star));
    });
    panel.querySelectorAll('[data-template-panel]').forEach(el => {
      el.classList.toggle('ldb-active', Number(el.dataset.templatePanel) === Number(star));
    });
  }

  function getCompactTargetRect() {
    const width = Math.min(440, window.innerWidth - 24);
    const height = Math.min(580, window.innerHeight - 24);
    return {
      left: Math.max(12, window.innerWidth - width - 22),
      top: Math.max(12, window.innerHeight - height - 22),
      width,
      height
    };
  }

  function nextFrame() {
    return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }

  function clearPanelTransitionClasses(panel) {
    panel.classList.remove(
      'ldb-opening', 'ldb-closing', 'ldb-animating',
      'ldb-content-hidden', 'ldb-content-revealing',
      'ldb-switching', 'ldb-switch-out', 'ldb-switch-in'
    );
  }

  function clearModalInlinePosition(modal) {
    if (!modal) return;
    modal.style.left = '';
    modal.style.top = '';
    modal.style.right = '';
    modal.style.bottom = '';
    modal.style.width = '';
    modal.style.height = '';
  }

  async function fadePanelOut(keepOpen = true) {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    clearPanelTransitionClasses(panel);
    panel.classList.add('ldb-open');
    panel.style.opacity = '1';
    await nextFrame();
    panel.style.opacity = '0';
    await wait(190);
    if (!keepOpen) panel.classList.remove('ldb-open');
  }

  async function fadePanelIn() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    clearPanelTransitionClasses(panel);
    panel.classList.add('ldb-open');
    panel.style.opacity = '0';
    await nextFrame();
    panel.style.opacity = '1';
    await wait(190);
    panel.style.opacity = '';
  }

  async function fadeSwitchToCompact() {
    const panel = document.getElementById(PANEL_ID);
    const modal = panel?.querySelector('.ldb-modal');
    if (!panel || !modal) return;

    await fadePanelOut(true);

    const to = getCompactTargetRect();
    panel.classList.remove('ldb-finished');
    panel.classList.add('ldb-compact');
    modal.style.left = `${to.left}px`;
    modal.style.top = `${to.top}px`;
    modal.style.right = 'auto';
    modal.style.bottom = 'auto';
    modal.style.width = `${to.width}px`;
    modal.style.height = 'auto';
    updateButtons();

    await fadePanelIn();
  }

  async function fadeSwitchToFull() {
    const panel = document.getElementById(PANEL_ID);
    const modal = panel?.querySelector('.ldb-modal');
    if (!panel || !modal) return;

    await fadePanelOut(true);

    panel.classList.remove('ldb-compact', 'ldb-finished', 'ldb-terms-mode');
    clearModalInlinePosition(modal);
    updateButtons();

    await fadePanelIn();
  }

  async function openPanel() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    if (!running) {
      counters = { sent: 0, dryRuns: 0, skipped: 0, errors: 0, pages: 0 };
      progressTotal = 0;
      setStatus('');
      updateProgress();
    }
    setFloatingDisabled(true);
    updateModalStarCheckboxesFromShopee();
    const modal = panel.querySelector('.ldb-modal');
    clearPanelTransitionClasses(panel);
    panel.classList.remove('ldb-compact', 'ldb-finished');
    clearModalInlinePosition(modal);
    if (!running) setStatus('');
    updateRunEstimate();
    await fadePanelIn();
  }

  async function closePanel() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    const modal = panel.querySelector('.ldb-modal');
    await fadePanelOut(false);
    panel.classList.remove('ldb-open', 'ldb-compact', 'ldb-finished', 'ldb-terms-mode', 'ldb-page-locked');
    clearPanelTransitionClasses(panel);
    clearModalInlinePosition(modal);
    panel.style.opacity = '';
    setFloatingDisabled(false);
  }

  async function showTermsGate() {
    const panel = document.getElementById(PANEL_ID);
    const modal = panel?.querySelector('.ldb-modal');
    if (!panel) return false;

    setFloatingDisabled(true);
    clearPanelTransitionClasses(panel);
    panel.classList.remove('ldb-compact', 'ldb-finished');
    panel.classList.add('ldb-terms-mode');
    clearModalInlinePosition(modal);
    setOnboardingStep(0);

    await fadePanelIn();

    return new Promise(resolve => {
      let settled = false;
      const acceptButton = panel.querySelector('[data-ldb="terms-accept"]');
      const declineButtons = Array.from(panel.querySelectorAll('[data-ldb="terms-decline"]'));
      const prevButton = panel.querySelector('[data-ldb="onboarding-prev"]');
      const nextButton = panel.querySelector('[data-ldb="onboarding-next"]');

      const cleanup = () => {
        acceptButton?.removeEventListener('click', onAccept);
        declineButtons.forEach(btn => btn.removeEventListener('click', onDecline));
        prevButton?.removeEventListener('click', onPrev);
        nextButton?.removeEventListener('click', onNext);
      };

      const finish = async accepted => {
        if (settled) return;
        settled = true;
        cleanup();

        if (accepted) {
          await acceptTerms();
          await fadePanelOut(true);
          panel.classList.remove('ldb-terms-mode');
          panel.style.opacity = '';
          resolve(true);
          return;
        }

        await fadePanelOut(false);
        panel.classList.remove('ldb-open', 'ldb-terms-mode', 'ldb-page-locked');
        panel.style.opacity = '';
        setFloatingDisabled(false);
        resolve(false);
      };

      const onAccept = () => finish(true);
      const onDecline = () => finish(false);
      const onPrev = () => {
        const current = Number(panel.dataset.onboardingStep || 0);
        setOnboardingStep(current - 1);
      };
      const onNext = () => {
        const current = Number(panel.dataset.onboardingStep || 0);
        setOnboardingStep(current + 1);
      };

      acceptButton?.addEventListener('click', onAccept);
      declineButtons.forEach(btn => btn.addEventListener('click', onDecline));
      prevButton?.addEventListener('click', onPrev);
      nextButton?.addEventListener('click', onNext);
    });
  }

  async function minimizePanelForRun() {
    await fadeSwitchToCompact();
  }

  async function expandPanel(animated = false) {
    const panel = document.getElementById(PANEL_ID);
    const modal = panel?.querySelector('.ldb-modal');
    if (!panel || !modal) return;

    panel.classList.add('ldb-open');
    panel.classList.remove('ldb-finished');

    if (animated && panel.classList.contains('ldb-compact')) {
      await fadeSwitchToFull();
      return;
    }

    panel.classList.remove('ldb-compact');
    clearPanelTransitionClasses(panel);
    clearModalInlinePosition(modal);
    panel.style.opacity = '';
    updateButtons();
  }

  function markCompactFinished() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    clearPanelTransitionClasses(panel);
    panel.classList.add('ldb-open', 'ldb-compact', 'ldb-finished');
    panel.style.opacity = '';
    updateButtons();
  }

  function startDragging(event) {
    const panel = document.getElementById(PANEL_ID);
    if (!panel?.classList.contains('ldb-compact')) return;
    const modal = panel.querySelector('.ldb-modal');
    if (!modal) return;
    const rect = modal.getBoundingClientRect();
    dragState = {
      modal,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top
    };
    modal.style.left = `${rect.left}px`;
    modal.style.top = `${rect.top}px`;
    modal.style.right = 'auto';
    modal.style.bottom = 'auto';
    document.addEventListener('mousemove', onDragging);
    document.addEventListener('mouseup', stopDragging);
    event.preventDefault();
  }

  function onDragging(event) {
    if (!dragState) return;
    const modal = dragState.modal;
    const width = modal.offsetWidth;
    const height = modal.offsetHeight;
    const left = Math.max(8, Math.min(window.innerWidth - width - 8, event.clientX - dragState.offsetX));
    const top = Math.max(8, Math.min(window.innerHeight - height - 8, event.clientY - dragState.offsetY));
    modal.style.left = `${left}px`;
    modal.style.top = `${top}px`;
  }

  function stopDragging() {
    dragState = null;
    document.removeEventListener('mousemove', onDragging);
    document.removeEventListener('mouseup', stopDragging);
  }

  function createUi() {
    if (document.getElementById(FLOAT_ID)) return;

    const floating = document.createElement('button');
    floating.id = FLOAT_ID;
    floating.type = 'button';
    floating.innerHTML = '<span class="ldb-floating-icon">🤖</span><span class="ldb-floating-text">Auto Responder</span><span class="ldb-floating-badge">?</span>';
    floating.style.display = isSellerPage() ? 'block' : 'none';
    document.documentElement.appendChild(floating);

    const floatingSummary = document.createElement('div');
    floatingSummary.id = FLOAT_SUMMARY_ID;
    floatingSummary.setAttribute('aria-hidden', 'true');
    document.documentElement.appendChild(floatingSummary);

    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="ldb-terms-modal" role="dialog" aria-modal="true" aria-label="Boas-vindas e termos de uso">
        <div class="ldb-about-head">
          <div>
            <div class="ldb-about-title">🚀 Bem-vindo ao Auto Responder Shopee</div>
            <div class="ldb-about-subtitle">Um onboarding rápido para começar a usar com segurança.</div>
          </div>
          <button class="ldb-about-close" type="button" data-ldb="terms-decline" title="Fechar">×</button>
        </div>
        <div class="ldb-onboarding-topbar">
          <div class="ldb-onboarding-dots">
            <span data-ldb-onboarding-dot class="ldb-active"></span>
            <span data-ldb-onboarding-dot></span>
            <span data-ldb-onboarding-dot></span>
            <span data-ldb-onboarding-dot></span>
          </div>
          <div class="ldb-onboarding-count" data-ldb="onboarding-count">1/4</div>
        </div>
        <div class="ldb-terms-body ldb-onboarding-body">
          <section class="ldb-onboarding-slide ldb-active" data-ldb-onboarding-slide>
            <div class="ldb-onboarding-hero">🤖🛍️</div>
            <h3>Boas-vindas ao seu assistente de respostas</h3>
            <p>Esta extensão foi criada para ajudar vendedores da Shopee a responder avaliações com mais agilidade, organização e padronização, sem perder o controle manual do processo.</p>
            <div class="ldb-onboarding-grid">
              <div class="ldb-onboarding-card"><div class="ldb-onboarding-card-icon">⭐</div><strong>Respostas por nota</strong><span>Cadastre respostas diferentes para 1, 2, 3, 4 e 5 estrelas.</span></div>
              <div class="ldb-onboarding-card"><div class="ldb-onboarding-card-icon">🎲</div><strong>Randomização</strong><span>Use várias respostas por nota para evitar repetição excessiva.</span></div>
              <div class="ldb-onboarding-card"><div class="ldb-onboarding-card-icon">🧪</div><strong>Modo teste</strong><span>Valide o fluxo antes de realmente enviar respostas aos compradores.</span></div>
            </div>
          </section>

          <section class="ldb-onboarding-slide" data-ldb-onboarding-slide hidden>
            <div class="ldb-onboarding-hero">🧭⚙️</div>
            <h3>Como usar da forma recomendada</h3>
            <p>Antes de automatizar, faça uma configuração inicial simples. Isso reduz erros e ajuda você a manter as respostas adequadas para cada situação.</p>
            <ol class="ldb-onboarding-steps">
              <li><strong>Selecione as estrelas</strong> que deseja processar e configure limites de páginas e respostas.</li>
              <li><strong>Cadastre suas respostas</strong> por nota e personalize o tom de acordo com a avaliação recebida.</li>
              <li><strong>Use primeiro o modo teste</strong> para confirmar que o modal abre, preenche e fecha como esperado.</li>
              <li><strong>Só depois ative o envio real</strong> e acompanhe o painel compacto de progresso.</li>
            </ol>
            <div class="ldb-onboarding-note">💡 Dica: para avaliações negativas, use respostas mais empáticas e orientadas à solução.</div>
          </section>

          <section class="ldb-onboarding-slide" data-ldb-onboarding-slide hidden>
            <div class="ldb-onboarding-hero">🔒📂</div>
            <h3>Privacidade, transparência e código aberto</h3>
            <p>A proposta desta ferramenta é ser útil e transparente. Por isso, a comunicação com o usuário e a forma de distribuição priorizam confiança.</p>
            <div class="ldb-onboarding-grid">
              <div class="ldb-onboarding-card"><div class="ldb-onboarding-card-icon">🔐</div><strong>Privacidade</strong><span>A extensão roda localmente no navegador e não foi projetada para coletar pedidos, clientes, vendas ou conteúdos da sua conta Shopee.</span></div>
              <div class="ldb-onboarding-card"><div class="ldb-onboarding-card-icon">🧩</div><strong>Código aberto</strong><span>O projeto ficará disponível no GitHub para auditoria, transparência e validação do funcionamento.</span></div>
              <div class="ldb-onboarding-card"><div class="ldb-onboarding-card-icon">🌐</div><strong>EduhCommerce</strong><span>Ferramenta gratuita criada para apoiar e divulgar conteúdos, soluções e serviços ligados ao e-commerce.</span></div>
            </div>
          </section>

          <section class="ldb-onboarding-slide" data-ldb-onboarding-slide hidden>
            <div class="ldb-onboarding-hero">📜✅</div>
            <h3>Termos de uso e aceite final</h3>
            <p>Leia os termos abaixo antes de utilizar a extensão. Ao clicar em <strong>“Aceito e começar a usar”</strong>, você confirma que leu e concorda com as condições de uso e com a isenção de responsabilidade.</p>
            <iframe class="ldb-terms-iframe" title="Termos de Uso" sandbox="" srcdoc="${escapeHtmlAttr(TERMS_HTML)}"></iframe>
          </section>
        </div>
        <div class="ldb-terms-actions">
          <button class="ldb-secondary" type="button" data-ldb="terms-decline">✖️ Fechar</button>
          <div class="ldb-terms-actions-right">
            <button class="ldb-secondary" type="button" data-ldb="onboarding-prev">⬅️ Voltar</button>
            <button class="ldb-primary" type="button" data-ldb="onboarding-next">➡️ Próximo</button>
            <button class="ldb-primary" type="button" data-ldb="terms-accept" hidden>✅ Aceito e começar a usar</button>
          </div>
        </div>
      </div>

      <div class="ldb-page-lock" aria-hidden="true"></div>

      <div class="ldb-modal" role="dialog" aria-modal="true">
        <div class="ldb-header" data-ldb="drag-handle">
          <div>
            <div class="ldb-title">🤖 Auto Responder Shopee</div>
            <div class="ldb-drag-hint">No modo compacto, arraste por aqui para mover.</div>
          </div>
          <button class="ldb-close" type="button" title="Fechar">×</button>
        </div>
        <div class="ldb-body">
          <p class="ldb-status"></p>

          <div class="ldb-progress-card">
            <div class="ldb-progress-top">
              <strong class="ldb-progress-title">📊 Progresso</strong>
              <span class="ldb-progress-label">0 processada(s)</span>
            </div>
            <div class="ldb-progress-bar"><div class="ldb-progress-fill"></div></div>
            <div class="ldb-progress-detail">✅ Sucesso: 0 · 🚫 Ignoradas: 0 · ⚠️ Erros: 0 · 📄 Pág.: 1</div>
            <div class="ldb-progress-eta" data-ldb="progress-eta">⏱️ Restante estimado: calculando...</div>
          </div>

          <div class="ldb-config-section">
            <div class="ldb-card" style="margin-bottom:14px;">
              <div class="ldb-star-row">
                <label class="ldb-star-filter ldb-star-filter-all"><input name="starAll" type="checkbox"> <span class="ldb-star-filter-text">Todos</span> <span class="ldb-star-count" data-ldb-star-count="all">—</span></label>
                <label class="ldb-star-filter"><input name="star5" type="checkbox"> <span class="ldb-star-stack" aria-label="5 estrelas"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></span> <span class="ldb-star-filter-text">5</span> <span class="ldb-star-count" data-ldb-star-count="5">—</span></label>
                <label class="ldb-star-filter"><input name="star4" type="checkbox"> <span class="ldb-star-stack" aria-label="4 estrelas"><span>★</span><span>★</span><span>★</span><span>★</span></span> <span class="ldb-star-filter-text">4</span> <span class="ldb-star-count" data-ldb-star-count="4">—</span></label>
                <label class="ldb-star-filter"><input name="star3" type="checkbox"> <span class="ldb-star-stack" aria-label="3 estrelas"><span>★</span><span>★</span><span>★</span></span> <span class="ldb-star-filter-text">3</span> <span class="ldb-star-count" data-ldb-star-count="3">—</span></label>
                <label class="ldb-star-filter"><input name="star2" type="checkbox"> <span class="ldb-star-stack" aria-label="2 estrelas"><span>★</span><span>★</span></span> <span class="ldb-star-filter-text">2</span> <span class="ldb-star-count" data-ldb-star-count="2">—</span></label>
                <label class="ldb-star-filter"><input name="star1" type="checkbox"> <span class="ldb-star-stack" aria-label="1 estrela"><span>★</span></span> <span class="ldb-star-filter-text">1</span> <span class="ldb-star-count" data-ldb-star-count="1">—</span></label>
              </div>
              <div class="ldb-run-estimate" data-ldb="run-estimate"></div>
              <div class="ldb-accordion ldb-settings-accordion ldb-collapsed" data-ldb="settings-accordion">
                <button class="ldb-accordion-head" type="button" data-ldb="toggle-settings" aria-expanded="false">
                  <span>⚙️ Limites, modo de envio e tempos</span>
                  <span class="ldb-accordion-icon">▾</span>
                </button>
                <div class="ldb-accordion-body ldb-settings-body">
                  <div class="ldb-options">
                    <label class="ldb-check"><input name="forceToReply" type="checkbox"> Forçar aba “Para Responder”</label>
                    <label class="ldb-check"><input name="autoNextPage" type="checkbox"> Avançar páginas automaticamente</label>
                    <label class="ldb-check"><input name="dryRun" type="checkbox"> Modo teste: preencher, não enviar</label>
                  </div>
                  <div class="ldb-grid">
                    <div>
                      <label>Máximo de respostas enviadas</label>
                      <input name="maxReplies" type="number" min="0" step="1" placeholder="0 ou vazio = ilimitado">
                      <div class="ldb-small">Use 0 ou deixe em branco para não limitar envios.</div>
                    </div>
                    <div>
                      <label>Delay mínimo entre ações (segundos)</label>
                      <input name="minDelay" type="number" min="0.2" step="0.1">
                    </div>
                    <div>
                      <label>Delay máximo entre ações (segundos)</label>
                      <input name="maxDelay" type="number" min="0.3" step="0.1">
                    </div>
                    <div>
                      <label>Espera mínima após enviar (segundos)</label>
                      <input name="afterSubmitMin" type="number" min="0.2" step="0.1">
                    </div>
                    <div>
                      <label>Espera máxima após enviar (segundos)</label>
                      <input name="afterSubmitMax" type="number" min="0.3" step="0.1">
                    </div>
                    <div>
                      <label>Espera após trocar página (segundos)</label>
                      <input name="pageDelay" type="number" min="0" step="0.1">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="ldb-template-section">
            <div class="ldb-card ldb-accordion ldb-collapsed" data-ldb="template-accordion">
              <button class="ldb-accordion-head" type="button" data-ldb="toggle-templates" aria-expanded="false">
                <span>💬 Configurar respostas por nota</span>
                <span class="ldb-accordion-icon">▾</span>
              </button>
              <div class="ldb-accordion-body">
                <div class="ldb-tabs" role="tablist">
                  ${[5,4,3,2,1].map(star => `
                    <button class="ldb-tab ${star === 5 ? 'ldb-active' : ''}" type="button" data-template-tab="${star}">${stars(star)} ${star}</button>
                  `).join('')}
                </div>
                <div class="ldb-tab-panels">
                  ${[5,4,3,2,1].map(star => `
                    <div class="ldb-tab-panel ${star === 5 ? 'ldb-active' : ''}" data-template-panel="${star}">
                      <div class="ldb-template-card-head">
                        <label>Respostas para ${starLabel(star)}</label>
                        <button class="ldb-mini-primary" type="button" data-template-add="${star}">➕ Adicionar resposta</button>
                      </div>
                      <div class="ldb-template-list" data-star="${star}"></div>
                      <div class="ldb-small">A extensão sorteia uma das respostas cadastradas para essa nota. A Shopee permite até 500 caracteres por resposta; acima disso, o texto será cortado no envio.</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <div class="ldb-card ldb-accordion ldb-log-card ldb-collapsed" data-ldb="log-accordion" style="margin-top:14px;">
            <button class="ldb-accordion-head" type="button" data-ldb="toggle-log" aria-expanded="false">
              <span>📋 Log</span>
              <span class="ldb-accordion-icon">▾</span>
            </button>
            <div class="ldb-accordion-body ldb-log-accordion-body">
              <div class="ldb-log"></div>
            </div>
          </div>
        </div>

        <div class="ldb-help-overlay" hidden>
          <div class="ldb-about-card" role="dialog" aria-modal="true" aria-label="Ajuda da extensão">
            <div class="ldb-about-head">
              <div>
                <div class="ldb-about-title">❓ Ajuda e instruções de uso</div>
                <div class="ldb-about-subtitle">Passo a passo básico para usar o Auto Responder Shopee.</div>
              </div>
              <button class="ldb-about-close" type="button" data-ldb="close-help" title="Fechar">×</button>
            </div>
            <div class="ldb-about-body ldb-help-body">
              <ol class="ldb-help-steps">
                <li><strong>Abra a página correta:</strong> acesse <em>Central do Vendedor &gt; Gerenciar Avaliações</em>.</li>
                <li><strong>Use primeiro em modo teste:</strong> mantenha marcado <em>Modo teste: preencher, não enviar</em> para validar se a extensão está encontrando as avaliações corretamente.</li>
                <li><strong>Defina os filtros:</strong> escolha as estrelas que deseja responder e, se quiser, marque <em>Forçar aba “Para Responder”</em>.</li>
                <li><strong>Ajuste o limite:</strong> em <em>Máximo de respostas</em>, use <strong>0</strong> ou deixe vazio para ilimitado.</li>
                <li><strong>Configure respostas:</strong> abra <em>💬 Configurar respostas por nota</em>, selecione a aba da nota e cadastre uma ou mais respostas. A extensão sorteia uma variação automaticamente.</li>
                <li><strong>Inicie com segurança:</strong> clique em <em>▶️ Iniciar</em>. O painel ficará compacto, mostrando progresso e controles.</li>
                <li><strong>Controle a execução:</strong> use <em>⏸️ Pausar</em>, <em>▶️ Continuar</em> ou <em>⏹️ Parar</em>. Ao parar, a extensão termina a ação atual antes de voltar ao painel completo.</li>
                <li><strong>Envio real:</strong> depois de validar no modo teste, desmarque o modo teste e rode com um limite pequeno antes de liberar volumes maiores.</li>
              </ol>
              <div class="ldb-help-warning">
                ⚠️ Esta extensão não é oficial da Shopee. Use por sua conta e risco e respeite as regras da plataforma.
              </div>
            </div>
          </div>
        </div>

        <div class="ldb-about-overlay" hidden>
          <div class="ldb-about-card" role="dialog" aria-modal="true" aria-label="Sobre a extensão">
            <div class="ldb-about-head">
              <div>
                <div class="ldb-about-title">🤖 Auto Responder Shopee</div>
                <div class="ldb-about-subtitle">Extensão para automação de respostas em avaliações da Shopee.</div>
              </div>
              <button class="ldb-about-close" type="button" data-ldb="close-about" title="Fechar">×</button>
            </div>
            <div class="ldb-about-body">
              <p><strong>Copyright © Eduardo Henrique Silva Teixeira.</strong></p>
              <div class="ldb-social-list">
                <a href="https://www.instagram.com/eduhcommerce" target="_blank" rel="noopener noreferrer" aria-label="Instagram @eduhcommerce" title="Instagram @eduhcommerce">
                  <span class="ldb-social-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="img"><defs><linearGradient id="ldb-ig-gradient" x1="0" y1="24" x2="24" y2="0"><stop offset="0" stop-color="#f58529"/><stop offset="0.35" stop-color="#dd2a7b"/><stop offset="0.7" stop-color="#8134af"/><stop offset="1" stop-color="#515bd4"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#ldb-ig-gradient)"/><rect x="7" y="7" width="10" height="10" rx="3" fill="none" stroke="#fff" stroke-width="1.7"/><circle cx="12" cy="12" r="2.6" fill="none" stroke="#fff" stroke-width="1.7"/><circle cx="16.2" cy="7.8" r="1.1" fill="#fff"/></svg></span>
                  <span>@eduhcommerce</span>
                </a>
                <a href="https://www.facebook.com/eduhcommerce" target="_blank" rel="noopener noreferrer" aria-label="Facebook @eduhcommerce" title="Facebook @eduhcommerce">
                  <span class="ldb-social-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="img"><circle cx="12" cy="12" r="10" fill="#1877f2"/><text x="12.25" y="18.2" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700" fill="#fff">f</text></svg></span>
                  <span>@eduhcommerce</span>
                </a>
                <a href="https://www.eduhcommerce.com.br" target="_blank" rel="noopener noreferrer" aria-label="Site www.eduhcommerce.com.br" title="Site www.eduhcommerce.com.br">
                  <span class="ldb-social-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="img"><circle cx="12" cy="12" r="10" fill="#1f8fff"/><path d="M3.5 12h17M12 2.5c2.8 2.7 4.2 5.9 4.2 9.5S14.8 18.8 12 21.5C9.2 18.8 7.8 15.6 7.8 12S9.2 5.2 12 2.5Z" fill="none" stroke="#fff" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.3 7.3h13.4M5.3 16.7h13.4" fill="none" stroke="#fff" stroke-width="1.35" stroke-linecap="round"/></svg></span>
                  <span>www.eduhcommerce.com.br</span>
                </a>
                <a href="https://github.com/ehstbr/auto-responder-shopee-extension" target="_blank" rel="noopener noreferrer" aria-label="GitHub auto-responder-shopee-extension" title="GitHub auto-responder-shopee-extension">
                  <span class="ldb-social-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="img"><circle cx="12" cy="12" r="10" fill="#24292f"/><path d="M12 5.2a6.8 6.8 0 0 0-2.15 13.25c.34.06.46-.15.46-.33v-1.18c-1.9.41-2.3-.81-2.3-.81-.31-.79-.76-1-.76-1-.62-.42.05-.42.05-.42.68.05 1.04.7 1.04.7.61 1.04 1.59.74 1.98.57.06-.44.24-.74.43-.91-1.52-.17-3.11-.76-3.11-3.38 0-.75.27-1.36.7-1.84-.07-.17-.3-.87.07-1.82 0 0 .57-.18 1.87.7.54-.15 1.12-.23 1.7-.23.58 0 1.16.08 1.7.23 1.3-.88 1.87-.7 1.87-.7.37.95.14 1.65.07 1.82.44.48.7 1.09.7 1.84 0 2.63-1.6 3.2-3.12 3.37.25.21.47.63.47 1.27v1.88c0 .18.12.39.47.33A6.8 6.8 0 0 0 12 5.2Z" fill="#fff"/></svg></span>
                  <span>GitHub</span>
                </a>
              </div>
              <div class="ldb-terms-preview ldb-accordion ldb-collapsed" data-ldb="about-terms-accordion">
                <button class="ldb-accordion-head ldb-about-accordion-head" type="button" data-ldb="toggle-about-terms" aria-expanded="false">
                  <span>📜 Termos de Uso</span>
                  <span class="ldb-accordion-icon">▾</span>
                </button>
                <div class="ldb-accordion-body ldb-about-terms-body">
                  <iframe class="ldb-terms-iframe ldb-terms-iframe-small" title="Termos de Uso" sandbox="" srcdoc="${escapeHtmlAttr(TERMS_HTML)}"></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="ldb-actions">
          <div class="ldb-actions-left">
            <button class="ldb-secondary" type="button" data-ldb="about">ℹ️ Sobre</button>
            <button class="ldb-secondary" type="button" data-ldb="help">❓ Ajuda</button>
          </div>
          <div class="ldb-actions-right">
            <button class="ldb-secondary" type="button" data-ldb="save">💾 Salvar parâmetros</button>
            <button class="ldb-secondary" type="button" data-ldb="pause" disabled>⏸️ Pausar</button>
            <button class="ldb-primary" type="button" data-ldb="start">▶️ Iniciar</button>
            <button class="ldb-danger" type="button" data-ldb="stop" disabled>⏹️ Parar</button>
          </div>
        </div>
      </div>`;
    document.documentElement.appendChild(panel);

    floating.addEventListener('mouseenter', () => {
      showFloatingSummary();
      refreshRatingSummaryFromApi({ force: !ratingSummaryCache });
    });
    floating.addEventListener('mouseleave', hideFloatingSummarySoon);
    floatingSummary.addEventListener('mouseenter', showFloatingSummary);
    floatingSummary.addEventListener('mouseleave', hideFloatingSummarySoon);

    floating.addEventListener('click', async () => {
      const panelOpen = panel.classList.contains('ldb-open');
      if (panelOpen || floating.disabled) return;

      if (!isRatingPage()) {
        window.location.assign(getRatingPageUrl());
        return;
      }

      const accepted = await hasAcceptedTerms();
      if (!accepted) {
        const acceptedNow = await showTermsGate();
        if (!acceptedNow) return;
      }

      fillForm(await loadSettings());
      updateButtons();
      updateProgress();
      await openPanel();
    });

    panel.querySelector('.ldb-close').addEventListener('click', async () => {
      if (!running) await closePanel();
    });

    panel.querySelector('[data-ldb="drag-handle"]').addEventListener('mousedown', startDragging);

    panel.addEventListener('click', async event => {
      if (event.target === panel && !running) {
        await closePanel();
        return;
      }

      const accordionToggle = event.target.closest('[data-ldb="toggle-templates"],[data-ldb="toggle-log"],[data-ldb="toggle-about-terms"],[data-ldb="toggle-settings"]');
      if (accordionToggle) {
        const accordion = accordionToggle.closest('.ldb-accordion');
        if (accordion) {
          const collapsed = accordion.classList.toggle('ldb-collapsed');
          accordionToggle.setAttribute('aria-expanded', String(!collapsed));
        }
        return;
      }

      const tabButton = event.target.closest('[data-template-tab]');
      if (tabButton) {
        activateTemplateTab(tabButton.dataset.templateTab);
        return;
      }

      const addButton = event.target.closest('[data-template-add]');
      if (addButton) {
        const star = Number(addButton.dataset.templateAdd);
        const list = panel.querySelector(`.ldb-template-list[data-star="${star}"]`);
        list.appendChild(createTemplateItem(star, '', list.querySelectorAll('.ldb-template-item').length));
        refreshTemplateNumbers(list);
        list.lastElementChild?.querySelector('textarea')?.focus();
        return;
      }

      const removeButton = event.target.closest('[data-template-remove]');
      if (removeButton) {
        const list = removeButton.closest('.ldb-template-list');
        const items = list?.querySelectorAll('.ldb-template-item');
        if (list && items && items.length > 1) {
          removeButton.closest('.ldb-template-item')?.remove();
          refreshTemplateNumbers(list);
        }
      }
    });

    const aboutOverlay = panel.querySelector('.ldb-about-overlay');
    const helpOverlay = panel.querySelector('.ldb-help-overlay');

    function openOverlay(overlay) {
      overlay.hidden = false;
      requestAnimationFrame(() => overlay.classList.add('ldb-about-open'));
    }

    function closeOverlay(overlay) {
      overlay.classList.remove('ldb-about-open');
      window.setTimeout(() => { overlay.hidden = true; }, 160);
    }

    panel.querySelector('[data-ldb="about"]').addEventListener('click', () => openOverlay(aboutOverlay));
    panel.querySelector('[data-ldb="help"]').addEventListener('click', () => openOverlay(helpOverlay));

    panel.querySelector('[data-ldb="close-about"]').addEventListener('click', () => closeOverlay(aboutOverlay));
    panel.querySelector('[data-ldb="close-help"]').addEventListener('click', () => closeOverlay(helpOverlay));

    aboutOverlay.addEventListener('click', event => {
      if (event.target === aboutOverlay) closeOverlay(aboutOverlay);
    });

    helpOverlay.addEventListener('click', event => {
      if (event.target === helpOverlay) closeOverlay(helpOverlay);
    });

    panel.querySelector('[data-ldb="save"]').addEventListener('click', async () => {
      const settings = getSettingsFromForm();
      await saveSettings(settings);
      setStatus('💾 Parâmetros salvos.');
      log('Parâmetros salvos.');
    });

    panel.querySelectorAll('[name="starAll"],[name^="star"]').forEach(input => {
      input.addEventListener('change', event => {
        if (shopeeStarSyncing || running) return;
        const target = event.currentTarget;
        if (target.name === 'starAll') {
          // O campo "Todos" funciona como atalho para marcar todas as estrelas.
          target.checked = true;
          panel.querySelectorAll('[name="star1"],[name="star2"],[name="star3"],[name="star4"],[name="star5"]').forEach(starInput => {
            starInput.checked = true;
          });
        }
        updateStarAllCheckbox(panel);
        updateRunEstimate();
        scheduleShopeeStarSyncFromModal();
      });
    });

    panel.querySelectorAll('[name="maxReplies"],[name="minDelay"],[name="maxDelay"],[name="afterSubmitMin"],[name="afterSubmitMax"],[name="pageDelay"],[name="dryRun"],[name="autoNextPage"],[name="forceToReply"]').forEach(input => {
      input.addEventListener('input', updateRunEstimate);
      input.addEventListener('keyup', updateRunEstimate);
      input.addEventListener('change', updateRunEstimate);
    });

    panel.querySelector('[data-ldb="pause"]').addEventListener('click', () => {
      if (!running) return;
      paused = !paused;
      setStatus(paused ? '⏸️ Pausado.' : '▶️ Executando...');
      log(paused ? 'Automação pausada.' : 'Automação retomada.');
      updateButtons();
    });

    panel.querySelector('[data-ldb="start"]').addEventListener('click', async () => {
      if (!isRatingPage()) {
        setStatus('⚠️ Abra a página de avaliações da Shopee antes de iniciar.');
        return;
      }
      const settings = getSettingsFromForm();
      if (settings.minDelay > settings.maxDelay) [settings.minDelay, settings.maxDelay] = [settings.maxDelay, settings.minDelay];
      if (settings.afterSubmitMin > settings.afterSubmitMax) [settings.afterSubmitMin, settings.afterSubmitMax] = [settings.afterSubmitMax, settings.afterSubmitMin];
      await saveSettings(settings);
      await minimizePanelForRun();
      runAutomation(settings);
    });

    panel.querySelector('[data-ldb="stop"]').addEventListener('click', async () => {
      if (!running && panel.classList.contains('ldb-finished')) {
        await closePanel();
        return;
      }
      if (!running) return;
      stopRequested = true;
      paused = false;
      setStatus('⏹️ Parando após a ação atual...');
      log('Parada solicitada. A tarefa atual será concluída antes de mostrar o resumo.');
      updateButtons();
    });
  }

  function watchUrl() {
    let last = location.href;
    setInterval(() => {
      if (location.href === last) return;
      last = location.href;
      updateFloatingMode();
      scheduleRatingSummaryRefresh();
    }, 800);
  }

  createUi();
  updateFloatingMode();
  loadRatingSummaryCache();
  scheduleRatingSummaryRefresh();
  setInterval(() => {
    if (isRatingPage()) saveRatingSummaryFromPage();
    else if (isSellerPage()) refreshRatingSummaryFromApi();
  }, 30000);
  watchUrl();
  resumePendingRunIfAny();
})();
