export async function drive(iter, driver) {
    let done, value, response;
    while (!done) {
        ;
        ({ done, value } = iter.next(response));
        if (value)
            response = await driver(value);
    }
    return response;
}
