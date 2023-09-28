const storageKey = "STORAGE_KEY";
const formAddingBook = document.getElementById("inputBook");
const formSearchingBook = document.getElementById("searchBook");

function CheckForStorage() {
  return typeof Storage !== "undefined";
}

function GetBookList() {
  if (CheckForStorage()) {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  }
  return [];
}

function SaveBookList(bookData) {
  localStorage.setItem(storageKey, JSON.stringify(bookData));
}

function ResetAllForm() {
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookIsComplete").checked = false;

  document.getElementById("searchBookTitle").value = "";
}

function RenderBookList(bookData) {
  const containerIncomplete = document.getElementById("incompleteBookshelfList");
  const containerComplete = document.getElementById("completeBookshelfList");

  containerIncomplete.innerHTML = "";
  containerComplete.innerHTML = "";

  for (let book of bookData) {
    const id = book.id;
    const title = book.title;
    const author = book.author;
    const year = book.year;
    const isComplete = book.isComplete;

    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item", "select_item");
    bookItem.innerHTML = `
      <h3 name="${id}">${title}</h3>
      <p>Penulis: ${author}</p>
      <p>Tahun: ${year}</p>
    `;

    const containerActionItem = document.createElement("div");
    containerActionItem.classList.add("action");

    const greenButton = CreateGreenButton(book, () => {
      isCompleteBookHandler(id);
    });

    const redButton = CreateRedButton(() => {
      DeleteAnItem(id);
    });

    containerActionItem.append(greenButton, redButton);
    bookItem.append(containerActionItem);

    if (isComplete === false) {
      containerIncomplete.appendChild(bookItem);
      bookItem.querySelector("h3").addEventListener("click", () => {
        UpdateAnItem(id);
      });
    } else {
      containerComplete.appendChild(bookItem);
      bookItem.querySelector("h3").addEventListener("click", () => {
        UpdateAnItem(id);
      });
    }
  }
}

formAddingBook.addEventListener("submit", function (event) {
  event.preventDefault();
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = parseInt(document.getElementById("inputBookYear").value);
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const idTemp = document.getElementById("inputBookTitle").name;
  const bookData = GetBookList();

  if (idTemp !== "") {
    const index = bookData.findIndex((book) => book.id == idTemp);
    if (index !== -1) {
      bookData[index] = {
        id: idTemp,
        title: title,
        author: author,
        year: year,
        isComplete: isComplete,
      };
      SaveBookList(bookData);
      ResetAllForm();
      RenderBookList(bookData);
    }
  } else {
    const id = bookData.length > 0 ? bookData[bookData.length - 1].id + 1 : 1;
    const newBook = {
      id: id,
      title: title,
      author: author,
      year: year,
      isComplete: isComplete,
    };

    bookData.push(newBook);
    SaveBookList(bookData);

    ResetAllForm();
    RenderBookList(bookData);
  }
});

function CreateGreenButton(book, eventListener) {
  const buttonText = book.isComplete ? "Belum selesai" : "Selesai";
  const greenButton = document.createElement("button");
  greenButton.classList.add("green");
  greenButton.innerText = buttonText + " di Baca";
  greenButton.addEventListener("click", function () {
    eventListener();
  });
  return greenButton;
}

function CreateRedButton(eventListener) {
  const redButton = document.createElement("button");
  redButton.classList.add("red");
  redButton.innerText = "Hapus buku";
  redButton.addEventListener("click", function () {
    eventListener();
  });
  return redButton;
}

function isCompleteBookHandler(id) {
  const bookData = GetBookList();
  const bookIndex = bookData.findIndex((book) => book.id == id);
  if (bookIndex !== -1) {
    bookData[bookIndex].isComplete = !bookData[bookIndex].isComplete;
    SaveBookList(bookData);
    RenderBookList(bookData);
  }
}

function DeleteAnItem(id) {
  const bookData = GetBookList();
  const bookIndex = bookData.findIndex((book) => book.id == id);
  if (bookIndex !== -1) {
    bookData.splice(bookIndex, 1);
    SaveBookList(bookData);
    RenderBookList(bookData);
  }
}

function UpdateAnItem(id) {
  const bookData = GetBookList();
  const book = bookData.find((book) => book.id == id);
  if (book) {
    document.getElementById("inputBookTitle").value = book.title;
    document.getElementById("inputBookTitle").name = book.id;
    document.getElementById("inputBookAuthor").value = book.author;
    document.getElementById("inputBookYear").value = book.year;
    document.getElementById("inputBookIsComplete").checked = book.isComplete;
  }
}

formSearchingBook.addEventListener("submit", function (event) {
  event.preventDefault();
  const title = document.getElementById("searchBookTitle").value.toLowerCase();
  const bookData = GetBookList();
  const filteredBooks = bookData.filter((book) =>
    book.title.toLowerCase().includes(title)
  );
  RenderBookList(filteredBooks);
});

window.addEventListener("load", function () {
  if (CheckForStorage()) {
    const bookData = GetBookList();
    RenderBookList(bookData);
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});