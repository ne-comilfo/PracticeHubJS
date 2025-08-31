import loadHeader from "../../services/load-header";

loadHeader();

const btn = document.querySelector('.generate'),
    input = document.querySelector('.copy-password'),
    copyBtn = document.querySelector('.copy')

function generatePaswordFromGroup(group, length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * group.length);
        result += group[index];
    }
    return result;
}

function shuffle(str) {
    return str.split('').sort(() => Math.random() - 0.5).join('');
}

const groupsPassword = ['qwertyuiopasdfghjklzxcvbnm', 'qwertyuiopasdfghjklzxcvbnm'.toUpperCase(), '0123456789', '!@#$%^&*()-_+='];

btn.addEventListener('click', () => {
    copyBtn.innerHTML = `Скопировать <i class="fa-regular fa-copy"></i>`;
    const length = Math.floor(Math.random() * 5 + 2);
    let res = '';
    groupsPassword.forEach(item => res += generatePaswordFromGroup(item, length));
    const password = shuffle(res);
    input.value = password;
});

copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(input.value);
        copyBtn.innerHTML = `Скопировано <i class="fa-regular fa-copy"></i>`;
    } catch {
        alert('Ошибка копирования');
    }
});
