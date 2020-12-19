const filename = document.querySelector('#filename');
const capcha = document.querySelector('#capcha');
const formCheckFileExis = document.querySelector('#formCheckFileExis');
const err = document.querySelector('#err');
const capchaService = document.querySelector('#capchaService');
const modalErr = $('.modalErr');

window.onload = () => {
    Captcha();
}

const setValueDefault = ()=>{
    modalErr.css({
        "display" : "none",
    });
    filename.value = '';
    capcha.value = '';
    Captcha();
    err.className = 'hiden';
}

$('#closeModal ').click(setValueDefault);
$('.modaloverlay').click(setValueDefault);

// set capcha 
function Captcha() {
    var alpha = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
    var i;
    for (i = 0; i < 6; i++) {
        var a = alpha[Math.floor(Math.random() * alpha.length)];
        var b = alpha[Math.floor(Math.random() * alpha.length)];
        var c = alpha[Math.floor(Math.random() * alpha.length)];
        var d = alpha[Math.floor(Math.random() * alpha.length)];
        var e = alpha[Math.floor(Math.random() * alpha.length)];
        var f = alpha[Math.floor(Math.random() * alpha.length)];
        var g = alpha[Math.floor(Math.random() * alpha.length)];
    }
    var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' ' + f + ' ' + g;
    capchaService.innerHTML = code
    capchaService.value = code
}
function ValidCaptcha(captcha) {
    let string1 = removeSpaces(capchaService.value);
    let string2 = removeSpaces(captcha);
    if (string1 == string2) {
        return true;
    } else {
        return false;
    }
}
function removeSpaces(string) {
    return string.split(' ').join('');
}


// lay gia tri input

const getValue = (element) => {
    return element.value;
};

// kiem tra file ton tai

const checkFileExit = (fileUrl) => {
    $.ajax({
        url: `../output/${fileUrl}.html`,
        type: 'HEAD',
        error: function () {
            modalErr.css({
                "display" : "block",
            });
        },
        success: function () {
            $('#showFile').load(this.url, async (data) => {
                let str = await data;
                const encrypted = CryptoJS.AES.encrypt(str, fileUrl);
                const decrypted = CryptoJS.AES.decrypt(encrypted, fileUrl);
                $(this).text(decrypted.toString(CryptoJS.enc.Utf8));
            });
        }
    });
}

// su kien khi submit

formCheckFileExis.addEventListener('submit', (e) => {
    e.preventDefault();
    let fileUrl = getValue(filename);
    let capchaValue = getValue(capcha);

    if (!ValidCaptcha(capchaValue)) {
        err.className = 'showErr';
        return;
    }
    if (removeSpaces(fileUrl).length == 0) {
        alert('dien vao ten file');
    } else {
        checkFileExit(fileUrl);
    }
})

