const days = document.getElementById('days');
const hours = document.getElementById('hours');
const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');

const currentYear = new Date().getFullYear();

const weddingDate = new Date('March 28 2025 21:00:00');

function updateCountdownTime() {
  const currentTime = new Date();
  const diff = weddingDate - currentTime;

  if (diff <= 0) {
    clearInterval(refreshInterval);
    const countdownElement = document.getElementById('countdown');
    countdownElement.innerHTML = '<h2 style="color: white; text-align: center; width: 100%; padding: 20px;">¡El día tan esperado llegó!</h2>';
    return;
  }

  const d = Math.floor(diff / 1000 / 60 / 60 / 24);
  const h = Math.floor(diff / 1000 / 60 / 60) % 24;
  const m = Math.floor(diff / 1000 / 60) % 60;
  const s = Math.floor(diff / 1000) % 60;

  days.innerHTML = d;
  hours.innerHTML = h;
  minutes.innerHTML = m;
  seconds.innerHTML = s;
}

// updateCountdownTime();
const refreshInterval = setInterval(updateCountdownTime, 1000);

// Music Control
const musicToggle = document.getElementById('musicToggle');
const musicIcon = musicToggle.querySelector('i');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = false;

// Función para actualizar el icono
function updateMusicIcon() {
    const playPauseIcon = musicToggle.querySelector('i:first-child');
    if (isPlaying) {
        playPauseIcon.className = 'fas fa-pause';
        musicToggle.classList.add('playing');
    } else {
        playPauseIcon.className = 'fas fa-play';
        musicToggle.classList.remove('playing');
    }
}

// Función para reproducir música
function playMusic() {
    // Asegurarnos de que el audio esté cargado desde el principio
    bgMusic.load();
    
    // Intentar reproducir
    const playPromise = bgMusic.play();
    
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                isPlaying = true;
                updateMusicIcon();
                console.log('Música reproduciendo correctamente');
            })
            .catch(err => {
                console.error("Error al reproducir la música:", err);
                isPlaying = false;
                updateMusicIcon();
            });
    }
}

// Función para pausar música
function pauseMusic() {
    bgMusic.pause();
    isPlaying = false;
    updateMusicIcon();
}

// Evento de clic en el icono
musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
});

// Verificar que el audio se haya cargado correctamente
bgMusic.addEventListener('loadeddata', () => {
    console.log('Audio cargado correctamente');
});

bgMusic.addEventListener('error', (e) => {
    console.error('Error al cargar el audio:', e);
});

// NO iniciar automáticamente la música al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    updateMusicIcon(); // Asegurar que el icono inicial sea correcto
});

// Manejar cuando la música termina
bgMusic.addEventListener('ended', () => {
    isPlaying = false;
    updateMusicIcon();
});

// Variables globales para la galería
let currentImageIndex = 0;
const galleryImages = document.querySelectorAll('.gallery-item img');

function openModal(imgSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    modal.style.display = "flex";
    modalImg.src = imgSrc;
    document.body.style.overflow = 'hidden';
    
    // Encontrar el índice de la imagen actual
    currentImageIndex = Array.from(galleryImages).findIndex(img => img.src === imgSrc);
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = "none";
    document.body.style.overflow = 'auto';
}

function changeImage(direction) {
    const modalImg = document.getElementById('modalImage');
    const nextIndex = currentImageIndex + direction;
    
    // Calcular el siguiente índice con navegación circular
    const newIndex = nextIndex >= galleryImages.length ? 0 : 
                     nextIndex < 0 ? galleryImages.length - 1 : nextIndex;
    
    // Efecto de salida
    modalImg.style.opacity = '0';
    modalImg.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        // Actualizar el índice y la imagen
        currentImageIndex = newIndex;
        modalImg.src = galleryImages[currentImageIndex].src;
        
        // Cuando la imagen cargue, mostrarla con fade in
        modalImg.onload = () => {
            modalImg.style.opacity = '1';
            modalImg.style.transform = 'scale(1)';
        };
    }, 300);
    
    event.stopPropagation();
}

// Manejar las teclas de flecha
document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('imageModal');
    if (modal.style.display === "flex") {
        switch(event.key) {
            case 'ArrowLeft':
                changeImage(-1);
                break;
            case 'ArrowRight':
                changeImage(1);
                break;
            case 'Escape':
                closeModal();
                break;
        }
    }
});

// Cerrar modal cuando se hace clic fuera de la imagen
document.getElementById('imageModal').addEventListener('click', function(event) {
    // Si el clic fue directamente en el modal (fondo) y no en la imagen
    if (event.target === this) {
        closeModal();
    }
});

// Evitar que el clic en la imagen cierre el modal
document.getElementById('modalImage').addEventListener('click', function(event) {
    event.stopPropagation();
});

// Función mejorada para copiar al portapapeles
function copyToClipboard(text) {
    // Creamos un elemento temporal
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    
    // Seleccionamos y copiamos
    tempInput.select();
    document.execCommand('copy');
    
    // Eliminamos el elemento temporal
    document.body.removeChild(tempInput);
    
    // Feedback visual
    const button = event.currentTarget;
    const originalIcon = button.innerHTML;
    
    // Cambiamos el ícono a un check
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.style.color = '#4CAF50'; // Color verde para indicar éxito
    
    // Volvemos al ícono original después de 1.5 segundos
    setTimeout(() => {
        button.innerHTML = originalIcon;
        button.style.color = 'rgb(233, 144, 117)'; // Volvemos al color original
    }, 1500);
    
    // Opcional: Mostrar un pequeño tooltip o mensaje
    const tooltip = document.createElement('div');
    tooltip.textContent = '¡Copiado!';
    tooltip.style.position = 'fixed';
    tooltip.style.backgroundColor = 'rgba(0,0,0,0.7)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '3px';
    tooltip.style.fontSize = '12px';
    tooltip.style.zIndex = '1000';
    
    // Posicionamos el tooltip cerca del botón
    const buttonRect = button.getBoundingClientRect();
    tooltip.style.top = `${buttonRect.top - 30}px`;
    tooltip.style.left = `${buttonRect.left}px`;
    
    document.body.appendChild(tooltip);
    
    // Eliminamos el tooltip después de 1.5 segundos
    setTimeout(() => {
        document.body.removeChild(tooltip);
    }, 1500);
}

// Aseguramos que los botones de copiar estén funcionando
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners para el modal de pago
    document.querySelector('.buttons a').addEventListener('click', function(e) {
        e.preventDefault();
        const modal = document.getElementById('paymentModal');
        modal.style.display = 'flex';
    });

    document.querySelector('.close-payment-modal').addEventListener('click', function() {
        document.getElementById('paymentModal').style.display = 'none';
    });

    document.getElementById('paymentModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
});

function openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'flex';
}

// Obtener los elementos de los modales
const confirmationModal = document.getElementById("confirmationModal");
const giftModal = document.getElementById("giftModal");

// Funciones para abrir los modales
function openConfirmationModal() {
    confirmationModal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function openGiftModal() {
    giftModal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

// Funciones para cerrar los modales
function closeConfirmationModal() {
    confirmationModal.style.display = "none";
    document.body.style.overflow = "auto";
}

function closeGiftModal() {
    giftModal.style.display = "none";
    document.body.style.overflow = "auto";
}

// Cerrar los modales cuando se hace clic fuera de ellos
window.onclick = function(event) {
    if (event.target == confirmationModal) {
        closeConfirmationModal();
    }
    if (event.target == giftModal) {
        closeGiftModal();
    }
}

// Manejar la tecla Escape para ambos modales
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        if (confirmationModal.style.display === "flex") {
            closeConfirmationModal();
        }
        if (giftModal.style.display === "flex") {
            closeGiftModal();
        }
    }
});

