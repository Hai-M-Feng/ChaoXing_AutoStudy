// 创建浮窗
const floatWindow = document.createElement('div');
floatWindow.innerHTML = `
  <div id="singlePlayButton" class="floatButton">单次播放</div>
  <div id="loopPlayButton" class="floatButton">循环播放</div>
  <div id="settings" style="margin-top: 10px;">
    <label for="refreshTimeInput">设置视频播放（分钟）:</label>
    <input type="number" id="refreshTimeInput" min="1" value="5" class="floatInput">
    <br>
    <label for="switchDelayInput">设置等待视频加载时间（秒）:</label>
    <input type="number" id="switchDelayInput" min="1" value="5" class="floatInput">
    <br>
    <label for="orangeNewValueInput">设置查找的任务点数（个）:</label>
    <input type="number" id="orangeNewValueInput" min="1" value="2" class="floatInput">
  </div>
  <div id="countdown" style="margin-top: 10px; font-size: 14px;"></div>
`;
floatWindow.style.position = 'fixed';
floatWindow.style.top = '50%'; // 改为垂直居中
floatWindow.style.right = '20px'; // 保持右边距离为20px
floatWindow.style.transform = 'translateY(-50%)'; // 垂直居中对齐
floatWindow.style.width = '200px';
floatWindow.style.padding = '10px';
floatWindow.style.backgroundColor = '#fff';
floatWindow.style.border = '1px solid #ccc';
floatWindow.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
floatWindow.style.zIndex = '2147483647'; // 设置为最大 z-index 值
floatWindow.style.textAlign = 'center';

// 添加按钮和输入框样式
const floatButtonStyle = `
  .floatButton {
    display: block;
    width: 100%;
    padding: 10px 0;
    margin-bottom: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    text-align: center;
    transition: background-color 0.3s;
  }

  .floatButton:hover {
    background-color: #0056b3;
  }

  #settings {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #settings label {
    margin: 5px 0;
  }

  #settings input.floatInput {
    margin: 5px 0;
    padding: 5px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  #countdown {
    margin-top: 10px;
    font-size: 14px;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = floatButtonStyle;
document.head.appendChild(styleSheet);

document.body.appendChild(floatWindow);

// 获取按钮和倒计时显示元素
const singlePlayButton = document.querySelector('#singlePlayButton');
const loopPlayButton = document.querySelector('#loopPlayButton');
const refreshTimeInput = document.querySelector('#refreshTimeInput');
const switchDelayInput = document.querySelector('#switchDelayInput');
const orangeNewValueInput = document.querySelector('#orangeNewValueInput');
const countdownElement = document.querySelector('#countdown');

// 单次播放按钮点击事件
singlePlayButton.addEventListener('click', () => {
  const switchDelay = parseInt(switchDelayInput.value) * 1000; // 转换为毫秒
  const orangeNewValue = parseInt(orangeNewValueInput.value);
  switchActiveItemAndRunScript(orangeNewValue, switchDelay);
});

// 循环播放按钮点击事件
let loopInterval;
let countdownInterval;

loopPlayButton.addEventListener('click', () => {
  if (loopInterval) {
    clearInterval(loopInterval);
    clearInterval(countdownInterval);
    loopInterval = null; // 重置定时器变量
    countdownInterval = null; // 重置倒计时变量
    loopPlayButton.textContent = '循环播放';
    countdownElement.textContent = ''; // 清除倒计时显示
  } else {
    const refreshInterval = parseInt(refreshTimeInput.value) * 60 * 1000; // 转换为毫秒
    const switchDelay = parseInt(switchDelayInput.value) * 1000; // 转换为毫秒
    const orangeNewValue = parseInt(orangeNewValueInput.value);

    loopInterval = setInterval(() => {
      switchActiveItemAndRunScript(orangeNewValue, switchDelay);
      startCountdown(refreshInterval / 1000); // 开始倒计时
    }, refreshInterval); // 每5分钟切换一次

    loopPlayButton.textContent = '停止循环';
    switchActiveItemAndRunScript(orangeNewValue, switchDelay); // 立即运行一次
    startCountdown(refreshInterval / 1000); // 开始倒计时
  }
});

// 开始倒计时
function startCountdown(duration) {
  let secondsRemaining = parseInt(duration);
  if (countdownInterval) {
    clearInterval(countdownInterval); // 清除之前的倒计时
  }
  countdownInterval = setInterval(() => {
    secondsRemaining--;
    if (secondsRemaining <= 0) {
      clearInterval(countdownInterval);
      countdownElement.textContent = ''; // 清除倒计时显示
    } else {
      const minutes = Math.floor(secondsRemaining / 60);
      const seconds = secondsRemaining % 60;
      countdownElement.textContent = `下一次触发倒计时: ${minutes} 分 ${seconds} 秒`;
    }
  }, 1000);
}

// 切换激活项目并运行脚本
function switchActiveItemAndRunScript(orangeNewValue = 2, switchDelay = 5000) {
  // 查找当前激活的表项
  const activeItem = document.querySelector('.posCatalog_select.posCatalog_active');
  if (activeItem) {
    activeItem.classList.remove('posCatalog_active');
  }

  // 查找所有符合条件的表项
  const items = Array.from(document.querySelectorAll('.posCatalog_select')).filter(item => {
    const orangeNewSpan = item.querySelector('.orangeNew');
    return orangeNewSpan && orangeNewSpan.textContent === orangeNewValue.toString();
  });

  // 找到当前激活表项的位置
  const currentIndex = items.indexOf(activeItem);

  // 计算下一个符合条件的表项
  let nextIndex = currentIndex + 1;
  if (nextIndex >= items.length) {
    nextIndex = 0; // 如果到达最后一个，循环回到第一个
  }

  const nextItem = items[nextIndex];
  if (nextItem) {
    nextItem.classList.add('posCatalog_active');
    const posCatalogName = nextItem.querySelector('.posCatalog_name');
    if (posCatalogName) {
      posCatalogName.click(); // 触发点击事件
    }

    // 延迟指定时间后运行提供的脚本
    setTimeout(() => {
      (function () {
        window.app = {
          configs: {
            playbackRate: 2, /// 倍数（经过试验，仅支持2倍数，更高的倍数会被限制导致视频暂停）
            autoplay: true, /// 自动播放
          },
          _videoEl: null,

          run() {
            this._getVideoEl();
            if (this.configs.autoplay) {
              this.play();
            }
          },

          async play() {
            try {
              const el = this._getVideoEl();
              /// 设置倍数，并播放
              el.playbackRate = this.configs.playbackRate;
              await el.play();
              this._tryTimes = 0;
            } catch (e) {
              if (this._tryTimes > 5) {
                console.error("视频播放失败", e);
                return;
              }
              setTimeout(() => {
                this._tryTimes++;
                this.play();
              }, 1000);
            }
          },

          _tryTimes: 0,

          /**
           * 获取视频元素Video
           * @return {HTMLVideoElement}
           * @private
           */
          _getVideoEl() {
            if (!this._videoEl) {
              const frameObj = $("iframe").eq(0).contents().find("iframe.ans-insertvideo-online");
              if (!frameObj) {
                throw new Error("找不到视频播放区域iframe");
              }
              this._videoEl = frameObj.contents().eq(0).find("video#video_html5_api").get(0);
              this._videoEventHandle();
            }
            if (!this._videoEl) {
              throw new Error("视频组件Video未加载完成");
            }
            return this._videoEl;
          },

          /// 播放器事件处理
          _videoEventHandle() {
            const el = this._videoEl;
            if (!el) {
              console.log("videoEl未加载");
              return;
            }
            el.addEventListener("loadedmetadata", e => {
              console.log("============视频加载完成=============");
              if (this.configs.autoplay) {
                this.play();
              }
            });
            el.addEventListener("play", e => {
              console.info("============视频开始播放=============");
            });
            el.addEventListener("pause", e => {
              console.log("============视频已暂停=============");
            });
          }
        };

        window.app.run();
      })();
    }, switchDelay); // 延迟指定时间
  }
}