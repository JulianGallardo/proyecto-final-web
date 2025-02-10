
interface JuzgadoInput{
    identifier: string
    name: string
    createdAt: Date
    updatedAt: Date
}

interface JuzgadoDto extends JuzgadoInput{
    id: number
}
