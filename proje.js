(() => {
    const API_URL = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
    const STORAGE_KEY = "similarProducts";
    const FAVORITES_KEY = "favoriteProducts";

    const init = async () => {
        if ($(".product-detail").length === 0) return; // Eğer ürün detay sayfasında değilsek çalıştırma.

        let products = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!products) {
            products = await fetchProducts();
            if (products.length > 0) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
            } 
        }

        buildHTML(products);
        buildCSS(); 
        setEvents();
    };

    // API'den ürünleri çek
    const fetchProducts = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            return Array.isArray(data) ? data : []; // API'den gelen verinin dizi olup olmadığını kontrol et
        } catch (error) {
            console.error("Ürünler yüklenirken hata oluştu:", error);
            return [];
        }
    };

    // HTML oluştur
    const buildHTML = (products) => {
        if (!products || products.length === 0) return; // Eğer ürün yoksa ekleme yapma

        const savedFavorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

        const carouselHTML = `
            <div class="carousel-container">
                <h2 class="carousel-title">Benzer Ürünler</h2>
                <div class="carousel">
                    ${products.map(product => `
                        <div class="carousel-item">
                            <a href="${product.url}" target="_blank">
                                <img src="https://img-lcwaikiki.mncdn.com/mnpadding/1020/1360/ffffff/pim/productimages/20251/7948912/v1/l_20251-s5k446z8-hnv-87-60-90-175_a.jpg" alt="${product.name}">
                            </a>
                            <p>${product.name}</p>
                            <span>${product.price} TRY</span>
                            <i class="heart-icon ${savedFavorites.includes(product.id) ? "favorite" : ""}" data-id="${product.id}">❤</i>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;

        $(".product-detail").after(carouselHTML);
    };

    // CSS ekle
    const buildCSS = () => {
        const css = `
            .carousel-container {
                margin: 20px 0;
                padding: 10px;
                background: #f8f8f8;
                border-radius: 8px;
            }
            .carousel-title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .carousel {
                display: flex;
                overflow-x: auto;
                gap: 10px;
                padding-bottom: 10px;
                scroll-snap-type: x mandatory;
            }
            .carousel-item {
                flex: 0 0 auto;
                scroll-snap-align: start;
                min-width: 150px;
                background: white;
                padding: 10px;
                border-radius: 5px;
                text-align: center;
                box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
            }
            .carousel-item img {
                max-width: 100%;
                border-radius: 5px;
            }
            .heart-icon {
                cursor: pointer;
                font-size: 20px;
                color: gray;
                user-select: none;
            }
            .heart-icon.favorite {
                color: blue;
            }
        `;
        $("<style>").html(css).appendTo("head");
    };

    // Eventleri ata (Favori butonu için)
    const setEvents = () => {
        $(document).on("click", ".heart-icon", function () {
            const productId = $(this).data("id");
            let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

            if (favorites.includes(productId)) {
                favorites = favorites.filter(id => id !== productId);
                $(this).removeClass("favorite");
            } else {
                favorites.push(productId);
                $(this).addClass("favorite");
            }

            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        });
    };

    init();
})();