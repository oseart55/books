cart = [];
books = 0;
total = 0;
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
});

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
            for (i of response.prices) {
                if (i.vendor.name == "SellBackYourBook") {
                    if(i.price > 0){
                        title.innerText = response.book.title;
                        ISBN.innerText = response.book.isbn13;
                        price.innerText = i.price;
                        tr.append(title, ISBN, price);
                        $('#table').append(tr);
                        cart.push(response.book.isbn13);
                        books++;
                        $('#bookNum').text(`Books: ${books}`)
                        total = formatter.format(total += i.price);
                        $('#totalNum').text(`Total: ${total}`)
                        playGood();
                    }
                    else{
                        playBad();
                    }
                    $('.inputBox').val('');
                }
            }
        })
    }
});

function playGood() {
    var audio = new Audio('./assets/good.mp3');
    audio.play();
}

function playBad() {
    var audio = new Audio('./assets/bad.mp3');
    audio.play();
}


