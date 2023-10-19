import {ChangeEvent} from "react";

interface ItemName {
    name: string
}
interface InputChar {
    event: ChangeEvent<HTMLInputElement>
}

class StringValidators {

    regExpCondition: RegExp

    constructor() {
        this.regExpCondition = /(?![a-zA-Z]|[0-9]|-|_|\.)./gm
    }

    validateItemName({ name }: ItemName ){
        return !name.match(this.regExpCondition);
    }

    validateInputValue({ event }: InputChar ){
        return !event.target.value.match(this.regExpCondition);
    }

}

const stringValidators = new StringValidators();

export {
    stringValidators
}