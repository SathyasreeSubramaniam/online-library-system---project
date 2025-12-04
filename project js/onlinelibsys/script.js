const bookList = document.getElementById("bookList");

// SEARCH BOOKS FROM GOOGLE API
function searchBooks() {
  const input = document.getElementById("searchBook").value.trim();

  if (input === "") {
    alert("Enter book name");
    return;
  }

  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${input}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayBooks(data.items);
    })
    .catch(error => {
      bookList.innerHTML = "<p>Error loading books</p>";
      console.error(error);
    });
}



// DISPLAY GOOGLE BOOKS
function displayBooks(books) {
  bookList.innerHTML = "";

  if (!books || books.length === 0) {
    bookList.innerHTML = "<p>No books found</p>";
    return;
  }

  books.forEach(book => {
    const info = book.volumeInfo;

    const title = info.title || "No title";
    const authors = info.authors ? info.authors.join(", ") : "Unknown";
    const category = info.categories ? info.categories[0] : "General";
    const link = info.previewLink || "#";

    const card = document.createElement("div");
    card.className = "card book";

    card.innerHTML = `
      <h3>${title}</h3>
      <p><b>Author:</b> ${authors}</p>
      <p><b>Category:</b> ${category}</p>
      <button class="read-btn">Read / Preview</button>
    `;

    card.onclick = () => {
      window.open(link, "_blank");
    };

    bookList.appendChild(card);
  });
}



// DARK MODE
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}


function addStudent() {
    // Get input values
    const name = document.getElementById("studentName").value.trim();
    const id = document.getElementById("studentID").value.trim();

    // Validation: check if inputs are not empty
    if (name === "" || id === "") {
        alert("Please enter both Name and ID!");
        return;
    }

    // Create a new table row
    const tableBody = document.getElementById("studentTable");
    const row = document.createElement("tr");

    // Create table cells
    const nameCell = document.createElement("td");
    nameCell.textContent = name;
    const idCell = document.createElement("td");
    idCell.textContent = id;

    // Append cells to row
    row.appendChild(nameCell);
    row.appendChild(idCell);

    // Append row to table
    tableBody.appendChild(row);

    // Clear input fields after adding
    document.getElementById("studentName").value = "";
    document.getElementById("studentID").value = "";
}

// Arrays to store students and issued books
let students = JSON.parse(localStorage.getItem("students")) || [];
let issuedBooks = JSON.parse(localStorage.getItem("issuedBooks")) || [];

// Load data on page load
window.onload = function() {
    displayStudents();
    displayIssuedBooks();
}

// Add student
function addStudent() {
    const name = document.getElementById("studentName").value.trim();
    const id = document.getElementById("studentID").value.trim();

    if (!name || !id) {
        alert("Enter both Name and ID!");
        return;
    }

    // Check if student already exists
    if (students.some(s => s.id === id)) {
        alert("Student ID already exists!");
        return;
    }

    students.push({ name, id });
    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();

    document.getElementById("studentName").value = "";
    document.getElementById("studentID").value = "";
}

// Display students in table
function displayStudents() {
    const table = document.getElementById("studentTable");
    table.innerHTML = "";
    students.forEach(s => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${s.name}</td><td>${s.id}</td>`;
        table.appendChild(row);
    });
}

// Issue book
function issueBook() {
    const studentName = document.getElementById("issueStudent").value.trim();
    const bookName = document.getElementById("bookName").value.trim();

    if (!studentName || !bookName) {
        alert("Enter Student Name and Book Name!");
        return;
    }

    // Find student by name
    const student = students.find(s => s.name.toLowerCase() === studentName.toLowerCase());
    if (!student) {
        alert("Student not registered!");
        return;
    }

    // Check if already issued
    if (issuedBooks.some(b => b.studentID === student.id && b.book === bookName)) {
        alert(`${studentName} already issued "${bookName}"`);
        return;
    }

    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();

    issuedBooks.push({
        studentID: student.id,
        name: student.name,
        book: bookName,
        date,
        time
    });

    localStorage.setItem("issuedBooks", JSON.stringify(issuedBooks));
    displayIssuedBooks();

    document.getElementById("issueStudent").value = "";
    document.getElementById("bookName").value = "";
}

// Display issued books
function displayIssuedBooks() {
    const table = document.getElementById("issueTable");
    table.innerHTML = "";
    issuedBooks.forEach(b => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${b.studentID}</td><td>${b.name}</td><td>${b.book}</td><td>${b.date}</td><td>${b.time}</td>`;
        table.appendChild(row);
    });
}
