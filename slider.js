// script.js

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    // Preload tất cả ảnh trong slider
    const imgElements = Array.from(document.querySelectorAll('.slide img'));
    const preloadPromises = imgElements.map(img =>
        new Promise(resolve => {
            if (img.complete && img.naturalWidth !== 0) {
                resolve();
            } else {
                img.addEventListener('load', resolve);
                img.addEventListener('error', resolve);
            }
        })
    );

    // Khi preload xong, khởi tạo slider
    Promise.all(preloadPromises).then(initSlider);

    function initSlider() {
        // Lấy kích thước 1 slide
        const slideWidth = slides[0].getBoundingClientRect().width;

        // Clone slide đầu & cuối để tạo vòng lặp mượt
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);
        slider.appendChild(firstClone);
        slider.insertBefore(lastClone, slides[0]);

        // Thiết lập ban đầu: dịch sang trái 1 slide để hiển thị đúng 3 ảnh thật
        let index = 1;
        slider.style.transform = `translateX(-${slideWidth * index}px)`;

        // Hàm di chuyển slider
        function moveTo(nextIndex) {
            slider.style.transition = 'transform 0.5s ease';
            slider.style.transform = `translateX(-${slideWidth * nextIndex}px)`;
            index = nextIndex;
        }

        // Bắt sự kiện bấm nút
        nextBtn.addEventListener('click', () => moveTo(index + 1));
        prevBtn.addEventListener('click', () => moveTo(index - 1));

        // Khi kết thúc transition, kiểm tra nếu đang ở clone thì nhảy về slide thật
        slider.addEventListener('transitionend', () => {
            const totalSlides = slides.length;
            if (index === totalSlides + 1) {      // qua clone đầu
                slider.style.transition = 'none';
                index = 1;
                slider.style.transform = `translateX(-${slideWidth * index}px)`;
            }
            if (index === 0) {                    // qua clone cuối
                slider.style.transition = 'none';
                index = totalSlides;
                slider.style.transform = `translateX(-${slideWidth * index}px)`;
            }
        });

        // Auto-play (tuỳ chọn)
        setInterval(() => moveTo(index + 1), 5000);
    }
});
