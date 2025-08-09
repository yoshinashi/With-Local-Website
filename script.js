// ローディング画面の制御
const loadingScreen = document.getElementById('loadingScreen');

// ページ読み込み完了後にローディング画面を非表示
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1000);
    
    // 画像表示後にテキストを表示
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('text-visible');
        }
        
        // With Localのタイプライターアニメーション制御
        setTimeout(() => {
            const highlight = document.querySelector('.highlight.typewriter');
            if (highlight) {
                // 初期状態を設定
                highlight.style.width = '0';
                highlight.style.overflow = 'hidden';
                highlight.style.borderRight = '2px solid #FF6B35';
                highlight.style.whiteSpace = 'nowrap';
                
                // タイプライターアニメーション開始
                setTimeout(() => {
                    highlight.classList.add('animated');
                }, 100);
                
                // アニメーション完了後の処理
                setTimeout(() => {
                    // CSSカスタムプロパティを使用して色を強制変更
                    highlight.style.setProperty('--highlight-color', '#FF6B35');
                    // 直接スタイルも設定（バックアップ）
                    highlight.style.color = '#FF6B35';
                }, 2000);
            }
        }, 1000); // テキスト表示開始から1秒後
    }, 4000); // 画像表示完了後（2.6秒 + 0.8秒 + 0.6秒余裕）
});

// DOM要素の取得
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const header = document.querySelector('.header');
const contactForm = document.querySelector('.contact-form form');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

// ハンバーガーメニューの切り替え
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
    
    // メニューが開いている時はスクロールを無効化
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// オーバーレイをクリックしたときにメニューを閉じる
mobileMenuOverlay.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
});

// ナビゲーションメニューのリンクをクリックしたときにメニューを閉じる
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// スクロール時のヘッダーの背景変更と非表示/表示
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // ヘッダーの背景変更
    if (scrollTop > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
    
    // スクロール方向に応じたヘッダーの表示/非表示
    if (scrollTop > lastScrollTop && scrollTop > 200) {
        // 下スクロール時はヘッダーを非表示
        header.classList.add('hidden');
    } else {
        // 上スクロール時はヘッダーを表示
        header.classList.remove('hidden');
    }
    
    lastScrollTop = scrollTop;
});

// スムーススクロール機能
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// フォーム送信処理（test-form.htmlと同じ方法）
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        try {
            // フォームデータを収集
            const formData = new FormData(this);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            // 電話番号はスプレッドシートで数値化され先頭の0が落ちるため、常にテキストとして送る
            if (typeof data.phone !== 'undefined' && data.phone !== null) {
                const normalized = String(data.phone).trim();
                if (normalized.length > 0) {
                    data.phone = "'" + normalized;
                }
            }
            
            console.log('送信データ:', data);
            
            // Google Apps ScriptのURL（test-form.htmlと同じURL）
            const scriptUrl = 'https://script.google.com/macros/s/AKfycbw9PznK4DxeswbwjmOETdBX8aWfBtaHHYc7HQnIL_m_NkRP7AJEpolUG00rpDyooNwVeQ/exec';
            
            console.log('送信先URL:', scriptUrl);
            
            // データをJSON形式で送信（test-form.htmlと同じ方法）
            const response = await fetch(scriptUrl, {
                method: 'POST',
                mode: 'no-cors', // CORSエラーを回避
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            console.log('送信完了');
            console.log('レスポンス:', response);
            
            // 成功時の処理
            alert('Thank you for your inquiry. We will contact you after reviewing your request. We will send you a message via WhatsApp shortly, please wait a moment.');
            this.reset();
            
        } catch (error) {
            console.error('送信エラー:', error);
        } finally {
            // 送信ボタンを元に戻す
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

// メールアドレスのバリデーション
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 通知表示機能
function showNotification(message, type = 'info') {
    // 既存の通知を削除
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 通知要素の作成
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // スタイルの追加
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // 通知内容のスタイル
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    // 閉じるボタンのスタイル
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    // 通知を表示
    document.body.appendChild(notification);
    
    // アニメーション表示
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 閉じるボタンのイベント
    closeButton.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // 自動で閉じる（成功メッセージ以外）
    if (type !== 'success') {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }
}

// 高度なスクロールアニメーション
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // 遅延アニメーション（子要素がある場合）
            const children = entry.target.querySelectorAll('.service-card, .testimonial-card, .feature-item');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('animate');
                }, index * 100);
            });
        }
    });
}, observerOptions);

// アニメーション対象要素の監視
document.addEventListener('DOMContentLoaded', () => {
    // セクションタイトルのアニメーション
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        observer.observe(title);
    });
    
    // サービスカードのアニメーション
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        observer.observe(card);
    });
    
    // 新しいサービスセクションのアニメーション
    const serviceIntro = document.querySelector('.service-intro');
    const serviceOffer = document.querySelector('.service-offer');
    const serviceOfferItems = document.querySelectorAll('.service-offer-item');
    
    if (serviceIntro) observer.observe(serviceIntro);
    if (serviceOffer) observer.observe(serviceOffer);
    serviceOfferItems.forEach((item, index) => {
        setTimeout(() => {
            observer.observe(item);
        }, index * 200);
    });
    
    // ツアープランセクションのアニメーション
    const courseStops = document.querySelectorAll('.course-stop');
    
    courseStops.forEach((stop, index) => {
        setTimeout(() => {
            observer.observe(stop);
        }, index * 200);
    });
    
    // お客様の声カードのアニメーション
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        observer.observe(card);
    });
    
    // 特徴アイテムのアニメーション
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        observer.observe(item);
    });
    
    // 特徴セクションの画像アニメーション
    const featuresImage = document.querySelector('.features-image');
    if (featuresImage) {
        observer.observe(featuresImage);
    }
    
    // お問い合わせセクションのアニメーション
    const contactInfo = document.querySelector('.contact-info h2');
    const contactFormElement = document.querySelector('.contact-form');
    if (contactInfo) observer.observe(contactInfo);
    if (contactFormElement) observer.observe(contactFormElement);
});

// パララックス効果
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// テキストタイピングアニメーション
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// カウンターアニメーション
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// マウス追従エフェクト
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// カスタムカーソル
function createCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(102, 126, 234, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        transform: translate(-50%, -50%);
    `;
    document.body.appendChild(cursor);
    
    // ホバー時のカーソル拡大
    document.querySelectorAll('a, button, .service-card, .testimonial-card').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            cursor.style.background = 'rgba(102, 126, 234, 0.8)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = 'rgba(102, 126, 234, 0.5)';
        });
    });
}

// スムーズなページ遷移効果
function createPageTransition() {
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    transition.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        z-index: 9998;
        transform: translateY(100%);
        transition: transform 0.6s ease;
    `;
    document.body.appendChild(transition);
    
    // ページ読み込み時のアニメーション
    setTimeout(() => {
        transition.style.transform = 'translateY(0)';
        setTimeout(() => {
            transition.style.transform = 'translateY(-100%)';
        }, 300);
    }, 100);
}

// インタラクティブな背景パーティクル
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    document.body.appendChild(particlesContainer);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            animation: float-particle ${Math.random() * 10 + 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        particlesContainer.appendChild(particle);
    }
}

// パーティクルアニメーションのCSS追加
const style = document.createElement('style');
style.textContent = `
    @keyframes float-particle {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// モバイルメニューの改善
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // ハンバーガーメニューのアニメーション
            const spans = hamburger.querySelectorAll('span');
            if (hamburger.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

// フォームのインタラクティブ効果
function initFormEffects() {
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // 入力時のリアルタイムバリデーション
        input.addEventListener('input', () => {
            validateField(input);
        });
    });
}

// フィールドバリデーション
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch (field.type) {
        case 'email':
            if (value && !isValidEmail(value)) {
                isValid = false;
                errorMessage = '正しいメールアドレスを入力してください';
            }
            break;
        case 'tel':
            if (value && !/^[\d\-\+\(\)\s]+$/.test(value)) {
                isValid = false;
                errorMessage = '正しい電話番号を入力してください';
            }
            break;
        default:
            if (field.required && !value) {
                isValid = false;
                errorMessage = 'この項目は必須です';
            }
    }
    
    // エラーメッセージの表示/非表示
    let errorElement = field.parentElement.querySelector('.error-message');
    if (!isValid) {
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.cssText = `
                color: #f44336;
                font-size: 0.8rem;
                margin-top: 0.25rem;
                animation: fadeIn 0.3s ease;
            `;
            field.parentElement.appendChild(errorElement);
        }
        errorElement.textContent = errorMessage;
    } else if (errorElement) {
        errorElement.remove();
    }
    
    return isValid;
}

// パフォーマンス最適化：画像の遅延読み込み
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// コース切り替え機能
function initCourseSelector() {
    const courseBtns = document.querySelectorAll('.course-btn');
    const courseContents = document.querySelectorAll('.course-content');
    
    if (courseBtns.length === 0 || courseContents.length === 0) {
        console.warn('Course selector elements not found');
        return;
    }
    
    courseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetCourse = btn.getAttribute('data-course');
            
            // ボタンのアクティブ状態を更新
            courseBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // コース内容を切り替え
            courseContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetCourse) {
                    content.classList.add('active');
                    
                    // アニメーションを再実行
                    const stops = content.querySelectorAll('.course-stop');
                    stops.forEach((stop, index) => {
                        stop.classList.remove('animate');
                        setTimeout(() => {
                            stop.classList.add('animate');
                        }, index * 200);
                    });
                }
            });
        });
    });
    
    // 初期状態で最初のコースのアニメーションを実行
    const firstCourse = document.querySelector('.course-content.active');
    if (firstCourse) {
        const stops = firstCourse.querySelectorAll('.course-stop');
        stops.forEach((stop, index) => {
            setTimeout(() => {
                stop.classList.add('animate');
            }, index * 200);
        });
    }
}

// エリアスライダー機能
function initAreaSlider() {
    const sliderTrack = document.querySelector('.slider-track');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');
    
    if (!sliderTrack || !prevBtn || !nextBtn || !dotsContainer) return;
    
    const totalItems = document.querySelectorAll('.visit-area-item').length;
    let currentPosition = 0;
    const slideStep = 220; // 1回のスライドで移動するピクセル数（アイテム幅 + ギャップ）
    
    // ドットを作成
    function createDots() {
        dotsContainer.innerHTML = '';
        const totalDots = Math.ceil(totalItems / 3); // 3つずつ表示する想定でドットを作成
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('div');
            dot.className = `dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToPosition(i * slideStep * 3));
            dotsContainer.appendChild(dot);
        }
    }

    // モバイル用スライド機能
    function initMobileSlider() {
        if (window.innerWidth <= 768) {
            // モバイル時は1つずつスライド
            const mobileSlideStep = 188; // 180px + 8px gap
            
            function nextMobileSlide() {
                const maxPosition = (totalItems - 1) * mobileSlideStep;
                if (currentPosition < maxPosition) {
                    goToPosition(currentPosition + mobileSlideStep);
                } else {
                    goToPosition(0); // 最初に戻る
                }
            }
            
            function prevMobileSlide() {
                if (currentPosition > 0) {
                    goToPosition(currentPosition - mobileSlideStep);
                } else {
                    const maxPosition = (totalItems - 1) * mobileSlideStep;
                    goToPosition(maxPosition); // 最後に移動
                }
            }
            
            // モバイル用ボタンイベント
            prevBtn.addEventListener('click', () => {
                stopAutoSlide();
                prevMobileSlide();
                startAutoSlide();
            });
            
            nextBtn.addEventListener('click', () => {
                stopAutoSlide();
                nextMobileSlide();
                startAutoSlide();
            });
        }
    }
    
    // 位置を移動
    function goToPosition(position) {
        currentPosition = position;
        sliderTrack.style.transform = `translateX(-${currentPosition}px)`;
        
        // ドットのアクティブ状態を更新
        const activeDotIndex = Math.floor(currentPosition / (slideStep * 3));
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === activeDotIndex);
        });
        
        // ボタンの有効/無効状態を更新
        const maxPosition = (totalItems - 3) * slideStep;
        prevBtn.disabled = currentPosition <= 0;
        nextBtn.disabled = currentPosition >= maxPosition;
    }
    
    // 次のスライド
    function nextSlide() {
        const maxPosition = (totalItems - 3) * slideStep;
        if (currentPosition < maxPosition) {
            goToPosition(currentPosition + slideStep);
        } else {
            goToPosition(0); // 最初に戻る
        }
    }
    
    // 前のスライド
    function prevSlide() {
        if (currentPosition > 0) {
            goToPosition(currentPosition - slideStep);
        } else {
            const maxPosition = (totalItems - 3) * slideStep;
            goToPosition(maxPosition); // 最後に移動
        }
    }
    
    // 自動スライド
    let autoSlideInterval;
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            nextSlide();
        }, 3000); // 3秒間隔
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // イベントリスナー
    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });
    
    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });
    
    // ホバー時に自動スライドを停止
    sliderTrack.addEventListener('mouseenter', stopAutoSlide);
    sliderTrack.addEventListener('mouseleave', startAutoSlide);
    
    // 初期化
    createDots();
    goToPosition(0);
    startAutoSlide();
    initMobileSlider();
}

// エリアモーダル機能
function initAreaModal() {
    const areaItems = document.querySelectorAll('.visit-area-item');
    const modal = document.getElementById('areaModal');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    // エリアデータ
    const areaData = {
        // コース1のエリア
        kichijoji: {
            title: 'Kichijoji',
            image: 'images/kichijoji.png',
            description: 'Explore the trendy neighborhood known for its laid-back atmosphere and unique shops.',
            features: ['Inokashira Park', 'Trendy cafes', 'Vintage shops', 'Local atmosphere'],
            tips: 'Visit the park in spring for cherry blossoms and enjoy the peaceful atmosphere.'
        },
        nakano: {
            title: 'Nakano',
            image: 'images/nakano.png',
            description: 'Discover the hidden gem of Nakano with its unique shopping arcade and local culture.',
            features: ['Nakano Broadway', 'Shopping arcade', 'Local restaurants', 'Otaku culture'],
            tips: 'Nakano Broadway is a must-visit for anime and manga fans.'
        },
        shimokitazawa: {
            title: 'Shimokitazawa',
            image: 'images/shimokitazawa.png',
            description: 'Experience the bohemian atmosphere of Tokyo\'s hipster neighborhood.',
            features: ['Vintage shops', 'Live music venues', 'Artistic cafes', 'Alternative culture'],
            tips: 'Weekends are the best time to experience the vibrant street culture.'
        },
        gotokuji: {
            title: 'Gotokuji Temple',
            image: 'images/gotokuji.png',
            description: 'Visit the famous temple known for its thousands of lucky cat figurines.',
            features: ['Maneki-neko statues', 'Traditional temple', 'Peaceful garden', 'Cultural experience'],
            tips: 'Visit early morning for the most peaceful experience and best photos.'
        },
        
        // コース2のエリア
        kagurazaka: {
            title: 'Kagurazaka',
            image: 'images/kagurazaka.png',
            description: 'Stroll through the charming streets of this traditional neighborhood with French influence.',
            features: ['Traditional streets', 'French restaurants', 'Geisha culture', 'Historic atmosphere'],
            tips: 'Visit in the evening to see the traditional lanterns lit up.'
        },
        jimbocho: {
            title: 'Jimbocho',
            image: 'images/jimbocho.png',
            description: 'Explore Tokyo\'s famous book town with hundreds of bookstores and cafes.',
            features: ['Bookstores', 'Academic atmosphere', 'Cafes', 'Cultural heritage'],
            tips: 'Perfect for book lovers and those seeking a quiet, intellectual atmosphere.'
        },
        yanesen: {
            title: 'Yanesen',
            image: 'images/yanesen.png',
            description: 'Experience the nostalgic atmosphere of old Tokyo in this traditional neighborhood.',
            features: ['Traditional houses', 'Local temples', 'Nostalgic shops', 'Authentic atmosphere'],
            tips: 'Take your time to explore the narrow alleys and discover hidden gems.'
        },
        
        // コース3のエリア
        'tsukiji-course3': {
            title: 'Tsukiji',
            image: 'images/tsukiji.png',
            description: 'Savor fresh seafood and explore the bustling lanes of the famous outer market.',
            features: ['Fresh seafood', 'Market stalls', 'Sushi restaurants', 'Local atmosphere'],
            tips: 'Visit early morning for the freshest seafood and avoid the crowds.'
        },
        'akihabara-course3': {
            title: 'Akihabara',
            image: 'images/akihabara.png',
            description: 'Immerse yourself in the vibrant world of anime, manga, and electronics.',
            features: ['Electronics stores', 'Anime shops', 'Maid cafes', 'Gaming centers'],
            tips: 'Visit on Sundays when the main street is closed to traffic for the full otaku experience.'
        },
        'ueno-course3': {
            title: 'Ueno',
            image: 'images/ueno.png',
            description: 'Stroll through the vast Ueno Park and visit historic temples and museums.',
            features: ['Ueno Park', 'Museums', 'Zoo', 'Ameyoko Market'],
            tips: 'Spring is perfect for cherry blossom viewing, and the park is beautiful year-round.'
        },
        'asakusa-course3': {
            title: 'Asakusa',
            image: 'images/asakusa.png',
            description: 'Visit the ancient Senso-ji Temple and explore traditional Japanese culture.',
            features: ['Senso-ji Temple', 'Nakamise Street', 'Traditional shops', 'Cultural sites'],
            tips: 'Visit early morning to avoid crowds and experience the temple in peace.'
        },
        
        // 追加エリア
        shibuya: {
            title: 'Shibuya',
            image: 'images/shibuya.png',
            description: 'Experience the famous Shibuya crossing and explore the latest trends in fashion and technology.',
            features: ['Shibuya Crossing', 'Fashion boutiques', 'Trendy cafes', 'Shopping centers'],
            tips: 'Visit early morning to avoid crowds at the crossing, and explore the backstreets for hidden cafes.'
        },
        shinjuku: {
            title: 'Shinjuku',
            image: 'images/shinjuku.jpeg',
            description: 'Explore the entertainment district with its neon lights, bars, and shopping areas.',
            features: ['Golden Gai', 'Kabukicho', 'Shopping malls', 'Nightlife'],
            tips: 'Visit the Tokyo Metropolitan Government Building for free city views.'
        },
        harajuku: {
            title: 'Harajuku',
            image: 'images/harajuku.png',
            description: 'Discover unique fashion styles and trendy cafes in the heart of youth culture.',
            features: ['Takeshita Street', 'Fashion boutiques', 'Kawaii culture', 'Street fashion'],
            tips: 'Weekends are the best time to see street fashion, and don\'t miss the crepes!'
        },
        'hands-on': {
            title: 'Hands-on Experience',
            image: 'images/comingsoon.png',
            description: 'Participate in traditional Japanese activities and cultural experiences.',
            features: ['Traditional crafts', 'Cultural workshops', 'Interactive experiences', 'Local learning'],
            tips: 'Book in advance for popular workshops and arrive early for the best experience.'
        }
    };
    
    // エリアアイテムクリックイベント
    areaItems.forEach(item => {
        item.addEventListener('click', () => {
            const areaKey = item.getAttribute('data-area');
            const data = areaData[areaKey];
            
            if (data) {
                // モーダル内容を更新
                document.getElementById('modalImage').src = data.image;
                document.getElementById('modalImage').alt = data.title;
                document.getElementById('modalTitle').textContent = data.title;
                document.getElementById('modalDescription').textContent = data.description;
                
                // 特徴リストを更新
                const featuresList = document.getElementById('modalFeatures');
                featuresList.innerHTML = '';
                data.features.forEach(feature => {
                    const li = document.createElement('li');
                    li.textContent = feature;
                    featuresList.appendChild(li);
                });
                
                // ローカルティップスを更新
                document.getElementById('modalTips').textContent = data.tips;
                
                // モーダルを表示
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // モーダルを閉じる
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // ESCキーでモーダルを閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    // 基本機能の初期化
    initMobileMenu();
    initFormEffects();
    initCourseSelector();
    initAreaSlider();
    initAreaModal();
    
    // オプション機能の初期化（パフォーマンスを考慮）
    if (window.innerWidth > 768) {
        createCustomCursor();
        createParticles();
    }
    
    createPageTransition();
    
    // ヒーローセクションのタイピングアニメーション
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 2000);
    }
    
    // 統計情報のカウンターアニメーション（もしあれば）
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        if (target) {
            observer.observe(counter);
            counter.addEventListener('animationstart', () => {
                animateCounter(counter, target);
            });
        }
    });
});

// リサイズ時の処理
window.addEventListener('resize', () => {
    // モバイルメニューを閉じる
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // コーススライダーの再初期化（モバイル/デスクトップ切り替え時）
    initCourseSlider();
});

// キーボードナビゲーションの改善
document.addEventListener('keydown', (e) => {
    // ESCキーでモバイルメニューを閉じる
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Tabキーでフォーカス可能な要素をハイライト
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

// マウスクリックでキーボードナビゲーションクラスを削除
document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// アクセシビリティの改善
document.addEventListener('DOMContentLoaded', () => {
    // スキップリンクの追加
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'メインコンテンツにスキップ';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #667eea;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10001;
        transition: top 0.3s ease;
    `;
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // メインコンテンツにIDを追加
    const mainContent = document.querySelector('main') || document.querySelector('.hero');
    if (mainContent) {
        mainContent.id = 'main-content';
    }
});

// レビュースライダー機能
function initReviewsSlider() {
    const sliderTrack = document.querySelector('.reviews-slider .slider-track');
    const prevBtn = document.getElementById('reviewsPrevBtn');
    const nextBtn = document.getElementById('reviewsNextBtn');
    const dotsContainer = document.getElementById('reviewsSliderDots');
    
    if (!sliderTrack || !prevBtn || !nextBtn || !dotsContainer) return;
    
    const cards = sliderTrack.querySelectorAll('.review-card');
    const cardWidth = 420; // カードの幅 + gap
    const visibleCards = 3; // 一度に表示するカード数
    const totalSlides = Math.max(0, cards.length - visibleCards);
    let currentSlide = 0;
    
    // ドットを作成
    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i <= totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // 指定したスライドに移動
    function goToSlide(slide) {
        currentSlide = Math.max(0, Math.min(slide, totalSlides));
        const translateX = -currentSlide * cardWidth;
        sliderTrack.style.transform = `translateX(${translateX}px)`;
        
        // ドットのアクティブ状態を更新
        document.querySelectorAll('#reviewsSliderDots .dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // 次のスライド
    function nextSlide() {
        if (currentSlide < totalSlides) {
            goToSlide(currentSlide + 1);
        } else {
            goToSlide(0); // 最初に戻る
        }
    }
    
    // 前のスライド
    function prevSlide() {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        } else {
            goToSlide(totalSlides); // 最後に移動
        }
    }
    
    // 自動スライド
    let autoSlideInterval;
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 4000);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // イベントリスナー
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoSlide();
        startAutoSlide();
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide();
        startAutoSlide();
    });
    
    // ホバー時に自動スライドを停止
    sliderTrack.addEventListener('mouseenter', stopAutoSlide);
    sliderTrack.addEventListener('mouseleave', startAutoSlide);
    
    // 初期化
    createDots();
    startAutoSlide();
}

// 動的料金表機能
function initDynamicPricing() {
    const durationBtns = document.querySelectorAll('.duration-btn');
    const selectedDuration = document.getElementById('selectedDuration');
    const pricingTableBody = document.getElementById('pricingTableBody');

    // 料金表データ
    const pricingData = {
        2: { 1: 20000, 2: 20000, 3: 24000, 4: 28000 },
        4: { 1: 25000, 2: 30000, 3: 36000, 4: 40000 },
        6: { 1: 35000, 2: 40000, 3: 45000, 4: 52000 }
    };

    // 時間表示名
    const durationNames = {
        2: '2-Hour Tour',
        4: '4-Hour Tour',
        6: '6-Hour Tour'
    };

    function updatePricingTable(duration) {
        // ヘッダーを更新
        selectedDuration.textContent = durationNames[duration];
        
        // テーブルボディを更新
        const prices = pricingData[duration];
        pricingTableBody.innerHTML = '';
        
        for (let people = 1; people <= 4; people++) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${people}</td>
                <td>¥${prices[people].toLocaleString()}</td>
            `;
            pricingTableBody.appendChild(row);
        }

        // アニメーション効果
        const tableContainer = document.querySelector('.dynamic-pricing-table .pricing-table-container');
        tableContainer.style.animation = 'none';
        setTimeout(() => {
            tableContainer.style.animation = 'fadeInUp 0.5s ease';
        }, 10);
    }

    // ボタンクリックイベント
    durationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // アクティブクラスを更新
            durationBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 料金表を更新
            const duration = parseInt(btn.dataset.duration);
            updatePricingTable(duration);
        });
    });
}

// Customer Reviewsスライダー機能


// ページ読み込み時の初期化に料金計算機能を追加
document.addEventListener('DOMContentLoaded', () => {
    // 既存の初期化処理
    initMobileMenu();
    initFormEffects();
    initCourseSelector();
    initAreaSlider();
    initAreaModal();
    initDynamicPricing(); // 動的料金表機能を追加
    initReviewsSlider(); // Customer Reviewsスライダー機能を追加
    
    // オプション機能の初期化（パフォーマンスを考慮）
    if (window.innerWidth > 768) {
        createCustomCursor();
        createParticles();
    }
    
    createPageTransition();
    
    // ヒーローセクションのタイピングアニメーション（重複を避けるため削除）
    // 既にwindow.addEventListener('load')で処理済み
    
    // 統計情報のカウンターアニメーション（もしあれば）
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        if (target) {
            observer.observe(counter);
            counter.addEventListener('animationstart', () => {
                animateCounter(counter, target);
            });
        }
    });
    
    // コンタクトフォームのバリデーション機能を初期化
    initContactFormValidation();
});

// コンタクトフォームのバリデーション機能
function initContactFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // エラーメッセージの表示関数
    function showError(field, message) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.add('error');
        
        // 既存のエラーメッセージを削除
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // 新しいエラーメッセージを追加
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        formGroup.appendChild(errorMessage);
    }

    // エラーの削除関数
    function removeError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // 各フィールドのバリデーション
    function validateField(field) {
        const value = field.value.trim();
        
        // 必須項目のチェック
        if (field.hasAttribute('required') && !value) {
            const fieldName = field.getAttribute('name');
            let message = '';
            
            switch(fieldName) {
                case 'name':
                    message = 'Please enter your name';
                    break;
                case 'email':
                    message = 'Please enter your email address';
                    break;
                case 'tour-time':
                    message = 'Please select a preferred start time';
                    break;
                case 'tour-date1':
                    message = 'Please select your 1st choice date';
                    break;
                case 'participants':
                    message = 'Please enter the number of participants';
                    break;
                default:
                    message = 'This field is required';
            }
            
            showError(field, message);
            return false;
        }
        
        // メールアドレスの形式チェック
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // 参加人数の範囲チェック
        if (field.name === 'participants' && value) {
            const num = parseInt(value);
            if (num < 1 || num > 20) {
                showError(field, 'Please enter a number between 1 and 20');
                return false;
            }
        }
        
        // 日付の妥当性チェック
        if (field.name === 'tour-date1' && value) {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                showError(field, 'Please select a future date');
                return false;
            }
        }
        
        // エラーがない場合はエラー表示を削除
        removeError(field);
        return true;
    }

    // フォーム送信時のバリデーション
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fields = contactForm.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        // 全フィールドをバリデーション
        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // バリデーションが成功した場合は、最初のフォーム送信処理で処理されるため、
        // ここでは何もしない
    });

    // リアルタイムバリデーション
    const fields = contactForm.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.addEventListener('blur', () => {
            validateField(field);
        });
        
        field.addEventListener('input', () => {
            if (field.closest('.form-group').classList.contains('error')) {
                validateField(field);
            }
        });
    });
    
    // カスタム日付ピッカー機能を初期化
    initCustomDatePicker();
    
    function initCustomDatePicker() {
        const dateInputs = contactForm.querySelectorAll('.date-input');
        
        dateInputs.forEach(input => {
            // 日付ピッカー要素を作成
            const picker = createDatePicker();
            input.parentNode.style.position = 'relative';
            input.parentNode.appendChild(picker);
            
            // クリックイベント
            input.addEventListener('click', () => {
                closeAllPickers();
                picker.classList.add('active');
                updateDatePicker(picker, new Date());
            });
            
            // フォーカスイベント
            input.addEventListener('focus', () => {
                closeAllPickers();
                picker.classList.add('active');
                updateDatePicker(picker, new Date());
            });
        });
        
        // 外部クリックでピッカーを閉じる
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.date-input') && !e.target.closest('.date-picker')) {
                closeAllPickers();
            }
        });
    }
    
    function createDatePicker() {
        const picker = document.createElement('div');
        picker.className = 'date-picker';
        picker.innerHTML = `
            <div class="date-picker-header">
                <div class="date-picker-nav">
                    <button class="prev-month">&lt;</button>
                    <button class="next-month">&gt;</button>
                </div>
                <div class="date-picker-title"></div>
            </div>
            <div class="date-picker-grid">
                <div class="date-picker-weekday">Sun</div>
                <div class="date-picker-weekday">Mon</div>
                <div class="date-picker-weekday">Tue</div>
                <div class="date-picker-weekday">Wed</div>
                <div class="date-picker-weekday">Thu</div>
                <div class="date-picker-weekday">Fri</div>
                <div class="date-picker-weekday">Sat</div>
            </div>
            <div class="date-picker-footer">
                <button class="clear-date">Clear</button>
                <button class="today-btn">Today</button>
            </div>
        `;
        
        // イベントリスナーを追加
        picker.querySelector('.prev-month').addEventListener('click', () => {
            const currentDate = new Date(picker.dataset.currentDate);
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateDatePicker(picker, currentDate);
        });
        
        picker.querySelector('.next-month').addEventListener('click', () => {
            const currentDate = new Date(picker.dataset.currentDate);
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateDatePicker(picker, currentDate);
        });
        
        picker.querySelector('.clear-date').addEventListener('click', () => {
            const input = picker.parentNode.querySelector('.date-input');
            input.value = '';
            picker.classList.remove('active');
        });
        
        picker.querySelector('.today-btn').addEventListener('click', () => {
            const today = new Date();
            const input = picker.parentNode.querySelector('.date-input');
            input.value = formatDate(today);
            picker.classList.remove('active');
        });
        
        return picker;
    }
    
    function updateDatePicker(picker, date) {
        picker.dataset.currentDate = date.toISOString();
        
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        
        picker.querySelector('.date-picker-title').textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        
        const grid = picker.querySelector('.date-picker-grid');
        const daysContainer = grid.querySelectorAll('.date-picker-day');
        
        // 既存の日付要素を削除
        daysContainer.forEach(day => day.remove());
        
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const today = new Date();
        const input = picker.parentNode.querySelector('.date-input');
        const selectedDate = input.value ? new Date(input.value) : null;
        
        for (let i = 0; i < 42; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'date-picker-day';
            
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            dayElement.textContent = currentDate.getDate();
            
            // 他の月の日付
            if (currentDate.getMonth() !== date.getMonth()) {
                dayElement.classList.add('other-month');
            }
            
            // 今日の日付
            if (currentDate.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }
            
            // 選択された日付
            if (selectedDate && currentDate.toDateString() === selectedDate.toDateString()) {
                dayElement.classList.add('selected');
            }
            
            // 過去の日付を無効化
            if (currentDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
                dayElement.style.opacity = '0.3';
                dayElement.style.cursor = 'not-allowed';
            } else {
                dayElement.addEventListener('click', () => {
                    const input = picker.parentNode.querySelector('.date-input');
                    input.value = formatDate(currentDate);
                    picker.classList.remove('active');
                });
            }
            
            grid.appendChild(dayElement);
        }
    }
    
    function formatDate(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }
    
    function closeAllPickers() {
        document.querySelectorAll('.date-picker').forEach(picker => {
            picker.classList.remove('active');
        });
    }
    
}

// コーススライダー機能（レスポンシブ時のみ）
function initCourseSlider() {
    // デスクトップではスライダー機能を無効化
    if (window.innerWidth > 768) {
        return;
    }
    
    const courses = ['course1', 'course2', 'course3'];
    
    courses.forEach(courseId => {
        const courseContent = document.querySelector(`#${courseId}`);
        if (!courseContent) return;
        
        const sliderContainer = courseContent.querySelector('.course-stops-container');
        const prevBtn = courseContent.querySelector(`#${courseId}PrevBtn`);
        const nextBtn = courseContent.querySelector(`#${courseId}NextBtn`);
        const dotsContainer = courseContent.querySelector(`#${courseId}Dots`);
        
        if (!sliderContainer) {
            console.warn(`Course container not found for ${courseId}`);
            return;
        }
        
        // モバイル時は縦並びレイアウトのため、スライダー機能を無効化
        // スライダーコントロールを完全に非表示にする
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (dotsContainer) dotsContainer.style.display = 'none';
        
        // スライダーコントロールの親要素も非表示にする
        const sliderControls = courseContent.querySelector('.course-slider-controls');
        if (sliderControls) {
            sliderControls.style.display = 'none';
        }
        
        // スライダーコンテナを縦並びに設定
        sliderContainer.style.display = 'flex';
        sliderContainer.style.flexDirection = 'column';
        sliderContainer.style.gap = '1rem';
        sliderContainer.style.overflow = 'visible';
        
        console.log(`Course layout initialized for ${courseId} in mobile view`);
    });
}

// モバイル版コースレイアウト制御
function initMobileCourseLayout() {
    console.log('Initializing mobile course layout...');
    
    // モバイル版のみ実行
    if (window.innerWidth > 768) {
        console.log('Not mobile view, skipping mobile layout initialization');
        return;
    }
    
    console.log('Mobile course layout initialized');
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCourseSelector();
    initAreaSlider();
    initAreaModal();
    initReviewsSlider();
    initDynamicPricing();
    initContactFormValidation();
    initCustomDatePicker();
    initMobileMenu();
    initFormEffects();
    
    // コーススライダーは最後に初期化（他の機能の後に）
    setTimeout(() => {
        initCourseSlider();
        initMobileCourseLayout();
    }, 1000);
    
    // ウィンドウリサイズ時にも再初期化
    window.addEventListener('resize', () => {
        setTimeout(() => {
            initCourseSlider();
            initMobileCourseLayout();
        }, 100);
    });
});