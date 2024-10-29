const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setCanvasSize();
window.addEventListener('resize', setCanvasSize);

const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
const matrixArray = matrix.split("");
const fontSize = 10;
const columns = canvas.width / fontSize;
const drops = Array.from({ length: columns }, () => 1);

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f0";
    ctx.font = fontSize + "px arial";

    drops.forEach((y, i) => {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    });
}

setInterval(drawMatrix, 35);

async function getImg() {
    const query = document.getElementById('searchQuery').value;
    const gallery = document.getElementById('gallery');
    const errorMsg = document.getElementById('errorMessage');
    const loading = document.getElementById('loading');

    gallery.innerHTML = '';
    errorMsg.textContent = '';
    loading.style.display = 'flex';

    if (!query) {
        errorMsg.textContent = 'Please enter a search term!';
        loading.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`https://joshweb.click/api/pinterest?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error(`Failed to fetch images: ${response.status}`);

        const data = await response.json();
        if (data.status !== 200 || !Array.isArray(data.result) || data.result.length === 0) {
            errorMsg.textContent = 'No images found!';
            return;
        }

        data.result.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Pinterest Image';
            img.loading = 'lazy';
            img.addEventListener('click', () => openModal(url));
            gallery.appendChild(img);
        });
    } catch (error) {
        errorMsg.textContent = `Error: ${error.message}`;
    } finally {
        loading.style.display = 'none';
    }
}

const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const downloadBtn = document.getElementById('downloadBtn');
const closeBtn = document.querySelector('.close');

function openModal(imgUrl) {
    modal.style.display = 'block';
    modalImg.src = imgUrl;
    downloadBtn.onclick = () => downloadImage(imgUrl);
}

closeBtn.onclick = () => (modal.style.display = 'none');
window.onclick = event => {
    if (event.target === modal) modal.style.display = 'none';
};

function downloadImage(imgUrl) {
    // Create an anchor element
    const link = document.createElement('a');
    link.href = imgUrl;
    link.download = 'pinterest_image.jpg';

    // Check if the download attribute is supported
    if (typeof link.download === 'undefined') {
        // If not, open the image in a new tab
        window.open(imgUrl, '_blank');
    } else {
        // Otherwise, initiate the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

document.getElementById('searchQuery').addEventListener('keypress', event => {
    if (event.key === 'Enter') getImg();
});
          
