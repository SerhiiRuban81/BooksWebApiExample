async function getBooks() {
    const response = await fetch("api/books", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const books = await response.json();
        books.forEach(book => {
            const tbody = document.querySelector("tbody");
            tbody.append(row(book));
        });
    }
}

function row(book) {
    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", book.id);
    const idTd = document.createElement("td");
    idTd.append(book.id);
    tr.append(idTd);

    const titleTd = document.createElement("td");
    titleTd.append(book.title);
    tr.append(titleTd);

    const authorTd = document.createElement("td");
    authorTd.append(book.auhor);
    tr.append(authorTd);

    const priceTd = document.createElement("td");
    priceTd.append(book.price);
    tr.append(priceTd);

    const linksTd = document.createElement("td");
    const editLink = document.createElement("a");
    editLink.append("Редактировать");
    editLink.setAttribute("style", "margin: 15px; cursor: pointer");
    editLink.setAttribute("data-id", book.id);
    editLink.setAttribute("class", "btn-btn-primary");
    editLink.addEventListener("click", e => {
        e.preventDefault();
        getBook(book.id);
    });
    linksTd.append(editLink);
    const deleteLink = document.createElement("a");
    deleteLink.append("Удалить");
    deleteLink.setAttribute("style", "margin: 15px; cursor: pointer");
    deleteLink.setAttribute("data-id", book.id);
    deleteLink.setAttribute("class", "btn-btn-primary");
    deleteLink.addEventListener("click", e => {
        e.preventDefault();
        deleteBook(book.id);
    });
    linksTd.append(editLink);
    linksTd.append(deleteLink);
    tr.append(linksTd);
    return tr;
}

async function getBook(id) {
    const response = await fetch("api/books/" + id, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const book = await response.json();
        const form = document.forms["bookForm"];
        form.elements["id"].value = book.id;
        form.elements["title"].value = book.title;
        form.elements["author"].value = book.auhor;
        form.elements["price"].value = book.price;
    }
}
async function createBook(title, author, price) {
    const response = await fetch("api/books", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            title: title, auhor: author, price: parseFloat(price)
        })
    });
    if (response.ok === true) {
        const book = await response.json();
        document.querySelector("tbody").appendChild(row(book));
        reset();
    }
}

async function editBook(bookId, title, author, price) {
    const response = await fetch("api/books/" + bookId, {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            id: parseInt(bookId),
            title: title, auhor: author, price: parseFloat(price)
        })
    });
    if (response.ok === true) {
        const book = {
            id: parseInt(bookId),
            title: title, auhor: author, price: parseFloat(price)
        };
        document.querySelector("tr[data-rowid='" + bookId + "']").replaceWith(row(book));
        reset();
    }
}

async function deleteBook(id) {
    const response = await fetch("api/books/" + id, {
        method: "DELETE"
    });
    if (response.ok === true) {
        document.querySelector("tr[data-rowid='" + id + "']").remove();
    }
}
const resetBtn = document.getElementById("reset");
resetBtn.addEventListener("click", e => {
    e.preventDefault();
    reset();

});

function reset() {
    const form = document.forms["bookForm"];
    form.elements["title"].value = "";
    form.elements["author"].value = "";
    form.elements["price"].value = "";
    const hid = document.querySelector("input[type='hidden']");
    hid.value = 0;
}

const subm = document.querySelector("button[type='submit']");
subm.addEventListener("click", e => {
    e.preventDefault();

    const form = document.forms["bookForm"];
    const id = form.elements["id"].value;
    const title = form.elements["title"].value;
    const author = form.elements["author"].value;
    const price = form.elements["price"].value;
    if (id == 0)
        createBook(title, author, price);
    else
        editBook(id, title, author, price);
})
getBooks();