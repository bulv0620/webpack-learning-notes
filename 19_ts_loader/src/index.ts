const foo: string = 'foo';

const printFoo: () => void = () => {
    console.log(foo);
}

const promise: Promise<string> = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(foo);
    })
});