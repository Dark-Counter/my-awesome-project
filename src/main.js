// Получаем элементы модального окна и формы
const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
const phone = document.getElementById('phone');

// Переменная для хранения последнего активного элемента
let lastActive = null;

// Обработчик открытия модального окна
openBtn?.addEventListener('click', () => {
  lastActive = document.activeElement;
  dlg.showModal(); // Открываем модальное окно
  // Фокусируемся на первом поле формы
  dlg.querySelector('input, select, textarea, button')?.focus();
});

// Обработчик закрытия модального окна
closeBtn?.addEventListener('click', () => dlg.close('cancel'));

// Обработчик закрытия модального окна при клике на фон
dlg?.addEventListener('click', (e) => {
  if (e.target === dlg) {
    dlg.close('cancel');
  }
});

// Возвращаем фокус на кнопку открытия после закрытия модалки
dlg?.addEventListener('close', () => {
  lastActive?.focus();
});

// Маска для телефона (форматирование ввода)
phone?.addEventListener('input', () => {
  const digits = phone.value.replace(/\D/g, '').slice(0, 11); // Оставляем только цифры, максимум 11
  const d = digits.replace(/^8/, '7'); // Нормализуем 8 → 7
  
  const parts = [];
  if (d.length > 0) parts.push('+7');
  if (d.length > 1) parts.push(' (' + d.slice(1, 4));
  if (d.length >= 4) parts[parts.length - 1] += ')';
  if (d.length >= 5) parts.push(' ' + d.slice(4, 7));
  if (d.length >= 8) parts.push('-' + d.slice(7, 9));
  if (d.length >= 10) parts.push('-' + d.slice(9, 11));
  
  phone.value = parts.join('');
});

// Обработчик отправки формы
form?.addEventListener('submit', (e) => {
  e.preventDefault(); // Предотвращаем стандартную отправку
  
  // 1) Сбрасываем кастомные сообщения об ошибках
  [...form.elements].forEach(el => el.setCustomValidity?.(''));
  
  // 2) Проверяем встроенные ограничения
  if (!form.checkValidity()) {
    // Настраиваем кастомные сообщения для разных типов ошибок
    const email = form.elements.email;
    if (email?.validity.typeMismatch) {
      email.setCustomValidity('Введите корректный e-mail, например name@example.com');
    }
    
    const phone = form.elements.phone;
    if (phone?.validity.patternMismatch) {
      phone.setCustomValidity('Введите телефон в формате +7 (900) 000-00-00');
    }
    
    const name = form.elements.name;
    if (name?.validity.tooShort) {
      name.setCustomValidity('Имя должно содержать минимум 2 символа');
    }
    
    // Показываем браузерные подсказки об ошибках
    form.reportValidity();
    
    // Подсвечиваем проблемные поля для доступности
    [...form.elements].forEach(el => {
      if (el.willValidate) {
        el.toggleAttribute('aria-invalid', !el.checkValidity());
      }
    });
    
    return;
  }
  
  // 3) Успешная "отправка" (без сервера)
  alert('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.');
  
  // Закрываем модальное окно
  dlg.close('success');
  
  // Сбрасываем форму
  form.reset();
  
  // Сбрасываем атрибуты aria-invalid
  [...form.elements].forEach(el => {
    if (el.willValidate) {
      el.removeAttribute('aria-invalid');
    }
  });
});
