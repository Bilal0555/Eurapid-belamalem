document.addEventListener('DOMContentLoaded', () => {
    const dataForm = document.getElementById('data-form');
    const nomInput = document.getElementById('nom');
    const prenomInput = document.getElementById('prenom');
    const telephoneInput = document.getElementById('telephone');
    const cinInput = document.getElementById('cin');
    const numSerieInput = document.getElementById('num_serie');
    const quantiteInput = document.getElementById('quantite');
    const continentInput = document.getElementById('continent');
    const paysInput = document.getElementById('pays');
    const villeInput = document.getElementById('ville');
    const typeTransportInput = document.getElementById('type_transport');
    const searchInput = document.getElementById('search');
    const dataTable = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    const exportBtn = document.getElementById('export-btn');

    const countries = {
        europe: ["France", "Allemagne", "Espagne"],
        asia: ["Chine", "Japon", "Inde"],
        usa: ["États-Unis"],
        africa: ["Maroc", "Nigeria", "Égypte"]
    };

    const cities = {
        maroc: ["Casablanca", "Rabat", "Marrakech"],
        nigeria: ["Lagos", "Abuja", "Kano"],
        égypte: ["Le Caire", "Alexandrie", "Gizeh"],
        france: ["Paris", "Lyon", "Marseille"],
        allemagne: ["Berlin", "Hambourg", "Munich"],
        espagne: ["Madrid", "Barcelone", "Valence"],
        chine: ["Pékin", "Shanghai", "Canton"],
        japon: ["Tokyo", "Osaka", "Kyoto"],
        inde: ["New Delhi", "Mumbai", "Bangalore"],
        "états-unis": ["New York", "Los Angeles", "Chicago"]
    };

    let data = [];

    continentInput.addEventListener('change', () => {
        const continent = continentInput.value;
        paysInput.innerHTML = '<option value="">Sélectionner un pays</option>'; // Reset country list
        if (countries[continent]) {
            countries[continent].forEach(country => {
                const option = document.createElement('option');
                option.value = country.toLowerCase();
                option.innerText = country;
                paysInput.appendChild(option);
            });
        }
    });

    paysInput.addEventListener('change', () => {
        const selectedCountry = paysInput.value;
        villeInput.innerHTML = '<option value="">Sélectionner une ville</option>'; // Reset city list
        if (cities[selectedCountry]) {
            cities[selectedCountry].forEach(city => {
                const option = document.createElement('option');
                option.value = city.toLowerCase();
                option.innerText = city;
                villeInput.appendChild(option);
            });
        }
    });

    dataForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nom = nomInput.value.trim();
        const prenom = prenomInput.value.trim();
        const telephone = telephoneInput.value.trim();
        const cin = cinInput.value.trim();
        const numSerie = numSerieInput.value.trim();
        const quantite = quantiteInput.value.trim();
        const typeTransport = typeTransportInput.value.trim();
        const pays = paysInput.value.trim();
        const ville = villeInput.value.trim();

        // Validation
        const nameRegex = /^[a-zA-Z]+$/;
        const cinRegex = /^[a-zA-Z]{2}[0-9]{5}$/;

        if (!nameRegex.test(nom) || !nameRegex.test(prenom)) {
            alert("Nom et Prénom doivent contenir uniquement des lettres.");
            return;
        }

        if (!cinRegex.test(cin)) {
            alert("CIN doit être au format de 2 lettres suivies de 5 chiffres.");
            return;
        }

        const id = data.length + 1; // Auto-increment ID

        data.push({ id, nom, prenom, telephone, cin, numSerie, quantite, typeTransport, pays, ville });
        renderTable(data);
        dataForm.reset();
    });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = data.filter(item => 
            item.nom.toLowerCase().includes(searchTerm) ||
            item.prenom.toLowerCase().includes(searchTerm) ||
            item.telephone.includes(searchTerm) ||
            item.cin.toLowerCase().includes(searchTerm) ||
            item.numSerie.toLowerCase().includes(searchTerm) ||
            item.pays.toLowerCase().includes(searchTerm) ||
            item.ville.toLowerCase().includes(searchTerm)
        );
        renderTable(filteredData);
    });

    dataTable.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit')) {
            const row = e.target.parentNode.parentNode;
            const cells = row.children;
            nomInput.value = cells[1].innerText;
            prenomInput.value = cells[2].innerText;
            telephoneInput.value = cells[3].innerText;
            cinInput.value = cells[4].innerText;
            numSerieInput.value = cells[5].innerText;
            quantiteInput.value = cells[6].innerText;
            typeTransportInput.value = cells[7].innerText;
            paysInput.value = cells[8].innerText.toLowerCase();
            villeInput.value = cells[9].innerText.toLowerCase();

            data = data.filter(item => item.id !== parseInt(cells[0].innerText));
            renderTable(data);
        } else if (e.target.classList.contains('delete')) {
            const id = parseInt(e.target.parentNode.parentNode.children[0].innerText);
            data = data.filter(item => item.id !== id);
            renderTable(data);
        }
    });

    exportBtn.addEventListener('click', () => {
        exportToExcel(data);
    });

    function renderTable(data) {
        dataTable.innerHTML = '';
        data.forEach(item => {
            const row = dataTable.insertRow();
            row.insertCell(0).innerText = item.id;
            row.insertCell(1).innerText = item.nom;
            row.insertCell(2).innerText = item.prenom;
            row.insertCell(3).innerText = item.telephone;
            row.insertCell(4).innerText = item.cin;
            row.insertCell(5).innerText = item.numSerie;
            row.insertCell(6).innerText = item.quantite;
            row.insertCell(7).innerText = item.typeTransport;
            row.insertCell(8).innerText = item.pays;
            row.insertCell(9).innerText = item.ville;

            const actionsCell = row.insertCell(10);
            actionsCell.innerHTML = `
                <button class="edit">Modifier</button>
                </br>
                <button class="delete">Supprimer</button>
            `;
        });
    }

    function exportToExcel(data) {
        // Create
        const wb = XLSX.utils.book_new();
        
        // Convert data array
        const ws_data = [
            ["ID", "Nom", "Prénom", "Téléphone", "CIN", "Numéro de Série", "Quantité", "Type de Transport", "Pays", "Ville"],
            ...data.map(item => [
                item.id,
                item.nom,
                item.prenom,
                item.telephone,
                item.cin,
                item.numSerie,
                item.quantite,
                item.typeTransport,
                item.pays,
                item.ville
            ])
        ];
        
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, "Données");
        XLSX.writeFile(wb, "data.xlsx");
    }
});
