const btnSuccess = "btn-success", btnError = "btn-danger";

const min = 2, max = 9;

var already = [], answer = [];

function getExpression(limit, div) {
    let mul1, mul2, product, example, choice;
    do {
        mul1 = Math.floor(Math.random() * (limit - min + 1)) + min;
        mul2 = Math.floor(Math.random() * (max - mul1 + 1)) + mul1;
        product = mul1 * mul2;
    } while (checkIn("" + mul1 + mul2 + product));
    choice = div ? 3 : 2;
    switch (Math.floor(Math.random() * (choice)) + 1) {
        case 1:
            answer.push("" + product);
            example = "" + mul1 + " ∙ " + mul2 + " =";
            break;
        case 2:
            answer.push("" + product);
            example = "" + mul2 + " ∙ " + mul1 + " =";
            break;
        case 3:
            answer.push("" + mul2);
            example = product + " : " + mul1 + " =";
    };
    return {
        example: example, 
        answer:"", 
        btnCaption: "Проверить", 
        btnClass: "btn-outline-secondary", 
        inputDisabled: false
    }
};

function checkIn(value) {
    for (let i = 0; i < already.length; i++) {
        if (value == already[i]) {
            return true;
        };
    };
    already.push(value);
    return false;
};

function rating(err, quantity) {
    let error5 = Math.floor(err * 10 / quantity);
    let volume = 10 - error5;
    if (volume < 2) {
        volume = 2;
    };
    let result = Math.floor(volume / 2);
    if (result * 2 == volume) {
        result = "" + result;
    } else {
        result++;
        result = result + "-";
    };
    if (err > 1 && result == "5") {
        result = "5-"
    }
    return result
};

new Vue({
    el: "#app",
    data: {
        error: 0,
        rating: "",
        startCaption: "Начать",
        paramDisabled: false,
        limit: "",
        quantity: "",
        divChecked: true,
        examples: [],
    },
    computed: {
        maxQuantity: function() {
            let result = 0;
            for (let i=1;i<this.limit;i++) {
                result += 9-i;
            }
            return result;
        },
        img: function() {
            return this.rating ? "img/"+ this.rating + ".png" : "";
        }
    },
    created: function() {
        this.$nextTick(() => {
            this.$refs['limit'].focus();
        });
    },
    methods: {
        starting() {
            this.rating = "";
            this.error = 0;
            this.examples = [];
            answer = [];
            already = [];
            this.paramDisabled = true;
            if (this.limit < 2 || this.limit > 9) {this.limit = "9"};
            if (!this.quantity) {this.quantity= "10"};
            if (this.quantity > this.maxQuantity) {this.quantity = this.maxQuantity};
            this.examples.push(getExpression(this.limit, this.divChecked))
            this.$nextTick(() => {
                this.$refs['input_0'][0].focus();
            });
        },
        quantitySet() {
            this.$nextTick(() => {
                this.$refs['quantity'].focus();
            });
        },
        verify() {
            let length = this.examples.length
                last = length-1, 
                result = this.examples[last];
            if (result.answer == answer[last]) {
                result.btnClass = btnSuccess;
                result.btnCaption = "Правильно";
            } else {
                result.btnClass = btnError;
                result.btnCaption = result.example + " " + answer[last];
                this.error++;
            }
            result.inputDisabled = true;
            if (length < this.quantity) {
                this.examples.push(getExpression(this.limit, this.divChecked))
                this.$nextTick(() => {
                    this.$refs['input_'+length][0].focus();
            });
            } else {
                this.rating = rating(this.error, this.quantity);
                this.paramDisabled = false;
                this.startCaption = "Еще раз";
                this.$nextTick(() => {
                    this.$refs['limit'].focus();
                });
            }
        }
    }
});