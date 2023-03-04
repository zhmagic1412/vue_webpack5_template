export default async function (entry, flags) {
    const { default: module } = await import(entry);
    return await module(flags);
}
