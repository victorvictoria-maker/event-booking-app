export const currency_fmt = (value: any): string => {
    const result = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
    }).format(value)
    return result
}