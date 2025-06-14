document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    const slides = Array.from(document.querySelectorAll('.slide'));
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    // Lưu lại số slide gốc
    const originalCount = slides.length;

    // Clone slide đầu & cuối
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[originalCount - 1].cloneNode(true);
    slider.appendChild(firstClone);
    slider.insertBefore(lastClone, slides[0]);

    // Lấy lại danh sách slide sau khi clone
    const allSlides = Array.from(slider.querySelectorAll('.slide'));
    let index = 1;                // đang ở slide thứ nhất (after lastClone)
    let isMoving = false;         // cờ đang trong quá trình chuyển

    // Tính width và set vị trí ban đầu
    const slideWidth = slides[0].getBoundingClientRect().width;
    slider.style.transform = `translateX(-${slideWidth * index}px)`;

    function moveTo(nextIndex) {
        if (isMoving) return;       // ignore nếu đang chạy animation
        isMoving = true;
        slider.style.transition = 'transform 0.5s ease';
        slider.style.transform = `translateX(-${slideWidth * nextIndex}px)`;
        index = nextIndex;
    }

    nextBtn.addEventListener('click', () => moveTo(index + 1));
    prevBtn.addEventListener('click', () => moveTo(index - 1));

    slider.addEventListener('transitionend', () => {
        // Reset khi vượt qua clone đầu
        if (index === originalCount + 1) {
            slider.style.transition = 'none';
            index = 1;
            slider.style.transform = `translateX(-${slideWidth * index}px)`;
        }
        // Reset khi vượt qua clone cuối
        if (index === 0) {
            slider.style.transition = 'none';
            index = originalCount;
            slider.style.transform = `translateX(-${slideWidth * index}px)`;
        }
        // Cho phép thao tác tiếp
        isMoving = false;
    });

    // Auto-play (tuỳ chọn): có thể điều chỉnh / tắt
    let autoplay = setInterval(() => moveTo(index + 1), 5000);

    // Nếu muốn dừng autoplay khi hover vào slider:
    slider.addEventListener('mouseenter', () => clearInterval(autoplay));
    slider.addEventListener('mouseleave', () => {
        autoplay = setInterval(() => moveTo(index + 1), 5000);
    });
});
