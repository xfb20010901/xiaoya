// 当页面加载完成时执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const daysLeft = document.getElementById('daysLeft');

    // 音乐控制
    let isMusicPlaying = false;

    // 尝试预加载音乐
    bgMusic.load();

    // 音乐播放错误处理
    bgMusic.addEventListener('error', function(e) {
        console.error('音乐加载错误:', e);
        console.log('错误代码:', e.target.error.code);
        console.log('音乐路径:', bgMusic.currentSrc);
        
        let errorMessage = '背景音乐加载失败: ';
        switch(e.target.error.code) {
            case 1:
                errorMessage += '加载被中断';
                break;
            case 2:
                errorMessage += '网络错误';
                break;
            case 3:
                errorMessage += '解码错误';
                break;
            case 4:
                errorMessage += '音频格式不支持';
                break;
            default:
                errorMessage += '未知错误';
        }
        alert(errorMessage + '\n请检查音乐文件是否存在且格式正确');
    });

    // 音乐加载成功处理
    bgMusic.addEventListener('canplaythrough', function() {
        console.log('音乐加载成功，准备播放');
        musicToggle.style.display = 'block';
    });

    // 音乐控制按钮点击事件
    musicToggle.addEventListener('click', function() {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.innerHTML = '♫';
        } else {
            // 尝试播放音乐
            const playPromise = bgMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // 播放成功
                    musicToggle.innerHTML = '❚❚';
                    isMusicPlaying = true;
                }).catch(error => {
                    // 播放失败
                    console.error('音乐播放失败:', error);
                    alert('音乐播放失败，请检查浏览器设置是否允许自动播放');
                    isMusicPlaying = false;
                });
            }
        }
        isMusicPlaying = !isMusicPlaying;
    });

    // 设置固定的开始日期
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 21); // 设置为21天前
    localStorage.setItem('loveStartDate', startDate.toISOString());

    // 更新倒计时和天数显示
    function updateCountdown() {
        const currentDate = new Date();
        const timeDiff = currentDate - startDate;
        
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        // 更新倒计时显示
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

        // 更新天数显示
        daysLeft.textContent = '21';
        
        // 更新进度条
        document.querySelector('.progress-bar').style.width = '100%';

        // 显示每日消息
        const dailyMessage = document.querySelector('.daily-message');
        dailyMessage.style.display = 'block';
        document.getElementById('dailyText').textContent = dailyMessages[20]; // 显示最后一天的消息
    }

    // 每秒更新倒计时
    setInterval(updateCountdown, 1000);
    updateCountdown(); // 立即执行一次

    // 表情按钮点击事件
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const emoji = this.getAttribute('data-emoji');
            const reaction = document.createElement('div');
            reaction.className = 'floating-emoji';
            reaction.textContent = emoji;
            reaction.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}vw;
                bottom: 0;
                font-size: 2em;
                animation: floatUp 2s ease-out forwards;
                z-index: 1000;
            `;
            document.body.appendChild(reaction);
            
            // 动画结束后移除元素
            setTimeout(() => reaction.remove(), 2000);
        });
    });

    // 创建心形特效
    function createHearts() {
        const container = document.querySelector('.container');
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.classList.add('heart');
                heart.style.left = Math.random() * 100 + '%';
                heart.style.animationDuration = Math.random() * 2 + 3 + 's';
                container.appendChild(heart);
                
                // 动画结束后移除心形元素
                setTimeout(() => {
                    heart.remove();
                }, 5000);
            }, i * 300);
        }
    }

    // 检查背景图片是否加载
    const img = new Image();
    img.onload = function() {
        console.log('背景图片加载成功');
        document.querySelector('.loading-overlay').style.display = 'none';
        document.body.style.backgroundImage = `url('${img.src}')`;
    };
    img.onerror = function() {
        console.error('背景图片加载失败');
        // 加载失败时使用备用颜色
        document.body.style.background = 'linear-gradient(145deg, #ffe6ea, #fff0f3)';
        document.querySelector('.loading-overlay').style.display = 'none';
    };
    // 尝试加载背景图片
    img.src = 'assets/images/bg.jpg';
    // 设置加载超时
    setTimeout(() => {
        if (!img.complete) {
            img.src = ''; // 取消当前加载
            document.body.style.background = 'linear-gradient(145deg, #ffe6ea, #fff0f3)';
            document.querySelector('.loading-overlay').style.display = 'none';
        }
    }, 5000); // 5秒超时

    // 初始化
    updateCountdown();
    createHearts();
    initializePhotoWall();
    
    // 自动启动心形飘落效果
    createFloatingHearts();
});

function initializePhotoWall() {
    const frames = document.querySelectorAll('.photo-frame');
    
    frames.forEach(frame => {
        // 随机浮动动画
        frame.style.animation = `floatPhoto ${5 + Math.random() * 2}s ease-in-out infinite`;
        
        // 改进点击查看效果
        frame.addEventListener('click', function() {
            const viewer = document.createElement('div');
            viewer.className = 'photo-viewer';
            viewer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                cursor: pointer;
                animation: fadeIn 0.3s ease;
            `;
            
            const img = document.createElement('img');
            img.src = this.querySelector('img').src;
            img.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 10px;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            `;
            
            // 添加加载动画
            img.onload = () => img.style.transform = 'scale(1)';
            
            viewer.appendChild(img);
            document.body.appendChild(viewer);
            
            // 点击关闭
            viewer.addEventListener('click', () => {
                viewer.style.opacity = '0';
                setTimeout(() => viewer.remove(), 300);
            });
        });
    });
}

const dailyMessages = [
    "初次相遇，你的笑容真美",
    "牵手的感觉真好",
    "第一次看电影，你靠在我肩上",
    "一起吃，你给烤肉",
    "公园散步，数星星",
    "送你回宿舍的路上，舍不得分开",
    "一起看星星，许下愿望",
    "分享彼此的过去",
    "为你做的第一顿饭",
    "规划第一次未来",
    "一起逛街，你试衣服的样子真可爱",
    "分享彼此的梦想",
    "见到对方的好朋友们",
    "一起打游戏，你总是很可爱",
    "为你挑选的小礼物",
    "分享工作中的趣事",
    "一起看爬山看海",
    "收到你的小惊喜",
    "深夜聊天，听你的声音",
    "一起相互骂对方",
    "憧憬美好的未来"
];

// 添加随机心形飘落效果
function createFloatingHearts() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = '❤';
        heart.style.cssText = `
            left: ${Math.random() * 100}vw;
            color: rgb(${255 * Math.random()}, ${100 * Math.random()}, ${150 * Math.random()});
            font-size: ${20 + Math.random() * 20}px;
            animation-duration: ${3 + Math.random() * 3}s;
            animation-delay: ${Math.random()}s;
        `;
        document.body.appendChild(heart);
        
        // 动画结束后移除元素
        setTimeout(() => heart.remove(), 4000);
    }, 300);
} 
