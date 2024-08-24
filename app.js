cart = [];
books = 0;
total = 0;
unitCost = 0.25;
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
});

$('#unitCost').on('change', function () {
    if ($('#unitCost').val() == "custom") {
        unitCost = $('#customUnitCost').val()
    }
    else {
        unitCost = $('#unitCost').val();
    }
})

$('#isbn').on('keypress', function (e) {
    if (e.which == 13 && $('#isbn').val() != "" && !cart.includes($('#isbn').val())) {
        $.getJSON(`https://books.rantk.com/?type=book&isbn=${$('#isbn').val()}`, {
            "headers": {
                "accept": "application/ld+json",
                "accept-language": "en-US,en;q=0.9",
                "if-none-match": "\"ce5365904bd9d5ad985d99b28f05be4f-gzip\"",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site"
            },
            "method": "GET",
        }).then(function (response) {
            let tr = document.createElement('tr')
            let title = document.createElement('th')
            let ISBN = document.createElement('th')
            let price = document.createElement('th')
            let removeBtn = document.createElement('button')
            for (i of response.prices) {
                if (i.vendor.name == "SellBackYourBook") {
                    if (i.price > 0) {
                        title.innerText = response.book.title;
                        ISBN.innerText = response.book.isbn13;
                        ISBN.className = 'isbn'
                        price.innerText = i.price;
                        price.className = 'price'
                        removeBtn.innerText = "X"
                        removeBtn.addEventListener('click', function (e) {
                            removalNumber = $(this).closest('tr').find('.price').text();
                            removalISBN = $(this).closest('tr').find('.isbn').text();
                            removeFromCart(removalISBN, cart);
                            total = (total - removalNumber) + unitCost
                            $('#totalNum').text(`Total: ${formatter.format(total)}`)
                            books--;
                            $('#bookNum').text(`Books: ${books}`)
                            console.log(cart)
                            e.target.parentNode.remove();
                        })
                        tr.append(title, ISBN, price, removeBtn);
                        $('#table').append(tr);
                        cart.push(response.book.isbn13);
                        books++;
                        $('#bookNum').text(`Books: ${books}`)
                        total = total + (i.price - unitCost);
                        $('#totalNum').text(`Total: ${formatter.format(total)}`)
                        playGood();
                    }
                    else {
                        playBad();
                    }
                    $('.inputBox').val('');
                }
            }
        })
    }
});

function remove(e) {
    console.log(e)
}

function playGood() {
    var audio = new Audio('./assets/good.mp3');
    audio.play();
}

function playBad() {
    var audio = new Audio('./assets/bad.mp3');
    audio.play();
}

function removeFromCart(isbn, x) {
    const index = x.indexOf(isbn);
    if (index > -1) { // only splice array when item is found
        x.splice(index, 1); // 2nd parameter means remove one item only
    }
}
