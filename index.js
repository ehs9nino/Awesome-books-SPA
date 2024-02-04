// Form local storage availability checker function
function isStorageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return e instanceof DOMException && (
      e.code === 22 || e.code === 1014 || e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') && (storage && storage.length !== 0);
  }
}

// Base class for all types of books
class Book {
  constructor(title, author) {
    this.id = Math.floor(Math.random() * 1000000);
    this.title = title;
    this.author = author;
  }

  displayInfo() {
    return `"${this.title}" by ${this.author}`;
  }
}

// Subclass for publications
class Publication extends Book {
  constructor(title, author, publisher) {
    super(title, author);
    this.publisher = publisher;
  }

  displayInfo() {
    return `${super.displayInfo()} (Published by ${this.publisher})`;
  }
}

// Create a Library class to encapsulate library-related functionality
class Library {
  constructor() {
    this.books = [];
  }

  addBook(book) {
    this.books.push(book);
    localStorage.setItem('bookList', JSON.stringify(this.books));
  }

  removeBook(id) {
    this.books = this.books.filter((book) => book.id !== parseInt(id, 10));
    localStorage.setItem('bookList', JSON.stringify(this.books));
    this.updateBookList();
  }

  getAllBooks() {
    return this.books;
  }

  updateBookList() {
    const bookList = document.querySelector('.added-bklist');
    bookList.innerHTML = '';

    this.books.forEach((el) => {
      bookList.innerHTML += `<div>
      <p>${el.displayInfo()}</p>
      <button id="${el.title}" onclick="remove('${el.id}')" class="remove">Remove</button>
      </div>`;
    });
  }
}

const title = document.querySelector('#title');
const author = document.querySelector('#author');
const form = document.querySelector('#added-book');

let books = [];

// If there's local data available,
if (isStorageAvailable('localStorage')) {
  const data = JSON.parse(localStorage.getItem('bookList'));
  // and if it's not empty, update it
  if (data) {
    books = JSON.parse(localStorage.getItem('bookList'));
  }
}

const newbook = new Library();

form.onsubmit = (event) => {
  event.preventDefault(); // Prevent default form submission behavior

  // Creating a Publication for demonstration
  const newBook = new Publication(title.value, author.value, "Random Publisher");
  newbook.addBook(newBook);

  newbook.updateBookList();
  form.reset();
};

newbook.updateBookList();

const remove = (id) => {
  newbook.removeBook(id);
};

const allBooks = document.querySelector('.all-books');
const addBook = document.querySelector('.add-book');
const contact = document.querySelector('.contact');
const navList = document.querySelector('#list');
const navAdd = document.querySelector('#add');
const navContact = document.querySelector('#contact');

navList.onclick = () => {
  navList.style.color = 'darkblue';
  navAdd.style.removeProperty('color');
  navContact.style.removeProperty('color');
  allBooks.classList.remove('hide');
  addBook.classList.add('hide');
  contact.classList.add('hide');
};

navAdd.onclick = () => {
  navAdd.style.color = 'darkblue';
  navList.style.removeProperty('color');
  navContact.style.removeProperty('color');
  addBook.classList.remove('hide');
  allBooks.classList.add('hide');
  contact.classList.add('hide');
};

navContact.onclick = () => {
  navContact.style.color = 'darkblue';
  navList.style.removeProperty('color');
  navAdd.style.removeProperty('color');
  contact.classList.remove('hide');
  addBook.classList.add('hide');
  allBooks.classList.add('hide');
};

const siteDate = document.querySelector('#date');

function time() {
  const date = new Date();
  const locale = navigator.language;
  const options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: 'true',
  };
  siteDate.textContent = `${date.toLocaleTimeString(locale, options)}`;
  return siteDate;
}
setInterval(time, 1000);
