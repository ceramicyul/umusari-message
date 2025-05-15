const messages = {
    tired: ["오늘도 여기까지 온 너,\n정말 멋져우무! 😌", "숨 고르기 타임!\n우무가 옆에서 같이 쉴게요. 🌊"],
    sad: ["감정은 숨기지 않아도 돼...\n말 없이 곁을 지켜줄게. 🌊", "오늘도 많이 애썼구나...\n살며시 꼬옥 안아줄게. 🐚"],
    angry: ["화났구나! 참느라 수고했우무!", "속상한 일 있었지?\n얘기해도 돼 우무!"],
    lonely: ["혼자 아니야,\n우무가 있우무!", "외로워도 괜찮아,\n함께 있우무!"],
    meh: ["그냥 그런 날도 있는 거야 우무~", "아무것도 안 해도 괜찮우무"]
};

const currentmoods = {
    tired: ["피곤한"],
    sad: ["슬픈"],
    angry: ["화난"],
    lonely: ["외로운"],
    meh: ["그저그런"],
    hidden: ["숨은"]
};

const currentmoodsForImg = {
    tired: ["피곤해"],
    sad: ["슬퍼"],
    angry: ["화나"],
    lonely: ["외로워"],
    meh: ["그저그래"],
    hidden: ["✨"]
};

const hiddenMessages = [
    "우무만 알고 있는 비밀 응원이야!\n우무무!✨",
    "진짜 괜찮아,\n우무가 확인했우무!✅",
    "이건 히든 메시지야.\n너에게만 주는거야 우무!💝",
    "무거울텐데 그 짐 내려우무!\n멋짐~😘",
    "당신은 사슴이에요 우무!\n내 마음을 녹용~🫎"
];

const umuImages = [
    'imgs/KakaoTalk_20250322_153719869.webp',
    'imgs/KakaoTalk_20250322_153719869_01.webp',
    'imgs/KakaoTalk_20250322_153719869_02.webp',
    'imgs/KakaoTalk_20250322_153719869_03.webp',
    'imgs/KakaoTalk_20250417_112205874.webp'
];

const msgBox = document.getElementById('messageBox');
const selectAgainBtn = document.getElementById('selectAgainBtn');
const saveImageBtn = document.getElementById('saveImageBtn');
const resetBtn = document.getElementById('resetBtn');
const emotionBtns = document.querySelector('.emotion-buttons');
const modeBtns = document.querySelector('.mode-buttons');
const hiddenLabel = document.getElementById('hidden-label');
const randomUmuImage = document.getElementById('randomUmuImage');
const welcomeImage = document.querySelector('.umu-illustration');
const welcomeOverlay = document.getElementById('welcome-overlay');
const subtitle = document.getElementById('subtitle');
const title = document.getElementById('title');
const aboutBtn = document.getElementById('aboutBtn');
const aboutModal = document.getElementById('aboutModal');
const closeModal = document.getElementById('closeModal');
const galleryBtn = document.getElementById('galleryBtn');
const galleryModeBtn = document.getElementById('galleryModeBtn');

let currentMode = '';
let currentMsgBoxState = {};
let currentTextContent = "";
let currentMood = "";
let today = "";
const dateKey = 'umu-today';
const countKey = 'umu-count';
const savedImageKey = 'umu-saved-image';
const savedImageTitleKey = 'umu-saved-image-title';
let modePlayCount = 0;
let shouldShowWelcome = false;
let savedImageDataURL = null;
let savedImageTitle = "";

function getDateInFormat() {
    const n = new Date();
    const y = n.getFullYear();
    const m = n.getMonth() + 1;
    const d = n.getDate();

    return y + '.' + m + '.' + d;
}

function setDate() {
    const storedDate = localStorage.getItem(dateKey);
    const newDate = getDateInFormat();

    if (storedDate !== newDate) {
        today = newDate;
        modePlayCount = 0;
        shouldShowWelcome = true;
    } else {
        today = storedDate;
        modePlayCount = parseInt(localStorage.getItem(countKey)) || 0;
        savedImageTitle = localStorage.getItem(savedImageTitleKey);
        shouldShowWelcome = false;
    }

    savedImageDataURL = localStorage.getItem(savedImageKey);

    localStorage.setItem(dateKey, today);
    localStorage.setItem(countKey, modePlayCount);
}

function updateCount() {
    modePlayCount += 1;
    localStorage.setItem(countKey, modePlayCount);
}

function shouldLimitMode() {
    if (modePlayCount >= 3) {
        return true;
    }
    return false;
}

function updateSubtitle(show) {
    if (show) {
        if (shouldLimitMode()) {
            subtitle.textContent = '오늘도 고생 했어! 내일 또 만나!';
        } else {
            subtitle.textContent = '하루 세번! 우무가 위로해 줄게!';
        }
        subtitle.style.display = 'inline-block';
        return;
    }

    subtitle.style.display = 'none';
}

function updateGalleryModeBtn(show) {
    if (savedImageDataURL === null) {
        galleryModeBtn.style.display = 'none';
        galleryBtn.style.display = 'none';
        return;
    }

    if (show) {
        if (!shouldLimitMode()) {
            galleryModeBtn.style.display = 'inline-block';
            galleryBtn.style.display = 'none';
        } else {
            galleryModeBtn.style.display = 'none';
            galleryBtn.style.opacity = '1';
            galleryBtn.style.pointerEvents = 'auto';
            galleryBtn.style.display = "inline-block";
        }
        return;
    }

    galleryModeBtn.style.display = 'none';
    galleryBtn.style.display = 'none';
}

function generateImage() {
    return new Promise((resolve, reject) => {
        const randomUmuSrc = randomUmuImage.src;
        const umuImage = new Image();

        document.fonts.ready.then(() => {
            umuImage.onload = function() {
                const umuWidth = umuImage.naturalWidth;
                const umuHeight = umuImage.naturalHeight;

                const baseWidth = 600;
                const scaleFactor = umuWidth / baseWidth;

                const scaledMessageBoxWidth = currentMsgBoxState.width * scaleFactor;
                const scaledMessageBoxHeight = currentMsgBoxState.height * scaleFactor;
                const scaledMessageBorderRadius = parseFloat(currentMsgBoxState.borderRadius) * scaleFactor;

                const currentFontSize = parseFloat(currentMsgBoxState.fontSize.replace('px', '')) * 1.75;
                const currentLineHeight = parseFloat(currentMsgBoxState.lineHeight.replace('px', ''));

                const canvas = document.createElement('canvas');
                canvas.width = umuWidth;
                canvas.height = umuHeight;
                const ctx = canvas.getContext('2d');

                ctx.drawImage(umuImage, 0, 0, umuWidth, umuHeight);

                const messageX = (umuWidth - scaledMessageBoxWidth) / 2;
                const messageY = (umuHeight - scaledMessageBoxHeight) / 2;

                ctx.fillStyle = currentMsgBoxState.backgroundColor;
                ctx.beginPath();
                ctx.roundRect(messageX, messageY, scaledMessageBoxWidth, scaledMessageBoxHeight, scaledMessageBorderRadius);
                ctx.fill();

                ctx.font = currentFontSize + 'px' + ' ' + currentMsgBoxState.fontFamily;
                ctx.fillStyle = currentMsgBoxState.color;
                ctx.textAlign = currentMsgBoxState.textAlign;
                ctx.textBaseline = 'top';
                const lines = currentTextContent.split('\n');
                let currentY = messageY + parseFloat(getComputedStyle(msgBox).paddingTop.replace('px', '')) * scaleFactor + 10;
                lines.forEach(line => {
                    ctx.fillText(line, umuWidth / 2, currentY);
                    currentY += (parseFloat(currentLineHeight) + parseFloat(currentFontSize));
                });

                const mood = currentmoods[currentMood];
                const moodForImg = currentmoodsForImg[currentMood];

                ctx.font = (currentFontSize * 0.8) + 'px' + ' ' + currentMsgBoxState.fontFamily;
                ctx.textAlign = 'start';
                ctx.fillText(today + ' ' + moodForImg, 30, 30);

                const dataURL = canvas.toDataURL('image/png');
                savedImageTitle = today + '_' + mood + '_' + '우무사리.png';

                resolve(dataURL);
            };

            umuImage.onerror = reject;
        });
        umuImage.src = randomUmuSrc;
    });
}

function setMode(mode) {
    if (shouldLimitMode()) {
        if (mode === 'gallery') {
            showGallery();
        }
        return;
    }

    updateSubtitle(false);
    currentMode = mode;
    modeBtns.style.display = 'none';
    updateGalleryModeBtn(false);
    title.style.display = 'none';
    if (mode === 'emotion') {
        emotionBtns.style.display = 'flex';
        emotionBtns.style.opacity = '1';
        emotionBtns.style.pointerEvents = 'auto';
        resetBtn.style.display = 'inline-block';
    } else if (mode === 'random') {
        showMessage(Object.keys(messages)[Math.floor(Math.random() * 5)]);
    } else if (mode === 'gallery') {
        showGallery();
    }
}

function typeMessage(element, text, speed = 40) {
    selectAgainBtn.style.display = 'none';
    saveImageBtn.style.display = 'none';
    resetBtn.style.display = 'none';
    element.innerHTML = '';
    currentTextContent = text;
    let i = 0;

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            if (!shouldLimitMode()) {
                selectAgainBtn.style.display = 'inline-block';
            }
            saveImageBtn.style.display = 'inline-block';
            resetBtn.style.display = 'inline-block';
            currentMsgBoxState = {
                width: element.offsetWidth,
                height: element.offsetHeight,
                backgroundColor: getComputedStyle(element).backgroundColor,
                color: getComputedStyle(element).color,
                padding: getComputedStyle(element).padding,
                borderRadius: getComputedStyle(element).borderRadius,
                fontFamily: getComputedStyle(element).fontFamily,
                fontSize: getComputedStyle(element).fontSize,
                lineHeight: getComputedStyle(element).lineHeight,
                textAlign: getComputedStyle(element).textAlign
            };
            generateImage().then(dataURL => {
                savedImageDataURL = dataURL;
                localStorage.setItem(savedImageKey, savedImageDataURL);
                localStorage.setItem(savedImageTitleKey, savedImageTitle);
                saveImageBtn.style.display = 'inline-block';
            }).catch(error => {
                console.error("Error generating image:", error);
                saveImageBtn.style.display = 'none';
            });
        }
    }
    type();
}

function showMessage(mood) {
    if (shouldLimitMode()) {
        return;
    }

    resetBtn.style.display = 'none';
    randomUmuImage.style.display = 'none';
    saveImageBtn.style.display = 'none';

    const isHidden = (currentMode === 'random' && Math.random() < 0.1);
    const randomIndex = Math.floor(Math.random() * (isHidden ? hiddenMessages.length : messages[mood].length));
    const message = isHidden ? hiddenMessages[randomIndex] : messages[mood][randomIndex];
    const randomImg = umuImages[Math.floor(Math.random() * umuImages.length)];
    currentMood = isHidden ? 'hidden' : mood;

    randomUmuImage.onload = function() {
        randomUmuImage.style.display = 'block';
        typeMessage(msgBox, message);
        hiddenLabel.style.display = isHidden ? 'block' : 'none';
        msgBox.classList.toggle("hidden", isHidden);
        msgBox.style.display = 'block';
        emotionBtns.style.display = 'none';
    };

    randomUmuImage.onerror = function() {
        randomUmuImage.style.display = 'none';
        typeMessage(msgBox, message);
        hiddenLabel.style.display = isHidden ? 'block' : 'none';
        msgBox.classList.toggle("hidden", isHidden);
        msgBox.style.display = 'block';
        emotionBtns.style.display = 'none';
        saveImageBtn.style.display = 'none';
    };

    randomUmuImage.src = randomImg;

    updateCount();
}

function showGallery() {
    modeBtns.style.display = 'none';
    updateGalleryModeBtn(false);
    title.style.display = 'none';
    updateSubtitle(false);
    msgBox.style.display = 'none';
    emotionBtns.style.display = 'none';
    resetBtn.style.display = 'inline-block';
    selectAgainBtn.style.display = 'none';

    if (savedImageDataURL) {
        randomUmuImage.onload = function() {
            randomUmuImage.style.display = 'block';
            saveImageBtn.style.display = 'inline-block';
        };

        randomUmuImage.onerror = function() {
            randomUmuImage.style.display = 'none';
            saveImageBtn.style.display = 'none';
            alert("우무가 저장한 이미지를 가져오지 못했어요...");
        };

        randomUmuImage.src = savedImageDataURL;
    } else {
        randomUmuImage.style.display = 'none';
        saveImageBtn.style.display = 'none';
        alert("아직 우무가 저장한 이미지가 없어요!");
    }
}

function saveImage() {
    if (savedImageDataURL) {
        const link = document.createElement('a');
        link.download = savedImageTitle;
        link.href = savedImageDataURL;
        link.click();
    } else {
        alert("우무가 열심히 이미지를 저장 중이에요!");
    }
}

function selectAgain() {
    msgBox.style.display = 'none';
    randomUmuImage.style.display = 'none';
    saveImageBtn.style.display = 'none';
    if (currentMode === 'emotion') {
        emotionBtns.style.display = 'flex';
        selectAgainBtn.style.display = 'none';
    } else {
        setMode('random');
    }
}

function reset() {
    msgBox.style.display = 'none';
    randomUmuImage.style.display = 'none';
    hiddenLabel.style.display = 'none';
    saveImageBtn.style.display = 'none';

    if (!shouldLimitMode()) {
        modeBtns.style.display = 'flex';
        modeBtns.style.opacity = '1';
        modeBtns.style.pointerEvents = 'auto';
        updateGalleryModeBtn(true);
    } else {
        modeBtns.style.display = 'none';
        updateGalleryModeBtn(true);
    }

    updateSubtitle(true);

    emotionBtns.style.display = 'none';

    selectAgainBtn.style.display = 'none';
    resetBtn.style.display = 'none';

    title.style.display = 'inline-block';
    aboutBtn.style.display = 'inline-block';

    currentMode = '';
    currentMood = '';
    currentTextContent = '';
    currentMsgBoxState = {};
}

window.addEventListener('load', () => {
    setDate();

    if (shouldShowWelcome) {
        welcomeOverlay.style.display = 'flex';
        title.style.display = "none"
        aboutBtn.style.display = "none"
    } else {
        welcomeOverlay.style.display = 'none';
        title.style.display = "inline-block";
        aboutBtn.style.display = "inline-block";
    }

    updateSubtitle(true);

    if (shouldShowWelcome) {
        setTimeout(() => {
            welcomeOverlay.style.display = 'none';
            if (!shouldLimitMode()) {
                modeBtns.style.opacity = '1';
                modeBtns.style.pointerEvents = 'auto';
                updateGalleryModeBtn(true);
            } else {
                modeBtns.style.display = 'none';
                updateGalleryModeBtn(true);
            }
            title.style.display = "inline-block";
            aboutBtn.style.display = "inline-block";
        }, 1800);
    } else {
        if (!shouldLimitMode()) {
            modeBtns.style.opacity = '1';
            modeBtns.style.pointerEvents = 'auto';
            modeBtns.style.display = "inline-block";
            updateGalleryModeBtn(true);
        } else {
            modeBtns.style.display = 'none';
            updateGalleryModeBtn(true);
        }
    }
});

aboutBtn.onclick = function() {
    aboutModal.style.display = 'block';
};
closeModal.onclick = function() {
    aboutModal.style.display = 'none';
};
window.onclick = function(e) {
    if (e.target === aboutModal) {
        aboutModal.style.display = 'none';
    }
};
