// auth.js — Manejo de sesión global
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export let currentUser = null;
export let currentBusiness = null;

onAuthStateChanged(auth, async (user) => {
  currentUser = user;

  const navAuth = document.getElementById('navAuth');
  const navUser = document.getElementById('navUser');
  const createPostBox = document.getElementById('createPostBox');
  const heroSection = document.getElementById('heroSection');

  if (user) {
    // Cargar datos del negocio
    const bizDoc = await getDoc(doc(db, 'businesses', user.uid));
    if (bizDoc.exists()) {
      currentBusiness = { id: bizDoc.id, ...bizDoc.data() };

      // Actualizar navbar
      if (navAuth) navAuth.classList.add('hidden');
      if (navUser) {
        navUser.classList.remove('hidden');
        const navAvatar = document.getElementById('navAvatar');
        const navUsername = document.getElementById('navUsername');
        const navProfileLink = document.getElementById('navProfileLink');
        if (navAvatar) navAvatar.src = currentBusiness.logoUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentBusiness.name) + '&background=FF4D6D&color=fff';
        if (navUsername) navUsername.textContent = currentBusiness.name;
        if (navProfileLink) navProfileLink.href = `pages/profile.html?id=${user.uid}`;
      }

      // Mostrar caja crear post
      if (createPostBox) {
        createPostBox.classList.remove('hidden');
        const postAvatar = document.getElementById('postAvatar');
        if (postAvatar) postAvatar.src = currentBusiness.logoUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentBusiness.name) + '&background=FF4D6D&color=fff';
      }

      // Ocultar hero si está en index
      if (heroSection) heroSection.classList.add('hidden');
    }
  } else {
    currentBusiness = null;
    if (navAuth) navAuth.classList.remove('hidden');
    if (navUser) navUser.classList.add('hidden');
    if (createPostBox) createPostBox.classList.add('hidden');
  }
});

// Logout global
window.logout = async () => {
  await signOut(auth);
  window.location.href = '/index.html';
};

// Toast helper global
window.showToast = (msg, type = '') => {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i> ${msg}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
};
