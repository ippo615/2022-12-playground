class LangSelector {

    constructor(){
        // Language selection
        this.langs =[
            ['Afrikaans',       ['af-ZA']],
            ['Bahasa Indonesia',['id-ID']],
            ['Bahasa Melayu',   ['ms-MY']],
            ['Català',          ['ca-ES']],
            ['Čeština',         ['cs-CZ']],
            ['Deutsch',         ['de-DE']],
            ['English',         ['en-AU', 'Australia'],
                                ['en-CA', 'Canada'],
                                ['en-IN', 'India'],
                                ['en-NZ', 'New Zealand'],
                                ['en-ZA', 'South Africa'],
                                ['en-GB', 'United Kingdom'],
                                ['en-US', 'United States']],
            ['Español',         ['es-AR', 'Argentina'],
                                ['es-BO', 'Bolivia'],
                                ['es-CL', 'Chile'],
                                ['es-CO', 'Colombia'],
                                ['es-CR', 'Costa Rica'],
                                ['es-EC', 'Ecuador'],
                                ['es-SV', 'El Salvador'],
                                ['es-ES', 'España'],
                                ['es-US', 'Estados Unidos'],
                                ['es-GT', 'Guatemala'],
                                ['es-HN', 'Honduras'],
                                ['es-MX', 'México'],
                                ['es-NI', 'Nicaragua'],
                                ['es-PA', 'Panamá'],
                                ['es-PY', 'Paraguay'],
                                ['es-PE', 'Perú'],
                                ['es-PR', 'Puerto Rico'],
                                ['es-DO', 'República Dominicana'],
                                ['es-UY', 'Uruguay'],
                                ['es-VE', 'Venezuela']],
            ['Euskara',         ['eu-ES']],
            ['Français',        ['fr-FR']],
            ['Galego',          ['gl-ES']],
            ['Hrvatski',        ['hr_HR']],
            ['IsiZulu',         ['zu-ZA']],
            ['Íslenska',        ['is-IS']],
            ['Italiano',        ['it-IT', 'Italia'],
                                ['it-CH', 'Svizzera']],
            ['Magyar',          ['hu-HU']],
            ['Nederlands',      ['nl-NL']],
            ['Norsk bokmål',    ['nb-NO']],
            ['Polski',          ['pl-PL']],
            ['Português',       ['pt-BR', 'Brasil'],
                                ['pt-PT', 'Portugal']],
            ['Română',          ['ro-RO']],
            ['Slovenčina',      ['sk-SK']],
            ['Suomi',           ['fi-FI']],
            ['Svenska',         ['sv-SE']],
            ['Türkçe',          ['tr-TR']],
            ['български',       ['bg-BG']],
            ['Pусский',         ['ru-RU']],
            ['Српски',          ['sr-RS']],
            ['한국어',           ['ko-KR']],
            ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
                                ['cmn-Hans-HK', '普通话 (香港)'],
                                ['cmn-Hant-TW', '中文 (台灣)'],
                                ['yue-Hant-HK', '粵語 (香港)']],
            ['日本語',           ['ja-JP']],
            ['Lingua latīna',   ['la']]
        ];

        this.select_language = document.getElementById("select-language");
        this.select_dialect = document.getElementById("select-dialect");

    }

    setupLang(){
        // Setup language options
        for (var i = 0; i < this.langs.length; i++) {
            this.select_language.options[i] = new Option(this.langs[i][0], i);
        }
    }
    setupDialect(){
        this.select_dialect.innerHTML = '';
        // for (var i = this.select_dialect.options.length - 1; i >= 0; i--) {
        //     this.select_dialect.remove(i);
        // }
        let list = this.langs[this.select_language.selectedIndex];
        for (let i = 1; i < list.length; i++) {
            this.select_dialect.options.add(new Option(list[i][1], list[i][0]));
        }
        this.select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
        this.onchange();
        // recognition.lang = select_dialect.value;
    }

    setup(){
        this.setupLang();
        this.setupDialect();
        this.select_language.onchange = ((event) => this.setupDialect());
        this.select_dialect.onchange = ((event) => {
            this.onchange(event);
        })
    }

    getLang(){
        return this.select_dialect.value;
    }

    onchange(){

    }
}
