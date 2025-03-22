class ListingCards {
    constructor(id, name, description, image, price, currency, location, pricingModel) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.price = price;
        this.currency = currency;
        this.location = location;
        this.pricingModel = pricingModel;
        this.cardHTML = this.generateCardHTML();

        this.cardNotification = document.querySelector('.card-notification');
        this.notificationStatus = document.getElementById('notification-status');
    }

    generateCardHTML() {
        return `
        <article class="listing-card" id="listing-${this.id}">
            <div class="hover-area">
                <div class="image-wrapper">
                    <img class="listing-img" src="${this.image}" alt="${this.name}">
                </div>
                <div class="edit-options">
                    <img title="view" class="view" src="Images/view.svg" alt="View">
                    <img title="edit" class="edit" id="edit-${this.id}" src="Images/edit.svg" alt="Edit">
                    <img title="delete" class="delete" id="delete-${this.id}" src="Images/delete.svg" alt="Delete">
                </div>
            </div>
            <div class="info">
                <p class="card-name">${this.name}</p>
                <p class="description">${this.description}</p>
                <div class="details">
                    <hr class="hr-card">
                    <div class="location">
                        <div class="price">
                            <p>${this.currency}${this.price}/${this.pricingModel}</p>
                        </div>
                        <div class="address">
                            <img class="tag" src="Images/location.svg" alt="Location">
                            <p>${this.location.city}, ${this.location.country}</p>
                        </div>
                    </div>
                </div>
            </div>
        </article>
        `;
    }

    popupNotification(backgroundColor, borderColor, textColor, text){
        this.cardNotification.style.backgroundColor = backgroundColor;
        this.cardNotification.style.border = `2px solid ${borderColor}`;
        this.cardNotification.style.color = textColor;
        this.cardNotification.style.visibility = 'visible';
        this.cardNotification.style.top = '5%';
        this.notificationStatus.textContent = text;
    
        setTimeout(() => {
            this.cardNotification.style.top = '-10%';
            this.cardNotification.style.backgroundColor = '';
            this.cardNotification.style.border = '';
            this.cardNotification.style.color = '';
            this.cardNotification.style.visibility = 'hidden';
        }, 2000);
    }

    deleteCard() {
        const cardElement = document.getElementById(`listing-${this.id}`);
        if (cardElement) {
            cardElement.remove();
        }
    
        const index = cards.findIndex(card => card.id === this.id);
        if (index !== -1) {
            cards.splice(index, 1);
        }
    
        saveCardsToLocalStorage();
        this.popupNotification('rgb(255, 232, 105)', 'rgb(236, 185, 0)','rgb(191, 127, 0)', 'Card Deleted Successfully');
    }
    attachEventListeners() {
        const deleteButton = document.getElementById(`delete-${this.id}`);
        if (deleteButton) {
            deleteButton.addEventListener("click", () => this.deleteCard());
        }
    }

    editCard() {
        const editModal = document.querySelector(".edit-card");
        const modalOverlay = document.createElement("div");
        modalOverlay.classList.add("modal-overlay");
        document.body.appendChild(modalOverlay);

        editModal.innerHTML = `
                <div class="edit-wrapper">
                    <p class="card-to-edit">Update information about <br> <span style="color:rgb(0, 170, 255)">${this.name}</span></p>
                    <div class="input-wrapper">
                        <p class="editing-subject">DETAILS</p>
                        <p class="card-subject">Name</p>
                        <input type="text" class="edit-input" value="${this.name}" autocomplete="off">
                    </div>
                    <div class="input-wrapper">
                        <p class="card-subject">Description</p>
                        <textarea name="description" id="description" class="edit-description">${this.description}</textarea>
                    </div>
                    <div class="pricing-wrapper">
                        <div class="subject-wrapper">
                            <p class="editing-subject">PRICING</p>
                        </div>
                        <div class="prices-wrapper">
                            <div class="price-wrapper">
                                <p class="card-subject">Price</p>
                                <input type="number" class="price-input edit-price" value="${this.price}">
                            </div>
                            <div class="price-wrapper">
                                <p class="card-subject">Pricing Model</p>
                                <input type="text" class="price-input edit-pricing-model" value="${this.pricingModel}">
                            </div>
                        </div>
                    </div>
                    <div class="pricing-wrapper">
                        <div class="subject-wrapper">
                            <p class="editing-subject">LOCATION</p>
                        </div>
                        <div class="prices-wrapper">
                            <div class="price-wrapper">
                                <p class="card-subject">Country</p>
                                <input type="text" class="price-input edit-country" value="${this.location.country}">
                            </div>
                            <div class="price-wrapper">
                                <p class="card-subject">City</p>
                                <input type="text" class="price-input edit-city" value="${this.location.city}">
                            </div>
                        </div>
                    </div>
                </div>
                <p class="error">Please fill in all the fields.</p>
                <div class="edit-button-wrapper">
                    <button class="cancel edit-button">Cancel</button>
                    <button class="save edit-button">Save Changes</button>
                </div>
        `;

        modalOverlay.style.display = "block";
        editModal.style.visibility = "visible";
        editModal.style.opacity = "1";
        editModal.style.top = '50%';

        const editFields = {
            name: document.querySelector(".edit-input"),
            description: document.querySelector(".edit-description"),
            price: document.querySelector(".edit-price"),
            pricingModel: document.querySelector(".edit-pricing-model"),
            country: document.querySelector(".edit-country"),
            city: document.querySelector(".edit-city")
        };

        Object.values(editFields).forEach(field => field.addEventListener("keypress", event => handleInputs(event.key)));

        const error = document.querySelector(".error");

        setTimeout(() => {
            editFields.name.focus();
            editFields.name.setSelectionRange(editFields.name.value.length, editFields.name.value.length);
        }, 100);

        function handleInputs(key) {
            if (error.style.visibility === "visible") {
                error.style.visibility = "hidden";
            }
            if (key === "Enter") {
                saveButton.click();
            }
        }

        const cancelButton = document.querySelector(".cancel");
        const saveButton = document.querySelector(".save");

        function closeModal() {
            editModal.style.top = '46%';
            editModal.style.opacity = "0";
            editModal.style.visibility = "hidden";
            modalOverlay.style.display = "none";
            document.body.removeChild(modalOverlay);
        }

        modalOverlay.addEventListener("click", () => closeModal());

        cancelButton.addEventListener("click", closeModal);

        saveButton.addEventListener("click", () => {
            const fields = {
                name: editFields.name.value.trim(),
                description: editFields.description.value.trim(),
                price: editFields.price.value.trim(),
                pricingModel: editFields.pricingModel.value.trim(),
                country: editFields.country.value.trim(),
                city: editFields.city.value.trim()
            };

            if (Object.values(fields).some(value => value === "")) {
                error.style.visibility = "visible";
                return;
            }

            Object.assign(this, {
                name: fields.name,
                description: fields.description,
                price: fields.price,
                pricingModel: fields.pricingModel,
                location: { country: fields.country, city: fields.city }
            });

            this.cardHTML = this.generateCardHTML();

            const oldCard = document.getElementById(`listing-${this.id}`);
            if (oldCard) oldCard.outerHTML = this.cardHTML;

            this.attachEventListeners();
            this.attachEditEventListeners();

            saveCardsToLocalStorage();

            closeModal();

            this.popupNotification('rgb(157, 227, 234)', 'rgb(85, 174, 199)','rgb(11, 130, 163)', 'Card Edited Successfully');
        });
    }

    attachEditEventListeners() {
        const editButton = document.getElementById(`edit-${this.id}`);
        if (editButton) {
            editButton.addEventListener("click", () => this.editCard());
        }
    }
}

function saveCardsToLocalStorage() {
    localStorage.setItem("cards", JSON.stringify(cards));
}

let cards = [];

const savedCards = localStorage.getItem("cards");
if (savedCards) {
    cards = JSON.parse(savedCards).map(cardData => new ListingCards(
        cardData.id,
        cardData.name,
        cardData.description,
        cardData.image,
        cardData.price,
        cardData.currency,
        cardData.location,
        cardData.pricingModel
    ));
} else {
    cards = [
        new ListingCards(
            1,
            "Cozy 5 Stars Apartment",
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam optio quam dignissimos recusandae dolorum in deserunt ratione beatae, eveniet.",
            "Images/card-1.jpeg",
            899,
            "$",
            { city: "Barcelona", country: "Spain" },
            "night"
        ),
        new ListingCards(
            2,
            "Beautiful Castle",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis, sapiente, odio et animi in quam autem corrupti amet error laudantium cumque, architecto.",
            "Images/card-2.jpeg",
            459,
            "$",
            { city: "Milan", country: "Italy" },
            "night"
        ),
        new ListingCards(
            3,
            "Office Studio",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima repellat nobis pariatur dolorum.",
            "Images/card-3.jpeg",
            1119,
            "$",
            { city: "London", country: "UK" },
            "night"
        )
    ];
}

const listingsHTML = document.querySelector(".listings");

cards.forEach(card => {
    listingsHTML.insertAdjacentHTML("beforeend", card.cardHTML);
    card.attachEventListeners();
    card.attachEditEventListeners();
});