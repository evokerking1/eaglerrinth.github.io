document.addEventListener("DOMContentLoaded", function () {
    fetch('./mods.json')
        .then(response => response.json())
        .then(data => {
            const modContainer = document.getElementById('modContainer');
            const categorySelect = document.getElementById('categorySelect');
            const apiSelect = document.getElementById('apiSelect');
            const searchInput = document.getElementById('searchInput');

            function createCard(mod) {
                const card = document.createElement('div');
                card.className = 'col-md-4 col-lg-4 col-xl-3 mb-4'; 
                card.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body p-4">
                            <div class="d-flex align-items-center">
                                <img src="${mod.icon}" class="mod-icon me-3" alt="${mod['display-name']} Icon">
                                <div>
                                    <h5 class="card-title m-0">${mod['display-name']}</h5>
                                    <p class="card-subtitle m-0 mb-2">API: ${mod['api']}</p>

                                    <p class="card-subtitle mb-2 author-text">Author: <a href="user/?user=${mod.author}" class="link-light">${mod.author}</a></p>
                                </div>
                            </div>
                            <p class="card-text mt-3">${mod.description}</p>
                        </div>
                        <div class="card-footer">
                            <a href="${mod['repo-link']}" class="btn btn-primary btn-sm" target="_blank">View Source</a>
                            <a href="${mod['download-link']}" class="btn btn-success btn-sm" download target="_blank">Download</a>
                        </div>
                    </div>`;
                return card;
            }

            const uniqueCategories = [...new Set(data.mods.map(mod => mod.category))];
            uniqueCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });

            const uniqueApis = [...new Set(data.mods.map(mod => mod.api))];
            uniqueApis.forEach(api => {
                const option = document.createElement('option');
                option.value = api;
                option.textContent = api;
                apiSelect.appendChild(option);
            });

            function renderMods(mods) {
                modContainer.innerHTML = '';
                mods.forEach(mod => {
                    const card = createCard(mod);
                    modContainer.appendChild(card);
                });
            }

            renderMods(data.mods);

            searchInput.addEventListener('input', () => {
                filterMods();
            });

            categorySelect.addEventListener('change', () => {
                filterMods();
            });

            apiSelect.addEventListener('change', () => {
                filterMods();
            });

            function filterMods() {
                const searchValue = searchInput.value.toLowerCase();
                const selectedCategory = categorySelect.value;
                const selectedApi = apiSelect.value;

                const filteredMods = data.mods.filter(mod => {
                    const matchesSearch = mod['display-name'].toLowerCase().includes(searchValue) ||
                        mod.description.toLowerCase().includes(searchValue) ||
                        mod.author.toLowerCase().includes(searchValue);

                    const matchesCategory = selectedCategory === 'All' || mod.category === selectedCategory;
                    const matchesApi = selectedApi === 'All' || mod.api === selectedApi;

                    return matchesSearch && matchesCategory && matchesApi;
                });

                renderMods(filteredMods);
            }
        })
        .catch(error => console.error('Error fetching mods.json:', error));
});
