/* Qi-inspired AI UI Kit v1.0.0 | no dependencies; progressive enhancement */
(function (global) {
  'use strict';
  const doc = global.document;
  if (!doc) return;
  const $ = (selector, root = doc) => root.querySelector(selector);
  const $$ = (selector, root = doc) => [...root.querySelectorAll(selector)];
  let modalState = null;

  function setTab(tab, focus = false) {
    const list = tab.closest('[role="tablist"]');
    if (!list) return;
    const tabs = $$('[role="tab"]', list);
    tabs.forEach(t => {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.setAttribute('tabindex', selected ? '0' : '-1');
      const panelId = t.getAttribute('aria-controls');
      const panel = panelId && doc.getElementById(panelId);
      if (panel) panel.hidden = !selected;
    });
    if (focus) tab.focus();
  }

  function setAccordion(trigger) {
    const panelId = trigger.getAttribute('aria-controls');
    const panel = panelId && doc.getElementById(panelId);
    if (!panel) return;
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!expanded));
    panel.hidden = expanded;
  }

  function openModal(modalOrId) {
    const modalRoot = typeof modalOrId === 'string' ? doc.getElementById(modalOrId.replace(/^#/, '')) : modalOrId;
    if (!modalRoot || !modalRoot.classList.contains('qi-modal-backdrop')) return false;
    if (modalState) closeModal();
    const returnFocus = doc.activeElement;
    modalRoot.hidden = false;
    doc.body.style.overflow = 'hidden';
    const focusables = $$('button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])', modalRoot);
    (focusables[0] || modalRoot).focus();
    modalState = { root:modalRoot, returnFocus };
    return true;
  }

  function closeModal() {
    if (!modalState) return;
    modalState.root.hidden = true;
    doc.body.style.overflow = '';
    const focus = modalState.returnFocus;
    modalState = null;
    if (focus && typeof focus.focus === 'function') focus.focus();
  }

  function toast(message, type = 'success', duration = 4500) {
    const region = $('#qi-toast-region') || (() => {
      const node = doc.createElement('div');
      node.id = 'qi-toast-region'; node.className = 'qi-toast-region';
      node.setAttribute('aria-live', 'polite'); node.setAttribute('aria-atomic', 'false');
      doc.body.appendChild(node); return node;
    })();
    const el = doc.createElement('div');
    el.className = 'qi-toast'; el.dataset.type = type;
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
    const messageNode = doc.createElement('span');
    messageNode.textContent = String(message); messageNode.style.flex = '1';
    const close = doc.createElement('button');
    close.type = 'button'; close.className = 'qi-alert-dismiss';
    close.setAttribute('aria-label', 'Dismiss notification'); close.textContent = '×';
    close.addEventListener('click', () => el.remove());
    el.append(messageNode, close); region.appendChild(el);
    if (duration > 0) global.setTimeout(() => el.remove(), duration);
    return el;
  }

  function setTheme(theme) {
    const root = doc.documentElement;
    if (theme === 'dark') root.setAttribute('data-qi-theme', 'dark');
    else root.removeAttribute('data-qi-theme');
    $$('[data-qi-theme-toggle]').forEach(button => {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    });
  }

  function init(root = doc) {
    $$('[role="tablist"]', root).forEach(list => {
      const tabs = $$('[role="tab"]', list);
      if (tabs.length && !tabs.some(tab => tab.getAttribute('aria-selected') === 'true')) setTab(tabs[0]);
      else tabs.forEach(tab => {
        const panel = doc.getElementById(tab.getAttribute('aria-controls'));
        if (panel) panel.hidden = tab.getAttribute('aria-selected') !== 'true';
        tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1;
      });
    });
    $$('.qi-accordion-trigger', root).forEach(trigger => {
      const panel = doc.getElementById(trigger.getAttribute('aria-controls'));
      if (panel) panel.hidden = trigger.getAttribute('aria-expanded') !== 'true';
    });
    $$('.qi-modal-backdrop', root).forEach(dialog => {
      dialog.hidden = true;
      dialog.tabIndex = -1;
    });
  }

  doc.addEventListener('click', event => {
    const close = event.target.closest('[data-qi-dismiss]');
    if (close) {
      const what = close.getAttribute('data-qi-dismiss');
      if (what === 'modal') closeModal();
      else if (what === 'alert') close.closest('.qi-alert')?.remove();
      return;
    }
    const trigger = event.target.closest('[data-qi-modal-open]');
    if (trigger) { event.preventDefault(); openModal(trigger.getAttribute('data-qi-modal-open')); return; }
    if (event.target.classList.contains('qi-modal-backdrop')) { closeModal(); return; }
    const tab = event.target.closest('[role="tab"]');
    if (tab) { setTab(tab); return; }
    const accordion = event.target.closest('.qi-accordion-trigger');
    if (accordion) { setAccordion(accordion); return; }
    const chip = event.target.closest('.qi-chip[aria-pressed]');
    if (chip) { chip.setAttribute('aria-pressed', String(chip.getAttribute('aria-pressed') !== 'true')); return; }
    const nav = event.target.closest('[data-qi-nav-toggle]');
    if (nav) {
      const sidebar = doc.getElementById(nav.getAttribute('aria-controls'));
      if (sidebar) {
        const opened = sidebar.dataset.open !== 'true';
        sidebar.dataset.open = String(opened);
        nav.setAttribute('aria-expanded', String(opened));
      }
      return;
    }
    const theme = event.target.closest('[data-qi-theme-toggle]');
    if (theme) { setTheme(doc.documentElement.getAttribute('data-qi-theme') === 'dark' ? 'light' : 'dark'); return; }
    const msg = event.target.closest('[data-qi-toast]');
    if (msg) toast(msg.getAttribute('data-qi-toast'), msg.getAttribute('data-qi-toast-type') || 'success');
  });

  doc.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modalState) { closeModal(); return; }
    if (modalState && event.key === 'Tab') {
      const items = $$('button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])', modalState.root).filter(item => item.getClientRects().length);
      if (!items.length) { event.preventDefault(); return; }
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && doc.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && doc.activeElement === last) { event.preventDefault(); first.focus(); }
      return;
    }
    const tab = event.target.closest('[role="tab"]');
    if (tab && ['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
      const tabs = $$('[role="tab"]', tab.closest('[role="tablist"]'));
      const index = tabs.indexOf(tab);
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      event.preventDefault(); setTab(tabs[next], true);
    }
  });

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', () => init(), {once:true});
  else init();
  global.QiUI = Object.freeze({ init, setTab, openModal, closeModal, toast, setTheme, version:'1.0.0' });
})(window);
