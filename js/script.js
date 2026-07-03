/* =================================================================
   PART 1: REGISTRATION PAGE LOGIC (Only runs if form exists)
================================================================= */
const form = document.getElementById("registrationForm");

if (form) {
    const block = document.getElementById("block");
    const category = document.getElementById("category");
    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const eventList = document.getElementById("eventList");

    const blockShort = {
        "Kariparambu East": "KRP EAST",
        "Kariparambu West": "KRP WEST",
        "Chenakkathadam": "CKNM"
    };

    const categoryShort = {
        "LPB": "LP",
        "Category 2": "C2",
        "Category 3": "C3"
    };

    const events = {
        "LPB": ["മദ്ഹ് ഗാനം", "പ്രസംഗം", "ക്വിസ്", "കഥ പറയൽ", "ചിത്രരചന പെൻസിൽ", "ചിത്രരചന ജലച്ചായം", "ഭാഷ കേളി", "വായന അറ-മല", "വായന മലയാളം"],
        "Category 2": ["മദ്ഹ് ഗാനം", "പ്രസംഗം", "ക്വിസ്", "കഥ പറയൽ", "ചിത്രരചന പെൻസിൽ", "ചിത്രരചന ജലച്ചായം", "ഭാഷ കേളി", "വായന അറ-മല", "വായന മലയാളം"],
        "Category 3": ["മദ്ഹ് ഗാനം", "പ്രസംഗം", "ക്വിസ്", "കഥ പറയൽ", "ചിത്രരചന പെൻസിൽ", "ചിത്രരചന ജലച്ചായം", "ഭാഷ കേളി", "വായന അറ-മല", "വായന മലയാളം"]
    };

    category.addEventListener("change", () => {
        eventList.innerHTML = "";
        if (!events[category.value]) return;

        events[category.value].forEach(event => {
            eventList.innerHTML += `
            <div class="event-item">
                <input type="checkbox" value="${event}">
                <label>${event}</label>
            </div>
            `;
        });
        limitSelection();
    });

    function limitSelection() {
        const checkboxes = eventList.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(box => {
            box.addEventListener("change", () => {
                const checked = eventList.querySelectorAll('input[type="checkbox"]:checked');
                if (checked.length > 4) {
                    box.checked = false;
                    alert("ഒരു വിദ്യാർത്ഥിക്ക് പരമാവധി 4 പരിപാടികൾ മാത്രമേ തിരഞ്ഞെടുക്കാൻ കഴിയൂ.");
                }
            });
        });
    }

    function getSelectedEvents() {
        const selected = [];
        eventList.querySelectorAll('input[type="checkbox"]:checked').forEach(box => {
            selected.push(box.value);
        });
        return selected;
    }

    function validateForm() {
        if (block.value === "") { alert("Block തിരഞ്ഞെടുക്കുക."); block.focus(); return false; }
        if (category.value === "") { alert("Category തിരഞ്ഞെടുക്കുക."); category.focus(); return false; }
        if (nameInput.value.trim() === "") { alert("പേര് നൽകുക."); nameInput.focus(); return false; }
        if (phoneInput.value.trim() === "") { alert("Phone Number നൽകുക."); phoneInput.focus(); return false; }
        if (!/^[0-9]{10}$/.test(phoneInput.value.trim())) { alert("ശരിയായ 10 അക്ക Phone Number നൽകുക."); phoneInput.focus(); return false; }
        if (getSelectedEvents().length !== 4) { alert("കൃത്യമായി 4 പരിപാടികൾ തിരഞ്ഞെടുക്കണം."); return false; }
        return true;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validateForm()) return;

        let registrations = JSON.parse(localStorage.getItem("registrations")) || [];
        const duplicate = registrations.find(item => item.phone === phoneInput.value.trim());

        if (duplicate) {
            alert("ഈ Phone Number ഉപയോഗിച്ച് ഇതിനകം രജിസ്ട്രേഷൻ ചെയ്തിട്ടുണ്ട്.");
            return;
        }

        const now = new Date();
        const date = now.toLocaleDateString("en-GB");
        const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

        const student = {
            id: registrations.length + 1,
            block: block.value,
            blockShort: blockShort[block.value] || block.value,
            category: category.value,
            categoryShort: categoryShort[category.value] || category.value,
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            date: date,
            time: time,
            events: getSelectedEvents()
        };

        registrations.push(student);
        localStorage.setItem("registrations", JSON.stringify(registrations));
        localStorage.setItem("lastRegistrationUpdate", Date.now());

        alert("✅ Registration വിജയകരമായി പൂർത്തിയായി.");
        form.reset();
        eventList.innerHTML = "";
        block.focus();
    });
}


/* =================================================================
   PART 2: ADMIN PAGE LOGIC (Only runs if tableBody exists)
================================================================= */
const tableBody = document.getElementById("tableBody");

if (tableBody) {
    const eventColumns = [
        "മദ്ഹ് ഗാനം", "പ്രസംഗം", "ക്വിസ്", "കഥ പറയൽ", "പെൻസിൽ", 
        "ജലച്ചായം", "ഭാഷ കേളി", "വായന അറ-മല", "വായന മലയാളം"
    ];

    const eventMap = {
        "മദ്ഹ് ഗാനം": "മദ്ഹ് ഗാനം",
        "പ്രസംഗം": "പ്രസംഗം",
        "ക്വിസ്": "ക്വിസ്",
        "കഥ പറയൽ": "കഥ പറയൽ",
        "പെൻസിൽ": "ചിത്രരചന പെൻസിൽ",
        "ജലച്ചായം": "ചിത്രരചന ജലച്ചായം",
        "ഭാഷ കേളി": "ഭാഷ കേളി",
        "വായന അറ-മല": "വായന അറ-മല",
        "വായന മലയാളം": "വായന മലയാളം"
    };

    function loadTable() {
        tableBody.innerHTML = "";
        const registrations = JSON.parse(localStorage.getItem("registrations")) || [];

        registrations.forEach((student, index) => {
            const row = document.createElement("tr");
            let html = `
                <td>${index + 1}</td>
                <td>${student.name}</td>
                <td>${student.blockShort}</td>
                <td>${student.categoryShort}</td>
                <td>${student.phone}</td>
                <td>${student.date}</td>
                <td>${student.time}</td>
            `;

            eventColumns.forEach(event => {
                const originalEvent = eventMap[event];
                if (student.events && student.events.includes(originalEvent)) {
                    html += `<td>✅</td>`;
                } else {
                    html += `<td></td>`;
                }
            });

            row.innerHTML = html;
            tableBody.appendChild(row);
        });
    }

    // Load table and set auto-refresh events
    loadTable();
    window.addEventListener("storage", loadTable);
    setInterval(loadTable, 2000);
}
