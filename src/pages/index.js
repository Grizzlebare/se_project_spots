import "../pages/index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import Api from "../utils/API.js";
import { setButtonText, setDeleteButtonText } from "../utils/helpers.js";

/*const initialCards = [
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
*/
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "e047b0c8-75b9-4bd9-92d1-058b3ca551db",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    document.querySelector(".profile__avatar").src = userInfo.avatar;
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;

    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);

//profile elements
const profileEditButton = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const avatarModalButton = document.querySelector(".profile__avatar-btn");

const modals = document.querySelectorAll(".modal");

//card form elements
const cardModalButton = document.querySelector(".profile__add-button");
const cardModal = document.querySelector("#add-card-modal");
const cardFormElement = cardModal.querySelector(".modal__form");
const cardSubmitButton = cardModal.querySelector(".modal__submit-button");
const cardModalClose = cardModal.querySelector(".modal__close-button");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

//avatar
const avatarModal = document.querySelector("#avatar-modal");
const avatarFormElement = avatarModal.querySelector(".modal__form");
const avatarSubmitButton = avatarModal.querySelector(".modal__submit-button");
const avatarModalClose = avatarModal.querySelector(".modal__close-button");
const avatarLinkInput = avatarModal.querySelector("#profile-avatar-input");

//delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form-delete");
const deleteSubmitButton = deleteModal.querySelector(".modal__delete-button");
const cancelButton = document.querySelector(".modal__cancel-button");

let selectedCard;
let selectedCardId;

//preview image popup elements
const previewModal = document.querySelector("#preview-modal");
const imagePreview = previewModal.querySelector(".modal__image");
const imagePreviewCaption = previewModal.querySelector(".modal__caption");
const imagePreviewClose = previewModal.querySelector(".modal__close-button");

const editProfileModal = document.querySelector("#edit-profile-modal");
const editFormElement = editProfileModal.querySelector(".modal__form");
const profileCloseButton = editProfileModal.querySelector(
  ".modal__close-button"
);

const editModalNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editModalDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

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

  cardLikeBtn.addEventListener("click", (evt) => {
    //cardLikeBtn.classList.toggle("card__like-button_liked");
    handleLike(evt, data._id);
  });

  cardDeleteButton.addEventListener("click", () => {
    //cardElement.remove()
    console.log("data", data);
    handleDeleteCard(cardElement, data._id);
  });

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    imagePreview.src = data.link;
    imagePreview.alt = data.name;
    imagePreviewCaption.textContent = data.name;
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscKeyPress);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscKeyPress);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const cardSubmitButton = evt.submitter;
  setButtonText(cardSubmitButton, true, "save", "saving...");
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(cardSubmitButton, false, "Save", "Saving...");
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const deleteButton = evt.submitter;
  setDeleteButtonText(deleteButton, true, "save", "saving...");
  console.log("Deleting card ID:", selectedCardId);
  api
    .deleteCard(selectedCardId)
    .then(() => {
      //remove card form DOM
      selectedCard.remove();
      // close modal
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setDeleteButtonText(deleteButton, false, "Delete", "Deleting...");
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  console.log("selectedCardId set to:", selectedCardId);
  openModal(deleteModal);
}
function handleLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-button_liked");
  //Like status api
  api
    .changeLikeStatus(id, !isLiked)
    .then((data) => {
      evt.target.classList.toggle("card__like-button_liked", data.isLiked);
    })
    .catch(console.error);
}

function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  const cardModalSubmitButton = evt.submitter;
  setButtonText(cardModalSubmitButton, true, "save", "saving...");
  api
    .postCard(inputValues)
    .then((card) => {
      const cardEl = getCardElement(card);
      cardsList.prepend(cardEl);
      cardFormElement.reset();
      disableButton(cardModalSubmitButton, settings);
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(cardModalSubmitButton, false, "Save", "Saving...");
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const avatarModalSubmitButton = evt.submitter;
  setButtonText(avatarModalSubmitButton, true, "Save", "Saving...");
  api
    .editAvatarInfo(avatarLinkInput.value)
    .then((data) => {
      console.log(data);
      document.querySelector(".profile__avatar").src = data.avatar;
      closeModal(avatarModal);
      avatarFormElement.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(avatarModalSubmitButton, false, "Save", "Saving...");
    });
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editProfileModal);
});

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal);
});

cancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (
      evt.target.classList.contains("modal") ||
      evt.target.classList.contains("modal__close-button")
    ) {
      closeModal(modal);
    }
  });
});

function handleEscKeyPress(evt) {
  console.log("Key pressed:", evt.key);
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    console.log("Opened modal found:", openedModal);
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardFormElement.addEventListener("submit", handleAddCardFormSubmit);
avatarFormElement.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);
enableValidation(settings);
