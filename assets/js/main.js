// みおり美容 LP - main.js

document.addEventListener('DOMContentLoaded', () => {
  // スムーススクロール処理
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.length <= 1) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // チャット機能の実装
  initChatWidget();
});

function initChatWidget() {
  const toggleBtn = document.getElementById('chat-toggle-btn');
  const chatWindow = document.getElementById('chat-window');
  const closeBtn = document.getElementById('chat-close-btn');
  const chatMessages = document.getElementById('chat-messages');
  const chatQuickReplies = document.getElementById('chat-quick-replies');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');

  if (!toggleBtn || !chatWindow || !closeBtn) return;

  let isInitialized = false;

  // クイック返信の選択肢データ
  const quickReplies = [
    { label: '📅 予約方法について', key: 'reservation' },
    { label: '💆‍♀️ メニューと料金', key: 'menu' },
    { label: '⏰ 営業時間・場所', key: 'access' },
    { label: '✨ 初めての方へ', key: 'first_time' }
  ];

  // 自動応答シナリオ
  const responses = {
    reservation: 'ご予約は、お電話 (052-000-0000) またはWEB予約フォーム・LINE・メールより承っております。<br><br><a href="#cta" style="color:#7fc6de;font-weight:bold;text-decoration:underline;">👉 ご予約セクションへ移動</a>',
    menu: '当店では以下の3つの主要メニューをご用意しております：<br>1. <b>全身脱毛</b>（最新技術でスピーディ＆痛みの少ない施術）<br>2. <b>アロママッサージ</b>（厳選オイルで極上の癒やし）<br>3. <b>ネイルサロン</b>（トレンドを反映した洗練デザイン）<br><br><a href="#menu" style="color:#7fc6de;font-weight:bold;text-decoration:underline;">👉 メニューの詳細を見る</a>',
    access: '【店舗情報】<br>住所: 名古屋市東区新栄町16-1 美織ビル2F<br>営業時間: 10:00〜20:00（年中無休／年末年始を除く）<br>電話: 052-939-3021<br><br><a href="#access" style="color:#7fc6de;font-weight:bold;text-decoration:underline;">👉 アクセス情報を見る</a>',
    first_time: 'みおり美容へようこそ！丁寧なカウンセリングと最新の美容技術で、お客様の「美しくなりたい」を全力でサポートいたします。ご不安な点がございましたらお気軽にご相談ください。'
  };

  // チャット開閉
  toggleBtn.addEventListener('click', () => {
    const isOpen = chatWindow.classList.contains('chat-widget__window--open');
    if (!isOpen) {
      openChat();
    } else {
      closeChat();
    }
  });

  closeBtn.addEventListener('click', closeChat);

  function openChat() {
    chatWindow.classList.add('chat-widget__window--open');
    chatWindow.setAttribute('aria-hidden', 'false');
    toggleBtn.style.display = 'none';

    if (!isInitialized) {
      addBotMessage('こんにちは！みおり美容のオンラインアシスタントです🌸<br>どのようなご相談でしょうか？以下から気になる内容を選ぶか、メッセージを入力してください。');
      renderQuickReplies();
      isInitialized = true;
    }
    chatInput.focus();
  }

  function closeChat() {
    chatWindow.classList.remove('chat-widget__window--open');
    chatWindow.setAttribute('aria-hidden', 'true');
    toggleBtn.style.display = 'flex';
  }

  // メッセージ追加処理
  function addBotMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg chat-msg--bot';

    const timeStr = getCurrentTime();
    msgDiv.innerHTML = `
      <div class="chat-msg__bubble">${text}</div>
      <span class="chat-msg__time">${timeStr}</span>
    `;
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
  }

  function addUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg chat-msg--user';

    const timeStr = getCurrentTime();
    msgDiv.innerHTML = `
      <div class="chat-msg__bubble">${text}</div>
      <span class="chat-msg__time">${timeStr}</span>
    `;
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
  }

  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // クイック返信ボタン描画
  function renderQuickReplies() {
    chatQuickReplies.innerHTML = '';
    quickReplies.forEach((item) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chat-quick-btn';
      btn.textContent = item.label;
      btn.addEventListener('click', () => {
        addUserMessage(item.label);
        setTimeout(() => {
          addBotMessage(responses[item.key]);
        }, 400);
      });
      chatQuickReplies.appendChild(btn);
    });
  }

  // フォーム送信（自由入力）
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userText = chatInput.value.trim();
    if (!userText) return;

    addUserMessage(userText);
    chatInput.value = '';

    setTimeout(() => {
      handleFreeTextInput(userText);
    }, 500);
  });

  // 自由入力キーワードに応じた自動応答
  function handleFreeTextInput(text) {
    const lower = text.toLowerCase();

    if (lower.includes('予約') || lower.includes('よやく') || lower.includes('取') || lower.includes('tel')) {
      addBotMessage(responses.reservation);
    } else if (lower.includes('メニュー') || lower.includes('料金') || lower.includes('脱毛') || lower.includes('アロマ') || lower.includes('ネイル') || lower.includes('いくら')) {
      addBotMessage(responses.menu);
    } else if (lower.includes('時間') || lower.includes('場所') || lower.includes('アクセス') || lower.includes('住所') || lower.includes('営業') || lower.includes('どこ')) {
      addBotMessage(responses.access);
    } else {
      addBotMessage('お問い合わせありがとうございます！詳細なご相談やカスタムプランにつきましては、お電話またはLINE/WEBフォームよりお気軽にご連絡ください。<br><br><a href="#cta" style="color:#7fc6de;font-weight:bold;text-decoration:underline;">👉 お問い合わせ・ご予約はこちら</a>');
    }
  }
}
