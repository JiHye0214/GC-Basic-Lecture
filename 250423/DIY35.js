const bag = {
    price: 350,
    color: "pink",
    memory: "best seller",
}

const computer = {price, color, memory};
test.price = 3500;
test.color = "metal gray";
test.memory = "1TB";

const shoe = {
    brand : "Nike",
    model : "Air Force 1 Ultra Special Amazing",
    code : "20250423",
    color : ["brown", "black", "orange", "gold"],
    gender : "unisex",
    limited : true,
    price : 600,
}

class Shoe {
    constructor({ brand, model, code, color, gender, limited, price }) {
        this.brand = brand;
        this.model = model;
        this.code = code;
        this.color = color;
        this.gender = gender;
        this.limited = limited;
        this.price = price;
    }
}

const shoe2 = new Shoe({
    brand: "Nike",
    model: "Air Force 1 Ultra Special Amazing",
    code: "20250423",
    color: ["brown", "black", "orange", "gold"],
    gender: "unisex",
    limited: true,
    price: 600
});
