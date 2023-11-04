const fs = require('fs');
const https = require('https');

fetch("https://tiki.vn/api/v2/products?limit=40&include=advertisement&aggregations=2&version=&trackity_id=a76701dd-f0cb-6a3d-1978-27d56c10d2af&q=nuoc+ngot")
    .then(res => res.json())
    .then((data) => {
        data.data.forEach(element => {
            const name = element.brand_name.replace("'", '')
            const fileName = element.url_key.replace("'", '')
            const imgUrl = element.thumbnail_url
            const dec = "Mô tả: " + element.name.replace("'", '')
            const price = element.price
            const sold = element.quantity_sold.value
            https.get(imgUrl, (res) => {
                // Image will be stored at this path 
                const path = `${__dirname}/imageproduct/${fileName}.jpeg`;
                const filePath = fs.createWriteStream(path);
                res.pipe(filePath);
                filePath.on('finish', () => {
                    filePath.close();
                    // console.log('Download Completed');
                    const queryString = [
                        'INSERT INTO product (NAME,PRICE,DES_PRODUCT,SOLD,ID_typeProduct,ID_bill,image)',
                        `VALUES ('${name}',${price}, '${dec}',${sold}, ${2},${null},'${fileName}.jpeg'); \n`
                    ].join(' ')
                    fs.appendFile('queryproductnuocngot.sql', queryString, function (err) {
                        if (err) throw err;
                        console.log('Saved!');
                    });
                })
            })
        });
    }
    )
