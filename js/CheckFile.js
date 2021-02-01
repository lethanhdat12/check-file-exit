
const getfileGit = $('#getfileGit');
const capchaService = $('#capchaService');
const modalErr = $('.modalErr');
const modalBody = $('.modal-body');
const showFile = $('#showFile');
const inputCapcha = $('.inputCapcha');
const inputFilename = $('.inputFilename');
const urlDomain = "https://raw.githubusercontent.com/lethanhdat12/check-file-exit/main/output/";
let login = false;
let arrDrive = [];

var authorizeButton = $('#getfileggDrive');
var CLIENT_ID = '485187263893-ntfcc5ofuc7prrdmbbol1fqvluv7o2k9.apps.googleusercontent.com';
var API_KEY = 'AIzaSyByoRL7XnjlkQ67_1Pef6_bgjYL5Du2--g';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
var SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';


function getContentFile(url) {
    try {
        $.get(url)
            .done(function (data) {
                // let encrypted = CryptoJS.AES.encrypt(data, "SecretPassphrase");
                let decrypted = CryptoJS.AES.decrypt(data, "Secret Passphrase");
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

authorizeButton.click(handleClientLoad);

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        listFiles();
        // Handle the initial sign-in state.
        gapi.auth2.getAuthInstance().isSignedIn.get();
        handleAuthClick();
    }, function (error) {
        console.log(error)
    });
}

function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function listFiles() {
    gapi.client.drive.files.list({
        'fields': "nextPageToken, files(id, name)"
    }).then(function (response) {
        arrDrive = [...JSON.parse(response.body).files];
        let fileUrl = handelValidate();
        if(fileUrl){
            fileUrl+='.html';
            let id = arrDrive.find(element => element.name === fileUrl);
            let url = `https://www.googleapis.com/drive/v3/files/${id.id}?alt=media&key=${API_KEY}`;
            getContentFile(url);
        }
    }); 
}

let btnGet = 1;
window.onload = () => {
    capchaService.bind('copy paste cut drag drop', function (e) {
        e.preventDefault();
     });
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
const checkFileExit = (fileUrl) => {
    let url = urlDomain + fileUrl + '.html';
    getContentFile(url)
}

const handelValidate = ()=>{
    let fileUrl = inputFilename.val();
    let capchaValue = inputCapcha.val();
    if (!ValidCaptcha(capchaValue)) {
        let str = "Mã capcha không đúng"
        inputCapcha.val('')
        showErroFilename(inputCapcha, true, str)
        return false;
    }
    if (removeSpaces(fileUrl).length === 0) {
        showErroFilename(inputFilename, true, "Hãy nhập vào tên file");
        return false;
    }
    else{
        return fileUrl;
    }
}

// su kien khi submit
getfileGit.click((e) => {
    let fileurl = handelValidate();
    if(fileurl){
        checkFileExit(fileurl)
    }
})
