import loadHeader from "../../services/load-header";


loadHeader();

const generateBtn = document.querySelector('.generate'),
    inputCopy = document.querySelector('.copy-password'),
    copyBtn = document.querySelector('.copy'),
    checkBtn = document.querySelector('.check'),
    inputCheck = document.querySelector('.check-password');

function generatePaswordFromGroup(group, length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * group.length);
        result += group[index];
    }
    return result;
}

function checkPasswordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;

  return score;
}


function shuffle(str) {
    return str.split('').sort(() => Math.random() - 0.5).join('');
}

const groupsPassword = ['qwertyuiopasdfghjklzxcvbnm', 'qwertyuiopasdfghjklzxcvbnm'.toUpperCase(), '0123456789', '!@#$%^&*()-_+='];

generateBtn.addEventListener('click', () => {
    copyBtn.innerHTML = `Скопировать <i class="fa-regular fa-copy"></i>`;
    const length = Math.floor(Math.random() * 5 + 2);
    let res = '';
    groupsPassword.forEach(item => res += generatePaswordFromGroup(item, length));
    const password = shuffle(res);
    inputCopy.value = password;
});

copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(inputCopy.value);
        copyBtn.innerHTML = `Скопировано <i class="fa-regular fa-copy"></i>`;
    } catch {
        alert('Ошибка копирования');
    }
});

checkBtn.addEventListener('click', () => {
    const result = checkPasswordStrength(inputCheck.value);
    const complexity = document.querySelector('.complexity');
    complexity.textContent = `Сложность: ${result}/5`;
    complexity.style.visibility = 'visible';
})