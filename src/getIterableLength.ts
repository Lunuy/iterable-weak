function getIterableLength(iterable : Iterable<any>) {
    let length = 0;
    for(const _ of iterable) length++;
    return length;
}

export default getIterableLength;