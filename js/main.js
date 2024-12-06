let productName = document.getElementById("productName");
let productPrice = document.getElementById("productPrice");
let productCatagory = document.getElementById("productCatagory");
let productImage = document.getElementById("productImage");
let productDesc = document.getElementById("productDesc");
let addBtn = document.getElementById("addBtn");
let updateBtn = document.getElementById("updateBtn");
let searchInpt = document.getElementById("searchInpt");
let sortProductBtn = document.getElementById("sortProduct");
let returnBack = document.getElementById("returnBack");
let deleteAll = document.getElementById("deleteAll");
const imgExistingFile = document.querySelector(".imageFile");
let productList = [];

if (localStorage.getItem("data")) {
  productList = JSON.parse(localStorage.getItem("data"));
  displayProduct(productList);
}
/*check if any product in local storage*/
checkProductFound(JSON.parse(localStorage.getItem("data")));
/******** */
/*fill input values*/
function fillValues(product) {
  productName.value = `${product ? product.name : ""}`;
  productDesc.value = `${product ? product.productDesc : ""}`;
  productPrice.value = `${product ? product.price : ""}`;
  productCatagory.value = `${product ? product.productCatagory : ""}`;
  if (product && product.productImage) {
    imgExistingFile.classList.remove("d-none");
    imgExistingFile.src = product.productImage;
  } else {
    imgExistingFile.src = "";
    imgExistingFile.classList.add("d-none");
    productImage.value = "";
  }
}
/******** */

/*add new product */
function addProduct() {
  if (
    validation(productName) &&
    validation(productPrice) &&
    validation(productCatagory) &&
    validation(productImage) &&
    validation(productDesc)
  ) {
    var product = {
      name: productName.value,
      price: productPrice.value,
      productCatagory: productCatagory.value,
      productImage: `./images/${productImage.files[0].name}`,
      productDesc: productDesc.value,
    };
    productList.push(product);
    addToLocalStorage();
    displayProduct(productList);
    checkProductFound(productList);
    fillValues();
  } else {
    Swal.fire({
      title: "Error!",
      text: "please enter valid information",
      icon: "error",
      confirmButtonText: "Cool",
    });
  }
}
/*** */
/*display product*/
function displayProduct(productList) {
  var blackbox = "";
  productList.forEach((e, index) => {
    blackbox += `
     <div class="col-md-6 col-lg-3">
      <div class="card border-0 shadow-sm bg-white">
        <img src="${e.productImage}"  class="card-img-top" alt="..." />
        <div class="card-body">
          <div class="card-text d-flex justify-content-between">
           <span class="card-title badge bg-primary fs-1">${e.productCatagory}</span>
            <span class="text-danger">${e.price}LE</span>
          </div>
            <span class="name">${e.title ? e.title : e.name}</span>
          <p class="productdesc mt-1">${e.productDesc}</p>
           <div class="d-flex justify-content-between">
            <span class="btn btn-outline-success edit" editIndex=${index} onclick="editProduct(this)"><i class="bi bi-pencil-fill"></i></span>
             <span class="btn btn-outline-danger" onclick="deleteProduct(${index})"><i class="bi bi-trash-fill"></i></span>
          </div>
        </div>
      </div>
    </div>
    `;
  });
  document.querySelector(".container .row").innerHTML = blackbox;
}
/******** */
/*sort product by price*/

sortProductBtn.addEventListener("click", function () {
  var newArr = productList.sort((a, b) => a.price - b.price);
  //sort products by price
  displayProduct(newArr);
});
returnBack.addEventListener("click", function () {
  /*return original product list before sort*/
  productList = JSON.parse(localStorage.getItem("data"));
  displayProduct(JSON.parse(localStorage.getItem("data")));
});
/******** */
/*add to local storage*/
function addToLocalStorage() {
  localStorage.setItem("data", JSON.stringify(productList));
}
/*end add to local storage*/
/*start delete product*/
function deleteProduct(index) {
  productList.splice(index, 1);
  displayProduct(productList);
  checkProductFound(productList);
  addToLocalStorage();
}
deleteAll.addEventListener("click", deleteAllProduct);
function deleteAllProduct() {
  productList = [];
  displayProduct(productList);
  checkProductFound(productList);
  addToLocalStorage();
}
/*end delete product*/

/*start update product*/
function updateProduct() {
  if (
    validation(productName) &&
    validation(productPrice) &&
    validation(productCatagory) &&
    validation(productImage) &&
    validation(productDesc)
  ) {
    productList[updateBtn.getAttribute("index")].name = productName.value;
    productList[updateBtn.getAttribute("index")].productDesc =
      productDesc.value;
    productList[updateBtn.getAttribute("index")].price = productPrice.value;
    productList[updateBtn.getAttribute("index")].productCatagory =
      productCatagory.value;
    if (productImage.files.length > 0) {
      productList[
        updateBtn.getAttribute("index")
      ].productImage = `./images/${productImage.files[0].name}`;
    }

    displayProduct(productList);
    addToLocalStorage();
    addBtn.classList.remove("d-none");
    updateBtn.classList.add("d-none");
    fillValues();
  } else {
    Swal.fire({
      title: "Error!",
      text: "please enter valid information",
      icon: "error",
      confirmButtonText: "Cool",
    });
  }
}

function editProduct(inpt) {
  fillValues(productList[inpt.getAttribute("editIndex")]);
  addBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
  updateBtn.setAttribute("index", inpt.getAttribute("editIndex"));
}
/*end update product*/

/*start search product*/
searchInpt.addEventListener("input", searchProductByTitle);
function searchProductByTitle() {
  var newArr = [];
  var count = 0;
  for (let i = 0; i < productList.length; i++) {
    if (
      productList[i].name.toLowerCase().includes(searchInpt.value.toLowerCase())
    ) {
      newArr.push(productList[i]);
      productList[i].title = productList[i].name
        .toLowerCase()
        .replaceAll(
          searchInpt.value.toLowerCase(),
          `<span class="text-danger">${searchInpt.value.toLowerCase()}</span>`
        ); //
      document.querySelector("#searchInpt + span").classList.add("d-none");
    } else {
      if (
        productList[i].name
          .toLowerCase()
          .includes(searchInpt.value.toLowerCase()) == false
      ) {
        count++;
      }
      if (count == productList.length - 1) {
        document.querySelector("#searchInpt + span").classList.remove("d-none");
      }
    }
  }

  displayProduct(newArr);
}
/*end search product*/

/* validation */
function setValidationState(input, isValid) {
  if (isValid) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    input.nextElementSibling.classList.add("d-none");
  } else {
    input.classList.add("is-invalid");
    input.nextElementSibling.classList.remove("d-none");
  }
}
function validation(input) {
  var regex = {
    productName: /^[A-Z][a-z]{2,}(\s[aA-zZ]{0,}(\d+)?)?$/,
    productPrice: /^(6000|[6-9][0-9]{3}|[1-5][0-9]{4}|60000)$/,
    productDesc: /^(\w|\s){0,250}$/,
    productCatagory: /(phones|smart screen|watches|Laptops)/,
    productImage: /^[^\s]+\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp)$/,
  };
  var isValid;
  if (input.type === "file") {
    if (productImage.files.length > 0) {
      isValid = regex[input.id].test(input.files[0].name);
      setValidationState(input, isValid);
      document.querySelector(".nofiles").classList.add("d-none");
    } else if (input.value === "" && !imgExistingFile) {
      isValid = false;
      document.querySelector(".nofiles").classList.remove("d-none");
    } else if (imgExistingFile) {
      isValid = true;
    }
  } else {
    isValid = regex[input.id].test(input.value);
    setValidationState(input, isValid);
  }
  return isValid;
}
function checkProductFound(productList) {
  if (productList.length > 0) {
    document.querySelector("#searchInpt + span").classList.add("d-none");
    sortProductBtn.classList.remove("d-none");
    returnBack.classList.remove("d-none");
    document.getElementById("deleteAll").classList.remove("d-none");
  } else {
    document.querySelector("#searchInpt + span").classList.remove("d-none");
    sortProductBtn.classList.add("d-none");
    returnBack.classList.add("d-none");
    document.getElementById("deleteAll").classList.add("d-none");
  }
}
/*end validation */
