const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Golden Gate bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileEditButton = document.querySelector(".profile__edit-button");
const cardModalButton = document.querySelector(".profile__add-button");

// card elements
const cardModal = document.querySelector("#add-card-modal");
const cardFormElement = cardModal.querySelector(".modal__form");
const cardSubmitButton = cardModal.querySelector(".modal__submit-button");
const cardModalClose = cardModal.querySelector(".modal__close-button");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

// preview elements
const previewModal = document.querySelector("#preview-modal");
const imagePreview = previewModal.querySelector(".modal__image");
const imagePreviewCaption = previewModal.querySelector(".modal__caption");
const imagePreviewClose = previewModal.querySelector(".modal__close-button");

const editProfileModal = document.querySelector("#edit-profile-modal");
const profileCloseButton = editProfileModal.querySelector(
  ".modal__close-button"
);
const editFormElement = editProfileModal.querySelector(".modal__form");

const editModalNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editModalDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function showProfileModal() {
  openModal(editProfileModal);
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
}

function hideAllModals() {
  [editProfileModal, cardModal, previewModal].forEach(closeModal);
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-button_liked");
  });

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    imagePreview.src = data.link;
    imagePreview.alt = data.name;
    imagePreviewCaption.textContent = data.name;
  });

  cardDeleteButton.addEventListener("click", () => {
    cardElement.remove();
  });
  return cardElement;
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscClose);
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscClose);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  disableButton(cardSubmitButton, settings);
  hideAllModals();
}

profileCloseButton.addEventListener("click", () => {
  closeModal(editProfileModal);
});

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalClose.addEventListener("click", () => {
  closeModal(cardModal);
});

imagePreviewClose.addEventListener("click", () => {
  closeModal(previewModal);
});

function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  evt.target.reset();
  disableButton(cardSubmitButton, settings);
  closeModal(cardModal);
}

profileEditButton.addEventListener("click", showProfileModal);
{
  resetValidation(editFormElement, [
    editModalNameInput,
    editModalDescriptionInput,
  ]);
  openModal(editProfileModal);
}

[editProfileModalCloseButton, cardModalClose, previewCloseButton].forEach(
  (button) => {
    button.addEventListener("click", hideAllModals);
  }
);

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardFormElement.addEventListener("submit", handleAddCardFormSubmit);

initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.append(cardElement);
});

const modals = document.querySelectorAll(".modal");
modals.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target === evt.currentTarget) {
      closeModal(modal);
    }
  });
});

const handleEscClose = (evt) => {
  if (evt.key === "Escape") {
    hideAllModals();
  }
};
