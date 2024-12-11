function clear_string(str) {
    return str.trim().toLocaleLowerCase().replace(/[^A-Za-zА-Яа-я0-9]/g,'');
}

function make_same_height() {
    let names = document.getElementsByClassName("tank-name");
    let is_big = false;
    let max_height = 0;

    for (let i = 0; i < names.length; i++) {
        if (names[i].offsetWidth >= names[i].parentNode.offsetWidth-20) {
            is_big = true;
            break;
        }
    }

    if (is_big) {
        for (let i = 0; i < names.length; i++) {
            max_height = Math.max(max_height, names[i].scrollHeight);
        }

        for (let i = 0; i < names.length; i++) {
            names[i].style.height = `${max_height}px`;
        }
    } else {
        for (let i = 0; i < names.length; i++) {
            names[i].style.height = `fit-content`;
        }
    }
}

let TANKS_LIST = []
let TANKS_NAMES = ["WZ-120G FT",
                   "T54 Heavy Tank",
                    "leKpz M 41 90 mm",
                    "Centurion Mk. 5/1",
                    "Panzer 58",
                    "T25 Pilot Number 1",
                    "Skoda T 27",
                    "M-IV-Y",
                    "Кировец-1",
                    "Strv 81",
                    "GSOR 1010 FB",
                    "Chieftain/T95"]
let TANKS_SEARCH_ELEMENTS = []
let ORDERED_TANKS = []
let TANKS_PRICE = [2769, 2850, 1599, 1755, 1155, 1680, 1250, 1755, 1850, 1950, 1655, 2399]

document.addEventListener("DOMContentLoaded", () => {
    for (let i = 0; i < document.getElementsByClassName("cart_element").length; i++) {
        TANKS_LIST.push(document.getElementsByClassName("cart_element")[i]);
        TANKS_SEARCH_ELEMENTS.push(0);
        ORDERED_TANKS.push(0);
    }

    let sort_buttons = document.getElementsByClassName("sort_button");
    for (i = 0; i < sort_buttons.length; i++) {

        sort_buttons[i].addEventListener("click", (event) => {
            let sort_type = event.target.value;
            let elements = document.getElementsByClassName("cart_element")

            let new_elements = [];

            if (sort_type.includes("name")) {
                for (let i = 0; i < elements.length; i++) {
                    new_elements[elements[i].getElementsByTagName("h2")[0].innerText.toLocaleLowerCase()] = elements[i];
                }
            } else {
                for (let i = 0; i < elements.length; i++) {
                    let price_value = parseInt(elements[i].getElementsByClassName("description")[1].innerText.replace(/\D/g,''));
                    new_elements.push([price_value, elements[i]]);
                }
            }

            switch (sort_type) {
                case "name_1":
                    new_elements = Object.entries(new_elements).sort();
                    break;
                case "name_2":
                    new_elements = Object.entries(new_elements).sort().reverse();
                    break;
                case "price_1":
                    new_elements.sort(function(a, b) {
                        return b[0] - a[0];
                    });
                    break;
                case "price_2":
                    new_elements.sort(function(a, b) {
                        return a[0] - b[0];
                    });
                    break;
            }
                
            let new_html = "";
            let old_inputs = [];

            for (let i = 0; i < new_elements.length; i++) {
                let index = parseInt(new_elements[i][1].getElementsByTagName("input")[0].value);
                old_inputs.push(ORDERED_TANKS[index]);
                new_html += '<li class="col-md-3 cart_element m-0">' + new_elements[i][1].innerHTML + '</li>';
            }

            document.getElementById("shopping_cart").innerHTML = new_html;

            for (let i = 0; i < old_inputs.length; i++) {
                document.getElementsByClassName("cart_element")[i].getElementsByTagName("input")[1].value = old_inputs[i];
            }

            set_listeners();
        });
    }

    document.getElementById("search_input").addEventListener("keyup", (event) => {
        let search_value = clear_string(document.getElementById("search_input").value);

        let new_html = "";
        let old_inputs = [];

        for (let i = 0; i < TANKS_LIST.length; i++) {
            let tank_name = clear_string(TANKS_LIST[i].getElementsByTagName("h2")[0].innerText);
            let tank_description = clear_string(TANKS_LIST[i].getElementsByClassName("description")[0].innerText);

            if (tank_name.includes(search_value) || tank_description.includes(search_value)) {
                let index = parseInt(TANKS_LIST[i].getElementsByTagName("input")[0].value);
                old_inputs.push(ORDERED_TANKS[index]);
                new_html += '<li class="col-md-3 cart_element m-0">' + TANKS_LIST[i].innerHTML + '</li>';
            }
        }

        document.getElementById("shopping_cart").innerHTML = new_html;

        for (let i = 0; i < old_inputs.length; i++) {
            document.getElementsByClassName("cart_element")[i].getElementsByTagName("input")[1].value = old_inputs[i];
        }

        set_listeners();
    });

    set_listeners();
    make_same_height();
});

function set_listeners() {
    for (let i = 0; i < document.querySelectorAll('input[name="amount"]').length; i++) {
        document.querySelectorAll('input[name="amount"]')[i].onchange = function() {
            if (!document.querySelectorAll('input[name="amount"]')[i].value) {
                document.querySelectorAll('input[name="amount"]')[i].value = 0;
            }

            let input_id = document.querySelectorAll('input[name="amount"]')[i].parentNode.parentNode.parentNode.getElementsByTagName("input")[0].value;
            let count = parseInt(document.querySelectorAll('input[name="amount"]')[i].value);

            ORDERED_TANKS[input_id] = count;
            let total_ordered_tanks = ORDERED_TANKS.reduce((a, b) => a + b, 0);
            let total_price = 0;

            let order_list = [];
            
            for (let j = 0; j < ORDERED_TANKS.length; j++) {
                total_price += ORDERED_TANKS[j] * TANKS_PRICE[j];
                if (ORDERED_TANKS[j] > 0) {
                    order_list.push([TANKS_NAMES[j], ORDERED_TANKS[j], ORDERED_TANKS[j] * TANKS_PRICE[j]]);
                }
            }

            let new_html = "";
            
            if (total_ordered_tanks >= 1) {
                for (let j = 0; j < order_list.length; j++ ) {
                    new_html += `<li>${order_list[j][0]} <label>(x${order_list[j][1]})</label> = <label>${order_list[j][2]} ₽</label></li>`;
                }
            } else {
                new_html += `<li>Пока что ничего не добавлено</li>`;
            }

            document.getElementsByClassName("order_value")[0].innerText = total_ordered_tanks;
            document.getElementsByClassName("order_value")[1].innerText = total_price + " ₽";
            document.getElementById("order-list").innerHTML = new_html;
        }
    };
}

window.onresize = make_same_height;