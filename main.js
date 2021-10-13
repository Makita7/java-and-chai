
//SHOPPING CART

const items = document.querySelector('#items');
const footer = document.querySelector('#footer-cart');
const productContainer = document.querySelector('#container-products');
let cart = {};


//Get cart info from Local Storage
document.addEventListener("DOMContentLoaded", () => {
    fetchData()
    if(localStorage.getItem('cart')){
        cart = JSON.parse(localStorage.getItem('cart'))
        paintCart()
    }
})

//To get json 
const fetchData = async () => {
    try {
        const res = await fetch('capsules.json')
        const data = await res.json()
        // console.log(data)
        paintProducts(data)
        detectButtons(data)
    } catch (error) {
        console.log(error)
    }
}

//To print out products
const paintProducts = (data) => {
    const template = document.querySelector('#template-product').content
    const fragment = document.createDocumentFragment()
    data.forEach(product => {
        template.querySelector('img').setAttribute('src', product.img)
        template.querySelector('h5').textContent = product.name
        template.querySelector('p').textContent = product.ingrediets
        template.querySelector('p span').textContent = product.price
        template.querySelector('button').dataset.id = product.id
        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })
    productContainer.appendChild(fragment)
}

// adding to cart
const detectButtons = (data) => {
    const botones = document.querySelectorAll('.card button')

    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            const product = data.find(item => item.id === parseInt(btn.dataset.id))
            product.amount = 1
            if (cart.hasOwnProperty(product.id)) {
                product.amount = cart[product.id].amount + 1
            }
            cart[product.id] = { ...product }
            paintCart()
        })
    })
}

//Printing Cart
const paintCart = () => {

    items.innerHTML = ''
    const template = document.querySelector('#template-cart').content
    const fragment = document.createDocumentFragment()

    Object.values(cart).forEach(product => {
        template.querySelector('th').textContent = product.id
        template.querySelectorAll('td')[0].textContent = product.name
        template.querySelectorAll('td')[1].textContent = product.amount
        template.querySelector('span').textContent = product.price * product.amount
        
        //buttons
        template.querySelector('.btn-info').dataset.id = product.id
        template.querySelector('.btn-danger').dataset.id = product.id

        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)

    paintFooter()
    actionButtons()

    //Save Local storage Cart information - so on reload you don't lose your purchase
    localStorage.setItem('cart',JSON.stringify(cart))
}

//Printing Footer
const paintFooter = () => {

    footer.innerHTML = ''

    if (Object.keys(cart).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Your cart is Empty</th>
        `
        return
    }

    const template = document.querySelector('#template-footer').content
    const fragment = document.createDocumentFragment()

    // Totals
    const nAmount = Object.values(cart).reduce((acc, { amount }) => acc + amount, 0)
    const nPrice = Object.values(cart).reduce((acc, {amount, price}) => acc + amount * price ,0)

    template.querySelectorAll('td')[0].textContent = nAmount
    template.querySelector('span').textContent = nPrice

    const clone = template.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    // for emptying Cart
    const boton = document.querySelector('#empty-cart')
    boton.addEventListener('click', () => {
        cart = {}
        paintCart()
    })

}


// + and - buttons
const actionButtons = () => {
    const botonesAgregar = document.querySelectorAll('#items .btn-info')
    const botonesEliminar = document.querySelectorAll('#items .btn-danger')


    botonesAgregar.forEach(btn => {
        btn.addEventListener('click', () => {
            const product = cart[btn.dataset.id]
            product.amount ++
            cart[btn.dataset.id] = { ...product }
            paintCart()
        })
    })

    botonesEliminar.forEach(btn => {
        btn.addEventListener('click', () => {
            const product = cart[btn.dataset.id]
            product.amount--
            if (product.amount === 0) {
                delete cart[btn.dataset.id]
            } else {
                cart[btn.dataset.id] = { ...product }
            }
            paintCart()
        })
    })
}

//Pay Button
const payButton = document.querySelector('#pay-btn');

payButton.addEventListener("click", payAction);
function payAction(e) {
        e.preventDefault();

    if (Object.keys(cart).length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'your cart is empty!'
        })
    }
    else{
        Swal.fire({
            title: 'Thank you for your Purchase',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        })
        cart = {}
        paintCart()
    }
}




//DARK MODE with jQuery

let darkMode;

if(localStorage.getItem("dark-mode")) {
    darkMode = localStorage.getItem("dark-mode");
} else {
    darkMode = "light"
}

localStorage.setItem("dark-mode", darkMode);


$(() => {
    if(localStorage.getItem("dark-mode") == "dark") {
        $("body").addClass("dark");
        $("#button-dark-mode").hide();
        $("#button-light-mode").show();
    } else {
        $("#button-light-mode").hide();
    }

    $("#button-dark-mode").click(() => {
        $("#button-dark-mode").hide()
        $("#button-light-mode").show();
        $("body").css({
                "background-color": "#1C1E32" ,
                "color": "#EBF2FA"
        })
        $("header").css({
            "background-color": "#4C7A90",
        })
        $("footer").css({
            "background-color": "#4C7A90",
        })
        $(".headerIcons").css({
            "fill": "#E0E2EF",
        })
        $("a").css({
            "color": "#E0E2EF",
        })
        $(".processTitle").css({
            "color": "#EBD7BB",
        })
        $(".pTitle").css({
            "color": "#EBD7BB",
        })
        $(".stepsText").css({
            "color": "#CAA374",
        })
        $(".price").css({
            "color": "#CAA374",
        })
        $(".modal-content").css({
            "background-color": "#4C7A90",
            "color": "rgb(255, 255, 255)",
        })
        $("td").css({
            "color": "rgb(255, 255, 255)",
        })
        $("th").css({
            "color": "rgb(255, 255, 255)",
        })
        localStorage.setItem("dark-mode", "dark")
    })
    $("#button-light-mode").click(() => {
        $("#button-light-mode").hide();
        $("#button-dark-mode").show();
        $("body").css({
            "background-color": "#FFFFFF" ,
            "color": "#0E121B" 
        })
        $("header").css({
            "background-color": "#A7C2CF",
        })
        $("footer").css({
            "background-color": "#A7C2CF",
        })
        $(".headerIcons").css({
            "fill": "#004466",
        })
        $("a").css({
            "color": "#004466",
        })
        $(".processTitle").css({
            "color": "#605443",
        })
        $(".pTitle").css({
            "color": "#605443",
        })
        $(".stepsText").css({
            "color": "rgb(8, 127, 136)",
        })
        $(".price").css({
            "color": "rgb(128, 128, 128)",
        })
        $(".modal-content").css({
            "background-color": "rgb(255, 255, 255)",
            "color": "#000000",
        })
        $("td").css({
            "color": "#000000",
        })
        $("th").css({
            "color": "#000000",
        })
        //$("body").removeClass("dark");
        localStorage.setItem("dark-mode", "light")
    })
    
})



//Log In

const inpEmail = document.querySelector("#email");
const inpPass = document.querySelector("#userpassword");
const btnSend = document.querySelector("#submitform");

btnSend.addEventListener("click", formSend);
function formSend(e) {
    e.preventDefault();
    console.log(inpEmail.value);
    console.log(inpPass.value);


    if (inpPass.value === '') {
        Swal.fire('password is obligatory')

    } else if (!inpEmail.value.includes("@" && ".com")) {
        Swal.fire('what you have writen is not an email',' please try again')
    }
};
