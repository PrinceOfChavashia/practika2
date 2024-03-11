document.addEventListener('DOMContentLoaded', function() {
    new Slider(document.querySelector('.carousel'));
});

class Slider {
    constructor(slider, autoplay = true) {
        // элемент div.carousel
        this.slider = slider;
        // все картинки (слайды)
        this.allPictures = slider.querySelectorAll('.carousel_item');
        // цепочка картинок
        this.picturesChain = slider.querySelector('.carousel_slides');
        // кнопка «вперед»
        this.nextButton = slider.querySelector('.carousel_next');
        // кнопка «назад»
        this.prevButton = slider.querySelector('.carousel_prev');

        this.index = 0; // индекс картинки которую видит пользватель
        this.length = this.allPictures.length; // сколько всего картинок
        this.autoplay = autoplay; // вкл/выкл авто прокрутки
        this.paused = null; // чтобы можно было выключать автопрокрутку

        this.init(); // инициализация слайдера
    }

    init() {
        this.dotButtons = this.dots(); // создать индикатор текущего кадра

        // все кадры должны быть одной ширины, равной ширине окна просмотра;
        this.allPictures.forEach(frame => frame.style.width = 100/this.length + '%');
        // ширина цепочки кадров должна равна ширине всех кадров, ширину задаю в процентах от родителя
        this.picturesChain.style.width = 100 * this.length + '%';

        this.nextButton.addEventListener('click', event => { // клик по кнопке «вперед»
            this.next();
        });

        this.prevButton.addEventListener('click', event => { // клик по кнопке «назад»
            
            this.prev();
        });

        // клики по кнопкам индикатора текущей картинки
        this.dotButtons.forEach(dot => {
            dot.addEventListener('click', event => {
                
                let index = this.dotButtons.indexOf(event.target);
                if (index === this.index) return;
                this.goto(index);
            });
        });

        if (this.autoplay) { // включить автоматическую прокрутку?
            this.play();
            // когда мышь над слайдером останавливаем автоматическую прокрутку
            this.slider.addEventListener('mouseenter', () => clearInterval(this.paused));
            // когда мышь покидает пределы слайдера опять запускаем прокрутку
            this.slider.addEventListener('mouseleave', () => this.play());
        }
    }

    // создать индикатор текущего слайда
    dots() {
        let ol = document.createElement('ol');
        ol.classList.add('carousel_indicators');
        let children = []; // нужен для правильного отображения индикатора, если не будет замрет на месте
        for (let i = 0; i < this.length; i++) {
            let li = document.createElement('li');
            if (i === 0) li.classList.add('active');
            ol.append(li);
            children.push(li);
        }
        this.slider.prepend(ol);
        return children;
    }

    // перейти к кадру с индексом => index
    goto(index) {
        // изменить текущий индекс
        // console.log(index);
        //console.log(this.length);
        if (index > this.length - 1) {
            this.index = 0;
        } else if (index < 0) {
            this.index = this.length - 1;
        } else {
            this.index = index;
        }
        // выполнить смещение
        this.move();
    }

    // перейти к следующему кадру
    next() {
        this.goto(this.index + 1);
    }

    // перейти к предыдущему кадру
    prev() {
        this.goto(this.index - 1);
    }

    // рассчитать и выполнить смещение
    move() {
        // на сколько нужно сместить, чтобы нужный кадр попал в окно
        let bias = 100/this.length * this.index;
        this.picturesChain.style.transform = `translateX(-${bias}%)`;
        this.dotButtons.forEach(dot => dot.classList.remove('active'));
        this.dotButtons[this.index].classList.add('active');
    }

    // запустить автоматическую прокрутку
    play() {
        this.paused = setInterval(() => this.next(), 3000);
    }
}