
const productName = document.getElementById("productNameInp");
const productPrice = document.getElementById("productPriceInp");
const productCategory = document.getElementById("productCategoryInp");
const form = document.querySelector('.needs-validation');
const productSale = document.getElementById('saleCheck');
const submitButton = document.getElementById('submit');
const productImg = document.getElementById('productImgInp')
const reader = new FileReader();   
let productsContainer;
let globalIndx;
let editCheck = false;
let productImgHref;


if (localStorage.getItem("productsData") == null) {
    productsContainer = [];
} else {
    productsContainer = JSON.parse(localStorage.getItem("productsData"));
    displayProducts();
}


function displayProducts() {
    let saleCheck ;
    let temp = ``;
    for (let i = 0; i < productsContainer.length; i++) {
        if(productsContainer[i].sale){
            saleCheck = "";
        }
        else{
            saleCheck="d-none";
        }
        temp += `<div class="col-md-4 col-lg-3">
        <div class="product mb-3">
        <img src="`+ productsContainer[i].img + `" class="rounded mb-3">
        <h4>` + productsContainer[i].name + `<span class="ml-3 badge bg-info">` + productsContainer[i].category + `</span>
        </h4>
        <h4>Price:  ` + productsContainer[i].price + `</h4>
        <div class="sale `+  saleCheck +`">Sale</div>
        <button onclick="deletProduct(` + i + `)" class="btn btn-outline-danger btn-sm">Delete</button>
        <button onclick="startEditProduct(` + i + `)" class="btn btn-outline-warning btn-sm">Edit</button>
        </div>
        </div> `;
    }

    document.getElementById("productsRow").innerHTML = temp;

}


function addProduct() {

    let product = {
        name: productName.value,
        price: productPrice.value,
        category: productCategory.value,
        img: productImgHref,
        sale: productSale.checked
    }
    productsContainer.push(product);
    localStorage.setItem("productsData", JSON.stringify(productsContainer));
    displayProducts();
}


function deletProduct(indx) {
    productsContainer.splice(indx, 1);
    localStorage.setItem("productsData", JSON.stringify(productsContainer))
    displayProducts();
}

function startEditProduct(indx) {
    editCheck = true;
    submitButton.textContent = 'Edit Product';
    submitButton.classList.add('btn-warning');
    let product = productsContainer[indx];
    productName.value = product.name;
    productPrice.value = product.price;
    productCategory.value = product.category;
    productImgHref = product.img;
    if(product.sale){
        productSale.checked = true;
    }
    else{
        productSale.checked = false;
    }
    productImg.removeAttribute('required');
    globalIndx = indx;
    scroll({
        top: 0,
        behavior: "smooth"
    });

}

function editProduct() {
    productsContainer[globalIndx].name = productName.value;
    productsContainer[globalIndx].price = productPrice.value;
    productsContainer[globalIndx].category = productCategory.value;
    productsContainer[globalIndx].img = productImgHref;
    productsContainer[globalIndx].sale = productSale.checked;
    localStorage.setItem("productsData", JSON.stringify(productsContainer));
    displayProducts();
    submitButton.textContent = 'Add Product';
    submitButton.classList.remove('btn-warning');
    productImg.required = true;
}

function searchProducts(term) {
    let saleCheck;
    let temp = ``;
    for (let i = 0; i < productsContainer.length; i++) {
        if (productsContainer[i].name.toLowerCase().includes(term.toLowerCase())) {
            if(productsContainer[i].sale){
                saleCheck = "";
            }
            else{
                saleCheck="d-none";
            }
            temp += `<div class="col-md-4 col-lg-3">
            <div class="product mb-3">
            <img src="`+ productsContainer[i].img + `" class="rounded">
            <h4>` + productsContainer[i].name + `<span class="ml-3 badge bg-info">` + productsContainer[i].category + `</span>
            </h4>
            <h4>Price:  ` + productsContainer[i].price + `</h4>
            <div class="sale `+  saleCheck +`">Sale</div>
            <button onclick="deletProduct(` + i + `)" class="btn btn-outline-danger btn-sm">Delete</button>
            <button onclick="startEditProduct(` + i + `) ; " class="btn btn-outline-warning btn-sm">Edit</button>
            </div>
            </div> `;
        }
    }
    if (temp == ``) {
        displayProducts();
    } else {
        document.getElementById("productsRow").innerHTML = temp;
    }
}


productImg.addEventListener('change', function (e) {
    reader.readAsDataURL(e.target.files[0]);
})

reader.onload = function (e) {
    productImgHref = e.target.result;
}

form.addEventListener('submit', function (event) {
    if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
    }
    else if (editCheck) {
        editCheck = false;
        editProduct();
        
    } else {
        addProduct();
    }
    form.classList.add('was-validated')

})
