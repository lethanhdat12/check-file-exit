
const btnGetfile = $('.btnGetfile');
const capchaService = $('#capchaService');
const modalErr = $('.modalErr');
const modalBody = $('.modal-body');
const showFile = $('#showFile');
const inputCapcha = $('.inputCapcha');
const inputFilename = $('.inputFilename');
const urlDomain = "https://raw.githubusercontent.com/lethanhdat12/check-file-exit/main/output/";


const api_key = 'AIzaSyAdhR_5jHcCrbw83MEqtmUh0a2aIiCYyOI';

let btnGet = 1;
window.onload = () => {
    Captcha();
}

const showModal = (data) => {
    modalBody.html(data);
    modalErr.css({
        "display": "block",
    });
}

const hideModal = () => {
    modalErr.css({
        "display": "none",
    });
}

const showErroFilename = (classElement, err, str) => {
    if (err) {
        classElement.css({
            "border": "2px solid rgba(248, 26, 56, 0.7)",
        });
        classElement.attr('placeholder', str);
    } else {
        classElement.css({
            "border": "1px solid #ced4da"
        });
        classElement.attr('placeholder', str);
    }
}

inputFilename.keydown(() => {
    showErroFilename(inputFilename, false, "Nhập tên file");
})

inputCapcha.keydown(() => {
    showErroFilename(inputCapcha, false, "Nhập capcha");
})

const setValueDefault = () => {
    hideModal();
    inputFilename.val('');
    inputCapcha.val('');
    Captcha();
}
const setDefault = () => {

    setValueDefault();
}
$('#closeModal ').click(setDefault);
$('.modaloverlay').click(setDefault);

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
    var code = a + b + c + d + e + f + g;
    capchaService.text(code);
    capchaService.val(code);
}

function ValidCaptcha(captcha) {
    let string1 = removeSpaces(capchaService.val());
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

// kiem tra file ton tai
const checkFileExit = async (fileUrl,index) => {
    let url;
    if(index && index===0){
        const nameFile = CryptoJS.AES.decrypt(fileUrl, "Secret Passphrase").toString(CryptoJS.enc.Utf8);
        url = urlDomain + nameFile + '.html';
    }
    if(index && index===1){
        let id = fileUrl.split('/')[5];
        url = `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${api_key}`;
    }
    try {
        $.get(url)
            .done(function (data) {
                let encrypted = CryptoJS.AES.encrypt(data, "Secret Passphrase");
                let decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");
                let str = decrypted.toString(CryptoJS.enc.Utf8);
                showFile.html(str);
                setValueDefault();
            }).fail(function (err) {
                showModal("Không tồn tại file trong hệ thống");
                console.log(err)
            })
    } catch (err) {
        showModal("Lỗi khi load file");
    }
}

// su kien khi submit

btnGetfile.each((index)=>{
    $(btnGetfile[index]).click((e)=>{
        e.preventDefault();
        let fileUrl = inputFilename.val();
        let capchaValue = inputCapcha.val();
        if (!ValidCaptcha(capchaValue)) {
            let str = "Mã capcha không đúng"
            inputCapcha.val('')
            showErroFilename(inputCapcha, true, str)
            return;
        }
        if (removeSpaces(fileUrl).length === 0) {
            showErroFilename(inputFilename, true, "Hãy nhập vào tên file");
            return;
        } else {
            checkFileExit(fileUrl,index);
        }
    })
})
