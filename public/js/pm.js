var pm = {
    cache: {},
    dataMap: {},
    init: function () {
        var me = this;
        for (var i = 0; i < window.__data.length; i++) {
            var unit = window.__data[i];
            if (unit.type == 'META') {
                window.Appcore.share({
                    title: document.title,
                    desc: (document.getElementsByName('description')[0] || 0).content || '',
                    link: location.href,
                    img: (document.images[0] || 0).src || ''
                });
                this.dataMap[unit.uid] = {
                    uid: unit.uid,
                    type: unit.type,
                    instance: window.Appcore
                };
            } else if (unit.type == 'DATASYSTEM') {
                window.La && window.La.init(2);
                this.dataMap[unit.uid] = {
                    uid: unit.uid,
                    type: unit.type,
                    instance: window.La
                };
            } else if (unit.type == 'CAROUSEL' && unit.contents.length) {
                var carousel = new Swiper('.swiper-container', {
                    loop: true,
                    autoplay: 1000 * unit.autoplay || 0, // 自动播放时间
                    effect: unit.effect || 'slide'
                });
                this.dataMap[unit.uid] = {
                    uid: unit.uid,
                    type: unit.type,
                    instance: carousel
                };
            } else if (unit.type == 'RULES') {
                var dom = document.getElementById(unit.uid),
                    rules = Popup.Popup.create({
                        autoShow: (unit.openWay == 'auto'),
                        backClose: true,
                        closeClass: 'J-close',
                        height: '100%',
                        content: dom.innerHTML
                    });
                dom.remove();
                this.dataMap[unit.uid] = {
                    uid: unit.uid,
                    type: unit.type,
                    instance: rules
                };
            } else if (unit.type == 'QRCODE') {
                var qrcode = new QRCode(document.getElementById(unit.uid), {
                    text: unit.url || location.href,
                    width: window.innerWidth,
                    height: window.innerWidth,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
                this.dataMap[unit.uid] = {
                    uid: unit.uid,
                    type: unit.type,
                    instance: qrcode
                };
            }
        }
        this.initEvent();
    },
    initEvent: function () {
        // 代理所有href属性的点击
        var me = this;
        $('#main').delegate('a[href!=""]', 'click', function (event) {
            if (me.execute(event.currentTarget.href)) {
                return false;
            }
        });
    },
    execute: function (command) {
        if (!command) return false;
        command = URI(command);
        if (command.protocol() === 'pm') {
            var path = command.path();
            if (path === '/cmd') {
                var parm = command.search(true);
                var uid = parm.uid;
                if (uid) {
                    var unit = this.dataMap[uid];
                    if (unit) {
                        var instance = unit.instance;
                        if (unit.type == 'META') {
                            instance.shareNow();
                        } else if (unit.type == 'RULES') {
                            instance.show();
                        }
                        return true;
                    }
                }
            }
        }
        return false;
    }
}

window.addEventListener('load', function () {
    pm.init();
});

