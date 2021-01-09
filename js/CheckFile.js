const formCheckFileExis = $('#formCheckFileExis');
const capchaService = $('#capchaService');

const modalErr = $('.modalErr');
const showFile = $('#showFile');
const inputCapcha = $('.inputCapcha');
const inputFilename = $('.inputFilename');
const domain = "http://127.0.0.1:5500"
window.onload = () => {
    Captcha();
}

const showModal = ()=>{
    modalErr.css({
        "display" : "block",
    });
}

const hideModal = ()=>{
    modalErr.css({
        "display" : "none",
    });
}

const showErroFilename = (classElement,err,str)=>{
    if(err){
        classElement.css({
            "border" : "2px solid rgba(248, 26, 56, 0.7)",
        });
        classElement.attr('placeholder',str);
    }else{
        classElement.css({
           "border" : "1px solid #ced4da"
        });
        classElement.attr('placeholder',str);
    }
}

inputFilename.keydown(()=>{
    showErroFilename(inputFilename,false,"Nhập tên file");
})

inputCapcha.keydown(()=>{
    showErroFilename(inputCapcha,false,"Nhập capcha");
})

const setValueDefault = ()=>{
    hideModal();
    inputFilename.val('');
    inputCapcha.val('');
    Captcha();
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
    var code = a + b + c  + d +  e  + f  + g;
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

// xử lý đường dẫn load file

const handleUrl = (fileUrl)=>{
    const a =  fileUrl.split(domain).join('');
    return a;
}
// kiem tra file ton tai
const checkFileExit = (fileUrl) => {
    const urlHandel =  handleUrl(fileUrl);
    const uRl = `${domain}/${urlHandel}`;
    try{
        $.get(uRl)
        .done(function(data) { 
            let encrypted = CryptoJS.AES.encrypt(data, "Secret Passphrase");
            let decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");
            let str = decrypted.toString(CryptoJS.enc.Utf8);
            showFile.html(str);
            setValueDefault();
        }).fail(function() { 
            showModal();
        })
    }catch(err){
       showModal();
    }
}

// su kien khi submit

formCheckFileExis.submit((e) => {
    e.preventDefault();
    let fileUrl = inputFilename.val();
    let capchaValue = inputCapcha.val();
    if (!ValidCaptcha(capchaValue)) {
        let str = "Mã capcha không đúng"
        inputCapcha.val('')
        showErroFilename(inputCapcha,true,str)
        return;
    }
    if (removeSpaces(fileUrl).length === 0) {
       showErroFilename(inputFilename,true,"Hãy nhập vào tên file");
       return;
    } else {
        checkFileExit(fileUrl);
    }
})

