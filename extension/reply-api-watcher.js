(() => {
  if (window.__LDB_REPLY_API_WATCHER__) return;
  window.__LDB_REPLY_API_WATCHER__ = true;

  const ENDPOINT = '/api/v3/settings/reply_shop_rating/';
  const EVENT_NAME = 'ldb:reply-api-result';

  function emit(payload) {
    try {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, {
        detail: JSON.stringify(payload)
      }));
    } catch (error) {}
  }

  function getUrl(input) {
    try {
      if (typeof input === 'string') return input;
      if (input && typeof input.url === 'string') return input.url;
      return '';
    } catch (error) {
      return '';
    }
  }

  function matchesReplyEndpoint(input) {
    return getUrl(input).includes(ENDPOINT);
  }

  const originalFetch = window.fetch;

  if (typeof originalFetch === 'function') {
    window.fetch = async function(...args) {
      const response = await originalFetch.apply(this, args);

      try {
        if (matchesReplyEndpoint(args[0])) {
          response.clone().text().then(text => {
            let body = null;

            try {
              body = JSON.parse(text);
            } catch (error) {}

            emit({
              transport: 'fetch',
              ok: response.ok,
              status: response.status,
              body,
              text: body ? null : text,
              at: Date.now()
            });
          }).catch(() => {});
        }
      } catch (error) {}

      return response;
    };
  }

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    try {
      this.__ldbReplyApiRequest = typeof url === 'string' && url.includes(ENDPOINT);
    } catch (error) {
      this.__ldbReplyApiRequest = false;
    }

    return originalOpen.call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.send = function(...args) {
    if (this.__ldbReplyApiRequest) {
      this.addEventListener('load', () => {
        let body = null;
        const text = this.responseText || '';

        try {
          body = JSON.parse(text);
        } catch (error) {}

        emit({
          transport: 'xhr',
          ok: this.status >= 200 && this.status < 300,
          status: this.status,
          body,
          text: body ? null : text,
          at: Date.now()
        });
      });

      this.addEventListener('error', () => {
        emit({
          transport: 'xhr',
          ok: false,
          status: this.status || 0,
          body: null,
          text: '',
          at: Date.now()
        });
      });
    }

    return originalSend.apply(this, args);
  };
})();
