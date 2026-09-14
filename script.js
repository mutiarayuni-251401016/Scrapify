const SCRAPIFY_WHATSAPP = "628217856726";

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) setTimeout(() => loader.classList.add("hide"), 1200);
});

const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);
});

const menuButton = document.getElementById("menuButton");
const navLinks = document.querySelector(".nav-links");
if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => navLinks.classList.toggle("open"));
    navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => navLinks.classList.remove("open")));
}

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: .12 });
    revealElements.forEach(el => observer.observe(el));
} else revealElements.forEach(el => el.classList.add("visible"));

let cart = [];
const cartButton = document.getElementById("cartButton");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

function formatPrice(number) { return Number(number).toLocaleString("id-ID"); }
function openCart() { cartDrawer?.classList.add("open"); cartOverlay?.classList.add("open"); }
function closeCartDrawer() { cartDrawer?.classList.remove("open"); cartOverlay?.classList.remove("open"); }
cartButton?.addEventListener("click", openCart);
closeCart?.addEventListener("click", closeCartDrawer);
cartOverlay?.addEventListener("click", closeCartDrawer);

function addToCart(name, price, displayPrice = null) {
    cart.push({ name, price: Number(price), displayPrice: displayPrice || (Number(price) ? `Rp${formatPrice(price)}` : "By Request") });
    updateCart();
    openCart();
}

function updateCart() {
    if (cartCount) cartCount.textContent = cart.length;
    if (!cartItems || !cartTotal) return;
    if (!cart.length) {
        cartItems.innerHTML = `<div class="empty-cart"><span>✿</span><p>your scrapbook basket is empty.</p></div>`;
        cartTotal.textContent = "Rp0";
        return;
    }
    cartItems.innerHTML = "";
    cart.forEach((item, index) => {
        const el = document.createElement("div");
        el.className = "cart-item";
        el.innerHTML = `<div><h4>${item.name}</h4><p>${item.displayPrice}</p></div><button type="button" data-index="${index}">remove</button>`;
        el.querySelector("button").addEventListener("click", () => { cart.splice(index, 1); updateCart(); });
        cartItems.appendChild(el);
    });
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = `Rp${formatPrice(total)}`;
}

document.querySelectorAll(".add-cart").forEach(button => {
    button.addEventListener("click", () => {
        const product = button.closest("[data-name]");
        if (!product) return;
        addToCart(product.dataset.name, Number(product.dataset.price), product.dataset.displayPrice || null);
        const original = button.textContent;
        button.textContent = "added ✓";
        setTimeout(() => button.textContent = original, 900);
    });
});

/* FAQ */
document.querySelectorAll(".faq-item").forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    question?.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item").forEach(other => {
            other.classList.remove("open");
            const a = other.querySelector(".faq-answer");
            if (a) a.style.maxHeight = null;
        });
        if (!isOpen) {
            item.classList.add("open");
            if (answer) answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });
});

/* Checkout */
const checkoutButton = document.getElementById("checkoutButton");
const checkoutModal = document.getElementById("checkoutModal");
const checkoutClose = document.getElementById("checkoutClose");
const checkoutOverlay = document.getElementById("checkoutOverlay");
const checkoutSummary = document.getElementById("checkoutSummary");
const checkoutForm = document.getElementById("checkoutForm");

function updateCheckoutSummary() {
    if (!checkoutSummary) return;
    if (!cart.length) {
        checkoutSummary.innerHTML = `<div class="checkout-summary-row"><span>Your cart</span><strong>Empty</strong></div>`;
        return;
    }
    checkoutSummary.innerHTML = cart.map(item => `<div class="checkout-summary-row"><span>${item.name}</span><strong>${item.displayPrice}</strong></div>`).join("") + `<div class="checkout-summary-row checkout-summary-total"><span>Total</span><strong>Rp${formatPrice(cart.reduce((s,i)=>s+i.price,0))}</strong></div>`;
}
function openCheckout() {
    if (!cart.length) { openCart(); return; }
    updateCheckoutSummary();
    checkoutModal?.classList.add("open");
    closeCartDrawer();
}
checkoutButton?.addEventListener("click", openCheckout);
checkoutClose?.addEventListener("click", () => checkoutModal?.classList.remove("open"));
checkoutOverlay?.addEventListener("click", () => checkoutModal?.classList.remove("open"));

checkoutForm?.addEventListener("submit", event => {
    event.preventDefault();
    const name = document.getElementById("customerName")?.value.trim();
    const whatsapp = document.getElementById("customerWhatsapp")?.value.trim();
    const theme = document.getElementById("customerTheme")?.value.trim();
    const notes = document.getElementById("customerNotes")?.value.trim() || "-";
    const photoMethod = document.querySelector('input[name="photoMethod"]:checked')?.value || "Not specified";
    const items = cart.map(item => `• ${item.name} — ${item.displayPrice}`).join("\n");
    const total = cart.reduce((s,i)=>s+i.price,0);
    const message = `Hi Scrapify! ♡\n\nI'd like to order:\n${items}\n\nTotal: Rp${formatPrice(total)}\n\nName: ${name}\nWhatsApp: ${whatsapp}\nTheme: ${theme}\nNotes: ${notes}\nPhoto submission: ${photoMethod}`;
    if (SCRAPIFY_WHATSAPP === "YOUR_WHATSAPP_NUMBER") {
        alert("Please add your Scrapify WhatsApp number in script.js first.");
        return;
    }
    window.open(`https://wa.me/${SCRAPIFY_WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank");
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        checkoutModal?.classList.remove("open");
        closeCartDrawer();
    }
});

updateCart();

let lastSparkleTime = 0;

function createCursorSparkle(x, y) {
    const now = Date.now();

    if (now - lastSparkleTime < 160) return;

    lastSparkleTime = now;

    const sparkle = document.createElement("span");

    sparkle.className = "cursor-sparkle";
    sparkle.textContent = Math.random() > 0.5 ? "✦" : "·";

    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;

    document.body.appendChild(sparkle);

    setTimeout(() => {
        sparkle.remove();
    }, 750);
}

document.addEventListener("mousemove", (event) => {
    createCursorSparkle(event.clientX, event.clientY);
});