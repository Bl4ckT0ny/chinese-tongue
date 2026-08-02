const switcher = document.querySelector('.lang-switch');

if (switcher) {
  const currentLanguage = document.documentElement.lang;
  const languages = [
    { href: 'ru.html', code: 'RU', lang: 'ru' },
    { href: 'en.html', code: 'EN', lang: 'en' },
    { href: 'zh-CN.html', code: '中文', lang: 'zh-CN' }
  ];

  switcher.innerHTML = languages
    .map(({ href, code, lang }) => {
      const active = currentLanguage === lang ? ' class="active" aria-current="page"' : '';
      return `<a href="${href}" lang="${lang}"${active}>${code}</a>`;
    })
    .join('');
}
