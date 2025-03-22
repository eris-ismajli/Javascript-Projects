class Sidebar {
    constructor() {
        this.sidebar = document.getElementById("aside");
        this.toggleButton = document.querySelector(".header-button");
        this.textsToHide = document.querySelectorAll(".element-visibility");
        this.mainContent = document.querySelector(".main-content");
        this.links = document.querySelectorAll(".aside-link");
        this.settingsButton = document.querySelector(".settings-button");
        this.personalisePanel = document.querySelector(".personalise");
        this.dashboardColorButtons = document.querySelectorAll(".color");
        this.sidebarColorButtons = document.querySelectorAll(".color-sidebar");
        this.dashboard = document.querySelector(".dashboard");
        this.invertColorElements = document.querySelectorAll(".invert");
        this.textElements = document.querySelectorAll(".text");
        this.profileWrapper = document.querySelector(".profile-wrapper");
        this.dropdownWords = document.querySelectorAll(".dropdown-word");
        this.initials = document.querySelectorAll(".initial");

        this.sidebarImageButtons = document.querySelectorAll(".image");
        this.imageSlider = document.getElementById("sidebar-image");
        this.selectedSidebarImage = "";
        this.selectedSidebarColor = "";

        this.isExpanded = localStorage.getItem("sidebarExpanded") === "true";

        this.applyStoredStyles();
        this.applySidebarState();
        this.setupLinkToggle();
        this.setupSettingsButton();

        this.toggleButton.addEventListener("click", () => this.toggleSidebar());
    }

    buttonHoverEffect(options) {
        options.forEach(option => {
            option.addEventListener("mouseenter", () => {
                if (!option.classList.contains("selected-color")) {
                    option.style.outline = "3px solid #00b5ff";
                }
            });

            option.addEventListener("mouseleave", () => {
                if (!option.classList.contains("selected-color")) {
                    option.style.outline = "none";
                }
            });
        });
    }

    setupSettingsButton() {
        this.settingsButton.addEventListener("click", () => {
            this.personalisePanel.classList.toggle("visible");
        });
        this.buttonHoverEffect(this.dashboardColorButtons);
        this.buttonHoverEffect(this.sidebarColorButtons);
        this.buttonHoverEffect(this.sidebarImageButtons);

        this.selectDashboardColor();
        this.selectSidebarColor();
        this.selectSidebarImage();
        this.toggleSidebarImage();
    }

    toggleTextVisibility(visible, transparency) {
        this.textsToHide.forEach(text => {
            text.style.opacity = transparency;
            text.style.visibility = visible;
        });
    }

    setupLinkToggle() {
        this.links.forEach(link => {
            link.addEventListener("click", () => {
                const arrow = link.querySelector(".dropdown-toggle");
                const dropdown = link.nextElementSibling;

                if (!dropdown || !dropdown.classList.contains("link-dropdown")) return;

                if (dropdown.style.maxHeight === "" || dropdown.style.maxHeight === "0px") {
                    arrow.classList.add("rotated");
                    dropdown.style.maxHeight = dropdown.scrollHeight + "px";
                } else {
                    arrow.classList.remove("rotated");
                    dropdown.style.maxHeight = "0px";
                }
            });
        });
    }

    manageSidebarStates(display, width){
        this.dropdownWords.forEach(word => {
            word.style.display = display;
        });
        this.initials.forEach(initial => {
            initial.style.width = width;
            if(width == "100%"){
                initial.addEventListener("mouseenter", () => {
                    initial.style.color = "rgb(255, 136, 0)";
                    initial.style.textShadow = "0 0 10px rgb(255, 136, 0)";
                });

                initial.addEventListener("mouseleave", () => {
                    initial.style.color = "rgb(255, 255, 255)";
                    initial.style.textShadow = "none";
                });
            }else{
                initial.addEventListener("mouseenter", () => {
                    initial.style.color = "white";
                    initial.style.textShadow = "none";
                });

                initial.addEventListener("mouseleave", () => {
                    initial.style.color = "rgb(255, 255, 255)";
                    initial.style.textShadow = "none";
                });
            }
        })
    }

    applySidebarState() {
        if (this.isExpanded) {
            this.sidebar.style.width = "85px";
            this.toggleTextVisibility("hidden", 0);
            this.manageSidebarStates("none", "100%");
            this.mainContent.style.width = "calc(100% - 85px)";
            this.toggleButton.src = "Images/menu.svg";
        } else {
            this.sidebar.style.width = "";
            this.toggleTextVisibility("visible", 1);
            this.manageSidebarStates("flex", "");
            this.mainContent.style.width = "";
            this.toggleButton.src = "Images/more.svg";
        }
    }

    toggleSidebar() {
        this.isExpanded = !this.isExpanded;
        localStorage.setItem("sidebarExpanded", this.isExpanded);
        this.applySidebarState();
    }

    selectDashboardColor() {
        this.dashboardColorButtons.forEach((button, index) => {
            button.addEventListener("click", () => {
                this.dashboardColorButtons.forEach(btn => {
                    btn.classList.remove("selected-color");
                    btn.style.outline = "none";
                });

                const bgColor = window.getComputedStyle(button).backgroundColor;
                const rgbValues = bgColor.match(/\d+, \d+, \d+/)[0];

                this.dashboard.style.backgroundColor = `rgb(${rgbValues})`;
                this.dashboard.style.boxShadow = `0 2px 10px rgba(${rgbValues}, 0.5)`;

                button.classList.add("selected-color");
                button.style.outline = "3px solid #00b5ff";

                localStorage.setItem("selectedDashboardColorIndex", index);
                localStorage.setItem("dashboardBackgroundColor", `rgb(${rgbValues})`);
                localStorage.setItem("dashboardBoxShadow", `0 2px 10px rgba(${rgbValues}, 0.5)`);
            });
        });
    }

    invertElementColors(invert, borderColor) {
        this.invertColorElements.forEach(element => {
            element.style.filter = invert;
        });
        this.textElements.forEach(text => {
            text.style.filter = invert;
        });

        this.profileWrapper.style.borderBottom = `1px solid ${borderColor}`;
        this.profileWrapper.style.borderTop = `1px solid ${borderColor}`;

        localStorage.setItem("invertFilter", invert);
        localStorage.setItem("borderColor", borderColor);
    }

    selectSidebarColor() {
        this.sidebarColorButtons.forEach((button, index) => {
            button.addEventListener("click", () => {
                this.sidebarColorButtons.forEach(btn => {
                    btn.classList.remove("selected-color");
                    btn.style.outline = "none";
                });

                this.imageSlider.checked = false;
                localStorage.setItem("sliderState", JSON.stringify(false));
                this.sidebar.style.backgroundImage = "none";
                localStorage.setItem("sidebarImage", "none");

                const sidebarColor = window.getComputedStyle(button).backgroundColor;
                this.selectedSidebarColor = sidebarColor;
                this.sidebar.style.backgroundColor = this.selectedSidebarColor;

                if (this.selectedSidebarColor === "rgb(227, 227, 227)") {
                    this.invertElementColors("invert(80%)", "rgba(60, 60, 60, 0.5)");
                } else {
                    this.invertElementColors("invert(0%)", "rgba(255, 255, 255, 0.395)");
                }

                button.classList.add("selected-color");
                button.style.outline = "3px solid #00b5ff";

                localStorage.setItem("sidebarBackgroundColor", this.selectedSidebarColor);
                localStorage.setItem("selectedSidebarColorIndex", index);
            });
        });
    }

    selectSidebarImage() {
        this.sidebarImageButtons.forEach((imageButton, index) => {
            imageButton.addEventListener("click", () => {
                this.sidebarImageButtons.forEach(btn => {
                    btn.classList.remove("selected-color");
                    btn.style.outline = "none";
                });

                const selectedImage = imageButton.src;
                this.selectedSidebarImage = `url("${selectedImage}")`;

                this.imageSlider.checked = true;
                localStorage.setItem("sliderState", JSON.stringify(true));

                if (this.selectedSidebarImage) {
                    this.sidebar.style.backgroundImage = this.selectedSidebarImage;
                    this.sidebar.style.backgroundColor = "";
                    localStorage.setItem("sidebarImage", this.selectedSidebarImage);
                    localStorage.setItem("sidebarBackgroundColor", "");
                    this.invertElementColors("invert(0%)", "rgba(255, 255, 255, 0.395)");
                } else {
                    this.sidebar.style.backgroundImage = "";
                    localStorage.removeItem("sidebarImage");
                }

                imageButton.classList.add("selected-color");
                imageButton.style.outline = "3px solid #00b5ff";

                localStorage.setItem("selectedSidebarImageIndex", index);
            });
        });
    }

    toggleSidebarImage() {
        this.imageSlider.addEventListener("change", (event) => {
            const isChecked = event.target.checked;
            if (isChecked) {
                this.sidebar.style.backgroundImage = this.selectedSidebarImage;
                this.sidebar.style.backgroundColor = "";
                localStorage.setItem("sidebarImage", this.selectedSidebarImage);
                localStorage.setItem("sidebarBackgroundColor", "");
                this.invertElementColors("invert(0%)", "rgba(255, 255, 255, 0.395)");
            } else {
                this.sidebar.style.backgroundImage = "none";
                localStorage.setItem("sidebarImage", "none");
                if (this.selectedSidebarColor) {
                    this.sidebar.style.backgroundColor = this.selectedSidebarColor;
                    console.log(this.selectedSidebarColor)
                    localStorage.setItem("sidebarBackgroundColor", this.selectedSidebarColor);
                    if (this.selectedSidebarColor === "rgb(227, 227, 227)") {
                        this.invertElementColors("invert(80%)", "rgba(60, 60, 60, 0.5)");
                    } else {
                        this.invertElementColors("invert(0%)", "rgba(255, 255, 255, 0.395)");
                    }
                } else {
                    this.sidebar.style.backgroundColor = "";
                    localStorage.setItem("sidebarBackgroundColor", "");
                }
                localStorage.setItem("selectedSidebarImage", this.selectedSidebarImage);
            }

            localStorage.setItem("sliderState", JSON.stringify(isChecked));
        });
    }

    applyStoredStyles() {
        const savedSliderState = localStorage.getItem("sliderState");
        const savedSidebarImage = localStorage.getItem("sidebarImage");
        const savedSelectedSidebarImage = localStorage.getItem("selectedSidebarImage");
        const savedSelectedSidebarImageIndex = localStorage.getItem("selectedSidebarImageIndex");
        const savedSelectedSidebarColorIndex = localStorage.getItem("selectedSidebarColorIndex");
    
        if (savedSliderState !== null) {
            this.imageSlider.checked = JSON.parse(savedSliderState);
        }
    
        if (savedSidebarImage) {
            if (savedSidebarImage === "none") {
                this.sidebar.style.backgroundImage = "none";
            } else {
                this.sidebar.style.backgroundImage = savedSidebarImage;
                this.selectedSidebarImage = savedSidebarImage;
            }
        } else {
            this.sidebar.style.backgroundImage = "";
            const defaultSidebarImage = document.querySelector(".sidebar-1");
            defaultSidebarImage.style.outline = "3px solid #00b5ff";
        }
    
        if (savedSelectedSidebarImage) {
            this.selectedSidebarImage = savedSelectedSidebarImage;
        }
    
        if (savedSelectedSidebarImageIndex !== null) {
            const selectedImageButton = this.sidebarImageButtons[savedSelectedSidebarImageIndex];
            if (selectedImageButton) {
                selectedImageButton.classList.add("selected-color");
                selectedImageButton.style.outline = "3px solid #00b5ff";
            }
        }
    
        if (savedSelectedSidebarColorIndex !== null) {
            const selectedColorButton = this.sidebarColorButtons[savedSelectedSidebarColorIndex];
            if (selectedColorButton) {
                selectedColorButton.classList.add("selected-color");
                selectedColorButton.style.outline = "3px solid #00b5ff";
                this.selectedSidebarColor = window.getComputedStyle(selectedColorButton).backgroundColor;
    
                this.imageSlider.addEventListener("change", (event) => {
                    if (!event.target.checked) {
                        this.sidebar.style.backgroundColor = this.selectedSidebarColor;
                        localStorage.setItem("sidebarBackgroundColor", this.selectedSidebarColor);
                        if (this.selectedSidebarColor === "rgb(227, 227, 227)") {
                            this.invertElementColors("invert(80%)", "rgba(60, 60, 60, 0.5)");
                        } else {
                            this.invertElementColors("invert(0%)", "rgba(255, 255, 255, 0.395)");
                        }
                    }
                });
            }
        }
    
        const savedBgColor = localStorage.getItem("dashboardBackgroundColor");
        const savedBoxShadow = localStorage.getItem("dashboardBoxShadow");
        const selectedColorIndex = localStorage.getItem("selectedDashboardColorIndex");
        const savedSidebarColor = localStorage.getItem("sidebarBackgroundColor");
    
        if (savedSidebarColor !== null) {
            this.sidebar.style.backgroundColor = savedSidebarColor;
        } else {
            this.sidebar.style.backgroundColor = "";
            const defaultSidebarColor = document.querySelector(".black");
            defaultSidebarColor.style.outline = "3px solid #00b5ff";
        }
    
        if (savedBgColor) {
            this.dashboard.style.backgroundColor = savedBgColor;
        } else {
            const defaultDashboardColor = document.querySelector(".red");
            defaultDashboardColor.style.outline = "3px solid #00b5ff";
        }
    
        if (savedBoxShadow) {
            this.dashboard.style.boxShadow = savedBoxShadow;
        }
    
        if (selectedColorIndex !== null) {
            const button = this.dashboardColorButtons[selectedColorIndex];
            if (button) {
                button.classList.add("selected-color");
                button.style.outline = "3px solid #00b5ff";
            }
        }
    
        const savedInvertFilter = localStorage.getItem("invertFilter");
        const savedBorderColor = localStorage.getItem("borderColor");
    
        if (savedInvertFilter && savedBorderColor) {
            this.invertElementColors(savedInvertFilter, savedBorderColor);
        }
    }
}

class Notifications {
    constructor() {
        this.notificationButton = document.querySelector(".notifications-button");
        this.notificationList = document.querySelector(".notification-list");
        this.notificationDropdown = document.querySelector(".notification-dropdown");
        this.notificationNumber = document.querySelector(".notification-number");
        this.notifications = [
            "John Doe sent a message",
            "Someone viewed your profile",
            "John Doe sent a message",
            "Someone viewed your profile",
            "Another notification"
        ];

        this.loadNotifications();
        this.toggleNotifications();
    }

    loadNotifications(){
        let notificationsHTML = '';
        this.notifications.forEach(notification => {
            notificationsHTML += `
                <li>${notification}</li>
            `;
        });
        this.notificationList.innerHTML = notificationsHTML;
        this.notificationNumber.textContent = this.notifications.length;
    }

    toggleNotifications(){
        let notificationsOpened = false;
        this.notificationButton.addEventListener("click", () => {
            if(!notificationsOpened){
                this.notificationDropdown.style.visibility = "visible";
                this.notificationDropdown.style.opacity = "1";
                this.notificationDropdown.style.top = "0.4em";
                notificationsOpened = true;
            }else{
                this.notificationDropdown.style.visibility = "";
                this.notificationDropdown.style.opacity = "";
                this.notificationDropdown.style.top = "";
                notificationsOpened = false;
            }
        })
    }
}

const sidebar = new Sidebar();
const notifications = new Notifications();