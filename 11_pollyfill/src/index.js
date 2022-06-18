import 'core-js'

const foo = () => {
    console.log('foo')
};

const baz = 'baz';

const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('foo');
    }, 1000);
})
