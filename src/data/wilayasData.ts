export interface WilayaData {
  code: string;
  name: string;
  avgPriceM2DZD: number;
  communes: { name: string; multiplier: number }[];
}

export const WILAYAS_DATA: WilayaData[] = [
  {
    code: "01",
    name: "Adrar",
    avgPriceM2DZD: 65000,
    communes: [
      { name: "Adrar Centre", multiplier: 1.2 },
      { name: "Reggane", multiplier: 0.9 },
      { name: "Zaouiet Kounta", multiplier: 0.85 },
      { name: "Fenoughil", multiplier: 0.8 },
      { name: "Aoulef", multiplier: 0.85 },
      { name: "Tamest", multiplier: 0.8 },
      { name: "Tsabit", multiplier: 0.8 }
    ]
  },
  {
    code: "02",
    name: "Chlef",
    avgPriceM2DZD: 95000,
    communes: [
      { name: "Chlef Centre", multiplier: 1.25 },
      { name: "Tenes", multiplier: 1.35 },
      { name: "Oued Sly", multiplier: 0.95 },
      { name: "Boukadir", multiplier: 0.9 },
      { name: "Abou El Hassan", multiplier: 0.85 },
      { name: "El Karimia", multiplier: 0.85 },
      { name: "Ouled Fares", multiplier: 0.9 },
      { name: "Ain Merane", multiplier: 0.85 }
    ]
  },
  {
    code: "03",
    name: "Laghouat",
    avgPriceM2DZD: 75000,
    communes: [
      { name: "Laghouat Centre", multiplier: 1.2 },
      { name: "Aflou", multiplier: 1.05 },
      { name: "Ksar El Hirane", multiplier: 0.85 },
      { name: "Hassi R'Mel", multiplier: 1.15 },
      { name: "Ain Madhi", multiplier: 0.85 },
      { name: "Brida", multiplier: 0.8 }
    ]
  },
  {
    code: "04",
    name: "Oum El Bouaghi",
    avgPriceM2DZD: 85000,
    communes: [
      { name: "Oum El Bouaghi Centre", multiplier: 1.2 },
      { name: "Aïn Beïda", multiplier: 1.1 },
      { name: "Aïn M'lila", multiplier: 1.15 },
      { name: "Ain Kercha", multiplier: 0.95 },
      { name: "Meskiana", multiplier: 0.9 },
      { name: "Dhalaa", multiplier: 0.85 }
    ]
  },
  {
    code: "05",
    name: "Batna",
    avgPriceM2DZD: 115000,
    communes: [
      { name: "Batna Centre", multiplier: 1.25 },
      { name: "Tazoult", multiplier: 0.95 },
      { name: "Barika", multiplier: 1.05 },
      { name: "Arris", multiplier: 0.9 },
      { name: "Ain Touta", multiplier: 0.95 },
      { name: "N'Gaous", multiplier: 0.9 },
      { name: "Merouana", multiplier: 0.9 },
      { name: "Timgad", multiplier: 0.85 }
    ]
  },
  {
    code: "06",
    name: "Béjaïa",
    avgPriceM2DZD: 130000,
    communes: [
      { name: "Béjaïa Ville", multiplier: 1.25 },
      { name: "Tichy", multiplier: 1.4 },
      { name: "Saket", multiplier: 1.35 },
      { name: "El Kseur", multiplier: 0.95 },
      { name: "Akbou", multiplier: 1.15 },
      { name: "Aokas", multiplier: 1.3 },
      { name: "Amizour", multiplier: 1.0 },
      { name: "Tazmalt", multiplier: 1.05 },
      { name: "Souk El Tenine", multiplier: 1.25 },
      { name: "Kherrata", multiplier: 0.9 },
      { name: "Sidi Aïch", multiplier: 1.0 }
    ]
  },
  {
    code: "07",
    name: "Biskra",
    avgPriceM2DZD: 85000,
    communes: [
      { name: "Biskra Centre", multiplier: 1.25 },
      { name: "Tolga", multiplier: 1.05 },
      { name: "Sidi Okba", multiplier: 0.95 },
      { name: "Zeribet El Oued", multiplier: 0.85 },
      { name: "Chetma", multiplier: 0.9 },
      { name: "El Kantara", multiplier: 0.9 }
    ]
  },
  {
    code: "08",
    name: "Béchar",
    avgPriceM2DZD: 70000,
    communes: [
      { name: "Béchar Centre", multiplier: 1.2 },
      { name: "Taghit", multiplier: 1.4 },
      { name: "Kenadsa", multiplier: 0.9 },
      { name: "Abadla", multiplier: 0.85 },
      { name: "Beni Ounif", multiplier: 0.85 }
    ]
  },
  {
    code: "09",
    name: "Blida",
    avgPriceM2DZD: 145000,
    communes: [
      { name: "Blida Centre", multiplier: 1.25 },
      { name: "Bouinan", multiplier: 1.1 },
      { name: "Ouled Yaich", multiplier: 1.05 },
      { name: "Mouzaia", multiplier: 0.95 },
      { name: "Boufarik", multiplier: 1.15 },
      { name: "El Affroun", multiplier: 0.9 },
      { name: "Bougara", multiplier: 0.95 },
      { name: "Larbaa", multiplier: 0.95 },
      { name: "Chréa", multiplier: 1.2 },
      { name: "Meftah", multiplier: 0.95 }
    ]
  },
  {
    code: "10",
    name: "Bouira",
    avgPriceM2DZD: 95000,
    communes: [
      { name: "Bouira Centre", multiplier: 1.2 },
      { name: "Lakhdaria", multiplier: 1.05 },
      { name: "Sour El Ghozlane", multiplier: 0.95 },
      { name: "Aïn Bessem", multiplier: 0.9 },
      { name: "M'Chedallah", multiplier: 0.95 },
      { name: "Haizer", multiplier: 0.9 },
      { name: "Kadiria", multiplier: 0.85 }
    ]
  },
  {
    code: "11",
    name: "Tamanrasset",
    avgPriceM2DZD: 60000,
    communes: [
      { name: "Tamanrasset Ville", multiplier: 1.2 },
      { name: "Abalessa", multiplier: 0.85 },
      { name: "Tazrouk", multiplier: 0.8 },
      { name: "Idles", multiplier: 0.8 },
      { name: "In Amguel", multiplier: 0.85 }
    ]
  },
  {
    code: "12",
    name: "Tébessa",
    avgPriceM2DZD: 80000,
    communes: [
      { name: "Tébessa Centre", multiplier: 1.2 },
      { name: "Bir El Ater", multiplier: 0.9 },
      { name: "Cheria", multiplier: 0.85 },
      { name: "El Ouenza", multiplier: 0.9 },
      { name: "Morsott", multiplier: 0.85 },
      { name: "El Kouif", multiplier: 0.85 }
    ]
  },
  {
    code: "13",
    name: "Tlemcen",
    avgPriceM2DZD: 125000,
    communes: [
      { name: "Mansourah", multiplier: 1.25 },
      { name: "Tlemcen Centre", multiplier: 1.2 },
      { name: "Chetouane", multiplier: 1.0 },
      { name: "Maghnia", multiplier: 1.15 },
      { name: "Remchi", multiplier: 0.95 },
      { name: "Ghazaouet", multiplier: 1.1 },
      { name: "Sebdou", multiplier: 0.85 },
      { name: "Nedroma", multiplier: 0.9 },
      { name: "Hennaya", multiplier: 0.95 }
    ]
  },
  {
    code: "14",
    name: "Tiaret",
    avgPriceM2DZD: 85000,
    communes: [
      { name: "Tiaret Centre", multiplier: 1.2 },
      { name: "Sougueur", multiplier: 1.0 },
      { name: "Frenda", multiplier: 0.9 },
      { name: "Mahdia", multiplier: 0.85 },
      { name: "Ksar Chellala", multiplier: 0.9 },
      { name: "Dahmouni", multiplier: 0.85 }
    ]
  },
  {
    code: "15",
    name: "Tizi Ouzou",
    avgPriceM2DZD: 120000,
    communes: [
      { name: "Tizi Ouzou Centre", multiplier: 1.25 },
      { name: "Azazga", multiplier: 1.15 },
      { name: "Tigzirt", multiplier: 1.4 },
      { name: "Draa El Mizan", multiplier: 0.95 },
      { name: "Boghni", multiplier: 0.95 },
      { name: "Azeffoun", multiplier: 1.35 },
      { name: "Larbaa Nath Irathen", multiplier: 0.95 },
      { name: "Ain El Hammam", multiplier: 0.9 },
      { name: "Beni Douala", multiplier: 0.95 },
      { name: "Tadmaït", multiplier: 0.9 }
    ]
  },
  {
    code: "16",
    name: "Alger",
    avgPriceM2DZD: 220000,
    communes: [
      { name: "Hydra", multiplier: 1.65 },
      { name: "El Biar", multiplier: 1.5 },
      { name: "Ben Aknoun", multiplier: 1.45 },
      { name: "Dely Ibrahim", multiplier: 1.35 },
      { name: "Cheraga", multiplier: 1.3 },
      { name: "Kouba", multiplier: 1.2 },
      { name: "Bab Ezzouar", multiplier: 1.1 },
      { name: "Zeralda", multiplier: 1.15 },
      { name: "Ain Taya", multiplier: 1.25 },
      { name: "Draria", multiplier: 1.15 },
      { name: "Saoula", multiplier: 1.05 },
      { name: "Bir Mourad Raïs", multiplier: 1.4 },
      { name: "Bordj El Kiffan", multiplier: 1.05 },
      { name: "El Harrach", multiplier: 1.0 },
      { name: "Said Hamdine", multiplier: 1.35 },
      { name: "Rouiba", multiplier: 1.1 },
      { name: "Staoueli", multiplier: 1.35 },
      { name: "Bouzaréah", multiplier: 1.15 },
      { name: "Hussein Dey", multiplier: 1.1 },
      { name: "Telemly", multiplier: 1.3 },
      { name: "Sidi M'Hamed", multiplier: 1.2 },
      { name: "Belouizdad", multiplier: 1.1 },
      { name: "Ain Benian", multiplier: 1.2 },
      { name: "Khraicia", multiplier: 1.0 },
      { name: "Baba Hassen", multiplier: 1.05 },
      { name: "Douera", multiplier: 1.0 },
      { name: "Ouled Fayet", multiplier: 1.25 },
      { name: "Bordj El Bahri", multiplier: 1.1 },
      { name: "Reghaia", multiplier: 1.05 }
    ]
  },
  {
    code: "17",
    name: "Djelfa",
    avgPriceM2DZD: 75000,
    communes: [
      { name: "Djelfa Centre", multiplier: 1.2 },
      { name: "Aïn Oussera", multiplier: 1.05 },
      { name: "Hassi Bahbah", multiplier: 0.95 },
      { name: "Messaad", multiplier: 0.9 },
      { name: "Dar Chioukh", multiplier: 0.85 },
      { name: "El Idrissia", multiplier: 0.85 }
    ]
  },
  {
    code: "18",
    name: "Jijel",
    avgPriceM2DZD: 125000,
    communes: [
      { name: "Jijel Centre", multiplier: 1.25 },
      { name: "Ziama Mansouriah", multiplier: 1.45 },
      { name: "El Aouana", multiplier: 1.35 },
      { name: "Taher", multiplier: 1.05 },
      { name: "El Milia", multiplier: 0.95 },
      { name: "Texenna", multiplier: 0.9 },
      { name: "Chekfa", multiplier: 0.9 }
    ]
  },
  {
    code: "19",
    name: "Sétif",
    avgPriceM2DZD: 140000,
    communes: [
      { name: "Tandja / Centre-ville", multiplier: 1.35 },
      { name: "El Bez", multiplier: 1.15 },
      { name: "Cité 1004 Logements", multiplier: 1.1 },
      { name: "Ain Arnat", multiplier: 0.95 },
      { name: "El Eulma", multiplier: 1.25 },
      { name: "Ain Oulmene", multiplier: 1.0 },
      { name: "Ain El Kebira", multiplier: 0.95 },
      { name: "Bougaa", multiplier: 0.9 }
    ]
  },
  {
    code: "20",
    name: "Saïda",
    avgPriceM2DZD: 75000,
    communes: [
      { name: "Saïda Centre", multiplier: 1.2 },
      { name: "Aïn El Hadjar", multiplier: 0.9 },
      { name: "Youb", multiplier: 0.85 },
      { name: "El Hassasna", multiplier: 0.85 }
    ]
  },
  {
    code: "21",
    name: "Skikda",
    avgPriceM2DZD: 115000,
    communes: [
      { name: "Skikda Centre", multiplier: 1.25 },
      { name: "Collo", multiplier: 1.35 },
      { name: "El Harrouch", multiplier: 0.95 },
      { name: "Azzaba", multiplier: 0.9 },
      { name: "Tamalous", multiplier: 0.9 },
      { name: "Ben Ziad", multiplier: 0.85 }
    ]
  },
  {
    code: "22",
    name: "Sidi Bel Abbès",
    avgPriceM2DZD: 105000,
    communes: [
      { name: "Sidi Bel Abbès Centre", multiplier: 1.25 },
      { name: "Sfisef", multiplier: 0.95 },
      { name: "Telagh", multiplier: 0.85 },
      { name: "Ben Badis", multiplier: 0.85 },
      { name: "Ain El Berd", multiplier: 0.9 },
      { name: "Tessala", multiplier: 0.9 }
    ]
  },
  {
    code: "23",
    name: "Annaba",
    avgPriceM2DZD: 150000,
    communes: [
      { name: "Seraidi", multiplier: 1.4 },
      { name: "Annaba Centre", multiplier: 1.3 },
      { name: "Chapuis / Saint Cloud", multiplier: 1.45 },
      { name: "El Bouni", multiplier: 0.95 },
      { name: "El Hadjar", multiplier: 1.0 },
      { name: "Berrahal", multiplier: 0.9 },
      { name: "Chetaïbi", multiplier: 1.3 },
      { name: "Draa El Riche", multiplier: 1.05 }
    ]
  },
  {
    code: "24",
    name: "Guelma",
    avgPriceM2DZD: 90000,
    communes: [
      { name: "Guelma Centre", multiplier: 1.2 },
      { name: "Hammam Debagh", multiplier: 1.3 },
      { name: "Oued Zenati", multiplier: 0.9 },
      { name: "Bouchegouf", multiplier: 0.9 },
      { name: "Heliopolis", multiplier: 0.95 }
    ]
  },
  {
    code: "25",
    name: "Constantine",
    avgPriceM2DZD: 135000,
    communes: [
      { name: "Bellevue / Centre", multiplier: 1.3 },
      { name: "ZHUN Ali Mendjeli", multiplier: 1.1 },
      { name: "Ziadia", multiplier: 1.05 },
      { name: "Nouvelle Ville Massinissa", multiplier: 1.0 },
      { name: "El Khroub", multiplier: 0.95 },
      { name: "Hamma Bouziane", multiplier: 0.9 },
      { name: "Zighoud Youcef", multiplier: 0.85 },
      { name: "Didouche Mourad", multiplier: 0.9 },
      { name: "Ain Smara", multiplier: 1.05 }
    ]
  },
  {
    code: "26",
    name: "Médéa",
    avgPriceM2DZD: 95000,
    communes: [
      { name: "Médéa Centre", multiplier: 1.2 },
      { name: "Berrouaghia", multiplier: 1.0 },
      { name: "Ksar El Boukhari", multiplier: 0.85 },
      { name: "Tablat", multiplier: 0.85 },
      { name: "Ain Boucif", multiplier: 0.8 },
      { name: "El Omaria", multiplier: 0.85 }
    ]
  },
  {
    code: "27",
    name: "Mostaganem",
    avgPriceM2DZD: 120000,
    communes: [
      { name: "Salamandre", multiplier: 1.4 },
      { name: "Kharouba", multiplier: 1.25 },
      { name: "Sablettes", multiplier: 1.35 },
      { name: "Mostaganem Ville", multiplier: 1.1 },
      { name: "Ain Tedles", multiplier: 0.9 },
      { name: "Sidi Ali", multiplier: 0.9 },
      { name: "Mazagran", multiplier: 1.2 },
      { name: "Hassi Mameche", multiplier: 1.0 }
    ]
  },
  {
    code: "28",
    name: "M'Sila",
    avgPriceM2DZD: 80000,
    communes: [
      { name: "M'Sila Centre", multiplier: 1.2 },
      { name: "Bou Saâda", multiplier: 1.25 },
      { name: "Sidi Aïssa", multiplier: 0.9 },
      { name: "Ain El Melh", multiplier: 0.85 },
      { name: "Magra", multiplier: 0.85 },
      { name: "Hammam Dhalaa", multiplier: 0.85 }
    ]
  },
  {
    code: "29",
    name: "Mascara",
    avgPriceM2DZD: 90000,
    communes: [
      { name: "Mascara Centre", multiplier: 1.2 },
      { name: "Sig", multiplier: 1.05 },
      { name: "Mohammadia", multiplier: 1.0 },
      { name: "Tighennif", multiplier: 0.9 },
      { name: "Ghriss", multiplier: 0.85 },
      { name: "Bouhanifia", multiplier: 1.1 }
    ]
  },
  {
    code: "30",
    name: "Ouargla",
    avgPriceM2DZD: 95000,
    communes: [
      { name: "Ouargla Centre", multiplier: 1.2 },
      { name: "Hassi Messaoud", multiplier: 1.5 },
      { name: "Rouissat", multiplier: 0.95 },
      { name: "N'Goussa", multiplier: 0.85 }
    ]
  },
  {
    code: "31",
    name: "Oran",
    avgPriceM2DZD: 165000,
    communes: [
      { name: "Akid Lotfi", multiplier: 1.4 },
      { name: "Bir El Djir", multiplier: 1.3 },
      { name: "Salamandre / Canastel", multiplier: 1.45 },
      { name: "Oran Centre (Es Seddikia)", multiplier: 1.35 },
      { name: "Belgaid", multiplier: 1.15 },
      { name: "Maraval", multiplier: 1.1 },
      { name: "Ain El Turk", multiplier: 1.25 },
      { name: "Misserghin", multiplier: 0.95 },
      { name: "Arzew", multiplier: 1.15 },
      { name: "Bethioua", multiplier: 1.05 },
      { name: "Bousfer", multiplier: 1.2 },
      { name: "Kristel", multiplier: 1.15 },
      { name: "Mers El Kébir", multiplier: 1.2 },
      { name: "Gdyel", multiplier: 0.95 },
      { name: "Es Senia", multiplier: 1.1 }
    ]
  },
  {
    code: "32",
    name: "El Bayadh",
    avgPriceM2DZD: 65000,
    communes: [
      { name: "El Bayadh Centre", multiplier: 1.2 },
      { name: "Brezina", multiplier: 0.85 },
      { name: "El Abiodh Sidi Cheikh", multiplier: 0.9 },
      { name: "Rogassa", multiplier: 0.8 }
    ]
  },
  {
    code: "33",
    name: "Illizi",
    avgPriceM2DZD: 70000,
    communes: [
      { name: "Illizi Centre", multiplier: 1.2 },
      { name: "In Amenas", multiplier: 1.4 },
      { name: "Bordj Omar Driss", multiplier: 0.85 }
    ]
  },
  {
    code: "34",
    name: "Bordj Bou Arréridj",
    avgPriceM2DZD: 110000,
    communes: [
      { name: "Bordj Bou Arréridj Centre", multiplier: 1.25 },
      { name: "Ras El Oued", multiplier: 1.05 },
      { name: "Bordj Ghedir", multiplier: 0.9 },
      { name: "Mansoura", multiplier: 0.85 },
      { name: "El Achir", multiplier: 0.9 }
    ]
  },
  {
    code: "35",
    name: "Boumerdès",
    avgPriceM2DZD: 155000,
    communes: [
      { name: "Boumerdès Centre", multiplier: 1.35 },
      { name: "Zemmouri", multiplier: 1.25 },
      { name: "Dellys", multiplier: 1.2 },
      { name: "Corso", multiplier: 1.3 },
      { name: "Khemis El Khechna", multiplier: 1.1 },
      { name: "Bordj Menaïel", multiplier: 1.05 },
      { name: "Boudouaou", multiplier: 1.15 },
      { name: "Isser", multiplier: 0.95 },
      { name: "Thenia", multiplier: 1.0 },
      { name: "Cap Djinet", multiplier: 1.2 }
    ]
  },
  {
    code: "36",
    name: "El Tarf",
    avgPriceM2DZD: 95000,
    communes: [
      { name: "El Tarf Centre", multiplier: 1.2 },
      { name: "El Kala", multiplier: 1.45 },
      { name: "Ben M'Hidi", multiplier: 1.0 },
      { name: "Besbes", multiplier: 0.9 },
      { name: "Bouteldja", multiplier: 0.9 },
      { name: "Drean", multiplier: 0.95 }
    ]
  },
  {
    code: "37",
    name: "Tindouf",
    avgPriceM2DZD: 60000,
    communes: [
      { name: "Tindouf Ville", multiplier: 1.2 },
      { name: "Oumm El Assel", multiplier: 0.85 }
    ]
  },
  {
    code: "38",
    name: "Tissemsilt",
    avgPriceM2DZD: 70000,
    communes: [
      { name: "Tissemsilt Centre", multiplier: 1.2 },
      { name: "Theniet El Had", multiplier: 0.95 },
      { name: "Lardjem", multiplier: 0.85 },
      { name: "Bordj Bounaama", multiplier: 0.85 }
    ]
  },
  {
    code: "39",
    name: "El Oued",
    avgPriceM2DZD: 80000,
    communes: [
      { name: "El Oued Centre", multiplier: 1.2 },
      { name: "Guemar", multiplier: 0.95 },
      { name: "Bayadha", multiplier: 0.9 },
      { name: "Robbah", multiplier: 0.85 },
      { name: "Magrane", multiplier: 0.85 },
      { name: "Reguiba", multiplier: 0.85 }
    ]
  },
  {
    code: "40",
    name: "Khenchela",
    avgPriceM2DZD: 75000,
    communes: [
      { name: "Khenchela Centre", multiplier: 1.2 },
      { name: "Kais", multiplier: 0.95 },
      { name: "Chechar", multiplier: 0.85 },
      { name: "El Hamma", multiplier: 0.85 },
      { name: "Bouhmama", multiplier: 0.85 }
    ]
  },
  {
    code: "41",
    name: "Souk Ahras",
    avgPriceM2DZD: 85000,
    communes: [
      { name: "Souk Ahras Centre", multiplier: 1.2 },
      { name: "Sedrata", multiplier: 0.95 },
      { name: "Taoura", multiplier: 0.85 },
      { name: "M'Daourouch", multiplier: 0.9 },
      { name: "Merahna", multiplier: 0.85 }
    ]
  },
  {
    code: "42",
    name: "Tipaza",
    avgPriceM2DZD: 160000,
    communes: [
      { name: "Tipaza Ville", multiplier: 1.4 },
      { name: "Cherchell", multiplier: 1.3 },
      { name: "Bou Ismail", multiplier: 1.25 },
      { name: "Kolea", multiplier: 1.2 },
      { name: "Fouka", multiplier: 1.2 },
      { name: "Damous", multiplier: 0.95 },
      { name: "Gouraya", multiplier: 1.0 },
      { name: "Hadjout", multiplier: 1.1 },
      { name: "Sidi Ghiles", multiplier: 1.05 }
    ]
  },
  {
    code: "43",
    name: "Mila",
    avgPriceM2DZD: 90000,
    communes: [
      { name: "Mila Centre", multiplier: 1.2 },
      { name: "Chelghoum Laïd", multiplier: 1.1 },
      { name: "Teleghma", multiplier: 0.95 },
      { name: "Tadjenanet", multiplier: 1.05 },
      { name: "Grarem Gouga", multiplier: 0.9 }
    ]
  },
  {
    code: "44",
    name: "Aïn Defla",
    avgPriceM2DZD: 85000,
    communes: [
      { name: "Aïn Defla Centre", multiplier: 1.2 },
      { name: "Khemis Miliana", multiplier: 1.15 },
      { name: "Miliana", multiplier: 1.1 },
      { name: "El Attaf", multiplier: 0.95 },
      { name: "Hammam Righa", multiplier: 1.05 },
      { name: "Boumedfaa", multiplier: 0.9 }
    ]
  },
  {
    code: "45",
    name: "Naâma",
    avgPriceM2DZD: 65000,
    communes: [
      { name: "Naâma Centre", multiplier: 1.2 },
      { name: "Mecheria", multiplier: 1.05 },
      { name: "Aïn Sefra", multiplier: 0.95 },
      { name: "Tiout", multiplier: 0.8 },
      { name: "Sfissifa", multiplier: 0.8 }
    ]
  },
  {
    code: "46",
    name: "Aïn Témouchent",
    avgPriceM2DZD: 110000,
    communes: [
      { name: "Aïn Témouchent Centre", multiplier: 1.2 },
      { name: "Beni Saf", multiplier: 1.35 },
      { name: "Hammam Bou Hadjar", multiplier: 1.1 },
      { name: "El Malah", multiplier: 0.95 },
      { name: "Terga", multiplier: 1.2 },
      { name: "El Amria", multiplier: 0.95 }
    ]
  },
  {
    code: "47",
    name: "Ghardaïa",
    avgPriceM2DZD: 90000,
    communes: [
      { name: "Ghardaïa Centre", multiplier: 1.25 },
      { name: "El Atteuf", multiplier: 1.15 },
      { name: "Metlili", multiplier: 0.95 },
      { name: "Berriane", multiplier: 0.95 },
      { name: "Guerrara", multiplier: 0.9 },
      { name: "Zelfana", multiplier: 0.9 },
      { name: "Bounoura", multiplier: 1.0 }
    ]
  },
  {
    code: "48",
    name: "Relizane",
    avgPriceM2DZD: 85000,
    communes: [
      { name: "Relizane Centre", multiplier: 1.2 },
      { name: "Oued Rhiou", multiplier: 1.05 },
      { name: "Mazouna", multiplier: 0.9 },
      { name: "Yellel", multiplier: 0.9 },
      { name: "Ammi Moussa", multiplier: 0.85 }
    ]
  },
  {
    code: "49",
    name: "El M'Ghair",
    avgPriceM2DZD: 70000,
    communes: [
      { name: "El M'Ghair Centre", multiplier: 1.2 },
      { name: "Djamaa", multiplier: 1.0 },
      { name: "Um Touyour", multiplier: 0.85 },
      { name: "Stil", multiplier: 0.85 }
    ]
  },
  {
    code: "50",
    name: "El Meniaa",
    avgPriceM2DZD: 65000,
    communes: [
      { name: "El Meniaa Centre", multiplier: 1.2 },
      { name: "Hassi Gara", multiplier: 0.9 },
      { name: "Hassi Fehal", multiplier: 0.85 }
    ]
  },
  {
    code: "51",
    name: "Ouled Djellal",
    avgPriceM2DZD: 70000,
    communes: [
      { name: "Ouled Djellal Centre", multiplier: 1.2 },
      { name: "Sidi Khaled", multiplier: 0.95 },
      { name: "Doucen", multiplier: 0.85 },
      { name: "Chaiba", multiplier: 0.85 }
    ]
  },
  {
    code: "52",
    name: "Bordj Baji Mokhtar",
    avgPriceM2DZD: 55000,
    communes: [
      { name: "Bordj Baji Mokhtar Centre", multiplier: 1.2 },
      { name: "Timiaouine", multiplier: 0.8 }
    ]
  },
  {
    code: "53",
    name: "Béni Abbès",
    avgPriceM2DZD: 60000,
    communes: [
      { name: "Béni Abbès Centre", multiplier: 1.2 },
      { name: "Igli", multiplier: 0.85 },
      { name: "Tabelbala", multiplier: 0.8 },
      { name: "El Ouata", multiplier: 0.8 },
      { name: "Kerzaz", multiplier: 0.8 }
    ]
  },
  {
    code: "54",
    name: "Timimoun",
    avgPriceM2DZD: 65000,
    communes: [
      { name: "Timimoun Centre", multiplier: 1.3 },
      { name: "Aougrout", multiplier: 0.9 },
      { name: "Charouine", multiplier: 0.85 },
      { name: "Deldoul", multiplier: 0.85 }
    ]
  },
  {
    code: "55",
    name: "Touggourt",
    avgPriceM2DZD: 80000,
    communes: [
      { name: "Touggourt Centre", multiplier: 1.2 },
      { name: "Tebesbest", multiplier: 0.95 },
      { name: "Megarine", multiplier: 0.9 },
      { name: "Temacine", multiplier: 0.9 },
      { name: "Nezla", multiplier: 0.9 }
    ]
  },
  {
    code: "56",
    name: "Djanet",
    avgPriceM2DZD: 65000,
    communes: [
      { name: "Djanet Ville", multiplier: 1.25 },
      { name: "Bordj El Haouas", multiplier: 0.85 }
    ]
  },
  {
    code: "57",
    name: "In Salah",
    avgPriceM2DZD: 60000,
    communes: [
      { name: "In Salah Ville", multiplier: 1.2 },
      { name: "Foggaret Ezzaouia", multiplier: 0.85 },
      { name: "In Ghar", multiplier: 0.85 }
    ]
  },
  {
    code: "58",
    name: "In Guezzam",
    avgPriceM2DZD: 50000,
    communes: [
      { name: "In Guezzam Ville", multiplier: 1.2 },
      { name: "Tin Zaouatine", multiplier: 0.8 }
    ]
  }
];
