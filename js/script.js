// BACKGROUND MUSIC BUTTON
const audio = document.getElementById("bgMusic");
const audioBtn = document.getElementById("audioBtn"); // pastikan ada di HTML

audioBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.muted = false;
        audio.play().catch(err => console.log("Gagal mainkan musik:", err));
        audioBtn.style.opacity = 1; // tombol "on"
    } else {
        audio.pause();
        audioBtn.style.opacity = 0.5; // tombol "off"
    }
});


// MODAL 
const openModalBtn = document.getElementById("openModalBtn");
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModalBtn");

openModalBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});

// FORM LIST (SUB KEGIATAN)
const addListBtn = document.getElementById("addListBtn");
const listContainer = document.getElementById("listContainer");

addListBtn.addEventListener("click", () => {
    const div = createListInput();
    listContainer.appendChild(div);
});

function createListInput() {
    const div = document.createElement("div");
    div.classList.add("list-item");

    div.innerHTML = `
        <input type="text" class="list-input" placeholder="Isi kegiatan...">
        <button class="list-delete-btn">×</button>
    `;

    div.querySelector(".list-delete-btn").addEventListener("click", () => {
        div.remove();
    });

    return div;
}

// LOCAL STORAGE
function saveToLocal() {
    const rows = [...document.querySelectorAll("tbody tr")].map(row => ({
        nama: row.dataset.nama,
        list: JSON.parse(row.dataset.list),
        tanggal: row.dataset.tanggal
    }));

    localStorage.setItem("todoList", JSON.stringify(rows));
}

function loadFromLocal() {
    const data = JSON.parse(localStorage.getItem("todoList")) || [];
    data.forEach(d => createRow(d.nama, d.list, d.tanggal));
}

// TABEL
const tableBody = document.getElementById("cardContainer");

function createRow(nama, listIsi, tanggal) {
    const tr = document.createElement("tr");

    tr.dataset.nama = nama;
    tr.dataset.list = JSON.stringify(listIsi);
    tr.dataset.tanggal = tanggal;

    tr.innerHTML = `
        <td></td>
        <td>${nama}</td>
        <td>${tanggal}</td>
        <td>
            <button class="detail-btn-table">Detail</button>
            <button class="delete-btn-table">Hapus</button>
        </td>
    `;

    tr.querySelector(".detail-btn-table").addEventListener("click", () => {
        const list = JSON.parse(tr.dataset.list);
        alert(`Sub-Kegiatan dari "${nama}":\n\n- ${list.join("\n- ")}`);
    });

    tr.querySelector(".delete-btn-table").addEventListener("click", () => {
        if (!confirm("Yakin mau hapus kegiatan ini ?")) return;
        tr.remove();
        updateNumbering();
        saveToLocal();
        checkEmpty();
    });

    tableBody.appendChild(tr);
    updateNumbering();
    checkEmpty();
}

function updateNumbering() {
    const rows = document.querySelectorAll("tbody tr");
    rows.forEach((row, i) => row.children[0].innerText = i + 1);
}

// SIMPAN
const saveBtn = document.getElementById("saveKegiatanBtn");

saveBtn.addEventListener("click", () => {
    const nama = document.getElementById("namaKegiatan").value.trim();
    const tanggal = document.getElementById("tanggal").value;

    const listInputs = [...document.querySelectorAll(".list-input")];
    const listIsi = listInputs.map(i => i.value.trim()).filter(i => i !== "");

    if (!nama) return alert("Nama kegiatan wajib diisi.");
    if (listInputs.length === 0) return alert("Minimal tambahkan 1 Sub Kegiatan.");
    if (listIsi.length === 0) return alert("Sub Kegiatan tidak boleh kosong.");
    if (!tanggal) return alert("Tanggal wajib diisi.");

    createRow(nama, listIsi, tanggal);
    saveToLocal();

    // reset form
    document.getElementById("namaKegiatan").value = "";
    document.getElementById("tanggal").value = "";
    listContainer.innerHTML = "";
    modal.style.display = "none";
});
// FILTER
const filterNama = document.getElementById("filterNama");
const filterTanggal = document.getElementById("filterTanggal");
const resetFilterBtn = document.getElementById("resetFilterBtn");

function applyFilter() {
    const rows = document.querySelectorAll("tbody tr");
    const nama = filterNama.value.toLowerCase();
    const tanggal = filterTanggal.value;

    rows.forEach(row => {
        const cocokNama = row.dataset.nama.toLowerCase().includes(nama);
        const cocokTanggal = tanggal === "" || tanggal === row.dataset.tanggal;
        row.style.display = (cocokNama && cocokTanggal) ? "" : "none";
    });
}

filterNama.addEventListener("input", applyFilter);
filterTanggal.addEventListener("change", applyFilter);

resetFilterBtn.addEventListener("click", () => {
    filterNama.value = "";
    filterTanggal.value = "";
    applyFilter();
});

// TAMPILKAN FILTER JIKA ADA DATA
function checkEmpty() {
    const rows = document.querySelectorAll("tbody tr").length;
    document.getElementById("filterBox").style.display = rows === 0 ? "none" : "flex";
}

// LOAD AWAL
loadFromLocal();
checkEmpty();
updateNumbering();
