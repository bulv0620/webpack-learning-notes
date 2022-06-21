import(/*webpackChunkName: "title"*/'./components/title');

const foo: string = 'foo';

const printFoo: () => void = () => {
    console.log(foo);
}

// foo = 123;

const promise: Promise<string> = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(foo);
    })
});

console.log(promise)

