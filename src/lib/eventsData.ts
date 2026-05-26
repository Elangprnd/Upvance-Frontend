export interface EventData {
  id: string;
  title: string;
  year: string;
  location: string;
  startDate: string;
  deadline: string;
  price: string;
  organizer: string;
  image: string;
  organizerLogo?: string;
  isVerified: boolean;
  category: string;
  description: string;
  requirements: string[];
  tags: string[];
}

export const eventsData: EventData[] = [
  {
    id: "udayana-business-plan-competition-2026",
    title: "Udayana Business Plan Competition",
    year: "2026",
    location: "Indonesia",
    startDate: "20 Mei 2026",
    deadline: "25 Mei 2026",
    price: "Rp 25.000",
    organizer: "Kementerian Ekonomi Kreatif Udayana",
    image: "https://www.figma.com/api/mcp/asset/e049077a-0745-4d2f-8183-aa40b958a15f",
    organizerLogo: "https://www.figma.com/api/mcp/asset/2d4c51a4-08fd-4455-9c5a-5348e4273b13",
    isVerified: true,
    category: "Tingkat Nasional",
    description: "Udayana Business Plan Competition 2026 merupakan kompetisi business plan nasional yang cocok bagi mahasiswa yang memiliki ide usaha inovatif dan ingin mengembangkan kemampuan entrepreneurship. Dengan biaya pendaftaran yang terjangkau dan berbagai rangkaian mentoring serta coaching, kompetisi ini sangat potensial untuk menambah pengalaman, portofolio, dan relasi nasional mahasiswa.",
    requirements: [
      "Peserta merupakan mahasiswa aktif D1/D2/D3/S1 dari universitas di seluruh Indonesia",
      "Peserta berasal dari angkatan 2023, 2024, atau 2025",
      "Perlombaan bersifat tim yang terdiri dari 3 orang",
      "Setiap tim wajib menunjuk satu ketua tim",
      "Ketua tim wajib mendaftarkan seluruh anggota dalam satu tim",
      "Peserta hanya diperbolehkan mengikuti satu tim dan tidak boleh terdaftar di tim lain",
      "Proposal bisnis harus sesuai dengan subtema yang dipilih",
      "Karya harus orisinal dan belum pernah dipublikasikan",
      "Peserta wajib mengikuti seluruh rangkaian kegiatan kompetisi"
    ],
    tags: ["D1", "D2", "D3", "S1"]
  },
  {
    id: "one-earth-nextgen-innovators-2026",
    title: "One Earth NextGen Innovators",
    year: "2026",
    location: "HongKong, Shenzhen",
    startDate: "13 Mar 2026",
    deadline: "25 Mei 2026",
    price: "Rp 25.000",
    organizer: "One Earth NextGen Innovators",
    image: "https://www.figma.com/api/mcp/asset/d6dc2581-aa05-401d-ab97-8b913fbbec4c",
    organizerLogo: "https://www.figma.com/api/mcp/asset/e2bd38c5-44d4-40e0-b74e-149d5832fa44",
    isVerified: true,
    category: "Tingkat Internasional",
    description: "One Earth NextGen Innovators adalah program akselerasi inovasi global yang berfokus pada solusi berkelanjutan untuk tantangan lingkungan masa depan.",
    requirements: [
      "Terbuka untuk pelajar dan profesional muda",
      "Fasih berbahasa Inggris",
      "Memiliki konsep inovasi di bidang lingkungan"
    ],
    tags: ["Intl", "S1", "S2"]
  },
  {
    id: "geo-science-national-competition-2026",
    title: "GEO-SCIENCE National Competition",
    year: "2026",
    location: "Indonesia",
    startDate: "18 Mei 2026",
    deadline: "05 Jul 2026",
    price: "Rp 25.000",
    organizer: "Departemen Geografi Universitas Negeri Malang",
    image: "https://www.figma.com/api/mcp/asset/3ebacc17-0f4e-4431-81e6-9355937093a6",
    organizerLogo: "https://www.figma.com/api/mcp/asset/df0219d8-d5cb-447c-95b5-387a96320f28",
    isVerified: true,
    category: "Tingkat Nasional",
    description: "GEO-SCIENCE National Competition adalah ajang bergengsi bagi para pecinta ilmu kebumian untuk menunjukkan bakat dan pengetahuan mereka di tingkat nasional.",
    requirements: [
      "Mahasiswa aktif semua jurusan",
      "Pendaftaran dilakukan secara individu atau tim (maks 2 orang)"
    ],
    tags: ["S1", "D3"]
  },
  {
    id: "bri-gama-ibcc-2026",
    title: "BRI GAMA International Business Case Competition (IBCC)",
    year: "2026",
    location: "HongKong, Shenzhen",
    startDate: "30 Apr 2026",
    deadline: "13 Jul 2026",
    price: "Rp 25.000",
    organizer: "KAFEGAMA, FEB UGM, BRI & Danantara Indonesia",
    image: "https://www.figma.com/api/mcp/asset/ffbb034c-fb71-4870-80aa-1eb2c826f36d",
    isVerified: true,
    category: "Tingkat Internasional",
    description: "IBCC 2026 menantang mahasiswa untuk memecahkan kasus bisnis nyata dari sektor perbankan dan keuangan internasional.",
    requirements: [
      "Mahasiswa S1/S2 aktif",
      "Kemampuan analisis bisnis yang kuat"
    ],
    tags: ["Intl", "S1", "S2"]
  },
  {
    id: "business-leaderpreneur-case-competition-2026",
    title: "Business Leaderpreneur Case Competition (BLCC)",
    year: "2026",
    location: "Indonesia",
    startDate: "17 Mei 2026",
    deadline: "17 Jun 2026",
    price: "Rp 25.000",
    organizer: "AIESEC in Bandung",
    image: "https://www.figma.com/api/mcp/asset/71455554-0ccd-45f8-a5c0-534c2cc00add",
    organizerLogo: "https://www.figma.com/api/mcp/asset/ef029f19-2d1d-4310-8257-7d09bad91ce9",
    isVerified: true,
    category: "Tingkat Nasional",
    description: "BLCC oleh AIESEC Bandung mengasah jiwa kepemimpinan dan kewirausahaan melalui tantangan kasus bisnis yang inovatif.",
    requirements: [
      "Pemuda usia 18-25 tahun",
      "Tertarik pada kepemimpinan dan bisnis"
    ],
    tags: ["S1", "Gap Year"]
  },
  {
    id: "lomba-nasional-cerdas-cermat-2026",
    title: "Lomba Nasional Cerdas Cermat Perguruan Tinggi",
    year: "2026",
    location: "Indonesia",
    startDate: "01 Mei 2026",
    deadline: "01 Jul 2026",
    price: "Rp 200.000",
    organizer: "Ikatan Konsultan Pajak Indonesia (IKPI)",
    image: "https://www.figma.com/api/mcp/asset/5a165e7b-19aa-43a1-a8f6-071018773863",
    organizerLogo: "https://www.figma.com/api/mcp/asset/98ada70b-7007-46d9-a987-d3cf2f8ce888",
    isVerified: true,
    category: "Tingkat Nasional",
    description: "Uji wawasan perpajakan Anda dalam lomba cerdas cermat tingkat nasional yang diselenggarakan oleh IKPI.",
    requirements: [
      "Mahasiswa aktif jurusan Perpajakan/Akuntansi/Hukum",
      "Tim terdiri dari 3 orang"
    ],
    tags: ["S1", "D3"]
  }
];
