const formBuku = document.querySelector('#form-buku');
const listBukuBelumDibaca = document.querySelector('.list-buku-belum-dibaca');
const listBukuSelesaiDibaca = document.querySelector('.list-buku-selesai-dibaca');

const books = JSON.parse(localStorage.getItem('X-BOOKS')) || [];

books.forEach(function (book) {
	if (book.isComplete) {
		renderBuku(book, listBukuSelesaiDibaca);
	} else {
		renderBuku(book, listBukuBelumDibaca);
	}
});

formBuku.addEventListener('submit', (e) => {
	e.preventDefault();
	const booksSubmit = JSON.parse(localStorage.getItem('X-BOOKS')) || [];

	const id = Date.now().toString();
	const title = formBuku.judul.value;
	const author = formBuku.penulis.value;
	const year = formBuku.tahun.value;
	const isComplete = formBuku.is_selesai.checked;

	const book = {
		id,
		title,
		author,
		year,
		isComplete,
	};

	if (isComplete) {
		renderBuku(book, listBukuSelesaiDibaca);
	} else {
		renderBuku(book, listBukuBelumDibaca);
	}

	localStorage.setItem('X-BOOKS', JSON.stringify([...booksSubmit, book]));
	formBuku.reset();
});

function renderBuku({ id, title, author, year, isComplete }, container) {
	const card = `
			<div class="card mb-2" id="${id}">
				<div class="card-body">
					<h5 class="fw-bold">${title}</h5>
					<span class="d-block">Penulis: ${author}</span>
					<span class="d-block">Tahun: ${year}</span>
					<div>
						<span class="badge bg-danger" data-id="${id}">hapus buku</span>
						<span class="badge bg-success" data-id="${id}">${!isComplete ? 'selesai dibaca' : 'belum selesai dibaca'}</span>
					</div>
				</div>
			</div>
		`;
	container.innerHTML += card;

	const deleteButtons = document.querySelectorAll('.badge.bg-danger');
	const updateButtons = document.querySelectorAll('.badge.bg-success');

	deleteButtons.forEach(function (button) {
		button.addEventListener('click', function (e) {
			const booksDelete = JSON.parse(localStorage.getItem('X-BOOKS'));
			const elementID = e.target.dataset.id;
			const elementCard = document.getElementById(elementID);
			const currentBook = booksDelete.filter((book) => book.id == elementID)[0];
			const deletedBook = booksDelete.filter((book) => book.id != elementID);

			if (elementCard) {
				const isDelete = confirm(`apakah yakin untuk menghapus buku ${currentBook.title}?`);

				if (isDelete) {
					localStorage.setItem('X-BOOKS', JSON.stringify(deletedBook));
					elementCard.remove();
					alert(`buku ${currentBook.title} telah dihapus`);
				}
			}
		});
	});

	updateButtons.forEach(function (button) {
		button.addEventListener('click', function (e) {
			const booksUpdated = JSON.parse(localStorage.getItem('X-BOOKS'));
			const elementID = e.target.dataset.id;
			const elementCard = document.getElementById(elementID);
			const currentBook = booksUpdated.filter((book) => book.id == elementID)[0];
			const newBooks = booksUpdated.filter((book) => book.id != elementID);

			currentBook.isComplete = !currentBook.isComplete;

			elementCard.remove();

			if (currentBook.isComplete) {
				renderBuku(currentBook, listBukuSelesaiDibaca);
			} else {
				renderBuku(currentBook, listBukuBelumDibaca);
			}

			localStorage.setItem('X-BOOKS', JSON.stringify([...newBooks, currentBook]));
			console.log({ currentBook, newBooks });
		});
	});
}
