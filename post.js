// post.js — Crear publicaciones
import { db, storage } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { currentUser, currentBusiness } from './auth.js';

let currentPostType = 'text';
let selectedFile = null;

// ---- Modal controls ----
window.openModal = (type = 'text') => {
  if (!currentUser) { window.showToast('Inicia sesión para publicar', 'error'); return; }
  document.getElementById('postModal').classList.remove('hidden');
  setPostType(type, document.querySelectorAll('.tab-btn')[['text','photo','video'].indexOf(type)]);
};

window.closePostModal = () => {
  document.getElementById('postModal').classList.add('hidden');
  document.getElementById('postText').value = '';
  document.getElementById('mediaPreview').innerHTML = '';
  selectedFile = null;
};

document.getElementById('openPostModal')?.addEventListener('click', () => openModal('text'));

window.setPostType = (type, btn) => {
  currentPostType = type;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const fileArea = document.getElementById('fileInputArea');
  const fileLabel = document.getElementById('fileLabel');
  const mediaFileInput = document.getElementById('mediaFile');

  if (type === 'text') {
    fileArea.classList.add('hidden');
  } else {
    fileArea.classList.remove('hidden');
    if (type === 'photo') {
      fileLabel.textContent = 'Seleccionar imagen';
      mediaFileInput.accept = 'image/*';
    } else {
      fileLabel.textContent = 'Seleccionar video';
      mediaFileInput.accept = 'video/*';
    }
    document.getElementById('mediaPreview').innerHTML = '';
    selectedFile = null;
  }
};

window.previewMedia = (event) => {
  selectedFile = event.target.files[0];
  const preview = document.getElementById('mediaPreview');
  if (!selectedFile) { preview.innerHTML = ''; return; }

  const url = URL.createObjectURL(selectedFile);
  if (currentPostType === 'photo') {
    preview.innerHTML = `<img src="${url}" alt="Preview"/>`;
  } else {
    preview.innerHTML = `<video src="${url}" controls style="max-height:200px;border-radius:10px;"></video>`;
  }
};

// ---- Submit post ----
window.submitPost = async () => {
  if (!currentUser || !currentBusiness) {
    window.showToast('Debes iniciar sesión para publicar', 'error');
    return;
  }

  const text = document.getElementById('postText').value.trim();

  if (!text && !selectedFile) {
    window.showToast('Escribe algo o selecciona un archivo', 'error');
    return;
  }

  const submitBtn = document.querySelector('#postModal .btn-primary');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;"></div> Publicando...';

  try {
    let mediaUrl = null;
    let mediaType = 'text';

    if (selectedFile) {
      mediaType = currentPostType;
      const storageRef = ref(storage, `posts/${currentUser.uid}/${Date.now()}_${selectedFile.name}`);
      const snap = await uploadBytes(storageRef, selectedFile);
      mediaUrl = await getDownloadURL(snap.ref);
    }

    await addDoc(collection(db, 'posts'), {
      businessId: currentUser.uid,
      businessName: currentBusiness.name,
      businessCategory: currentBusiness.category,
      businessLogoUrl: currentBusiness.logoUrl || null,
      text: text || null,
      mediaUrl,
      mediaType,
      likes: [],
      createdAt: serverTimestamp()
    });

    window.showToast('¡Publicación creada!', 'success');
    closePostModal();
  } catch (err) {
    console.error(err);
    window.showToast('Error al publicar. Intenta de nuevo.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Publicar';
  }
};

// Cerrar modal al hacer click fuera
document.getElementById('postModal')?.addEventListener('click', (e) => {
  if (e.target === document.getElementById('postModal')) closePostModal();
});
