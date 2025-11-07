let dataLaptop = JSON.parse(localStorage.getItem('dataLaptop')) || [];

// Tambah data
function tambahData() {
  const laptop = {
    merek: document.getElementById("merek").value,
    harga: parseFloat(document.getElementById("harga").value),
    prosesor: parseFloat(document.getElementById("prosesor").value),
    ram: parseFloat(document.getElementById("ram").value),
    storage: parseFloat(document.getElementById("storage").value),
    gpu: parseFloat(document.getElementById("gpu").value),
    baterai: parseFloat(document.getElementById("baterai").value),
    garansi: parseFloat(document.getElementById("garansi").value)
  };

  dataLaptop.push(laptop);
  localStorage.setItem('dataLaptop', JSON.stringify(dataLaptop));
  alert("Data berhasil ditambahkan!");
  document.querySelectorAll('input').forEach(i => i.value = '');
}

// Tampilkan daftar
if (window.location.pathname.includes("daftar.html")) {
  const table = document.getElementById("dataTable");
  dataLaptop.forEach((l, index) => {
    const row = table.insertRow();
    Object.values(l).forEach(val => {
      const cell = row.insertCell();
      cell.textContent = val;
    });
    const cellHapus = row.insertCell();
    cellHapus.innerHTML = `<button onclick="hapusData(${index})">Hapus</button>`;
  });
}

function hapusData(index) {
  dataLaptop.splice(index, 1);
  localStorage.setItem('dataLaptop', JSON.stringify(dataLaptop));
  location.reload();
}

// Proses SPK (Weighted Product)
function prosesSPK() {
  const bobot = [0.20, 0.20, 0.15, 0.15, 0.10, 0.10, 0.10];
  const jenis = ["cost", "benefit", "benefit", "benefit", "benefit", "benefit", "benefit"];

  // Normalisasi
  let minHarga = Math.min(...dataLaptop.map(d => d.harga));
  let max = {
    prosesor: Math.max(...dataLaptop.map(d => d.prosesor)),
    ram: Math.max(...dataLaptop.map(d => d.ram)),
    storage: Math.max(...dataLaptop.map(d => d.storage)),
    gpu: Math.max(...dataLaptop.map(d => d.gpu)),
    baterai: Math.max(...dataLaptop.map(d => d.baterai)),
    garansi: Math.max(...dataLaptop.map(d => d.garansi))
  };

  // Hitung Si dan Vi
  let totalSi = 0;
  dataLaptop.forEach(d => {
    let nilai = [
      minHarga / d.harga,
      d.prosesor / max.prosesor,
      d.ram / max.ram,
      d.storage / max.storage,
      d.gpu / max.gpu,
      d.baterai / max.baterai,
      d.garansi / max.garansi
    ];
    let Si = 1;
    for (let i = 0; i < bobot.length; i++) Si *= Math.pow(nilai[i], bobot[i]);
    d.Si = Si;
    totalSi += Si;
  });

  dataLaptop.forEach(d => d.Vi = d.Si / totalSi);
  dataLaptop.sort((a, b) => b.Vi - a.Vi);

  localStorage.setItem('hasilSPK', JSON.stringify(dataLaptop));
  location.href = 'hasil.html';
}

// Halaman hasil
if (window.location.pathname.includes("hasil.html")) {
  const hasil = JSON.parse(localStorage.getItem('hasilSPK')) || [];
  const table = document.getElementById("hasilTable");

  hasil.forEach((d, i) => {
    const row = table.insertRow();
    row.insertCell().textContent = i + 1;
    row.insertCell().textContent = d.merek;
    row.insertCell().textContent = d.Si.toFixed(4);
    row.insertCell().textContent = d.Vi.toFixed(4);
  });

  document.getElementById("rekomendasi").textContent =
    "Laptop Rekomendasi: " + hasil[0].merek + " (Nilai: " + hasil[0].Vi.toFixed(4) + ")";
}
