// feed.js — Carga y renderiza publicaciones
import { db } from './firebase-config.js';
import {
  collection, query, orderBy, limit, onSnapshot,
  doc, updateDoc, arrayUnion, arrayRemove, getDoc, where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { currentUser, currentBusiness } from './auth.js';

const feedContainer = document.getElementById('feedContainer');
const featuredList = document.getElementById('featuredList');
const categoryList = document.getElementById('categoryList');

let activeCategory = 'all';
let unsubscribeFeed = null;

// ---- Inicializar feed ----
function initFeed(category = 'all') {
  if (unsubscribeFeed) unsubscribeFeed();

  let q;
  if (category === 'all') {
    q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(30));
  } else {
    q = query(
      collection(db, 'posts'),
      where('businessCategory', '==', category),
      orderBy('createdAt', 'desc'),
      limit(30)
    );
  }

  unsubscribeFeed = onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      feedContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-store-slash"></i>
          <h3>Sin publicaciones</h3>
          <p>Aún no hay publicaciones en esta categoría. ¡Sé el primero!</p>
        </div>`;
      return;
    }
    feedContainer.innerHTML = '';
    snapshot.forEach(docSnap => {
      feedContainer.appendChild(renderPost({ id: docSnap.id, ...docSnap.data() }));
    });
  });
}

// ---- Renderizar post ----
function renderPost(post) {
  const card = document.createElement('div');
  card.className = 'post-card';
  card.dataset.postId = post.id;

  const likes = post.likes || [];
  const uid = currentUser?.uid;
  const isLiked = uid && likes.includes(uid);
  const timeAgo = formatTime(post.createdAt?.toDate?.() || new Date());
  const avatarUrl = post.businessLogoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.businessName || 'B')}&background=FF4D6D&color=fff`;

  let mediaHtml = '';
  if (post.mediaType === 'photo' && post.mediaUrl) {
    mediaHtml = `
      <div class="post-media" onclick="openMediaModal('photo', '${post.mediaUrl}')">
        <img src="${post.mediaUrl}" alt="Publicación de ${post.businessName}" loading="lazy"/>
        <div class="media-overlay"><div class="play-btn"><i class="fas fa-expand"></i></div></div>
      </div>`;
  } else if (post.mediaType === 'video' && post.mediaUrl) {
    mediaHtml = `
      <div class="post-media">
        <video controls preload="metadata">
          <source src="${post.mediaUrl}" />
          Tu navegador no soporta video.
        </video>
      </div>`;
  }

  card.innerHTML = `
    <div class="post-header">
      <a href="pages/profile.html?id=${post.businessId}">
        <img src="${avatarUrl}" alt="${post.businessName}" class="post-biz-avatar"
             onerror="this.src='https://ui-avatars.com/api/?name=B&background=FF4D6D&color=fff'"/>
      </a>
      <div class="post-biz-info">
        <a href="pages/profile.html?id=${post.businessId}" class="post-biz-name">${post.businessName || 'Negocio'}</a>
        <div class="post-biz-cat">
          <span class="cat-badge">${post.businessCategory || 'General'}</span>
        </div>
      </div>
      <span class="post-time">${timeAgo}</span>
    </div>
    ${post.text ? `<p class="post-text">${escapeHtml(post.text)}</p>` : ''}
    ${mediaHtml}
    <div class="post-actions">
      <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike('${post.id}', this)">
        <i class="fa${isLiked ? 's' : 'r'} fa-heart"></i>
        <span class="like-count">${likes.length}</span>
      </button>
      <button class="action-btn share-btn" onclick="sharePost('${post.id}', '${post.businessId}')">
        <i class="fas fa-share"></i> Compartir
      </button>
      <a href="pages/profile.html?id=${post.businessId}" class="action-btn" style="margin-left:auto;">
        <i class="fas fa-store"></i> Ver negocio
      </a>
    </div>`;

  return card;
}

// ---- Like toggle ----
window.toggleLike = async (postId, btn) => {
  if (!currentUser) { window.showToast('Inicia sesión para dar like', 'error'); return; }
  const uid = currentUser.uid;
  const postRef = doc(db, 'posts', postId);
  const isLiked = btn.classList.contains('liked');
  const countEl = btn.querySelector('.like-count');
  const iconEl = btn.querySelector('i');

  btn.classList.toggle('liked', !isLiked);
  iconEl.className = isLiked ? 'far fa-heart' : 'fas fa-heart';
  const current = parseInt(countEl.textContent) || 0;
  countEl.textContent = isLiked ? current - 1 : current + 1;

  await updateDoc(postRef, {
    likes: isLiked ? arrayRemove(uid) : arrayUnion(uid)
  });
};

// ---- Share ----
window.sharePost = (postId, businessId) => {
  const url = `${location.origin}/pages/profile.html?id=${businessId}`;
  if (navigator.share) {
    navigator.share({ title: 'VendorList', url });
  } else {
    navigator.clipboard.writeText(url);
    window.showToast('Enlace copiado al portapapeles', 'success');
  }
};

// ---- Media modal ----
window.openMediaModal = (type, url) => {
  const modal = document.getElementById('mediaModal');
  const content = document.getElementById('mediaModalContent');
  if (type === 'photo') {
    content.innerHTML = `<img src="${url}" alt="Media"/>`;
  }
  modal.classList.remove('hidden');
};

window.closeMediaModal = () => {
  document.getElementById('mediaModal').classList.add('hidden');
};

// ---- Filtro categorías ----
if (categoryList) {
  categoryList.querySelectorAll('.cat-item').forEach(item => {
    item.addEventListener('click', () => {
      categoryList.querySelectorAll('.cat-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      activeCategory = item.dataset.cat;
      feedContainer.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
      initFeed(activeCategory);
    });
  });
}

// ---- Featured businesses ----
async function loadFeatured() {
  if (!featuredList) return;
  try {
    const q = query(collection(db, 'businesses'), limit(5));
    const { getDocs } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    const snap = await getDocs(q);
    if (snap.empty) {
      featuredList.innerHTML = '<p style="font-size:0.83rem;color:var(--text-muted)">Aún no hay negocios registrados.</p>';
      return;
    }
    featuredList.innerHTML = '';
    snap.forEach(d => {
      const biz = d.data();
      const avatar = biz.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(biz.name)}&background=FF4D6D&color=fff`;
      const el = document.createElement('div');
      el.className = 'featured-biz';
      el.onclick = () => window.location.href = `pages/profile.html?id=${d.id}`;
      el.innerHTML = `
        <img src="${avatar}" alt="${biz.name}" class="featured-avatar"
             onerror="this.src='https://ui-avatars.com/api/?name=B&background=FF4D6D&color=fff'"/>
        <div>
          <span class="featured-name">${biz.name}</span>
          <span class="featured-cat">${biz.category || 'General'}</span>
        </div>`;
      featuredList.appendChild(el);
    });
  } catch (e) {
    featuredList.innerHTML = '<p style="font-size:0.83rem;color:var(--text-muted)">No disponible.</p>';
  }
}

// ---- Search ----
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.post-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(term) ? '' : 'none';
    });
  });
}

// ---- Helpers ----
function formatTime(date) {
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return 'Justo ahora';
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
  return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ---- Iniciar ----
initFeed();
loadFeatured();
