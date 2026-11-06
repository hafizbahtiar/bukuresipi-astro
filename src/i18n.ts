// All website copy, Malay (default, at /) and English (at /en). Pages pick one with `t(lang)`.
export const LANGS = ['ms', 'en'] as const
export type Lang = (typeof LANGS)[number]

export const SITE = 'https://bukuresipi.com'
export const CONTACT = 'hafiz@hafizbahtiar.com'
/** Store link: null = not published yet ("coming soon"). Set at launch. Android only: no iPhone version for now. */
export const STORES = { play: null as string | null }

/** URL path of a page in a language: ('/auth/reset', 'en') -> '/en/auth/reset'. */
export const pathIn = (path: string, lang: Lang) => (lang === 'en' ? (path === '/' ? '/en' : `/en${path}`) : path)

const ms = {
    htmlLang: 'ms',
    ogLocale: 'ms_MY',
    other: { lang: 'en' as Lang, label: 'English' },
    nav: { how: 'Cara guna', faq: 'Soalan lazim' },
    home: {
        title: 'Bukuresipi: simpan resipi dan tempat makan dari TikTok, Instagram dan YouTube',
        description:
            'Nampak resipi atau kedai makan sedap di TikTok, Instagram, Facebook atau YouTube? Kongsi ke Bukuresipi. Resipi masuk buku anda, kedai makan masuk peta anda.',
        ogAlt: 'Bukuresipi: resipi dari TikTok tersalin ke dalam buku latihan',
        eyebrow: 'Buku resipi dan peta makan',
        h1: 'Resipi yang anda jumpa di TikTok, tersimpan dalam satu buku.',
        lead: 'Kongsi pautan atau tangkap layar ke Bukuresipi. Bahan, langkah dan nama kedai disalin daripada hantaran itu sendiri, terus ke buku resipi dan peta anda.',
        soon: 'Tidak lama lagi',
        play: 'Google Play',
        notebook: {
            dish: 'Ayam masak merah',
            lines: [
                ['2 ekor', ' ayam, potong 12'],
                ['10 tangkai', ' cili kering, rendam'],
                ['3 sudu besar', ' sos tomato'],
            ],
            gap: 'garam: tidak disebut dalam video',
            place: 'Warung Mak Teh',
            area: 'Kuala Terengganu, 2 cawangan',
            halal: '"Semua makanan kami halal"',
            halalSource: 'dipetik daripada kapsyen',
        },
        stepsTitle: 'Dari skrol ke simpanan',
        steps: [
            ['Kongsi', 'Tekan Kongsi di TikTok, Instagram, Facebook, YouTube atau mana-mana laman web, kemudian pilih Bukuresipi.'],
            ['Kami baca', 'Kapsyen, teks pada skrin dan maklumat laman dibaca untuk tahu sama ada ia resipi atau kedai makan.'],
            ['Tersimpan', 'Resipi masuk buku anda. Kedai makan dapat pin di peta, lengkap dengan cawangannya.'],
        ],
        bookTitle: 'Buku resipi',
        bookText:
            'Sukatan disimpan seperti yang ditulis: "segenggam kecil" kekal segenggam kecil. Langkah ikut turutan, dan bahan dipadankan dengan katalog supaya alahan seperti kacang atau susu ditanda.',
        mapTitle: 'Peta makan',
        mapText:
            'Setiap kedai yang anda simpan muncul di peta. Bukuresipi cari cawangannya sekali, jadi anda tahu yang mana paling dekat.',
        honestTitle: 'Tiada yang direka.',
        honestLead:
            'Setiap bahan, langkah dan nama kedai mesti datang daripada hantaran itu. Kalau video tak sebut sukatan, Bukuresipi tulis "tidak disebut", bukan meneka.',
        honest: [
            ['Tiada pin lebih baik daripada pin yang salah', 'Alamat yang tidak dapat dikenal pasti disimpan tanpa pin.'],
            ['Halal ialah petikan, bukan pensijilan', 'Anda nampak ayat kedai itu sendiri dan sumbernya, bukan tanda "disahkan".'],
        ],
        worksWith: 'Berfungsi dengan',
        platforms: ['TikTok', 'Instagram', 'Facebook', 'YouTube', 'Google Maps', 'Laman web resipi', 'Tangkap layar'],
        faqTitle: 'Soalan lazim',
        faq: [
            ['Apa yang boleh saya kongsi?', 'Pautan TikTok, Instagram, Facebook, YouTube, Google Maps dan laman web resipi, atau tangkap layar daripada mana-mana aplikasi.'],
            ['Adakah maklumat halal disahkan?', 'Tidak. Bukuresipi menunjukkan apa yang kedai atau hantaran itu sendiri katakan, berserta sumbernya. Ia bukan pensijilan JAKIM, jadi semak logo halal di premis.'],
            ['Bagaimana kalau hantaran tak lengkap?', 'Resipi tetap disimpan, dan bahagian yang tiada ditanda dengan jelas supaya anda boleh lengkapkannya sendiri.'],
            ['Bila aplikasi dilancarkan?', 'Versi Android sedang diuji, dan butang Google Play di halaman ini akan aktif sebaik sahaja ia tersedia.'],
            ['Ada versi iPhone?', 'Belum buat masa ini. Versi iPhone memerlukan akaun pembangun Apple yang berbayar, jadi kami akan mulakan apabila ada penaja.'],
            ['Bahasa apa yang disokong?', 'Bahasa Melayu dan English. Resipi disimpan dalam bahasa asal hantaran.'],
        ],
        ctaTitle: 'Buku resipi anda, diisi oleh skrol anda.',
        ctaText: 'Versi Android sedang diuji.',
        footer: 'Resipi dan tempat makan dari media sosial, tersimpan di satu tempat.',
        footerTop: 'Kembali ke atas',
        footerDelete: 'Padam akaun',
        footerCredits: 'Penghargaan',
        footerPrivacy: 'Privasi',
        footerTerms: 'Terma',
        tester: {
            title: 'Jadi tester Android',
            text: 'Kami sedang cari tester untuk versi Android. Tinggalkan emel akaun Google (Gmail) anda: Google Play hantar jemputan bila build sedia.',
            label: 'Emel akaun Google',
            placeholder: 'nama@gmail.com',
            button: 'Daftar sebagai tester',
            note: 'Android sahaja buat masa ini; tiada versi iPhone lagi.',
            invalid: 'Masukkan alamat emel yang sah.',
            done: 'Terima kasih! Anda dalam senarai. Jemputan datang dari Google Play ke emel ini.',
            disposable: 'Gunakan emel tetap, bukan emel sementara.',
            rate: 'Terlalu banyak cubaan. Cuba lagi sebentar.',
            network: 'Tidak dapat dihantar. Semak sambungan anda dan cuba lagi.',
            hero: 'Jadi tester Android',
        },
    },
    terms: {
        title: 'Terma Penggunaan - Bukuresipi',
        description: 'Peraturan menggunakan Bukuresipi: akaun, kandungan yang anda kongsi, ketepatan maklumat, dan tanggungjawab.',
        heading: 'Terma Penggunaan',
        updated: 'Dikemas kini 6 November 2026',
        intro: 'Bukuresipi dikendalikan oleh Hafiz Bahtiar di Malaysia. Dengan menggunakan aplikasi atau laman web ini, anda bersetuju dengan terma ini. Cara kami mengendalikan data anda diterangkan dalam Dasar Privasi.',
        sections: [
            {
                title: 'Akaun anda', items: [
                    'Anda mesti berumur 13 tahun ke atas.',
                    'Gunakan emel yang sah dan jaga kata laluan anda. Anda bertanggungjawab atas apa yang dibuat melalui akaun anda.',
                    'Satu akaun untuk seorang. Jangan menyamar sebagai orang lain.',
                ]
            },
            {
                title: 'Kandungan yang anda kongsi', items: [
                    'Kongsi hanya siaran yang awam atau yang anda berhak kongsi. Siaran asal kekal milik penciptanya; Bukuresipi menyimpan pautan dan maklumat yang dibaca daripadanya untuk anda.',
                    'Resipi, nota, ulasan dan gambar anda kekal milik anda. Anda membenarkan kami menyimpan, memproses dan menunjukkannya kepada anda, keluarga anda, atau komuniti, mengikut pilihan anda.',
                ]
            },
            {
                title: 'Peraturan', paras: ['Jangan gunakan Bukuresipi untuk:'], items: [
                    'spam, iklan, atau ulasan dan penilaian palsu;',
                    'kandungan yang menghina, lucah, membenci, mengganggu, atau menyalahi undang-undang;',
                    'maklumat palsu tentang kedai, termasuk dakwaan halal palsu;',
                    'bot, mengikis data, memintas had, atau menyerang perkhidmatan.',
                ]
            },
            {
                title: 'Kawalan kandungan', paras: [
                    'Kami boleh menyembunyikan atau membuang kandungan, dan menggantung atau menutup akaun, yang melanggar terma ini. Anda boleh melaporkan ulasan dan resipi dalam aplikasi.',
                ]
            },
            {
                title: 'Ketepatan maklumat', items: [
                    'Resipi dan butiran kedai dibaca secara automatik (AI) daripada siaran, dan boleh salah atau tidak lengkap. Semak sebelum memasak atau pergi.',
                    'Senarai alahan hanya meliputi bahan yang dikenal pasti. Tiada senarai bermakna "tidak diketahui", bukan "bebas alahan". Jika anda ada alahan, semak sendiri setiap bahan.',
                    'Halal yang ditunjukkan ialah petikan daripada sumber, dengan pautannya. Ia bukan pensijilan halal (contohnya JAKIM). Sahkan dengan kedai.',
                    'Lokasi, alamat dan cawangan kedai boleh salah atau lapuk.',
                ]
            },
            {
                title: 'Perkhidmatan', items: [
                    'Bukuresipi percuma buat masa ini. Kami mungkin menunjukkan iklan atau menawarkan pelan berbayar pada masa hadapan, dan akan memaklumkannya terlebih dahulu.',
                    'Kami boleh menukar, menghadkan atau menghentikan ciri. Ada had harian (contohnya bilangan kongsian sehari).',
                ]
            },
            {
                title: 'Menamatkan', paras: [
                    'Anda boleh memadam akaun anda pada bila-bila masa dalam aplikasi atau di halaman Padam akaun. Kami boleh menutup akaun yang melanggar terma ini.',
                ]
            },
            {
                title: 'Tanggungjawab', paras: [
                    'Bukuresipi disediakan "seadanya". Setakat yang dibenarkan undang-undang, kami tidak bertanggungjawab atas kerugian tidak langsung daripada penggunaannya, termasuk maklumat yang salah. Tiada apa-apa dalam terma ini menghadkan hak anda di bawah Akta Perlindungan Pengguna 1999 atau undang-undang lain yang tidak boleh diketepikan.',
                ]
            },
            {
                title: 'Undang-undang', paras: [
                    'Terma ini tertakluk kepada undang-undang Malaysia.',
                ]
            },
            {
                title: 'Perubahan dan hubungi kami', paras: [
                    'Jika terma ini berubah, kami kemas kini tarikh di atas, dan memaklumkan dalam aplikasi untuk perubahan besar.',
                    'Soalan: hafiz@hafizbahtiar.com',
                ]
            },
        ],
        deleteLink: 'Padam akaun',
        back: 'Kembali ke laman utama',
    },
    privacy: {
        title: 'Dasar Privasi - Bukuresipi',
        description: 'Data yang Bukuresipi kumpul, untuk apa, siapa yang memprosesnya, dan cara memadamnya.',
        heading: 'Dasar Privasi',
        updated: 'Dikemas kini 6 November 2026',
        intro: 'Bukuresipi menyimpan resipi dan kedai makan yang anda kongsi dari media sosial. Halaman ini menerangkan data yang kami kumpul, kenapa, dan cara memadamnya. Kami tidak menjual data anda dan tidak menunjukkan iklan.',
        sections: [
            {
                title: 'Data yang kami kumpul', items: [
                    'Akaun: emel, kata laluan (disimpan sebagai cincangan bcrypt, bukan teks asal), nama yang anda tetapkan, dan bahasa aplikasi.',
                    'Log masuk dengan Google: ID akaun Google, emel dan nama anda. Tiada gambar profil, kenalan atau data lain.',
                    'Apa yang anda kongsi: pautan siaran, tangkapan skrin, dan teks yang kami baca daripadanya (kapsyen, keterangan halaman).',
                    'Kandungan anda: resipi, kedai simpanan, nota, senarai beli-belah, penilaian, ulasan, undi, laporan, dan pin peta yang anda letak.',
                    'Peranti yang log masuk: nama dan model peranti, versi Android dan aplikasi, dan bandar anggaran daripada alamat IP (untuk halaman "Peranti log masuk").',
                    'Token notifikasi (Firebase), untuk menghantar notifikasi kepada telefon anda.',
                    'Lokasi: hanya semasa anda mencari kedai berdekatan. Ia digunakan untuk carian itu dan tidak disimpan.',
                    'Borang tester di laman ini: emel yang anda masukkan.',
                ]
            },
            {
                title: 'Untuk apa', items: [
                    'Menjadikan siaran yang anda kongsi resipi atau kedai makan, dan menunjukkannya kepada anda.',
                    'Log masuk, keselamatan akaun (contohnya amaran log masuk baharu), dan emel akaun (sahkan emel, set semula kata laluan).',
                    'Berkongsi dengan keluarga anda: ahli keluarga melihat nama anda, kedai dan resipi yang anda tidak tanda "Hanya saya". Emel anda tidak pernah ditunjukkan kepada pengguna lain.',
                    'Resipi yang anda terbitkan kepada komuniti, dan ulasan anda, boleh dilihat oleh pengguna lain bersama nama anda.',
                ]
            },
            {
                title: 'Siapa yang memproses data', paras: [
                    'Kami menggunakan perkhidmatan ini untuk menjalankan Bukuresipi. Mereka menerima hanya apa yang perlu untuk tugas mereka:',
                ], items: [
                    'Cloudflare: pelayan, pangkalan data, storan gambar, dan Workers AI yang membaca siaran dan tangkapan skrin.',
                    'Command Code (model DeepSeek): membaca teks siaran untuk mengeluarkan resipi atau butiran kedai.',
                    'Google Firebase: menghantar notifikasi. Google Sign-In: log masuk dengan Google.',
                    'Resend: menghantar emel akaun.',
                    'OpenStreetMap (Nominatim, Overpass), Photon, HERE dan Parallel: mencari lokasi kedai daripada nama dan alamatnya. Lokasi anda tidak dihantar.',
                ]
            },
            {
                title: 'Simpanan dan pemadaman', items: [
                    'Data anda disimpan selagi akaun anda wujud. Setiap log masuk tamat selepas 30 hari, kemudian anda log masuk semula.',
                    'Anda boleh padam akaun dalam aplikasi (Akaun > Padam akaun) atau di halaman Padam akaun. Ini memadam akaun, tangkapan skrin, resipi, kedai simpanan, penilaian, ulasan dan peranti anda serta-merta.',
                    'Yang kekal: maklumat kedai makan awam (nama, alamat, lokasi) yang dikongsi semua pengguna, dan gambar kecil siaran awam. Ia tidak dikaitkan dengan anda lagi.',
                ]
            },
            {
                title: 'Keselamatan', items: [
                    'Semua sambungan menggunakan HTTPS. Kata laluan disimpan sebagai cincangan, dan pautan emel sekali guna.',
                    'Tangkapan skrin anda disimpan secara peribadi; hanya anda (dan keluarga anda, bagi kedai yang dikongsi) boleh melihatnya.',
                ]
            },
            {
                title: 'Kanak-kanak', paras: [
                    'Bukuresipi bukan untuk kanak-kanak di bawah 13 tahun, dan kami tidak sengaja mengumpul data mereka.',
                ]
            },
            {
                title: 'Hak anda', paras: [
                    'Di bawah Akta Perlindungan Data Peribadi 2010, anda boleh meminta salinan, pembetulan atau pemadaman data anda. Kebanyakannya boleh dibuat dalam aplikasi; untuk yang lain, emel kami.',
                ]
            },
            {
                title: 'Hubungi kami', paras: [
                    'Soalan atau permintaan tentang data anda: hafiz@hafizbahtiar.com',
                    'Jika dasar ini berubah, kami kemas kini tarikh di atas, dan memaklumkan dalam aplikasi untuk perubahan besar.',
                ]
            },
        ],
        deleteLink: 'Padam akaun',
        back: 'Kembali ke laman utama',
    },
    credits: {
        title: 'Penghargaan - Bukuresipi',
        description: 'Untuk siapa Bukuresipi dibina, dan sumber terbuka serta perkhidmatan yang menjadikannya mungkin.',
        dedicationKicker: 'Untuk isteri tercinta',
        dedication: [
            'Saya bina Bukuresipi untuk isteri saya, supaya setiap resipi dan kedai makan yang dia suka ada satu tempat, dan tidak hilang dalam skrol.',
            'Kini ia untuk semua. Kalau ia berguna untuk anda juga, itu hadiah kedua yang sangat saya hargai.',
        ],
        thanksTitle: 'Terima kasih',
        thanksText: 'Bukuresipi berdiri atas kerja ramai orang. Peta, data tempat dan alat ini dikongsi secara terbuka atau disediakan oleh:',
        groups: [
            {
                title: 'Peta', items: [
                    { name: 'OpenStreetMap contributors', detail: 'Data peta, ODbL.', url: 'https://www.openstreetmap.org/copyright' },
                    { name: 'OpenFreeMap', detail: 'Jubin peta dan gaya Liberty.', url: 'https://openfreemap.org' },
                    { name: 'OpenMapTiles', detail: 'Skema data peta.', url: 'https://openmaptiles.org' },
                    { name: 'MapLibre', detail: 'Pemapar peta, BSD.', url: 'https://maplibre.org' },
                ]
            },
            {
                title: 'Data tempat dan alamat', items: [
                    { name: 'Overture Maps', detail: 'Data tempat, CDLA-Permissive-2.0.', url: 'https://overturemaps.org' },
                    { name: 'Nominatim', detail: 'Alamat ke lokasi, dari OpenStreetMap.', url: 'https://nominatim.org' },
                    { name: 'Photon', detail: 'Alamat ke lokasi.', url: 'https://photon.komoot.io' },
                    { name: 'HERE', detail: 'Mencari kedai mengikut nama.', url: 'https://www.here.com' },
                    { name: 'Parallel', detail: 'Carian web untuk alamat cawangan.', url: 'https://parallel.ai' },
                ]
            },
            {
                title: 'Dibina dengan', items: [
                    { name: 'Flutter', detail: 'Aplikasi, BSD.', url: 'https://flutter.dev' },
                    { name: 'Cloudflare', detail: 'Workers, D1, R2 dan Workers AI.', url: 'https://www.cloudflare.com' },
                    { name: 'Hono', detail: 'API, MIT.', url: 'https://hono.dev' },
                    { name: 'Drizzle ORM', detail: 'Pangkalan data, Apache-2.0.', url: 'https://orm.drizzle.team' },
                    { name: 'Astro', detail: 'Laman web ini, MIT.', url: 'https://astro.build' },
                    { name: 'Google Fonts', detail: 'Familjen Grotesk, Caveat dan Kalam, SIL Open Font License.', url: 'https://fonts.google.com' },
                ]
            },
        ],
        testers: 'Dan terima kasih kepada setiap tester yang mencuba aplikasi ini sebelum orang lain.',
        back: 'Kembali ke laman utama',
    },
    auth: {
        backHome: 'Ke laman utama',
        missing: 'Pautan ini tidak lengkap. Buka semula pautan daripada emel anda.',
        expired: 'Pautan ini sudah tamat atau telah digunakan.',
        rate: 'Terlalu banyak cubaan. Cuba lagi dalam seminit.',
        network: 'Tidak dapat menghubungi Bukuresipi. Semak sambungan internet dan cuba lagi.',
        working: 'Sebentar...',
        verify: {
            title: 'Sahkan emel',
            text: 'Tekan butang di bawah untuk mengesahkan emel akaun Bukuresipi anda.',
            button: 'Sahkan emel',
            done: 'Emel anda telah disahkan. Anda boleh kembali ke aplikasi.',
            again: 'Minta pautan pengesahan baharu dari aplikasi Bukuresipi.',
        },
        reset: {
            title: 'Tetapkan kata laluan baharu',
            text: 'Pilih kata laluan baharu untuk akaun Bukuresipi anda.',
            label: 'Kata laluan baharu',
            confirm: 'Sahkan kata laluan',
            show: 'Tunjuk kata laluan',
            strength: 'Kekuatan kata laluan',
            levels: { weak: 'Lemah', fair: 'Sederhana', good: 'Baik', strong: 'Kuat' },
            rules: {
                length: 'Sekurang-kurangnya 8 aksara (wajib)',
                lower: 'Satu huruf kecil',
                upper: 'Satu huruf besar',
                number: 'Satu nombor',
                symbol: 'Satu simbol, seperti ! @ # atau ruang',
                long: '12 aksara atau lebih',
            },
            mismatch: 'Kata laluan tidak sepadan.',
            button: 'Simpan kata laluan',
            weak: 'Gunakan 8 hingga 72 aksara, bukan ruang kosong sahaja.',
            done: 'Kata laluan disimpan. Log masuk di aplikasi dengan kata laluan baharu. Peranti lain telah dilog keluar.',
            again: 'Minta pautan baharu',
        },
        forgot: {
            title: 'Lupa kata laluan',
            text: 'Masukkan emel akaun anda. Kami akan hantar pautan untuk tetapkan kata laluan baharu.',
            label: 'Emel',
            button: 'Hantar pautan',
            invalid: 'Masukkan alamat emel yang sah.',
            done: 'Jika emel ini berdaftar, pautan telah dihantar. Semak peti masuk dan folder spam. Pautan sah selama 1 jam.',
        },
        delete: {
            title: 'Padam akaun',
            text: 'Ini memadam akaun Bukuresipi anda serta-merta dan tidak boleh dibatalkan: tempat dan resipi yang disimpan, perkongsian dan tangkapan skrin, penilaian dan ulasan, serta laporan anda. Restoran yang dikongsi oleh pengguna lain kekal.',
            email: 'Emel',
            password: 'Kata laluan',
            button: 'Padam akaun saya',
            confirm: 'Padam akaun ini selama-lamanya?',
            invalid: 'Masukkan alamat emel yang sah.',
            wrong: 'Emel atau kata laluan salah. Lupa kata laluan? Tetapkan semula dahulu.',
            owner: 'Akaun pemilik tidak boleh dipadam.',
            done: 'Akaun anda telah dipadam. Terima kasih kerana menggunakan Bukuresipi.',
        },
    },
    notFound: { title: 'Halaman tidak dijumpai', text: 'Halaman ini tiada atau telah dipindahkan.', home: 'Ke laman utama' },
    family: {
        title: 'Jemputan keluarga',
        h1: 'Anda dijemput ke keluarga di Bukuresipi',
        lead: 'Satu keluarga berkongsi satu buku: kedai makan yang disimpan oleh sesiapa dalam keluarga muncul dalam buku dan peta semua, dan resipi boleh dikongsi bersama.',
        steps: [
            ['Sudah ada aplikasi?', 'Buka semula pautan ini dari WhatsApp (atau di mana anda menerimanya). Ia akan dibuka dalam Bukuresipi dan bertanya sama ada anda mahu menyertai.'],
            ['Belum ada?', 'Pasang Bukuresipi, log masuk, kemudian ketik pautan jemputan sekali lagi.'],
        ],
        note: 'Pautan jemputan tamat tempoh selepas 7 hari. Minta pautan baharu daripada pemilik keluarga jika ia tidak berfungsi lagi.',
    },
}

const en: typeof ms = {
    htmlLang: 'en',
    ogLocale: 'en_MY',
    other: { lang: 'ms', label: 'Bahasa Melayu' },
    nav: { how: 'How it works', faq: 'FAQ' },
    home: {
        title: 'Bukuresipi: save recipes and places to eat from TikTok, Instagram and YouTube',
        description:
            'Found a great recipe or food spot on TikTok, Instagram, Facebook or YouTube? Share it to Bukuresipi. Recipes go into your book, restaurants onto your map.',
        ogAlt: 'Bukuresipi: a TikTok recipe copied into an exercise book',
        eyebrow: 'Recipe book and food map',
        h1: 'The recipe you found on TikTok, kept in one book.',
        lead: 'Share a link or a screenshot to Bukuresipi. Ingredients, steps and the restaurant name are copied from the post itself, straight into your recipe book and map.',
        soon: 'Coming soon',
        play: 'Google Play',
        notebook: {
            dish: 'Ayam masak merah',
            lines: [
                ['2 whole', ' chickens, cut into 12'],
                ['10', ' dried chillies, soaked'],
                ['3 tbsp', ' tomato sauce'],
            ],
            gap: 'salt: not mentioned in the video',
            place: 'Warung Mak Teh',
            area: 'Kuala Terengganu, 2 branches',
            halal: '"All our food is halal"',
            halalSource: 'quoted from the caption',
        },
        stepsTitle: 'From scroll to saved',
        steps: [
            ['Share', 'Tap Share in TikTok, Instagram, Facebook, YouTube or any website, then pick Bukuresipi.'],
            ['We read it', 'The caption, on-screen text and page details tell us whether it is a recipe or a place to eat.'],
            ['Saved', 'Recipes go into your book. Restaurants get a pin on your map, with their branches.'],
        ],
        bookTitle: 'Recipe book',
        bookText:
            'Quantities are kept as written: "a small handful" stays a small handful. Steps stay in order, and ingredients are matched to a catalogue so allergens like nuts or milk are marked.',
        mapTitle: 'Food map',
        mapText: 'Every place you save shows up on your map. Bukuresipi finds its other branches too, so you know which one is closest.',
        honestTitle: 'Nothing made up.',
        honestLead:
            'Every ingredient, step and restaurant name has to come from the post. If the video never gives a quantity, Bukuresipi writes "not mentioned" instead of guessing.',
        honest: [
            ['No pin beats a wrong pin', 'An address that cannot be placed is saved without a pin.'],
            ['Halal is a quote, not a certificate', "You see the restaurant's own words and where they came from, never a \"verified\" badge."],
        ],
        worksWith: 'Works with',
        platforms: ['TikTok', 'Instagram', 'Facebook', 'YouTube', 'Google Maps', 'Recipe websites', 'Screenshots'],
        faqTitle: 'Frequently asked questions',
        faq: [
            ['What can I share?', 'Links from TikTok, Instagram, Facebook, YouTube, Google Maps and recipe websites, or a screenshot from any app.'],
            ['Is the halal information verified?', 'No. Bukuresipi shows what the restaurant or post itself says, with its source. It is not JAKIM certification, so check for the halal logo at the premises.'],
            ['What if a post is incomplete?', 'The recipe is still saved, and the missing parts are clearly marked so you can fill them in yourself.'],
            ['When does the app launch?', 'The Android version is in testing, and the Google Play button on this page goes live as soon as it is available.'],
            ['Is there an iPhone version?', "Not for now. An iPhone version needs a paid Apple developer account, so we'll start once we have a sponsor."],
            ['Which languages are supported?', 'Malay and English. Recipes are kept in the language of the original post.'],
        ],
        ctaTitle: 'Your recipe book, filled by your scrolling.',
        ctaText: 'The Android build is in testing.',
        footer: 'Recipes and places to eat from social media, kept in one place.',
        footerTop: 'Back to top',
        footerDelete: 'Delete account',
        footerCredits: 'Credits',
        footerPrivacy: 'Privacy',
        footerTerms: 'Terms',
        tester: {
            title: 'Become an Android tester',
            text: 'We are looking for testers for the Android build. Leave your Google (Gmail) account email: Google Play sends the invite when the build is ready.',
            label: 'Google account email',
            placeholder: 'you@gmail.com',
            button: 'Join as a tester',
            note: 'Android only for now; no iPhone version yet.',
            invalid: 'Enter a valid email address.',
            done: "Thanks! You're on the list. The invite comes from Google Play to this email.",
            disposable: 'Use a permanent email address, not a temporary one.',
            rate: 'Too many tries. Try again in a moment.',
            network: "Couldn't send. Check your connection and try again.",
            hero: 'Join the Android beta',
        },
    },
    terms: {
        title: 'Terms of Use - Bukuresipi',
        description: 'The rules for using Bukuresipi: your account, what you share, how accurate the information is, and liability.',
        heading: 'Terms of Use',
        updated: 'Updated 6 November 2026',
        intro: 'Bukuresipi is run by Hafiz Bahtiar in Malaysia. By using the app or this website you agree to these terms. How we handle your data is in the Privacy Policy.',
        sections: [
            {
                title: 'Your account', items: [
                    'You must be 13 or older.',
                    'Use a real email and keep your password safe. You are responsible for what is done with your account.',
                    'One account per person. Do not pretend to be someone else.',
                ]
            },
            {
                title: 'What you share', items: [
                    'Share only posts that are public or that you have the right to share. The original post stays its creator\'s; Bukuresipi keeps the link and what it reads from it for you.',
                    'Your recipes, notes, reviews and photos stay yours. You let us store, process and show them to you, your family, or the community, as you choose.',
                ]
            },
            {
                title: 'Rules', paras: ['Do not use Bukuresipi for:'], items: [
                    'spam, advertising, or fake reviews and ratings;',
                    'insulting, sexual, hateful, harassing or illegal content;',
                    'false information about a restaurant, including false halal claims;',
                    'bots, scraping, getting around limits, or attacking the service.',
                ]
            },
            {
                title: 'Moderation', paras: [
                    'We may hide or remove content, and suspend or close accounts, that break these terms. You can report reviews and recipes in the app.',
                ]
            },
            {
                title: 'Accuracy', items: [
                    'Recipes and restaurant details are read automatically (by AI) from posts, and can be wrong or incomplete. Check before you cook or go.',
                    'The allergen list only covers the ingredients we recognised. No list means "unknown", not "allergen free". If you have an allergy, check every ingredient yourself.',
                    'Halal shown is a quote from the source, with its link. It is not halal certification (for example JAKIM). Confirm with the restaurant.',
                    'Restaurant locations, addresses and branches can be wrong or out of date.',
                ]
            },
            {
                title: 'The service', items: [
                    'Bukuresipi is free for now. We may show ads or offer a paid plan in the future, and will say so first.',
                    'We may change, limit or stop features. There are daily limits (for example shares per day).',
                ]
            },
            {
                title: 'Ending', paras: [
                    'You can delete your account at any time in the app or on the Delete account page. We may close accounts that break these terms.',
                ]
            },
            {
                title: 'Liability', paras: [
                    'Bukuresipi is provided "as is". As far as the law allows, we are not liable for indirect loss from using it, including wrong information. Nothing in these terms limits your rights under Malaysia\'s Consumer Protection Act 1999 or other law that cannot be set aside.',
                ]
            },
            {
                title: 'Law', paras: [
                    'These terms are governed by the laws of Malaysia.',
                ]
            },
            {
                title: 'Changes and contact', paras: [
                    'If these terms change, we update the date above, and tell you in the app for a big change.',
                    'Questions: hafiz@hafizbahtiar.com',
                ]
            },
        ],
        deleteLink: 'Delete account',
        back: 'Back to home',
    },
    privacy: {
        title: 'Privacy Policy - Bukuresipi',
        description: 'What data Bukuresipi collects, what for, who processes it, and how to delete it.',
        heading: 'Privacy Policy',
        updated: 'Updated 6 November 2026',
        intro: 'Bukuresipi saves the recipes and places to eat you share from social media. This page explains what data we collect, why, and how to delete it. We do not sell your data and show no ads.',
        sections: [
            {
                title: 'What we collect', items: [
                    'Account: your email, password (stored as a bcrypt hash, never as text), the name you set, and the app language.',
                    'Sign in with Google: your Google account ID, email and name. No profile photo, contacts or anything else.',
                    'What you share: post links, screenshots, and the text we read from them (captions, page descriptions).',
                    'Your content: recipes, saved places, notes, shopping lists, ratings, reviews, votes, reports, and map pins you place.',
                    'Signed-in devices: device name and model, Android and app version, and an approximate city from your IP address (for the "Signed-in devices" page).',
                    'A notification token (Firebase), to send notifications to your phone.',
                    'Location: only while you search for places nearby. It is used for that search and not stored.',
                    'The tester form on this website: the email you enter.',
                ]
            },
            {
                title: 'What we use it for', items: [
                    'Turning the posts you share into recipes or places to eat, and showing them to you.',
                    'Sign-in, account security (for example new sign-in alerts), and account emails (confirm email, reset password).',
                    'Sharing with your family: members see your name, and the places and recipes you did not mark "Only me". Your email is never shown to other users.',
                    'Recipes you publish to the community, and your reviews, can be seen by other users with your name.',
                ]
            },
            {
                title: 'Who processes data', paras: [
                    'We use these services to run Bukuresipi. Each gets only what its job needs:',
                ], items: [
                    'Cloudflare: servers, database, image storage, and Workers AI, which reads posts and screenshots.',
                    'Command Code (DeepSeek models): reads post text to pull out a recipe or a restaurant\'s details.',
                    'Google Firebase: sends notifications. Google Sign-In: signing in with Google.',
                    'Resend: sends account emails.',
                    'OpenStreetMap (Nominatim, Overpass), Photon, HERE and Parallel: find a restaurant\'s location from its name and address. Your location is not sent.',
                ]
            },
            {
                title: 'Keeping and deleting', items: [
                    'Your data is kept while your account exists. Each sign-in ends after 30 days, then you sign in again.',
                    'You can delete your account in the app (Account > Delete account) or on the Delete account page. This deletes your account, screenshots, recipes, saved places, ratings, reviews and devices at once.',
                    'What stays: public restaurant details (name, address, location) shared by all users, and thumbnails of public posts. They are no longer linked to you.',
                ]
            },
            {
                title: 'Security', items: [
                    'Every connection uses HTTPS. Passwords are stored as hashes, and email links work once.',
                    'Your screenshots are stored privately; only you (and your family, for a shared place) can see them.',
                ]
            },
            {
                title: 'Children', paras: [
                    'Bukuresipi is not for children under 13, and we do not knowingly collect their data.',
                ]
            },
            {
                title: 'Your rights', paras: [
                    'Under Malaysia\'s Personal Data Protection Act 2010, you can ask for a copy of your data, a correction, or its deletion. Most of this can be done in the app; for anything else, email us.',
                ]
            },
            {
                title: 'Contact us', paras: [
                    'Questions or requests about your data: hafiz@hafizbahtiar.com',
                    'If this policy changes, we update the date above, and tell you in the app for a big change.',
                ]
            },
        ],
        deleteLink: 'Delete account',
        back: 'Back to home',
    },
    credits: {
        title: 'Credits - Bukuresipi',
        description: 'Who Bukuresipi was built for, and the open sources and services that make it possible.',
        dedicationKicker: 'For my lovely wife',
        dedication: [
            'I built Bukuresipi for my wife, so every recipe and food spot she loves has one place, instead of getting lost in the scroll.',
            "Now it's for everyone. If it's useful to you too, that's a second gift I truly appreciate.",
        ],
        thanksTitle: 'Thank you',
        thanksText: 'Bukuresipi stands on the work of many people. The maps, place data and tools are shared openly or provided by:',
        groups: [
            {
                title: 'Map', items: [
                    { name: 'OpenStreetMap contributors', detail: 'Map data, ODbL.', url: 'https://www.openstreetmap.org/copyright' },
                    { name: 'OpenFreeMap', detail: 'Map tiles and the Liberty style.', url: 'https://openfreemap.org' },
                    { name: 'OpenMapTiles', detail: 'Map data schema.', url: 'https://openmaptiles.org' },
                    { name: 'MapLibre', detail: 'Map renderer, BSD.', url: 'https://maplibre.org' },
                ]
            },
            {
                title: 'Place data and addresses', items: [
                    { name: 'Overture Maps', detail: 'Place data, CDLA-Permissive-2.0.', url: 'https://overturemaps.org' },
                    { name: 'Nominatim', detail: 'Address to location, from OpenStreetMap.', url: 'https://nominatim.org' },
                    { name: 'Photon', detail: 'Address to location.', url: 'https://photon.komoot.io' },
                    { name: 'HERE', detail: 'Finding shops by name.', url: 'https://www.here.com' },
                    { name: 'Parallel', detail: 'Web search for branch addresses.', url: 'https://parallel.ai' },
                ]
            },
            {
                title: 'Built with', items: [
                    { name: 'Flutter', detail: 'The app, BSD.', url: 'https://flutter.dev' },
                    { name: 'Cloudflare', detail: 'Workers, D1, R2 and Workers AI.', url: 'https://www.cloudflare.com' },
                    { name: 'Hono', detail: 'The API, MIT.', url: 'https://hono.dev' },
                    { name: 'Drizzle ORM', detail: 'Database, Apache-2.0.', url: 'https://orm.drizzle.team' },
                    { name: 'Astro', detail: 'This website, MIT.', url: 'https://astro.build' },
                    { name: 'Google Fonts', detail: 'Familjen Grotesk, Caveat and Kalam, SIL Open Font License.', url: 'https://fonts.google.com' },
                ]
            },
        ],
        testers: 'And thank you to every tester who tried the app before anyone else.',
        back: 'Back to the home page',
    },
    auth: {
        backHome: 'Go to the home page',
        missing: 'This link is incomplete. Open the link from your email again.',
        expired: 'This link has expired or was already used.',
        rate: 'Too many tries. Try again in a minute.',
        network: 'Could not reach Bukuresipi. Check your internet connection and try again.',
        working: 'One moment...',
        verify: {
            title: 'Confirm your email',
            text: 'Press the button below to confirm the email for your Bukuresipi account.',
            button: 'Confirm email',
            done: 'Your email is confirmed. You can go back to the app.',
            again: 'Ask for a new confirmation link in the Bukuresipi app.',
        },
        reset: {
            title: 'Set a new password',
            text: 'Choose a new password for your Bukuresipi account.',
            label: 'New password',
            confirm: 'Confirm password',
            show: 'Show passwords',
            strength: 'Password strength',
            levels: { weak: 'Weak', fair: 'Fair', good: 'Good', strong: 'Strong' },
            rules: {
                length: 'At least 8 characters (required)',
                lower: 'A lowercase letter',
                upper: 'An uppercase letter',
                number: 'A number',
                symbol: 'A symbol, like ! @ # or a space',
                long: '12 characters or more',
            },
            mismatch: 'The passwords do not match.',
            button: 'Save password',
            weak: 'Use 8 to 72 characters, not only spaces.',
            done: 'Password saved. Sign in to the app with your new password. Other devices have been signed out.',
            again: 'Ask for a new link',
        },
        forgot: {
            title: 'Forgot password',
            text: "Enter your account's email. We'll send you a link to set a new password.",
            label: 'Email',
            button: 'Send link',
            invalid: 'Enter a valid email address.',
            done: 'If this email is registered, a link is on its way. Check your inbox and spam folder. The link works for 1 hour.',
        },
        delete: {
            title: 'Delete account',
            text: 'This deletes your Bukuresipi account at once and cannot be undone: your saved places and recipes, shares and screenshots, ratings and reviews, and your reports. Restaurants other users shared stay.',
            email: 'Email',
            password: 'Password',
            button: 'Delete my account',
            confirm: 'Delete this account for good?',
            invalid: 'Enter a valid email address.',
            wrong: 'Wrong email or password. Forgot your password? Reset it first.',
            owner: 'The owner account cannot be deleted.',
            done: 'Your account has been deleted. Thank you for using Bukuresipi.',
        },
    },
    notFound: { title: 'Page not found', text: 'This page does not exist or has moved.', home: 'Go to the home page' },
    family: {
        title: 'Family invite',
        h1: "You're invited to a family on Bukuresipi",
        lead: 'A family shares one book: a place anyone in the family saves shows in everyone\'s book and map, and recipes can be shared too.',
        steps: [
            ['Have the app?', 'Open this link again from WhatsApp (or wherever you got it). It opens in Bukuresipi and asks if you want to join.'],
            ['Not yet?', 'Install Bukuresipi, sign in, then tap the invite link again.'],
        ],
        note: 'Invite links expire after 7 days. Ask the family owner for a new link if this one no longer works.',
    },
}

export const t = (lang: Lang) => (lang === 'en' ? en : ms)
